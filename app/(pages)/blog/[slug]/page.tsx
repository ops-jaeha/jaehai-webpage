import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, User } from 'lucide-react';
import { getPostBySlug, getPublishedPosts } from '@/lib/notion';
import { formatDate } from '@/lib/date';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import env from '@/config/env.json';
import BlogNotionPageRenderer from '@/app/_components/client/BlogNotionPageRenderer';
import GiscusComments from '@/components/GiscusComments';
import Link from 'next/link';
import type { ExtendedRecordMap } from 'notion-types';
import TableOfContents from '@/app/_components/client/TableOfContents';
import '@/app/style/NotionPageRenderer.css';
import ProfileSection from '@/app/_components/ProfileSection';

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
  const { posts } = await getPublishedPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
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

// Notion 텍스트 배열 타입 정의
type NotionTextArray = Array<string | [string, Array<[string, string]>]>;

function extractTocFromRecordMap(recordMap: ExtendedRecordMap): TocEntry[] {
  const blocks = recordMap.block;
  const headingBlocks: Array<{
    id: string;
    type: string;
    title: string;
    order: number;
  }> = [];

  // 페이지의 루트 블록을 찾아서 순서대로 처리
  const pageId = Object.keys(recordMap.block).find(
    (id) => recordMap.block[id]?.value?.type === 'page'
  );

  if (!pageId) return [];

  const pageBlock = recordMap.block[pageId]?.value;
  const contentIds = pageBlock?.content || [];

  // 순서대로 헤딩 블록들을 찾아서 수집
  contentIds.forEach((blockId: string, index: number) => {
    const block = blocks[blockId];
    const blockValue = block?.value;
    if (!blockValue) return;

    const { type, properties } = blockValue;

    // 헤딩 블록 타입 확인
    if (['header', 'sub_header', 'sub_sub_header'].includes(type)) {
      // 제목 텍스트 추출
      const titleArray = properties?.title as NotionTextArray | undefined;
      if (titleArray && titleArray.length > 0) {
        const title = titleArray
          .map((item) => (Array.isArray(item) ? item[0] : item))
          .join('')
          .trim();

        if (title) {
          headingBlocks.push({
            id: blockId,
            type,
            title,
            order: index,
          });
        }
      }
    }
  });

  // 순서대로 정렬 (이미 contentIds 순서대로 처리했지만 확실히 하기 위해)
  headingBlocks.sort((a, b) => a.order - b.order);

  // TOC 엔트리로 변환
  const tocEntries: TocEntry[] = headingBlocks.map((block) => {
    const depth = getDepthFromType(block.type);
    // react-notion-x가 사용하는 ID 형식에 맞춤
    const id = block.id.replace(/-/g, '');

    return {
      id,
      value: block.title,
      depth,
    };
  });

  // 계층 구조로 변환
  return buildTocHierarchy(tocEntries);
}

function getDepthFromType(type: string): number {
  switch (type) {
    case 'header':
      return 1;
    case 'sub_header':
      return 2;
    case 'sub_sub_header':
      return 3;
    default:
      return 1;
  }
}

function buildTocHierarchy(entries: TocEntry[]): TocEntry[] {
  const result: TocEntry[] = [];
  const stack: TocEntry[] = [];

  for (const entry of entries) {
    // 현재 엔트리보다 깊이가 같거나 깊은 항목들을 스택에서 제거
    while (stack.length > 0 && stack[stack.length - 1].depth >= entry.depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      // 최상위 레벨
      result.push(entry);
    } else {
      // 부모 엔트리의 자식으로 추가
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

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const { recordMap, post } = await getPostBySlug(slug);

  if (!post || !recordMap) {
    notFound();
  }

  // recordMap에서 TOC 데이터 추출
  const tocData = extractTocFromRecordMap(recordMap);

  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 md:grid-cols-[240px_minmax(0,calc(72rem-460px))_220px]">
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
              <h1 className="text-3xl font-bold md:text-4xl">{post.title}</h1>
            </div>

            <div className="text-muted-foreground flex gap-4 text-sm">
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

          <div>
            <BlogNotionPageRenderer recordMap={recordMap} />
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
