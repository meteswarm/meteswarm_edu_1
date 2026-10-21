export type PlanRow = { label: string; value: string };

export type Plan = {
  id: string;
  name: string;
  summary: string;
  tagline?: string;
  price: number;
  originalPrice: number;
  discountRate: number;
  promotion: string;
  recommended: boolean;
  basics: PlanRow[];
  benefits: string[];
};

// Figma 화면 링크(node 4123-1297)에서 내용이 모두 보이는 요금제만 넣었다.
export const plans: Plan[] = [
  {
    id: "unlimited",
    name: "넉넉 무제한",
    summary: "데이터 무제한 · 통화 무제한 · 넷플릭스 포함",
    tagline: "영상·게임을 하루 종일 해도 걱정 없어요",
    price: 85000,
    originalPrice: 100000,
    discountRate: 15,
    promotion: "24개월 할인 프로모션",
    recommended: true,
    basics: [
      { label: "데이터", value: "무제한" },
      { label: "통화", value: "집·이동전화 무제한" },
      { label: "문자", value: "기본 제공" },
    ],
    benefits: ["넷플릭스 스탠다드", "유튜브 프리미엄"],
  },
  {
    id: "standard-110",
    name: "스탠다드 110",
    summary: "데이터 110GB · 통화 무제한",
    price: 69000,
    originalPrice: 78000,
    discountRate: 12,
    promotion: "24개월 할인 프로모션",
    recommended: true,
    basics: [
      { label: "데이터", value: "110GB" },
      { label: "통화", value: "무제한" },
    ],
    benefits: [],
  },
];

export const filters = ["데이터 많이", "가성비", "구독 포함", "통화 많이"];

export function getPlan(id: string | null | undefined) {
  return plans.find((plan) => plan.id === id);
}

export function formatWon(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}
