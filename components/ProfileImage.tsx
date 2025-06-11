'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import env from '@/config/env.json';

export function ProfileImage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
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

  if (!profileImage) {
    return null;
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
