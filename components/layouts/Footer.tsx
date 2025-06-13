import Link from 'next/link';
import env from '@/config/env.json';

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex h-14 items-center justify-end px-4">
        <span className="text-muted-foreground text-sm">
          {env.role} {env.title}
        </span>
        <span className="text-muted-foreground px-2 text-sm">|</span>
        <Link
          href={`mailto:${env.social_links[2].email}`}
          className="text-muted-foreground text-sm"
        >
          me@jaehai.com
        </Link>
      </div>
    </footer>
  );
}
