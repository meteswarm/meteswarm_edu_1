"use client";

import type { ReactNode } from "react";

// design.md 4.4 Header — Type: default / root. 390 x 56, 좌우 패딩 16, 상하 패딩 4, bg/surface
export type HeaderType = "default" | "root";

export type HeaderProps = {
  title: string;
  type?: HeaderType;
  /** default 의 뒤로가기 동작. 목적지는 화면에서 정한다 */
  onBack?: () => void;
  /** root 오른쪽 Logo 자리 (32 x 24). Logo 원본은 이 폴더에 없다 */
  logo?: ReactNode;
};

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-24 stroke-icon-default" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}

export default function Header({ title, type = "default", onBack, logo }: HeaderProps) {
  if (type === "root") {
    return (
      <header className="flex h-56 w-full items-center justify-between gap-8 bg-bg-surface px-16 py-4">
        <h1 className="min-w-0 truncate text-heading-h4 text-text-primary">{title}</h1>
        <div className="flex h-24 w-32 shrink-0 items-center justify-center text-brand-primary">{logo}</div>
      </header>
    );
  }

  return (
    <header className="flex h-56 w-full items-center justify-between gap-8 bg-bg-surface px-16 py-4">
      <button type="button" onClick={onBack} aria-label="뒤로" className="flex size-24 shrink-0 items-center justify-center cursor-pointer">
        <ArrowLeftIcon />
      </button>
      <h1 className="min-w-0 flex-1 truncate text-center text-subtitle text-text-primary">{title}</h1>
      <span className="size-24 shrink-0" aria-hidden="true" />
    </header>
  );
}
