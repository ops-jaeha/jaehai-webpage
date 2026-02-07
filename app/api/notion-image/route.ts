import { NextRequest, NextResponse } from 'next/server';
import { notion } from '@/lib/notion';

/**
 * Notion 이미지 블록 ID로 요청 시, Notion API에서 최신 URL을 받아와 이미지를 스트리밍합니다.
 * 임시 URL 만료로 인한 이미지 깨짐을 방지합니다.
 */
export async function GET(request: NextRequest) {
  const blockId = request.nextUrl.searchParams.get('blockId');
  if (!blockId) {
    return NextResponse.json({ error: 'blockId required' }, { status: 400 });
  }

  try {
    console.log('[notion-image] request blockId=', blockId);
    const normalizedId = blockId.replace(/-/g, '');
    console.log('[notion-image] normalizedId=', normalizedId);
    const block = await notion.blocks.retrieve({
      block_id: normalizedId,
    });

    if (!block) {
      return NextResponse.json({ error: 'Block not found' }, { status: 404 });
    }

    const blockObj = block as { type: string; image?: { type: string; file?: { url: string }; external?: { url: string } } };
    if (blockObj.type !== 'image') {
      return NextResponse.json({ error: 'Not an image block' }, { status: 404 });
    }

    const image = blockObj.image as
      | { type: 'file'; file: { url: string } }
      | { type: 'external'; external: { url: string } }
      | undefined;

    if (!image) {
      console.warn('[notion-image] no image data for block', normalizedId);
      return NextResponse.json({ error: 'No image data' }, { status: 404 });
    }

    let imageUrl: string;
    if (image.type === 'file' && image.file?.url) {
      imageUrl = image.file.url;
    } else if (image.type === 'external' && image.external?.url) {
      imageUrl = image.external.url;
    } else {
      return NextResponse.json({ error: 'No image URL' }, { status: 404 });
    }

    console.log('[notion-image] fetching imageUrl=', imageUrl);
    const res = await fetch(imageUrl, {
      headers: {
        Accept: 'image/*',
      },
      cache: 'no-store',
    });

    console.log('[notion-image] fetched status=', res.status, 'for', imageUrl);
    if (!res.ok) {
      console.warn('[notion-image] failed to fetch image, status=', res.status);
      return NextResponse.json(
        { error: 'Failed to fetch image', status: res.status },
        { status: 502 }
      );
    }

    const contentType = res.headers.get('content-type') || 'image/png';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (err) {
    console.error('[notion-image] proxy error for request:', request.url, err);
    return NextResponse.json(
      { error: 'Failed to load image' },
      { status: 500 }
    );
  }
}
