import CostNotice from "@/components/ui/CostNotice";
import ListRow from "@/components/ui/ListRow";
import type { CostItem } from "../_mock";
import { formatWon } from "./ApplyItems";

// [근거] PRD.md F4-2 — 예상 변경 비용과 금액 차이 안내 문구를 다시 보여줌 (R6, N1). F3-3 — 통신 요금제에만 계산 (R13)
export default function CostSnapshotSection({ items, baseDate }: { items: CostItem[]; baseDate: string }) {
  // [조건] 합계 = 통신 요금제의 위약금·반환금 항목을 모두 더한 금액. 이 값이 제출 때 스냅숏으로 함께 저장됨 (F4-5)
  const total = items.reduce((sum, i) => sum + i.amount, 0);

  return (
    <section className="flex flex-col gap-12">
      {/* [확인 필요] 영역 제목 문구 원문이 문서에 없어 PRD 용어 '예상 변경 비용'을 씀 (굵기 토큰 없음) */}
      <h2 className="text-subtitle text-text-primary">예상 변경 비용</h2>

      {/* [조건] 위약금·반환금 항목이 하나도 없으면 금액 대신 "위약금 없음"을 보여줌 (PRD 8장 화면 3 빈 상태와 같은 표현) */}
      {/* [확인 필요] 3번 화면에서 예상 비용 조회에 실패한 경우(A5) 이 화면에서 어떻게 보여줄지 문서에 없음 */}
      {/* [확인 필요] 3번 화면처럼 항목별 펼침/접기를 둘지 문서에 없어 항목을 항상 펼쳐 보여줌 */}
      {items.length === 0 ? (
        <div className="flex flex-col gap-4 rounded-12 bg-bg-default p-16">
          <p className="text-subtitle text-text-primary">위약금 없음</p>
        </div>
      ) : (
        <div className="flex flex-col gap-12 rounded-12 bg-bg-default p-16">
          {/* [영역] 예상 비용 합계 — 금일 기준 예상 위약금·반환금 */}
          {/* [확인 필요] 합계 라벨 문구 원문이 문서에 없어 3번 화면과 같은 임시 문구를 씀 */}
          <div className="flex flex-col gap-4">
            <span className="text-caption text-text-tertiary">금일 기준 예상 위약금·반환금 합계 (통신 요금제)</span>
            <p className="text-heading-h4 text-text-primary">{formatWon(total)}</p>
          </div>
          {/* [영역] 항목별 금액 — 위약금·할인 반환금 등 */}
          <div className="flex flex-col">
            {items.map((i) => (
              <ListRow key={i.label} label={i.label} value={formatWon(i.amount)} />
            ))}
          </div>
        </div>
      )}

      {/* [영역] 금액 차이 안내 문구와 산정 기준일 — 공통 부품(CostNotice)이 문구를 보여줌 (N1, F4-2, R6) */}
      {/* [조건] 위약금이 있든 없든 예상 비용 옆에 항상 보여줌 */}
      <CostNotice baseDate={baseDate} />
    </section>
  );
}
