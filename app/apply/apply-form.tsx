"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BottomCTA, Button, ButtonLink, CheckIcon, Header, ListRow } from "@/components/ui";
import {
  createApplicationNumber,
  isValidPhone,
  normalizePhone,
  saveApplication,
} from "@/lib/application";
import { formatWon, getPlan } from "@/lib/plans";

function TextField({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputMode?: "text" | "tel";
  autoComplete?: string;
}) {
  const id = useId();
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-body-small-medium text-text-secondary">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        className="h-[58px] border-b border-border-default bg-transparent px-0.5 text-body-strong text-text-primary outline-none placeholder:text-text-placeholder focus:border-border-focus"
      />
    </div>
  );
}

export function ApplyForm() {
  const router = useRouter();
  const plan = getPlan(useSearchParams().get("plan"));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!plan) {
    return (
      <>
        <Header type="default" title="변경 신청" backHref="/plans" />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <p className="text-body-medium text-text-secondary">선택한 요금제를 찾을 수 없어요</p>
          <ButtonLink href="/plans" variant="secondary" size="sm">
            요금제 보기
          </ButtonLink>
        </main>
      </>
    );
  }

  const canSubmit = name.trim().length > 0 && isValidPhone(phone) && agreed && !submitting;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!plan || !canSubmit) return;
    setSubmitting(true);
    setFailed(false);
    const now = new Date();
    const saved = saveApplication({
      number: createApplicationNumber(now),
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      name: name.trim(),
      phone: normalizePhone(phone),
      submittedAt: now.toISOString(),
    });
    if (!saved) {
      setSubmitting(false);
      setFailed(true);
      return;
    }
    router.push("/apply/complete");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <Header type="default" title="변경 신청" backHref={`/plans/${plan.id}`} />
      <main className="flex flex-1 flex-col gap-6 px-4 pt-6 pb-6">
        <h2 className="text-heading-h3 text-text-primary">
          신청 정보를
          <br />
          입력해주세요
        </h2>

        <section className="rounded-12 bg-bg-default px-5 py-2">
          <ListRow label="선택한 요금제" value={plan.name} />
          <ListRow label="월 요금" value={formatWon(plan.price)} />
        </section>

        <section className="flex flex-col gap-6">
          <TextField
            label="이름"
            value={name}
            onChange={setName}
            placeholder="이름을 입력해 주세요"
            autoComplete="name"
          />
          <TextField
            label="휴대폰 번호"
            value={phone}
            onChange={setPhone}
            placeholder="010-0000-0000"
            inputMode="tel"
            autoComplete="tel"
          />
        </section>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            className="peer sr-only"
          />
          <span
            className={`flex size-6 shrink-0 items-center justify-center rounded-4 peer-focus-visible:outline-2 peer-focus-visible:outline-border-focus ${
              agreed ? "bg-fill-primary" : "border border-border-default bg-bg-surface"
            }`}
            aria-hidden="true"
          >
            {agreed && <CheckIcon />}
          </span>
          <span className="text-body-small-medium text-text-primary">
            [필수] 개인정보 수집·이용에 동의합니다
          </span>
        </label>

        {failed && (
          <p role="alert" className="text-body-small-medium text-text-error">
            신청을 저장하지 못했어요. 다시 시도해 주세요.
          </p>
        )}
      </main>

      <BottomCTA>
        <Button type="submit" disabled={!canSubmit}>
          {submitting ? "신청 중" : "신청하기"}
        </Button>
      </BottomCTA>
    </form>
  );
}
