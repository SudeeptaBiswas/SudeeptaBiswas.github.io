// Runner plugin: "pythontutor". The Run button opens the code in Python Tutor
// (pythontutor.com) in a new tab, where it runs step by step.
// Limits (measured 2026-11-10): ads; only some standard modules (no numpy,
// dataclasses, pathlib); collections.Counter.most_common fails.
(function () {
  window.CodeRunners = window.CodeRunners || {};
  window.CodeRunners.pythontutor = {
    attach: function (ctx) {
      var py = (ctx.config.pythontutor && ctx.config.pythontutor.py) || "311";
      var run = document.createElement("a");
      run.className = "code-btn";
      run.target = "_blank";
      run.rel = "noopener";
      run.title = "Run online in Python Tutor (opens a new tab)";
      run.setAttribute("aria-label", run.title);
      run.innerHTML = ctx.icon("run");
      // Build the link on click, so it always carries the code as it is now.
      run.addEventListener("click", function () {
        run.href = "https://pythontutor.com/visualize.html#code=" + encodeURIComponent(ctx.code()) +
          "&cumulative=false&heapPrimitives=nevernest&mode=edit&origin=opt-frontend.js&py=" + py +
          "&rawInputLstJSON=%5B%5D&textReferences=false";
      });
      run.href = "https://pythontutor.com/";
      ctx.bar.appendChild(run);
    }
  };
})();
