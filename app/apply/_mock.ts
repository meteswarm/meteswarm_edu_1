// 변경 신청(/apply) 샘플 데이터. 실제 저장(이 서비스 저장소, PRD 9장)과 위약금 산정 API 연동 전까지 쓴다.
// 고객 개인정보(이름·전화번호·이메일)는 이 화면에 필요 없어 넣지 않는다 (PRD 화면 4, A4 로그인한 기존 고객).

// [근거] PRD.md 9. 데이터와 연동 — 변경신청(이 서비스에 저장, 사용 화면 4·5), 예상 위약금·반환금(위약금 산정 API, 사용 화면 3·4)
// [확인 필요] 아래 요금제 이름·금액·날짜·약관은 모두 화면 확인용 가짜 값이며 실제 상품·약관과 관계없음
export type ApplyScreenState = "default" | "loading" | "empty" | "error";

// [확인 필요] 화면 상태(기본·로딩·빈·오류)를 바꿔 보는 방법이 문서에 없다. 이 값을 바꿔서 확인한다.
// "loading" = 제출 중(버튼 비활성화), "empty" = 신청 항목 없음, "error" = 저장 실패 안내가 떠 있는 상태
export const SCREEN_STATE: ApplyScreenState = "default";

// [확인 필요] 실제 저장 API가 없다. 제출했을 때 저장 성공·실패를 이 값으로 흉내 낸다.
export const SAVE_RESULT: "success" | "fail" = "success";

// [확인 필요] 저장에 걸리는 시간을 흉내 내는 값(밀리초). 실제 응답 시간과 관계없다.
export const SAVE_DELAY_MS = 1200;

// [확인 필요] 산정 기준일(금일). 3번 화면에서 조회한 기준일을 넘겨받아야 하는지 문서에 없다.
export const TODAY = "2026-10-21";

// [확인 필요] 상담 연결 번호(일반 / 전용)와 운영 시간 밖 처리 방식이 정해지지 않았다 (PRD Q4, FC-3). 정해지면 채운다.
export const COUNSEL_PHONE = "";

// [확인 필요] 변경신청의 '회선' 필드(PRD 9장)를 무엇으로 식별할지 정해지지 않았다. 전화번호는 넣지 않는다. 로그인 세션에서 받는 값으로 채운다.
export const LINE_ID = "";

export type BillingMethod = "통신 요금 합산" | "별도 결제";

// F4-1 신청 항목 — 통신 요금제는 '변경', 구독 요금제는 '가입' (PRD 9장 구분 = 변경 | 가입)
export type ApplyItem =
  | { category: "통신"; kind: "변경"; planName: string; monthlyPrice: number }
  | { category: "구독"; kind: "가입"; planName: string; monthlyPrice: number; billing: BillingMethod };

// [확인 필요] 3번 화면(/plans/[id])에서 고른 조합을 이 화면으로 넘기는 방식이 문서에 없다. 3번 화면 샘플 조합 하나를 그대로 적었다.
export const APPLY_ITEMS: ApplyItem[] = [
  { category: "통신", kind: "변경", planName: "5G 슬림", monthlyPrice: 47000 },
  { category: "구독", kind: "가입", planName: "영상 구독 베이직", monthlyPrice: 5500, billing: "통신 요금 합산" },
];

export type CostItem = {
  label: string;
  /** 금일 기준 예상 금액(원, 부가세 포함) */
  amount: number;
};

// F4-2 예상 변경 비용 (통신 요금제만, R13). 빈 목록이면 '위약금 없음'
// [확인 필요] 3번 화면에서 조회한 값을 다시 쓰는지, 이 화면에서 다시 조회하는지 문서에 없다.
export const COST_ITEMS: CostItem[] = [
  { label: "위약금", amount: 31000 },
  { label: "할인 반환금", amount: 84000 },
];

export type Term = {
  id: string;
  title: string;
  required: boolean;
};

// F4-3 약관 목록
// [확인 필요] 약관 목록과 필수 여부가 정해지지 않았다 (PRD Q5). PRD Q5에 적힌 예(위약금 고지, 개인정보 조회 동의)로 임시 목록을 둔다.
export const TERMS: Term[] = [
  { id: "terms-change", title: "요금제 변경 신청 약관 동의", required: true },
  { id: "terms-penalty-notice", title: "예상 위약금·반환금 고지 확인", required: true },
  { id: "terms-privacy-lookup", title: "개인정보 조회 동의", required: true },
];

// F4-5 예상 변경 비용 스냅숏 — 제출 시점의 예상 비용을 그대로 저장한다 (PRD 9장, 11. 리스크)
export type CostSnapshot = {
  items: CostItem[];
  total: number;
};

export type TermAgreement = {
  termId: string;
  required: boolean;
  agreed: boolean;
};

export type ApplicationStatus = "접수" | "처리중" | "완료" | "실패";

// PRD 9장 변경신청 주요 필드 중 제출 때 화면이 만드는 부분
export type ChangeApplicationDraft = {
  lineId: string;
  items: ApplyItem[];
  costSnapshot: CostSnapshot;
  baseDate: string;
  agreements: TermAgreement[];
  /** 신청 일시 (ISO 8601) */
  appliedAt: string;
};

// PRD 9장 변경신청 — 저장 후 신청번호·상태가 붙는다
export type ChangeApplication = ChangeApplicationDraft & {
  applicationNo: string;
  status: ApplicationStatus;
};

export type SaveResult = { ok: true; application: ChangeApplication } | { ok: false };

// [확인 필요] 신청번호 형식이 문서에 없다. 화면 확인용 가짜 값이다.
const MOCK_APPLICATION_NO = "APPLY-MOCK-0001";

// [확인 필요] 실제 저장 API가 없어 SAVE_RESULT·SAVE_DELAY_MS 값으로 저장을 흉내 낸다. 저장 직후 상태는 '접수'로 둔다 (PRD 11. 리스크, Q2).
export function saveApplication(draft: ChangeApplicationDraft): Promise<SaveResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (SAVE_RESULT === "fail") resolve({ ok: false });
      else resolve({ ok: true, application: { ...draft, applicationNo: MOCK_APPLICATION_NO, status: "접수" } });
    }, SAVE_DELAY_MS);
  });
}
