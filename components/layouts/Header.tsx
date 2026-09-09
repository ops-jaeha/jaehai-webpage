'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex h-[var(--header-height)] items-center py-2 sm:px-4">
        <div className="grid w-full grid-cols-[1fr_auto] items-center gap-2">
          <div className="flex min-w-0 items-center justify-start">
            <Link
              href="/"
              className="text-base font-normal sm:text-xl"
              aria-label="홈"
            >
              <span className="font-bold">Jaehai</span>.Opslog
            </Link>
          </div>
          <nav className="flex items-center justify-end gap-1 sm:gap-2 md:gap-4">
            {[
              { href: '/blog', label: 'Blog' },
              { href: '/resume', label: 'Resume' },
              { href: '/contact', label: 'Contact', prefetch: false },
            ].map(({ href, label, prefetch }) => (
              <Link
                key={href}
                href={href}
                prefetch={prefetch}
                className="hover:text-primary rounded-md px-2 py-1.5 text-sm font-medium transition-colors sm:px-3 sm:py-2 sm:text-base"
              >
                {label}
              </Link>
            ))}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
