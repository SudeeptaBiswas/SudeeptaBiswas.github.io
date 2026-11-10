// node demo_test.mjs <blogBaseUrl> <outDir> — temperature slider: in the popup (http) or the page itself, both themes.
import { writeFileSync } from "node:fs";
const BASE = process.argv[2], OUT = process.argv[3], DISK = BASE.startsWith("file:");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let pass = 0, fail = 0;
const check = (l, ok, got) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${l}${ok ? "" : "  got: " + JSON.stringify(got)}`); };
const t = await (await fetch("http://127.0.0.1:9333/json/new?about:blank", { method: "PUT" })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pend = new Map();
ws.addEventListener("message", (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const js = async (e) => (await send("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true })).result.result.value;
await send("Page.enable"); await send("Network.enable"); await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Emulation.setDeviceMetricsOverride", { width: 1400, height: 900, deviceScaleFactor: 1, mobile: false });
const shot = async (name) => { const r = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(`${OUT}/${name}.png`, Buffer.from(r.result.data, "base64")); };
const read = (sel) => `(()=>{const d=document.querySelector('${sel} [data-demo]'); return {t:d.querySelector('output').textContent, pct:[...d.querySelectorAll('.demo-pct')].map(x=>x.textContent), words:[...d.querySelectorAll('.demo-word')].map(x=>x.textContent)}})()`;
const setT = (sel, v) => js(`(()=>{const i=document.querySelector('${sel} [data-demo] input'); i.value='${v}'; i.dispatchEvent(new Event('input',{bubbles:true})); return i.value})()`);
const expect = { "1": ["62.9%", "23.1%", "14.0%"], "0.2": ["99.3%", "0.7%", "0.1%"], "3": ["43.0%", "30.8%", "26.1%"] };
for (const theme of ["light", "dark"]) {
  let sel;
  if (DISK) { await send("Page.navigate", { url: BASE + "topics/softmax.html#theme=" + theme }); await sleep(1200); sel = "article"; }
  else {
    await send("Page.navigate", { url: BASE + "ai-engineering-llm-fundamentals.html" }); await sleep(1200);
    await js(`document.documentElement.setAttribute("data-theme","${theme}")`);
    await js(`document.querySelector('.toc a[href="topics/softmax.html"]').click()`); await sleep(1200);
    sel = "dialog.popup[open]";
  }
  const s = await js(read(sel));
  check(`${theme}: slider built, T 1.0, cat/mat/rat`, s && s.t === "1.0" && s.words.join() === "cat,mat,rat" && s.pct.join() === expect["1"].join(), s);
  for (const v of ["0.2", "3"]) { await setT(sel, v); const r = await js(read(sel)); check(`${theme}: T ${v} -> ${expect[v].join(" ")}`, r.pct.join() === expect[v].join(), r); }
  await setT(sel, "1");
  await js(`document.querySelector('${sel} [data-demo]').scrollIntoView({block:"center"})`); await sleep(400);
  await shot(`demo-${DISK ? "disk" : "http"}-${theme}`);
}
await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send("Page.navigate", { url: BASE + "topics/softmax.html" }); await sleep(1200);
const over = await js(`document.documentElement.scrollWidth > window.innerWidth`);
check("phone 390px: no sideways scroll", over === false, over);
await js(`document.querySelector('[data-demo]').scrollIntoView({block:"center"})`); await sleep(300); await shot(`demo-${DISK ? "disk" : "http"}-phone`);
console.log(`\n${pass} passed, ${fail} failed`); await send("Page.close"); process.exit(fail ? 1 : 0);
