// 맞춤 추천 결과(/recommend) 샘플 데이터. 실제 조회(청구·사용량·상품·수납 시스템, PRD 9장) 연동 전까지 쓴다.

// [근거] PRD.md 9. 데이터와 연동 — 월별 청구·월별 사용량·가입 요금제·요금제 카탈로그·납부 상태 (사용 화면 2)
// [확인 필요] 아래 금액·요금제 이름은 모두 화면 확인용 가짜 값이며 실제 상품과 관계없음
export type RecommendScreenState = "default" | "loading" | "empty" | "error";

// [확인 필요] 화면 상태(기본·로딩·빈·오류)를 바꿔 보는 방법이 문서에 없다. 이 값을 바꿔서 확인한다.
// "empty"는 아래 EMPTY_SAMPLE_CAP을 상한액으로 넣어, 상한액 안 조합이 없는 경우(A6)를 보여 준다.
export const SCREEN_STATE: RecommendScreenState = "default";

// [확인 필요] 미납·체납 고객 식별 기준이 정해지지 않았다 (PRD Q3). 화면 확인용 값이다.
export const IS_DELINQUENT = true;

// R1 비교 기준 금액 = 최근 3개월 청구 금액 평균 (부가세 포함, 원)
// [확인 필요] 내 이용 현황 화면과 같은 출처를 써야 하지만 화면끼리 값을 넘기는 방식이 정해지지 않아 따로 둔다.
export const CURRENT_MONTHLY_AVG = 68600;

// F2-4 종량제(쓴 만큼 내는 방식) 기준 예상 요금 (원)
// [확인 필요] 종량제 단가가 정해지지 않았다 (PRD Q7). 화면 확인용 값이다.
export const PAYG_ESTIMATE = 74000;

// 빈 상태(A6) 확인용 상한액 (원)
export const EMPTY_SAMPLE_CAP = 30000;

export type BillingMethod = "통신 요금 합산" | "별도 결제";

export type TelecomPlan = {
  name: string;
  desc: string;
  /** 월 요금(원, 부가세 포함) */
  monthlyPrice: number;
};

export type SubscriptionPlan = {
  name: string;
  desc: string;
  /** 월 요금(원, 부가세 포함) */
  monthlyPrice: number;
  /** R12 상품마다 다른 청구 방식 */
  billing: BillingMethod;
};

export type PlanCombo = {
  /** 3번 화면(/plans/[id])으로 넘기는 조합 id */
  id: string;
  telecom: TelecomPlan;
  /** A9 구독 요금제 0~N개 */
  subscriptions: SubscriptionPlan[];
};

// F2-3 추천 후보 조합: 통신 요금제 1개 + 구독 요금제 0~N개
// [확인 필요] 고른 조합을 [id]로 넘기는 방식이 정해지지 않았다 (02 plan-detail notes). 임시로 조합 id를 쓴다.
// [확인 필요] 결합·제휴카드 할인 반영 여부가 정해지지 않아 금액에 넣지 않았다 (PRD Q8).
export const PLAN_COMBOS: PlanCombo[] = [
  {
    id: "combo-1",
    telecom: { name: "5G 슬림", desc: "데이터 30GB · 통화 무제한 · 문자 무제한", monthlyPrice: 47000 },
    subscriptions: [{ name: "영상 구독 베이직", desc: "영상 스트리밍 1개 기기", monthlyPrice: 5500, billing: "통신 요금 합산" }],
  },
  {
    id: "combo-2",
    telecom: { name: "5G 라이트", desc: "데이터 80GB · 통화 무제한 · 문자 무제한", monthlyPrice: 55000 },
    subscriptions: [{ name: "음악 구독", desc: "음악 스트리밍 무제한", monthlyPrice: 7900, billing: "별도 결제" }],
  },
  {
    id: "combo-3",
    telecom: { name: "5G 스탠다드", desc: "데이터 150GB · 통화 무제한 · 문자 무제한", monthlyPrice: 69000 },
    subscriptions: [],
  },
  {
    id: "combo-4",
    telecom: { name: "LTE 데이터 6GB", desc: "데이터 6GB · 통화 무제한 · 문자 무제한", monthlyPrice: 33000 },
    subscriptions: [],
  },
  {
    id: "combo-5",
    telecom: { name: "5G 프리미엄", desc: "데이터 무제한 · 통화 무제한 · 문자 무제한", monthlyPrice: 85000 },
    subscriptions: [
      { name: "영상 구독 스탠다드", desc: "영상 스트리밍 2개 기기", monthlyPrice: 10900, billing: "통신 요금 합산" },
      { name: "음악 구독", desc: "음악 스트리밍 무제한", monthlyPrice: 7900, billing: "별도 결제" },
    ],
  },
];
