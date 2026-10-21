import CardPrice from "@/components/ui/CardPrice";
import ListRow from "@/components/ui/ListRow";
import type { PlanComboDetail } from "../_mock";

export function formatWon(amount: number) {
  return `${amount.toLocaleString("ko-KR")}원`;
}

// [조건] 월 합계 = 통신 요금제 + 구독 요금제 전부. 청구 방식(합산·별도 결제)과 관계없이 모두 더함 (R3, R4 [가정 A1])
export function comboTotal(combo: PlanComboDetail) {
  return combo.telecom.monthlyPrice + combo.subscriptions.reduce((sum, s) => sum + s.monthlyPrice, 0);
}

// [근거] PRD.md F3-1 — 고른 통신·구독 요금제의 월 요금, 제공 내용, 월 합계
// [근거] screens.md 요금제 상세 페이지 — Card/Price(가격 요약), List/Row(제공 혜택)
export default function PlanSummary({ combo }: { combo: PlanComboDetail }) {
  return (
    <>
      {/* [영역] 가격 요약 — 월 합계 큰 금액과 부가세 포함 안내 (Card/Price) */}
      {/* [확인 필요] Card/Price 변형이 문서에 없고, 카드 제목을 통신 요금제 이름으로 둘지도 정해지지 않아 임시로 통신 요금제 이름을 씀 */}
      <CardPrice
        name={combo.telecom.name}
        amountLabel="월 합계"
        amount={`월 ${formatWon(comboTotal(combo))}`}
        caption="부가세 포함 · 통신 요금제 + 구독 요금제"
      />

      {/* [영역] 통신 요금제 — 이름, 월 요금, 제공 내용(데이터·통화·문자) */}
      {/* [확인 필요] 제목 문구 원문이 문서에 없어 임시 문구임 (굵기 토큰 없음) */}
      <section className="flex flex-col gap-8">
        <h2 className="text-subtitle text-text-primary">통신 요금제</h2>
        <div className="flex flex-col">
          <ListRow label="요금제" value={combo.telecom.name} />
          <ListRow label="월 요금" value={`월 ${formatWon(combo.telecom.monthlyPrice)}`} />
          {combo.telecom.features.map((f) => (
            <ListRow key={f.label} label={f.label} value={f.value} />
          ))}
        </div>
      </section>

      {/* [영역] 구독 요금제 — 요금제마다 이름, 월 요금, 제공 내용, 청구 방식, 약정 없음 안내 */}
      {/* [조건] 구독 요금제에는 예상 변경 비용(위약금·반환금) 항목을 보여주지 않음 (F3-3, R13) */}
      <section className="flex flex-col gap-8">
        <h2 className="text-subtitle text-text-primary">구독 요금제</h2>
        {/* [조건] 함께 가입하는 구독 요금제가 없으면(0개) "없음" 안내만 보여줌 */}
        {/* [확인 필요] 구독 요금제가 없을 때의 문구는 문서에 없어 임시 문구임 */}
        {combo.subscriptions.length === 0 ? (
          <p className="text-body-small text-text-tertiary">함께 가입하는 구독 요금제 없음</p>
        ) : (
          combo.subscriptions.map((s) => (
            <div key={s.name} className="flex flex-col">
              <ListRow label="요금제" value={s.name} />
              <ListRow label="월 요금" value={`월 ${formatWon(s.monthlyPrice)}`} />
              {s.features.map((f) => (
                <ListRow key={f.label} label={f.label} value={f.value} />
              ))}
              {/* [근거] R12 — 청구 방식(통신 요금 합산 / 별도 결제)은 상품마다 표시 */}
              <ListRow label="청구 방식" value={s.billing} />
              {/* [근거] R14 [가정 A11] — 구독 요금제마다 "약정 없음 · 언제든 해지 가능" 표시 */}
              <p className="px-4 pt-8 text-caption text-text-secondary">약정 없음 · 언제든 해지 가능</p>
            </div>
          ))
        )}
      </section>
    </>
  );
}
