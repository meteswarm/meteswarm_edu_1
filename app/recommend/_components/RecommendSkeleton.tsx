// [근거] PRD.md 8. 화면 상태 — 화면 2 로딩: 스켈레톤 [가정]
export default function RecommendSkeleton() {
  // [영역] 불러오는 중 자리 표시 — 상한액 입력 자리 1개와 카드 자리 3개가 깜박임
  // [확인 필요] 스켈레톤의 모양·개수는 디자인이 없어 임시로 정함
  return (
    <div className="flex flex-col gap-24" aria-busy="true" aria-label="추천 결과를 불러오는 중">
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-24 w-1/2 rounded-8 bg-bg-subtle" />
        <div className="h-56 w-full rounded-8 bg-bg-subtle" />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-80 w-full animate-pulse rounded-16 bg-bg-subtle" />
      ))}
    </div>
  );
}
