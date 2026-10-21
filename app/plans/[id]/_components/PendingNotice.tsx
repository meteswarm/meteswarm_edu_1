import CounselButton from "./CounselButton";

// [근거] PRD.md F3-5 — 약정이 남은 고객에게 펜딩 재약정 안내와 [상담사 연결], R8 펜딩은 상담사 연결로만 처리
export default function PendingNotice() {
  // [영역] 펜딩 재약정 안내 — 제목, 설명, [상담사 연결] 버튼
  // [확인 필요] 안내 제목·설명 문구 원문이 문서에 없어 PRD 3장 용어 정의(펜딩)를 바탕으로 쓴 임시 문구임
  return (
    <section className="flex flex-col gap-12 rounded-12 bg-bg-accent-subtle p-16">
      <div className="flex flex-col gap-4">
        <h2 className="text-subtitle text-text-primary">펜딩 재약정 안내</h2>
        <p className="text-body-small text-text-secondary">
          약정이 남아 있어요. 할인 혜택·추가 할인 조건을 걸고 다시 약정(펜딩 재약정)할 수 있어요. 펜딩 재약정은 상담사 연결로만 신청할 수 있어요.
        </p>
      </div>
      {/* [동작] 누르면 상담사에게 바로 전화 연결 (FC-2) */}
      <CounselButton />
    </section>
  );
}
