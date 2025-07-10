import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  // Chứa tất cả cache key đã tạo
  private cacheKeys = new Set<string>();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private getCacheKey(request: any): string {
    return `cache:${request.originalUrl}`;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    // Handle GET - đọc cache
    if (request.method === 'GET') {
      const key = this.getCacheKey(request);
      const cached = await this.cacheManager.get(key);

      if (cached) {
        return of(cached);
      }

      return next.handle().pipe(
        tap((data) => {
          if (data) {
            this.cacheManager.set(key, data, { ttl: 60 }); // TTL 60 giây
            this.cacheKeys.add(key); // lưu lại key để sau xoá
          }
        }),
      );
    }

    // Nếu là POST/PUT/PATCH/DELETE thì xoá toàn bộ các cache đã lưu
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      for (const key of this.cacheKeys) {
        await this.cacheManager.del(key);
      }
      this.cacheKeys.clear();
    }

    return next.handle();
  }
}
