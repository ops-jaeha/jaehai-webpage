import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import type { Post, TagFilterItem } from '@/types/blog';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import env from '@/config/env.json';

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const n2m = new NotionToMarkdown({
  notionClient: notion,
});

// Sleep utility to avoid rate limiting
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch with retry on rate limit
const fetch_with_retry = async <T>(
  fn: () => Promise<T>,
  retry_count: number = 3,
  delay_ms: number = 1000
): Promise<T> => {
  for (let attempt = 0; attempt < retry_count; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const is_rate_limited =
        error instanceof Error && error.message.toLowerCase().includes('rate limit');

      if (is_rate_limited && attempt < retry_count - 1) {
        const wait_ms = delay_ms * Math.pow(2, attempt); // Exponential backoff
        console.warn(
          'Notion rate limited, retrying in %s ms (attempt %s/%s)',
          wait_ms,
          attempt + 1,
          retry_count
        );
        await sleep(wait_ms);
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retry attempts reached');
};

// 이미지 블록을 프록시 URL로 변환하여 Notion S3 만료 방지
n2m.setCustomTransformer('image', async (block) => {
  const image = (
    block as {
      image?: {
        type: string;
        file?: { url: string };
        external?: { url: string };
        caption?: Array<{ plain_text: string }>;
      };
    }
  ).image;
  if (!image) return '';
  const caption = image.caption?.map((c) => c.plain_text).join('') || '';
  const url =
    image.type === 'external' && image.external?.url
      ? image.external.url
      : `/api/notion-image?blockId=${block.id}`;
  return `![${caption}](${url})`;
});

// Notion의 다단 컬럼(column_list & column) 레이아웃 지원
n2m.setCustomTransformer('column_list', async (block) => {
  await sleep(300); // Delay before recursive call
  const mdBlocks = await fetch_with_retry(() => n2m.pageToMarkdown(block.id));
  const childContent = n2m.toMarkdownString(mdBlocks);
  return `\n\n<NotionColumnList>\n\n${childContent.parent}\n\n</NotionColumnList>\n\n`;
});

n2m.setCustomTransformer('column', async (block) => {
  await sleep(300); // Delay before recursive call
  const mdBlocks = await fetch_with_retry(() => n2m.pageToMarkdown(block.id));
  const childContent = n2m.toMarkdownString(mdBlocks);
  return `\n\n<NotionColumn>\n\n${childContent.parent}\n\n</NotionColumn>\n\n`;
});

// Notion 콜아웃(callout) 박스 지원
n2m.setCustomTransformer('callout', async (block) => {
  const callout = (
    block as { callout?: { icon?: { emoji?: string }; rich_text?: Array<{ plain_text: string }> } }
  ).callout;
  const icon = callout?.icon?.emoji || '📝';
  const title = callout?.rich_text?.map((t) => t.plain_text).join('') || '';
  let children_content = '';

  // Type guard: has_children only exists on full BlockObjectResponse
  const has_children = 'has_children' in block && block.has_children === true;

  if (has_children) {
    await sleep(300); // Delay before recursive call
    const mdBlocks = await fetch_with_retry(() => n2m.pageToMarkdown(block.id));
    const childContent = n2m.toMarkdownString(mdBlocks);
    children_content = childContent.parent;
  }

  const safe_title = JSON.stringify(title);
  const safe_icon = JSON.stringify(icon);

  return `\n\n<NotionCallout icon={${safe_icon}} title={${safe_title}}>\n\n${children_content}\n\n</NotionCallout>\n\n`;
});

// Notion 북마크(bookmark) 및 link_preview 링크 카드 지원
n2m.setCustomTransformer('bookmark', async (block) => {
  const bookmark = (
    block as { bookmark?: { url?: string; caption?: Array<{ plain_text: string }> } }
  ).bookmark;
  const url = bookmark?.url || '';
  const caption = bookmark?.caption?.map((c) => c.plain_text).join('') || url;

  if (!url) return '';

  const safe_url = JSON.stringify(url);
  const safe_caption = JSON.stringify(caption);

  return `\n\n<NotionBookmark url={${safe_url}} title={${safe_caption}} />\n\n`;
});

n2m.setCustomTransformer('link_preview', async (block) => {
  const link_preview = (block as { link_preview?: { url?: string } }).link_preview;
  const url = link_preview?.url || '';

  if (!url) return '';

  const safe_url = JSON.stringify(url);

  return `\n\n<NotionBookmark url={${safe_url}} title={${safe_url}} />\n\n`;
});

/** 이력서 페이지의 Markdown 콘텐츠 조회 */
export async function getResumeMarkdown(): Promise<string | null> {
  try {
    const mdblocks = await fetch_with_retry(() => n2m.pageToMarkdown(env.notion_ids.resume));
    const mdString = n2m.toMarkdownString(mdblocks);
    return mdString.parent || '';
  } catch (error) {
    console.error('[getResumeMarkdown error]:', error);
    return null;
  }
}

/** 이력서 페이지 메타데이터/제목 조회 */
export async function getResumePage(): Promise<{ title: string } | null> {
  try {
    const page = (await notion.pages.retrieve({
      page_id: env.notion_ids.resume,
    })) as PageObjectResponse;
    if (!page || !('properties' in page)) return { title: 'Resume' };
    const titleProp = page.properties.title;
    const title =
      titleProp?.type === 'title' ? (titleProp.title[0]?.plain_text ?? 'Resume') : 'Resume';
    return { title };
  } catch (error) {
    console.error('[getResumePage error]:', error);
    return null;
  }
}

function getCoverImage(pageId: string, cover: PageObjectResponse['cover']): string {
  if (!cover) return '';

  switch (cover.type) {
    case 'external':
      return cover.external.url;
    case 'file':
      return `/api/notion-image?pageId=${encodeURIComponent(pageId)}`;
    default:
      return '';
  }
}

function getPostMetadata(page: PageObjectResponse): Post {
  const { properties } = page;

  return {
    id: page.id,
    title: properties.title?.type === 'title' ? (properties.title.title[0]?.plain_text ?? '') : '',
    description:
      properties.description?.type === 'rich_text'
        ? (properties.description.rich_text[0]?.plain_text ?? '')
        : '',
    thumbnail: getCoverImage(page.id, page.cover),
    tags:
      properties.tags?.type === 'multi_select'
        ? properties.tags.multi_select.map((tag) => tag.name)
        : [],
    createdAt:
      properties.createdAt?.type === 'date' ? (properties.createdAt.date?.start ?? '') : '',
    modifiedAt: page.last_edited_time,
    slug:
      properties.slug?.type === 'rich_text' ? (properties.slug.rich_text[0]?.plain_text ?? '') : '',
  };
}

/** Slug를 통한 블로그 상세 내용(Markdown) 및 메타데이터 조회 */
export const getPostBySlug = async (
  slug: string
): Promise<{
  markdown: string | null;
  post: Post | null;
}> => {
  try {
    const response = await notion.databases.query({
      database_id: env.notion_ids.posts,
      filter: {
        and: [
          {
            property: 'slug',
            rich_text: {
              equals: slug,
            },
          },
          {
            property: 'status',
            select: {
              equals: 'Public',
            },
          },
        ],
      },
    });

    const page = response.results[0] as PageObjectResponse | undefined;

    if (!page) {
      return { markdown: null, post: null };
    }

    const mdblocks = await fetch_with_retry(() => n2m.pageToMarkdown(page.id));
    const mdString = n2m.toMarkdownString(mdblocks);

    return {
      markdown: mdString.parent || '',
      post: getPostMetadata(page),
    };
  } catch (error) {
    console.error('[getPostBySlug error for slug=%s]:', slug, error);
    return { markdown: null, post: null };
  }
};

export interface GetPublishedPostsParams {
  tag?: string;
  sort?: string;
  pageSize?: number;
  startCursor?: string;
}

export interface GetPublishedPostsResponse {
  posts: Post[];
  hasMore: boolean;
  nextCursor: string | null;
}

export const getPublishedPosts = async ({
  tag = '전체',
  sort = 'latest',
  pageSize = 10,
  startCursor,
}: GetPublishedPostsParams = {}): Promise<GetPublishedPostsResponse> => {
  try {
    const response = await notion.databases.query({
      database_id: env.notion_ids.posts,
      filter: {
        and: [
          {
            property: 'status',
            select: {
              equals: 'Public',
            },
          },
          {
            property: 'type',
            select: {
              equals: 'Post',
            },
          },
          ...(tag && tag !== '전체'
            ? [
                {
                  property: 'tags',
                  multi_select: {
                    contains: tag,
                  },
                },
              ]
            : []),
        ],
      },
      sorts: [
        {
          property: 'createdAt',
          direction: sort === 'latest' ? 'descending' : 'ascending',
        },
      ],
      page_size: pageSize,
      start_cursor: startCursor,
    });

    const post_list = response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map(getPostMetadata)
      .filter((post) => Boolean(post.slug));

    return {
      posts: post_list,
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    };
  } catch {
    return { posts: [], hasMore: false, nextCursor: null };
  }
};

export const getTags = async (): Promise<TagFilterItem[]> => {
  try {
    const { posts } = await getPublishedPosts({ pageSize: 100 });

    const tag_count = posts.reduce(
      (acc, post) => {
        post.tags?.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>
    );

    const tag_list: TagFilterItem[] = Object.entries(tag_count).map(([name, count]) => ({
      id: name,
      name,
      count,
    }));

    tag_list.unshift({
      id: 'all',
      name: '전체',
      count: posts.length,
    });

    const [all_tag, ...rest_tag_list] = tag_list;
    const sorted_tag_list = rest_tag_list.sort((a, b) => a.name.localeCompare(b.name));

    return [all_tag, ...sorted_tag_list];
  } catch {
    return [{ id: 'all', name: '전체', count: 0 }];
  }
};
