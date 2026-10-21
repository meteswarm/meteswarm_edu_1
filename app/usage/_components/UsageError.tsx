"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

// [근거] PRD.md 8. 화면 상태 — 화면 1 오류: 조회 실패 → 다시 시도 [가정]
export default function UsageError() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-16 px-16 py-64 text-center">
      {/* [영역] 조회 실패 안내 */}
      {/* [확인 필요] 오류 안내 문구 원문이 문서에 없어 임시 문구임 */}
      <div className="flex flex-col gap-8">
        <p className="text-subtitle text-text-primary">이용 현황을 불러오지 못했어요</p>
        <p className="text-body-small text-text-secondary">잠시 후 다시 시도해 주세요.</p>
      </div>
      {/* [동작] 누르면 이 화면을 서버에서 다시 불러옴(새로고침) */}
      {/* [확인 필요] 다시 시도 횟수 제한이나 계속 실패할 때의 처리는 문서에 없음 */}
      <Button label="다시 시도" type="Secondary" size="lg" onClick={() => router.refresh()} />
    </div>
  );
}
