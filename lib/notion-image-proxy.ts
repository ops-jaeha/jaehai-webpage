import type { ExtendedRecordMap } from 'notion-types';

const NOTION_FILE_URL_PATTERN =
  /^https:\/\/(www\.)?notion\.so\/|^https:\/\/s3\.|^https:\/\/prod-files-secure\.s3\.|^https:\/\/file\.notion\.so/;

/** 객체/배열 내부의 모든 Notion 이미지 URL 문자열을 proxyUrl로 치환 */
function replaceNotionUrlsInValue(
  obj: unknown,
  proxyUrl: string
): unknown {
  if (typeof obj === 'string') {
    return NOTION_FILE_URL_PATTERN.test(obj) ? proxyUrl : obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => replaceNotionUrlsInValue(item, proxyUrl));
  }
  if (obj !== null && typeof obj === 'object') {
    const next: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      next[k] = replaceNotionUrlsInValue(v, proxyUrl);
    }
    return next;
  }
  return obj;
}

/**
 * recordMap 내부의 Notion 임시 이미지 URL을 우리 서버의 프록시 URL로 바꿉니다.
 * 프록시 API가 blockId로 Notion에서 새 URL을 받아와 만료 문제를 해결합니다.
 * react-notion-x는 recordMap.signed_urls[blockId]를 우선 사용하므로 여기도 변환합니다.
 */
export function transformRecordMapImageUrls(
  recordMap: ExtendedRecordMap,
  basePath = ''
): ExtendedRecordMap {
  const block = recordMap.block as unknown as Record<string, { value: Record<string, unknown> }>;
  if (!block || typeof block !== 'object') return recordMap;

  const nextBlock: Record<string, { value: Record<string, unknown> }> = {};
  const imageBlockIds = new Set<string>();

  for (const [blockId, entry] of Object.entries(block)) {
    if (!entry?.value) {
      nextBlock[blockId] = entry;
      continue;
    }
    const value = entry.value as Record<string, unknown>;
    const type = value.type as string | undefined;

    if (type === 'image') {
      imageBlockIds.add(blockId);
      const proxyUrl = `${basePath}/api/notion-image?blockId=${encodeURIComponent(blockId)}`;
      const cloned = JSON.parse(JSON.stringify(entry)) as { value: Record<string, unknown> };
      cloned.value = replaceNotionUrlsInValue(cloned.value, proxyUrl) as Record<string, unknown>;
      nextBlock[blockId] = cloned;
    } else {
      nextBlock[blockId] = entry;
    }
  }

  // react-notion-x는 recordMap.signed_urls[block.id]를 우선 사용함 → 이미지 블록은 프록시 URL로
  const signedUrls = recordMap.signed_urls as Record<string, string> | undefined;
  let nextSignedUrls: Record<string, string> | undefined;
  if (signedUrls && typeof signedUrls === 'object') {
    nextSignedUrls = { ...signedUrls };
    for (const id of imageBlockIds) {
      if (nextSignedUrls[id] && NOTION_FILE_URL_PATTERN.test(nextSignedUrls[id])) {
        nextSignedUrls[id] = `${basePath}/api/notion-image?blockId=${encodeURIComponent(id)}`;
      }
    }
  }

  return {
    ...recordMap,
    block: nextBlock as unknown as ExtendedRecordMap['block'],
    ...(nextSignedUrls !== undefined && { signed_urls: nextSignedUrls }),
  };
}
