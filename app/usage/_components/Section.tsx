import type { ReactNode } from "react";

export function formatWon(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

// [영역] 본문 묶음 공통 틀 — 묶음 제목 아래에 내용을 쌓음
// [확인 필요] 묶음 제목에 쓸 굵기 토큰이 없어 글자 크기(subtitle)만 맞춤 (굵기 토큰 없음)
export default function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-8">
      <h2 className="text-subtitle text-text-primary">{title}</h2>
      {children}
    </section>
  );
}
