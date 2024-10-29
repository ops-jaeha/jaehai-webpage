'use client';

export default function Page() {
  useEffect(() => {
    router.push('/post');
  }, []);
  return <h1>Hello, Next.js!</h1>;
}
