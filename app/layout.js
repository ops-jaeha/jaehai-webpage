// app/layout.js
'use client';

import React, { useState, useEffect } from 'react';
import TopNav from '../components/TopNav';
import './styles/Global.css';

export default function RootLayout({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 로컬 스토리지에서 다크 모드 초기화
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 브라우저 환경 확인
      const storedMode = localStorage.getItem('isDarkMode');
      if (storedMode !== null) {
        setIsDarkMode(storedMode === 'true');
      }
    }
  }, []);

  // 다크 모드 변경 시 로컬 스토리지와 바디 클래스 업데이트
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
