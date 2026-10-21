"use client";

import Button, { type ButtonProps } from "./Button";

// design.md 4.5 BottomCTA — Layout: single / double / price
// single·double: 패딩 12 / 16 / 32 / 16, 간격 8 · price: 패딩 16 / 16 / 32 / 16, 간격 12
// 버튼 문구는 내부 Button 의 label 로 바꾼다.
export type BottomCTALayout = "single" | "double" | "price";

type CTAButton = Omit<ButtonProps, "type" | "size" | "fullWidth">;

export type BottomCTAProps = {
  layout?: BottomCTALayout;
  /** Primary · xl 버튼 */
  primary: CTAButton;
  /** double 의 왼쪽 Secondary · xl 버튼 */
  secondary?: CTAButton;
  /** price 의 금액 */
  amount?: string;
  /** price 의 금액 라벨 */
  amountLabel?: string;
};

export default function BottomCTA({ layout = "single", primary, secondary, amount, amountLabel }: BottomCTAProps) {
  if (layout === "price") {
    return (
      <div className="flex w-full flex-col gap-12 border-t border-border-subtle bg-bg-surface px-16 pt-16 pb-32">
        <div className="flex items-center justify-between gap-8">
          <span className="text-body-small text-text-secondary">{amountLabel}</span>
          <span className="text-subtitle text-text-primary">{amount}</span>
        </div>
        <Button {...primary} type="Primary" size="xl" fullWidth />
      </div>
    );
  }

  if (layout === "double") {
    return (
      <div className="flex w-full items-center gap-8 border-t border-border-subtle bg-bg-surface px-16 pt-12 pb-32">
        {secondary && (
          <div className="w-2/5 shrink-0">
            <Button {...secondary} type="Secondary" size="xl" fullWidth />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <Button {...primary} type="Primary" size="xl" fullWidth />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 border-t border-border-subtle bg-bg-surface px-16 pt-12 pb-32">
      <Button {...primary} type="Primary" size="xl" fullWidth />
    </div>
  );
}
