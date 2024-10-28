'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import env from '../config/env.json';
import '../app/styles/App.css';
import './Sidebar.css';

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
        {profileImage && (
          <Image
            src={profileImage}
            alt="Profile"
            width={100}
            height={100}
            className="profile-image"
          />
        )}
        <h3 className="profile-name">{env.user_name}</h3>
        <p className="profile-role">{env.role}</p>
        <p className="profile-introduce">{env.introduce}</p>
      </div>

      <h3 className="contact-title">💬 Contact</h3>
      <div className="contact-links-box">
        <div className="contact-links">
          <Link
            href={`https://github.com/${env.github_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            🐱 GitHub
          </Link>
          <Link href={`mailto:${env.email}`} className="contact-link">
            ✉️ Email
          </Link>
          <Link
            href={`https://www.linkedin.com/in/${env.linkedin_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
          >
            💼 LinkedIn
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
