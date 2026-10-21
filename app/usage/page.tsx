import BottomCTA from "@/components/ui/BottomCTA";
import Header from "@/components/ui/Header";
import BillingSection from "./_components/BillingSection";
import ContractSection from "./_components/ContractSection";
import PlanSection from "./_components/PlanSection";
import UsageEmpty from "./_components/UsageEmpty";
import UsageError from "./_components/UsageError";
import UsageSection from "./_components/UsageSection";
import UsageSkeleton from "./_components/UsageSkeleton";
import {
  CONTRACT,
  CURRENT_SUBSCRIPTIONS,
  CURRENT_TELECOM_PLAN,
  MONTHLY_BILLS,
  MONTHLY_USAGE,
  SCREEN_STATE,
  TODAY,
  type UsageScreenState,
} from "./_mock";

// [근거] PRD.md 화면 1. 내 이용 현황 (F1-1~F1-5), 8. 화면 상태 1번 행
// [근거] harness/02-screens.json usage 항목 — screens.md·피그마에는 이 화면이 없어 PRD.md를 따름
// [확인 필요] 이 화면은 screens.md·피그마 디자인이 없어 배치는 PRD 요구사항에 공통 부품을 맞춘 제안임
// [조건] 기본 상태인데 3개월 청구 금액이 모두 비어 있으면 "청구 이력 없음" 화면으로 바꿔 보여줌
function resolveState(state: UsageScreenState): UsageScreenState {
  if (state === "default" && MONTHLY_BILLS.every((b) => b.amount === null)) return "empty";
  return state;
}

function UsageBody({ state }: { state: UsageScreenState }) {
  // [조건] 불러오는 중이면 회색 자리 표시(스켈레톤)만 보여줌 — PRD 8장 화면 상태 [가정]
  if (state === "loading") return <UsageSkeleton />;
  // [조건] 조회에 실패하면 오류 안내와 "다시 시도" 버튼만 보여줌 — PRD 8장 화면 상태 [가정]
  if (state === "error") return <UsageError />;
  // [조건] 청구 이력이 없으면 안내 문구만 보여줌 — PRD 8장 화면 상태 [가정]
  if (state === "empty") return <UsageEmpty />;

  return (
    <>
      {/* [영역] 최근 3개월 청구 금액 — 평균과 월별 금액 (F1-1) */}
      <BillingSection bills={MONTHLY_BILLS} />
      {/* [영역] 최근 3개월 사용량 — 데이터·통화·문자 (F1-2) */}
      <UsageSection usage={MONTHLY_USAGE} />
      {/* [영역] 지금 쓰는 요금제 — 통신 요금제와 구독 요금제 (F1-3) */}
      <PlanSection telecom={CURRENT_TELECOM_PLAN} subscriptions={CURRENT_SUBSCRIPTIONS} />
      {/* [영역] 약정·혜택 유지 기간 종료일과 남은 기간 (F1-4) */}
      <ContractSection contractEndDate={CONTRACT.contractEndDate} benefitEndDate={CONTRACT.benefitEndDate} today={TODAY} />
      {/* [영역] 부가세 포함 안내 — NFR-4 [가정] */}
      {/* [확인 필요] 부가세 안내 문구는 문서에 정해진 원문이 없어 임시 문구임 */}
      <p className="text-caption text-text-tertiary">모든 금액은 부가세 포함 금액이에요.</p>
    </>
  );
}

export default function UsagePage() {
  const state = resolveState(SCREEN_STATE);

  return (
    <div className="flex min-h-dvh flex-col bg-bg-surface">
      {/* [영역] 머리글 — 서비스 첫 화면용(root), 뒤로가기 없이 큰 제목 */}
      {/* [확인 필요] 머리글 오른쪽 Logo 원본이 공통 부품 폴더에 없어 빈 자리로 둠 */}
      <Header type="root" title="내 이용 현황" />

      {/* [영역] 본문 — 상태(기본·로딩·빈·오류)에 따라 내용이 바뀜 */}
      <main className="flex flex-1 flex-col gap-24 px-16 py-24">
        <UsageBody state={state} />
      </main>

      {/* [영역] 하단 버튼 — 맞춤 요금제 추천받기 (F1-5) */}
      {/* [조건] 기본 상태일 때만 하단 버튼을 보여줌 */}
      {/* [확인 필요] 로딩·빈·오류 상태에서 추천받기 버튼을 보여줄지 문서에 없음 */}
      {/* [동작] 누르면 2번 화면(맞춤 추천 결과, /recommend)으로 이동 */}
      {state === "default" && (
        <div className="sticky bottom-0">
          <BottomCTA layout="single" primary={{ label: "맞춤 요금제 추천받기", href: "/recommend" }} />
        </div>
      )}
    </div>
  );
}
