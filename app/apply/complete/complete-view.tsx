"use client";

import { useMemo, useSyncExternalStore } from "react";
import { BottomCTA, ButtonLink, CheckIcon, Header, ListRow } from "@/components/ui";
import {
  formatSubmittedAt,
  maskName,
  maskPhone,
  parseApplication,
  readApplicationRaw,
} from "@/lib/application";
import { formatWon } from "@/lib/plans";

const subscribe = () => () => {};
const getServerSnapshot = () => null;

export function CompleteView() {
  // 서버 렌더 때는 null, 브라우저에서는 저장된 신청 내역 문자열("" = 없음)
  const raw = useSyncExternalStore(subscribe, readApplicationRaw, getServerSnapshot);
  const application = useMemo(() => (raw ? parseApplication(raw) : null), [raw]);

  return (
    <>
      <Header type="default" title="신청 완료" backHref="/plans" />
      <main className="flex flex-1 flex-col gap-6 px-4 pt-4 pb-6">
        {raw === null ? null : application ? (
          <>
            <section className="flex flex-col items-center gap-6 pt-4 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-fill-primary">
                <CheckIcon />
              </span>
              <div className="flex flex-col gap-2">
                <h2 className="text-heading-h3 text-text-primary">변경 신청이 완료됐어요</h2>
                <p className="text-body-small-medium text-text-secondary">
                  개통 안내는 문자로 보내드려요
                </p>
              </div>
            </section>

            <section className="flex flex-col rounded-12 bg-bg-default px-4 py-4">
              <h3 className="mb-1 text-body-strong text-text-primary">신청 내역</h3>
              <ListRow label="신청 번호" value={application.number} />
              <ListRow label="요금제" value={application.planName} />
              <ListRow label="월 요금" value={formatWon(application.price)} />
              <ListRow label="신청 일시" value={formatSubmittedAt(application.submittedAt)} />
              <ListRow
                label="신청자"
                value={`${maskName(application.name)} · ${maskPhone(application.phone)}`}
              />
            </section>
          </>
        ) : (
          <p className="flex flex-1 items-center justify-center text-body-medium text-text-secondary">
            확인할 신청 내역이 없어요
          </p>
        )}
      </main>

      <BottomCTA>
        <ButtonLink href="/plans">요금제 더 보기</ButtonLink>
      </BottomCTA>
    </>
  );
}
