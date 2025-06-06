"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import env from "../config/env.json";
import "../app/styles/App.css";
import "./Sidebar.css";

const Sidebar = () => {
  const [profileImage, setProfileImage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetch(`https://api.github.com/users/${env.github_id}`)
      .then((response) => response.json())
      .then((data) => {
        setProfileImage(data.avatar_url);
      });
  }, []);

  useEffect(() => {
    const storedMode = JSON.parse(
      localStorage.getItem("isDarkMode") || "false"
    );
    if (storedMode !== null) {
      setIsDarkMode(storedMode);
    }
  }, []);

  const githubLogoSrc = isDarkMode
    ? "https://raw.githubusercontent.com/ops-jaeha/jaehai-webpage/refs/heads/main/public/assets/github/github-mark-white.png"
    : "https://raw.githubusercontent.com/ops-jaeha/jaehai-webpage/refs/heads/main/public/assets/github/github-mark.png";

  const linkedinLogoSrc =
    "https://raw.githubusercontent.com/ops-jaeha/jaehai-webpage/main/public/assets/linkedin/linkedin-mark.png";

  const emailLogoSrc =
    "https://raw.githubusercontent.com/ops-jaeha/jaehai-webpage/main/public/assets/email/gmail.png";

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
        <p className="profile-introduce">{env.introduce_sidebar}</p>
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
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link"
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
          <Link href={`mailto:${env.email}`} className="contact-link">
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

export default Sidebar;
