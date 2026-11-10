// Code blocks: Copy and Download buttons in the top-right corner of every
// <pre> in a post. A block marked data-run="python" also gets a Run button that
// opens the code in Python Tutor (an online Python runner) in a new tab.
// Download name: data-file="bpe.py" on the <pre>, else "code.txt".
// popup.js calls window.enhanceCode(box) after it loads a page into the popup.
(function () {
  var ICONS = {
    copy: '<path d="M9 9h10v12H9z"/><path d="M5 15H4V3h11v1"/>',
    done: '<path d="M5 12l5 5 9-10"/>',
    download: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 20h16"/>',
    run: '<path d="M7 4l13 8-13 8z"/>'
  };

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

  function pythonTutor(text) {
    return "https://pythontutor.com/visualize.html#code=" + encodeURIComponent(text) +
      "&cumulative=false&heapPrimitives=nevernest&mode=edit&origin=opt-frontend.js&py=311" +
      "&rawInputLstJSON=%5B%5D&textReferences=false";
  }

  function enhance(pre) {
    if (pre.parentNode.classList.contains("code-wrap")) return;
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
    if (pre.getAttribute("data-run") === "python") {
      var run = document.createElement("a");
      run.className = "code-btn";
      run.href = pythonTutor(text());
      run.target = "_blank";
      run.rel = "noopener";
      run.title = "Run online in Python Tutor (opens a new tab)";
      run.setAttribute("aria-label", run.title);
      run.innerHTML = icon("run");
      bar.appendChild(run);
    }
    wrap.appendChild(bar);
  }

  window.enhanceCode = function (box) {
    (box || document).querySelectorAll(".article pre, .popup-article pre, [data-popup-content] pre").forEach(enhance);
  };
  window.enhanceCode(document);
})();
