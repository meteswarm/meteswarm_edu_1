// 하네스 공통 모듈: 경로, 상태 파일, PRD 읽기, 토큰 허용 목록, 검사 규칙.
// scripts/check.mjs · gen-tokens.mjs · approve.mjs 와 .claude/hooks/guard.mjs 가 같이 쓴다.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

export const CONFIG = {
  // tokens.json에는 줄높이·굵기가 없다. true면 design.md 2장 값을 보조 토큰으로 쓴다. (사람이 정함)
  typographyFromDesign: false,
  // 같은 대상이 이 횟수만큼 연속 실패하면 멈춘다.
  maxFailures: 3,
};

export const P = {
  prd: "Docs/PRD.md",
  design: "Docs/design.md",
  tokens: "Docs/tokens.json",
  req: "harness/01-requirements.json",
  screens: "harness/02-screens.json",
  state: "harness/state.json",
  verifyDir: "harness/05-verify",
  ui: "components/ui",
  notices: "components/ui/notices.ts",
  costNotice: "components/ui/CostNotice.tsx",
  generated: ["app/tokens.css", "app/globals.css", "app/layout.tsx", "app/page.tsx"],
};

// ---------- 파일 ----------

export const abs = (rel) => path.join(ROOT, rel);
export const exists = (rel) => existsSync(abs(rel));
export const readText = (rel) => readFileSync(abs(rel), "utf8").replace(/\r\n/g, "\n");

export function readJson(rel, fallback) {
  if (!exists(rel)) {
    if (fallback !== undefined) return fallback;
    throw new Error(`${rel} 파일이 없습니다`);
  }
  return JSON.parse(readText(rel));
}

export function writeText(rel, text) {
  mkdirSync(path.dirname(abs(rel)), { recursive: true });
  writeFileSync(abs(rel), text);
}

export const writeJson = (rel, data) => writeText(rel, JSON.stringify(data, null, 2) + "\n");
export const sha256 = (text) => createHash("sha256").update(text).digest("hex");
export const fileHash = (rel) => (exists(rel) ? sha256(readText(rel)) : null);

// 폴더 안 파일 목록 (상대 경로, 슬래시). skipDirs 에 든 폴더는 건너뛴다.
export function walk(relDir, skipDirs = []) {
  const out = [];
  if (!exists(relDir)) return out;
  for (const ent of readdirSync(abs(relDir), { withFileTypes: true })) {
    const rel = `${relDir}/${ent.name}`;
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || skipDirs.includes(rel)) continue;
      out.push(...walk(rel, skipDirs));
    } else {
      out.push(rel);
    }
  }
  return out;
}

// ---------- 상태 ----------

export function loadState() {
  return readJson(P.state, { version: 1, current: null, stages: {}, screens: {}, failures: {}, approval: null });
}

export const saveState = (state) => writeJson(P.state, state);

// 사람이 승인한 02 파일 해시가 지금 파일과 같아야 승인이 살아 있다.
export function approvalValid(state = loadState()) {
  return Boolean(state.approval) && state.approval.hash === fileHash(P.screens);
}

// ---------- PRD ----------

export function parsePrd(text = readText(P.prd)) {
  const count = Number((text.match(/(\d+)개 화면/) || [])[1] || 0);
  const titles = [...text.matchAll(/^### 화면 (\d+)\. (.+?)\s+—/gm)].map((m) => ({ no: Number(m[1]), title: m[2].trim() }));
  const rows = [...text.matchAll(/^\|\s*(F\d+-\d+|FC-\d+)\s*\|(.*)$/gm)].map((m) => ({ id: m[1], row: m[2] }));
  const fRows = rows.filter((r) => /^F\d/.test(r.id));
  const screenOf = (id) => Number(id.match(/^F(\d+)-/)[1]);
  const screensCiting = (re) => [...new Set(fRows.filter((r) => re.test(r.row)).map((r) => screenOf(r.id)))].sort();
  const compLine = text.match(/화면 구성 요소는[^\n]*\n\(([^)]+)\)/);
  const notice = text.match(/금액 차이 안내 문구 \(기준안\)\s*\n>\s*(.+)/);
  const title = text.match(/^# PRD — (.+?)(?:\s*\(|$)/m);
  return {
    title: title ? title[1].trim() : "",
    count,
    titles,
    fIds: fRows.map((r) => ({ id: r.id, screen: screenOf(r.id) })),
    fcIds: rows.filter((r) => r.id.startsWith("FC")).map((r) => r.id),
    n1Screens: screensCiting(/\bR6\b/),
    n2Screens: screensCiting(/NFR-2/),
    components: compLine ? compLine[1].split(",").map((s) => s.trim()) : [],
    notice: notice ? notice[1].trim() : "",
  };
}

// "Card/Plan" → "CardPlan.tsx", "icon/doneMark" → "DoneMark.tsx"
export function uiFileName(componentName) {
  const base = componentName.replace(/^icon\//, "").replace(/\//g, "");
  return base[0].toUpperCase() + base.slice(1) + ".tsx";
}

// 화면 목록에 PRD 컴포넌트 말고 쓸 수 있는 이름
export const EXTRA_COMPONENTS = ["CostNotice", "text"];

// ---------- 라우트 ----------

export const routeDir = (route) => (route === "/" ? "app" : `app${route}`);
export const ROUTE_RE = /^\/[a-z-]+(\/([a-z-]+|\[[a-z]+\]))*$/;
export const ID_RE = /^[a-z][a-z-]*$/;

// app/ 아래 page 파일로 라우트를 센다. "_폴더"는 라우트가 아니고 "(그룹)"은 주소에서 빠진다.
export function listRoutes() {
  const routes = new Set();
  for (const f of walk("app")) {
    if (!/\/page\.(tsx|ts|jsx|js)$/.test(f)) continue;
    const segs = f.split("/").slice(1, -1);
    if (segs.some((s) => s.startsWith("_"))) continue;
    const route = "/" + segs.filter((s) => !/^\(.*\)$/.test(s)).join("/");
    routes.add(route);
  }
  routes.delete("/");
  return routes;
}

// 화면 폴더의 파일. 그 안에 든 다른 화면 폴더는 뺀다. (예: /apply 안의 /apply/complete)
export function screenFiles(screen, allScreens) {
  const dir = routeDir(screen.route);
  const others = allScreens.filter((s) => s.id !== screen.id).map((s) => routeDir(s.route));
  return walk(dir, others);
}

// ---------- 토큰 ----------

const after = (key) => key.slice(key.indexOf("/") + 1);
const cssName = (key) => key.replace(/\//g, "-");

function designTypography() {
  const text = readText(P.design);
  const weights = [...text.matchAll(/^\s*-\s*(Thin|Light|Regular|Medium|SemiBold|Bold|ExtraBold|Black):\s*(\d+)\s*$/gm)].map((m) => ({
    name: m[1].toLowerCase(),
    value: Number(m[2]),
  }));
  const lineHeights = {};
  for (const m of text.matchAll(/^\|\s*[a-z][\w/-]*\s*\|\s*(\d+)\s*\/\s*(\d+)\s*\|/gm)) lineHeights[m[1]] = Number(m[2]);
  return { weights, lineHeights };
}

export function loadTokens() {
  const t = JSON.parse(readText(P.tokens));
  const byNumber = (a, b) => (Number(a.px) || 1e9) - (Number(b.px) || 1e9);
  return {
    primitives: Object.entries(t.primitive).map(([k, v]) => ({ name: cssName(k), hex: v.hex })),
    colors: Object.entries(t.semantic).map(([k, v]) => ({
      name: cssName(k),
      hex: v.hex,
      primitive: v.primitive ? cssName(v.primitive) : null,
    })),
    fontFamily: t.typography["font-family/family-font"],
    fontSizes: Object.entries(t.typography)
      .filter(([k]) => k.startsWith("font-size/"))
      .map(([k, v]) => ({ name: after(k), px: v })),
    spacing: Object.entries(t.spacing).map(([k, v]) => ({ name: after(k), px: v })).sort(byNumber),
    radius: Object.entries(t.radius).map(([k, v]) => ({ name: after(k), px: v })).sort(byNumber),
    ...(CONFIG.typographyFromDesign ? designTypography() : { weights: [], lineHeights: {} }),
  };
}

export function allowedSets(tk = loadTokens()) {
  return {
    color: new Set(tk.colors.map((c) => c.name)),
    fontSize: new Set(tk.fontSizes.map((f) => f.name)),
    spacing: new Set(tk.spacing.map((s) => s.name)),
    radius: new Set(tk.radius.map((r) => r.name)),
    weight: new Set(tk.weights.map((w) => w.name)),
  };
}

// ---------- 검사: 토큰 밖 값 ----------

const lineOf = (text, index) => text.slice(0, index).split("\n").length;

const COLOR_UTIL = /^(bg|ring|outline|fill|stroke|divide|placeholder|accent|caret|decoration|from|via|to|shadow)-(?<v>.+)$/;
const BORDER_UTIL = /^border(-[xytrblse])?-(?<v>.+)$/;
const SPACING_UTIL =
  /^(p[xytrblse]?|m[xytrblse]?|gap(-[xy])?|space-[xy]|w|h|size|min-w|min-h|max-w|max-h|inset(-[xy])?|top|right|bottom|left|start|end|translate-[xy]|scroll-[mp][xytrblse]?|indent|basis)-(?<v>.+)$/;
const ROUNDED_UTIL = /^rounded(-(t|r|b|l|s|e|tl|tr|br|bl|ss|se|es|ee))?(-(?<v>.+))?$/;
const SIZE_WORDS = new Set(["auto", "full", "screen", "svh", "lvh", "dvh", "svw", "lvw", "dvw", "min", "max", "fit"]);
const TEXT_WORDS = new Set(["left", "center", "right", "justify", "start", "end", "wrap", "nowrap", "balance", "pretty", "ellipsis", "clip"]);
const COLOR_WORDS = new Set(["transparent", "current", "inherit", "none"]);
const BG_WORDS = new Set(["cover", "contain", "center", "top", "bottom", "left", "right", "fixed", "local", "scroll", "no-repeat", "repeat"]);
const BORDER_WORDS = new Set(["x", "y", "t", "r", "b", "l", "s", "e", "solid", "dashed", "dotted", "double", "none", "hidden", "collapse", "separate", "0"]);
const FRACTION = /^\d+\/\d+$/;

// 클래스 하나를 검사한다. 문제가 없으면 null, 있으면 이유.
function checkClass(raw, sets) {
  if (raw.startsWith("[")) return "임의 속성 [..] 금지";
  let cls = raw.split(":").pop().replace(/^!/, "").replace(/^-/, "");
  if (!cls) return null;
  if (/^(leading|tracking)-/.test(cls)) return "줄높이·자간 클래스는 토큰이 없음";
  let m;
  if (cls.startsWith("text-")) {
    const v = cls.slice(5);
    if (sets.fontSize.has(v) || sets.color.has(v) || TEXT_WORDS.has(v)) return null;
    return "text- 값이 토큰(글자 크기·색)에 없음";
  }
  if (cls.startsWith("font-")) {
    const v = cls.slice(5);
    if (v === "sans" || sets.weight.has(v)) return null;
    return "font- 값이 토큰에 없음";
  }
  if ((m = cls.match(ROUNDED_UTIL))) {
    const v = m.groups.v;
    if (v === undefined) return "rounded 는 토큰 이름을 붙여 쓴다 (예: rounded-16)";
    return sets.radius.has(v) || v === "none" ? null : "모서리 값이 토큰에 없음";
  }
  if ((m = cls.match(BORDER_UTIL))) {
    const v = m.groups.v;
    return sets.color.has(v) || BORDER_WORDS.has(v) || COLOR_WORDS.has(v) ? null : "border 값이 토큰에 없음 (두께는 border 하나만)";
  }
  if ((m = cls.match(SPACING_UTIL))) {
    const v = m.groups.v;
    return sets.spacing.has(v) || SIZE_WORDS.has(v) || FRACTION.test(v) ? null : "간격·크기 값이 토큰에 없음";
  }
  if ((m = cls.match(COLOR_UTIL))) {
    const v = m.groups.v;
    if (sets.color.has(v) || COLOR_WORDS.has(v)) return null;
    if (cls.startsWith("bg-") && BG_WORDS.has(v)) return null;
    return "색 값이 토큰에 없음";
  }
  return null;
}

// 파일 내용에서 토큰 밖 값을 찾는다. [{ line, rule }]
export function scanTokens(text, file, sets = allowedSets()) {
  const out = [];
  const add = (index, rule) => out.push({ line: lineOf(text, index), rule });
  const ext = path.extname(file).toLowerCase();

  for (const m of text.matchAll(/(?<![&\w])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g)) {
    if (/href=["']$/.test(text.slice(Math.max(0, m.index - 6), m.index))) continue;
    add(m.index, "16진수 색 금지");
  }
  for (const m of text.matchAll(/\b(rgba?|hsla?|oklch|oklab|lab|lch|color-mix)\(/g)) add(m.index, "색 함수 금지");
  for (const m of text.matchAll(/(?<![\w$])!?-?[a-z][a-z0-9-]*-\[[^\]\n]*\]/g)) add(m.index, "Tailwind 임의값 [..] 금지");
  for (const m of text.matchAll(/-\(--[\w-]+\)/g)) add(m.index, "Tailwind 변수값 (--..) 금지");

  if (ext === ".css") {
    for (const m of text.matchAll(/\d(px|rem|em|vh|vw)\b/g)) add(m.index, "CSS 숫자 단위 금지 (토큰 변수를 쓴다)");
    return out;
  }
  for (const m of text.matchAll(/\bstyle\s*=\s*\{/g)) add(m.index, "인라인 style 금지");

  const lines = text.split("\n");
  let offset = 0;
  for (const line of lines) {
    if (!/^\s*(import|export\s+\*|export\s+\{[^}]*\}\s+from)\b/.test(line)) {
      for (const m of line.matchAll(/(["'`])((?:\\.|(?!\1)[^\\])*)\1/g)) {
        for (const raw of m[2].split(/\s+/)) {
          const reason = raw && /^[!\-[a-z]/.test(raw) ? checkClass(raw, sets) : null;
          if (reason) out.push({ line: lineOf(text, offset + m.index), rule: `${reason}: ${raw}` });
        }
      }
    }
    offset += line.length + 1;
  }
  return out;
}

// ---------- 검사: 고객 개인정보 (N2) ----------
// 메시지에 찾은 값은 넣지 않는다.

const PHONE_RE = /(?<!\d)01[016789][-.\s]?\d{3,4}[-.\s]?\d{4}(?!\d)/g;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
const PERSON_KEY_RE = /\b(customerName|userName|applicantName|holderName|ownerName|personName|subscriberName|이름|신청자|고객명)\s*:\s*(["'`])((?:(?!\2).)*)\2/g;

export function scanPii(text) {
  const out = [];
  for (const m of text.matchAll(PHONE_RE)) out.push({ line: lineOf(text, m.index), rule: "가리지 않은 전화번호 (값 생략)" });
  for (const m of text.matchAll(EMAIL_RE)) out.push({ line: lineOf(text, m.index), rule: "이메일 주소 (값 생략)" });
  for (const m of text.matchAll(PERSON_KEY_RE)) {
    if (!m[3].includes("*")) out.push({ line: lineOf(text, m.index), rule: `${m[1]} 값에 * 마스킹 없음 (값 생략)` });
  }
  return out;
}

// 토큰·개인정보 검사를 받는 파일
export const isCodeFile = (rel) => /\.(tsx|ts|jsx|js|mjs|css)$/.test(rel);
export const isTokenScanned = (rel) =>
  /^(app|components)\//.test(rel) && isCodeFile(rel) && !P.generated.includes(rel);
