import CardPlan from "@/components/ui/CardPlan";
import type { CurrentPlan } from "../_mock";
import Section, { formatWon } from "./Section";

export default function PlanSection({ telecom, subscriptions }: { telecom: CurrentPlan; subscriptions: CurrentPlan[] }) {
  // [근거] PRD.md F1-3 현재 가입한 통신 요금제와 구독 요금제, A9(통신 1개 + 구독 0~N개)
  return (
    <Section title="지금 쓰는 요금제">
      {/* [영역] 통신 요금제 카드 — 추천 배지·할인·프로모션 표시는 모두 끈 기본 카드 */}
      {/* [확인 필요] 카드 안 버튼이 필요한지 문서에 없어 버튼 없이 보여줌 */}
      <div className="flex flex-col gap-8">
        <span className="text-body-small text-text-secondary">통신 요금제</span>
        <CardPlan name={telecom.name} desc={telecom.desc} price={`월 ${formatWon(telecom.monthlyPrice)}`} />
      </div>

      {/* [영역] 구독 요금제 카드 목록 */}
      <div className="flex flex-col gap-8">
        <span className="text-body-small text-text-secondary">구독 요금제</span>
        {/* [조건] 가입한 구독 요금제가 없으면 카드 대신 "없어요" 안내를 보여줌 */}
        {/* [확인 필요] 구독 요금제가 없을 때의 문구는 문서에 없어 임시 문구임 */}
        {subscriptions.length === 0 ? (
          <p className="text-body-small text-text-tertiary">가입한 구독 요금제가 없어요.</p>
        ) : (
          subscriptions.map((s) => (
            <CardPlan key={s.name} name={s.name} desc={s.desc} price={`월 ${formatWon(s.monthlyPrice)}`} />
          ))
        )}
      </div>
    </Section>
  );
}
