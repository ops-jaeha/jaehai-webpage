import React from 'react';
import Link from 'next/link';
import env from '../config/env.json';
import './TopNav.css';
import SunIcon from '../public/assets/background/SunIcon';
import MoonIcon from '../public/assets/background/MoonIcon';

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
              <Link href="/about" className="menu-link">
                About
              </Link>
              <button className="theme-toggle" onClick={toggleTheme}>
                {isDarkMode ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
