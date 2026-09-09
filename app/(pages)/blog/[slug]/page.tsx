import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User } from 'lucide-react';
import { getPostBySlug, getPublishedPosts } from '@/lib/notion';
import { formatDate } from '@/lib/date';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import env from '@/config/env.json';
import GiscusComments from '@/components/GiscusComments';
import TableOfContents from '@/app/_components/client/TableOfContents';
import ProfileSection from '@/app/_components/ProfileSection';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await getPostBySlug(slug);

  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다',
      description: '요청하신 블로그 포스트를 찾을 수 없습니다.',
    };
  }

  return {
    title: post.title,
    description: post.description || `${post.title} - ${env.title}`,
    keywords: post.tags,
    authors: [{ name: env.user_name }],
    publisher: env.user_name,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.modifiedAt,
      authors: env.user_name,
      tags: post.tags,
    },
  };
}

export const generateStaticParams = async () => {
  try {
    const { posts } = await getPublishedPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch {
    return [];
  }
};

export const revalidate = 60;

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

interface TocEntry {
  value: string;
  depth: number;
  id?: string;
  children?: Array<TocEntry>;
}

function extractTocFromMarkdown(markdown: string): TocEntry[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const rawHeadings: Array<{ depth: number; title: string; id: string }> = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const depth = match[1].length;
    const title = match[2]
      .trim()
      .replace(/\*\*|__/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    const id = title
      .toLowerCase()
      .replace(/[^\w\sㄱ-ㅎ가-힣-]/g, '')
      .replace(/\s+/g, '-');

    rawHeadings.push({
      depth,
      title,
      id,
    });
  }

  const result: TocEntry[] = [];
  const stack: TocEntry[] = [];

  for (const h of rawHeadings) {
    const entry: TocEntry = {
      value: h.title,
      depth: h.depth,
      id: h.id,
    };

    while (stack.length > 0 && stack[stack.length - 1].depth >= entry.depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      result.push(entry);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(entry);
    }

    stack.push(entry);
  }

  return result;
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const { markdown, post } = await getPostBySlug(slug);

  if (!post || !markdown) {
    notFound();
  }

  const tocData = extractTocFromMarkdown(markdown!);

  return (
    <div className="container py-6 sm:py-8">
      <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)_220px] lg:grid-cols-[260px_minmax(0,1fr)_240px]">
        <aside className="order-2 md:order-none">
          <div className="sticky top-[var(--sticky-top)]">
            <ProfileSection />
          </div>
        </aside>
        <section className="order-3 space-y-8 md:order-none">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                {post.tags?.map((tag) => <Badge key={tag}>{tag}</Badge>)}
              </div>
              <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">{post.title}</h1>
            </div>

            <div className="text-muted-foreground flex flex-wrap gap-3 gap-y-1 text-xs sm:gap-4 sm:text-sm">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{env.user_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* 모바일 전용 목차 */}
          <TableOfContents tocData={tocData} isMobile={true} />

          <div className="bg-card/20 rounded-xl border p-4 shadow-sm backdrop-blur-sm sm:p-8">
            <MarkdownRenderer content={markdown} />
          </div>

          <Separator className="my-16" />

          <GiscusComments />
        </section>
        <aside className="order-1 flex flex-col gap-6 md:order-none">
          <div className="sticky top-[var(--sticky-top)]">
            <TableOfContents tocData={tocData} isMobile={false} />
          </div>
        </aside>
      </div>
    </div>
  );
}
