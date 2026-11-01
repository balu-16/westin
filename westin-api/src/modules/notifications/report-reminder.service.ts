import { Injectable, Logger, type OnApplicationBootstrap, type OnApplicationShutdown } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { kolkataNow } from '../../common/util/time';
import { NotificationsService } from './notifications.service';

/** Fire window per reminder — generous so event-loop drift can't skip a slot. */
const FIRE_WINDOW_MINUTES = 5;

/**
 * Scheduler for the daily-report reminder. At 20:00 IST it warns "4 hours
 * left", at 21:00 IST "3 hours left" (deadline is midnight, matching the
 * same-day rules for attendance and daily reports). Faculty with every
 * today-slot already reported — or no slots at all (Sunday) — resolve to
 * nobody and get nothing.
 *
 * Exactly-once per slot is claimed in the database (reminder_fired table),
 * so multiple instances can never double-send. Locally a 60s wall-clock
 * interval drives it; on Vercel (where timers are frozen between requests)
 * the /api/cron/report-reminder endpoint is driven by vercel.json crons at
 * 20:00/21:00 IST instead.
 */
const REMINDER_SLOTS: ReadonlyArray<{ minuteOfDay: number; hoursLeft: number }> = [
  { minuteOfDay: 20 * 60, hoursLeft: 4 },
  { minuteOfDay: 21 * 60, hoursLeft: 3 },
];

@Injectable()
export class ReportReminderService implements OnApplicationBootstrap, OnApplicationShutdown {
  private readonly logger = new Logger(ReportReminderService.name);
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private db: DatabaseService,
    private notifications: NotificationsService,
  ) {}

  onApplicationBootstrap() {
    // On Vercel the instance is frozen between requests, so a wall-clock
    // interval fires unpredictably (or never); the cron endpoint takes over.
    if (process.env.VERCEL === '1') return;
    this.timer = setInterval(() => this.tick(), 60_000);
  }

  onApplicationShutdown() {
    if (this.timer) clearInterval(this.timer);
  }

  private tick() {
    try {
      const { todayDow, minutes, today } = kolkataNow();
      if (todayDow < 0) return; // Sunday — no timetable slots exist
      for (const slot of REMINDER_SLOTS) {
        const inWindow = minutes >= slot.minuteOfDay && minutes < slot.minuteOfDay + FIRE_WINDOW_MINUTES;
        if (inWindow) {
          void this.fireSlot(slot.hoursLeft, todayDow, today).catch((err) =>
            this.logger.error(`daily-report reminder (${slot.hoursLeft}h) failed: ${(err as Error).message}`),
          );
        }
      }
    } catch (err) {
      this.logger.error(`reminder tick failed: ${(err as Error).message}`);
    }
  }

  /** Cron entrypoint (Vercel Cron at 20:00/21:00 IST). The slot is matched by
   *  containing hour so the 21:00 invocation can never match the (already
   *  claimed) 20:00 slot; the DB claim makes repeated or concurrent
   *  invocations safe no-ops. */
  async runDueSlot(): Promise<{ ran: boolean; hoursLeft?: number; sentTo?: number }> {
    const { todayDow, minutes, today } = kolkataNow();
    if (todayDow < 0) return { ran: false };
    const slot = REMINDER_SLOTS.find((s) => minutes >= s.minuteOfDay && minutes < s.minuteOfDay + 60);
    if (!slot) return { ran: false };
    const sentTo = await this.fireSlot(slot.hoursLeft, todayDow, today);
    return { ran: true, hoursLeft: slot.hoursLeft, sentTo };
  }

  /** Claim the slot in the DB, then remind. Returns faculty messaged, or -1
   *  when the slot was already claimed (by any instance). */
  private async fireSlot(hoursLeft: number, todayDow: number, today: string): Promise<number> {
    const key = `${today}:${hoursLeft}`;
    const claimed = await this.db.query<{ key: string }>(
      `insert into reminder_fired (key) values ($1) on conflict (key) do nothing returning key`,
      [key],
    );
    if (claimed.length === 0) return -1;
    // Yesterday's claims are dead weight — drop them opportunistically.
    await this.db
      .query(`delete from reminder_fired where fired_at < now() - interval '2 days'`)
      .catch(() => {});
    return this.remindPendingFaculty(hoursLeft, todayDow, today);
  }

  /** Faculty (with their still-unreported subjects) for a given day — read-only. */
  async pendingFaculty(todayDow: number, today: string): Promise<Array<{ id: string; pending: string[] }>> {
    return this.db.query<{ id: string; pending: string[] }>(
      `select u.id, array_agg(distinct sub.name || ' (' || sec.label || ')') as pending
         from timetable_slots t
         join users u on u.id = t.faculty_id and u.role='faculty' and u.status='active'
         join subjects sub on sub.id = t.subject_id
         join sections sec on sec.id = t.section_id
        where t.day = $1
          and not exists (
            select 1 from daily_reports r
             where r.faculty_id = t.faculty_id
               and r.section_id = t.section_id
               and r.subject_id = t.subject_id
               and r.report_date = $2::date
          )
        group by u.id`,
      [todayDow, today],
    );
  }

  /** Push the reminder to every active faculty with at least one unreported slot today. */
  async remindPendingFaculty(hoursLeft: number, todayDow: number, today: string): Promise<number> {
    const rows = await this.pendingFaculty(todayDow, today);
    if (rows.length === 0) return 0;

    // One personalized send per faculty (their own pending subjects); this is a
    // background 8PM blast, so sequential sends are fine at this scale.
    for (const row of rows) {
      const listed = row.pending.slice(0, 3).join(', ') + (row.pending.length > 3 ? '…' : '');
      await this.notifications.sendSystem({
        kind: 'report_reminder',
        title: 'Daily Report Reminder',
        message:
          `Only ${hoursLeft} hour${hoursLeft === 1 ? '' : 's'} left to submit today's daily report` +
          `${listed ? ` (${listed})` : ''}. Please upload it before midnight.`,
        recipients: [{ id: row.id, role: 'faculty' }],
      });
    }
    this.logger.log(`daily-report reminder (${hoursLeft}h left) pushed to ${rows.length} faculty`);
    return rows.length;
  }
}
