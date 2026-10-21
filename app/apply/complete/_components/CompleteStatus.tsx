// [근거] harness/02-screens.json apply-complete 로딩·빈·오류 [확인 필요] — PRD 8장에 화면 5 행이 없고 screens.md도 미정
// [확인 필요] 아래 세 상태의 모양과 문구는 모두 임시이며 문서로 확인되지 않음

// [영역] 로딩 상태 — 완료 표시와 신청 내역 자리에 회색 상자(스켈레톤)를 깜빡이며 보여줌
// [확인 필요] 로딩 모양이 문서에 없어 1·2번 화면 로딩(스켈레톤, PRD 8장)을 따라 함
export function CompleteLoading() {
  return (
    <div role="status" aria-label="신청 내역을 불러오는 중" className="flex flex-col gap-24">
      <div className="flex flex-col items-center gap-16 pt-24">
        <div className="size-64 animate-pulse rounded-full bg-bg-subtle" />
        <div className="h-24 w-1/2 animate-pulse rounded-8 bg-bg-subtle" />
        <div className="h-16 w-2/3 animate-pulse rounded-8 bg-bg-subtle" />
      </div>
      <div className="flex flex-col gap-8">
        <div className="h-20 w-1/3 animate-pulse rounded-8 bg-bg-subtle" />
        <div className="h-48 w-full animate-pulse rounded-8 bg-bg-subtle" />
        <div className="h-48 w-full animate-pulse rounded-8 bg-bg-subtle" />
        <div className="h-48 w-full animate-pulse rounded-8 bg-bg-subtle" />
      </div>
    </div>
  );
}

// [영역] 빈 상태 — 보여줄 신청 내역이 없을 때 안내
// [확인 필요] 신청 내역이 없을 때 다른 화면으로 보낼지, 버튼을 둘지 문서에 없어 안내 문구만 둠
export function CompleteEmpty() {
  return (
    <div className="flex flex-col gap-4 rounded-12 bg-bg-default p-16">
      <p className="text-subtitle text-text-primary">신청 내역이 없어요</p>
      <p className="text-body-small text-text-secondary">접수된 변경 신청을 찾을 수 없어요.</p>
    </div>
  );
}

// [영역] 오류 상태 — 신청 내역을 불러오지 못했을 때 안내
// [확인 필요] 다시 시도 버튼을 둘지, 다시 불러오는 방법이 문서에 없어 안내 문구만 둠. 4번 화면으로 돌아가 다시 제출하게 하면 중복 신청 위험이 있음
export function CompleteError() {
  return (
    <div role="alert" className="flex flex-col gap-4 rounded-12 bg-bg-error-subtle p-16">
      <p className="text-subtitle text-text-error">신청 내역을 불러오지 못했어요</p>
      <p className="text-body-small text-text-secondary">잠시 후 다시 확인해 주세요.</p>
    </div>
  );
}
