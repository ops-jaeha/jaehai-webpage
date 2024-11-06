"use client";

import { useEffect } from "react";
import "./styles/Global.css";
import env from "../config/env.json";

export default function Home() {
  useEffect(() => {
    const typeWriter = (element, text, speed = 50) => {
      let i = 0;
      element.innerHTML = "";
      function type() {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }
      type();
    };

    const commandLines = document.querySelectorAll(".command-line");
    commandLines.forEach((line) => {
      typeWriter(line, line.textContent);
    });
    const terminalTexts = document.querySelectorAll(".terminal-text");
    terminalTexts.forEach((text) => {
      typeWriter(text, text.textContent, 15);
    });
  }, []);

  return (
    <div className="container">
      <header className="header">
        <img
          src={env.main_profile_image}
          alt="Profile"
          className="main-profile-image"
        />
        <h1 className="typing-effect">
          <span className="title">{env.user_name}</span>.Opslog
        </h1>
      </header>
      <section className="terminal">
        <div className="terminal-header">
          <div className="terminal-button"></div>
          <div className="terminal-button"></div>
          <div className="terminal-button"></div>
        </div>
        <div className="command-line">$ whoami</div>
        <p className="terminal-text">{env.terminal_text}</p>
        <div className="command-line">$ ls skills/</div>
        <p className="terminal-text">{env.skill_text}</p>
      </section>

      <section className="skills">
        <div className="skill-card">
          <h4 className="skill-card-title">{env.skill_card_h1}</h4>
          <p className="skill-card-description">{env.skill_card_p1}</p>
        </div>
        <div className="skill-card">
          <h4 className="skill-card-title">{env.skill_card_h2}</h4>
          <p className="skill-card-description">{env.skill_card_p2}</p>
        </div>
        <div className="skill-card">
          <h4 className="skill-card-title">{env.skill_card_h3}</h4>
          <p className="skill-card-description">{env.skill_card_p3}</p>
        </div>
        <div className="skill-card">
          <h4 className="skill-card-title">{env.skill_card_h4}</h4>
          <p className="skill-card-description">{env.skill_card_p4}</p>
        </div>
        <div className="skill-card">
          <h4 className="skill-card-title">{env.skill_card_h5}</h4>
          <p className="skill-card-description">{env.skill_card_p5}</p>
        </div>
        <div className="skill-card">
          <h4 className="skill-card-title">{env.skill_card_h6}</h4>
          <p className="skill-card-description">{env.skill_card_p6}</p>
        </div>
      </section>
    </div>
  );
}
