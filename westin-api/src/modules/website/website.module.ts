import { Module } from '@nestjs/common';
import { EnquiriesController } from './enquiries.controller';
import { EnquiriesService } from './enquiries.service';
import { PublicContentController } from './public-content.controller';
import { WebsiteController } from './website.controller';
import { WebsiteService } from './website.service';

@Module({
  controllers: [PublicContentController, WebsiteController, EnquiriesController],
  providers: [WebsiteService, EnquiriesService],
})
export class WebsiteModule {}
