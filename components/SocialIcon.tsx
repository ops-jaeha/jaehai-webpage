'use client';

import Image from 'next/image';

interface SocialIconProps {
  /** 라이트 모드용 src */
  lightSrc: string;
  /** 다크 모드용 src */
  darkSrc: string;
  alt: string;
}

export function SocialIcon({ lightSrc, darkSrc, alt }: SocialIconProps) {
  return (
    <>
      {/* 라이트 모드 */}
      <Image
        src={lightSrc}
        alt={alt}
        width={16}
        height={16}
        className="block object-cover dark:hidden"
      />
      {/* 다크 모드 */}
      <Image
        src={darkSrc}
        alt={alt}
        width={16}
        height={16}
        className="hidden object-cover dark:block"
      />
    </>
  );
}
