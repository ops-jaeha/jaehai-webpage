'use client';

import Link from 'next/link';

interface TocEntry {
  value: string;
  depth: number;
  id?: string;
  children?: Array<TocEntry>;
}

interface TableOfContentsProps {
  tocData: TocEntry[];
  isMobile?: boolean;
}

function TableOfContentsLink({ item }: { item: TocEntry }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetElement = document.getElementById(item.id!);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      // URL 업데이트
      window.history.pushState(null, '', `#${item.id}`);
    }
  };

  return (
    <div className="space-y-2">
      <Link
        href={`#${item.id}`}
        onClick={handleClick}
        className={`hover:text-foreground text-muted-foreground block font-medium transition-colors ${
          item.depth === 1 ? 'text-sm' : item.depth === 2 ? 'pl-2 text-xs' : 'pl-4 text-xs'
        }`}
      >
        {item.value}
      </Link>
      {item.children && item.children.length > 0 && (
        <div className="space-y-2">
          {item.children.map((subItem) => (
            <TableOfContentsLink key={subItem.id} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TableOfContents({ tocData, isMobile = false }: TableOfContentsProps) {
  if (tocData.length === 0) return null;

  if (isMobile) {
    return (
      <div className="sticky top-[var(--sticky-top)] mb-6 md:hidden">
        <details className="bg-muted/60 rounded-lg p-4 backdrop-blur-sm">
          <summary className="cursor-pointer text-lg font-semibold">목차</summary>
          <nav className="mt-3 space-y-3 text-sm">
            {tocData.map((item) => (
              <TableOfContentsLink key={item.id} item={item} />
            ))}
          </nav>
        </details>
      </div>
    );
  }

  return (
    <div className="bg-muted/60 space-y-4 rounded-lg p-6 backdrop-blur-sm">
      <h3 className="text-lg font-semibold">목차</h3>
      <nav className="space-y-3 text-sm">
        {tocData.map((item) => (
          <TableOfContentsLink key={item.id} item={item} />
        ))}
      </nav>
    </div>
  );
}
