"use client";

import type { InputHTMLAttributes } from "react";

// design.md 4.2 Input — State: default / focus / filled / caution / disabled, errorMessage: boolean
// 하단 선 중심의 입력. 입력 영역과 메시지 간격 12, 메시지 아이콘과 글자 간격 4
export type InputState = "default" | "focus" | "filled" | "caution" | "disabled";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "disabled" | "size"> & {
  state?: InputState;
  /** 오류 메시지 표시 여부 (State 와 별개 속성) */
  errorMessage?: boolean;
  /** 표시할 오류 문구 */
  message?: string;
  /** 접근성 이름 (화면에 보이는 라벨 변형은 정의되어 있지 않다) */
  label?: string;
};

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const LINE: Record<InputState, string> = {
  default: "border-border-default focus-within:border-border-focus",
  focus: "border-border-focus",
  filled: "border-border-default focus-within:border-border-focus",
  caution: "border-border-error",
  disabled: "border-border-default bg-bg-subtle",
};

export default function Input({ state = "default", errorMessage = false, message, label, id, ...rest }: InputProps) {
  const disabled = state === "disabled";
  const showMessage = errorMessage && !!message;
  const messageId = showMessage && id ? `${id}-message` : undefined;

  return (
    <div className="flex w-full flex-col gap-12">
      <div className={cx("flex w-full items-center gap-10 border-b px-2 py-16", LINE[state])}>
        <input
          id={id}
          aria-label={label}
          aria-invalid={state === "caution" || undefined}
          aria-describedby={messageId}
          disabled={disabled}
          className={cx(
            "min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-text-placeholder",
            disabled ? "text-text-on-disabled cursor-not-allowed" : "text-text-primary",
          )}
          {...rest}
        />
      </div>
      {showMessage && (
        <p id={messageId} className="flex items-center gap-4 text-body-small text-text-error" role={state === "caution" ? "alert" : undefined}>
          <svg viewBox="0 0 24 24" className="size-16 shrink-0 stroke-icon-error" fill="none" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5.5M12 16.5v.5" />
          </svg>
          {message}
        </p>
      )}
    </div>
  );
}
