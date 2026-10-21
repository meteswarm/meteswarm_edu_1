// 하네스 판정 스크립트. 종료 코드 0 = 통과, 1 = 실패, 2 = 사용법 오류, 3 = 사람 승인 대기, 4 = 멈춤(사람 확인 필요).
//   node scripts/check.mjs status              단계·화면별 상태 표
//   node scripts/check.mjs next                다음 할 일을 정하고 state.current 에 기록
//   node scripts/check.mjs G1 | G2 | G3        단계 게이트
//   node scripts/check.mjs approval-table      사람 승인용 표
//   node scripts/check.mjs G4 <화면 id>         화면 검증 (스크립트 부분)
//   node scripts/check.mjs record <화면 id> --missing <n>   verifier 판정(누락 수)까지 합쳐 화면 통과 기록
//   node scripts/check.mjs G5                  완료 판정
import { spawnSync } from "node:child_process";
import {
  P, CONFIG, EXTRA_COMPONENTS, ID_RE, ROUTE_RE,
  approvalValid, exists, fileHash, isCodeFile, isTokenScanned, listRoutes, loadState, parsePrd, readJson, readText,
  routeDir, saveState, scanPii, scanTokens, screenFiles, sha256, uiFileName, walk, writeJson, allowedSets,
} from "./lib/harness.mjs";
import { renderAll } from "./gen-tokens.mjs";

const [cmd, ...args] = process.argv.slice(2);
const now = () => new Date().toISOString();

// ---------- 공통 ----------

// 검사 묶음: { name, violations: [{ file, line, rule }] } — violations 가 비어야 통과
function check(name, violations) {
  return { name, ok: violations.length === 0, violations };
}

function v(file, rule, line = 0) {
  return { file, line, rule };
}

function npm(script) {
  const r = spawnSync("npm", ["run", script], { cwd: process.cwd(), shell: true, encoding: "utf8" });
  const tail = `${r.stdout || ""}\n${r.stderr || ""}`.trim().split("\n").slice(-15).join("\n");
  return r.status === 0 ? [] : [v("(npm)", `npm run ${script} 실패 (종료 코드 ${r.status})\n${tail}`)];
}

function printReport(title, checks) {
  console.log(`## ${title}\n`);
  console.log("| 검사 | 결과 | 위반 |");
  console.log("|---|---|---|");
  for (const c of checks) {
    const where = c.violations
      .slice(0, 5)
      .map((x) => `${x.file}${x.line ? `:${x.line}` : ""} ${x.rule.split("\n")[0]}`)
      .join("<br>");
    const more = c.violations.length > 5 ? `<br>외 ${c.violations.length - 5}건` : "";
    console.log(`| ${c.name} | ${c.ok ? "통과" : "실패"} | ${where}${more} |`);
  }
  for (const c of checks) for (const x of c.violations) if (x.rule.includes("\n")) console.log(`\n${x.rule}`);
}

// 실패 횟수를 세고, 상태를 돌려준다.
function tally(state, key, ok) {
  state.failures[key] = ok ? 0 : (state.failures[key] || 0) + 1;
  if (ok) return "passed";
  return state.failures[key] >= CONFIG.maxFailures ? "stopped" : "failed";
}

function finishStage(no, checks, extra = {}) {
  const state = loadState();
  const ok = checks.every((c) => c.ok);
  const status = tally(state, `G${no}`, ok);
  state.stages[no] = { status, at: now(), failed: checks.filter((c) => !c.ok).map((c) => c.name), ...(ok ? extra : {}) };
  saveState(state);
  printReport(`G${no} — ${status === "passed" ? "통과" : status === "stopped" ? `실패 ${CONFIG.maxFailures}회 연속 → 멈춤` : "실패"}`, checks);
  process.exit(ok ? 0 : status === "stopped" ? 4 : 1);
}

const loadReq = () => readJson(P.req);
const loadScreens = () => readJson(P.screens);
const eqSet = (a, b) => a.length === b.length && [...a].sort().join() === [...b].sort().join();

// ---------- G1 요구사항 ----------

function g1() {
  const prd = parsePrd();
  if (!exists(P.req)) return finishStage(1, [check("01 파일", [v(P.req, "파일 없음")])]);
  const req = loadReq();
  const checks = [];

  const count = [];
  if (req.screenCount !== prd.count) count.push(v(P.req, `screenCount ${req.screenCount} ≠ PRD ${prd.count}개 화면`));
  if ((req.screens || []).length !== prd.count) count.push(v(P.req, `screens ${req.screens?.length ?? 0}개 ≠ PRD ${prd.count}개`));
  for (const t of prd.titles) {
    const s = (req.screens || []).find((x) => x.no === t.no);
    if (!s) count.push(v(P.req, `화면 ${t.no} 없음`));
    else if (s.title !== t.title) count.push(v(P.req, `화면 ${t.no} 제목이 PRD와 다름`));
  }
  checks.push(check("화면 수·제목 = PRD", count));

  const ids = [];
  const seen = {};
  for (const s of req.screens || []) for (const id of s.requirements || []) (seen[id] ||= []).push(s.no);
  for (const f of prd.fIds) {
    const at = seen[f.id] || [];
    if (at.length !== 1) ids.push(v(P.req, `${f.id} 가 ${at.length}번 있음 (1번이어야 함)`));
    else if (at[0] !== f.screen) ids.push(v(P.req, `${f.id} 는 화면 ${f.screen} 요구사항인데 화면 ${at[0]}에 있음`));
  }
  for (const id of Object.keys(seen)) if (!prd.fIds.some((f) => f.id === id)) ids.push(v(P.req, `${id} 는 PRD에 없는 ID`));
  const fc = req.common || [];
  for (const id of prd.fcIds) {
    const hits = fc.filter((c) => c.id === id);
    if (hits.length !== 1) ids.push(v(P.req, `${id} 가 common 에 ${hits.length}번 있음`));
    else if (!hits[0].screens?.length || hits[0].screens.some((n) => n < 1 || n > prd.count)) ids.push(v(P.req, `${id} 화면 번호가 비었거나 범위 밖`));
  }
  checks.push(check("요구사항 ID 1번씩 배정", ids));

  const rules = [];
  if (!eqSet(req.rules?.N1?.screens || [], prd.n1Screens)) rules.push(v(P.req, `N1 화면 ≠ PRD R6 화면 (${prd.n1Screens.join("·")})`));
  if (!eqSet(req.rules?.N2?.screens || [], prd.n2Screens)) rules.push(v(P.req, `N2 화면 ≠ PRD NFR-2 화면 (${prd.n2Screens.join("·")})`));
  checks.push(check("★ N1·N2 적용 화면", rules));

  checks.push(check("★ 개인정보 없음", scanPii(readText(P.req)).map((x) => v(P.req, x.rule, x.line))));
  finishStage(1, checks);
}

// ---------- G2 화면 목록 ----------

function g2() {
  if (!exists(P.screens)) return finishStage(2, [check("02 파일", [v(P.screens, "파일 없음")])]);
  const req = loadReq();
  const prd = parsePrd();
  const doc = loadScreens();
  const screens = doc.screens || [];
  const ids = new Set(screens.map((s) => s.id));
  const checks = [];

  const count = [];
  if (screens.length !== req.screenCount) count.push(v(P.screens, `화면 ${screens.length}개 ≠ 01 의 ${req.screenCount}개`));
  for (const r of req.screens) {
    const s = screens.find((x) => x.no === r.no);
    if (!s) count.push(v(P.screens, `화면 ${r.no} 없음`));
    else if (s.title !== r.title) count.push(v(P.screens, `화면 ${r.no} 제목이 01 과 다름`));
  }
  checks.push(check("화면 수 = 01", count));

  const routes = [];
  if (ids.size !== screens.length) routes.push(v(P.screens, "id 중복"));
  if (new Set(screens.map((s) => s.route)).size !== screens.length) routes.push(v(P.screens, "라우트 중복"));
  for (const s of screens) {
    if (!ID_RE.test(s.id || "")) routes.push(v(P.screens, `id 규칙 위반: ${s.id}`));
    if (!ROUTE_RE.test(s.route || "")) routes.push(v(P.screens, `라우트 규칙 위반: ${s.route}`));
  }
  checks.push(check("라우트 중복·규칙", routes));

  const flow = [];
  if (!ids.has(doc.first)) flow.push(v(P.screens, `first(${doc.first}) 가 목록에 없음`));
  const inbound = new Set();
  for (const s of screens) {
    for (const e of s.exits || []) {
      if (e.to === "tel") continue;
      if (!ids.has(e.to)) flow.push(v(P.screens, `${s.id} → ${e.to}: 도착 화면 없음`));
      else if (e.to !== s.id) inbound.add(e.to);
    }
  }
  for (const s of screens) if (s.id !== doc.first && !inbound.has(s.id)) flow.push(v(P.screens, `${s.id}: 들어오는 곳 없음`));
  checks.push(check("이동 연결", flow));

  const comps = [];
  const allowed = new Set([...prd.components, ...EXTRA_COMPONENTS]);
  for (const s of screens) {
    for (const c of s.components || []) if (!allowed.has(c.name)) comps.push(v(P.screens, `${s.id}: 허용 안 된 구성 요소 ${c.name}`));
    for (const k of ["default", "loading", "empty", "error"]) if (!s.states?.[k]) comps.push(v(P.screens, `${s.id}: 상태 ${k} 비어 있음`));
  }
  checks.push(check("구성 요소 9종 + 상태 4개", comps));

  const reqs = [];
  for (const r of req.screens) {
    const s = screens.find((x) => x.no === r.no);
    if (!s) continue;
    const want = [...r.requirements, ...req.common.filter((c) => c.screens.includes(r.no)).map((c) => c.id)];
    if (!eqSet(s.requirements || [], want)) reqs.push(v(P.screens, `${s.id}: 요구사항 ID 가 01 과 다름`));
  }
  checks.push(check("요구사항 ID 배정", reqs));

  const n1 = [];
  for (const no of req.rules.N1.screens) {
    const s = screens.find((x) => x.no === no);
    if (s && !(s.components || []).some((c) => c.name === "CostNotice")) n1.push(v(P.screens, `${s.id}: N1 화면인데 CostNotice 없음`));
  }
  checks.push(check("★ N1 화면에 CostNotice", n1));
  checks.push(check("★ 개인정보 없음", scanPii(readText(P.screens)).map((x) => v(P.screens, x.rule, x.line))));
  finishStage(2, checks, { hash: fileHash(P.screens) });
}

function approvalTable() {
  const doc = loadScreens();
  const state = loadState();
  console.log("## 사람 승인 — 최종 화면 목록\n");
  console.log(`G2: ${state.stages[2]?.status ?? "아직 안 돌림"} · 승인: ${approvalValid(state) ? "유효" : "없음 또는 파일이 바뀜"}\n`);
  console.log("| # | 화면 | 라우트 | 구성 요소 | 나가는 곳 | 근거 ID |");
  console.log("|---|---|---|---|---|---|");
  for (const s of doc.screens) {
    const comps = s.components.map((c) => c.name).join(", ");
    const exits = (s.exits || []).map((e) => `${e.action} → ${e.to}`).join("<br>");
    console.log(`| ${s.no} | ${s.title} | \`${s.route}\` | ${comps} | ${exits} | ${s.requirements.join(", ")} |`);
  }
  const notes = doc.screens.flatMap((s) => (s.notes || []).map((n) => `- (${s.id}) ${n}`));
  if (notes.length) console.log(`\n### [불일치] · [확인 필요] · [제안]\n\n${notes.join("\n")}`);
  console.log("\n승인하려면 터미널에서 직접 실행: node scripts/approve.mjs");
}

// ---------- G3 토큰 ----------

function g3() {
  const prd = parsePrd();
  const checks = [];

  const gen = [];
  let rendered = {};
  try {
    rendered = renderAll();
  } catch (e) {
    gen.push(v("scripts/gen-tokens.mjs", `생성 실패: ${e.message}`));
  }
  for (const [rel, text] of Object.entries(rendered)) {
    if (!exists(rel)) gen.push(v(rel, "파일 없음 — node scripts/gen-tokens.mjs 를 실행"));
    else if (readText(rel) !== text) gen.push(v(rel, "생성 결과와 다름 (손으로 고침?)"));
  }
  checks.push(check("생성 파일 = 다시 만든 결과", gen));

  const tk = [];
  if (exists("app/tokens.css")) {
    const css = readText("app/tokens.css");
    const t = JSON.parse(readText(P.tokens));
    for (const group of ["primitive", "semantic", "typography", "spacing", "radius"]) {
      for (const key of Object.keys(t[group])) {
        if (key === "font-family/family-font") continue;
        const name = group === "primitive" ? key.replace(/\//g, "-") : group === "semantic" ? `color-${key.replace(/\//g, "-")}` : key.replace(/^font-size\//, "text-").replace(/\//g, "-");
        if (!css.includes(`--${name}:`)) tk.push(v("app/tokens.css", `토큰 누락: ${key}`));
      }
    }
  }
  checks.push(check("tokens.json 토큰 모두 반영", tk));

  const ui = [];
  for (const name of prd.components) if (!exists(`${P.ui}/${uiFileName(name)}`)) ui.push(v(P.ui, `${uiFileName(name)} 없음 (${name})`));
  checks.push(check(`components/ui ${prd.components.length}종`, ui));

  const n1 = [];
  if (!exists(P.notices)) n1.push(v(P.notices, "파일 없음"));
  else if (!readText(P.notices).includes(JSON.stringify(prd.notice))) n1.push(v(P.notices, "PRD 안내 문구 원문과 글자가 다름"));
  if (!exists(P.costNotice)) n1.push(v(P.costNotice, "파일 없음"));
  else {
    const t = readText(P.costNotice);
    if (!/from\s+["']\.\/notices["']/.test(t)) n1.push(v(P.costNotice, "./notices 에서 문구를 가져오지 않음"));
    if (!/\bbaseDate\b/.test(t)) n1.push(v(P.costNotice, "산정 기준일 baseDate 를 받지 않음"));
  }
  checks.push(check("★ N1 안내 문구 원문·CostNotice", n1));

  const sets = allowedSets();
  const files = walk(P.ui).filter(isTokenScanned);
  checks.push(check("토큰 밖 값 0건", files.flatMap((f) => scanTokens(readText(f), f, sets).map((x) => v(f, x.rule, x.line)))));
  checks.push(check("★ 개인정보 없음", files.flatMap((f) => scanPii(readText(f)).map((x) => v(f, x.rule, x.line)))));
  checks.push(check("build", npm("build")));
  finishStage(3, checks);
}

// ---------- G4 화면 검증 ----------

function noticeDuplicates(prd) {
  const firstSentence = prd.notice.split(/(?<=요\.)\s/)[0];
  const files = [...walk("app"), ...walk("components")].filter((f) => isTokenScanned(f) && f !== P.notices);
  return files.filter((f) => readText(f).includes(firstSentence)).map((f) => v(f, "N1 안내 문구를 notices.ts 밖에 다시 씀"));
}

function dirHash(files) {
  return sha256(files.map((f) => `${f}\n${readText(f)}`).join("\n"));
}

function g4(id) {
  const doc = loadScreens();
  const req = loadReq();
  const prd = parsePrd();
  const screen = doc.screens.find((s) => s.id === id);
  if (!screen) {
    console.error(`화면 id 없음: ${id}`);
    process.exit(2);
  }
  const files = screenFiles(screen, doc.screens).filter(isCodeFile);
  const sets = allowedSets();
  const checks = [];

  checks.push(check("① 토큰 밖 값 0건", files.flatMap((f) => scanTokens(readText(f), f, sets).map((x) => v(f, x.rule, x.line)))));

  const n1 = [...noticeDuplicates(prd)];
  if (req.rules.N1.screens.includes(screen.no)) {
    const uses = files.reduce((n, f) => n + [...readText(f).matchAll(/<CostNotice\b[^>]*\bbaseDate\s*=/g)].length, 0);
    if (uses < 1) n1.push(v(routeDir(screen.route), "N1 화면인데 <CostNotice baseDate=...> 가 없음"));
  }
  checks.push(check("② ★ N1 안내 문구·기준일", n1));
  checks.push(check("③ ★ N2 개인정보 마스킹", files.flatMap((f) => scanPii(readText(f)).map((x) => v(f, x.rule, x.line)))));

  const rt = [];
  const want = new Set(doc.screens.map((s) => s.route));
  const have = listRoutes();
  for (const r of have) if (!want.has(r)) rt.push(v("app", `02 목록에 없는 라우트: ${r}`));
  if (!have.has(screen.route)) rt.push(v(routeDir(screen.route), "이 화면의 page 파일 없음"));
  checks.push(check("④ 라우트 = 02 목록", rt));

  const page = files.find((f) => /\/page\.(tsx|ts|jsx|js)$/.test(f) && f.split("/").length === routeDir(screen.route).split("/").length + 1);
  const basis = page && /\[근거\]/.test(readText(page)) ? [] : [v(page || routeDir(screen.route), "[근거] 주석 없음")];
  checks.push(check("⑤ [근거] 주석", basis));
  checks.push(check("⑥ build", npm("build")));
  checks.push(check("⑦ lint", npm("lint")));

  const ok = checks.every((c) => c.ok);
  const state = loadState();
  const key = `G4:${id}`;
  const prev = state.screens[id] || {};
  let status = prev.status || "pending";
  if (ok) status = "verifying";
  else status = tally(state, key, false);
  state.screens[id] = { ...prev, status, script: ok ? "passed" : "failed", at: now(), hash: ok ? dirHash(files) : null };
  saveState(state);
  writeJson(`${P.verifyDir}/${id}.json`, { screen: id, route: screen.route, at: now(), passed: ok, checks });
  printReport(`G4 ${id} — 스크립트 ${ok ? "통과 (verifier 판정 남음)" : status === "stopped" ? "실패 → 멈춤" : "실패"}`, checks);
  process.exit(ok ? 0 : status === "stopped" ? 4 : 1);
}

function record(id) {
  const i = args.indexOf("--missing");
  const missing = i >= 0 ? Number(args[i + 1]) : NaN;
  if (!Number.isInteger(missing) || missing < 0) {
    console.error("사용법: node scripts/check.mjs record <화면 id> --missing <누락 수>");
    process.exit(2);
  }
  const doc = loadScreens();
  const screen = doc.screens.find((s) => s.id === id);
  const state = loadState();
  const s = state.screens[id];
  if (!screen || !s || s.script !== "passed") {
    console.error(`${id}: G4 스크립트를 먼저 통과해야 합니다`);
    process.exit(1);
  }
  if (s.hash !== dirHash(screenFiles(screen, doc.screens).filter(isCodeFile))) {
    console.error(`${id}: G4 를 돌린 뒤 화면 파일이 바뀌었습니다. G4 를 다시 돌리세요`);
    process.exit(1);
  }
  const ok = missing === 0;
  const status = tally(state, `G4:${id}`, ok);
  state.screens[id] = { ...s, status, missing, at: now() };
  saveState(state);
  console.log(`${id}: ${ok ? "통과" : `요구사항 누락 ${missing}건 → ${status === "stopped" ? "멈춤" : "실패"}`}`);
  process.exit(ok ? 0 : status === "stopped" ? 4 : 1);
}

// ---------- G5 완료 ----------

function g5() {
  const doc = loadScreens();
  const state = loadState();
  const checks = [];
  checks.push(
    check(
      "모든 화면 G4 통과",
      doc.screens.filter((s) => state.screens[s.id]?.status !== "passed").map((s) => v(routeDir(s.route), `${s.id}: ${state.screens[s.id]?.status ?? "pending"}`)),
    ),
  );
  const have = [...listRoutes()];
  const want = doc.screens.map((s) => s.route);
  const rt = [];
  if (have.length !== want.length) rt.push(v("app", `라우트 ${have.length}개 ≠ 화면 ${want.length}개`));
  for (const r of want) if (!have.includes(r)) rt.push(v("app", `빠진 라우트: ${r}`));
  for (const r of have) if (!want.includes(r)) rt.push(v("app", `남는 라우트: ${r}`));
  checks.push(check("화면 수 = 라우트 수", rt));
  checks.push(check("사람 승인 유효", approvalValid(state) ? [] : [v(P.screens, "승인 없음 또는 승인 뒤 바뀜")]));
  finishStage(5, checks);
}

// ---------- status / next ----------

function status() {
  const state = loadState();
  console.log("| 대상 | 상태 | 연속 실패 |");
  console.log("|---|---|---|");
  for (const no of [1, 2, 3]) console.log(`| ${no}단계 (G${no}) | ${state.stages[no]?.status ?? "pending"} | ${state.failures[`G${no}`] || 0} |`);
  console.log(`| 사람 승인 | ${approvalValid(state) ? "유효" : "없음"} | — |`);
  if (exists(P.screens)) {
    for (const s of loadScreens().screens) {
      console.log(`| 화면 ${s.no} ${s.id} (G4) | ${state.screens[s.id]?.status ?? "pending"} | ${state.failures[`G4:${s.id}`] || 0} |`);
    }
  }
  console.log(`| 완료 (G5) | ${state.stages[5]?.status ?? "pending"} | ${state.failures.G5 || 0} |`);
  if (state.current) console.log(`\n지금: ${JSON.stringify(state.current)}`);
}

function next() {
  const state = loadState();
  const stopped = [
    ...Object.entries(state.stages).filter(([, s]) => s.status === "stopped").map(([n]) => `G${n}`),
    ...Object.entries(state.screens).filter(([, s]) => s.status === "stopped").map(([id]) => id),
  ];
  const done = (no) => state.stages[no]?.status === "passed";
  let cur;
  if (stopped.length) {
    console.log(`멈춤: ${stopped.join(", ")} — ${CONFIG.maxFailures}회 연속 실패. 사람이 확인한 뒤 터미널에서 node scripts/approve.mjs reset <대상>`);
    process.exit(4);
  } else if (!done(1)) cur = { stage: 1, agent: "req-reader", gate: "G1" };
  else if (!done(2)) cur = { stage: 2, agent: "screen-planner", gate: "G2" };
  else if (!approvalValid(state)) {
    state.current = { stage: "approval" };
    saveState(state);
    console.log("사람 승인 대기: node scripts/check.mjs approval-table 을 보여 주고, 사용자가 터미널에서 node scripts/approve.mjs 를 실행");
    process.exit(3);
  } else if (!done(3)) cur = { stage: 3, agent: "token-builder", gate: "G3" };
  else {
    const s = loadScreens().screens.find((x) => state.screens[x.id]?.status !== "passed");
    if (s) {
      const verifying = state.screens[s.id]?.status === "verifying";
      cur = verifying
        ? { stage: 5, screen: s.id, route: s.route, agent: "verifier", gate: `G4 ${s.id}` }
        : { stage: 4, screen: s.id, route: s.route, agent: "screen-builder", then: "verifier", gate: `G4 ${s.id}` };
    } else if (!done(5)) cur = { stage: "G5", gate: "G5" };
  }
  state.current = cur || null;
  saveState(state);
  console.log(cur ? JSON.stringify(cur) : "완료: 모든 게이트 통과");
}

// ---------- 실행 ----------

const commands = {
  status,
  next,
  G1: g1,
  G2: g2,
  G3: g3,
  G5: g5,
  "approval-table": approvalTable,
  G4: () => g4(args[0]),
  record: () => record(args[0]),
};

if (!commands[cmd]) {
  console.error("사용법: node scripts/check.mjs <status|next|G1|G2|G3|approval-table|G4 <id>|record <id> --missing <n>|G5>");
  process.exit(2);
}
commands[cmd]();
