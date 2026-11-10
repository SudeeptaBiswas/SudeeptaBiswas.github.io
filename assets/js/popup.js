// Popup viewer. A link with data-popup opens another page in a dialog over the
// current page, so the reader never leaves the post. Pages for it live in
// blog/topics/ and also work on their own (no JS, a direct link, a new tab).
// Online (http): the page's [data-popup-content] part is loaded into the dialog,
// so it uses this page's styles and theme. Opened from disk (file://) the
// browser blocks that load, so the page is shown in a frame inside the dialog.
(function () {
  if (typeof HTMLDialogElement !== "function") return;
  var root = document.documentElement;
  var dialog = null, body = null, pageLink = null, closeButton = null, trigger = null;
  var latest = 0;   // id of the newest request; a slower, older reply is dropped

  function build() {
    dialog = document.createElement("dialog");
    dialog.className = "popup";
    dialog.innerHTML =
      '<div class="popup-bar">' +
      '<a class="popup-page-link" href="#">Open as a page ↗</a>' +
      '<button type="button" class="popup-close" aria-label="Close">×</button>' +
      "</div>" +
      '<div class="popup-body"></div>';
    document.body.appendChild(dialog);
    body = dialog.querySelector(".popup-body");
    pageLink = dialog.querySelector(".popup-page-link");
    closeButton = dialog.querySelector(".popup-close");
    closeButton.addEventListener("click", function () { dialog.close(); });
    // A click on the dark area around the box closes it.
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", function () {
      latest++;   // a reply that arrives after closing must not reopen the popup
      root.classList.remove("popup-open");
      body.replaceChildren();
      if (trigger) trigger.focus();
      trigger = null;
    });
  }

  function open(url) {
    pageLink.href = url;
    if (!dialog.open) { root.classList.add("popup-open"); dialog.showModal(); }
    body.scrollTop = 0;
    closeButton.focus();
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

  // Online: copy the page's content part into the dialog.
  function showContent(url, id) {
    if (!window.fetch || !window.DOMParser || location.protocol === "file:") return Promise.reject();
    return fetch(url)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) {
        if (id !== latest) return;
        var doc = new DOMParser().parseFromString(html, "text/html");
        var content = doc.querySelector("[data-popup-content]");
        if (!content) throw new Error("no [data-popup-content] in " + url);
        absolute(content, url);
        var title = content.querySelector("h1");
        if (title) title.id = "popup-title";
        var article = document.createElement("div");
        article.className = "article popup-article";
        article.replaceChildren.apply(article, Array.prototype.slice.call(content.childNodes));
        body.replaceChildren(article);
        if (window.enhanceCode) window.enhanceCode(article);   // copy / download buttons
        if (window.enhanceDemos) window.enhanceDemos(article); // interactive demos (sliders)
        dialog.removeAttribute("aria-label");
        dialog.setAttribute("aria-labelledby", "popup-title");
        open(url);
      });
  }

  // From disk: show the whole page in a frame. The page hides its own back link
  // when framed and takes the theme from the "#theme=" part of the address.
  function showFrame(url, label) {
    var frame = document.createElement("iframe");
    frame.className = "popup-frame";
    frame.title = label;
    frame.src = url.split("#")[0] + "#theme=" + (root.getAttribute("data-theme") || "light");
    body.replaceChildren(frame);
    dialog.removeAttribute("aria-labelledby");
    dialog.setAttribute("aria-label", label);
    open(url);
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-popup]");
    // New tab, new window or a non-left click: let the browser do it.
    if (!a || e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (!dialog) build();
    if (!dialog.open) trigger = a;
    var label = a.textContent.trim();
    var id = ++latest;
    showContent(a.href, id).catch(function () { if (id === latest) showFrame(a.href, label); });
  });
})();
