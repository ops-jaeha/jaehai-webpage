import { Metadata } from 'next';
import { getResumeMarkdown, getResumePage } from '@/lib/notion';
import env from '@/config/env.json';
import { Separator } from '@/components/ui/separator';
import ProfileSection from '@/app/_components/ProfileSection';
import MarkdownRenderer from '@/components/MarkdownRenderer';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getResumePage();
  const pageTitle = page?.title || 'Resume';

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

export default async function Resume() {
  const [markdown, page] = await Promise.all([getResumeMarkdown(), getResumePage()]);
  const pageTitle = page?.title || 'Resume';

  if (!markdown) {
    return (
      <div className="container py-6 sm:py-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside>
            <div className="sticky top-[var(--sticky-top)]">
              <ProfileSection />
            </div>
          </aside>
          <section className="space-y-8">
            <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">Resume</h1>
            <Separator className="my-4" />
            <p className="text-muted-foreground">이력서를 불러올 수 없습니다.</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 sm:py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside>
          <div className="sticky top-[var(--sticky-top)]">
            <ProfileSection />
          </div>
        </aside>
        <section className="space-y-8">
          <div className="mb-0 space-y-4">
            <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">{pageTitle}</h1>
          </div>
          <Separator className="my-4" />
          <div className="bg-card/30 rounded-xl p-6 md:p-8 border shadow-sm backdrop-blur-sm">
            <MarkdownRenderer content={markdown} />
          </div>
        </section>
      </div>
    </div>
  );
}
