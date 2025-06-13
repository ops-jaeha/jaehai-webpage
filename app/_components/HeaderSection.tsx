import SortSelect from '@/app/_components/client/SortSelect';

interface HeaderSectionProps {
  selectedTag: string;
}

export default function HeaderSection({ selectedTag }: HeaderSectionProps) {
  return (
    <div className="mb-0 flex items-center justify-between">
      <h1 className="text-4xl font-bold tracking-tight">
        {selectedTag === '전체' ? '블로그 목록' : `${selectedTag} 관련 글`}
      </h1>
      <SortSelect />
    </div>
  );
}
