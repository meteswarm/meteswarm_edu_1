"use client";

import type { ReactNode } from "react";
import Button from "./Button";
import Tag from "./Tag";

// design.md 4.6 Card/Plan — State: default / selected
// TEXT: Name · Desc · Discount · Price · Original, BOOLEAN: Badge · Promo · Sale
// 패딩 20, 내부 간격 8, radius/16. default = bg/surface + border/default, selected = bg/surface + border/medium
export type CardPlanState = "default" | "selected";

export type CardPlanProps = {
  name: string;
  desc?: ReactNode;
  price: string;
  discount?: string;
  original?: string;
  state?: CardPlanState;
  /** 추천 배지(Tag) 표시 */
  badge?: boolean;
  badgeLabel?: string;
  /** 프로모션 표시 */
  promo?: boolean;
  promoLabel?: string;
  /** 할인 관련 표시 (Discount · Original) */
  sale?: boolean;
  /** 내부 버튼(Secondary · sm) 문구. selected 이면 "선택됨" */
  buttonLabel?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  /** 카드 아래에 덧붙일 내용 (청구 방식 등) */
  children?: ReactNode;
};

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export default function CardPlan({
  name,
  desc,
  price,
  discount,
  original,
  state = "default",
  badge = false,
  badgeLabel,
  promo = false,
  promoLabel,
  sale = false,
  buttonLabel,
  buttonHref,
  onButtonClick,
  children,
}: CardPlanProps) {
  const selected = state === "selected";
  const label = selected ? "선택됨" : buttonLabel;

  return (
    <article
      aria-current={selected || undefined}
      className={cx(
        "flex w-full flex-col gap-8 rounded-16 border bg-bg-surface p-20",
        selected ? "border-border-medium" : "border-border-default",
      )}
    >
      <div className="flex items-center justify-between gap-8">
        <h3 className="min-w-0 text-subtitle text-text-primary">{name}</h3>
        {badge && badgeLabel && <Tag label={badgeLabel} />}
      </div>

      {desc && <p className="text-body-small text-text-secondary">{desc}</p>}

      {promo && promoLabel && (
        <span className="inline-flex self-start rounded-6 bg-bg-accent-subtle px-10 py-4 text-caption text-icon-accent">{promoLabel}</span>
      )}

      <div className="flex flex-col gap-4">
        {sale && original && <span className="text-caption text-text-tertiary line-through">{original}</span>}
        <div className="flex items-center gap-8">
          {sale && discount && <span className="text-subtitle text-text-accent">{discount}</span>}
          <span className="text-subtitle text-text-primary">{price}</span>
        </div>
      </div>

      {children}

      {label && (
        <Button
          label={label}
          type="Secondary"
          size="sm"
          fullWidth
          href={selected ? undefined : buttonHref}
          onClick={onButtonClick}
        />
      )}
    </article>
  );
}
