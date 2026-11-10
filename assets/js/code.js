// Code blocks: Copy and Download buttons in the top-right corner of every
// <pre> in a post. Download name: data-file="bpe.py" on the <pre>, else "code.txt".
// A block marked data-run="python" also gets a Run button from a runner plugin:
// assets/js/config.js names the plugin ("runner"), and its file in
// assets/js/runners/ is loaded only on pages that have such a block.
// When a Run button is added, the block can also be edited in place (see editable()).
// popup.js calls window.enhanceCode(box) after it loads a page into the popup.
(function () {
  var ICONS = {
    copy: '<path d="M9 9h10v12H9z"/><path d="M5 15H4V3h11v1"/>',
    done: '<path d="M5 12l5 5 9-10"/>',
    download: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 20h16"/>',
    run: '<path d="M7 4l13 8-13 8z"/>',
    reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v5h5"/>'
  };
  // Folder of this script, so config.js and runners/ load from the right place on any page.
  var here = document.currentScript ? document.currentScript.src.replace(/[^/]*$/, "") : "";
  var runner = null;       // the plugin, once loaded
  var waiting = [];        // runnable blocks seen before the plugin arrived
  var loading = false;
  var noRunner = false;    // "off", a missing plugin or a load error: stop collecting blocks

  function icon(name) {
    return '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      ICONS[name] + "</svg>";
  }

  function button(name, label, action) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "code-btn";
    b.title = label;
    b.setAttribute("aria-label", label);
    b.innerHTML = icon(name);
    b.addEventListener("click", action);
    return b;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // Load config.js, then the runner it names. "off" (or a missing plugin) = no Run button.
  function loadRunner() {
    if (loading) return;
    loading = true;
    var start = window.SITE_CONFIG ? Promise.resolve() : loadScript(here + "config.js");
    start.then(function () {
      var name = (window.SITE_CONFIG || {}).runner || "off";
      if (name === "off") { noRunner = true; waiting = []; return; }
      return loadScript(here + "runners/" + name + ".js").then(function () {
        runner = (window.CodeRunners || {})[name] || null;
        if (!runner) noRunner = true;   // the plugin did not register
        waiting.forEach(function (ctx) { if (runner) attach(ctx); });
        waiting = [];
      });
    }).catch(function () { noRunner = true; waiting = []; });   // no Run button; Copy and Download still work
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return copyByTextBox(text); });
    }
    return copyByTextBox(text);
  }

  // Older browsers, or when the clipboard API says no: copy through a hidden text box.
  function copyByTextBox(text) {
    return new Promise(function (resolve, reject) {
      var box = document.createElement("textarea");
      box.value = text;
      box.setAttribute("readonly", "");
      box.style.position = "fixed"; box.style.opacity = "0";
      document.body.appendChild(box);
      box.select();
      var ok = document.execCommand("copy");
      box.remove();
      ok ? resolve() : reject();
    });
  }

  function download(text, name) {
    var url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // A runnable block can be edited in place: Run, Copy and Download all use the code as it is
  // now. Reset brings back the original. Nothing is saved: a reload shows the original again.
  // Keys inside: Tab = 4 spaces, Ctrl+Enter (Cmd+Enter) = Run, Esc = leave (focus goes to the buttons;
  // in the popup a second Esc closes it).
  function editable(ctx) {
    var el = ctx.pre.querySelector("code") || ctx.pre;
    try { el.contentEditable = "plaintext-only"; } catch (e) { /* old browsers throw on an unknown value */ }
    if (el.contentEditable !== "plaintext-only") { el.removeAttribute("contenteditable"); return; }   // old browser: read-only
    var original = el.textContent;
    el.spellcheck = false;
    el.setAttribute("autocapitalize", "off");
    el.setAttribute("autocorrect", "off");
    el.setAttribute("role", "textbox");
    el.setAttribute("aria-multiline", "true");
    el.setAttribute("aria-label", "Python code, editable. Ctrl+Enter runs it, Esc leaves the editor.");
    ctx.wrap.classList.add("code-editable");

    // Visible hint. The key part is hidden on phones (no Tab or Ctrl there), see style.css.
    var hint = document.createElement("span");
    hint.className = "code-hint";
    hint.innerHTML = '<span class="code-hint-state">editable</span><span class="code-hint-keys"> · Ctrl+Enter runs · Esc leaves</span>';
    var state = hint.firstChild;
    ctx.wrap.appendChild(hint);

    var reset = button("reset", "Reset to the original code", function () {
      el.textContent = original;
      changed();
      el.focus();
    });
    reset.hidden = true;
    ctx.bar.insertBefore(reset, ctx.bar.firstChild);

    function changed() {
      var edited = el.textContent !== original;
      reset.hidden = !edited;
      ctx.wrap.classList.toggle("code-edited", edited);
      state.textContent = edited ? "edited" : "editable";
    }
    el.addEventListener("input", changed);
    el.addEventListener("keydown", function (e) {
      if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        document.execCommand("insertText", false, "    ");
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        var run = ctx.bar.querySelector('[aria-label^="Run"]');
        if (run) run.click();
      } else if (e.key === "Escape") {
        e.preventDefault();   // in the popup: the first Esc leaves the editor, the next one closes the popup
        var first = ctx.bar.querySelector(".code-btn:not([hidden])");
        if (first) first.focus(); else el.blur();
      }
    });
  }

  function attach(ctx) {
    editable(ctx);
    runner.attach(ctx);
  }

  function enhance(pre) {
    if (pre.classList.contains("code-output") || pre.parentNode.classList.contains("code-wrap")) return;
    var wrap = document.createElement("div");
    wrap.className = "code-wrap";
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);
    var text = function () { return pre.textContent.replace(/\n$/, "") + "\n"; };
    var bar = document.createElement("div");
    bar.className = "code-bar";

    var copy = button("copy", "Copy code", function () {
      copyText(text()).then(function () {
        copy.innerHTML = icon("done"); copy.title = "Copied"; copy.setAttribute("aria-label", "Copied");
        setTimeout(function () {
          copy.innerHTML = icon("copy"); copy.title = "Copy code"; copy.setAttribute("aria-label", "Copy code");
        }, 1500);
      });
    });
    bar.appendChild(copy);
    bar.appendChild(button("download", "Download code", function () {
      download(text(), pre.getAttribute("data-file") || "code.txt");
    }));
    wrap.appendChild(bar);

    if (pre.getAttribute("data-run") === "python") {
      var ctx = { pre: pre, wrap: wrap, bar: bar, code: text, icon: icon, button: button,
                  get config() { return window.SITE_CONFIG || {}; } };   // read live: config.js may load later
      if (runner) attach(ctx);
      else if (!noRunner) { waiting.push(ctx); loadRunner(); }
    }
  }

  window.enhanceCode = function (box) {
    (box || document).querySelectorAll(".article pre, .popup-article pre, [data-popup-content] pre").forEach(enhance);
  };
  window.enhanceCode(document);
})();
