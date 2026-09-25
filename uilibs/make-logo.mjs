// Temporary script: renders the ADISA Wordmark to PNG via headless Edge.
// Replicates src/components/site/Wordmark.tsx (size "xl") at 4x scale,
// embedding the same next/font woff2 files the site uses.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const CHUNKS = path.join(ROOT, ".next", "dev", "static", "chunks");
const MEDIA = path.join(ROOT, ".next", "dev", "static", "media");
const TMP = path.join(ROOT, ".logo-tmp");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// 1. Collect every compiled next/font css chunk and inline its woff2 as data URLs.
const cssFiles = fs
  .readdirSync(CHUNKS)
  .filter((f) => f.includes("font_google") && f.endsWith(".single.css"));
if (cssFiles.length === 0) throw new Error("No compiled font CSS found in .next/dev/static/chunks");

const fontCache = new Map();
let fontCss = "";
for (const f of cssFiles) {
  let css = fs.readFileSync(path.join(CHUNKS, f), "utf8");
  css = css.replace(/url\("\.\.\/media\/([^"]+)"\)/g, (_, name) => {
    if (!fontCache.has(name)) {
      const buf = fs.readFileSync(path.join(MEDIA, name));
      fontCache.set(name, `data:font/woff2;base64,${buf.toString("base64")}`);
    }
    return `url("${fontCache.get(name)}")`;
  });
  fontCss += css + "\n";
}
const families = [...new Set([...fontCss.matchAll(/font-family:\s*([^;]+);/g)].map((m) => m[1].trim()))];
console.log("Embedded font families:", families.join(" | "), `(${fontCache.size} woff2 files)`);

// 2. Wordmark replica at 4x (xl: mark 1.6rem, word 3.4rem -> x4).
function page(wordColor, markColor) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontCss}
:root {
  --font-head: "Space Grotesk", "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-geist-mono: "Geist Mono", ui-monospace, monospace;
}
html, body { margin: 0; padding: 0; background: transparent; }
.wrap { width: 1920px; height: 800px; display: flex; align-items: center; justify-content: center; }
.wordmark { display: inline-flex; flex-direction: column; align-items: flex-start; line-height: 0; }
.marks {
  font-family: var(--font-geist-mono);
  font-size: 6.4rem; letter-spacing: 0.3em; margin-left: 0.45em;
  color: ${markColor}; font-weight: 700; line-height: 1;
}
.word {
  font-family: var(--font-head); font-weight: 800;
  font-size: 13.6rem; letter-spacing: 0.32em; line-height: 0.95;
  color: ${wordColor}; margin-top: 0;
}
</style></head><body><div class="wrap"><span class="wordmark">
<span class="marks">&#x300; &nbsp;&#x301;&nbsp; &nbsp;&#x300;</span>
<span class="word">ADISA</span>
</span></div></body></html>`;
}

fs.mkdirSync(TMP, { recursive: true });
fs.writeFileSync(path.join(TMP, "logo.html"), page("#0c0c0c", "#c2410c")); // light-mode: ink + clay
fs.writeFileSync(path.join(TMP, "logo-light.html"), page("#f7f3ec", "#b8893c")); // dark-mode: bone + gold

// 3. Headless Edge screenshots (transparent background).
function shot(html, out) {
  const res = spawnSync(
    EDGE,
    [
      "--headless=new", "--disable-gpu", "--hide-scrollbars",
      "--default-background-color=00000000",
      "--window-size=1920,800",
      "--virtual-time-budget=8000",
      `--screenshot=${out}`,
      `file:///${html.replace(/\\/g, "/")}`,
    ],
    { stdio: "inherit" },
  );
  if (res.status !== 0) throw new Error(`Edge exited with ${res.status} for ${html}`);
  console.log("Wrote", out, fs.statSync(out).size, "bytes");
}

shot(path.join(TMP, "logo.html"), path.join(ROOT, "public", "adisa-logo-raw.png"));
shot(path.join(TMP, "logo-light.html"), path.join(ROOT, "public", "adisa-logo-light-raw.png"));
console.log("DONE");
