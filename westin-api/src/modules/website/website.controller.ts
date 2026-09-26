import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { AuthUser } from '../../common/guards/jwt-auth.guard';
import {
  CreateWebsiteEntryDto,
  FinalizeWebsiteMediaDto,
  MediaUploadUrlDto,
  PublishWebsiteRevisionDto,
  UpdateWebsiteSettingDto,
  UpdateWebsiteEntryDto,
} from './dto';
import { WebsiteService } from './website.service';

@Roles('admin')
@Controller('api/admin/website')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class WebsiteController {
  constructor(private website: WebsiteService) {}

  @Get('entries')
  list() {
    return this.website.listAdmin();
  }

  @Get('settings')
  settings() {
    return this.website.listSettingsAdmin();
  }

  @Patch('settings/:key')
  saveSetting(
    @Param('key') key: string,
    @Body() dto: UpdateWebsiteSettingDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.website.saveSetting(key, dto, user.id);
  }

  @Get('entries/:id')
  detail(@Param('id', ParseUUIDPipe) id: string) {
    return this.website.getAdmin(id);
  }

  @Post('entries')
  @HttpCode(200)
  create(@Body() dto: CreateWebsiteEntryDto, @CurrentUser() user: AuthUser) {
    return this.website.create(dto, user.id);
  }

  @Patch('entries/:id')
  saveDraft(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWebsiteEntryDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.website.saveDraft(id, dto, user.id);
  }

  @Post('entries/:id/publish')
  @HttpCode(200)
  publish(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PublishWebsiteRevisionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.website.publish(id, dto.revisionId, user.id);
  }

  @Post('entries/:id/unpublish')
  @HttpCode(200)
  unpublish(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: AuthUser) {
    return this.website.unpublish(id, user.id);
  }

  @Post('entries/:id/restore')
  @HttpCode(200)
  restore(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PublishWebsiteRevisionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.website.restoreDraft(id, dto.revisionId, user.id);
  }

  @Post('media/upload-url')
  @HttpCode(200)
  uploadUrl(@Body() dto: MediaUploadUrlDto) {
    return this.website.uploadUrl(dto);
  }

  @Post('media')
  @HttpCode(200)
  finalizeMedia(@Body() dto: FinalizeWebsiteMediaDto, @CurrentUser() user: AuthUser) {
    return this.website.finalizeMedia(dto, user.id);
  }
}
