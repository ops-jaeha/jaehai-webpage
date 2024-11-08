"use client";

import React, { useState, useEffect } from "react";
import TopNav from "../components/TopNav";

function ClientLayout({ children }) {
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

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <TopNav toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      {children}
    </>
  );
}

export default ClientLayout;
