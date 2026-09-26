import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import crypto from 'node:crypto';
import { CacheService } from '../../common/cache/cache.service';
import { DatabaseService } from '../../database/database.service';
import { BUCKETS, StorageService } from '../storage/storage.service';
import {
  CreateWebsiteEntryDto,
  FinalizeWebsiteMediaDto,
  MediaUploadUrlDto,
  UpdateWebsiteSettingDto,
  UpdateWebsiteEntryDto,
  WEBSITE_MEDIA_MAX_BYTES,
  WebsiteContentQueryDto,
} from './dto';

const PUBLIC_CACHE_MS = 60_000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const WEBSITE_PATH_RE = /^website\/[a-zA-Z0-9/_-]+$/;

type ContentRecord = Record<string, unknown>;

type PublishedRow = {
  id: string;
  entry_type: string;
  slug: string;
  content: ContentRecord;
  seo: ContentRecord;
  published_at: Date | string;
};

type MediaRow = {
  id: string;
  entry_id: string | null;
  revision_id: string | null;
  storage_path: string;
  mime_type: string;
  size_bytes: string | number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  focal_x: number | string | null;
  focal_y: number | string | null;
  sort_order: number;
  status: string;
};

type AdminEntryRow = {
  id: string;
  entry_type: string;
  slug: string;
  draft_revision_id: string | null;
  published_revision_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  draft_revision_number: number | null;
  published_revision_number: number | null;
  revision_count: string | number;
};

@Injectable()
export class WebsiteService {
  private readonly logger = new Logger(WebsiteService.name);
  private websiteBucketReady: Promise<void> | null = null;

  constructor(
    private db: DatabaseService,
    private cache: CacheService,
    private storage: StorageService,
  ) {}

  async publicSite() {
    return this.cache.wrap('website:site', PUBLIC_CACHE_MS, async () => {
      const [settingRows, entryRows] = await Promise.all([
        this.db.query<{ setting_key: string; value: unknown }>(
          'select setting_key, value\n' +
            '  from website_settings\n' +
            ' order by setting_key asc',
        ),
        this.db.query<PublishedRow>(
          'select e.id, e.entry_type, e.slug, r.content, r.seo, r.published_at\n' +
            '  from website_entries e\n' +
            '  join website_revisions r on r.id = e.published_revision_id\n' +
            ' order by e.entry_type asc, e.slug asc\n' +
            ' limit 200',
        ),
      ]);

      return {
        settings: Object.fromEntries(settingRows.map((row) => [row.setting_key, row.value])),
        entries: await this.hydratePublished(entryRows),
      };
    });
  }

  async listPublic(query: WebsiteContentQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const { where, params } = this.publicFilter(query);
    const count = await this.db.queryOne<{ total: string }>(
      'select count(*) as total\n' +
        '  from website_entries e\n' +
        '  join website_revisions r on r.id = e.published_revision_id\n' +
        where,
      params,
    );
    const rows = await this.db.query<PublishedRow>(
      'select e.id, e.entry_type, e.slug, r.content, r.seo, r.published_at\n' +
        '  from website_entries e\n' +
        '  join website_revisions r on r.id = e.published_revision_id\n' +
        where +
        ' order by r.published_at desc nulls last, e.slug asc\n' +
        ' limit $' +
        (params.length + 1) +
        ' offset $' +
        (params.length + 2),
      [...params, pageSize, (page - 1) * pageSize],
    );

    const total = Number(count?.total ?? 0);
    return {
      items: await this.hydratePublished(rows),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  }

  async getPublic(entryType: string, slug: string) {
    if (!/^[a-z-]+$/.test(entryType) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new NotFoundException('Published page not found');
    }
    const row = await this.db.queryOne<PublishedRow>(
      'select e.id, e.entry_type, e.slug, r.content, r.seo, r.published_at\n' +
        '  from website_entries e\n' +
        '  join website_revisions r on r.id = e.published_revision_id\n' +
        ' where e.entry_type = $1\n' +
        '   and e.slug = $2',
      [entryType, slug],
    );
    if (!row) throw new NotFoundException('Published page not found');
    const mapped = await this.hydratePublished([row]);
    return mapped[0];
  }

  async searchPublic(query: WebsiteContentQueryDto) {
    const normalized = {
      ...query,
      q: query.q?.trim(),
      page: query.page ?? 1,
      pageSize: Math.min(query.pageSize ?? 20, 50),
    };
    return this.listPublic(normalized);
  }

  async listAdmin() {
    const rows = await this.db.query<AdminEntryRow>(this.adminEntrySql());
    return { items: rows.map(mapAdminEntry) };
  }

  async listSettingsAdmin() {
    const rows = await this.db.query<{
      setting_key: string;
      value: ContentRecord;
      schema_version: number;
      updated_by: string | null;
      updated_at: Date | string;
    }>(
      'select setting_key, value, schema_version, updated_by, updated_at\n' +
        '  from website_settings\n' +
        ' order by setting_key asc',
    );
    return {
      items: rows.map((row) => ({
        key: row.setting_key,
        value: row.value,
        schemaVersion: row.schema_version,
        updatedBy: row.updated_by,
        updatedAt: toIso(row.updated_at),
      })),
    };
  }

  async saveSetting(key: string, dto: UpdateWebsiteSettingDto, userId: string) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key) || key.length > 80) {
      throw new BadRequestException('Setting key must use lowercase letters, numbers, and hyphens');
    }
    assertSafeObject(dto.value, 'value');
    await this.db.query(
      'insert into website_settings (setting_key, value, updated_by, updated_at)\n' +
        'values ($1, $2::jsonb, $3, now())\n' +
        'on conflict (setting_key) do update set value = excluded.value,\n' +
        '  schema_version = website_settings.schema_version + 1,\n' +
        '  updated_by = excluded.updated_by,\n' +
        '  updated_at = now()',
      [key, dto.value, userId],
    );
    this.cache.invalidate('website');
    return this.listSettingsAdmin();
  }

  async getAdmin(entryId: string) {
    this.assertUuid(entryId, 'entry id');
    const entry = await this.db.queryOne<AdminEntryRow>(
      this.adminEntrySql() + ' where e.id = $1::uuid',
      [entryId],
    );
    if (!entry) throw new NotFoundException('Website entry not found');

    const revisions = await this.db.query<{
      id: string;
      revision_number: number;
      schema_version: number;
      content: ContentRecord;
      seo: ContentRecord;
      created_by: string | null;
      created_at: Date | string;
      published_at: Date | string | null;
      unpublished_at: Date | string | null;
    }>(
      'select id, revision_number, schema_version, content, seo, created_by,\n' +
        '       created_at, published_at, unpublished_at\n' +
        '  from website_revisions\n' +
        ' where entry_id = $1::uuid\n' +
        ' order by revision_number desc',
      [entryId],
    );
    return {
      ...mapAdminEntry(entry),
      revisions: revisions.map((revision) => ({
        id: revision.id,
        revisionNumber: revision.revision_number,
        schemaVersion: revision.schema_version,
        content: revision.content,
        seo: revision.seo,
        createdBy: revision.created_by,
        createdAt: toIso(revision.created_at),
        publishedAt: revision.published_at ? toIso(revision.published_at) : null,
        unpublishedAt: revision.unpublished_at ? toIso(revision.unpublished_at) : null,
      })),
    };
  }

  async create(dto: CreateWebsiteEntryDto, userId: string) {
    assertSafeObject(dto.content, 'content');
    assertSafeObject(dto.seo ?? {}, 'seo');
    try {
      const entryId = await this.db.tx(async (client) => {
        const entry = await client.query<{ id: string }>(
          'insert into website_entries (entry_type, slug, created_by, updated_by)\n' +
            'values ($1, $2, $3, $3)\n' +
            'returning id',
          [dto.entryType, dto.slug, userId],
        );
        const id = entry.rows[0]?.id;
        if (!id) throw new Error('Website entry insert returned no id');
        const revision = await client.query<{ id: string }>(
          'insert into website_revisions\n' +
            '  (entry_id, revision_number, content, seo, created_by)\n' +
            'values ($1::uuid, 1, $2::jsonb, $3::jsonb, $4)\n' +
            'returning id',
          [id, dto.content, dto.seo ?? {}, userId],
        );
        await client.query(
          'update website_entries\n' +
            '   set draft_revision_id = $1::uuid,\n' +
            '       updated_at = now()\n' +
            ' where id = $2::uuid',
          [revision.rows[0].id, id],
        );
        return id;
      });
      this.cache.invalidate('website');
      return this.getAdmin(entryId);
    } catch (error) {
      if (isUniqueViolation(error)) throw new ConflictException('A website entry with that slug already exists');
      throw error;
    }
  }

  async saveDraft(entryId: string, dto: UpdateWebsiteEntryDto, userId: string) {
    this.assertUuid(entryId, 'entry id');
    if (dto.content !== undefined) assertSafeObject(dto.content, 'content');
    if (dto.seo !== undefined) assertSafeObject(dto.seo, 'seo');

    try {
      await this.db.tx(async (client) => {
        const entry = await client.query<{
          slug: string;
          draft_revision_id: string | null;
        }>(
          'select slug, draft_revision_id\n' +
            '  from website_entries\n' +
            ' where id = $1::uuid\n' +
            ' for update',
          [entryId],
        );
        if (!entry.rows[0]) throw new NotFoundException('Website entry not found');

        const previous = entry.rows[0].draft_revision_id
          ? await client.query<{ content: ContentRecord; seo: ContentRecord }>(
              'select content, seo\n' +
                '  from website_revisions\n' +
                ' where id = $1::uuid',
              [entry.rows[0].draft_revision_id],
            )
          : { rows: [] as Array<{ content: ContentRecord; seo: ContentRecord }> };
        const content = dto.content ?? previous.rows[0]?.content ?? {};
        const seo = dto.seo ?? previous.rows[0]?.seo ?? {};
        const nextRevision = await client.query<{ next_revision: number }>(
          'select coalesce(max(revision_number), 0) + 1 as next_revision\n' +
            '  from website_revisions\n' +
            ' where entry_id = $1::uuid',
          [entryId],
        );
        const revision = await client.query<{ id: string }>(
          'insert into website_revisions\n' +
            '  (entry_id, revision_number, content, seo, created_by)\n' +
            'values ($1::uuid, $2, $3::jsonb, $4::jsonb, $5)\n' +
            'returning id',
          [entryId, Number(nextRevision.rows[0]?.next_revision ?? 1), content, seo, userId],
        );
        await client.query(
          'update website_entries\n' +
            '   set slug = coalesce($1, slug),\n' +
            '       draft_revision_id = $2::uuid,\n' +
            '       updated_by = $3,\n' +
            '       updated_at = now()\n' +
            ' where id = $4::uuid',
          [dto.slug ?? null, revision.rows[0].id, userId, entryId],
        );
      });
      this.cache.invalidate('website');
      return this.getAdmin(entryId);
    } catch (error) {
      if (isUniqueViolation(error)) throw new ConflictException('A website entry with that slug already exists');
      throw error;
    }
  }

  async publish(entryId: string, revisionId: string, userId: string) {
    this.assertUuid(entryId, 'entry id');
    this.assertUuid(revisionId, 'revision id');
    await this.db.tx(async (client) => {
      const revision = await client.query<{ id: string }>(
        'select id\n' +
          '  from website_revisions\n' +
          ' where id = $1::uuid\n' +
          '   and entry_id = $2::uuid',
        [revisionId, entryId],
      );
      if (!revision.rows[0]) throw new NotFoundException('Website revision not found');
      const entry = await client.query<{ id: string }>(
        'select id from website_entries where id = $1::uuid for update',
        [entryId],
      );
      if (!entry.rows[0]) throw new NotFoundException('Website entry not found');

      await client.query(
        'update website_media\n' +
          "   set status = 'archived'\n" +
          ' where entry_id = $1::uuid\n' +
          "   and status = 'published'",
        [entryId],
      );
      await client.query(
        'update website_media\n' +
          "   set status = 'published'\n" +
          ' where entry_id = $1::uuid\n' +
          '   and revision_id = $2::uuid',
        [entryId, revisionId],
      );
      await client.query(
        'update website_entries\n' +
          '   set published_revision_id = $1::uuid,\n' +
          '       updated_by = $2,\n' +
          '       updated_at = now()\n' +
          ' where id = $3::uuid',
        [revisionId, userId, entryId],
      );
      await client.query(
        'update website_revisions\n' +
          '   set published_at = now(), unpublished_at = null\n' +
          ' where id = $1::uuid',
        [revisionId],
      );
    });
    this.cache.invalidate('website');
    return this.getAdmin(entryId);
  }

  async unpublish(entryId: string, userId: string) {
    this.assertUuid(entryId, 'entry id');
    await this.db.tx(async (client) => {
      const entry = await client.query<{ published_revision_id: string | null }>(
        'select published_revision_id\n' +
          '  from website_entries\n' +
          ' where id = $1::uuid\n' +
          ' for update',
        [entryId],
      );
      if (!entry.rows[0]) throw new NotFoundException('Website entry not found');
      const revisionId = entry.rows[0].published_revision_id;
      await client.query(
        'update website_entries\n' +
          '   set published_revision_id = null,\n' +
          '       updated_by = $1,\n' +
          '       updated_at = now()\n' +
          ' where id = $2::uuid',
        [userId, entryId],
      );
      if (revisionId) {
        await client.query(
          'update website_revisions\n' +
            '   set unpublished_at = now()\n' +
            ' where id = $1::uuid',
          [revisionId],
        );
      }
      await client.query(
        'update website_media\n' +
          "   set status = 'archived'\n" +
          ' where entry_id = $1::uuid\n' +
          "   and status = 'published'",
        [entryId],
      );
    });
    this.cache.invalidate('website');
    return this.getAdmin(entryId);
  }

  async restoreDraft(entryId: string, revisionId: string, userId: string) {
    this.assertUuid(entryId, 'entry id');
    this.assertUuid(revisionId, 'revision id');
    const row = await this.db.queryOne<{ id: string }>(
      'select id\n' +
        '  from website_revisions\n' +
        ' where id = $1::uuid\n' +
        '   and entry_id = $2::uuid',
      [revisionId, entryId],
    );
    if (!row) throw new NotFoundException('Website revision not found');
    await this.db.query(
      'update website_entries\n' +
        '   set draft_revision_id = $1::uuid,\n' +
        '       updated_by = $2,\n' +
        '       updated_at = now()\n' +
        ' where id = $3::uuid',
      [revisionId, userId, entryId],
    );
    this.cache.invalidate('website');
    return this.getAdmin(entryId);
  }

  async uploadUrl(dto: MediaUploadUrlDto) {
    const contentType = dto.contentType.trim().toLowerCase();
    assertMediaLimit(contentType, dto.sizeBytes);
    await this.ensureWebsiteBucket();
    const extension = dto.filename.toLowerCase().match(/\.[a-z0-9]{1,8}$/)?.[0] ?? '';
    const basename = dto.filename.slice(0, Math.max(0, dto.filename.length - extension.length));
    const safeName = slugify(basename).slice(0, 80) || 'asset';
    const date = new Date().toISOString().slice(0, 10);
    const storagePath = 'website/' + date + '/' + crypto.randomUUID() + '-' + safeName + extension;
    const signed = await this.storage.signedUploadUrl(BUCKETS.websiteMedia, storagePath);
    return {
      bucket: BUCKETS.websiteMedia,
      path: storagePath,
      url: signed.url,
      token: signed.token,
      expiresIn: 600,
    };
  }

  async finalizeMedia(dto: FinalizeWebsiteMediaDto, userId: string) {
    this.assertUuid(dto.entryId, 'entry id');
    if (!WEBSITE_PATH_RE.test(dto.storagePath) || dto.storagePath.includes('..')) {
      throw new BadRequestException('storagePath must be a website upload path');
    }
    const contentType = dto.mimeType.trim().toLowerCase();
    assertMediaLimit(contentType, dto.sizeBytes);
    const entry = await this.db.queryOne<{ published_revision_id: string | null }>(
      'select published_revision_id\n' +
        '  from website_entries\n' +
        ' where id = $1::uuid',
      [dto.entryId],
    );
    if (!entry) throw new NotFoundException('Website entry not found');

    let status = 'draft';
    if (dto.revisionId) {
      this.assertUuid(dto.revisionId, 'revision id');
      const revision = await this.db.queryOne<{ id: string }>(
        'select id\n' +
          '  from website_revisions\n' +
          ' where id = $1::uuid\n' +
          '   and entry_id = $2::uuid',
        [dto.revisionId, dto.entryId],
      );
      if (!revision) throw new NotFoundException('Website revision not found');
      status = entry.published_revision_id === dto.revisionId ? 'published' : 'draft';
    }

    const head = await this.storage.headObject(BUCKETS.websiteMedia, dto.storagePath);
    if (!head.exists) throw new BadRequestException('Uploaded object not found — re-upload the file');
    const actualSize = head.size ?? dto.sizeBytes;
    assertMediaLimit(contentType, actualSize);
    if (head.contentType && head.contentType.toLowerCase() !== contentType) {
      throw new BadRequestException('Uploaded object content type does not match the declared type');
    }

    try {
      const row = await this.db.queryOne<MediaRow>(
        'insert into website_media\n' +
          '  (entry_id, revision_id, storage_path, mime_type, size_bytes, alt_text,\n' +
          '   caption, sort_order, status, created_by)\n' +
          'values ($1::uuid, $2::uuid, $3, $4, $5, $6, $7, $8, $9, $10)\n' +
          'returning id, entry_id, revision_id, storage_path, mime_type, size_bytes,\n' +
          '          width, height, alt_text, caption, focal_x, focal_y, sort_order, status',
        [
          dto.entryId,
          dto.revisionId ?? null,
          dto.storagePath,
          contentType,
          actualSize,
          dto.altText.trim(),
          dto.caption?.trim() || null,
          dto.sortOrder ?? 0,
          status,
          userId,
        ],
      );
      if (!row) throw new Error('Website media insert returned no row');
      return {
        ...mapMedia(row, null),
        url: await this.storage.signedUrl(BUCKETS.websiteMedia, row.storage_path),
      };
    } catch (error) {
      if (isUniqueViolation(error)) throw new ConflictException('This storage object is already registered');
      throw error;
    }
  }

  private async hydratePublished(rows: PublishedRow[]) {
    if (!rows.length) return [];
    const ids = rows.map((row) => row.id);
    const mediaRows = await this.db.query<MediaRow>(
      'select id, entry_id, revision_id, storage_path, mime_type, size_bytes,\n' +
        '       width, height, alt_text, caption, focal_x, focal_y, sort_order, status\n' +
        '  from website_media\n' +
        ' where entry_id = any($1::uuid[])\n' +
        "   and status = 'published'\n" +
        ' order by sort_order asc, created_at asc',
      [ids],
    );
    const mediaByEntry = new Map<string, Array<ReturnType<typeof mapMedia>>>();
    await Promise.all(
      mediaRows.map(async (media) => {
        let url: string | null = null;
        try {
          url = await this.storage.signedUrl(BUCKETS.websiteMedia, media.storage_path);
        } catch (error) {
          this.logger.warn('Unable to sign website media ' + media.id + ': ' + (error as Error).message);
        }
        const mapped = mapMedia(media, url);
        const list = mediaByEntry.get(media.entry_id ?? '') ?? [];
        list.push(mapped);
        mediaByEntry.set(media.entry_id ?? '', list);
      }),
    );
    return rows.map((row) => mapPublished(row, mediaByEntry.get(row.id) ?? []));
  }

  private publicFilter(query: { entryType?: string; q?: string }) {
    const conditions = ['e.published_revision_id is not null'];
    const params: unknown[] = [];
    if (query.entryType) {
      params.push(query.entryType);
      conditions.push('e.entry_type = $' + params.length);
    }
    if (query.q) {
      const escaped = '%' + escapeLike(query.q) + '%';
      params.push(escaped);
      const index = params.length;
      conditions.push(
        '(e.slug ilike $' + index + ' or r.content::text ilike $' + index + ')',
      );
    }
    return { where: 'where ' + conditions.join(' and '), params };
  }

  private adminEntrySql() {
    return (
      'select e.id, e.entry_type, e.slug, e.draft_revision_id, e.published_revision_id,\n' +
      '       e.created_by, e.updated_by, e.created_at, e.updated_at,\n' +
      '       d.revision_number as draft_revision_number,\n' +
      '       p.revision_number as published_revision_number,\n' +
      '       (select count(*) from website_revisions all_r where all_r.entry_id = e.id) as revision_count\n' +
      '  from website_entries e\n' +
      '  left join website_revisions d on d.id = e.draft_revision_id\n' +
      '  left join website_revisions p on p.id = e.published_revision_id'
    );
  }

  private assertUuid(value: string, label: string) {
    if (!UUID_RE.test(value)) throw new BadRequestException(label + ' must be a UUID');
  }

  private async ensureWebsiteBucket() {
    if (!this.websiteBucketReady) {
      this.websiteBucketReady = this.storage
        .ensureBucket(BUCKETS.websiteMedia, WEBSITE_MEDIA_MAX_BYTES)
        .catch((error) => {
          this.websiteBucketReady = null;
          throw error;
        });
    }
    await this.websiteBucketReady;
  }
}

function mapPublished(row: PublishedRow, media: Array<ReturnType<typeof mapMedia>>) {
  return {
    id: row.id,
    entryType: row.entry_type,
    slug: row.slug,
    content: row.content,
    seo: row.seo,
    publishedAt: toIso(row.published_at),
    media,
  };
}

function mapAdminEntry(row: AdminEntryRow) {
  return {
    id: row.id,
    entryType: row.entry_type,
    slug: row.slug,
    draftRevisionId: row.draft_revision_id,
    publishedRevisionId: row.published_revision_id,
    draftRevisionNumber: row.draft_revision_number,
    publishedRevisionNumber: row.published_revision_number,
    revisionCount: Number(row.revision_count),
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
    status: row.published_revision_id ? 'published' : 'draft',
  };
}

function mapMedia(row: MediaRow, url: string | null) {
  return {
    id: row.id,
    entryId: row.entry_id,
    revisionId: row.revision_id,
    path: row.storage_path,
    mimeType: row.mime_type,
    sizeBytes: Number(row.size_bytes),
    width: row.width,
    height: row.height,
    altText: row.alt_text,
    caption: row.caption,
    focalX: row.focal_x == null ? null : Number(row.focal_x),
    focalY: row.focal_y == null ? null : Number(row.focal_y),
    sortOrder: row.sort_order,
    status: row.status,
    url,
  };
}

function toIso(value: Date | string) {
  return new Date(value).toISOString();
}

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, '\\$&');
}

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function assertSafeObject(value: unknown, label: string) {
  const state = { nodes: 0 };
  inspectSafeValue(value, label, 0, state);
}

function inspectSafeValue(value: unknown, path: string, depth: number, state: { nodes: number }) {
  state.nodes += 1;
  if (state.nodes > 5000) throw new BadRequestException(path + ' contains too many values');
  if (depth > 8) throw new BadRequestException(path + ' is nested too deeply');
  if (typeof value === 'string') {
    if (value.length > 20_000) throw new BadRequestException(path + ' contains an oversized text value');
    if (/<\s*script\b|javascript\s*:|on[a-z]+\s*=/i.test(value)) {
      throw new BadRequestException(path + ' contains unsafe markup');
    }
    return;
  }
  if (value === null || typeof value === 'number' || typeof value === 'boolean') return;
  if (Array.isArray(value)) {
    if (value.length > 500) throw new BadRequestException(path + ' contains too many items');
    value.forEach((item, index) => inspectSafeValue(item, path + '[' + index + ']', depth + 1, state));
    return;
  }
  if (typeof value !== 'object') throw new BadRequestException(path + ' must be JSON');
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (/^(?:__proto__|constructor|prototype|dangerouslySetInnerHTML|on[a-z]+)$/i.test(key)) {
      throw new BadRequestException(path + '.' + key + ' is not allowed');
    }
    inspectSafeValue(child, path + '.' + key, depth + 1, state);
  }
}

function assertMediaLimit(contentType: string, sizeBytes: number) {
  const limits: Record<string, number> = {
    'application/pdf': 20 * 1024 * 1024,
    'image/jpeg': 10 * 1024 * 1024,
    'image/png': 10 * 1024 * 1024,
    'image/webp': 10 * 1024 * 1024,
    'image/avif': 10 * 1024 * 1024,
    'video/mp4': WEBSITE_MEDIA_MAX_BYTES,
    'video/webm': WEBSITE_MEDIA_MAX_BYTES,
  };
  const limit = limits[contentType];
  if (!limit) throw new BadRequestException('Unsupported website media type');
  if (!Number.isInteger(sizeBytes) || sizeBytes < 1 || sizeBytes > limit) {
    throw new BadRequestException(
      'Website media exceeds the ' + Math.round(limit / 1024 / 1024) + ' MB limit',
    );
  }
}

function isUniqueViolation(error: unknown): boolean {
  return Boolean(error && typeof error === 'object' && (error as { code?: string }).code === '23505');
}
