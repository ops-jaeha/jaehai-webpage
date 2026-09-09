import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion';

/**
 * Notion 이미지 블록 ID 또는 페이지 커버용 pageId로 요청 시,
 * Notion API에서 최신 URL을 받아와 이미지를 스트리밍합니다.
 * 임시 S3 URL 만료로 인한 이미지 깨짐을 방지하고 Vercel CDN에 캐싱합니다.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const blockId = searchParams.get('blockId');
  const pageId = searchParams.get('pageId');

  if (!blockId && !pageId) {
    return NextResponse.json({ error: 'blockId or pageId required' }, { status: 400 });
  }

  try {
    let imageUrl: string | null = null;

    if (blockId) {
      const normalizedBlockId = blockId.replace(/-/g, '');
      const block = await notion.blocks.retrieve({
        block_id: normalizedBlockId,
      });

      if (!block) {
        return NextResponse.json({ error: 'Block not found' }, { status: 404 });
      }

      const blockObj = block as {
        type: string;
        image?: {
          type: string;
          file?: { url: string };
          external?: { url: string };
        };
      };

      if (blockObj.type === 'image' && blockObj.image) {
        if (blockObj.image.type === 'file' && blockObj.image.file?.url) {
          imageUrl = blockObj.image.file.url;
        } else if (blockObj.image.type === 'external' && blockObj.image.external?.url) {
          imageUrl = blockObj.image.external.url;
        }
      }
    } else if (pageId) {
      const normalizedPageId = pageId.replace(/-/g, '');
      const page = await notion.pages.retrieve({
        page_id: normalizedPageId,
      });

      if (!page) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }

      const pageObj = page as {
        cover?: {
          type: 'file' | 'external';
          file?: { url: string };
          external?: { url: string };
        };
      };

      if (pageObj.cover) {
        if (pageObj.cover.type === 'file' && pageObj.cover.file?.url) {
          imageUrl = pageObj.cover.file.url;
        } else if (pageObj.cover.type === 'external' && pageObj.cover.external?.url) {
          imageUrl = pageObj.cover.external.url;
        }
      }
    }

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const res = await fetch(imageUrl, {
      headers: {
        Accept: 'image/*',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch image from Notion', status: res.status },
        { status: 502 }
      );
    }

    const contentType = res.headers.get('content-type') || 'image/png';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Vercel Edge Cache 및 브라우저에 1시간 동안 캐시
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('[notion-image] proxy error:', err);
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}
