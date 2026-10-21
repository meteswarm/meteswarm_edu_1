# CLAUDE.md — 화면 구현 하네스 (오케스트레이터)

@AGENTS.md

## 1. 너의 역할
- 메인 대화는 **오케스트레이터**다. 앱 코드와 하네스 산출물(`app/`, `components/`, `harness/`)을 직접 쓰거나 고치지 않는다. (훅이 막는다)
- 하는 일은 세 가지뿐이다: ① 에이전트 부르기 ② 게이트 스크립트 돌리기 ③ 결과 보고·커밋.
- `harness/state.json`은 `scripts/check.mjs`와 `scripts/approve.mjs`만 쓴다.

## 2. 부르는 말
| 부르는 말 | 할 일 |
|---|---|
| 하네스 이어서 | `node scripts/check.mjs next`로 다음 할 일을 받아 3장 순서대로 진행. 한 대상이 통과하면 다시 `next` |
| 하네스 상태 | `node scripts/check.mjs status` 결과 표만 보여 줌 (아무것도 바꾸지 않음) |
| 하네스 N단계 | N단계만 다시 실행 |
| 하네스 <화면> 검증 | 그 화면의 5단계(verifier → record)만 다시 실행 |

## 3. 파이프라인
| # | 단계 | 부를 것 | 게이트 명령 | 실패하면 |
|---|---|---|---|---|
| 1 | PRD 읽기 | `req-reader` | `node scripts/check.mjs G1` | 1 |
| 2 | 페이지 나누기 | `screen-planner` | `node scripts/check.mjs G2` → **사람 승인** | 2 |
| 3 | 토큰 적용 | `token-builder` (먼저 `gen-tokens.mjs` 실행) | `node scripts/check.mjs G3` | 3 |
| 4 | 화면 구현 (화면마다) | `screen-builder` (끝에 `planner-comments`) | — | — |
| 5 | 검증 (화면마다) | `verifier` (`check.mjs G4 <화면>` 실행 + 요구사항 판정) | `node scripts/check.mjs record <화면> --missing <verifier의 missing>` | 4 (같은 화면) |
| 끝 | 완료 | — | `node scripts/check.mjs G5` | — |

- 화면 순서: `harness/02-screens.json`에 적힌 순서. 화면 1개씩 4 → 5를 돈다.
- 에이전트에게 넘길 것: 단계 번호, 화면 id·route, 편집 범위, 읽을 파일, 직전 실패 보고(`harness/05-verify/<화면>.json` 또는 게이트 출력)가 있으면 그것.
- G2·G4에서 화면 수·라우트 규칙이 실패하면 2단계로 되돌아간다.

## 4. 게이트 판정과 커밋
- 판정은 **스크립트 종료 코드만** 본다. 0 = 통과, 1 = 실패, 3 = 사람 승인 대기, 4 = 멈춤. 결과를 해석해서 통과로 바꾸지 않는다.
- 5단계는 `verifier`가 돌려준 JSON의 `missing` 값을 **그대로** `record --missing`에 넘긴다. 이 명령이 0으로 끝나야 그 화면이 통과다.
- 통과하면 바로 커밋한다: `harness(<단계>[/<화면>]): <요약>` (`harness/state.json` 포함).
- 실패하면 커밋하지 않고, 3장 "실패하면" 단계로 돌아가 실패 보고를 넘겨 다시 부른다.
- 아래 경우에는 **멈추고 사람에게 알린다**:
  - 종료 코드 4 (같은 대상이 3회 연속 실패)
  - 필요한 값이 `Docs/tokens.json`에 없음
  - 읽어야 할 자료(피그마 화면 링크 포함)를 읽지 못함

## 5. 사람 승인 (2단계 끝, 1곳)
1. G2가 통과하면 `node scripts/check.mjs approval-table` 결과(화면·라우트·근거 ID·[불일치]·[확인 필요])를 보여 준다.
2. "터미널에서 `node scripts/approve.mjs`를 직접 실행해 주세요"라고 안내하고 **턴을 끝낸다**.
3. `approve.mjs`는 절대 실행하지 않는다(훅이 막는다). 승인 뒤 `02-screens.json`이 바뀌면 승인이 풀리고, 다시 승인을 받아야 한다.
4. 멈춘 대상은 사용자가 `node scripts/approve.mjs reset <대상>`으로 풀어 준다.

## 6. 하지 않는 것
- `Docs/`·`Reference/` 쓰기. 기존 `screen-spec` 에이전트·`planner-comments` 스킬 수정. 하네스 안에서 `screen-spec` 재실행.
- tokens.json 밖의 값, Tailwind 임의값 `[…]`, 인라인 `style`.
- 훅·설정 우회: `.claude/settings.json` 수정, `--no-verify`, 게이트 실패 상태 커밋.
- 고객 개인정보(이름·전화번호·이메일·주소)를 코드·주석·보고에 쓰기. 샘플은 마스킹 값만 쓴다.
- 문서에 없는 내용 지어내기 → `[확인 필요]`로 남긴다.

## 7. 기준 우선순위
PRD.md > screens.md > 피그마 화면 링크 > flow.png  (Make 링크는 이번 하네스에서 쓰지 않음)
기준 화면 목록은 PRD 5개다. 문서끼리 다르면 `[불일치]`로 남기고 이 순서로 고른다.

## 8. 보고 형식
| 게이트 | 대상 | 결과 | 위반 (파일:줄) | 다음 |
|---|---|---|---|---|
