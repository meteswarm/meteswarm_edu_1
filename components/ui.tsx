import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function ArrowLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15 5l-7 7 7 7"
        className="stroke-icon-default"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ className = "stroke-icon-on-dark" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 12.5l4 4 8-9"
        className={className}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Logo 컴포넌트(32×24) 원본 에셋이 없어 브랜드 색 텍스트로 대신한다.
export function Logo() {
  return (
    <span aria-label="U+" className="text-heading-h4 text-brand-primary">
      U+
    </span>
  );
}

type HeaderProps =
  | { type: "root"; title: string }
  | { type: "default"; title: string; backHref: string };

export function Header(props: HeaderProps) {
  if (props.type === "root") {
    return (
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-bg-surface px-4 py-1">
        <h1 className="text-heading-h4 text-text-primary">{props.title}</h1>
        <Logo />
      </header>
    );
  }
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-bg-surface px-4 py-1">
      <Link href={props.backHref} aria-label="뒤로 가기" className="flex size-6 items-center justify-center">
        <ArrowLeftIcon />
      </Link>
      <h1 className="text-subtitle text-text-primary">{props.title}</h1>
      <span className="size-6" aria-hidden="true" />
    </header>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-[26px] w-fit items-center rounded-999 bg-border-subtle px-3 text-caption-bold text-text-secondary">
      {children}
    </span>
  );
}

export function SaleChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-6 w-fit items-center rounded-6 bg-bg-accent-subtle px-2.5 py-1 text-caption-bold text-icon-accent">
      {children}
    </span>
  );
}

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "xl";

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-10 px-6 py-2",
  xl: "h-[52px] w-full px-6 py-4",
};

function buttonClass(variant: ButtonVariant, size: ButtonSize, disabled = false) {
  const base = `inline-flex items-center justify-center rounded-8 ${sizeClass[size]}`;
  if (disabled) return `${base} bg-fill-disabled text-body-medium text-text-on-dark`;
  if (variant === "primary") {
    return `${base} bg-fill-primary text-body-medium text-text-on-dark hover:bg-fill-primary-hover`;
  }
  return `${base} border border-border-default bg-surface-default text-body-medium text-text-primary hover:bg-bg-subtle`;
}

export function Button({
  variant = "primary",
  size = "xl",
  disabled,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`${buttonClass(variant, size, disabled)} ${className}`}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "xl",
  children,
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={buttonClass(variant, size)}>
      {children}
    </Link>
  );
}

export function ListRow({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-1 py-3 last:border-b-0">
      <span className="text-body-small-medium text-text-secondary">{label}</span>
      <span className="text-right text-body-small-strong text-text-primary">{value}</span>
    </div>
  );
}

export function BottomCTA({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 mt-auto flex flex-col gap-3 border-t border-border-subtle bg-bg-surface px-4 pt-3 pb-8">
      {children}
    </div>
  );
}
