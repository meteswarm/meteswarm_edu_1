"use client";

import Link from "next/link";
import type { MouseEventHandler } from "react";

// design.md 4.1 Button — Type: Primary / Secondary, Size: sm / lg / xl, State: Default / Hover / Disabled
export type ButtonType = "Primary" | "Secondary";
export type ButtonSize = "sm" | "lg" | "xl";
export type ButtonState = "Default" | "Hover" | "Disabled";

export type ButtonProps = {
  label: string;
  type?: ButtonType;
  size?: ButtonSize;
  state?: ButtonState;
  /** 폭을 부모에 맞춘다 */
  fullWidth?: boolean;
  /** 있으면 링크로 그린다. "/" 로 시작하면 next/link, 그 밖(tel: 등)은 a */
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  htmlType?: "button" | "submit" | "reset";
  className?: string;
};

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const SIZE: Record<ButtonSize, string> = {
  sm: "py-8 px-24",
  lg: "py-12 px-24",
  xl: "py-16 px-24",
};

function typeClass(type: ButtonType, state: ButtonState) {
  if (state === "Disabled") return "bg-fill-disabled text-text-on-dark border border-transparent";
  if (type === "Primary") {
    return state === "Hover"
      ? "bg-fill-primary-hover text-text-on-dark border border-transparent"
      : "bg-fill-primary hover:bg-fill-primary-hover text-text-on-dark border border-transparent";
  }
  return state === "Hover"
    ? "bg-bg-subtle text-text-primary border border-border-default"
    : "bg-surface-default hover:bg-bg-subtle text-text-primary border border-border-default";
}

export default function Button({
  label,
  type = "Primary",
  size = "xl",
  state = "Default",
  fullWidth = false,
  href,
  onClick,
  htmlType = "button",
  className,
}: ButtonProps) {
  const disabled = state === "Disabled";
  const classes = cx(
    "inline-flex items-center justify-center rounded-8 text-body text-center transition-colors select-none",
    SIZE[size],
    typeClass(type, state),
    fullWidth && "w-full",
    disabled ? "cursor-not-allowed" : "cursor-pointer",
    className,
  );

  if (href && !disabled) {
    if (href.startsWith("/")) {
      return (
        <Link href={href} className={classes} onClick={onClick}>
          {label}
        </Link>
      );
    }
    return (
      <a href={href} className={classes} onClick={onClick}>
        {label}
      </a>
    );
  }

  return (
    <button type={htmlType} className={classes} onClick={onClick} disabled={disabled} aria-disabled={disabled}>
      {label}
    </button>
  );
}
