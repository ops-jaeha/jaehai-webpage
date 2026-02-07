'use client';

import { NotionRenderer } from 'react-notion-x';
import type { ExtendedRecordMap } from 'notion-types';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import '@/app/style/BlogNotionPageRenderer.css';

const NOTION_IMAGE_URL_PATTERN =
  /^https:\/\/(www\.)?notion\.so\/|^https:\/\/s3\.|^https:\/\/prod-files-secure\.s3\.|^https:\/\/file\.notion\.so/;

interface BlogNotionPageRendererProps {
  recordMap: ExtendedRecordMap;
}

export default function BlogNotionPageRenderer({ recordMap }: BlogNotionPageRendererProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // 마운트되기 전에는 빈 div를 렌더링해서 깜빡임 방지
    return <div style={{ minHeight: '400px' }} />;
  }

  const mapImageUrl = (url?: string, block?: { id?: string }) => {
    // recordMap에 이미 절대 URL로 넣었으면 그대로 반환
    if (!url) return '';
    if (url.includes('/api/notion-image')) return url;
    if (NOTION_IMAGE_URL_PATTERN.test(url) && block?.id) {
      const path = `/api/notion-image?blockId=${encodeURIComponent(block.id)}`;
      if (typeof window !== 'undefined') {
        return `${window.location.origin}${path}`;
      }
      return path;
    }
    return url;
  };

  return (
    <div suppressHydrationWarning>
      <NotionRenderer
        recordMap={recordMap}
        fullPage={false}
        darkMode={theme === 'dark'}
        mapPageUrl={(pageId) => `/blog/${pageId}`}
        mapImageUrl={mapImageUrl}
        pageTitle={false}
        disableHeader={true}
      />
    </div>
  );
}
