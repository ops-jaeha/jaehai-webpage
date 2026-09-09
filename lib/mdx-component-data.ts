/**
 * next-mdx-remote는 보안을 위해 `prop={expression}` 형태의 JSX 표현식 속성을 전부
 * 제거한다(removeJavaScriptExpressions 플러그인). 그래서 lib/notion.ts에서 만드는
 * 커스텀 컴포넌트들은 동적 값을 일반 문자열 속성 하나(`data`)에 base64 JSON으로
 * 실어 보내고, 여기서 다시 풀어낸다.
 */
export function decode_component_data<T>(data: string | undefined): T | null {
  if (!data) return null;
  try {
    return JSON.parse(Buffer.from(data, 'base64').toString('utf-8')) as T;
  } catch {
    return null;
  }
}
