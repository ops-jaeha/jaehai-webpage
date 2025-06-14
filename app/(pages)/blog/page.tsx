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

// Static export 모드 호환성을 위한 설정
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: env.title,
  description: env.introduce_sidebar,
  alternates: {
    canonical: '/blog',
  },
};

export default async function Blog() {
  const tags = getTags();
  const postsPromise = getPublishedPosts({
    tag: '전체',
    sort: 'latest',
    pageSize: 100,
  });

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr_220px]">
        {/* 좌측 사이드바 */}
        <aside>
          <div className="sticky top-[var(--sticky-top)]">
            <ProfileSection />
          </div>
        </aside>
        <div className="order-3 space-y-8 md:order-none">
          {/* 섹션 제목 */}
          <HeaderSection selectedTag="전체" />
          <Separator className="my-4" />
          {/* 블로그 카드 그리드 */}
          <Suspense fallback={<PostListSkeleton />}>
            <PostListSuspense postsPromise={postsPromise} />
          </Suspense>
        </div>
        {/* 우측 사이드바 */}
        <aside className="order-1 flex flex-col gap-6 md:order-none">
          <div className="sticky top-[var(--sticky-top)]">
            <Suspense fallback={<TagSectionSkeleton />}>
              <TagSectionClient tags={tags} selectedTag="전체" />
            </Suspense>
          </div>
        </aside>
      </div>
    </div>
  );
}
