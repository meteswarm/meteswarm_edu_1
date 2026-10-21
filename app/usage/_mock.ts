// 내 이용 현황(/usage) 샘플 데이터. 실제 조회(청구·사용량·계약 시스템, PRD 9장) 연동 전까지 쓴다.

// [근거] PRD.md 9. 데이터와 연동 — 월별 청구·월별 사용량·약정·혜택 유지 조건·가입 요금제 (사용 화면 1)
// [확인 필요] 아래 금액·요금제 이름·날짜는 모두 화면 확인용 가짜 값이며 실제 상품과 관계없음
export type UsageScreenState = "default" | "loading" | "empty" | "error";

// [확인 필요] 화면 상태(기본·로딩·빈·오류)를 바꿔 보는 방법이 문서에 없다. 이 값을 바꿔서 확인한다.
export const SCREEN_STATE: UsageScreenState = "default";

// [확인 필요] 남은 기간 계산의 기준일. 실제로는 조회 시점의 날짜를 써야 하는지 문서에 없다.
export const TODAY = "2026-10-21";

export type MonthlyBill = {
  month: string;
  /** 부가세 포함 청구 금액(원). 데이터가 없는 달은 null */
  amount: number | null;
};

// F1-1 최근 3개월 청구 금액 (오래된 달 → 최근 달)
export const MONTHLY_BILLS: MonthlyBill[] = [
  { month: "2026년 7월", amount: 68000 },
  { month: "2026년 8월", amount: 71500 },
  { month: "2026년 9월", amount: 66300 },
];

export type MonthlyUsage = {
  month: string;
  /** 데이터 사용량(GB) */
  dataGb: number | null;
  /** 음성 통화(분) */
  callMinutes: number | null;
  /** 문자(건) */
  smsCount: number | null;
};

// F1-2 최근 3개월 사용량
export const MONTHLY_USAGE: MonthlyUsage[] = [
  { month: "2026년 7월", dataGb: 18.4, callMinutes: 212, smsCount: 14 },
  { month: "2026년 8월", dataGb: 22.1, callMinutes: 187, smsCount: 9 },
  { month: "2026년 9월", dataGb: 16.7, callMinutes: 240, smsCount: 11 },
];

export type CurrentPlan = {
  name: string;
  desc: string;
  /** 월 요금(원, 부가세 포함) */
  monthlyPrice: number;
};

// F1-3 현재 가입한 통신 요금제 (회선당 1개, PRD A9)
export const CURRENT_TELECOM_PLAN: CurrentPlan = {
  name: "5G 스탠다드",
  desc: "데이터 150GB · 통화 무제한 · 문자 무제한",
  monthlyPrice: 69000,
};

// F1-3 현재 가입한 구독 요금제 (0~N개, PRD A9)
export const CURRENT_SUBSCRIPTIONS: CurrentPlan[] = [
  { name: "영상 구독 베이직", desc: "영상 스트리밍 1개 기기", monthlyPrice: 5500 },
];

// F1-4 약정 종료일·혜택 유지 기간 종료일 (YYYY-MM-DD). 없으면 null
export const CONTRACT = {
  contractEndDate: "2027-03-31" as string | null,
  benefitEndDate: "2026-09-30" as string | null,
};
