'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import { Post } from '@/types/blog';
import { formatDate } from '@/lib/date';
import { useState, useEffect } from 'react';

interface PostCardProps {
  post: Post;
  isFirst?: boolean;
}

export function PostCard({ post, isFirst = false }: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageSrc, setCurrentImageSrc] = useState(post.thumbnail);

  const handleImageError = () => {
    console.warn('이미지 로딩 실패:', currentImageSrc);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // 썸네일이 있고 에러가 발생하지 않았을 때만 이미지 섹션 표시
  const shouldShowImageSection = post.thumbnail && post.thumbnail.trim() !== '' && !imageError;

  // 컴포넌트 마운트 시 이미지 URL 초기화
  useEffect(() => {
    if (post.thumbnail && post.thumbnail !== currentImageSrc) {
      setCurrentImageSrc(post.thumbnail);
      setImageError(false);
      setImageLoading(true);
    }
  }, [post.thumbnail, currentImageSrc]);

  return (
    <Card className="group bg-card/50 hover:border-primary/20 gap-0 overflow-hidden border p-0 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      {shouldShowImageSection && currentImageSrc && (
        <div className="relative aspect-[2/1] overflow-hidden">
          <div className="from-background/20 absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
          {imageLoading && (
            <div className="bg-muted absolute inset-0 flex items-center justify-center">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          )}
          <Image
            src={currentImageSrc}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={isFirst}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
            onLoad={handleImageLoad}
            key={currentImageSrc} // URL 변경 시 이미지 재로드
          />
        </div>
      )}
      <CardContent className="p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <h2 className="group-hover:text-primary mb-2 text-xl font-bold tracking-tight transition-colors">
          {post.title}
        </h2>
        {post.description && (
          <p className="text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
            {post.description}
          </p>
        )}
        <div className="text-muted-foreground mt-6 flex items-center gap-x-4 text-sm">
          {post.createdAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time>{formatDate(post.createdAt)}</time>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
