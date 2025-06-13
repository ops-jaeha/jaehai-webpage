import { Metadata } from 'next';
import { notionX } from '@/lib/notion';
import env from '@/config/env.json';
import ResumeNotionPageRenderer from '@/app/_components/client/ResumeNotionPageRenderer';
import type { ExtendedRecordMap } from 'notion-types';
import { Separator } from '@/components/ui/separator';
import '@/app/style/NotionPageRenderer.css';
import ProfileSection from '@/app/_components/ProfileSection';

// recordMap에서 페이지 제목 추출 함수
function getPageTitle(recordMap: ExtendedRecordMap): string {
  const pageId = Object.keys(recordMap.block).find(
    (id) => recordMap.block[id]?.value?.type === 'page'
  );

  if (!pageId) return 'Resume';

  const pageBlock = recordMap.block[pageId]?.value;
  const properties = pageBlock?.properties;

  if (properties?.title) {
    const titleArray = properties.title as Array<string | [string, Array<[string, string]>]>;
    return (
      titleArray
        .map((item) => (Array.isArray(item) ? item[0] : item))
        .join('')
        .trim() || 'Resume'
    );
  }

  return 'Resume';
}

export async function generateMetadata(): Promise<Metadata> {
  const recordMap: ExtendedRecordMap = await notionX.getPage(env.notion_ids.resume);
  const pageTitle = getPageTitle(recordMap);

  return {
    title: `${pageTitle} - ${env.title}`,
    description: `${env.user_name}의 이력서`,
    publisher: env.user_name,
    alternates: {
      canonical: '/resume',
    },
    openGraph: {
      title: `${pageTitle} - ${env.title}`,
      description: `${env.user_name}의 이력서`,
      url: '/resume',
      type: 'website',
    },
  };
}

export const revalidate = 3600;

export default async function Resume() {
  const recordMap: ExtendedRecordMap = await notionX.getPage(env.notion_ids.resume);
  const pageTitle = getPageTitle(recordMap);

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <aside>
          <div className="sticky top-[var(--sticky-top)]">
            <ProfileSection />
          </div>
        </aside>
        <section className="space-y-8">
          <div className="mb-0 space-y-4">
            <h1 className="text-3xl font-bold md:text-4xl">{pageTitle}</h1>
          </div>
          <Separator className="my-4" />
          <div>
            <ResumeNotionPageRenderer recordMap={recordMap} />
          </div>
        </section>
      </div>
    </div>
  );
}
