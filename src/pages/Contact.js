import React from 'react';
import env from '../config/env.json';
import '../index.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="logo-section">
          <a href="/" className="brand-link">
            <span className="brand-text">
              <strong>{env.user_name}</strong>.Opslog
            </span>
          </a>
        </div>
        <h1>Contact Me</h1>
        <p>Reach out to me on any of the following platforms:</p>
        <div className="contact-links">
          <a href={`mailto:${env.email}`} className="contact-link">
            📧 Email
          </a>
          <a
            href={`https://github.com/${env.github_id}`}
            className="contact-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            💻 GitHub
          </a>
          <a
            href={`https://www.linkedin.com/in/${env.linkedin_id}`}
            className="contact-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            🌐 LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
