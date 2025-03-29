"use client";

import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { NotionRenderer } from "react-notion-x";
import { ExtendedRecordMap } from "notion-types";
import dynamic from "next/dynamic";

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then((m) => m.Code)
);
const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
);
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
);
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
);
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
);

interface RendererProps {
  recordMap: ExtendedRecordMap;
}

export default function NotionPage({ recordMap }: RendererProps) {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("isDarkMode");
    setIsDarkMode(saved ? JSON.parse(saved) : true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.body.classList.toggle("dark-mode", isDarkMode);
    }
  }, [isDarkMode, mounted]);

  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={true}
      darkMode={isDarkMode}
      components={{
        Code,
        Collection,
        Equation,
        Pdf,
        Modal,
      }}
    />
  );
}
