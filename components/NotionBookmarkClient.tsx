'use client';

import { useEffect, useState } from 'react';

interface OGData {
  title: string;
  description: string;
  image: string;
  favicon: string;
  url: string;
}

export function NotionBookmark({ url, title }: { url: string; title?: string }) {
  const [og_data, set_og_data] = useState<OGData | null>(null);
  const [is_loading, set_is_loading] = useState(true);

  useEffect(() => {
    const fetch_og_data = async () => {
      // Guard: don't call API if url is empty/undefined
      if (!url || url === 'undefined' || url.trim() === '') {
        set_is_loading(false);
        return;
      }

      try {
        const response = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
        if (response.ok) {
          const data = await response.json();
          set_og_data(data);
        }
      } catch {
        // Fallback to simple display on error
      } finally {
        set_is_loading(false);
      }
    };

    fetch_og_data();
  }, [url]);

  const display_title = title && title !== url ? title : og_data?.title || url;

  if (is_loading) {
    return (
      <div className="border-border animate-pulse rounded-md border">
        <div className="flex gap-3 p-3">
          <div className="flex-1 space-y-2">
            <div className="bg-muted h-4 w-3/4 rounded" />
            <div className="bg-muted h-3 w-full rounded" />
            <div className="bg-muted h-3 w-1/2 rounded" />
          </div>
          <div className="bg-muted h-24 w-36 shrink-0 rounded" />
        </div>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group my-2 block no-underline"
    >
      <div className="border-border hover:bg-muted/30 flex overflow-hidden rounded-md border transition-colors">
        {/* Left: Text content */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3">
          <div className="text-foreground line-clamp-2 text-sm font-semibold">{display_title}</div>
          {og_data?.description && (
            <div className="text-muted-foreground line-clamp-2 text-xs">{og_data.description}</div>
          )}
          {/* Bottom: Favicon + URL */}
          <div className="text-muted-foreground mt-auto flex items-center gap-1.5 text-xs">
            {og_data?.favicon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={og_data.favicon}
                alt=""
                width={14}
                height={14}
                className="h-3.5 w-3.5 shrink-0 rounded-sm object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <span className="truncate">{url}</span>
          </div>
        </div>
        {/* Right: Thumbnail */}
        {og_data?.image && (
          // <div className="hidden w-36 shrink-0 sm:block">
          <div className="hidden w-36 shrink-0 overflow-hidden sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={og_data.image} alt={display_title} className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </a>
  );
}
