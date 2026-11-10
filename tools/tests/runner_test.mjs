// node runner_test.mjs <blogBaseUrl>   — tests the runner plugins (CDP on 9333).
const BASE = process.argv[2];
const DISK = BASE.startsWith("file:");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let pass = 0, fail = 0;
const check = (label, ok, got) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${label}${ok ? "" : "  got: " + JSON.stringify(got).slice(0, 300)}`); };

async function page(configOverride) {
  const t = await (await fetch("http://127.0.0.1:9333/json/new?about:blank", { method: "PUT" })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener("open", r));
  let id = 0; const pend = new Map(); const urls = [];
  ws.addEventListener("message", (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); }
    if (d.method === "Network.requestWillBeSent") urls.push(d.params.request.url); });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
  if (configOverride) await send("Page.addScriptToEvaluateOnNewDocument", { source: `window.SITE_CONFIG = ${JSON.stringify(configOverride)};` });
  const js = async (e) => { const r = await send("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true, userGesture: true }); return r.result.result ? r.result.result.value : r.result; };
  const go = async (u) => { urls.length = 0; await send("Page.navigate", { url: u }); await sleep(1500); };
  const waitFor = async (e, ms = 90000) => { for (let i = 0; i < ms / 300; i++) { const v = await js(e); if (v) return v; await sleep(300); } return null; };
  return { js, go, waitFor, urls, close: () => send("Page.close") };
}

// Add a runnable block to the page and return its index.
const addBlock = (code) => `(()=>{ const a=document.querySelector("article"); const p=document.createElement("pre"); p.setAttribute("data-run","python"); p.innerHTML="<code></code>"; p.firstChild.textContent=${JSON.stringify(code)}; a.appendChild(p); window.enhanceCode(a); return document.querySelectorAll(".code-wrap").length-1; })()`;
const clickRun = (i) => `(()=>{ const w=document.querySelectorAll(".code-wrap")[${i}]; const b=w.querySelector('.code-btn[aria-label^="Run"]'); if(!b) return false; b.click(); return true; })()`;
const output = (i, needle) => `(()=>{ const o=document.querySelectorAll(".code-wrap")[${i}].querySelector(".code-output"); return o && !o.hidden && !o.classList.contains("busy") && o.textContent.includes(${JSON.stringify(needle)}) ? {text:o.textContent, cls:o.className} : null; })()`;

// --- 1. pyodide (config.js default) on the BPE page
let p = await page(null);
await p.go(BASE + "topics/bpe.html");
const runIdx = await p.js(`[...document.querySelectorAll(".code-wrap")].findIndex(w => w.querySelector('.code-btn[aria-label^="Run"]'))`);
check("pyodide: BPE page has exactly one Run button", runIdx === 1 && await p.js(`document.querySelectorAll('.code-btn[aria-label^="Run"]').length`) === 1, runIdx);
let t0 = Date.now(); await p.js(clickRun(runIdx));
let o = await p.waitFor(output(runIdx, "after BPE"));
const first = ((Date.now() - t0) / 1000).toFixed(1);
check(`pyodide: BPE runs, correct output (first run ${first} s)`, o && o.text.includes("merge 2: ('t', 'h')   -> 17 tokens") && o.cls === "code-output done", o);
t0 = Date.now(); await p.js(clickRun(runIdx)); await sleep(100);
o = await p.waitFor(output(runIdx, "after BPE"));
check(`pyodide: second run fast (${Date.now() - t0} ms)`, o && Date.now() - t0 < 3000, o);
check("pyodide: no Python code sent anywhere (no request to pythontutor)", !p.urls.some(u => u.includes("pythontutor")), p.urls.filter(u => !u.includes("jsdelivr")).slice(0, 5));
let i = await p.js(addBlock("x = 1\nprint('before')\nprint(1 / 0)"));
await p.js(clickRun(i)); o = await p.waitFor(output(i, "ZeroDivisionError"));
check("pyodide: error shows traceback, red style, earlier output kept", o && o.cls.includes("error") && o.text.startsWith("before") && o.text.includes('File "<exec>", line 3'), o);
i = await p.js(addBlock("print(x)"));
await p.js(clickRun(i)); o = await p.waitFor(output(i, "NameError"));
check("pyodide: each run starts fresh (x from another block is unknown)", !!o, o);
i = await p.js(addBlock("import numpy as np\nprint('numpy', np.dot([1, 2, 3], [4, 5, 6]))"));
t0 = Date.now(); await p.js(clickRun(i)); o = await p.waitFor(output(i, "numpy 32"));
check(`pyodide: numpy loads by itself (${((Date.now() - t0) / 1000).toFixed(1)} s)`, !!o, o);
await p.close();

// --- 2. pyodide inside the popup (http copies the content in; disk shows a frame, covered by test 1)
if (!DISK) {
  p = await page(null);
  await p.go(BASE + "ai-engineering-llm-fundamentals.html");
  check("post without runnable blocks loads no runner", !p.urls.some(u => u.includes("/runners/") || u.includes("config.js")), p.urls.filter(u => u.includes("assets")));
  await p.js(`document.querySelector('.toc a[data-popup]').click()`); await sleep(1500);
  const r = await p.js(`(()=>{ const b=document.querySelector('.popup-article .code-btn[aria-label^="Run"]'); if(!b) return false; b.click(); return true; })()`);
  o = await p.waitFor(`(()=>{ const x=document.querySelector(".popup-article .code-output"); return x && x.textContent.includes("after BPE") ? x.textContent : null; })()`);
  check("pyodide: Run works inside the popup", r && o && o.includes("merge 4: ('the', ' ') -> 13 tokens"), { r, o });
  await p.close();
}

// --- 3. switch to pythontutor by config
p = await page({ runner: "pythontutor", pythontutor: { py: "311" } });
await p.go(BASE + "topics/bpe.html");
await p.waitFor(`document.querySelector('a.code-btn[aria-label^="Run"]')`, 10000);
const href = await p.js(`(()=>{ const a=document.querySelector('a.code-btn[aria-label^="Run"]'); a.addEventListener("click", e=>e.preventDefault()); a.click(); return a.href; })()`);
const code = decodeURIComponent(((href || "").split("#code=")[1] || "").split("&")[0]);
check("config 'pythontutor': Run links to Python Tutor 3.11 with the code", (href || "").includes("py=311") && code.includes("def count_pairs"), href && href.slice(0, 90));
check("config 'pythontutor': pyodide not loaded", !p.urls.some(u => u.includes("pyodide")), p.urls.filter(u => u.includes("runners")));
await p.close();

// --- 4. off
p = await page({ runner: "off" });
await p.go(BASE + "topics/bpe.html"); await sleep(800);
const off = await p.js(`({run: document.querySelectorAll('.code-btn[aria-label^="Run"]').length, copy: document.querySelectorAll('.code-btn[aria-label="Copy code"]').length})`);
check("config 'off': no Run button, Copy still on all 3 blocks", off.run === 0 && off.copy === 3, off);
await p.close();

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
