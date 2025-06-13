'use client';

import Giscus from '@giscus/react';

import { useTheme } from 'next-themes';

export default function GiscusComments() {
  const { theme } = useTheme();

  return (
    <Giscus
      repo="ops-jaeha/jaehai-webpage"
      repoId="R_kgDONGykxQ"
      category="Announcements"
      categoryId="DIC_kwDONGykxc4Crc1n"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme === 'dark' ? 'noborder_gray' : 'noborder_light'}
      lang="ko"
    />
  );
}
