// node topics_test.mjs <blogBaseUrl> — popup pages: open from the panel, run every Run block,
// check the output equals the "Output:" block shown under it on the page.
import { writeFileSync } from "node:fs";
const BASE = process.argv[2], OUT = process.argv[3];
const DISK = BASE.startsWith("file:");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let pass = 0, fail = 0;
const check = (label, ok, got) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${label}${ok ? "" : "  got: " + JSON.stringify(got).slice(0, 400)}`); };
const t = await (await fetch("http://127.0.0.1:9333/json/new?about:blank", { method: "PUT" })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pend = new Map();
ws.addEventListener("message", (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const js = async (e) => { const r = await send("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true, userGesture: true }); return r.result.result ? r.result.result.value : r.result; };
await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable"); await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Emulation.setDeviceMetricsOverride", { width: 1400, height: 900, deviceScaleFactor: 1, mobile: false });

const POSTS = {
  "ai-engineering-llm-fundamentals.html": { softmax: "Softmax and temperature", quantization: "Quantization", cosine: "Cosine similarity",
    bpe: "Byte Pair Encoding (BPE)", streaming: "Reading a streamed reply (NDJSON)" },
  "python-for-java-developers.html": { "python-traps": "Python traps for Java developers", exceptions: "Exceptions: try, except, else, finally",
    dataclasses: "Dataclasses vs Java records" },
};
const pages = Object.assign({}, ...Object.values(POSTS));

// 1. Panel: sub-items open the right popup; every panel link is one line; in-text links exist
for (const [post, own] of Object.entries(POSTS)) {
  await send("Page.navigate", { url: BASE + post }); await sleep(1500);
  const wrapped = await js(`[...document.querySelectorAll(".toc .toc-body ol a")].filter(a => a.getBoundingClientRect().height > parseFloat(getComputedStyle(a).lineHeight) * 1.5).map(a => a.textContent)`);
  check(`${post} panel: every title on one line (incl. sub-items)`, wrapped.length === 0, wrapped);
  for (const [slug, title] of Object.entries(own)) {
    await js(`document.querySelector('.toc a[href="topics/${slug}.html"]').click()`); await sleep(1200);
    const s = await js(`({open: !!document.querySelector("dialog.popup[open]"), title: (document.getElementById("popup-title")||{}).textContent || document.querySelector("dialog.popup").getAttribute("aria-label")})`);
    check(`panel '${slug}' opens its popup`, s.open && (DISK ? true : s.title === title), s);
    if (slug === "cosine" && OUT) { await sleep(500); const r = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(`${OUT}/topic-${DISK ? "disk" : "http"}-cosine.png`, Buffer.from(r.result.data, "base64")); }
    await js(`document.querySelector(".popup-close").click()`); await sleep(300);
  }
  const inText = await js(`[...document.querySelectorAll('.article a[data-popup]')].map(a => a.getAttribute("href"))`);
  check(`${post}: in-text links to all ${Object.keys(own).length} pages`, Object.keys(own).every(s => inText.includes(`topics/${s}.html`)), inText);
}

// 1b. A link inside a popup opens the other popup (http: same dialog; disk: inside the frame)
await send("Page.navigate", { url: BASE + "python-for-java-developers.html" }); await sleep(1500);
await js(`document.querySelector('.toc a[href="topics/python-traps.html"]').click()`); await sleep(1200);
if (!DISK) {
  await js(`document.querySelector('dialog.popup[open] a[data-popup][href$="dataclasses.html"]').click()`); await sleep(1200);
  const s2 = await js(`({open: !!document.querySelector("dialog.popup[open]"), title: (document.getElementById("popup-title")||{}).textContent, url: location.href})`);
  check("link inside a popup opens the other popup, page stays", s2.open && s2.title === "Dataclasses vs Java records" && s2.url.endsWith("python-for-java-developers.html"), s2);
} else {
  const s2 = await js(`(async()=>{const f=document.querySelector("dialog.popup[open] iframe"); f.contentDocument.querySelector('a[href$="dataclasses.html"]').click();
    await new Promise(r=>setTimeout(r,1200)); return {open: !!document.querySelector("dialog.popup[open]"), frame: f.contentWindow.location.href, url: location.href}})()`);
  check("link inside a popup (disk) opens the page in the frame, post stays", s2.open && s2.frame.includes("dataclasses.html") && s2.url.endsWith("python-for-java-developers.html"), s2);
}

// 2. Each page on its own: Run every block, compare with the Output block under it
for (const slug of Object.keys(pages)) {
  await send("Page.navigate", { url: BASE + `topics/${slug}.html` }); await sleep(1500);
  const n = await js(`document.querySelectorAll('.code-btn[aria-label^="Run"]').length`);
  for (let i = 0; i < n; i++) {
    await js(`document.querySelectorAll('.code-btn[aria-label^="Run"]')[${i}].click()`);
    let res = null;
    for (let k = 0; k < 200 && !res; k++) {
      await sleep(300);
      res = await js(`(()=>{ const w=[...document.querySelectorAll(".code-wrap")].filter(w=>w.querySelector('.code-btn[aria-label^="Run"]'))[${i}];
        const o=w.querySelector(".code-output"); if(!o||o.hidden||o.classList.contains("busy")) return null;
        let next=w.nextElementSibling; while(next && !next.classList.contains("code-wrap")) next=next.nextElementSibling;
        const shown = next ? next.querySelector("pre").textContent.trim() : "";
        return {got:o.textContent.trim(), shown, cls:o.className, file: w.querySelector("pre").getAttribute("data-file")}; })()`);
    }
    check(`${slug}: Run block ${i + 1} (${res && res.file}) output = shown output`, res && res.cls.includes("done") && res.got === res.shown, res);
  }
}
console.log(`\n${pass} passed, ${fail} failed`);
await send("Page.close"); process.exit(fail ? 1 : 0);
