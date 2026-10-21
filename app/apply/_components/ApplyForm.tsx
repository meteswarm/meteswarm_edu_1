"use client";

import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import {
  LINE_ID,
  saveApplication,
  type ApplyItem,
  type ChangeApplicationDraft,
  type CostItem,
  type Term,
} from "../_mock";
import CounselButton from "./CounselButton";
import TermsAgreement from "./TermsAgreement";

// [근거] PRD.md 화면 4 인수 조건 — 필수 약관 모두 동의해야 제출 활성, 제출 중 비활성화, 저장 실패 시 오류 안내·입력 유지·다시 시도
// [근거] PRD.md F4-5 — 제출하면 변경신청을 저장하고 예상 변경 비용을 스냅숏으로 함께 저장
export default function ApplyForm({
  items,
  costItems,
  baseDate,
  terms,
  initialSubmitting,
  initialSaveError,
  children,
}: {
  items: ApplyItem[];
  costItems: CostItem[];
  baseDate: string;
  terms: Term[];
  initialSubmitting: boolean;
  initialSaveError: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  // [동작] 약관마다 동의했는지, 제출 중인지, 저장에 실패했는지를 화면이 기억하는 값(state)으로 들고 있음
  const [agreed, setAgreed] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(initialSubmitting);
  const [saveError, setSaveError] = useState(initialSaveError);
  const submittingRef = useRef(initialSubmitting);

  // [조건] 필수 약관에 모두 동의했고 제출 중이 아닐 때만 신청 버튼을 누를 수 있음
  const allRequiredAgreed = terms.filter((t) => t.required).every((t) => agreed[t.id] === true);
  const canSubmit = allRequiredAgreed && !submitting;

  function toggle(termId: string) {
    setAgreed((prev) => ({ ...prev, [termId]: !prev[termId] }));
  }

  // [동작] 신청(또는 다시 시도)을 누르면 변경신청 내용을 만들어 저장함
  // [조건] 필수 약관 미동의이거나 이미 제출 중이면 아무 일도 하지 않음 — 빠르게 두 번 눌러도 한 번만 저장(중복 제출 방지)
  async function submit() {
    if (!allRequiredAgreed || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setSaveError(false);

    // [동작] 저장할 내용 — 회선, 신청 항목(변경·가입), 예상 비용 스냅숏, 산정 기준일, 약관 동의 내역, 신청 일시 (PRD 9장)
    // [확인 필요] 회선 값은 로그인 세션에서 받아야 하나 정해지지 않아 비어 있음
    const draft: ChangeApplicationDraft = {
      lineId: LINE_ID,
      items,
      costSnapshot: { items: costItems, total: costItems.reduce((sum, i) => sum + i.amount, 0) },
      baseDate,
      agreements: terms.map((t) => ({ termId: t.id, required: t.required, agreed: agreed[t.id] === true })),
      appliedAt: new Date().toISOString(),
    };

    // [확인 필요] 실제 저장 API가 없어 _mock.ts 값으로 저장 성공·실패를 흉내 냄
    const result = await saveApplication(draft);
    // [동작] 저장에 성공하면 5번 화면(신청 완료, /apply/complete)으로 이동. 이동하는 동안 버튼은 계속 비활성화
    // [확인 필요] 저장한 신청 내용(신청번호 등)을 5번 화면에 넘기는 방식이 문서에 없어 지금은 이동만 함
    if (result.ok) {
      router.push("/apply/complete");
      return;
    }
    // [조건] 저장에 실패하면 버튼을 다시 살리고 오류 안내를 띄움. 약관 동의 체크는 그대로 남김(입력 유지)
    submittingRef.current = false;
    setSubmitting(false);
    setSaveError(true);
  }

  return (
    <>
      {/* [영역] 본문 — 신청 내용, 예상 변경 비용, 약관 동의, 저장 실패 안내, 부가세 안내 순서 (design.md 3.2 패딩·간격 16) */}
      <main className="flex flex-1 flex-col gap-16 p-16">
        {/* [영역] 신청 내용과 예상 변경 비용 — 바깥(page.tsx)에서 받아와 그대로 보여줌 */}
        {children}

        {/* [영역] 약관 동의 (F4-3) */}
        {/* [조건] 제출 중에는 체크를 바꿀 수 없음 */}
        <TermsAgreement terms={terms} agreed={agreed} disabled={submitting} onToggle={toggle} />

        {/* [영역] 저장 실패 안내와 다시 시도 (화면 4 인수 조건, PRD 8장 오류) */}
        {/* [조건] 저장에 실패했을 때만 보여줌. 다시 제출하면 사라짐 */}
        {/* [확인 필요] 오류 안내 문구 원문이 문서에 없어 임시 문구임 (굵기 토큰 없음) */}
        {saveError && (
          <div role="alert" className="flex flex-col gap-12 rounded-12 bg-bg-error-subtle p-16">
            <div className="flex flex-col gap-4">
              <p className="text-subtitle text-text-error">신청을 저장하지 못했어요</p>
              <p className="text-body-small text-text-secondary">입력한 내용은 그대로 남아 있어요. 다시 시도해 주세요.</p>
            </div>
            {/* [동작] 누르면 같은 약관 동의 내용으로 다시 저장을 시도함 */}
            {/* [조건] 필수 약관 동의가 빠져 있거나 제출 중이면 누를 수 없음 */}
            <Button
              label="다시 시도"
              type="Secondary"
              size="sm"
              state={canSubmit ? "Default" : "Disabled"}
              onClick={submit}
            />
          </div>
        )}

        {/* [영역] 부가세 포함 안내 — NFR-4 [가정] */}
        {/* [확인 필요] 부가세 안내 문구는 문서에 정해진 원문이 없어 임시 문구임 */}
        <p className="text-caption text-text-tertiary">모든 금액은 부가세 포함 금액이에요.</p>
      </main>

      {/* [영역] 하단 버튼 — 변경 신청과 [상담사 연결]을 세로로 배치 (design.md 3.2). BottomCTA가 아닌 일반 영역 */}
      <div className="sticky bottom-0 flex flex-col gap-8 border-t border-border-subtle bg-bg-surface px-16 pt-12 pb-32">
        {/* [동작] 누르면 변경신청을 저장하고, 성공하면 신청 완료 화면으로 이동 (F4-5) */}
        {/* [조건] 필수 약관 미동의이거나 제출 중이면 회색(비활성화)으로 바뀌어 누를 수 없음. 제출 중에는 문구가 "신청하는 중"으로 바뀜 */}
        {/* [확인 필요] 버튼 문구 원문이 문서에 없음 — screens.md는 '신청', PRD.md 용어로 '변경 신청'을 씀 */}
        <Button
          label={submitting ? "신청하는 중" : "변경 신청"}
          type="Primary"
          size="xl"
          fullWidth
          state={canSubmit ? "Default" : "Disabled"}
          onClick={submit}
        />
        {/* [동작] 누르면 상담사에게 바로 전화 연결 (F4-4, FC-1, FC-2) */}
        <CounselButton />
      </div>
    </>
  );
}
