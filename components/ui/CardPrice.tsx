import type { ReactNode } from "react";

// Card/Price — screens.md 요금제 상세의 외부 원본 참조 컴포넌트. 변형은 [확인 필요]라 두지 않는다.
// 표현은 design.md 의 "가격 요약 패널"을 따른다: bg/default, radius/12, 큰 금액 heading/h2, 보조 정보 caption + text/tertiary
export type CardPriceProps = {
  /** 요금제 이름 */
  name: string;
  /** 금액 (예: 월 요금·월 합계) */
  amount: string;
  /** 금액 위 보조 라벨 */
  amountLabel?: string;
  /** 금액 아래 보조 정보 (부가세 포함 등) */
  caption?: ReactNode;
  children?: ReactNode;
};

export default function CardPrice({ name, amount, amountLabel, caption, children }: CardPriceProps) {
  return (
    <section className="flex w-full flex-col gap-8 rounded-12 bg-bg-default p-20">
      <h2 className="text-subtitle text-text-primary">{name}</h2>
      <div className="flex flex-col gap-4">
        {amountLabel && <span className="text-caption text-text-tertiary">{amountLabel}</span>}
        <p className="text-heading-h2 text-text-primary">{amount}</p>
        {caption && <p className="text-caption text-text-tertiary">{caption}</p>}
      </div>
      {children}
    </section>
  );
}
