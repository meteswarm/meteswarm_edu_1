import ListRow from "@/components/ui/ListRow";
import type { MonthlyBill } from "../_mock";
import Section, { formatWon } from "./Section";

export default function BillingSection({ bills }: { bills: MonthlyBill[] }) {
  const known = bills.filter((b): b is MonthlyBill & { amount: number } => b.amount !== null);
  const average = known.length > 0 ? Math.round(known.reduce((sum, b) => sum + b.amount, 0) / known.length) : null;
  const hasMissing = known.length < bills.length;

  // [근거] PRD.md F1-1, R1(비교 기준 금액 = 최근 3개월 청구 금액 평균)
  return (
    <Section title="최근 3개월 청구 금액">
      {/* [영역] 월 평균 청구 금액 요약 */}
      {/* [확인 필요] 평균 금액을 강조할 굵기 토큰이 없어 글자 크기로만 강조함 (굵기 토큰 없음) */}
      <div className="flex flex-col gap-4 rounded-12 bg-bg-default p-16">
        <span className="text-caption text-text-tertiary">월 평균 청구 금액</span>
        {/* [조건] 금액이 있는 달이 하나도 없으면 평균 자리에 "-"를 보여줌 */}
        <span className="text-heading-h2 text-text-primary">{average === null ? "-" : formatWon(average)}</span>
        {/* [조건] 3개월 중 데이터가 없는 달이 있으면, 있는 달만으로 평균을 냈다는 안내를 보여줌 — PRD 화면 1 인수 조건 [가정] */}
        {/* [확인 필요] 이 안내 문구는 문서에 원문이 없어 임시 문구임 */}
        {hasMissing && (
          <span className="text-caption text-text-secondary">
            데이터가 없는 달을 빼고 {known.length}개월 금액으로 평균을 냈어요.
          </span>
        )}
      </div>

      {/* [영역] 월별 청구 금액 목록 */}
      {/* [조건] 데이터가 없는 달은 금액 대신 "데이터 없음"으로 보여줌 */}
      <div className="flex flex-col">
        {bills.map((b) => (
          <ListRow key={b.month} label={b.month} value={b.amount === null ? "데이터 없음" : formatWon(b.amount)} />
        ))}
      </div>
    </Section>
  );
}
