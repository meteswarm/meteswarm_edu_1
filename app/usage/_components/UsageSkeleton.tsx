// [근거] PRD.md 8. 화면 상태 — 화면 1 로딩: 스켈레톤 [가정]
export default function UsageSkeleton() {
  // [영역] 불러오는 중 자리 표시 — 제목 줄과 내용 상자 4묶음이 깜박임
  // [확인 필요] 스켈레톤의 모양·개수는 디자인이 없어 임시로 정함
  return (
    <div className="flex flex-col gap-24" aria-busy="true" aria-label="이용 현황을 불러오는 중">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-8 animate-pulse">
          <div className="h-24 w-1/2 rounded-8 bg-bg-subtle" />
          <div className="h-80 w-full rounded-12 bg-bg-subtle" />
        </div>
      ))}
    </div>
  );
}
