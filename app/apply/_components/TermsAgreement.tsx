"use client";

import type { Term } from "../_mock";

// [근거] PRD.md F4-3 — 약관 동의를 받음 (약관 목록 미정, Q5)
// [불일치] design.md는 Checkbox(24×24, 선택 시 fill/primary)를 정의하지만 PRD.md 7장 컴포넌트 목록에 없어 공통 부품이 없음. 기본 체크 상자에 토큰 색을 입혀 임시로 만듦
// [확인 필요] 약관 목록·필수 여부는 _mock.ts 임시 목록임 (Q5). 전체 동의, 약관 내용 보기를 둘지도 문서에 없음
export default function TermsAgreement({
  terms,
  agreed,
  disabled,
  onToggle,
}: {
  terms: Term[];
  agreed: Record<string, boolean>;
  disabled: boolean;
  onToggle: (termId: string) => void;
}) {
  return (
    <section className="flex flex-col gap-8">
      {/* [확인 필요] 영역 제목 문구 원문이 문서에 없어 임시 문구임 (굵기 토큰 없음) */}
      <h2 className="text-subtitle text-text-primary">약관 동의</h2>
      {/* [영역] 약관 목록 — 약관마다 체크 상자, 필수·선택 표시, 약관 이름 한 줄 */}
      <ul className="flex flex-col">
        {terms.map((t) => (
          <li key={t.id} className="border-b border-border-subtle">
            {/* [동작] 줄 아무 곳이나 누르면 체크가 켜지고, 다시 누르면 꺼짐 */}
            {/* [조건] 제출 중에는 체크를 바꿀 수 없음 */}
            <label className="flex w-full items-center gap-12 px-4 py-12 cursor-pointer">
              <input
                type="checkbox"
                className="size-24 shrink-0 accent-fill-primary cursor-pointer"
                checked={agreed[t.id] === true}
                disabled={disabled}
                onChange={() => onToggle(t.id)}
              />
              <span className="flex min-w-0 flex-1 items-center gap-4 text-body-small text-text-primary">
                {/* [조건] 필수 약관은 강조색 '(필수)', 선택 약관은 흐린 색 '(선택)'으로 표시 */}
                <span className={t.required ? "shrink-0 text-text-accent" : "shrink-0 text-text-tertiary"}>
                  {t.required ? "(필수)" : "(선택)"}
                </span>
                {t.title}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
