// Dark mode toggle. Saved choice wins; otherwise follow the OS setting.
// The <head> of each page sets data-theme early to avoid a flash.
(function () {
  var root = document.documentElement;
  var btn = document.querySelector(".theme-toggle");
  if (!btn) return;

  function label() {
    var dark = root.getAttribute("data-theme") === "dark";
    btn.textContent = dark ? "Light" : "Dark";
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }

  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    label();
  });

  label();
})();
