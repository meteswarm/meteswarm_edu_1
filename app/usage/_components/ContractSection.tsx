import ListRow from "@/components/ui/ListRow";
import Section from "./Section";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysLeft(endDate: string, today: string) {
  return Math.round((Date.parse(endDate) - Date.parse(today)) / DAY_MS);
}

// [근거] PRD.md F1-4 약정 종료일·혜택 유지 기간 종료일, 남은 기간 강조
function EndDateValue({ endDate, today }: { endDate: string | null; today: string }) {
  // [조건] 종료일 정보가 없으면 "없음"으로 보여줌
  if (endDate === null) return <span>없음</span>;
  const left = daysLeft(endDate, today);
  // [조건] 종료일이 기준일과 같거나 지났으면 날짜 옆에 "(종료)"를 보여줌
  if (left <= 0) return <span>{endDate} (종료)</span>;
  // [조건] 남은 기간이 있으면 "N일 남음"을 분홍 강조색으로 보여줌
  // [확인 필요] 남은 기간 강조 방식·색 토큰과 표기 단위(일·개월)가 문서에 없음 — text/accent를 임시로 씀
  return (
    <span>
      {endDate} <span className="text-text-accent">({left}일 남음)</span>
    </span>
  );
}

export default function ContractSection({
  contractEndDate,
  benefitEndDate,
  today,
}: {
  contractEndDate: string | null;
  benefitEndDate: string | null;
  today: string;
}) {
  const contractEnded = contractEndDate === null || daysLeft(contractEndDate, today) <= 0;
  const benefitEnded = benefitEndDate === null || daysLeft(benefitEndDate, today) <= 0;

  return (
    <Section title="약정·혜택 유지 기간">
      {/* [영역] 약정 종료일·혜택 유지 기간 종료일 목록 */}
      <div className="flex flex-col">
        <ListRow label="약정 종료일" value={<EndDateValue endDate={contractEndDate} today={today} />} />
        <ListRow label="혜택 유지 기간 종료일" value={<EndDateValue endDate={benefitEndDate} today={today} />} />
      </div>
      {/* [영역] 위약금 없음 안내 */}
      {/* [조건] 약정과 혜택 유지 기간이 모두 끝났거나 없으면 "위약금 없이 변경 가능"을 보여줌 — PRD 화면 1 인수 조건 [가정] */}
      {/* [확인 필요] 이 안내의 배경·글자색 토큰은 문서에 정해져 있지 않음 */}
      {contractEnded && benefitEnded && (
        <p className="rounded-12 bg-bg-accent-subtle p-16 text-body-small text-text-accent">위약금 없이 변경 가능</p>
      )}
    </Section>
  );
}
