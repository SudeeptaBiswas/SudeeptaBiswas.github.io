// Drives headless Edge over CDP to test the popup viewer. Usage: node popup_test.mjs <outdir>
import { writeFileSync } from "node:fs";
const OUT = process.argv[2];
const BASE = process.argv[3] || "http://127.0.0.1:8765/blog/";
const DISK = BASE.startsWith("file:");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let target;
for (let i = 0; i < 20; i++) {
  try { target = await (await fetch("http://127.0.0.1:9333/json/new?about:blank", { method: "PUT" })).json(); break; }
  catch { await sleep(500); }
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pending = new Map();
ws.addEventListener("message", (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const js = async (expr) => (await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true })).result.result.value;
const shot = async (name) => { const r = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(`${OUT}/${name}.png`, Buffer.from(r.result.data, "base64")); };
const size = (w, h) => send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: false });
const go = async (url) => { await send("Page.navigate", { url }); await sleep(1200); };
const key = (k) => send("Input.dispatchKeyEvent", { type: "keyDown", key: k, code: k, windowsVirtualKeyCode: k === "Escape" ? 27 : 0 });
let pass = 0, fail = 0;
const check = (label, ok, got) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${label}${ok ? "" : "  got: " + JSON.stringify(got)}`); };

await send("Page.enable"); await send("Runtime.enable"); await send("Emulation.setFocusEmulationEnabled", { enabled: true });
const state = `({open: !!document.querySelector("dialog.popup[open]"), title: (document.getElementById("popup-title")||{}).textContent || (document.querySelector("dialog.popup")||{getAttribute(){return null}}).getAttribute("aria-label"), frame: !!document.querySelector(".popup-frame"), url: location.pathname, focus: document.activeElement && (document.activeElement.className || document.activeElement.textContent.trim()), locked: document.documentElement.classList.contains("popup-open"), pageLink: (document.querySelector(".popup-page-link")||{}).href, back: [...document.querySelectorAll(".popup-article a")].map(a=>a.href)})`;

// 1. Wide screen, link in the Tokens section
await size(1400, 900); await go(BASE + "ai-engineering-llm-fundamentals.html");
await js(`document.querySelector('#tokens ~ ul a[data-popup]').scrollIntoView({block:"center"}); document.querySelector('#tokens ~ ul a[data-popup]').click()`);
await sleep(800);
let s = await js(state);
check("text link opens popup", s.open, s);
check("popup shows BPE", DISK ? (s.frame && /BPE/.test(s.title)) : s.title === "Byte Pair Encoding (BPE)", s);
check(DISK ? "file://: shown in a frame" : "http: content copied, no frame", DISK ? s.frame : !s.frame, s.frame);
check("page did not change", s.url.endsWith("ai-engineering-llm-fundamentals.html"), s.url);
check("background scroll locked", s.locked, s.locked);
check("focus on close button", s.focus === "popup-close", s.focus);
check("'Open as a page' points to topics/bpe.html", /\/blog\/topics\/bpe\.html$/.test(s.pageLink || ""), s.pageLink);
await sleep(600); await shot((DISK ? "disk-" : "http-") + "1-wide-open");
await key("Escape"); await sleep(300);
s = await js(state);
check("Escape closes", !s.open, s);
check("focus back on the link", s.focus === "See how BPE works", s.focus);
check("scroll unlocked", !s.locked, s.locked);

// 2. Left panel sub-item
await js(`document.querySelector('.toc a[data-popup]').click()`); await sleep(800);
s = await js(state);
check("panel sub-item opens popup", s.open && /BPE/.test(s.title), s);
await js(`document.querySelector('.popup-close').click()`); await sleep(300);
s = await js(state);
check("× closes", !s.open, s);
// Backdrop click
await js(`document.querySelector('.toc a[data-popup]').click()`); await sleep(800);
const box = await js(`(()=>{const r=document.querySelector("dialog.popup").getBoundingClientRect();return {x:r.left, y:r.top}})()`);
await send("Input.dispatchMouseEvent", { type: "mousePressed", x: 10, y: 10, button: "left", clickCount: 1 });
await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: 10, y: 10, button: "left", clickCount: 1 });
await sleep(300);
s = await js(state);
check("click outside closes", !s.open, { s, box });

// 3. Dark mode
await js(`document.documentElement.setAttribute("data-theme","dark"); document.querySelector('.toc a[data-popup]').click()`); await sleep(800);
await sleep(600); await shot((DISK ? "disk-" : "http-") + "2-wide-dark");
await js(`document.querySelector('.popup-close').click(); document.documentElement.setAttribute("data-theme","light")`);

// 4. Narrow screen: menu mode
await size(500, 900); await go(BASE + "ai-engineering-llm-fundamentals.html");
await js(`document.querySelector('.toc summary').click()`); await sleep(300);
await js(`document.querySelector('.toc a[data-popup]').click()`); await sleep(800);
s = await js(state);
const menuOpen = await js(`document.querySelector('.toc details').open`);
check("menu sub-item opens popup (500px)", s.open && /BPE/.test(s.title), s);
check("menu closed behind popup", !menuOpen, menuOpen);
await sleep(600); await shot((DISK ? "disk-" : "http-") + "3-narrow-open");
await key("Escape"); await sleep(300);

// 5. Standalone page
await size(1400, 900); await go(BASE + "topics/bpe.html");
const solo = await js(`({h1: document.querySelector("h1").textContent, back: document.querySelector(".page-solo > p a").href, css: getComputedStyle(document.querySelector(".page-solo")).maxWidth})`);
check("standalone page renders", solo.h1 === "Byte Pair Encoding (BPE)" && solo.css === "760px", solo);
const backOk = DISK ? 200 : (await fetch(solo.back.split("#")[0])).status;
check("standalone back link works", backOk === 200, backOk);
await shot((DISK ? "disk-" : "http-") + "4-standalone");

// 6. Ctrl+click is left to the browser (no popup)
await go(BASE + "ai-engineering-llm-fundamentals.html");
await js(`document.querySelector('.toc a[data-popup]').dispatchEvent(new MouseEvent("click", {bubbles:true, cancelable:true, ctrlKey:true, button:0}))`);
await sleep(500);
s = await js(state);
check("ctrl+click does not open popup", !s.open, s);

console.log(`\n${pass} passed, ${fail} failed`);
await send("Page.close").catch(() => {});
process.exit(fail ? 1 : 0);
