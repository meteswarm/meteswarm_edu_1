import Header from "@/components/ui/Header";
import RecommendError from "./_components/RecommendError";
import RecommendResults from "./_components/RecommendResults";
import RecommendSkeleton from "./_components/RecommendSkeleton";
import {
  CURRENT_MONTHLY_AVG,
  EMPTY_SAMPLE_CAP,
  IS_DELINQUENT,
  PAYG_ESTIMATE,
  PLAN_COMBOS,
  SCREEN_STATE,
  type RecommendScreenState,
} from "./_mock";

// [근거] PRD.md 화면 2. 맞춤 추천 결과 (F2-1~F2-6)와 인수 조건, 8. 화면 상태 2번 행
// [근거] harness/02-screens.json recommend 항목 — screens.md '맞춤 요금제 추천 결과'는 구성 요소·상태가 미정이라 PRD.md를 따름
// [확인 필요] 이 화면은 screens.md·피그마 디자인이 없어 배치는 PRD 요구사항에 공통 부품을 맞춘 제안임
// [조건] 처음 넣어 두는 상한액 — 빈 상태 확인용이면 샘플 상한액, 미납·체납 고객이면 최근 3개월 평균 청구 금액, 그 밖에는 비워 둠 (F2-2, R10 [가정 A7])
// [확인 필요] 미납·체납 고객 식별 기준 미정 (PRD Q3). 기준이 없으면 모든 고객에게 상한액 입력을 선택 사항으로 둠 (PRD 11. 리스크 [가정])
function initialCap(state: RecommendScreenState) {
  if (state === "empty") return EMPTY_SAMPLE_CAP;
  if (IS_DELINQUENT) return CURRENT_MONTHLY_AVG;
  return null;
}

function RecommendBody({ state }: { state: RecommendScreenState }) {
  // [조건] 불러오는 중이면 회색 자리 표시(스켈레톤)만 보여줌 — PRD 8장 화면 상태 [가정]
  if (state === "loading") return <RecommendSkeleton />;
  // [조건] 추천에 실패하면 오류 안내와 "다시 시도" 버튼만 보여줌 — PRD 8장 화면 상태 [가정]
  if (state === "error") return <RecommendError />;

  return (
    <>
      {/* [영역] 상한액 입력과 추천 조합 목록 (F2-1~F2-6) */}
      {/* [조건] 상한액 안 조합이 없으면 목록 대신 가장 가까운 조합을 초과 금액과 함께 보여줌 — 빈 상태 [가정 A6] */}
      <RecommendResults
        combos={PLAN_COMBOS}
        initialCap={initialCap(state)}
        isDelinquent={IS_DELINQUENT}
        currentAvg={CURRENT_MONTHLY_AVG}
        paygEstimate={PAYG_ESTIMATE}
      />
      {/* [영역] 부가세 포함 안내 — NFR-4 [가정] */}
      {/* [확인 필요] 부가세 안내 문구는 문서에 정해진 원문이 없어 임시 문구임 */}
      <p className="text-caption text-text-tertiary">모든 금액은 부가세 포함 금액이에요.</p>
    </>
  );
}

export default function RecommendPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-bg-surface">
      {/* [영역] 머리글 — 뒤로가기 아이콘 + 가운데 제목 (design.md 4.4 Header default) */}
      {/* [확인 필요] 뒤로가기를 누르면 어디로 갈지 문서에 없어 아직 아무 동작도 연결하지 않음 */}
      <Header type="default" title="맞춤 추천 결과" />

      {/* [영역] 본문 — 상태(기본·로딩·빈·오류)에 따라 내용이 바뀜 */}
      {/* [확인 필요] 상태는 지금 _mock.ts의 값으로 고름. 실제 조회 연동 방식은 정해지지 않음 */}
      <main className="flex flex-1 flex-col gap-24 px-16 py-24">
        <RecommendBody state={SCREEN_STATE} />
      </main>
    </div>
  );
}
