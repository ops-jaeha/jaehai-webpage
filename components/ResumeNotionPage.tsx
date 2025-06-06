"use client";

import { useEffect, useState } from "react";
import { NotionRenderer } from "react-notion-x";
import { ExtendedRecordMap } from "notion-types";
import "react-notion-x/src/styles.css";

interface RendererProps {
  recordMap: ExtendedRecordMap;
  isDarkMode: boolean;
}

export default function ResumeNotionPage({
  recordMap,
  isDarkMode,
}: RendererProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={true}
      darkMode={isDarkMode}
      disableHeader={true}
    />
  );
}
