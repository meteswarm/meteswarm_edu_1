import ListRow from "@/components/ui/ListRow";
import type { MonthlyUsage } from "../_mock";
import Section from "./Section";

function part(label: string, value: number | null, unit: string) {
  return `${label} ${value === null ? "-" : `${value.toLocaleString("ko-KR")}${unit}`}`;
}

export default function UsageSection({ usage }: { usage: MonthlyUsage[] }) {
  // [근거] PRD.md F1-2 최근 3개월 사용량(데이터·통화·문자)
  return (
    <Section title="최근 3개월 사용량">
      {/* [영역] 월별 사용량 목록 — 한 줄에 한 달씩 데이터·통화·문자를 함께 보여줌 */}
      {/* [확인 필요] 사용량을 월별로 보여줄지, 3개월 합계·평균으로 보여줄지 문서에 없음 */}
      {/* [조건] 값이 없는 항목은 "-"로 보여줌 */}
      <div className="flex flex-col">
        {usage.map((u) => (
          <ListRow
            key={u.month}
            label={u.month}
            value={[part("데이터", u.dataGb, "GB"), part("통화", u.callMinutes, "분"), part("문자", u.smsCount, "건")].join(" · ")}
          />
        ))}
      </div>
    </Section>
  );
}
