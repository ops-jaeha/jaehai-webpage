import ProfileSection from '@/app/_components/ProfileSection';
import { getTags, getPublishedPosts } from '@/lib/notion';
import HeaderSection from '@/app/_components/HeaderSection';
import PostListSuspense from '@/components/features/blog/PostListSuspense';
import { Suspense } from 'react';
import TagSectionClient from '@/app/_components/TagSection.client';
import PostListSkeleton from '@/components/features/blog/PostListSkeleton';
import TagSectionSkeleton from '@/app/_components/TagSectionSkeleton';
import { Metadata } from 'next';
import env from '@/config/env.json';
import { Separator } from '@/components/ui/separator';

// 매 요청마다 노션에서 최신 글 목록을 새로 가져오도록 캐시를 사용하지 않음
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: env.title,
  description: env.introduce_sidebar,
  alternates: {
    canonical: '/blog',
  },
};

interface BlogProps {
  searchParams: Promise<{ tag?: string; sort?: string }>;
}

export default async function Blog({ searchParams }: BlogProps) {
  const { tag, sort } = await searchParams;
  const selectedTag = tag || '전체';
  const selectedSort = sort || 'latest';

  const tags = getTags();
  const postsPromise = getPublishedPosts({
    tag: selectedTag,
    sort: selectedSort,
    pageSize: 100,
  });

  return (
    <div className="container py-6 sm:py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr_220px] lg:grid-cols-[260px_1fr_240px]">
        {/* 좌측 사이드바 */}
        <aside>
          <div className="sticky top-[var(--sticky-top)]">
            <ProfileSection />
          </div>
        </aside>
        <div className="order-3 space-y-8 md:order-none">
          {/* 섹션 제목 */}
          <HeaderSection selectedTag={selectedTag} />
          <Separator className="my-4" />
          {/* 블로그 카드 그리드 */}
          <Suspense key={`${selectedTag}-${selectedSort}`} fallback={<PostListSkeleton />}>
            <PostListSuspense postsPromise={postsPromise} />
          </Suspense>
        </div>
        {/* 우측 사이드바 */}
        <aside className="order-1 flex flex-col gap-6 md:order-none">
          <div className="sticky top-[var(--sticky-top)]">
            <Suspense fallback={<TagSectionSkeleton />}>
              <TagSectionClient tags={tags} selectedTag={selectedTag} />
            </Suspense>
          </div>
        </aside>
      </div>
    </div>
  );
}
