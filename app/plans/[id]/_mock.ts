// 요금제 상세 + 예상 변경 비용(/plans/[id]) 샘플 데이터. 실제 조회(상품·계약 시스템, 위약금 산정 API, PRD 9장) 연동 전까지 쓴다.

// [근거] PRD.md 9. 데이터와 연동 — 약정·혜택 유지 조건(계약 시스템), 요금제 카탈로그(상품 시스템), 예상 위약금·반환금(위약금 산정 API) (사용 화면 3)
// [확인 필요] 아래 금액·요금제 이름·날짜는 모두 화면 확인용 가짜 값이며 실제 상품과 관계없음
export type CostState = "default" | "loading" | "empty" | "error";

// [확인 필요] 예상 비용 영역의 상태(기본·로딩·빈·오류)를 바꿔 보는 방법이 문서에 없다. 이 값을 바꿔서 확인한다.
// "empty"는 약정·혜택 유지 기간이 모두 끝난 고객(위약금 없음)을 보여 준다.
export const COST_STATE: CostState = "default";

// [확인 필요] 산정 기준일(금일). 실제로는 API 조회 시점의 날짜를 써야 하는지 문서에 없다.
export const TODAY = "2026-10-21";

// [확인 필요] 상담 연결 번호(일반 / 전용)와 운영 시간 밖 처리 방식이 정해지지 않았다 (PRD Q4, FC-3). 정해지면 채운다.
export const COUNSEL_PHONE = "";

// F3-2 약정 종료일·혜택 유지 기간 종료일 (YYYY-MM-DD). 없으면 null
// [확인 필요] 내 이용 현황 화면과 같은 출처(계약 시스템)를 써야 하지만 화면끼리 값을 넘기는 방식이 정해지지 않아 따로 둔다.
export const CONTRACT = {
  contractEndDate: "2027-03-31" as string | null,
  benefitEndDate: "2026-09-30" as string | null,
};

export type CostItem = {
  label: string;
  /** 금일 기준 예상 금액(원, 부가세 포함) */
  amount: number;
};

// F3-2 금일 기준 예상 위약금·반환금 항목 (통신 요금제만, R13)
// [확인 필요] API가 돌려주는 항목 이름·개수가 문서에 없다. PRD 용어(위약금·할인 반환금)로 임시로 둔다.
export const COST_ITEMS: CostItem[] = [
  { label: "위약금", amount: 31000 },
  { label: "할인 반환금", amount: 84000 },
];

export type BillingMethod = "통신 요금 합산" | "별도 결제";

export type Feature = { label: string; value: string };

export type TelecomPlanDetail = {
  name: string;
  /** 월 요금(원, 부가세 포함) */
  monthlyPrice: number;
  /** F3-1 제공 내용 */
  features: Feature[];
};

export type SubscriptionPlanDetail = {
  name: string;
  /** 월 요금(원, 부가세 포함) */
  monthlyPrice: number;
  /** R12 상품마다 다른 청구 방식 */
  billing: BillingMethod;
  /** F3-1 제공 내용 */
  features: Feature[];
};

export type PlanComboDetail = {
  /** 2번 화면(/recommend)에서 넘어오는 조합 id */
  id: string;
  telecom: TelecomPlanDetail;
  /** A9 구독 요금제 0~N개 */
  subscriptions: SubscriptionPlanDetail[];
};

// F3-1 고른 통신·구독 요금제 조합의 상세
// [확인 필요] 라우트 [id]가 통신 + 구독 조합을 가리키는 방식이 문서에 없다 (02 plan-detail notes). 2번 화면 샘플의 조합 id를 그대로 쓴다.
// [확인 필요] 2번 화면 샘플(app/recommend/_mock.ts)과 같은 조합을 화면 확인용으로 다시 적었다. 실제로는 상품 시스템에서 조회한다.
export const PLAN_COMBOS: PlanComboDetail[] = [
  {
    id: "combo-1",
    telecom: {
      name: "5G 슬림",
      monthlyPrice: 47000,
      features: [
        { label: "데이터", value: "30GB" },
        { label: "통화", value: "무제한" },
        { label: "문자", value: "무제한" },
      ],
    },
    subscriptions: [
      {
        name: "영상 구독 베이직",
        monthlyPrice: 5500,
        billing: "통신 요금 합산",
        features: [{ label: "영상 스트리밍", value: "1개 기기" }],
      },
    ],
  },
  {
    id: "combo-2",
    telecom: {
      name: "5G 라이트",
      monthlyPrice: 55000,
      features: [
        { label: "데이터", value: "80GB" },
        { label: "통화", value: "무제한" },
        { label: "문자", value: "무제한" },
      ],
    },
    subscriptions: [
      {
        name: "음악 구독",
        monthlyPrice: 7900,
        billing: "별도 결제",
        features: [{ label: "음악 스트리밍", value: "무제한" }],
      },
    ],
  },
  {
    id: "combo-3",
    telecom: {
      name: "5G 스탠다드",
      monthlyPrice: 69000,
      features: [
        { label: "데이터", value: "150GB" },
        { label: "통화", value: "무제한" },
        { label: "문자", value: "무제한" },
      ],
    },
    subscriptions: [],
  },
  {
    id: "combo-4",
    telecom: {
      name: "LTE 데이터 6GB",
      monthlyPrice: 33000,
      features: [
        { label: "데이터", value: "6GB" },
        { label: "통화", value: "무제한" },
        { label: "문자", value: "무제한" },
      ],
    },
    subscriptions: [],
  },
  {
    id: "combo-5",
    telecom: {
      name: "5G 프리미엄",
      monthlyPrice: 85000,
      features: [
        { label: "데이터", value: "무제한" },
        { label: "통화", value: "무제한" },
        { label: "문자", value: "무제한" },
      ],
    },
    subscriptions: [
      {
        name: "영상 구독 스탠다드",
        monthlyPrice: 10900,
        billing: "통신 요금 합산",
        features: [{ label: "영상 스트리밍", value: "2개 기기" }],
      },
      {
        name: "음악 구독",
        monthlyPrice: 7900,
        billing: "별도 결제",
        features: [{ label: "음악 스트리밍", value: "무제한" }],
      },
    ],
  },
];
