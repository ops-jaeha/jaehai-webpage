import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGFetcher/1.0)',
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    const html = await response.text();

    // Extract OG meta tags
    const og_title =
      html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/i)?.[1] ||
      html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] ||
      url;

    const og_description =
      html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i)?.[1] ||
      html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i)?.[1] ||
      '';

    const og_image =
      html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/i)?.[1] || '';

    const origin = new URL(url).origin;
    const favicon_url = `${origin}/favicon.ico`;

    return NextResponse.json({
      title: og_title,
      description: og_description,
      image: og_image,
      favicon: favicon_url,
      url,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch OG data' }, { status: 500 });
  }
}
