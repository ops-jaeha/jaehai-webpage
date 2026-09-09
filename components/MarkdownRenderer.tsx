import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { NotionBookmark } from '@/components/NotionBookmarkClient';
import { decode_component_data } from '@/lib/mdx-component-data';

interface CalloutData {
  icon?: string;
  title?: string;
}

// Custom Callout Component
export function NotionCallout({
  data,
  children,
}: {
  data?: string;
  children?: React.ReactNode;
}) {
  const callout = decode_component_data<CalloutData>(data);
  const icon = callout?.icon || '📝';
  const title = callout?.title;

  return (
    <div className="notion-callout">
      <div className="notion-callout-icon">{icon}</div>
      <div className="notion-callout-content">
        {title && <div className="text-foreground font-semibold">{title}</div>}
        {children}
      </div>
    </div>
  );
}

// Custom Column Layout Components
export function NotionColumnList({ children }: { children: React.ReactNode }) {
  return <div className="notion-column-list">{children}</div>;
}

export function NotionColumn({ children }: { children: React.ReactNode }) {
  return <div className="notion-column">{children}</div>;
}

const components = {
  NotionCallout,
  NotionBookmark,
  NotionColumnList,
  NotionColumn,
  img: (props: ComponentPropsWithoutRef<'img'>) => {
    const { src, alt } = props;
    if (!src) return null;
    return (
      <span className="my-6 block overflow-hidden rounded-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || ''}
          loading="lazy"
          className="mx-auto max-h-[600px] w-auto max-w-full rounded-lg object-contain shadow-md"
        />
      </span>
    );
  },
  a: (props: ComponentPropsWithoutRef<'a'>) => {
    const { href, children, ...rest } = props;
    if (href?.startsWith('/')) {
      return (
        <Link href={href} {...rest} className="text-primary hover:underline">
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
        className="text-primary hover:underline"
      >
        {children}
      </a>
    );
  },
  h1: (props: ComponentPropsWithoutRef<'h1'>) => (
    <h1
      {...props}
      className="mt-8 mb-4 scroll-m-20 text-2xl font-bold tracking-tight sm:text-3xl"
    />
  ),
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      {...props}
      className="mt-8 mb-3 scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight sm:text-2xl"
    />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      {...props}
      className="mt-6 mb-2 scroll-m-20 text-lg font-semibold tracking-tight sm:text-xl"
    />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p {...props} className="text-foreground/90 leading-7 [&:not(:first-child)]:mt-4" />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul {...props} className="my-4 ml-6 list-disc [&>li]:mt-2" />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol {...props} className="my-4 ml-6 list-decimal [&>li]:mt-2" />
  ),
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      {...props}
      className="border-primary/50 text-muted-foreground mt-6 border-l-4 pl-4 italic"
    />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => {
    const isInline = !props.className?.includes('language-');
    if (isInline) {
      return (
        <code className="bg-muted text-primary rounded px-1.5 py-0.5 font-mono text-sm font-medium">
          {props.children}
        </code>
      );
    }
    return (
      <code {...props} className="font-mono text-sm">
        {props.children}
      </code>
    );
  },
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      {...props}
      className="my-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 font-mono text-sm text-zinc-100 dark:bg-zinc-950"
    />
  ),
  table: (props: ComponentPropsWithoutRef<'table'>) => (
    <div className="my-6 w-full overflow-x-auto">
      <table {...props} className="w-full border-collapse text-sm" />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th {...props} className="border-border bg-muted border px-4 py-2 text-left font-bold" />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td {...props} className="border-border border px-4 py-2 text-left" />
  ),
  div: ({
    className,
    class: rawClass,
    ...props
  }: ComponentPropsWithoutRef<'div'> & { class?: string }) => (
    <div {...props} className={className || rawClass} />
  ),
};

export default function MarkdownRenderer({ content }: { content: string }) {
  if (!content) {
    return <p className="text-muted-foreground">내용이 없습니다.</p>;
  }

  return (
    <article className="prose dark:prose-invert max-w-none leading-relaxed break-words">
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
        components={components}
      />
    </article>
  );
}
