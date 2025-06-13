'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function Header() {
  return (
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="container mx-auto flex h-[var(--header-height)] max-w-[1000px] items-center px-4 py-2">
        <div className="grid w-full grid-cols-2 items-center">
          <div className="flex items-center justify-start">
            <Link href="/" className="text-xl font-normal">
              <span className="font-bold">Jaehai</span>.Opslog
            </Link>
          </div>
          <nav className="flex items-center justify-end gap-2 sm:gap-4">
            {[
              { href: '/blog', label: 'Blog' },
              { href: '/resume', label: 'Resume' },
              { href: '/contact', label: 'Contact', prefetch: false },
            ].map(({ href, label, prefetch }) => (
              <Link
                key={href}
                href={href}
                prefetch={prefetch}
                className="hover:text-primary rounded-md px-3 py-2 font-medium transition-colors"
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
