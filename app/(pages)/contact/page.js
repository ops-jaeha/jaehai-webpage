'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import env from '../../../config/env.json';
import '../../styles/App.css';
import '../../styles/Contact.css';

const Contact = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 다크 모드 상태 초기화 (로컬 스토리지에 저장된 값 확인)
  useEffect(() => {
    const storedMode = JSON.parse(localStorage.getItem('isDarkMode'));
    if (storedMode !== null) {
      setIsDarkMode(storedMode);
    }
  }, []);

  const githubLogoSrc = isDarkMode
    ? 'https://raw.githubusercontent.com/ops-jaeha/jaehai-webpage/refs/heads/main/public/assets/github/github-mark-white.png'
    : 'https://raw.githubusercontent.com/ops-jaeha/jaehai-webpage/refs/heads/main/public/assets/github/github-mark.png';

  const linkedinLogoSrc =
    'https://raw.githubusercontent.com/ops-jaeha/jaehai-webpage/main/public/assets/linkedin/linkedin-mark.png';

  const emailLogoSrc =
    'https://raw.githubusercontent.com/ops-jaeha/jaehai-webpage/main/public/assets/email/gmail.png';

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="logo-section">
          <Link href="/" className="brand-link">
            <span className="brand-text">
              <strong>{env.user_name}</strong>.Opslog
            </span>
          </Link>
        </div>
        <h1>Contact Me</h1>
        <p className="contact-description">
          Reach out to me on any of the following platforms:
        </p>
        <div className="contact-links">
          <Link
            href={`https://github.com/${env.github_id}`}
            className="contact-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={githubLogoSrc}
              alt="GitHub"
              width={15}
              height={15}
              className="contact-logo"
            />
            GitHub
          </Link>
          <Link
            href={`https://www.linkedin.com/in/${env.linkedin_id}`}
            className="contact-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={linkedinLogoSrc}
              alt="LinkedIn"
              width={15}
              height={15}
              className="contact-logo"
            />
            LinkedIn
          </Link>
          <Link
            href={`mailto:${env.email}`}
            className="contact-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={emailLogoSrc}
              alt="Email"
              width={15}
              height={15}
              className="contact-logo"
            />
            Email
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
