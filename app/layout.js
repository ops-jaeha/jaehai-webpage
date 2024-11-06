"use client";

import React, { useState, useEffect } from "react";
import TopNav from "../components/TopNav";
import "./styles/App.css";

function RootLayout({ children }) {
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isDarkMode");
      return saved ? JSON.parse(saved) : true;
    }
    return false;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
      document.body.classList.toggle("dark-mode", isDarkMode);
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  if (!mounted) {
    return null;
  }

  return (
    <html lang="ko">
      <body
        style={{
          paddingRight: "0px",
          margin: "0",
          overflow: "hidden",
        }}
      >
        <TopNav toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
