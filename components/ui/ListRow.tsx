import type { ReactNode } from "react";

// design.md 4.7 List/Row — Type: default / check. 상하 12, 좌우 4, 간격 12, border/subtle 구분선
export type ListRowType = "default" | "check";

export type ListRowProps = {
  label: string;
  value: ReactNode;
  type?: ListRowType;
};

export default function ListRow({ label, value, type = "default" }: ListRowProps) {
  const isCheck = type === "check";
  return (
    <div className="flex w-full items-center justify-between gap-12 border-b border-border-subtle px-4 py-12">
      <span className="flex min-w-0 items-center gap-4 text-body-small text-text-secondary">
        {isCheck && (
          <svg viewBox="0 0 24 24" className="size-24 shrink-0 stroke-icon-accent" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5 10 17.5 19 7" />
          </svg>
        )}
        {label}
      </span>
      <span className={isCheck ? "shrink-0 text-right text-body-small text-text-accent" : "shrink-0 text-right text-body-small text-text-primary"}>
        {value}
      </span>
    </div>
  );
}
