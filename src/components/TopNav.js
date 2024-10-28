import React from 'react';
import { Link } from 'react-router-dom';
import env from '../config/env.json';
import './TopNav.css';

const TopNav = ({ toggleTheme, isDarkMode }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-brand">
            <a href="/" className="brand-link">
              <span className="brand-text">
                <strong>{env.user_name}</strong>.Opslog
              </span>
            </a>
          </div>
          <div className="navbar-menu">
            <div className="menu-items">
              <Link to="/post" className="menu-link">
                Post
              </Link>
              <Link to="/portfolio" className="menu-link">
                Portfolio
              </Link>
              <Link to="/contact" className="menu-link">
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
