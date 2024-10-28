import React from 'react';
import Link from 'next/link';
import env from '../config/env.json';
import './TopNav.css';

const TopNav = ({ toggleTheme, isDarkMode }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <Link href="/" className="brand-link">
              <span className="brand-text">
                <strong>{env.user_name}</strong>.Opslog
              </span>
            </Link>
          </div>
          <div className="navbar-menu">
            <div className="menu-items">
              <Link href="/post" className="menu-link">
                Post
              </Link>
              <Link href="/portfolio" className="menu-link">
                Portfolio
              </Link>
              <Link href="/contact" className="menu-link">
                Contact
              </Link>
              <button className="theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
