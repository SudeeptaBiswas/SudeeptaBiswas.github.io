// node demo_test.mjs <blogBaseUrl> <outDir> — sliders from assets/js/demos.js.
// http: opened in the popup from the post's panel (content copied in). Disk: the page itself.
// Expected numbers come from Python (tools/topics/*.py and the same formulas).
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
const wide = () => send("Emulation.setDeviceMetricsOverride", { width: 1400, height: 900, deviceScaleFactor: 1, mobile: false });
await wide();
const shot = async (name) => { const r = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(`${OUT}/${name}.png`, Buffer.from(r.result.data, "base64")); };

let scope = "article";   // where the demos are: the popup (http) or the page (disk)
async function open(slug, theme = "light") {
  if (DISK) { await send("Page.navigate", { url: BASE + `topics/${slug}.html#theme=${theme}` }); await sleep(1200); scope = "article"; return; }
  await send("Page.navigate", { url: BASE + "ai-engineering-llm-fundamentals.html" }); await sleep(1200);
  await js(`document.documentElement.setAttribute("data-theme","${theme}")`);
  await js(`document.querySelector('.toc a[href="topics/${slug}.html"]').click()`); await sleep(1200);
  scope = "dialog.popup[open]";
}
const demo = (name) => `document.querySelector('${scope} [data-demo="${name}"]')`;
const read = (name) => js(`(()=>{const d=${demo(name)}; if(!d) return null; return {
  out:[...d.querySelectorAll('output')].map(x=>x.textContent), words:[...d.querySelectorAll('.demo-word')].map(x=>x.textContent),
  pct:[...d.querySelectorAll('.demo-pct')].map(x=>x.textContent), off:[...d.querySelectorAll('.demo-row.demo-off .demo-word')].map(x=>x.textContent),
  sum:(d.querySelector('.demo-sum')||{}).textContent, math:(d.querySelector('.demo-math')||{}).textContent,
  codes:[...d.querySelectorAll('tbody tr')].map(r=>r.cells[1].textContent.split(' ')[0]),
  copyButtons: d.querySelectorAll('.code-bar').length }})()`);
const set = (name, i, v) => js(`(()=>{const x=${demo(name)}.querySelectorAll('input')[${i}]; x.value='${v}'; x.dispatchEvent(new Event('input',{bubbles:true}))})()`);

// temperature (softmax page)
await open("softmax");
let r = await read("temperature");
check("temperature: built, T 1.0, 62.9 / 23.1 / 14.0", r && r.out[0] === "1.0" && r.words.join() === "cat,mat,rat" && r.pct.join() === "62.9%,23.1%,14.0%", r);
await set("temperature", 0, "0.2"); r = await read("temperature"); check("temperature: T 0.2 -> 99.3 / 0.7 / 0.1", r.pct.join() === "99.3%,0.7%,0.1%", r);
await set("temperature", 0, "3"); r = await read("temperature"); check("temperature: T 3.0 -> 43.0 / 30.8 / 26.1", r.pct.join() === "43.0%,30.8%,26.1%", r);

// top_k / top_p (softmax page)
r = await read("topk");
check("topk: default top_k 2 -> cat 73.1, mat 26.9, rat dropped", r && r.pct.join() === "73.1%,26.9%,dropped" && r.off.join() === "rat", r);
await set("topk", 0, "1"); r = await read("topk"); check("topk: top_k 1 -> only cat 100%", r.pct.join() === "100.0%,dropped,dropped", r);
await set("topk", 0, "3"); r = await read("topk"); check("topk: top_k 3, top_p 1 -> model odds 62.9 / 23.1 / 14.0", r.out[0] === "3 (off)" && r.pct.join() === "62.9%,23.1%,14.0%", r);
await set("topk", 1, "0.8"); r = await read("topk"); check("topk: top_p 0.8 -> cat + mat (as the page text says)", r.pct.join() === "73.1%,26.9%,dropped", r);
await set("topk", 1, "0.5"); r = await read("topk"); check("topk: top_p 0.5 -> only cat", r.pct.join() === "100.0%,dropped,dropped", r);

// bits per weight (quantization page)
await open("quantization");
r = await read("quant");
check("quant: default 4 bits -> 2.0 GB file, 2.6 GB RAM, codes as Python, worst 0.053",
  r && r.out[0] === "4 bits" && r.pct.join() === "2.0 GB,2.6 GB" && r.codes.join() === "15,4,9,0,13,9" && r.sum.endsWith("0.053"), r);
await set("quant", 0, "8"); r = await read("quant"); check("quant: 8 bits -> codes as Python, worst 0.003", r.codes.join() === "255,76,146,0,216,154" && r.sum.endsWith("0.003"), r);
await set("quant", 0, "2"); r = await read("quant"); check("quant: 2 bits -> codes as Python, worst 0.270", r.codes.join() === "3,1,2,0,3,2" && r.sum.endsWith("0.270"), r);
await set("quant", 0, "16"); r = await read("quant"); check("quant: 16 bits -> 8.0 GB file (FP16 row of the table)", r.pct[0] === "8.0 GB", r);

// arrows (cosine page)
await open("cosine");
r = await read("angle");
const cos = (m) => (m.match(/cosine +=.*\n +=\s(-?[\d.]+)/) || [])[1], dot = (m) => (m.match(/dot +=.*\n +=\s(-?[\d.]+)/) || [])[1];
check("angle: default 14°, 0.8 -> dot 0.72, cosine 0.99", r && dot(r.math) === "0.72" && cos(r.math) === "0.99", r);
check("angle: no Copy buttons on the live numbers", r.copyButtons === 0, r);
await set("angle", 1, "1.5"); r = await read("angle"); check("angle: longer B -> dot 1.35, cosine still 0.99", dot(r.math) === "1.35" && cos(r.math) === "0.99", r);
await set("angle", 1, "0.8"); await set("angle", 0, "96"); r = await read("angle"); check("angle: 96° -> cosine 0.01 (right angle)", cos(r.math) === "0.01", r);
await set("angle", 0, "180"); r = await read("angle"); check("angle: 180° -> cosine -0.99", cos(r.math) === "-0.99", r);

// screenshots, both themes; phone width without sideways scroll
for (const theme of ["light", "dark"]) for (const [slug, name] of [["softmax", "topk"], ["quantization", "quant"], ["cosine", "angle"]]) {
  await open(slug, theme);
  await js(`${demo(name)}.scrollIntoView({block:"center"})`); await sleep(400);
  await shot(`demo-${DISK ? "disk" : "http"}-${name}-${theme}`);
}
await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
for (const slug of ["softmax", "quantization", "cosine"]) {
  await send("Page.navigate", { url: BASE + `topics/${slug}.html` }); await sleep(1200);
  const over = await js(`document.documentElement.scrollWidth > window.innerWidth`);
  check(`phone 390px: ${slug} has no sideways scroll`, over === false, over);
  if (slug === "cosine") for (const deg of ["14", "180"]) {
    const box = await js(`(()=>{const d=document.querySelector('[data-demo=angle]'), i=d.querySelector('input'); i.value='${deg}'; i.dispatchEvent(new Event('input'));
      const m=d.querySelector('.demo-math'); return {scroll:m.scrollWidth, client:m.clientWidth}})()`);
    check(`phone 390px: numbers box fits at ${deg}° (no scrolling inside)`, box.scroll <= box.client, box);
  }
  await js(`[...document.querySelectorAll('[data-demo]')].pop().scrollIntoView({block:"center"})`); await sleep(300);
  await shot(`demo-${DISK ? "disk" : "http"}-phone-${slug}`);
}
console.log(`\n${pass} passed, ${fail} failed`); await send("Page.close"); process.exit(fail ? 1 : 0);
