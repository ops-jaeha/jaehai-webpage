'use client';

import { NotionRenderer } from 'react-notion-x';
import type { ExtendedRecordMap } from 'notion-types';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import '@/app/style/BlogNotionPageRenderer.css';

interface BlogNotionPageRendererProps {
  recordMap: ExtendedRecordMap;
}

export default function BlogNotionPageRenderer({ recordMap }: BlogNotionPageRendererProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 마운트되지 않았을 때는 시스템 기본 테마를 사용
  const isDarkMode = mounted ? theme === 'dark' : resolvedTheme === 'dark';

  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={false}
      darkMode={isDarkMode}
      mapPageUrl={(pageId) => `/blog/${pageId}`}
      pageTitle={false}
      disableHeader={true}
    />
  );
}
