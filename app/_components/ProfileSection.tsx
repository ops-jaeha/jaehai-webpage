'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProfileImage } from '@/components/ProfileImage';
import { SocialIcon } from '@/components/SocialIcon';
import env from '@/config/env.json';

const socialLinks = [
  {
    lightSrc: '/assets/github/github-mark.png',
    darkSrc: '/assets/github/github-mark-white.png',
    alt: 'GitHub',
    href: `https://github.com/${env.social_links[0].github_id}`,
  },
  {
    lightSrc: '/assets/linkedin/linkedin-mark.png',
    darkSrc: '/assets/linkedin/linkedin-mark.png',
    alt: 'LinkedIn',
    href: `https://www.linkedin.com/in/${env.social_links[1].linkedin_id}`,
  },
  {
    lightSrc: '/assets/email/gmail.png',
    darkSrc: '/assets/email/gmail.png',
    alt: 'Email',
    href: `mailto:${env.social_links[2].email}`,
  },
];

export default function ProfileSection() {
  return (
    <Card className="mx-auto w-full max-w-[min(100%,20rem)] md:max-w-lg">
      <CardContent className="pt-4 sm:pt-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-center">
            <div className="bg-muted rounded-full p-1.5 sm:p-2">
              <div className="h-28 w-28 overflow-hidden rounded-full sm:h-36 sm:w-36">
                <ProfileImage />
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-base font-bold sm:text-lg">{env.user_name}</h3>
            <p className="text-primary text-xs sm:text-sm">{env.role}</p>
          </div>

          <div className="flex justify-center gap-1.5 sm:gap-2">
            {socialLinks.map(({ lightSrc, darkSrc, alt, href }) => (
              <Button key={alt} variant="ghost" className="bg-primary/10" size="icon" asChild>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <SocialIcon lightSrc={lightSrc} darkSrc={darkSrc} alt={alt} />
                </a>
              </Button>
            ))}
          </div>

          <p className="bg-primary/10 rounded p-1.5 text-center text-xs sm:p-2 sm:text-sm">
          {env.introduce_sidebar}
        </p>
        </div>
      </CardContent>
    </Card>
  );
}
