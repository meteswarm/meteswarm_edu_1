import Header from "@/components/ui/Header";
import ApplyEmpty from "./_components/ApplyEmpty";
import ApplyForm from "./_components/ApplyForm";
import ApplyItems, { formatDate } from "./_components/ApplyItems";
import CostSnapshotSection from "./_components/CostSnapshotSection";
import CounselButton from "./_components/CounselButton";
import { APPLY_ITEMS, COST_ITEMS, SCREEN_STATE, TERMS, TODAY } from "./_mock";

// [근거] PRD.md 화면 4. 변경 신청 (폼 + 확인) F4-1~F4-5와 인수 조건, 8. 화면 상태 4번 행, 9. 변경신청 주요 필드
// [근거] PRD.md 공통 [상담사 연결] 버튼 (FC-1~FC-3), Q2·Q4·Q5
// [근거] design.md 3.2 구독 신청 — 본문 패딩 16, 본문 간격 16, 하단 버튼 2개 세로 배치(BottomCTA double과 다름)
// [불일치] screens.md는 신청 폼과 신청 확인을 두 화면으로 나누지만 PRD.md 화면 4는 한 화면. PRD.md 우선이라 한 화면으로 만듦
// [불일치] screens.md 신청 폼의 이름·이메일 입력란은 PRD.md 화면 4 요구사항에 없어 넣지 않음 (로그인한 기존 고객, A4)
// [불일치] screens.md 제목·문구는 '구독 신청', PRD.md는 '변경 신청'. PRD.md 용어를 씀
// [불일치] screens.md의 '취소' 버튼은 목적지가 정해지지 않아 넣지 않음. 하단에는 신청과 [상담사 연결]만 둠
export default function ApplyPage() {
  // [조건] 빈 상태 확인용 값이면 신청 항목을 비움 — 빈 상태는 PRD 8장에 정의가 없음
  // [확인 필요] 신청 항목이 없을 때(빈 상태)의 처리가 문서에 없어 임시 안내 화면을 둠
  const items = SCREEN_STATE === "empty" ? [] : APPLY_ITEMS;

  return (
    <div className="flex min-h-dvh flex-col bg-bg-surface">
      {/* [영역] 머리글 — 뒤로가기 아이콘 + 가운데 제목 '변경 신청' (design.md 4.4 Header default) */}
      {/* [확인 필요] 뒤로가기를 누르면 어디로 갈지 문서에 없어 아직 아무 동작도 연결하지 않음 (screens.md 목적지 미정) */}
      <Header type="default" title="변경 신청" />

      {/* [조건] 신청 항목이 없으면 안내와 [상담사 연결]만 보여주고, 있으면 신청 폼을 보여줌 */}
      {/* [확인 필요] 화면 상태(기본·로딩·빈·오류)는 지금 _mock.ts의 값으로 고름 */}
      {items.length === 0 ? (
        <>
          {/* [영역] 빈 상태 본문 — 신청할 요금제가 없다는 안내 */}
          <main className="flex flex-1 flex-col gap-16 p-16">
            <ApplyEmpty />
          </main>
          {/* [영역] 빈 상태 하단 버튼 — [상담사 연결]만 둠. 신청할 항목이 없어 신청 버튼은 숨김 */}
          <div className="sticky bottom-0 flex flex-col gap-8 border-t border-border-subtle bg-bg-surface px-16 pt-12 pb-32">
            {/* [동작] 누르면 상담사에게 바로 전화 연결 (FC-2) */}
            <CounselButton />
          </div>
        </>
      ) : (
        // [영역] 신청 폼 — 신청 내용, 예상 변경 비용, 약관 동의, 저장 실패 안내, 하단 버튼
        // [조건] 로딩 확인용 값이면 처음부터 "제출 중"(버튼 비활성화), 오류 확인용 값이면 처음부터 저장 실패 안내를 띄움
        <ApplyForm
          items={items}
          costItems={COST_ITEMS}
          baseDate={TODAY}
          terms={TERMS}
          initialSubmitting={SCREEN_STATE === "loading"}
          initialSaveError={SCREEN_STATE === "error"}
        >
          {/* [영역] 신청 내용 — 통신 요금제 변경, 구독 요금제 가입(0~N개), 월 합계 (F4-1) */}
          <ApplyItems items={items} />
          {/* [영역] 예상 변경 비용과 금액 차이 안내 문구·산정 기준일을 다시 보여줌 (F4-2, N1, R6) */}
          <CostSnapshotSection items={COST_ITEMS} baseDate={formatDate(TODAY)} />
        </ApplyForm>
      )}
    </div>
  );
}
