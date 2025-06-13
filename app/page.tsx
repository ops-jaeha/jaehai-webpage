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
    <div className="container mx-auto space-y-8 py-8">
      {/* Header Section */}
      <header className="flex flex-col items-center space-y-4">
        <Image
          src={env.main_profile_image}
          alt="Profile"
          width={128}
          height={128}
          className="rounded-full object-cover shadow-lg"
          priority
        />

        <h1 className="py-4 text-4xl tracking-tight">
          <span className="text-primary font-bold">{env.main_title}</span>
          <span className="text-muted-foreground font-normal">.{env.main_sub_title}</span>
        </h1>
      </header>
      {/* Terminal Section */}
      <section className="space-y-4 rounded-xl bg-[#d5d5d5] p-6 text-green-800 shadow transition-colors duration-300 dark:bg-[#333] dark:text-emerald-200">
        <div className="mb-5 flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <div className="command-line">$ whoami</div>
        <p className="terminal-text text-black dark:text-white">{env.terminal_text}</p>
        <div className="command-line">$ ls skills/</div>
        <p className="terminal-text text-black dark:text-white">{env.skill_text}</p>
      </section>
      {/* Skills Section */}
      <section className="pysm:grid-cols-2 grid grid-cols-1 gap-4 md:grid-cols-3">
        {env.skills.map((skill, index) => (
          <Card key={index} className="bg-[#d5d5d5] transition-colors duration-300 dark:bg-[#333]">
            <CardHeader className="gap-0">
              <CardTitle>{skill.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{skill.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
