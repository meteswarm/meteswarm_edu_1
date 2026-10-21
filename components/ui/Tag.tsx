// design.md 4.12 Tag — 단일 컴포넌트, 변형 없음. radius/999, 배경 border/subtle, caption + text/secondary
export type TagProps = {
  label: string;
};

export default function Tag({ label }: TagProps) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-999 bg-border-subtle px-12 py-4 text-caption text-text-secondary">
      {label}
    </span>
  );
}
