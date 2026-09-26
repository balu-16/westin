-- ============================================================
-- 0016: Public website content, revisions, media and enquiries
-- Drafts are private. Anonymous reads can only reach the
-- published_revision_id pointer on website_entries.
-- ============================================================

create table if not exists website_entries (
  id                   uuid primary key default gen_random_uuid(),
  entry_type           text not null check (entry_type in (
    'homepage-section', 'page', 'program', 'management', 'news',
    'blog', 'event-story', 'success-story', 'testimonial',
    'gallery', 'magazine'
  )),
  slug                 text not null unique,
  draft_revision_id    uuid,
  published_revision_id uuid,
  created_by           uuid references users(id) on delete set null,
  updated_by           uuid references users(id) on delete set null,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create table if not exists website_revisions (
  id              uuid primary key default gen_random_uuid(),
  entry_id        uuid not null references website_entries(id) on delete cascade,
  revision_number int not null,
  schema_version  int not null default 1,
  content         jsonb not null,
  seo             jsonb not null default '{}'::jsonb,
  created_by      uuid references users(id) on delete set null,
  created_at      timestamptz not null default now(),
  published_at    timestamptz,
  unpublished_at  timestamptz,
  unique (entry_id, revision_number)
);

alter table website_entries
  add constraint website_entries_draft_revision_fk
  foreign key (draft_revision_id) references website_revisions(id) on delete set null;

alter table website_entries
  add constraint website_entries_published_revision_fk
  foreign key (published_revision_id) references website_revisions(id) on delete set null;

create index if not exists idx_website_entries_type on website_entries(entry_type);
create index if not exists idx_website_entries_published on website_entries(published_revision_id)
  where published_revision_id is not null;
create index if not exists idx_website_revisions_entry on website_revisions(entry_id, revision_number desc);

create table if not exists website_settings (
  setting_key    text primary key,
  value          jsonb not null default '{}'::jsonb,
  schema_version int not null default 1,
  updated_by     uuid references users(id) on delete set null,
  updated_at     timestamptz not null default now()
);

create table if not exists website_media (
  id             uuid primary key default gen_random_uuid(),
  entry_id       uuid references website_entries(id) on delete set null,
  revision_id    uuid references website_revisions(id) on delete set null,
  storage_path   text not null unique,
  mime_type      text not null,
  size_bytes     bigint not null check (size_bytes > 0),
  width          int check (width is null or width > 0),
  height         int check (height is null or height > 0),
  alt_text       text,
  caption        text,
  focal_x        numeric(5, 4) check (focal_x is null or (focal_x >= 0 and focal_x <= 1)),
  focal_y        numeric(5, 4) check (focal_y is null or (focal_y >= 0 and focal_y <= 1)),
  sort_order     int not null default 0,
  status         text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by     uuid references users(id) on delete set null,
  created_at     timestamptz not null default now()
);

create index if not exists idx_website_media_entry on website_media(entry_id, sort_order, created_at);
create index if not exists idx_website_media_revision on website_media(revision_id, sort_order);
create index if not exists idx_website_media_published on website_media(status)
  where status = 'published';

create table if not exists website_enquiries (
  id              uuid primary key default gen_random_uuid(),
  reference       text not null unique,
  category        text not null check (category in ('general', 'program', 'campus-visit', 'admissions')),
  name            text not null,
  email           text,
  phone           text,
  program_slug    text,
  message         text not null,
  consent_at      timestamptz not null,
  status          text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  idempotency_key text unique,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  check (email is not null or phone is not null)
);

create index if not exists idx_website_enquiries_status on website_enquiries(status, created_at desc);
create index if not exists idx_website_enquiries_created on website_enquiries(created_at desc);

create table if not exists website_enquiry_activity (
  id          uuid primary key default gen_random_uuid(),
  enquiry_id  uuid not null references website_enquiries(id) on delete cascade,
  actor_user_id uuid references users(id) on delete set null,
  action      text not null,
  note        text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_website_enquiry_activity_enquiry
  on website_enquiry_activity(enquiry_id, created_at desc);

do $$
declare t text;
begin
  foreach t in array array[
    'website_entries', 'website_revisions', 'website_settings',
    'website_media', 'website_enquiries', 'website_enquiry_activity'
  ] loop
    execute format('alter table if exists %I enable row level security', t);
  end loop;
end $$;
