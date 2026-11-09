// Site header menu and the "Contents" / "All projects" panel.
// Wide screens (1100px+): sticky side panel, always open, highlights the section you are reading.
// Smaller screens: the panel moves into the sticky header as a menu button before the
// site name, so it stays reachable while you scroll; tap it to open the list.
// Phones (600px and less): the site links (Projects, Skills, ...) move into that menu too,
// so the header fits on one row.
// Panel and list heights are measured here (no fixed numbers in CSS). The height only
// changes on resize, never while scrolling (that made the panel flicker): it is the space
// between the header and the footer, so even at the page end the footer can't push it.
// Without JS the panel is a plain closed box above the content, and the links still work.

// Pages without a panel (home, projects list, 404): on phones, a ☰ menu holds the site links,
// so the header fits on one row there too.
(function () {
  if (document.querySelector(".page-layout > .toc details")) return;
  var bar = document.querySelector(".site-header .wrap");
  var siteNav = bar && bar.querySelector(".nav");
  if (!siteNav) return;
  var siteNavNext = siteNav.nextElementSibling;
  var header = document.querySelector(".site-header");
  var root = document.documentElement;
  var phone = window.matchMedia("(max-width: 600px)");
  var menu = null;

  function close(focusButton) {
    var d = menu && menu.querySelector("details");
    if (d && d.open) { d.open = false; if (focusButton) d.querySelector("summary").focus(); }
  }
  function build() {
    menu = document.createElement("nav");
    menu.className = "toc in-header";
    menu.setAttribute("aria-label", "Menu");
    menu.innerHTML = '<details><summary>Menu</summary><div class="toc-body"></div></details>';
    menu.addEventListener("focusout", function (e) {
      if (e.relatedTarget && !menu.contains(e.relatedTarget)) close(false);
    });
    bar.insertBefore(menu, bar.firstChild);
  }
  function fit() {
    if (phone.matches) {
      if (!menu) build();
      menu.querySelector(".toc-body").appendChild(siteNav);
      root.classList.add("toc-in-header");
    } else if (menu) {
      bar.insertBefore(siteNav, siteNavNext);
      menu.remove(); menu = null;
      root.classList.remove("toc-in-header");
    }
    if (header) root.style.setProperty("--header-h", header.offsetHeight + "px");
  }
  if (phone.addEventListener) phone.addEventListener("change", fit);
  else phone.addListener(fit);
  fit();
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(true); });
  document.addEventListener("click", function (e) { if (menu && !menu.contains(e.target)) close(false); });
})();

(function () {
  var panel = document.querySelector(".page-layout > .toc details");
  if (!panel) return;
  var nav = panel.parentNode;
  var home = nav.parentNode, homeNext = nav.nextElementSibling;
  var bar = document.querySelector(".site-header .wrap");
  var header = document.querySelector(".site-header");
  var siteNav = bar && bar.querySelector(".nav");
  var siteNavNext = siteNav && siteNav.nextElementSibling;
  var body = panel.querySelector(".toc-body");
  var list = panel.querySelector(".toc-list") || panel.querySelector(".toc-body ol");
  var root = document.documentElement;
  var links = panel.querySelectorAll('a[href^="#"]');
  var summary = panel.querySelector("summary");
  var wide = window.matchMedia("(min-width: 1100px)");
  var phone = window.matchMedia("(max-width: 600px)");
  var footer = document.querySelector(".site-footer");
  var main = home.parentNode;

  function px(el, prop) { return parseFloat(getComputedStyle(el)[prop]) || 0; }

  // Headings must stop just below the sticky header, whatever its height.
  function headerOffset() {
    if (header) root.style.setProperty("--header-h", header.offsetHeight + "px");
  }

  // Wide: panel height = window height minus the sticky top (header + gap) minus the
  // footer and the gap above it (main's bottom padding). At the page end the panel then
  // ends exactly where the layout ends, so sticky never has to push it.
  // Menu: list height = from the list top to the window bottom.
  function size() {
    if (!list) return;
    if (wide.matches) {
      var top = px(nav, "top");
      var reserve = (footer ? footer.offsetHeight : 0) + px(main, "paddingBottom");
      var panelMax = Math.max(120, window.innerHeight - top - reserve);
      nav.style.maxHeight = panelMax + "px";
      var listTop = list.getBoundingClientRect().top - nav.getBoundingClientRect().top + nav.scrollTop;
      var below = px(nav, "paddingBottom") + px(nav, "borderBottomWidth");
      list.style.maxHeight = Math.max(80, panelMax - listTop - below) + "px";
    } else {
      nav.style.maxHeight = "";
      if (!panel.open) return;
      var room = window.innerHeight - list.getBoundingClientRect().top - px(body, "paddingBottom") - px(body, "borderBottomWidth");
      list.style.maxHeight = Math.max(120, room) + "px";
    }
  }

  function fit() {
    if (wide.matches) {
      if (nav.parentNode !== home) home.insertBefore(nav, homeNext);
      nav.classList.remove("in-header");
      root.classList.remove("toc-in-header");
      panel.open = true;
      summary.setAttribute("tabindex", "-1");   // plain label, no tab stop
      summary.setAttribute("aria-disabled", "true");
    } else {
      if (bar && nav.parentNode !== bar) bar.insertBefore(nav, bar.firstChild);
      nav.classList.add("in-header");
      root.classList.add("toc-in-header");
      panel.open = false;
      summary.removeAttribute("tabindex");
      summary.removeAttribute("aria-disabled");
    }
    // Phones: site links live in the menu; otherwise back in the header.
    if (siteNav) {
      if (!wide.matches && phone.matches) {
        if (siteNav.parentNode !== body) body.insertBefore(siteNav, body.firstChild);
      } else if (siteNav.parentNode !== bar) {
        bar.insertBefore(siteNav, siteNavNext);
      }
    }
    panel.classList.toggle("pinned", wide.matches);
    headerOffset();
    size();
  }
  [wide, phone].forEach(function (mq) {
    if (mq.addEventListener) mq.addEventListener("change", fit);
    else mq.addListener(fit);
  });
  fit();
  window.addEventListener("resize", function () { headerOffset(); size(); });

  // Long lists (all projects): if the current page's link is out of view, scroll just
  // enough to show it (so group labels like "Work" stay visible when possible).
  var here = panel.querySelector('a[aria-current="page"]');
  function showHere() {
    if (!here || !list || list.scrollHeight <= list.clientHeight) return;
    var b = list.getBoundingClientRect(), a = here.getBoundingClientRect();
    if (a.top < b.top) list.scrollTop -= b.top - a.top;
    else if (a.bottom > b.bottom) list.scrollTop += a.bottom - b.bottom;
  }
  showHere();
  panel.addEventListener("toggle", function () { if (panel.open) { size(); showHere(); } });
  if (wide.addEventListener) wide.addEventListener("change", showHere);

  summary.addEventListener("click", function (e) {
    if (wide.matches) e.preventDefault();
  });

  // Menu mode: close after a link is tapped and move focus to the section
  // heading, so keyboard and screen reader users land there.
  panel.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || wide.matches) return;
    panel.open = false;
    var href = a.getAttribute("href");
    if (href.charAt(0) !== "#") return;
    var target = document.getElementById(href.slice(1));
    if (target) {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
  });

  // Menu mode: close when keyboard focus leaves the menu (Tab past the last link).
  nav.addEventListener("focusout", function (e) {
    if (!wide.matches && panel.open && e.relatedTarget && !nav.contains(e.relatedTarget)) panel.open = false;
  });

  // Menu mode: close on Escape or a tap outside.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !wide.matches && panel.open) { panel.open = false; summary.focus(); }
  });
  document.addEventListener("click", function (e) {
    if (!wide.matches && panel.open && !nav.contains(e.target)) panel.open = false;
  });

  // "Back to contents" links: in menu mode, open the menu instead of jumping.
  document.querySelectorAll('a[href="#contents"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (wide.matches) return;
      e.preventDefault(); e.stopPropagation();
      panel.open = true; summary.focus();
    });
  });

  // Highlight: the last section whose heading has scrolled past the header.
  var targets = [];
  links.forEach(function (a) {
    var el = document.getElementById(a.getAttribute("href").slice(1));
    if (el) targets.push({ link: a, el: el });
  });

  function mark() {
    if (!targets.length) return;
    var current = targets[0];
    targets.forEach(function (t) {
      if (t.el.getBoundingClientRect().top < (header ? header.offsetHeight : 61) + 60) current = t;
    });
    // At the bottom of the page, the last section wins.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = targets[targets.length - 1];
    }
    targets.forEach(function (t) {
      var on = t === current;
      t.link.classList.toggle("active", on);
      if (on) t.link.setAttribute("aria-current", "location");
      else t.link.removeAttribute("aria-current");
    });
  }

  // On scroll: re-highlight only (no resizing while scrolling).
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; mark(); });
  }, { passive: true });
  window.addEventListener("resize", mark);
  mark();
})();
