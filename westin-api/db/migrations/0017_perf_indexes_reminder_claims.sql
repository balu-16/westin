-- 0017: hot-path indexes + persistent reminder claim table (additive only).

-- Faculty dashboard counts sessions per marker per day on every load
-- (faculty.service markedToday); without this the daily-growing sessions
-- table is scanned.
create index if not exists idx_att_sessions_marked_by
  on attendance_sessions (marked_by, session_date desc);

-- Admin report listing filters by section (reports.service listAdmin).
create index if not exists idx_daily_reports_section
  on daily_reports (section_id, report_date desc);

-- Exactly-once claim for the daily-report reminder, shared by every
-- instance (in-process Sets cannot survive serverless freezing).
-- Keyed by `<today>:<hoursLeft>`; rows are pruned after 2 days.
create table if not exists reminder_fired (
  key text primary key,
  fired_at timestamptz not null default now()
);
