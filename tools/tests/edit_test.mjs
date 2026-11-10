// node edit_test.mjs <blogBaseUrl> <outDir> — editable runnable blocks (code.js editable()).
// Types with real key events (CDP Input), runs with the button and with Ctrl+Enter, checks
// Download saves the edited code, Reset, Esc, Tab, a read-only (non-runnable) block, and the popup.
import { writeFileSync, existsSync, readFileSync, mkdirSync, rmSync } from "node:fs";
const BASE = process.argv[2], OUT = process.argv[3], DISK = BASE.startsWith("file:");
const DL = `${OUT}/dl-edit-${DISK ? "disk" : "http"}`; rmSync(DL, { recursive: true, force: true }); mkdirSync(DL, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let pass = 0, fail = 0;
const check = (l, ok, got) => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${l}${ok ? "" : "  got: " + JSON.stringify(got)}`); };
function connect(url) {
  const ws = new WebSocket(url); let id = 0; const pend = new Map();
  ws.addEventListener("message", (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } });
  return { ready: new Promise((r) => ws.addEventListener("open", r)), send: (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); }) };
}
const B = connect((await (await fetch("http://127.0.0.1:9333/json/version")).json()).webSocketDebuggerUrl); await B.ready;
const P = connect((await (await fetch("http://127.0.0.1:9333/json/new?about:blank", { method: "PUT" })).json()).webSocketDebuggerUrl); await P.ready;
const send = P.send;
const js = async (e) => { const r = await send("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true, userGesture: true }); return r.result.result ? r.result.result.value : r; };
await send("Page.enable"); await send("Network.enable"); await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Emulation.setFocusEmulationEnabled", { enabled: true });
await send("Emulation.setDeviceMetricsOverride", { width: 1400, height: 900, deviceScaleFactor: 1, mobile: false });
await B.send("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: DL.replace(/\//g, "\\") });
const key = (k, code, vk, mods = 0) => send("Input.dispatchKeyEvent", { type: "keyDown", key: k, code, windowsVirtualKeyCode: vk, modifiers: mods,
    ...(k === "Enter" && !mods ? { text: "\r" } : {}) })   // a plain Enter types a line break, like a real key
  .then(() => send("Input.dispatchKeyEvent", { type: "keyUp", key: k, code, windowsVirtualKeyCode: vk, modifiers: mods }));
const CTRL = 2;

async function waitOutput(sel) {
  for (let k = 0; k < 200; k++) {
    await sleep(300);
    const o = await js(`(()=>{const o=document.querySelector('${sel} .code-output'); return o && !o.hidden && !o.classList.contains("busy") ? {text:o.textContent.trim(), cls:o.className} : null})()`);
    if (o) return o;
  }
  return null;
}

// scope: the first runnable block on the page (or in the popup)
async function suite(scope, label) {
  const W = `${scope} .code-wrap:has(pre[data-run])`;
  const s0 = await js(`(()=>{const w=document.querySelector('${W}'), c=w.querySelector('pre code');
    return {mode:c.contentEditable, hint:(w.querySelector('.code-hint')||{}).textContent, reset:w.querySelector('.code-btn[aria-label^="Reset"]').hidden}})()`);
  check(`${label}: runnable block is editable, hint shown, Reset hidden`, s0.mode === "plaintext-only" && s0.hint === "editable · Ctrl+Enter runs" && s0.reset === true, s0);

  // select all the code, then type new code with real key input
  await js(`(()=>{const c=document.querySelector('${W} pre code'); c.focus(); const r=document.createRange(); r.selectNodeContents(c); const s=getSelection(); s.removeAllRanges(); s.addRange(r);})()`);
  await send("Input.insertText", { text: "for i in range(3):" });
  await key("Enter", "Enter", 13);
  await key("Tab", "Tab", 9);
  await send("Input.insertText", { text: "print(i * 7)" });
  const s1 = await js(`(()=>{const w=document.querySelector('${W}'); return {code:w.querySelector('pre code').textContent, hint:w.querySelector('.code-hint').textContent, reset:w.querySelector('.code-btn[aria-label^="Reset"]').hidden}})()`);
  check(`${label}: typing replaces the code; Tab = 4 spaces; hint says edited; Reset shows`,
    s1.code === "for i in range(3):\n    print(i * 7)" && s1.hint === "edited · Ctrl+Enter runs" && s1.reset === false, s1);

  await js(`document.querySelector('${W} .code-btn[aria-label^="Run"]').click()`);
  let o = await waitOutput(W);
  check(`${label}: Run button runs the edited code`, o && o.cls.includes("done") && o.text === "0\n7\n14", o);

  await js(`document.querySelector('${W} pre code').focus()`);
  await send("Input.insertText", { text: "\nprint('ctrl')" });
  await key("Enter", "Enter", 13, CTRL);
  await sleep(300);
  o = await waitOutput(W);
  check(`${label}: Ctrl+Enter runs it (and adds no new line)`, o && o.text === "0\n7\n14\nctrl", o);
  const nl = await js(`document.querySelector('${W} pre code').textContent.endsWith("print('ctrl')")`);
  check(`${label}: Ctrl+Enter did not insert a line`, nl === true, nl);

  await key("Escape", "Escape", 27);
  const f = await js(`(()=>{const a=document.activeElement; return {cls:a.className, label:a.getAttribute("aria-label")}})()`);
  check(`${label}: Esc moves focus to the buttons`, f.cls === "code-btn", f);
  if (scope.startsWith("dialog")) {
    const open1 = await js(`!!document.querySelector("dialog.popup[open]")`);
    await key("Escape", "Escape", 27); await sleep(300);
    const open2 = await js(`!!document.querySelector("dialog.popup[open]")`);
    check(`${label}: first Esc keeps the popup open, second Esc closes it`, open1 === true && open2 === false, { open1, open2 });
  }

  return W;
}

// 1. Topic page on its own
await send("Page.navigate", { url: BASE + "topics/python-traps.html" }); await sleep(1500);
const W = await suite("article", "page");
const name = await js(`document.querySelector('${W} pre').getAttribute("data-file")`);
await js(`document.querySelector('${W} .code-btn[aria-label="Download code"]').click()`); await sleep(1500);
const saved = existsSync(`${DL}/${name}`) ? readFileSync(`${DL}/${name}`, "utf8") : null;
check(`page: Download saves the edited code (${name})`, saved === "for i in range(3):\n    print(i * 7)\nprint('ctrl')\n", saved);
const original = readFileSync(new URL(`../topics/${name}`, import.meta.url), "utf8").replace(/\r\n/g, "\n").replace(/\n$/, "");
await js(`document.querySelector('${W} .code-btn[aria-label^="Reset"]').click()`);
const r = await js(`(()=>{const w=document.querySelector('${W}'); return {same: w.querySelector('pre code').textContent, reset:w.querySelector('.code-btn[aria-label^="Reset"]').hidden, hint:w.querySelector('.code-hint').textContent}})()`);
check("page: Reset brings back the original, hides itself", r.same === original && r.reset === true && r.hint === "editable · Ctrl+Enter runs", { ...r, same: r.same.slice(0, 60) });
await js(`document.querySelector('${W} .code-btn[aria-label^="Run"]').click()`);
const o = await waitOutput(W);
const shown = await js(`(()=>{let n=document.querySelector('${W}').nextElementSibling; while(n && !n.classList.contains("code-wrap")) n=n.nextElementSibling; return n.querySelector("pre").textContent.trim()})()`);
check("page: after Reset, Run gives the shown output again", o && o.text === shown, { o, shown });
if (OUT) { await js(`document.querySelector('${W}').scrollIntoView({block:"center"})`); await sleep(300); const s = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(`${OUT}/edit-${DISK ? "disk" : "http"}.png`, Buffer.from(s.result.data, "base64")); }

// 2. A block without data-run stays read-only (dataclasses page: Message.java)
await send("Page.navigate", { url: BASE + "topics/dataclasses.html" }); await sleep(1500);
const ro = await js(`(()=>{const p=document.querySelector('pre[data-file="Message.java"]'); return {edit:p.querySelector('code').getAttribute("contenteditable"), hint:!!p.parentNode.querySelector('.code-hint')}})()`);
check("read-only block (no Run): not editable, no hint", ro.edit === null && ro.hint === false, ro);

// 3. Inside the popup (http only: from disk the popup is a frame showing the same page as 1.)
if (!DISK) {
  await send("Page.navigate", { url: BASE + "python-for-java-developers.html" }); await sleep(1500);
  await js(`document.querySelector('.toc a[href="topics/python-traps.html"]').click()`); await sleep(1500);
  await suite("dialog.popup[open]", "popup");
}

// 4. Phone width: hint and buttons fit
await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send("Page.navigate", { url: BASE + "topics/python-traps.html" }); await sleep(1500);
await js(`(()=>{const c=document.querySelector('pre[data-run] code'); c.focus(); document.execCommand("insertText", false, "# x\\n");})()`);
const ph = await js(`(()=>{const w=document.querySelector('.code-wrap:has(pre[data-run])'), h=w.querySelector('.code-hint').getBoundingClientRect(), b=w.querySelector('.code-bar').getBoundingClientRect();
  return {overlap: h.right > b.left - 4, page: document.documentElement.scrollWidth > innerWidth}})()`);
check("phone 390px: hint and 4 buttons do not overlap, no sideways scroll", !ph.overlap && !ph.page, ph);
if (OUT) { await js(`document.querySelector('.code-wrap:has(pre[data-run])').scrollIntoView({block:"center"})`); await sleep(300); const s = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(`${OUT}/edit-${DISK ? "disk" : "http"}-phone.png`, Buffer.from(s.result.data, "base64")); }

console.log(`\n${pass} passed, ${fail} failed`); await send("Page.close"); process.exit(fail ? 1 : 0);
