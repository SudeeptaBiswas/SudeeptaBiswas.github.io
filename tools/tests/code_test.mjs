// Tests code-block buttons over CDP. Usage: node code_test.mjs <outdir> <baseUrl>
import { writeFileSync, existsSync, readFileSync, mkdirSync, rmSync } from "node:fs";
const OUT = process.argv[2];
const BASE = process.argv[3];
const DISK = BASE.startsWith("file:");
const TAG = DISK ? "disk" : "http";
const DL = `${OUT}/dl-${TAG}`;
rmSync(DL, { recursive: true, force: true }); mkdirSync(DL, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browserWs = (await (await fetch("http://127.0.0.1:9333/json/version")).json()).webSocketDebuggerUrl;
const target = await (await fetch("http://127.0.0.1:9333/json/new?about:blank", { method: "PUT" })).json();
function connect(url) {
  const ws = new WebSocket(url); let id = 0; const pending = new Map();
  ws.addEventListener("message", (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
  const ready = new Promise((r) => ws.addEventListener("open", r));
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  return { ready, send };
}
const B = connect(browserWs); await B.ready;
const P = connect(target.webSocketDebuggerUrl); await P.ready;
const send = P.send;
const js = async (expr) => { const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true }); return r.result.result ? r.result.result.value : r; };
const shot = async (name) => { const r = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(`${OUT}/${TAG}-${name}.png`, Buffer.from(r.result.data, "base64")); };
const go = async (url) => { await send("Page.navigate", { url }); await sleep(1200); };
let pass = 0, fail = 0;
const check = (label, ok, got) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${label}${ok ? "" : "  got: " + JSON.stringify(got)}`); };

await send("Page.enable"); await send("Runtime.enable"); await send("Emulation.setFocusEmulationEnabled", { enabled: true });
await send("Emulation.setDeviceMetricsOverride", { width: 1400, height: 900, deviceScaleFactor: 1, mobile: false });
await B.send("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: DL.replace(/\//g, "\\") });
const origin = DISK ? undefined : new URL(BASE).origin;
await B.send("Browser.grantPermissions", { permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"], ...(origin ? { origin } : {}) }).catch(() => {});

// 1. Every code block in every post gets the buttons
const posts = { "ai-engineering-llm-fundamentals.html": 12, "python-for-java-developers.html": 7, "jenkins-docker-cicd.html": 1, "kafka-for-java-developers.html": 4, "rabbitmq-for-java-developers.html": 1 };
for (const [p, n] of Object.entries(posts)) {
  await go(BASE + p);
  const c = await js(`({wraps: document.querySelectorAll(".code-wrap").length, copy: document.querySelectorAll('.code-btn[aria-label="Copy code"]').length, dl: document.querySelectorAll('.code-btn[aria-label="Download code"]').length, run: document.querySelectorAll('.code-btn[aria-label^="Run"]').length})`);
  check(`${p}: ${n} blocks, copy + download on each, no run`, c.wraps === n && c.copy === n && c.dl === n && c.run === 0, c);
}

// 2. Copy + download on the AI post, first block
await go(BASE + "ai-engineering-llm-fundamentals.html");
await js(`document.querySelector(".code-wrap").scrollIntoView({block:"center"})`); await sleep(200);
await shot("1-block");
const copied = await js(`(async()=>{ const pre=document.querySelector(".code-wrap pre"); document.querySelector('.code-btn[aria-label="Copy code"]').click(); await new Promise(r=>setTimeout(r,300)); let clip; try { clip = await navigator.clipboard.readText(); } catch(e) { clip = "READ-FAILED " + e.message; } return {clip, want: pre.textContent.replace(/\\n$/,"")+"\\n", label: document.querySelector(".code-bar .code-btn").getAttribute("aria-label")}; })()`);
if (String(copied.clip).startsWith("READ-FAILED")) check("copy: button changes to Copied (clipboard not readable here)", copied.label === "Copied", copied);
else check("copy puts the exact code on the clipboard (line endings aside)", copied.clip.replace(/\r\n/g, "\n") === copied.want, copied);
await js(`document.querySelector('.code-btn[aria-label="Download code"]').click()`); await sleep(1500);
check("download saves code.txt", existsSync(`${DL}/code.txt`), DL);

// 3. BPE in the popup: run link + download name
await js(`document.querySelector('.toc a[data-popup]').click()`); await sleep(1200);
if (!DISK) {
  const pop = await js(`({run: !!document.querySelector('.popup-article .code-btn[aria-label^="Run"]'), wraps: document.querySelectorAll(".popup-article .code-wrap").length})`);
  check("popup (http): 3 blocks with buttons", pop.wraps === 3, pop);
  check("popup (http): Run button present", pop.run, pop);
  await js(`document.querySelector('.popup-article pre[data-file] ~ .code-bar .code-btn[aria-label="Download code"]').click()`); await sleep(1500);
  check("popup (http): download saves bpe.py", existsSync(`${DL}/bpe.py`), DL);
}
await shot("2-popup");
await js(`document.querySelector('.popup-close').click()`);

// 4. Standalone BPE page (this is also what the frame shows from disk)
await go(BASE + "topics/bpe.html");
await sleep(800);
const solo = await js(`({wraps: document.querySelectorAll(".code-wrap").length, run: document.querySelectorAll('.code-btn[aria-label^="Run"]').length})`);
check("BPE page: 3 blocks, 1 Run button", solo.wraps === 3 && solo.run === 1, solo);
rmSync(`${DL}/bpe.py`, { force: true });   // the popup step saved one already: start clean
await js(`document.querySelector('pre[data-file] ~ .code-bar .code-btn[aria-label="Download code"]').click()`); await sleep(1500);
check("BPE page: download saves bpe.py", existsSync(`${DL}/bpe.py`), DL);
if (existsSync(`${DL}/bpe.py`)) writeFileSync(`${OUT}/bpe-downloaded-${TAG}.py`, readFileSync(`${DL}/bpe.py`));
await js(`document.documentElement.setAttribute("data-theme","dark"); document.querySelector("pre[data-run]").scrollIntoView({block:"center"})`); await sleep(200);
await shot("3-bpe-dark");

console.log(`\n${pass} passed, ${fail} failed`);
await send("Page.close").catch(() => {});
process.exit(fail ? 1 : 0);
