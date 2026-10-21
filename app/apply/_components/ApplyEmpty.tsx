// [근거] harness/02-screens.json apply 빈 상태 [확인 필요] — PRD 8장 화면 4 빈 상태는 '—'(정의 없음)
// [영역] 빈 상태 안내 — 신청할 요금제가 없을 때
// [확인 필요] 빈 상태 안내 문구와 요금제를 다시 고르러 가는 버튼을 둘지 문서에 없어 임시 문구만 둠
export default function ApplyEmpty() {
  return (
    <div className="flex flex-col gap-4 rounded-12 bg-bg-default p-16">
      <p className="text-subtitle text-text-primary">신청할 요금제가 없어요</p>
      <p className="text-body-small text-text-secondary">요금제 상세 화면에서 요금제를 고른 뒤 다시 신청해 주세요.</p>
    </div>
  );
}
