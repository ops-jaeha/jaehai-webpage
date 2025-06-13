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
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <NotionRenderer
        recordMap={recordMap}
        fullPage={false}
        darkMode={false}
        mapPageUrl={(pageId) => `/blog/${pageId}`}
        pageTitle={false}
        disableHeader={true}
      />
    );
  }

  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={false}
      darkMode={theme === 'dark'}
      mapPageUrl={(pageId) => `/blog/${pageId}`}
      pageTitle={false}
      disableHeader={true}
    />
  );
}
