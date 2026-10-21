// 신청 완료(/apply/complete) 샘플 데이터. 실제 변경신청 저장소(이 서비스 저장소, PRD 9장) 연동 전까지 쓴다.
// [근거] PRD.md 9. 데이터와 연동 — 변경신청은 이 서비스에 저장하고 화면 4·5에서 씀
// [근거] PRD.md NFR-2, F5-3 — 신청자 정보는 마스킹한 값만 둔다. 가리지 않은 이름·전화번호와 이메일은 넣지 않는다
// [확인 필요] 아래 요금제 이름·금액·신청번호·일시·신청자 값은 모두 화면 확인용 가짜 값이며 실제 고객·상품과 관계없음
export type CompleteScreenState = "default" | "loading" | "empty" | "error";

// [확인 필요] 화면 상태(기본·로딩·빈·오류)가 PRD 8장과 screens.md 모두에 정의되지 않았다. 이 값을 바꿔서 확인한다.
// "loading" = 신청 내역을 불러오는 중, "empty" = 신청 내역 없음, "error" = 신청 내역을 불러오지 못함
export const SCREEN_STATE: CompleteScreenState = "default";

// [근거] PRD.md F5-2, 11. 리스크 — 저장 흐름은 접수이고 처리 결과는 따로 알림
// [확인 필요] 처리 결과 알림 채널(문자 등)과 안내 문구 원문이 정해지지 않았다 (PRD Q2·Q9). 임시 문구다.
export const RESULT_NOTICE_TEXT = "처리 결과는 따로 알려 드려요.";

// [근거] PRD.md F5-2 "문자 등", screens.md 신청 완료 화면 "개통 안내는 문자로 보내드려요" — 문서에 나온 채널이 문자뿐이라 문자로 둔다
// [확인 필요] 알림 채널이 확정되지 않았다 (PRD Q2·Q9). screens.md의 개통 안내 문자와 같은 문자인지도 미정. 정해지면 바꾼다.
// [조건] 고객 전화번호는 붙이지 않는다 (NFR-2). 채널 이름만 둔다.
export const RESULT_NOTICE_CHANNEL = "문자";

// F5-1 신청 항목 — 통신 요금제는 '변경', 구독 요금제는 '가입' (PRD 9장 구분 = 변경 | 가입)
export type ApplicationItem =
  | { category: "통신"; kind: "변경"; planName: string; monthlyPrice: number }
  | { category: "구독"; kind: "가입"; planName: string; monthlyPrice: number };

// F5-3 신청자 정보 — 마스킹한 이름과 가운데를 가린 전화번호만 들고 있음
// [확인 필요] 마스킹 규칙(이름의 몇 글자를 가릴지 등)이 문서에 없다. 실제 값은 로그인 세션에서 받아 마스킹해야 한다.
export type Applicant = {
  customerName: string;
  maskedPhone: string;
};

// PRD 9장 변경신청 주요 필드 중 이 화면이 보여 주는 부분 (신청번호, 신청 항목, 신청 일시) + 신청자 정보
export type CompletedApplication = {
  applicationNo: string;
  items: ApplicationItem[];
  appliedAt: string;
  applicant: Applicant;
};

// [확인 필요] 4번 화면에서 저장한 신청 내용을 이 화면으로 넘기는 방식이 문서에 없다. 4번 화면 샘플 조합과 같은 값을 적었다.
// [확인 필요] 신청번호 형식이 문서에 없다. 화면 확인용 가짜 값이다.
export const APPLICATION: CompletedApplication = {
  applicationNo: "APPLY-MOCK-0001",
  items: [
    { category: "통신", kind: "변경", planName: "5G 슬림", monthlyPrice: 47000 },
    { category: "구독", kind: "가입", planName: "영상 구독 베이직", monthlyPrice: 5500 },
  ],
  appliedAt: "2026-10-21T14:00",
  applicant: {
    customerName: "이**",
    maskedPhone: "010-****-0000",
  },
};
