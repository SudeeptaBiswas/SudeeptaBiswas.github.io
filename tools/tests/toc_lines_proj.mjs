// Lists left-panel links that take more than one line, at 1400px (panel pinned). node toc_lines.mjs page1 page2 ...
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 20; i++) { try { await fetch("http://127.0.0.1:9333/json/version"); break; } catch { await sleep(500); } }
const t = await (await fetch("http://127.0.0.1:9333/json/new?about:blank", { method: "PUT" })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pend = new Map();
ws.addEventListener("message", (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Network.enable"); await send("Network.setCacheDisabled", { cacheDisabled: true }); await send("Page.enable"); await send("Emulation.setDeviceMetricsOverride", { width: 1400, height: 900, deviceScaleFactor: 1, mobile: false });
let total = 0;
for (const p of process.argv.slice(2)) {
  await send("Page.navigate", { url: "http://127.0.0.1:8765/" + p }); await sleep(900);
  const r = (await send("Runtime.evaluate", { returnByValue: true, expression: `(() => {
    document.querySelectorAll(".toc details details, .toc-body details").forEach(d => d.open = true); const links = [...document.querySelectorAll(".toc .toc-body a:not(.toc-back)")].filter(a => a.offsetParent);
    const width = links[0] ? links[0].getBoundingClientRect().width : 0;
    return { width: Math.round(width), wrapped: links.filter(a => a.getClientRects().length > 1 || a.getBoundingClientRect().height > parseFloat(getComputedStyle(a).lineHeight) * 1.5).map(a => a.textContent.trim()) };
  })()` })).result.result.value;
  total += r.wrapped.length;
  console.log(`${p} (link width ${r.width}px): ${r.wrapped.length ? r.wrapped.join(" | ") : "all 1 line"}`);
}
console.log(`total wrapped: ${total}`);
await send("Page.close"); process.exit(0);
