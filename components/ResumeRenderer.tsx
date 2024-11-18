"use client";

import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { NotionRenderer } from "react-notion-x";
import { ExtendedRecordMap } from "notion-types";

interface ResumeRendererProps {
  recordMap: ExtendedRecordMap;
}

export default function ResumeRenderer({ recordMap }: ResumeRendererProps) {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("isDarkMode");
    setIsDarkMode(saved ? JSON.parse(saved) : true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
      document.body.classList.toggle("dark-mode", isDarkMode);
    }
  }, [isDarkMode, mounted]);
  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={true}
      darkMode={isDarkMode}
    />
  );
}
