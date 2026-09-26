import { Controller, Get, Header, Query, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { WebsiteContentQueryDto } from './dto';
import { WebsiteService } from './website.service';

@Public()
@Controller('api/public')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class PublicContentController {
  constructor(private website: WebsiteService) {}

  @Get('site')
  @Header('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=30')
  site() {
    return this.website.publicSite();
  }

  @Get('content')
  @Header('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=30')
  content(@Query() query: WebsiteContentQueryDto) {
    return this.website.listPublic(query);
  }

  @Get('content/:entryType/:slug')
  @Header('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=30')
  detail(@Param('entryType') entryType: string, @Param('slug') slug: string) {
    return this.website.getPublic(entryType, slug);
  }

  @Get('search')
  @Header('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=30')
  search(@Query() query: WebsiteContentQueryDto) {
    return this.website.searchPublic(query);
  }
}
