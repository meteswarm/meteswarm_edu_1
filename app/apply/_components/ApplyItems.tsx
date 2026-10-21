import ListRow from "@/components/ui/ListRow";
import type { ApplyItem } from "../_mock";

export function formatWon(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function formatDate(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

// [조건] 월 합계 = 통신 요금제 + 구독 요금제 전부. 청구 방식(합산·별도 결제)과 관계없이 모두 더함 (R3, R4 [가정 A1])
export function monthlyTotal(items: ApplyItem[]) {
  return items.reduce((sum, i) => sum + i.monthlyPrice, 0);
}

// [근거] PRD.md F4-1 — 통신 요금제 '변경', 구독 요금제 '가입'(0~N개), 월 합계. '변경'은 통신에만, 구독은 '가입'
// [근거] screens.md 신청 폼 화면 — 신청 내용은 List/Row(default)로 보여줌. 예시 값은 옮기지 않음
export default function ApplyItems({ items }: { items: ApplyItem[] }) {
  const telecom = items.filter((i) => i.category === "통신");
  const subscriptions = items.filter((i) => i.category === "구독");

  return (
    <section className="flex flex-col gap-8">
      {/* [확인 필요] 영역 제목 문구 원문이 문서에 없어 screens.md의 '신청 내용'을 씀 (굵기 토큰 없음) */}
      <h2 className="text-subtitle text-text-primary">신청 내용</h2>
      <div className="flex flex-col">
        {/* [영역] 통신 요금제 변경 — 바꿀 요금제 이름과 월 요금 */}
        {/* [확인 필요] 지금 쓰는 요금제(변경 전)도 함께 보여줄지 문서에 없어 넣지 않음 */}
        {telecom.map((i) => (
          <ListRow key={i.planName} label="통신 요금제 변경" value={`${i.planName} · 월 ${formatWon(i.monthlyPrice)}`} />
        ))}
        {/* [영역] 구독 요금제 가입 — 요금제마다 이름, 월 요금, 청구 방식 (R12) */}
        {/* [조건] 함께 가입하는 구독 요금제가 없으면(0개) "없음"으로 한 줄만 보여줌 */}
        {/* [확인 필요] 구독 요금제가 없을 때의 문구는 문서에 없어 임시 문구임 */}
        {subscriptions.length === 0 ? (
          <ListRow label="구독 요금제 가입" value="없음" />
        ) : (
          subscriptions.map((i) => (
            <ListRow
              key={i.planName}
              label="구독 요금제 가입"
              value={`${i.planName} · 월 ${formatWon(i.monthlyPrice)}${i.category === "구독" ? ` · ${i.billing}` : ""}`}
            />
          ))
        )}
        {/* [영역] 월 합계 — 통신 요금제와 구독 요금제를 모두 더한 금액 */}
        <ListRow label="월 합계" value={`월 ${formatWon(monthlyTotal(items))}`} />
      </div>
    </section>
  );
}
