import SortSelect from '@/app/_components/client/SortSelect';

interface HeaderSectionProps {
  selectedTag: string;
}

export default function HeaderSection({ selectedTag }: HeaderSectionProps) {
  return (
    <div className="mb-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
        {selectedTag === '전체' ? '블로그 목록' : `${selectedTag} 관련 글`}
      </h1>
      <SortSelect />
    </div>
  );
}
