import BottomCTA from "@/components/ui/BottomCTA";
import Header from "@/components/ui/Header";
import ApplicationSummary from "./_components/ApplicationSummary";
import CompleteMessage from "./_components/CompleteMessage";
import { CompleteEmpty, CompleteError, CompleteLoading } from "./_components/CompleteStatus";
import { APPLICATION, RESULT_NOTICE_CHANNEL, RESULT_NOTICE_TEXT, SCREEN_STATE } from "./_mock";

// [근거] PRD.md 화면 5. 신청 완료 F5-1~F5-3, NFR-2, 9. 변경신청 주요 필드, 11. 리스크(저장 흐름은 접수), Q2·Q9
// [근거] screens.md 신청 완료 화면 구성 요소 — Header, icon/doneMark, 완료 메시지, List/Row, BottomCTA single
// [근거] design.md 3.2 신청 완료 — 본문 패딩 16, 본문 간격 24, 하단 BottomCTA single
// [불일치] flow.png 완료 화면은 구독 시작일 안내, screens.md는 개통 안내 문자. 알림 채널은 PRD Q2·Q9로 미정이라 임시 문구만 둠
export default function ApplyCompletePage() {
  // [조건] 빈 상태 확인용 값이면 신청 내역을 비움
  const application = SCREEN_STATE === "empty" ? null : APPLICATION;

  return (
    <div className="flex min-h-dvh flex-col bg-bg-surface">
      {/* [영역] 머리글 — 뒤로가기 아이콘 + 가운데 제목 신청 완료 (design.md 4.4 Header default) */}
      {/* [확인 필요] 뒤로가기를 누르면 어디로 갈지 문서에 없어 아무 동작도 연결하지 않음. 4번 화면으로 가면 중복 제출 위험이 있음 */}
      <Header type="default" title="신청 완료" />

      {/* [영역] 본문 — 완료 표시와 신청 내역 (design.md 3.2 패딩 16, 간격 24) */}
      <main className="flex flex-1 flex-col gap-24 p-16">
        {/* [조건] 화면 상태에 따라 로딩·오류·빈 안내 중 하나, 또는 완료 메시지와 신청 내역을 보여줌 */}
        {/* [확인 필요] 화면 상태(기본·로딩·빈·오류)는 문서에 정의가 없어 지금은 _mock.ts의 값으로 고름 */}
        {SCREEN_STATE === "loading" ? (
          <CompleteLoading />
        ) : SCREEN_STATE === "error" ? (
          <CompleteError />
        ) : application === null ? (
          <CompleteEmpty />
        ) : (
          <>
            {/* [영역] 접수 완료 메시지와 처리 결과 알림 안내 (F5-1, F5-2) */}
            <CompleteMessage noticeText={RESULT_NOTICE_TEXT} noticeChannel={RESULT_NOTICE_CHANNEL} />
            {/* [영역] 신청 내역 — 신청 번호, 신청 항목, 월 합계, 신청 일시, 신청자(마스킹) (F5-1, F5-3) */}
            <ApplicationSummary application={application} />
          </>
        )}
      </main>

      {/* [영역] 하단 버튼 — BottomCTA single, 버튼 문구 요금제 더 보기 (screens.md) */}
      {/* [조건] 화면 상태와 관계없이 항상 보여줌 */}
      {/* [확인 필요] 요금제 더 보기를 누르면 어디로 갈지 문서에 없어 아무 동작도 연결하지 않음 */}
      <div className="sticky bottom-0">
        <BottomCTA layout="single" primary={{ label: "요금제 더 보기" }} />
      </div>
    </div>
  );
}
