'use client';

import React, { useState, useEffect } from 'react';
import TopNav from '../components/TopNav';
import './styles/Global.css';

export default function RootLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem('isDarkMode');
      if (storedMode !== null) {
        setIsDarkMode(storedMode === 'true');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 브라우저 환경 확인
      localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }, [isDarkMode]);

  // 테마 토글 함수
  const toggleTheme = () => setIsDarkMode((prevMode) => !prevMode);

  return (
    <html lang="ko">
      <body>
        <TopNav toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        {children}
      </body>
    </html>
  );
}
