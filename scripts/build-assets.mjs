// Builds the profile README assets from the manumartinez.dev repo:
//   assets/header.svg           animated hero (fonts embedded, no external requests)
//   assets/projects/<slug>.png  one card per project (screenshot + name + tagline + stack)
//
// Usage: SITE=~/Projects/manumartinez-dev PLAYWRIGHT=<path to @playwright/test/index.js> node scripts/build-assets.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { tmpdir } from "node:os"
import { fileURLToPath, pathToFileURL } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const SITE = process.env.SITE ?? join(process.env.HOME, "Projects/manumartinez-dev")
const PW = process.env.PLAYWRIGHT ?? join(process.env.HOME, "Projects/Portia/portia-vestidos/node_modules/@playwright/test/index.js")

// Latin subsets that next/font already downloaded for the site.
const MEDIA = join(SITE, ".next/static/media")
const pick = (prefix) => join(MEDIA, readdirSync(MEDIA).find((f) => f.startsWith(prefix)))
const FONTS = {
  display: pick("2aa781f449db21e3-s.p."), // Bricolage Grotesque (variable)
  sans: pick("caa3a2e1cccd8315-s.p."), // Geist
  mono: pick("797e433ab948586e-s.p."), // Geist Mono
}
const b64 = (p) => readFileSync(p).toString("base64")
const fontFace = (family, file, weight = "100 900") =>
  `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${b64(file)}) format('woff2');font-weight:${weight};}`

const C = {
  bg: "#0c0913",
  glow: "#3b1d66",
  grid: "rgba(255,255,255,0.045)",
  ink: "#efeaf7",
  muted: "#a59fb3",
  mint: "#6fd3ad",
  line: "rgba(255,255,255,0.10)",
}

// ---------------------------------------------------------------- header.svg
function header() {
  const W = 1600
  const H = 490
  const grid = []
  for (let x = 0; x <= W; x += 64) grid.push(`<path d="M${x} 0V${H}"/>`)
  for (let y = 0; y <= H; y += 64) grid.push(`<path d="M0 ${y}H${W}"/>`)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Emmanuel Martinez — I build AI-native products with founders who move fast.">
<title>Emmanuel Martinez — I build AI-native products with founders who move fast.</title>
<style>
${fontFace("Bricolage", FONTS.display)}
${fontFace("Geist", FONTS.sans)}
${fontFace("GeistMono", FONTS.mono)}
.display{font-family:'Bricolage','Helvetica Neue',Arial,sans-serif;font-weight:700;fill:${C.ink};letter-spacing:-0.045em}
.sans{font-family:'Geist','Helvetica Neue',Arial,sans-serif;fill:${C.muted}}
.mono{font-family:'GeistMono',ui-monospace,Menlo,monospace;letter-spacing:0.12em}
.up{opacity:0;animation:up .9s cubic-bezier(.2,.8,.2,1) forwards}
.d1{animation-delay:.1s}.d2{animation-delay:.35s}.d3{animation-delay:.6s}.d4{animation-delay:.85s}
@keyframes up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.glow{animation:breathe 7s ease-in-out infinite;transform-origin:800px 0}
@keyframes breathe{0%,100%{opacity:.85;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
.dot{animation:pulse 2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}
.scan{animation:scan 6s linear infinite}
@keyframes scan{from{transform:translateX(-400px)}to{transform:translateX(${W + 400}px)}}
@media (prefers-reduced-motion:reduce){.up,.glow,.dot,.scan{animation:none;opacity:1}}
</style>
<defs>
  <radialGradient id="g" cx="50%" cy="0%" r="60%" gradientUnits="objectBoundingBox">
    <stop offset="0" stop-color="${C.glow}" stop-opacity=".95"/>
    <stop offset=".55" stop-color="${C.glow}" stop-opacity=".25"/>
    <stop offset="1" stop-color="${C.glow}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
    <stop offset=".6" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <mask id="m"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
  <linearGradient id="beam" x1="0" x2="1">
    <stop offset="0" stop-color="${C.mint}" stop-opacity="0"/>
    <stop offset=".5" stop-color="${C.mint}" stop-opacity=".9"/>
    <stop offset="1" stop-color="${C.mint}" stop-opacity="0"/>
  </linearGradient>
  <clipPath id="r"><rect width="${W}" height="${H}" rx="28"/></clipPath>
</defs>
<g clip-path="url(#r)">
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  <rect class="glow" width="${W}" height="${H}" fill="url(#g)"/>
  <g stroke="${C.grid}" stroke-width="1" mask="url(#m)">${grid.join("")}</g>
  <rect class="scan" y="${H - 2}" width="400" height="2" fill="url(#beam)"/>

  <g class="up d1" text-anchor="middle">
    <circle class="dot" cx="${W / 2 - 250}" cy="112" r="5" fill="${C.mint}"/>
    <text class="mono" x="${W / 2 + 8}" y="118" font-size="18" fill="${C.mint}">CEO &amp; CO-FOUNDER @ COLLYBRIX · MADRID</text>
  </g>
  <text class="display up d2" x="${W / 2}" y="250" font-size="128" text-anchor="middle">Emmanuel Martinez</text>
  <text class="sans up d3" x="${W / 2}" y="330" font-size="38" text-anchor="middle" fill="${C.ink}">I build AI-native products with founders who move fast.</text>
  <text class="sans up d4" x="${W / 2}" y="388" font-size="24" text-anchor="middle">15+ years shipping software — from frontend to VP of Engineering —</text>
  <text class="sans up d4" x="${W / 2}" y="422" font-size="24" text-anchor="middle">now a temporary technical co-founder for startups going from idea to 100K users.</text>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="28" fill="none" stroke="${C.line}"/>
</svg>
`
}

// ------------------------------------------------------------- project cards
function readProject(slug) {
  const md = readFileSync(join(SITE, "content/projects", slug, "en.md"), "utf8")
  const fm = md.split("---")[1]
  const get = (k) => fm.match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, "m"))?.[1]
  const stack = [...fm.split(/^stack:/m)[1].matchAll(/^\s+-\s+(.*)$/gm)].map((m) => m[1]).slice(0, 5)
  return { slug, name: get("name"), tag: get("tag"), status: get("status"), cover: get("cover"), stack }
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;")

function cardHtml(p) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Bricolage;src:url(${pathToFileURL(FONTS.display)});font-weight:100 900}
@font-face{font-family:Geist;src:url(${pathToFileURL(FONTS.sans)});font-weight:100 900}
@font-face{font-family:GeistMono;src:url(${pathToFileURL(FONTS.mono)});font-weight:100 900}
*{box-sizing:border-box;margin:0}
html,body{background:transparent}
.card{width:640px;height:520px;border-radius:22px;overflow:hidden;background:#141020;border:1px solid ${C.line};display:flex;flex-direction:column;position:relative}
.card::before{content:"";position:absolute;inset:0;background:radial-gradient(120% 60% at 50% 0%,rgba(59,29,102,.55),transparent 70%);pointer-events:none}
.shot{margin:18px 18px 0;height:300px;border-radius:14px;overflow:hidden;border:1px solid ${C.line};position:relative;z-index:1}
.shot img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.body{padding:20px 26px 0;position:relative;z-index:1;flex:1;display:flex;flex-direction:column}
.status{font:500 12px/1 GeistMono;letter-spacing:.12em;text-transform:uppercase;color:${C.mint};display:flex;align-items:center;gap:8px}
.status i{width:7px;height:7px;border-radius:50%;background:${C.mint};display:block}
h2{font:700 34px/1.05 Bricolage;letter-spacing:-.04em;color:${C.ink};margin-top:10px}
p{font:400 16px/1.4 Geist;color:${C.muted};margin-top:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.stack{display:flex;gap:6px;flex-wrap:nowrap;overflow:hidden;margin-top:auto;padding-bottom:22px}
.stack span{font:500 11.5px/1 GeistMono;color:#cfc8dc;border:1px solid ${C.line};background:rgba(255,255,255,.04);padding:7px 10px;border-radius:999px;white-space:nowrap}
</style></head><body>
<div class="card">
  <div class="shot"><img src="${pathToFileURL(join(SITE, "public", p.cover))}"></div>
  <div class="body">
    <div class="status"><i></i>${esc(p.status)}</div>
    <h2>${esc(p.name)}</h2>
    <p>${esc(p.tag)}</p>
    <div class="stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
  </div>
</div></body></html>`
}

const SLUGS = ["milano", "job-radar", "parrot", "fintio", "estado-rutas", "portia", "sentinel", "gtm-os"]

writeFileSync(join(ROOT, "assets/header.svg"), header())
console.log("assets/header.svg")

const { default: pw } = await import(pathToFileURL(PW).href)
const browser = await pw.chromium.launch()
const page = await browser.newPage({ viewport: { width: 640, height: 520 }, deviceScaleFactor: 2 })
const projects = SLUGS.map(readProject)
for (const p of projects) {
  const tmp = join(tmpdir(), `card-${p.slug}.html`)
  writeFileSync(tmp, cardHtml(p))
  await page.goto(pathToFileURL(tmp).href, { waitUntil: "load" })
  await page.evaluate(() => document.fonts.ready)
  // Drop stack chips that would be cut off at the card edge.
  await page.evaluate(() => {
    const row = document.querySelector(".stack")
    const max = row.getBoundingClientRect().right
    for (const s of [...row.children]) if (s.getBoundingClientRect().right > max) s.remove()
  })
  await page.locator(".card").screenshot({ path: join(ROOT, "assets/projects", `${p.slug}.png`), omitBackground: true })
  console.log(`assets/projects/${p.slug}.png`)
}
await browser.close()
writeFileSync(join(ROOT, "scripts/projects.json"), JSON.stringify(projects, null, 2))
