'use client';

import { Button } from '@/components/ui/button';
import { SocialIcon } from '@/components/SocialIcon';
import env from '@/config/env.json';

const socialLinksData = [
  {
    name: 'GitHub',
    href: `https://github.com/${env.social_links[0].github_id}`,
    lightSrc: '/assets/github/github-mark.png',
    darkSrc: '/assets/github/github-mark-white.png',
  },
  {
    name: 'LinkedIn',
    href: `https://www.linkedin.com/in/${env.social_links[1].linkedin_id}`,
    lightSrc: '/assets/linkedin/linkedin-mark.png',
    darkSrc: '/assets/linkedin/linkedin-mark.png',
  },
  {
    name: 'Email',
    href: `mailto:${env.social_links[0].email}`,
    lightSrc: '/assets/email/gmail.png',
    darkSrc: '/assets/email/gmail.png',
  },
];

export function ContactLinksClient() {
  return (
    <div className="flex flex-col gap-4">
      {socialLinksData.map((link) => (
        <Button key={link.name} asChild variant="outline" className="h-12 justify-start gap-4 px-4">
          <a href={link.href} target="_blank" rel="noopener noreferrer">
            <SocialIcon lightSrc={link.lightSrc} darkSrc={link.darkSrc} alt={link.name} />
            <span>{link.name}</span>
          </a>
        </Button>
      ))}
    </div>
  );
}
