import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import crypto from 'node:crypto';
import { DatabaseService } from '../../database/database.service';
import {
  AddWebsiteEnquiryNoteDto,
  CreateWebsiteEnquiryDto,
  UpdateWebsiteEnquiryDto,
  WebsiteEnquiryQueryDto,
} from './dto';

type EnquiryRow = {
  id: string;
  reference: string;
  category: string;
  name: string;
  email: string | null;
  phone: string | null;
  program_slug: string | null;
  message: string;
  consent_at: Date | string;
  status: string;
  created_at: Date | string;
  updated_at: Date | string;
};

type ActivityRow = {
  id: string;
  actor_user_id: string | null;
  action: string;
  note: string | null;
  created_at: Date | string;
};

@Injectable()
export class EnquiriesService {
  constructor(private db: DatabaseService) {}

  async create(dto: CreateWebsiteEnquiryDto, idempotencyKey: string) {
    if (process.env.PUBLIC_ENQUIRIES_ENABLED !== 'true') {
      throw new ServiceUnavailableException('The enquiry form is temporarily unavailable');
    }
    const key = idempotencyKey.trim();
    if (key.length < 8 || key.length > 120) {
      throw new BadRequestException('Idempotency-Key must be 8-120 characters');
    }
    const existing = await this.db.queryOne<EnquiryRow>(
      'select id, reference, category, name, email, phone, program_slug, message,\n' +
        '       consent_at, status, created_at, updated_at\n' +
        '  from website_enquiries\n' +
        ' where idempotency_key = $1',
      [key],
    );
    if (existing) return publicAccepted(existing, true);

    if (dto.website?.trim()) {
      // Keep the bot response indistinguishable from an accepted submission.
      return { accepted: true, reference: null, status: 'received', duplicate: false };
    }
    if (dto.consent !== true) throw new BadRequestException('Consent is required');

    const email = dto.email?.trim().toLowerCase() || null;
    const phone = normalizePhone(dto.phone);
    if (!email && !phone) throw new BadRequestException('Email or phone is required');
    if (phone && phone.replace(/\D/g, '').length < 7) {
      throw new BadRequestException('Phone number is too short');
    }

    const reference = this.newReference();
    try {
      const row = await this.db.queryOne<EnquiryRow>(
        'insert into website_enquiries\n' +
          '  (reference, category, name, email, phone, program_slug, message, consent_at, idempotency_key)\n' +
          'values ($1, $2, $3, $4, $5, $6, $7, now(), $8)\n' +
          'returning id, reference, category, name, email, phone, program_slug, message,\n' +
          '          consent_at, status, created_at, updated_at',
        [
          reference,
          dto.category,
          dto.name.trim(),
          email,
          phone,
          dto.programSlug?.trim() || null,
          dto.message.trim(),
          key,
        ],
      );
      if (!row) throw new Error('Enquiry insert returned no row');
      await this.db.query(
        'insert into website_enquiry_activity (enquiry_id, action, note)\n' +
          'values ($1::uuid, $2, $3)',
        [row.id, 'created', null],
      );
      return publicAccepted(row, false);
    } catch (error) {
      if (isUniqueViolation(error)) {
        const duplicate = await this.db.queryOne<EnquiryRow>(
          'select id, reference, category, name, email, phone, program_slug, message,\n' +
            '       consent_at, status, created_at, updated_at\n' +
            '  from website_enquiries\n' +
            ' where idempotency_key = $1',
          [key],
        );
        if (duplicate) return publicAccepted(duplicate, true);
      }
      throw error;
    }
  }

  async list(query: WebsiteEnquiryQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 25;
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (query.status) {
      params.push(query.status);
      conditions.push('status = $' + params.length);
    }
    if (query.q?.trim()) {
      params.push('%' + query.q.trim() + '%');
      const index = params.length;
      conditions.push(
        '(reference ilike $' + index + ' or name ilike $' + index + ' or email ilike $' + index + ' or phone ilike $' +
          index +
          ')',
      );
    }
    const where = conditions.length ? ' where ' + conditions.join(' and ') : '';
    const count = await this.db.queryOne<{ total: string }>(
      'select count(*) as total from website_enquiries' + where,
      params,
    );
    const rows = await this.db.query<EnquiryRow>(
      'select id, reference, category, name, email, phone, program_slug, message,\n' +
        '       consent_at, status, created_at, updated_at\n' +
        '  from website_enquiries' +
        where +
        ' order by created_at desc, id desc\n' +
        ' limit $' +
        (params.length + 1) +
        ' offset $' +
        (params.length + 2),
      [...params, pageSize, (page - 1) * pageSize],
    );
    const total = Number(count?.total ?? 0);
    return {
      items: rows.map(mapEnquiry),
      pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
    };
  }

  async detail(id: string) {
    const enquiry = await this.find(id);
    const activity = await this.db.query<ActivityRow>(
      'select id, actor_user_id, action, note, created_at\n' +
        '  from website_enquiry_activity\n' +
        ' where enquiry_id = $1::uuid\n' +
        ' order by created_at desc, id desc',
      [id],
    );
    return {
      ...mapEnquiry(enquiry),
      activity: activity.map((row) => ({
        id: row.id,
        actorUserId: row.actor_user_id,
        action: row.action,
        note: row.note,
        createdAt: toIso(row.created_at),
      })),
    };
  }

  async updateStatus(id: string, dto: UpdateWebsiteEnquiryDto, userId: string) {
    const row = await this.db.queryOne<EnquiryRow>(
      'update website_enquiries\n' +
        '   set status = $1, updated_at = now()\n' +
        ' where id = $2::uuid\n' +
        'returning id, reference, category, name, email, phone, program_slug, message,\n' +
        '          consent_at, status, created_at, updated_at',
      [dto.status, id],
    );
    if (!row) throw new NotFoundException('Website enquiry not found');
    await this.db.query(
      'insert into website_enquiry_activity (enquiry_id, actor_user_id, action, note)\n' +
        'values ($1::uuid, $2, $3, $4)',
      [id, userId, 'status-changed', dto.status],
    );
    return this.detail(id);
  }

  async addNote(id: string, dto: AddWebsiteEnquiryNoteDto, userId: string) {
    await this.find(id);
    await this.db.query(
      'insert into website_enquiry_activity (enquiry_id, actor_user_id, action, note)\n' +
        'values ($1::uuid, $2, $3, $4)',
      [id, userId, 'note-added', dto.note.trim()],
    );
    return this.detail(id);
  }

  private async find(id: string) {
    const row = await this.db.queryOne<EnquiryRow>(
      'select id, reference, category, name, email, phone, program_slug, message,\n' +
        '       consent_at, status, created_at, updated_at\n' +
        '  from website_enquiries\n' +
        ' where id = $1::uuid',
      [id],
    );
    if (!row) throw new NotFoundException('Website enquiry not found');
    return row;
  }

  private newReference() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return 'WST-' + date + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
  }
}

function publicAccepted(row: EnquiryRow, duplicate: boolean) {
  return {
    accepted: true,
    reference: row.reference,
    status: row.status,
    receivedAt: toIso(row.created_at),
    duplicate,
  };
}

function mapEnquiry(row: EnquiryRow) {
  return {
    id: row.id,
    reference: row.reference,
    category: row.category,
    name: row.name,
    email: row.email,
    phone: row.phone,
    programSlug: row.program_slug,
    message: row.message,
    consentAt: toIso(row.consent_at),
    status: row.status,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

function normalizePhone(value?: string) {
  if (!value) return null;
  const normalized = value.trim().replace(/[^\d+]/g, '');
  return normalized || null;
}

function toIso(value: Date | string) {
  return new Date(value).toISOString();
}

function isUniqueViolation(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && (error as { code?: string }).code === '23505');
}
