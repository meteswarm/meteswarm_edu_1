import { COST_NOTICE } from "./notices";

// N1 · PRD F3-4, F4-2 — 예상 비용 옆에 금액 차이 안내 문구와 산정 기준일을 항상 함께 보여 준다.
export type CostNoticeProps = {
  /** 산정 기준일 (화면에서 형식을 맞춰 넘긴다) */
  baseDate: string;
};

export default function CostNotice({ baseDate }: CostNoticeProps) {
  return (
    <aside role="note" className="flex w-full flex-col gap-4 rounded-12 bg-bg-default p-16">
      <p className="text-caption text-text-secondary">{COST_NOTICE}</p>
      <p className="text-caption text-text-tertiary">산정 기준일 {baseDate}</p>
    </aside>
  );
}
