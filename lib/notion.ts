import { Client } from '@notionhq/client';
import type { Post, TagFilterItem } from '@/types/blog';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionToMarkdown } from 'notion-to-md';
import { unstable_cache } from 'next/cache';
import env from '@/config/env.json';

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});
const n2m = new NotionToMarkdown({ notionClient: notion });

function getPostMetadata(page: PageObjectResponse): Post {
  const { properties } = page;

  const getCoverImage = (cover: PageObjectResponse['cover']) => {
    if (!cover) return '';

    switch (cover.type) {
      case 'external':
        return cover.external.url;
      case 'file':
        return cover.file.url;
      default:
        return '';
    }
  };

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

export const getPostBySlug = async (
  slug: string
): Promise<{
  markdown: string;
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

  if (!response.results[0]) {
    return {
      markdown: '',
      post: null,
    };
  }

  const mdBlocks = await n2m.pageToMarkdown(response.results[0].id);
  const { parent } = n2m.toMarkdownString(mdBlocks);

  return {
    markdown: parent,
    post: getPostMetadata(response.results[0] as PageObjectResponse),
  };
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
  }
);

export const getTags = async (): Promise<TagFilterItem[]> => {
  const { posts } = await getPublishedPosts({ pageSize: 100 });

  // 모든 태그를 추출하고 각 태그의 출현 횟수를 계산
  const tagCount = posts.reduce(
    (acc, post) => {
      post.tags?.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>
  );

  // TagFilterItem 형식으로 변환
  const tags: TagFilterItem[] = Object.entries(tagCount).map(([name, count]) => ({
    id: name,
    name,
    count,
  }));

  // "전체" 태그 추가
  tags.unshift({
    id: 'all',
    name: '전체',
    count: posts.length,
  });

  // 태그 이름 기준으로 정렬 ("전체" 태그는 항상 첫 번째에 위치하도록 제외)
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
