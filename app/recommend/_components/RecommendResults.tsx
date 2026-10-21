"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import type { PlanCombo } from "../_mock";
import ComboCard, { comboTotal } from "./ComboCard";

// [근거] PRD.md F2-1~F2-3, 화면 2 인수 조건 (R3 확정, A6 가정, 순위 Q6 가정)
export default function RecommendResults({
  combos,
  initialCap,
  isDelinquent,
  currentAvg,
  paygEstimate,
}: {
  combos: PlanCombo[];
  initialCap: number | null;
  isDelinquent: boolean;
  currentAvg: number;
  paygEstimate: number;
}) {
  // [동작] 입력한 상한액을 화면이 기억하는 값(state)으로 들고 있고, 바뀔 때마다 목록을 다시 계산함
  const [capText, setCapText] = useState(initialCap === null ? "" : String(initialCap));

  // [조건] 숫자가 아닌 글자가 섞이면 잘못된 금액으로 봄
  // [확인 필요] 상한액 입력 검사 실패(빈 값·잘못된 금액) 규칙이 문서에 없어 "숫자만" 검사로 임시 처리함
  const trimmed = capText.trim();
  const invalid = trimmed !== "" && !/^\d+$/.test(trimmed);
  const cap = trimmed === "" || invalid ? null : Number(trimmed);

  // [조건] 순위 — 현재 요금(최근 3개월 평균) 대비 절감액이 큰 순서 [가정, Q6]
  // [조건] 상한액을 넣었으면 월 합계(통신 + 구독, 청구 방식과 관계없이 모두 합산)가 상한액 이하인 조합만 남김 (R3 확정, R4)
  // [조건] 상한액을 비워 두면 모든 조합을 보여줌
  // [확인 필요] 상한액이 비어 있을 때 전체를 보여줄지 문서에 없음 (상한액은 선택 사항 [가정], PRD 11. 리스크)
  const ranked = [...combos].sort((a, b) => currentAvg - comboTotal(b) - (currentAvg - comboTotal(a)));
  const within = cap === null ? ranked : ranked.filter((c) => comboTotal(c) <= cap);
  // [조건] 상한액 안에 드는 조합이 하나도 없으면 월 합계가 가장 낮은(상한액에 가장 가까운) 조합 1개를 고름 [가정 A6]
  const closest =
    cap !== null && within.length === 0 && combos.length > 0
      ? combos.reduce((best, c) => (comboTotal(c) < comboTotal(best) ? c : best))
      : null;

  return (
    <>
      {/* [영역] 요금 상한액 입력 (F2-1, F2-2) */}
      <section className="flex flex-col gap-8">
        <label htmlFor="cap" className="text-subtitle text-text-primary">
          요금 상한액 (월)
        </label>
        {/* [확인 필요] 제목·설명 문구 원문이 문서에 없어 임시 문구임 (굵기 토큰 없음) */}
        <p className="text-body-small text-text-secondary">통신 요금제와 구독 요금제 요금을 모두 더한 금액이에요.</p>

        {/* [조건] 미납·체납 고객에게만 상한액 입력을 먼저 권하는 안내를 보여줌 (F2-2, R10 [가정 A7]) */}
        {/* [확인 필요] 권유 문구 원문이 문서에 없어 임시 문구임 */}
        {isDelinquent && (
          <p className="rounded-12 bg-bg-accent-subtle p-12 text-body-small text-text-primary">
            매달 넘지 않을 금액을 먼저 정해 보세요. 최근 3개월 평균 청구 금액을 넣어 두었어요.
          </p>
        )}

        {/* [동작] 금액을 입력하면 바로 아래 추천 목록이 바뀜 */}
        {/* [조건] 비어 있으면 기본, 값이 있으면 입력 완료, 잘못된 금액이면 오류 표시와 안내 문구 (design.md 4.2 Input) */}
        <Input
          id="cap"
          label="요금 상한액(원)"
          inputMode="numeric"
          placeholder="예: 60000 (선택 사항)"
          value={capText}
          onChange={(e) => setCapText(e.target.value)}
          state={invalid ? "caution" : trimmed === "" ? "default" : "filled"}
          errorMessage={invalid}
          message="숫자만 입력해 주세요."
        />
      </section>

      {/* [영역] 추천 결과 — 추천 조합 목록 또는 가장 가까운 조합 */}
      {/* [조건] 상한액이 잘못된 금액이면 결과 영역을 숨김 */}
      {/* [확인 필요] 잘못된 금액일 때 결과를 숨길지, 이전 결과를 남길지 문서에 없음 */}
      {!invalid && (
        <section className="flex flex-col gap-12">
          {/* [조건] 상한액 안 조합이 없으면(빈 상태) 안내와 함께 가장 가까운 조합 1개만 보여줌 [가정 A6] */}
          {closest ? (
            <>
              {/* [확인 필요] 빈 상태 안내 문구 원문이 문서에 없어 임시 문구임 */}
              <div className="flex flex-col gap-4">
                <h2 className="text-subtitle text-text-primary">상한액 안에 드는 조합이 없어요</h2>
                <p className="text-body-small text-text-secondary">상한액에 가장 가까운 조합을 보여 드려요.</p>
              </div>
              <ComboCard
                combo={closest}
                currentAvg={currentAvg}
                paygEstimate={paygEstimate}
                overAmount={comboTotal(closest) - (cap ?? 0)}
              />
            </>
          ) : (
            <>
              {/* [영역] 추천 조합 카드 목록 — 절감액 큰 순서 [가정, Q6] */}
              {/* [조건] 1위 조합에만 "추천" 배지(Tag)를 붙임 */}
              {/* [확인 필요] 추천 배지를 어떤 조합에 붙일지 문서에 없어 1위에만 임시로 붙임 */}
              <h2 className="text-subtitle text-text-primary">추천 조합 {within.length}개</h2>
              {within.map((c, i) => (
                <ComboCard key={c.id} combo={c} currentAvg={currentAvg} paygEstimate={paygEstimate} badge={i === 0} />
              ))}
            </>
          )}
        </section>
      )}
    </>
  );
}
