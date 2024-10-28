import React, { useEffect, useState } from 'react';
import env from '../config/env.json';
import '../index.css';

const Sidebar = () => {
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    fetch(`https://api.github.com/users/${env.github_id}`)
      .then((response) => response.json())
      .then((data) => {
        setProfileImage(data.avatar_url);
      });
  }, []);

  return (
    <div className="sidebar">
      <h2 className="profile-title">💻 Profile</h2>
      <div className="profile-card">
        <img src={profileImage} alt="Profile" className="profile-image" />
        <h3 className="profile-name">{env.user_name}</h3>
        <p className="profile-role">{env.role}</p>
        <p className="profile-introduce">{env.introduce}</p>
      </div>

      <h3 className="contact-title">💬 Contact</h3>
      <div className="contact-links-box">
        <div className="contact-links">
          <a
            href={`https://github.com/${env.github_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            🐱 GitHub
          </a>
          <a href={`mailto:${env.email}`} className="contact-link">
            ✉️ Email
          </a>
          <a
            href={`https://www.linkedin.com/in/${env.linkedin_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            💼 LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
