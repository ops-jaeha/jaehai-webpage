/**
 * 서버에서 북마크 카드용 OG 메타데이터를 가져오는 유틸리티.
 * 블로그/이력서 페이지는 ISR로 캐시되므로, 방문자의 브라우저가 아니라
 * 페이지 생성 시점(서버)에서 한 번만 fetch 하도록 한다.
 */

export interface OgData {
  title: string;
  description: string;
  image: string;
  favicon: string;
  url: string;
}

const FETCH_TIMEOUT_MS = 5000;

function decode_html_entities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function resolve_url(maybe_relative: string, base_url: string): string {
  try {
    return new URL(maybe_relative, base_url).toString();
  } catch {
    return '';
  }
}

function extract_meta_content(html: string, patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decode_html_entities(match[1]);
  }
  return '';
}

const IMAGE_CHECK_TIMEOUT_MS = 3000;

// 카드는 서버에서만 렌더링되고 브라우저 onError 핸들러가 없으므로, og:image가
// 실제로 죽은 링크(DNS 실패, 404 등)일 경우 깨진 이미지 아이콘이 그대로 노출된다.
// 미리 접근 가능한지 확인해서 죽은 이미지는 아예 카드에 넣지 않는다.
async function is_image_reachable(image_url: string): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), IMAGE_CHECK_TIMEOUT_MS);
  try {
    const response = await fetch(image_url, { method: 'HEAD', signal: controller.signal });
    if (response.ok) return true;
    // 일부 서버는 HEAD를 지원하지 않으므로(405 등) GET으로 한 번 더 확인
    if (response.status === 405) {
      const getResponse = await fetch(image_url, { method: 'GET', signal: controller.signal });
      return getResponse.ok;
    }
    return false;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetch_og_data(url: string): Promise<OgData | null> {
  if (!url) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return { title: url, description: '', image: '', favicon: '', url };
    }

    const html = await response.text();

    const title =
      extract_meta_content(html, [
        /<meta[^>]*(?:property|name)="og:title"[^>]*content="([^"]*)"[^>]*>/i,
        /<meta[^>]*content="([^"]*)"[^>]*(?:property|name)="og:title"[^>]*>/i,
      ]) || extract_meta_content(html, [/<title[^>]*>([^<]*)<\/title>/i]) || url;

    const description = extract_meta_content(html, [
      /<meta[^>]*(?:property|name)="og:description"[^>]*content="([^"]*)"[^>]*>/i,
      /<meta[^>]*content="([^"]*)"[^>]*(?:property|name)="og:description"[^>]*>/i,
      /<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i,
    ]);

    const raw_image = extract_meta_content(html, [
      /<meta[^>]*(?:property|name)="og:image"[^>]*content="([^"]*)"[^>]*>/i,
      /<meta[^>]*content="([^"]*)"[^>]*(?:property|name)="og:image"[^>]*>/i,
    ]);
    const resolved_image = raw_image ? resolve_url(raw_image, url) : '';
    const image = resolved_image && (await is_image_reachable(resolved_image)) ? resolved_image : '';

    let favicon = '';
    try {
      const origin = new URL(url).origin;
      // 사이트 자체 파비콘은 종종 404가 나기 때문에 구글 파비콘 서비스를 사용
      favicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(origin)}&sz=64`;
    } catch {
      favicon = '';
    }

    return { title, description, image, favicon, url };
  } catch {
    return { title: url, description: '', image: '', favicon: '', url };
  } finally {
    clearTimeout(timeout);
  }
}
