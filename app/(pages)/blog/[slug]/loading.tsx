import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container py-6 md:py-8 lg:py-12">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr_220px] md:gap-8">
        <aside className="space-y-4">
          {/* 프로필 섹션 스켈레톤 */}
          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex justify-center gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8" />
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-8">
          {/* 헤더 */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[180px]" />
          </div>

          {/* 메인 이미지 */}
          <Skeleton className="aspect-video w-full rounded-lg" />

          {/* 본문 컨텐츠 */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* 우측 사이드바 스켈레톤 */}
        <aside className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
