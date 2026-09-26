import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const WEBSITE_ENTRY_TYPES = [
  'homepage-section',
  'page',
  'program',
  'management',
  'news',
  'blog',
  'event-story',
  'success-story',
  'testimonial',
  'gallery',
  'magazine',
] as const;

// The current Supabase project enforces a 50 MiB maximum object size.
export const WEBSITE_MEDIA_MAX_BYTES = 50 * 1024 * 1024;

export class WebsiteContentQueryDto {
  @IsOptional()
  @IsIn(WEBSITE_ENTRY_TYPES as unknown as string[])
  entryType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize = 20;
}

export class CreateWebsiteEntryDto {
  @IsIn(WEBSITE_ENTRY_TYPES as unknown as string[])
  entryType!: string;

  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'slug must use lowercase letters, numbers, and hyphens' })
  @MaxLength(160)
  slug!: string;

  @IsObject()
  content!: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  seo?: Record<string, unknown>;
}

export class UpdateWebsiteEntryDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'slug must use lowercase letters, numbers, and hyphens' })
  @MaxLength(160)
  slug?: string;

  @IsOptional()
  @IsObject()
  content?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  seo?: Record<string, unknown>;
}

export class MediaUploadUrlDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  filename!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  contentType!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(WEBSITE_MEDIA_MAX_BYTES)
  sizeBytes!: number;
}

export class FinalizeWebsiteMediaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  storagePath!: string;

  @IsUUID('4')
  entryId!: string;

  @IsOptional()
  @IsUUID('4')
  revisionId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  mimeType!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(WEBSITE_MEDIA_MAX_BYTES)
  sizeBytes!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  altText!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  caption?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1000)
  sortOrder?: number;
}

export class PublishWebsiteRevisionDto {
  @IsUUID('4')
  revisionId!: string;
}

export class UpdateWebsiteSettingDto {
  @IsObject()
  value!: Record<string, unknown>;
}

export const ENQUIRY_CATEGORIES = ['general', 'program', 'campus-visit', 'admissions'] as const;
export const ENQUIRY_STATUSES = ['new', 'contacted', 'closed'] as const;

export class CreateWebsiteEnquiryDto {
  @IsIn(ENQUIRY_CATEGORIES as unknown as string[])
  category!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @MaxLength(160)
  programSlug?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message!: string;

  @IsBoolean()
  consent!: boolean;

  /** Honeypot: browsers leave this blank; bots often fill every field. */
  @IsOptional()
  @IsString()
  @MaxLength(120)
  website?: string;
}

export class WebsiteEnquiryQueryDto {
  @IsOptional()
  @IsIn(ENQUIRY_STATUSES as unknown as string[])
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 25;
}

export class UpdateWebsiteEnquiryDto {
  @IsIn(ENQUIRY_STATUSES as unknown as string[])
  status!: string;
}

export class AddWebsiteEnquiryNoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  note!: string;
}
