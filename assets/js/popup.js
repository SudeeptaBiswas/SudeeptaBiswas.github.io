// Popup viewer. A link with data-popup opens another page's [data-popup-content]
// part in a dialog over the current page, so the reader never leaves the post.
// Pages for it live in blog/topics/ and also work on their own (no JS, a direct
// link, a new tab). If loading fails (e.g. a file:// preview), the link just
// opens the page.
(function () {
  if (typeof HTMLDialogElement !== "function" || !window.fetch || !window.DOMParser) return;
  var root = document.documentElement;
  var dialog = null, body = null, pageLink = null, trigger = null;

  function build() {
    dialog = document.createElement("dialog");
    dialog.className = "popup";
    dialog.setAttribute("aria-labelledby", "popup-title");
    dialog.innerHTML =
      '<div class="popup-bar">' +
      '<a class="popup-page-link" href="#">Open as a page ↗</a>' +
      '<button type="button" class="popup-close" aria-label="Close">×</button>' +
      "</div>" +
      '<div class="popup-body"><div class="article popup-article"></div></div>';
    document.body.appendChild(dialog);
    body = dialog.querySelector(".popup-article");
    pageLink = dialog.querySelector(".popup-page-link");
    dialog.querySelector(".popup-close").addEventListener("click", function () { dialog.close(); });
    // A click on the dark area around the box closes it.
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", function () {
      root.classList.remove("popup-open");
      if (trigger) trigger.focus();
      trigger = null;
    });
  }

  // Relative links in the loaded part point from ITS folder, not ours: make them absolute.
  function absolute(content, base) {
    content.querySelectorAll("[href], [src]").forEach(function (el) {
      ["href", "src"].forEach(function (name) {
        var value = el.getAttribute(name);
        if (value && value.charAt(0) !== "#") el.setAttribute(name, new URL(value, base).href);
      });
    });
  }

  function show(url) {
    return fetch(url)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var content = doc.querySelector("[data-popup-content]");
        if (!content) throw new Error("no [data-popup-content] in " + url);
        absolute(content, url);
        var old = document.getElementById("popup-title");
        if (old) old.removeAttribute("id");
        var title = content.querySelector("h1");
        if (title) title.id = "popup-title";
        body.replaceChildren.apply(body, Array.prototype.slice.call(content.childNodes));
        pageLink.href = url;
        if (!dialog.open) { root.classList.add("popup-open"); dialog.showModal(); }
        dialog.querySelector(".popup-body").scrollTop = 0;
        dialog.querySelector(".popup-close").focus();
      });
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-popup]");
    // New tab, new window or a non-left click: let the browser do it.
    if (!a || e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (!dialog) build();
    if (!dialog.open) trigger = a;
    show(a.href).catch(function () { window.location.href = a.href; });
  });
})();
