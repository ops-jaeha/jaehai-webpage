import Link from 'next/link';
import { PostCard } from '@/components/features/blog/PostCard';
import { GetPublishedPostsResponse } from '@/lib/notion';
import { use } from 'react';

interface PostListProps {
  postsPromise: Promise<GetPublishedPostsResponse>;
}

export default function PostList({ postsPromise }: PostListProps) {
  const { posts } = use(postsPromise);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {posts.map((post, index) => (
          <Link href={`/blog/${post.slug}`} key={post.id}>
            <PostCard post={post} isFirst={index === 0} />
          </Link>
        ))}
      </div>
    </div>
  );
}
