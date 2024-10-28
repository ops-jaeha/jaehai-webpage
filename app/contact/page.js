'use client';

import Link from 'next/link';
import env from '../../config/env.json';
import '../styles/Contact.css';

const Contact = () => {
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
        <p>Reach out to me on any of the following platforms:</p>
        <div className="contact-links">
          <Link href={`mailto:${env.email}`} className="contact-link">
            📧 Email
          </Link>
          <Link
            href={`https://github.com/${env.github_id}`}
            className="contact-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            💻 GitHub
          </Link>
          <Link
            href={`https://www.linkedin.com/in/${env.linkedin_id}`}
            className="contact-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            🌐 LinkedIn
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
