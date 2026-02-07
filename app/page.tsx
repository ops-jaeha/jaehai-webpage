'use client';

import { useEffect } from 'react';
import env from '../config/env.json';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import Image from 'next/image';

export default function Home() {
  useEffect(() => {
    const typeWriter = (element: HTMLElement, text: string, speed = 50) => {
      let i = 0;
      element.innerHTML = '';
      function type() {
        if (i < text.length) {
          element.innerHTML += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }
      type();
    };

    const commandLines = document.querySelectorAll('.command-line');
    commandLines.forEach((line) => {
      typeWriter(line as HTMLElement, line.textContent || '');
    });
    const terminalTexts = document.querySelectorAll('.terminal-text');
    terminalTexts.forEach((text) => {
      typeWriter(text as HTMLElement, text.textContent || '', 15);
    });
  }, []);

  return (
    <div className="container space-y-6 py-6 sm:space-y-8 sm:py-8">
      {/* Header Section */}
      <header className="flex flex-col items-center space-y-3 sm:space-y-4">
        <Image
          src={env.main_profile_image}
          alt="Profile"
          width={128}
          height={128}
          className="h-20 w-20 rounded-full object-cover shadow-lg sm:h-28 sm:w-28"
          priority
        />

        <h1 className="py-2 text-2xl tracking-tight sm:py-4 sm:text-3xl md:text-4xl">
          <span className="text-primary font-bold">{env.main_title}</span>
          <span className="text-muted-foreground font-normal">.{env.main_sub_title}</span>
        </h1>
      </header>
      {/* Terminal Section */}
      <section className="space-y-3 overflow-x-auto rounded-xl bg-[#d5d5d5] p-4 text-green-800 shadow transition-colors duration-300 dark:bg-[#333] dark:text-emerald-200 sm:space-y-4 sm:p-6">
        <div className="mb-4 flex space-x-2 sm:mb-5">
          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-red-500 sm:h-3 sm:w-3" />
          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-yellow-500 sm:h-3 sm:w-3" />
          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-green-500 sm:h-3 sm:w-3" />
        </div>
        <div className="command-line break-words text-sm sm:text-base">$ whoami</div>
        <p className="terminal-text break-words text-sm text-black dark:text-white sm:text-base">
          {env.terminal_text}
        </p>
        <div className="command-line break-words text-sm sm:text-base">$ ls skills/</div>
        <p className="terminal-text break-words text-sm text-black dark:text-white sm:text-base">
          {env.skill_text}
        </p>
      </section>
      {/* Skills Section */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
        {env.skills.map((skill, index) => (
          <Card
            key={index}
            className="bg-[#d5d5d5] transition-colors duration-300 dark:bg-[#333]"
          >
            <CardHeader className="gap-0">
              <CardTitle className="text-base sm:text-lg">{skill.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">{skill.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
