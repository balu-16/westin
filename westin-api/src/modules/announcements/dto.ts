import { IsIn, IsOptional, IsString, IsNotEmpty, MaxLength } from 'class-validator';

export const ANNOUNCEMENT_CATEGORIES = ['exam', 'event', 'general'] as const;
export const AUDIENCES = ['all', 'students', 'faculty'] as const;

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message: string;

  @IsOptional()
  @IsIn(ANNOUNCEMENT_CATEGORIES as unknown as string[])
  category?: string;

  @IsOptional()
  @IsIn(AUDIENCES as unknown as string[])
  audience?: string;
}

/** All fields optional; only provided fields are updated. */
export class UpdateAnnouncementDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message?: string;

  @IsOptional()
  @IsIn(ANNOUNCEMENT_CATEGORIES as unknown as string[])
  category?: string;

  @IsOptional()
  @IsIn(AUDIENCES as unknown as string[])
  audience?: string;
}
