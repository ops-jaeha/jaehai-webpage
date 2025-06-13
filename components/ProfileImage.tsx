'use client';

import Image from 'next/image';
import * as React from 'react';
import env from '@/config/env.json';

export function ProfileImage() {
  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    fetch(`https://api.github.com/users/${env.social_links[0].github_id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`GitHub API 응답 에러: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.avatar_url) {
          setProfileImage(data.avatar_url);
        } else {
          console.warn('GitHub API에 avatar_url이 없습니다:', data);
        }
      })
      .catch((err) => {
        console.error('GitHub 프로필 이미지 fetch 중 오류 발생:', err);
      });
  }, []);

  if (!mounted) {
    return <div className="bg-muted-foreground/20 h-36 w-36 animate-pulse rounded-full"></div>;
  }

  if (!profileImage) {
    return <div className="bg-muted-foreground/20 h-36 w-36 animate-pulse rounded-full"></div>;
  }

  return (
    <Image
      src={profileImage}
      alt="Profile Image"
      width={144}
      height={144}
      className="rounded-full object-cover"
    />
  );
}
