import Link from 'next/link';
import env from '@/config/env.json';

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex h-auto min-h-14 flex-wrap items-center justify-center gap-x-2 gap-y-2 py-3 sm:justify-end">
        <span className="text-muted-foreground text-xs sm:text-sm">
          {env.role} {env.title}
        </span>
        <span className="text-muted-foreground hidden text-sm sm:inline">|</span>
        <Link
          href={`mailto:${env.social_links[2].email}`}
          className="text-muted-foreground text-xs sm:text-sm"
        >
          me@jaehai.com
        </Link>
      </div>
    </footer>
  );
}
