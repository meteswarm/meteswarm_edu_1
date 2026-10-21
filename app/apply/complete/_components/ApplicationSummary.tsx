import ListRow from "@/components/ui/ListRow";
import type { CompletedApplication } from "../_mock";

function formatWon(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

function formatDateTime(isoLocal: string) {
  const [date, time] = isoLocal.split("T");
  const [y, m, d] = date.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일 ${time}`;
}

// [근거] PRD.md F5-1 — 신청 번호, 신청 항목, 월 합계, 신청 일시 / F5-3 — 신청자 정보는 마스킹해 보여 줌 (NFR-2)
// [근거] screens.md 신청 완료 화면 — 신청 내역은 List/Row(default)로 보여줌. 예시 값은 옮기지 않음
// [불일치] screens.md 신청 내역 예시는 요금제 한 줄과 월 요금만 있고, PRD.md는 통신 변경·구독 가입 항목과 월 합계. PRD.md를 따름
export default function ApplicationSummary({ application }: { application: CompletedApplication }) {
  const telecom = application.items.filter((i) => i.category === "통신");
  const subscriptions = application.items.filter((i) => i.category === "구독");
  // [조건] 월 합계 = 통신 요금제 + 구독 요금제 전부 더한 금액 (4번 화면과 같은 계산)
  const total = application.items.reduce((sum, i) => sum + i.monthlyPrice, 0);
  const { customerName, maskedPhone } = application.applicant;

  return (
    // [영역] 신청 내역 — 신청 번호, 신청 항목, 월 합계, 신청 일시, 신청자, 부가세 안내 순서
    <section className="flex flex-col gap-8">
      {/* [확인 필요] 영역 제목 문구 원문이 문서에 없어 screens.md의 신청 내역을 씀 (굵기 토큰 없음) */}
      <h2 className="text-subtitle text-text-primary">신청 내역</h2>
      <div className="flex flex-col">
        {/* [영역] 신청 번호 */}
        <ListRow label="신청 번호" value={application.applicationNo} />
        {/* [영역] 통신 요금제 변경 — 바꿀 요금제 이름과 월 요금 */}
        {telecom.map((i) => (
          <ListRow key={i.planName} label="통신 요금제 변경" value={`${i.planName} · 월 ${formatWon(i.monthlyPrice)}`} />
        ))}
        {/* [영역] 구독 요금제 가입 — 요금제마다 이름과 월 요금 */}
        {/* [조건] 함께 가입한 구독 요금제가 없으면(0개) 없음으로 한 줄만 보여줌 */}
        {/* [확인 필요] 구독 요금제가 없을 때의 문구, 청구 방식도 함께 보여줄지는 문서에 없음 */}
        {subscriptions.length === 0 ? (
          <ListRow label="구독 요금제 가입" value="없음" />
        ) : (
          subscriptions.map((i) => (
            <ListRow key={i.planName} label="구독 요금제 가입" value={`${i.planName} · 월 ${formatWon(i.monthlyPrice)}`} />
          ))
        )}
        {/* [영역] 월 합계 */}
        <ListRow label="월 합계" value={`월 ${formatWon(total)}`} />
        {/* [영역] 신청 일시 */}
        {/* [확인 필요] 신청 일시 표시 형식(연도·초 포함 여부)이 문서에 없음 */}
        <ListRow label="신청 일시" value={formatDateTime(application.appliedAt)} />
        {/* [영역] 신청자 — 마스킹한 이름 · 가운데를 가린 전화번호만 보여줌 (F5-3, NFR-2) */}
        {/* [확인 필요] 신청자를 한 줄로 묶을지 이름·전화번호를 나눌지 문서에 없어 screens.md 구성을 따름 */}
        <ListRow label="신청자" value={`${customerName} · ${maskedPhone}`} />
      </div>
      {/* [영역] 부가세 포함 안내 — NFR-4 [가정] */}
      {/* [확인 필요] 부가세 안내 문구는 문서에 정해진 원문이 없어 4번 화면과 같은 임시 문구임 */}
      <p className="text-caption text-text-tertiary">모든 금액은 부가세 포함 금액이에요.</p>
    </section>
  );
}
