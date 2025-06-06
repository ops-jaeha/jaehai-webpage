"use client";

import { useEffect, useState } from "react";
import { NotionRenderer } from "react-notion-x";
import { ExtendedRecordMap } from "notion-types";
import "react-notion-x/src/styles.css";

interface RendererProps {
  recordMap: ExtendedRecordMap;
}

export default function ResumeNotionPage({ recordMap }: RendererProps) {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("isDarkMode");
    const initialDarkMode = saved ? JSON.parse(saved) : true;
    setIsDarkMode(initialDarkMode);
    document.body.classList.toggle("dark-mode", initialDarkMode);

    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
      document.body.classList.toggle("dark-mode", isDarkMode);
    }
  }, [isDarkMode, mounted]);

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
