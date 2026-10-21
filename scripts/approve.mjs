// 사람 전용 스크립트. 사용자가 터미널에서 직접 실행한다. (AI 가 실행하면 훅이 막는다)
//   node scripts/approve.mjs                 G2 를 통과한 harness/02-screens.json 을 승인 (해시 기록)
//   node scripts/approve.mjs reset <대상>     멈춘 대상의 연속 실패 횟수를 0 으로 (대상: G1 | G2 | G3 | G5 | 화면 id)
import { P, fileHash, loadState, saveState } from "./lib/harness.mjs";

const [cmd, target] = process.argv.slice(2);
const state = loadState();

if (cmd === "reset") {
  if (!target) {
    console.error("사용법: node scripts/approve.mjs reset <G1|G2|G3|G5|화면 id>");
    process.exit(2);
  }
  const stage = target.match(/^G([1235])$/);
  if (stage) {
    state.failures[target] = 0;
    if (state.stages[stage[1]]) state.stages[stage[1]].status = "failed";
  } else if (state.screens[target]) {
    state.failures[`G4:${target}`] = 0;
    state.screens[target].status = "failed";
  } else {
    console.error(`대상 없음: ${target}`);
    process.exit(2);
  }
  saveState(state);
  console.log(`${target}: 연속 실패 0회로 초기화. "하네스 이어서"로 다시 시작하세요.`);
} else if (!cmd) {
  const hash = fileHash(P.screens);
  const g2 = state.stages[2];
  if (!hash || g2?.status !== "passed" || g2.hash !== hash) {
    console.error("승인할 수 없음: G2 를 통과한 뒤 02-screens.json 이 바뀌었거나 G2 를 아직 통과하지 않았습니다.");
    process.exit(1);
  }
  state.approval = { hash, at: new Date().toISOString() };
  saveState(state);
  console.log(`승인 완료 (${P.screens} ${hash.slice(0, 12)}…). "하네스 이어서"로 3단계를 시작하세요.`);
} else {
  console.error("사용법: node scripts/approve.mjs [reset <대상>]");
  process.exit(2);
}
