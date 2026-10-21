import Button from "@/components/ui/Button";
import { COUNSEL_PHONE } from "../_mock";

// [근거] PRD.md 공통 [상담사 연결] 버튼 FC-1(Button Secondary), FC-2(바로 전화 연결), R7·R9
// [영역] [상담사 연결] 버튼 — 예상 비용 오류 영역과 펜딩 재약정 안내에서 함께 씀
// [동작] 누르면 별도 화면 없이 전화 앱으로 바로 연결(tel: 링크)
// [확인 필요] 상담 연결 번호가 정해지지 않아(PRD Q4) 지금은 번호가 비어 있음 — 눌러도 전화가 걸리지 않을 수 있음
// [확인 필요] 운영 시간 밖에 눌렀을 때의 처리가 정해지지 않음 (FC-3, Q4)
export default function CounselButton() {
  return <Button label="상담사 연결" type="Secondary" size="xl" fullWidth href={`tel:${COUNSEL_PHONE}`} />;
}
