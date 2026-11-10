// Runner plugin: "pyodide". The Run button runs the code with Pyodide (CPython
// compiled to WebAssembly) inside the reader's browser and shows the output under
// the block. Nothing is sent to a server. Python is loaded on the first Run only:
// ~9 MB from jsDelivr, cached by the browser for a year (measured 2026-11-10).
// Packages a block imports (e.g. numpy) are loaded automatically.
(function () {
  var ready = null;   // one Python for the whole page, started on the first Run

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src; s.onload = resolve; s.onerror = function () { reject(new Error("could not load " + src)); };
      document.head.appendChild(s);
    });
  }

  function python(config) {
    if (!ready) {
      var version = (config.pyodide && config.pyodide.version) || "314.0.7";
      var base = "https://cdn.jsdelivr.net/pyodide/v" + version + "/full/";
      ready = loadScript(base + "pyodide.js")
        .then(function () { return window.loadPyodide({ indexURL: base }); })
        .catch(function (e) { ready = null; throw e; });   // allow a retry after a network error
    }
    return ready;
  }

  function show(box, text, kind) {
    box.hidden = false;
    box.className = "code-output" + (kind ? " " + kind : "");
    box.textContent = text;
  }

  window.CodeRunners = window.CodeRunners || {};
  window.CodeRunners.pyodide = {
    attach: function (ctx) {
      var box = document.createElement("pre");
      box.className = "code-output";
      box.hidden = true;
      box.setAttribute("aria-live", "polite");
      ctx.wrap.appendChild(box);

      var run = ctx.button("run", "Run in your browser (Python)", function () {
        run.disabled = true;
        show(box, ready ? "Running…" : "Loading Python… (first time ~9 MB, then cached)", "busy");
        var lines = [];
        python(ctx.config)
          .then(function (py) {
            show(box, "Running…", "busy");
            py.setStdout({ batched: function (s) { lines.push(s); } });
            py.setStderr({ batched: function (s) { lines.push(s); } });
            return py.loadPackagesFromImports(ctx.code()).then(function () {
              var scope = py.globals.get("dict")();   // fresh names for every run
              return py.runPythonAsync(ctx.code(), { globals: scope })
                .finally(function () { scope.destroy(); });
            });
          })
          .then(function () { show(box, lines.join("\n") || "(no output)", "done"); })
          .catch(function (e) {
            var message = String(e && e.message || e);
            // Python errors: keep the traceback from the user's code, drop Pyodide's own frames.
            var at = message.indexOf('File "<exec>"');
            if (at > -1) message = "Traceback (most recent call last):\n  " + message.slice(at);
            show(box, (lines.length ? lines.join("\n") + "\n" : "") + message, "error");
          })
          .finally(function () { run.disabled = false; });
      });
      ctx.bar.appendChild(run);
    }
  };
})();
