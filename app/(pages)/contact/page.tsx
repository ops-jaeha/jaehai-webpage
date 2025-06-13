import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactLinksClient } from '@/app/_components/client/ContactLinksClient';
import env from '@/config/env.json';
import ProfileSection from '@/app/_components/ProfileSection';

export const metadata: Metadata = {
  title: `Contact - ${env.title}`,
  description: `${env.user_name}에게 연락하기`,
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: `Contact - ${env.title}`,
    description: `${env.user_name}에게 연락하기`,
    url: '/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto flex max-w-lg items-start py-8">
      <div className="grid gap-6 md:grid-cols-[240px_minmax(0,calc(72rem-240px))]">
        <aside className="order-2 md:order-none">
          <div className="sticky top-[var(--sticky-top)]">
            <ProfileSection />
          </div>
        </aside>
        <div className="order-3 space-y-8 md:order-none">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="py-2">{env.title}</CardTitle>
              <CardTitle className="py-2 text-3xl font-bold">Contact Me</CardTitle>
              <CardDescription className="py-2">
                궁금한 점이 있으시면 아래 플랫폼으로 편하게 연락주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactLinksClient />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
