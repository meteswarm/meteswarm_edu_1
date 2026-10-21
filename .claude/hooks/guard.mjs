// PreToolUse 훅: 파일 쓰기·셸 명령을 실행 직전에 검사한다. 막을 때는 이유를 stderr 에 쓰고 종료 코드 2.
//   H1 토큰 밖 값 · H2 고객 개인정보 · H3 보호 경로 · H4 승인 전 구현 · H5 에이전트 편집 범위 · 셸 명령 제한
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { P, approvalValid, isTokenScanned, loadState, readJson, routeDir, scanPii, scanTokens } from "../../scripts/lib/harness.mjs";

const HARNESS_AGENTS = ["req-reader", "screen-planner", "token-builder", "screen-builder", "verifier"];

function block(reason) {
  process.stderr.write(`[하네스 훅] 막음: ${reason}\n`);
  process.exit(2);
}

// ---------- 파일 쓰기 ----------

function newText(tool, input) {
  if (tool === "Write") return input.content || "";
  if (tool === "Edit") return input.new_string || "";
  if (tool === "MultiEdit") return (input.edits || []).map((e) => e.new_string || "").join("\n");
  if (tool === "NotebookEdit") return input.new_source || "";
  return "";
}

// 지금 화면의 폴더. 그 안에 든 다른 화면 폴더는 범위 밖이다.
function screenBuilderAllows(rel) {
  const state = loadState();
  const cur = state.current;
  if (!cur || cur.stage !== 4 || !cur.screen || !existsSync(path.join(root, P.screens))) return false;
  const screens = readJson(P.screens).screens;
  const me = screens.find((s) => s.id === cur.screen);
  if (!me) return false;
  const dir = routeDir(me.route).toLowerCase() + "/";
  if (!rel.startsWith(dir)) return false;
  return !screens.some((s) => {
    const other = routeDir(s.route).toLowerCase() + "/";
    return s.id !== me.id && other.startsWith(dir) && rel.startsWith(other);
  });
}

const SCOPE = {
  "req-reader": (rel) => rel === P.req,
  "screen-planner": (rel) => rel === P.screens,
  "token-builder": (rel) => rel.startsWith(`${P.ui}/`),
  "screen-builder": screenBuilderAllows,
  verifier: () => false,
};

function checkWrite(tool, input, agent) {
  const file = input.file_path || input.notebook_path;
  if (!file) return;
  const rel0 = path.relative(root, path.resolve(root, file)).replace(/\\/g, "/");
  if (rel0.startsWith("..") || path.isAbsolute(rel0)) return; // 프로젝트 밖(scratchpad 등)은 검사하지 않는다
  const rel = rel0.toLowerCase();

  // H3 보호 경로 (모두에게)
  const screenSpecOutput = /^docs\/\d\d-\d\d-\d\d screen-spec\.md$/.test(rel) && !existsSync(path.join(root, rel0));
  if (rel.startsWith("docs/") && !(agent === "screen-spec" && tool === "Write" && screenSpecOutput)) block(`H3 Docs/ 는 읽기 전용 (${rel0})`);
  if (rel.startsWith("reference/")) block(`H3 Reference/ 는 읽기 전용 (${rel0})`);
  if (P.generated.includes(rel)) block(`H3 ${rel0} 는 node scripts/gen-tokens.mjs 만 만든다`);
  if (rel === P.state) block("H3 harness/state.json 은 check.mjs·approve.mjs 만 쓴다");
  if (rel === ".claude/agents/screen-spec.md" || rel.startsWith(".claude/skills/planner-comments/")) block(`H3 기존 에이전트·스킬은 고치지 않는다 (${rel0})`);

  // 하네스 자체(스크립트·훅·설정·규칙)는 에이전트가 고치지 못한다
  if (agent && /^(scripts\/|\.claude\/|claude\.md$|agents\.md$|package\.json$|package-lock\.json$|next\.config\.ts$|eslint\.config\.mjs$|tsconfig\.json$)/.test(rel)) {
    block(`H3 에이전트는 하네스 파일을 고칠 수 없다 (${rel0})`);
  }

  // H5 편집 범위: 앱 코드와 하네스 산출물은 하네스 에이전트만, 자기 범위 안에서만 쓴다
  const owned = /^(app|components|harness)\//.test(rel);
  if (owned) {
    if (!agent) block(`H5 오케스트레이터(메인 대화)는 직접 구현하지 않는다. 에이전트를 부른다 (${rel0})`);
    if (!HARNESS_AGENTS.includes(agent)) block(`H5 하네스 에이전트가 아닌 ${agent} 는 ${rel0} 를 쓸 수 없다`);
  }
  if (HARNESS_AGENTS.includes(agent) && !SCOPE[agent](rel)) block(`H5 ${agent} 의 편집 범위 밖 (${rel0})`);

  // H4 사람 승인 전에는 구현하지 않는다
  if (/^(app|components)\//.test(rel) && !approvalValid()) block("H4 사람 승인 전 (또는 승인 뒤 02-screens.json 이 바뀜). 터미널에서 node scripts/approve.mjs");

  const text = newText(tool, input);

  // H1 토큰 밖 값
  if (isTokenScanned(rel)) {
    const found = scanTokens(text, rel);
    if (found.length) block(`H1 토큰 밖 값 ${found.length}건 — ${found.slice(0, 5).map((x) => x.rule).join(" / ")}`);
  }

  // H2 고객 개인정보
  const pii = scanPii(text);
  if (pii.length) block(`H2 고객 개인정보 ${pii.length}건 — ${[...new Set(pii.map((x) => x.rule))].join(" / ")}`);
}

// ---------- 셸 명령 ----------

const AGENT_COMMANDS = {
  "req-reader": [],
  "screen-planner": [],
  "token-builder": [/^node scripts[\\/]gen-tokens\.mjs\s*$/],
  "screen-builder": [/^npm run (build|lint)\s*$/, /^git (diff --no-index|status)\b/, /^(cp|Copy-Item)\s.*scratchpad/i],
  verifier: [/^node scripts[\\/]check\.mjs G4 [a-z-]+\s*$/],
};

const PROTECTED_DIR = /(^|[\s"'=/\\])(docs|reference|app|components|harness)[\\/]/i;
const WRITE_OP = /(^|[\s;|&(])(tee|cp|mv|rm|rmdir|touch|mkdir|sed\s+-i|Out-File|Set-Content|Add-Content|New-Item|Remove-Item|Move-Item|Copy-Item|Rename-Item|Clear-Content)\b/i;

function checkCommand(command, agent) {
  const cmd = command.trim();
  if (/\bnode\b[^\n;|&]*approve\.mjs/.test(cmd)) block("approve.mjs 는 사람이 터미널에서 직접 실행한다");
  if (/--no-verify\b/.test(cmd)) block("--no-verify 금지");

  if (HARNESS_AGENTS.includes(agent)) {
    if (!AGENT_COMMANDS[agent].some((re) => re.test(cmd))) block(`${agent} 가 실행할 수 없는 명령`);
    return;
  }
  const redirects = cmd.replace(/\d?>\s*(&\d|\/dev\/null|\$null|nul)\b/gi, "");
  if (PROTECTED_DIR.test(cmd) && (/>/.test(redirects) || WRITE_OP.test(cmd))) {
    block("셸로 Docs/·Reference/·app/·components/·harness/ 에 쓰지 않는다");
  }
}

// ---------- 실행 ----------

let root = process.env.CLAUDE_PROJECT_DIR || process.cwd();

try {
  const input = JSON.parse(readFileSync(0, "utf8"));
  root = process.env.CLAUDE_PROJECT_DIR || input.cwd || root;
  const agent = input.agent_type || null;
  const tool = input.tool_name;
  const ti = input.tool_input || {};
  if (["Write", "Edit", "MultiEdit", "NotebookEdit"].includes(tool)) checkWrite(tool, ti, agent);
  else if (tool === "Bash" || tool === "PowerShell") checkCommand(ti.command || "", agent);
} catch (e) {
  // 훅 자체 오류로 모든 작업이 막히지 않게 통과시키고 경고만 남긴다.
  process.stderr.write(`[하네스 훅] 검사 오류(통과시킴): ${e.message}\n`);
}
process.exit(0);
