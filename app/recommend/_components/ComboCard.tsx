import CardPlan from "@/components/ui/CardPlan";
import type { PlanCombo } from "../_mock";

export function formatWon(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

// [조건] 조합 월 합계 = 통신 요금제 + 구독 요금제 전부. 청구 방식(합산·별도 결제)과 관계없이 모두 더함 (R3 확정, R4 [가정 A1])
export function comboTotal(combo: PlanCombo) {
  return combo.telecom.monthlyPrice + combo.subscriptions.reduce((sum, s) => sum + s.monthlyPrice, 0);
}

// [조건] 기준 금액보다 싸면 "절약", 비싸면 "더 내요", 같으면 "차이 없음"
// [확인 필요] 차액 표시 문구 원문이 문서에 없어 임시 문구임
function diffText(base: number, total: number) {
  const diff = base - total;
  if (diff > 0) return `월 ${formatWon(diff)} 절약`;
  if (diff < 0) return `월 ${formatWon(-diff)} 더 내요`;
  return "차이 없음";
}

// [조건] 절약일 때만 강조색(text-accent)으로 보여줌
function DiffLine({ label, base, total }: { label: string; base: number; total: number }) {
  return (
    <div className="flex items-center justify-between gap-8">
      <span className="text-body-small text-text-secondary">{label}</span>
      <span className={base - total > 0 ? "text-body-small text-text-accent" : "text-body-small text-text-primary"}>
        {diffText(base, total)}
      </span>
    </div>
  );
}

// [근거] design.md 4.6 Card/Plan (추천 결과에 사용), PRD.md F2-3·F2-4·F2-5·F2-6
// [확인 필요] Card/Plan 한 장에 통신 1개 + 구독 N개를 담는 방식이 문서에 없어, 이름·설명은 통신 요금제로, 구독은 카드 아래 덧붙임 영역에 둠
// [확인 필요] 카드의 선택됨(selected) 상태는 쓰지 않음 — 고르면 바로 3번 화면으로 넘어가기 때문
export default function ComboCard({
  combo,
  currentAvg,
  paygEstimate,
  badge = false,
  overAmount,
}: {
  combo: PlanCombo;
  currentAvg: number;
  paygEstimate: number;
  badge?: boolean;
  overAmount?: number;
}) {
  const total = comboTotal(combo);

  // [동작] "선택하기"를 누르면 3번 화면(요금제 상세, /plans/[id])으로 이동 (F2-6)
  // [확인 필요] 고른 조합을 [id]로 넘기는 방식이 정해지지 않아 샘플 조합 id를 그대로 씀 (02 plan-detail notes)
  // [확인 필요] 카드 버튼 문구 원문이 문서에 없어 임시 문구임
  return (
    <CardPlan
      name={combo.telecom.name}
      desc={combo.telecom.desc}
      price={`월 합계 ${formatWon(total)}`}
      badge={badge}
      badgeLabel="추천"
      buttonLabel="선택하기"
      buttonHref={`/plans/${combo.id}`}
    >
      {/* [조건] 빈 상태(A6)에서 가장 가까운 조합을 보여줄 때만 상한액 초과 금액을 오류색으로 보여줌 */}
      {overAmount !== undefined && (
        <p className="text-body-small text-text-error">상한액보다 월 {formatWon(overAmount)} 많아요</p>
      )}

      {/* [영역] 금액 구성 — 통신 요금제 월 요금과 구독 요금제 목록 */}
      <div className="flex flex-col gap-8 rounded-12 bg-bg-default p-12">
        <div className="flex items-center justify-between gap-8">
          <span className="text-body-small text-text-secondary">통신 요금제</span>
          <span className="text-body-small text-text-primary">월 {formatWon(combo.telecom.monthlyPrice)}</span>
        </div>

        {/* [조건] 구독 요금제가 없는 조합(0개)이면 "없음" 안내를 보여줌 */}
        {/* [확인 필요] 구독 요금제가 없을 때의 문구는 문서에 없어 임시 문구임 */}
        {combo.subscriptions.length === 0 ? (
          <p className="text-body-small text-text-tertiary">함께 가입하는 구독 요금제 없음</p>
        ) : (
          combo.subscriptions.map((s) => (
            <div key={s.name} className="flex flex-col gap-4 border-t border-border-subtle pt-8">
              <div className="flex items-center justify-between gap-8">
                <span className="min-w-0 text-body-small text-text-primary">{s.name}</span>
                <span className="shrink-0 text-body-small text-text-primary">월 {formatWon(s.monthlyPrice)}</span>
              </div>
              <p className="text-caption text-text-tertiary">{s.desc}</p>
              {/* [근거] F2-5, R14 [가정 A11] — 구독 요금제마다 "약정 없음 · 언제든 해지 가능" 표시 */}
              <p className="text-caption text-text-secondary">약정 없음 · 언제든 해지 가능</p>
              {/* [근거] F2-5, R12 — 청구 방식(통신 요금 합산 / 별도 결제)은 상품마다 표시 */}
              <p className="text-caption text-text-secondary">청구 방식: {s.billing}</p>
            </div>
          ))
        )}
      </div>

      {/* [영역] 차액 — 현재 요금, 종량제 기준 예상 요금과 비교 (F2-4, R1·R2) */}
      {/* [확인 필요] 종량제 단가(Q7)와 결합 할인 반영(Q8)이 정해지지 않아 샘플 값으로 계산함 */}
      <div className="flex flex-col gap-4">
        <DiffLine label="현재 요금(최근 3개월 평균)보다" base={currentAvg} total={total} />
        <DiffLine label="종량제 기준 예상 요금보다" base={paygEstimate} total={total} />
      </div>
    </CardPlan>
  );
}
