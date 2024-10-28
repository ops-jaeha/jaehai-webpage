'use client';

import React, { useState, useEffect } from 'react';
import TopNav from '../components/TopNav';
import Sidebar from '../components/Sidebar';
import './styles/App.css';

export default function RootLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState();
  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <html lang="ko">
      <body>
        <TopNav toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <div className="app-container">
          <Sidebar />
          <div className="main-content">{children}</div>
        </div>
      </body>
    </html>
  );
}
