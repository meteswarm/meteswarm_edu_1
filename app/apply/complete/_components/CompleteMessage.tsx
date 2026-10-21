import DoneMark from "@/components/ui/DoneMark";

// [근거] PRD.md F5-1 접수 완료 메시지, F5-2 처리 결과를 어떻게 알리는지 표시
// [근거] screens.md 신청 완료 화면 — icon/doneMark + 완료 메시지 (design.md 4.13)
// [불일치] screens.md 완료 메시지는 구독 신청 완료 기준이고 PRD.md는 변경신청 접수 완료. PRD.md 우선이라 접수 문구를 씀
export default function CompleteMessage({ noticeText, noticeChannel }: { noticeText: string; noticeChannel: string }) {
  return (
    // [영역] 완료 표시 — 완료 아이콘, 접수 완료 메시지, 처리 결과 알림 안내를 가운데 정렬로 보여줌
    <section className="flex flex-col items-center gap-16 pt-24 text-center">
      {/* [영역] 완료 아이콘 (icon/doneMark) */}
      <DoneMark label="접수 완료" />
      <div className="flex flex-col gap-8">
        {/* [영역] 접수 완료 메시지 (F5-1) */}
        {/* [확인 필요] 메시지 문구 원문이 문서에 없어 PRD 용어(변경 신청, 접수)로 임시 문구를 씀 (굵기 토큰 없음) */}
        <h2 className="text-heading-h3 text-text-primary">변경 신청이 접수됐어요</h2>
        {/* [영역] 처리 결과 알림 안내 (F5-2) — 바깥(_mock.ts)에서 받아온 임시 문구 */}
        {/* [확인 필요] 알림 채널과 문구가 정해지지 않음 (PRD Q2·Q9) */}
        <p className="text-body-small text-text-secondary">{noticeText}</p>
        {/* [조건] 알림 채널 값이 있을 때만 알림 방법 한 줄을 더 보여줌. 지금은 "문자"라 보임 */}
        {/* [동작] 알림 방법 줄에는 채널 이름만 보여주고 고객 전화번호는 붙이지 않음 (NFR-2) */}
        {/* [근거] PRD.md F5-2 "문자 등", screens.md 신청 완료 화면 "개통 안내는 문자로 보내드려요" */}
        {/* [확인 필요] 채널이 확정되지 않음 (PRD Q2·Q9) */}
        {noticeChannel !== "" && (
          <p className="text-body-small text-text-secondary">{`알림 방법: ${noticeChannel}`}</p>
        )}
      </div>
    </section>
  );
}
