// 3단계: Docs/tokens.json → app/tokens.css · globals.css · layout.tsx · page.tsx 를 만든다.
// 이 네 파일은 이 스크립트만 쓴다. G3는 renderAll() 결과와 실제 파일이 같은지 비교한다.
//   node scripts/gen-tokens.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";
import { P, CONFIG, loadTokens, parsePrd, readJson, writeText } from "./lib/harness.mjs";

const HEADER = "자동 생성 파일 — node scripts/gen-tokens.mjs 로만 만든다. 손으로 고치지 않는다. 원본: Docs/tokens.json";

function tokensCss() {
  const tk = loadTokens();
  const lines = [`/* ${HEADER} */`, "", ":root {"];
  for (const p of tk.primitives) lines.push(`  --${p.name}: ${p.hex};`);
  lines.push("}", "", "@theme {", "  --*: initial;", "");
  lines.push(`  --font-sans: "${tk.fontFamily}", sans-serif;`, "");
  for (const c of tk.colors) lines.push(`  --color-${c.name}: ${c.primitive ? `var(--${c.primitive})` : c.hex};`);
  lines.push("");
  for (const f of tk.fontSizes) {
    lines.push(`  --text-${f.name}: ${f.px}px;`);
    const lh = tk.lineHeights[f.px];
    if (lh) lines.push(`  --text-${f.name}--line-height: ${lh}px;`);
  }
  if (tk.weights.length) {
    lines.push("");
    for (const w of tk.weights) lines.push(`  --font-weight-${w.name}: ${w.value};`);
  }
  lines.push("");
  for (const s of tk.spacing) lines.push(`  --spacing-${s.name}: ${s.px}px;`);
  lines.push("");
  for (const r of tk.radius) lines.push(`  --radius-${r.name}: ${r.px}px;`);
  lines.push("}", "");
  return lines.join("\n");
}

function globalsCss() {
  const names = new Set(loadTokens().colors.map((c) => c.name));
  const body = [];
  if (names.has("bg-default")) body.push("  background: var(--color-bg-default);");
  if (names.has("text-primary")) body.push("  color: var(--color-text-primary);");
  body.push("  font-family: var(--font-sans);");
  return [`/* ${HEADER} */`, '@import "tailwindcss";', '@import "./tokens.css";', "", "body {", ...body, "}", ""].join("\n");
}

function layoutTsx() {
  const title = parsePrd().title;
  return `// ${HEADER}
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: ${JSON.stringify(title)},
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
`;
}

function pageTsx() {
  const { first, screens } = readJson(P.screens);
  const route = screens.find((s) => s.id === first).route;
  return `// ${HEADER}
import { redirect } from "next/navigation";

export default function Home() {
  redirect(${JSON.stringify(route)});
}
`;
}

export function renderAll() {
  return {
    "app/tokens.css": tokensCss(),
    "app/globals.css": globalsCss(),
    "app/layout.tsx": layoutTsx(),
    "app/page.tsx": pageTsx(),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = renderAll();
  for (const [rel, text] of Object.entries(files)) {
    writeText(rel, text);
    console.log(`생성: ${rel}`);
  }
  if (!CONFIG.typographyFromDesign) {
    console.log("경고: tokens.json 에 줄높이·굵기가 없어 font-*·leading-* 클래스를 쓸 수 없습니다. (scripts/lib/harness.mjs CONFIG.typographyFromDesign)");
  }
}
