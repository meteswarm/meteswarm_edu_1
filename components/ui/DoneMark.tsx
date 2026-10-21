// design.md 4.13 icon/doneMark — 64 x 64, fill/primary 배경 + 흰색 내부 표시(icon/check). 변형 없음
export type DoneMarkProps = {
  /** 스크린리더용 이름. 없으면 장식으로 숨긴다 */
  label?: string;
};

export default function DoneMark({ label }: DoneMarkProps) {
  return (
    <span
      className="inline-flex size-64 shrink-0 items-center justify-center rounded-full bg-fill-primary"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg viewBox="0 0 24 24" className="size-24 stroke-icon-on-dark" fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5 10 17.5 19 7" />
      </svg>
    </span>
  );
}
