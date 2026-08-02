/**
 * Meta Controller - fetch OG metadata cho link preview
 * Server-side để tránh CORS và bảo vệ IP của user
 */
import { Controller, Get, Query, Logger } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { Throttle } from '../../common/guards/throttle.guard';

@Controller('meta')
export class MetaController {
  private readonly logger = new Logger(MetaController.name);

  @Public()
  @Throttle({ limit: 30, window: 60, keyExtra: 'link-preview' })
  @Get('preview')
  async getLinkPreview(@Query('url') url: string) {
    if (!url || !url.startsWith('http')) {
      return { error: 'Invalid URL' };
    }

    try {
      const controller = new AbortController();
      const timeout    = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(url, {
        signal:  controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Querencia/1.0; +https://querencia.com.vn)',
          'Accept':     'text/html,application/xhtml+xml',
        },
        redirect: 'follow',
      });
      clearTimeout(timeout);

      if (!res.ok) return { url, title: null };

      const html = await res.text();
      return { url, ...this._parseOgTags(html) };

    } catch (e: any) {
      if (e.name !== 'AbortError') {
        this.logger.warn(`Link preview failed for ${url}: ${e.message}`);
      }
      return { url, title: null };
    }
  }

  private _parseOgTags(html: string) {
    const get = (prop: string) => {
      const match =
        html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)["']`, 'i')) ??
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, 'i'));
      return match?.[1]?.trim();
    };
    const getMeta = (name: string) => {
      const match = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'));
      return match?.[1]?.trim();
    };
    const getTitle = () => {
      const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      return match?.[1]?.trim();
    };

    return {
      title:       get('title') ?? getTitle(),
      description: get('description') ?? getMeta('description'),
      image:       get('image'),
      siteName:    get('site_name'),
    };
  }
}
