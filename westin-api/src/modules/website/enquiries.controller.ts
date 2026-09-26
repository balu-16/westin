import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { AuthUser } from '../../common/guards/jwt-auth.guard';
import {
  AddWebsiteEnquiryNoteDto,
  CreateWebsiteEnquiryDto,
  UpdateWebsiteEnquiryDto,
  WebsiteEnquiryQueryDto,
} from './dto';
import { EnquiriesService } from './enquiries.service';

@Controller('api')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class EnquiriesController {
  constructor(private enquiries: EnquiriesService) {}

  @Public()
  @Post('public/enquiries')
  @HttpCode(202)
  create(
    @Body() dto: CreateWebsiteEnquiryDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    if (!idempotencyKey?.trim()) throw new BadRequestException('Idempotency-Key header is required');
    return this.enquiries.create(dto, idempotencyKey);
  }

  @Roles('admin')
  @Get('admin/enquiries')
  list(@Query() query: WebsiteEnquiryQueryDto) {
    return this.enquiries.list(query);
  }

  @Roles('admin')
  @Get('admin/enquiries/:id')
  detail(@Param('id', ParseUUIDPipe) id: string) {
    return this.enquiries.detail(id);
  }

  @Roles('admin')
  @Patch('admin/enquiries/:id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWebsiteEnquiryDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.enquiries.updateStatus(id, dto, user.id);
  }

  @Roles('admin')
  @Post('admin/enquiries/:id/notes')
  @HttpCode(200)
  addNote(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddWebsiteEnquiryNoteDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.enquiries.addNote(id, dto, user.id);
  }
}
