// [근거] PRD.md 8. 화면 상태 — 화면 1 빈 상태: 청구 이력 없음 → 안내 문구 [가정]
export default function UsageEmpty() {
  // [영역] 청구 이력 없음 안내
  // [확인 필요] 안내 문구 원문이 문서에 없어 임시 문구임
  // [확인 필요] 빈 상태에서 요금제·약정 정보나 추천받기 버튼을 함께 보여줄지 문서에 없음
  return (
    <div className="flex flex-col items-center gap-8 px-16 py-64 text-center">
      <p className="text-subtitle text-text-primary">최근 3개월 청구 이력이 없어요</p>
      <p className="text-body-small text-text-secondary">청구 이력이 생기면 여기에서 확인할 수 있어요.</p>
    </div>
  );
}
