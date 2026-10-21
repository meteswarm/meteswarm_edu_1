import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import CostSection from "./_components/CostSection";
import PendingNotice from "./_components/PendingNotice";
import PlanSummary from "./_components/PlanSummary";
import { CONTRACT, COST_ITEMS, COST_STATE, PLAN_COMBOS, TODAY, type CostState } from "./_mock";

// [근거] PRD.md 화면 3. 요금제 상세 + 예상 변경 비용 (F3-1~F3-6), 인수 조건 A5, 8. 화면 상태 3번 행
// [근거] PRD.md 공통 [상담사 연결] 버튼 (FC-1~FC-3), 부록 A R5~R9·R11·R13
// [근거] screens.md 요금제 상세 페이지 — Header 제목 '요금제 상세', Card/Price, List/Row, 하단 세로 버튼 2개
// [근거] design.md 3.2 요금제 상세 — 본문 패딩 24, 본문 간격 24, 하단 버튼 2개 세로 배치
// [불일치] screens.md 하단 버튼 문구는 '구독 신청', PRD.md는 [변경 신청]. PRD.md 우선이라 '변경 신청'을 씀
// [불일치] screens.md '구독 안내'(이용 기간·갱신 주기·이월) 문구는 PRD 요구사항에 없어 넣지 않음
// [동작] 미리 만들어 둘 화면 주소 목록 — 2번 화면 샘플 조합 id마다 하나씩 (/plans/combo-1 등)
// [확인 필요] 주소의 [id]가 통신 + 구독 조합을 가리키는 방식이 문서에 없어 샘플 조합 id를 그대로 씀
export function generateStaticParams() {
  return PLAN_COMBOS.map((c) => ({ id: c.id }));
}

function formatDate(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

// [조건] 종료일이 있고 오늘(산정 기준일)보다 뒤면 "남아 있음"으로 봄
const isRemaining = (end: string | null) => end !== null && end > TODAY;

// [조건] 기본 상태인데 약정과 혜택 유지 기간이 모두 끝났으면 예상 비용 영역을 "위약금 없음"(빈 상태)으로 바꿔 보여줌 (F3-2, PRD 8장 [가정])
function resolveCostState(state: CostState, contractLeft: boolean, benefitLeft: boolean): CostState {
  if (state === "default" && !contractLeft && !benefitLeft) return "empty";
  return state;
}

export default async function PlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const combo = PLAN_COMBOS.find((c) => c.id === id);
  // [조건] 주소의 조합 id가 목록에 없으면 "페이지 없음" 화면을 보여줌
  // [확인 필요] 없는 요금제로 들어왔을 때의 처리가 문서에 없어 임시로 "페이지 없음"으로 처리함
  if (!combo) notFound();

  const contractLeft = isRemaining(CONTRACT.contractEndDate);
  const benefitLeft = isRemaining(CONTRACT.benefitEndDate);
  const costState = resolveCostState(COST_STATE, contractLeft, benefitLeft);

  return (
    <div className="flex min-h-dvh flex-col bg-bg-surface">
      {/* [영역] 머리글 — 뒤로가기 아이콘 + 가운데 제목 '요금제 상세' (design.md 4.4 Header default) */}
      {/* [확인 필요] 뒤로가기를 누르면 어디로 갈지 문서에 없어 아직 아무 동작도 연결하지 않음 (screens.md 복귀 대상 미정) */}
      <Header type="default" title="요금제 상세" />

      {/* [영역] 본문 — 요금제 상세, 예상 변경 비용, 펜딩 재약정 안내, 부가세 안내 순서 */}
      <main className="flex flex-1 flex-col gap-24 p-24">
        {/* [영역] 고른 통신·구독 요금제의 월 합계·월 요금·제공 내용 (F3-1) */}
        {/* [조건] 로딩·빈·오류 상태와 관계없이 요금제 정보는 항상 보여줌 — 상태는 예상 비용 영역에만 적용 (PRD 8장) */}
        <PlanSummary combo={combo} />

        {/* [영역] 예상 변경 비용 — 통신 요금제만 계산, 합계와 항목별 펼침, 금액 차이 안내 문구·산정 기준일 (F3-2~F3-4) */}
        {/* [확인 필요] 예상 비용 상태는 지금 _mock.ts의 값으로 고름. 실제 위약금 산정 API 연동 방식은 정해지지 않음 */}
        <CostSection state={costState} items={COST_ITEMS} baseDate={formatDate(TODAY)} />

        {/* [영역] 펜딩 재약정 안내와 [상담사 연결] (F3-5, R8·R9) */}
        {/* [조건] 약정이 남은 고객에게만 보여줌. 위약금 없음(빈 상태)이면 숨김 */}
        {/* [확인 필요] 혜택 유지 기간만 남은 고객에게도 펜딩 안내를 보여줄지 문서에 없어 약정 기준으로만 판단함 */}
        {contractLeft && costState !== "empty" && <PendingNotice />}

        {/* [영역] 부가세 포함 안내 — NFR-4 [가정] */}
        {/* [확인 필요] 부가세 안내 문구는 문서에 정해진 원문이 없어 임시 문구임 */}
        <p className="text-caption text-text-tertiary">모든 금액은 부가세 포함 금액이에요.</p>
      </main>

      {/* [영역] 하단 버튼 — 변경 신청과 뒤로를 세로로 배치 (screens.md, design.md 3.2). BottomCTA가 아닌 일반 영역 */}
      <div className="sticky bottom-0 flex flex-col gap-8 border-t border-border-subtle bg-bg-surface px-24 pt-12 pb-32">
        {/* [동작] 누르면 4번 화면(변경 신청, /apply)으로 이동 (F3-6) */}
        {/* [조건] 약정이 남아 있어도, 예상 비용 조회에 실패해도 누를 수 있음 (R11 [가정 A8], A5) */}
        {/* [확인 필요] 고른 조합을 4번 화면에 넘기는 방식이 문서에 없어 지금은 이동만 함 */}
        <Button label="변경 신청" type="Primary" size="xl" fullWidth href="/apply" />
        {/* [확인 필요] '뒤로' 버튼의 복귀 대상(추천 결과 등)이 문서에 없어 아직 아무 동작도 연결하지 않음 */}
        <Button label="뒤로" type="Secondary" size="xl" fullWidth />
      </div>
    </div>
  );
}
