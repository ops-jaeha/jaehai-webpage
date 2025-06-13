'use client';

import { NotionRenderer } from 'react-notion-x';
import type { ExtendedRecordMap } from 'notion-types';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';

interface ResumeNotionPageRendererProps {
  recordMap: ExtendedRecordMap;
}

export default function ResumeNotionPageRenderer({ recordMap }: ResumeNotionPageRendererProps) {
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
        pageTitle={true}
        disableHeader={true}
      />
    );
  }

  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={false}
      darkMode={theme === 'dark'}
      pageTitle={true}
      disableHeader={true}
    />
  );
}
