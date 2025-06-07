"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

export const DarkModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("isDarkMode");
    const initialDarkMode = saved ? JSON.parse(saved) : true;
    setIsDarkMode(initialDarkMode);
    document.body.classList.toggle("dark-mode", initialDarkMode);
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

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {mounted ? children : null}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
};
