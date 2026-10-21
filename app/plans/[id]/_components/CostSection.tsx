"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import CostNotice from "@/components/ui/CostNotice";
import ListRow from "@/components/ui/ListRow";
import type { CostItem, CostState } from "../_mock";
import CounselButton from "./CounselButton";
import { formatWon } from "./PlanSummary";

// [근거] PRD.md 8. 화면 상태 — 화면 3 로딩: 예상 비용 영역만 로딩 [가정]
function CostSkeleton() {
  // [영역] 예상 비용을 불러오는 중 자리 표시 — 회색 막대 2개가 깜박임
  // [확인 필요] 자리 표시의 모양·개수는 디자인이 없어 임시로 정함
  return (
    <div className="flex flex-col gap-8 animate-pulse rounded-12 bg-bg-default p-16" aria-busy="true" aria-label="예상 변경 비용을 불러오는 중">
      <div className="h-20 w-1/2 rounded-8 bg-bg-subtle" />
      <div className="h-32 w-2/3 rounded-8 bg-bg-subtle" />
    </div>
  );
}

// [근거] PRD.md F3-2(금일 기준 예상 위약금·반환금, 합계 + 펼치면 항목별, A2), F3-3(통신 요금제만, R13), F3-4(안내 문구·산정 기준일 상시, R6)
// [근거] PRD.md 화면 3 인수 조건 — API 조회 실패 시 금액 대신 "상담사 확인 필요"와 [상담사 연결] [가정 A5]
export default function CostSection({ state, items, baseDate }: { state: CostState; items: CostItem[]; baseDate: string }) {
  // [동작] 항목별 목록을 펼쳤는지 접었는지를 화면이 기억하는 값(state)으로 들고 있음. 처음에는 접힌 상태
  const [open, setOpen] = useState(false);
  // [조건] 합계 = 통신 요금제의 위약금·반환금 항목을 모두 더한 금액
  const total = items.reduce((sum, i) => sum + i.amount, 0);

  return (
    <section className="flex flex-col gap-12">
      {/* [확인 필요] 영역 제목 문구 원문이 문서에 없어 PRD 용어 '예상 변경 비용'을 씀 (굵기 토큰 없음) */}
      <h2 className="text-subtitle text-text-primary">예상 변경 비용</h2>

      {/* [조건] 불러오는 중이면 예상 비용 자리에만 자리 표시(스켈레톤)를 보여줌 — 나머지 화면은 그대로 */}
      {state === "loading" && <CostSkeleton />}

      {/* [조건] 약정이 없으면(빈 상태) 금액 대신 "위약금 없음"을 보여줌 — PRD 8장 [가정] */}
      {/* [확인 필요] "위약금 없음" 아래 설명 문구는 문서에 없어 임시 문구임 */}
      {state === "empty" && (
        <div className="flex flex-col gap-4 rounded-12 bg-bg-default p-16">
          <p className="text-subtitle text-text-primary">위약금 없음</p>
          <p className="text-body-small text-text-secondary">약정과 혜택 유지 기간이 모두 끝났어요.</p>
        </div>
      )}

      {/* [조건] 예상 비용 조회(API)에 실패하면 금액 대신 "상담사 확인 필요"와 [상담사 연결]을 보여줌 [가정 A5] */}
      {/* [확인 필요] 실패 설명 문구는 문서에 없어 임시 문구이고, 다시 시도 버튼을 둘지도 정해지지 않음 */}
      {state === "error" && (
        <div className="flex flex-col gap-12 rounded-12 bg-bg-default p-16">
          <div className="flex flex-col gap-4">
            <p className="text-subtitle text-text-primary">상담사 확인 필요</p>
            <p className="text-body-small text-text-secondary">예상 금액을 불러오지 못했어요.</p>
          </div>
          {/* [동작] 누르면 상담사에게 바로 전화 연결 (FC-2) */}
          <CounselButton />
        </div>
      )}

      {/* [조건] 기본 상태 — 금일 기준 예상 위약금·반환금 합계를 보여줌 (F3-2) */}
      {state === "default" && (
        <div className="flex flex-col gap-12 rounded-12 bg-bg-default p-16">
          {/* [영역] 예상 비용 합계 — 통신 요금제에만 계산한 금액 (F3-3, R13) */}
          {/* [확인 필요] 합계 라벨 문구 원문이 문서에 없어 임시 문구임 */}
          <div className="flex flex-col gap-4">
            <span className="text-caption text-text-tertiary">금일 기준 예상 위약금·반환금 합계 (통신 요금제)</span>
            <p className="text-heading-h4 text-text-primary">{formatWon(total)}</p>
          </div>
          {/* [동작] 누르면 항목별 목록을 펼치고, 다시 누르면 접음 (A2). 버튼 문구도 "항목별로 보기" ↔ "항목 접기"로 바뀜 */}
          {/* [확인 필요] 펼침 UI에 쓸 컴포넌트와 위치가 문서에 없어 Button(Secondary, sm)으로 임시 구성함 */}
          <Button
            label={open ? "항목 접기" : "항목별로 보기"}
            type="Secondary"
            size="sm"
            onClick={() => setOpen((v) => !v)}
          />
          {/* [조건] 펼쳤을 때만 항목별(위약금·할인 반환금 등) 금액 목록을 보여줌 */}
          {open && (
            <div className="flex flex-col">
              {items.map((i) => (
                <ListRow key={i.label} label={i.label} value={formatWon(i.amount)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* [영역] 금액 차이 안내 문구와 산정 기준일 — 공통 부품(CostNotice)이 문구를 보여줌 (N1, F3-4, R6) */}
      {/* [조건] 로딩·빈·오류 상태와 관계없이 예상 비용 옆에 항상 보여줌 */}
      <CostNotice baseDate={baseDate} />
    </section>
  );
}
