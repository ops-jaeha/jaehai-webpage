import { decode_component_data } from '@/lib/mdx-component-data';

interface BookmarkData {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
}

export function NotionBookmark({ data }: { data?: string }) {
  const bookmark = decode_component_data<BookmarkData>(data);
  const url = bookmark?.url;
  if (!url) return null;

  const { title, description, image, favicon } = bookmark;
  const display_title = title && title !== url ? title : url;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group my-4 block no-underline"
    >
      {/*
        not-prose: 이 카드는 부모 `.prose`(Tailwind Typography) 안에 렌더링되는데,
        prose가 img/p 등에 거는 기본 margin·line-height 규칙이 카드 레이아웃을
        깨뜨린다(예: img에 margin-top: 2em이 붙어 썸네일이 카드 밖으로 넘침).
        not-prose로 이 서브트리 전체를 prose 캐스케이드에서 제외한다.
      */}
      <div className="not-prose border-border hover:bg-muted/30 flex h-28 overflow-hidden rounded-md border transition-colors">
        {/* Left: Text content */}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-3">
          {/*
            flex 아이템에 `overflow: hidden`(truncate/line-clamp가 설정)이 걸리면
            자동 최소 높이가 0으로 바뀌어, 부모 높이가 모자랄 때 컨텐츠 자체가
            짜부라져 글자가 반토막으로 잘려 보인다. shrink-0으로 각 줄이 항상
            자기 컨텐츠 높이를 유지하게 해서, 컨텐츠가 넘칠 땐 카드(overflow-hidden)가
            맨 아래 줄부터 깔끔하게 잘라내도록 한다 - 글자가 짜부라지는 것보다 낫다.
          */}
          <div className="text-foreground shrink-0 truncate text-sm font-semibold">
            {display_title}
          </div>
          {description && (
            <div className="text-muted-foreground line-clamp-2 shrink-0 text-xs">
              {description}
            </div>
          )}
          {/* Bottom: Favicon + URL */}
          <div className="text-muted-foreground flex shrink-0 items-center gap-1.5 text-xs">
            {favicon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={favicon}
                alt=""
                width={14}
                height={14}
                className="h-3.5 w-3.5 shrink-0 rounded-sm object-contain"
              />
            )}
            <span className="truncate">{url}</span>
          </div>
        </div>
        {/* Right: Thumbnail overlay, Notion 스타일 (좁은 화면에서는 숨김) */}
        {image && (
          <div className="hidden w-36 shrink-0 sm:block sm:w-44">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="" className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </a>
  );
}
