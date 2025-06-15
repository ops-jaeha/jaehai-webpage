import { Client } from '@notionhq/client';
import type { Post, TagFilterItem } from '@/types/blog';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionAPI } from 'notion-client';
import { unstable_cache } from 'next/cache';
import env from '@/config/env.json';
import type { ExtendedRecordMap } from 'notion-types';

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const notionX = new NotionAPI({
  authToken: process.env.NOTION_TOKEN,
});

// URL이 만료되었는지 확인하는 함수
function isUrlExpired(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const expires = urlObj.searchParams.get('X-Amz-Expires');
    const dateParam = urlObj.searchParams.get('X-Amz-Date');

    if (!expires || !dateParam) return false;

    // X-Amz-Date 파싱 (YYYYMMDDTHHMMSSZ 형식)
    const year = parseInt(dateParam.slice(0, 4));
    const month = parseInt(dateParam.slice(4, 6)) - 1; // 월은 0부터 시작
    const day = parseInt(dateParam.slice(6, 8));
    const hour = parseInt(dateParam.slice(9, 11));
    const minute = parseInt(dateParam.slice(11, 13));
    const second = parseInt(dateParam.slice(13, 15));

    const signedTime = new Date(year, month, day, hour, minute, second);
    const expirationTime = new Date(signedTime.getTime() + parseInt(expires) * 1000);

    return Date.now() > expirationTime.getTime();
  } catch {
    return false;
  }
}

function getCoverImage(cover: PageObjectResponse['cover']): string {
  if (!cover) return '';

  switch (cover.type) {
    case 'external':
      return cover.external.url;
    case 'file':
      // Notion 파일 URL의 만료 여부 확인
      const fileUrl = cover.file.url;
      if (isUrlExpired(fileUrl)) {
        console.warn('Notion 이미지 URL이 만료됨:', fileUrl);
        return ''; // 만료된 URL은 빈 문자열로 반환
      }
      return fileUrl;
    default:
      return '';
  }
}

function getPostMetadata(page: PageObjectResponse): Post {
  const { properties } = page;

  return {
    id: page.id,
    title: properties.title.type === 'title' ? (properties.title.title[0]?.plain_text ?? '') : '',
    description:
      properties.description.type === 'rich_text'
        ? (properties.description.rich_text[0]?.plain_text ?? '')
        : '',
    thumbnail: getCoverImage(page.cover),
    tags:
      properties.tags.type === 'multi_select'
        ? properties.tags.multi_select.map((tag) => tag.name)
        : [],
    createdAt: properties.createdAt.type === 'date' ? (properties.createdAt.date?.start ?? '') : '',
    modifiedAt: page.last_edited_time,
    slug:
      properties.slug.type === 'rich_text' ? (properties.slug.rich_text[0]?.plain_text ?? '') : '',
  };
}

// getPostBySlug 함수를 RecordMap을 반환하도록 수정
export const getPostBySlug = async (
  slug: string
): Promise<{
  recordMap: ExtendedRecordMap | null;
  post: Post | null;
}> => {
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
    return {
      recordMap: null,
      post: null,
    };
  }

  // notion-client를 사용해 페이지의 전체 콘텐츠(RecordMap)를 가져옵니다.
  const recordMap = await notionX.getPage(page.id);

  return {
    recordMap,
    post: getPostMetadata(page),
  };
};

// --- 아래 코드는 기존 코드와 동일합니다 ---

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

export const getPublishedPosts = unstable_cache(
  async ({
    tag = '전체',
    sort = 'latest',
    pageSize = 10,
    startCursor,
  }: GetPublishedPostsParams = {}): Promise<GetPublishedPostsResponse> => {
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

    const posts = response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map(getPostMetadata);

    return {
      posts,
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    };
  },
  undefined,
  {
    tags: ['posts'],
    revalidate: 1800, // 30분마다 새로고침하여 이미지 URL 만료 문제 완화
  }
);

export const getTags = async (): Promise<TagFilterItem[]> => {
  const { posts } = await getPublishedPosts({ pageSize: 100 });

  const tagCount = posts.reduce(
    (acc, post) => {
      post.tags?.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  const tags: TagFilterItem[] = Object.entries(tagCount).map(([name, count]) => ({
    id: name,
    name,
    count,
  }));

  tags.unshift({
    id: 'all',
    name: '전체',
    count: posts.length,
  });

  const [allTag, ...restTags] = tags;
  const sortedTags = restTags.sort((a, b) => a.name.localeCompare(b.name));

  return [allTag, ...sortedTags];
};

export interface CreatePostParams {
  title: string;
  tag: string;
  content: string;
}

export const createPost = async ({ title, tag, content }: CreatePostParams) => {
  const response = await notion.pages.create({
    parent: {
      database_id: env.notion_ids.posts,
    },
    properties: {
      title: {
        title: [
          {
            text: {
              content: title,
            },
          },
        ],
      },
      description: {
        rich_text: [
          {
            text: {
              content: content,
            },
          },
        ],
      },
      tags: {
        multi_select: [{ name: tag }],
      },
      status: {
        select: {
          name: 'Public',
        },
      },
      createdAt: {
        date: {
          start: new Date().toISOString(),
        },
      },
    },
  });

  return response;
};
