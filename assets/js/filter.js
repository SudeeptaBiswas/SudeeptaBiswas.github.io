// Project filter. Without JS every card stays visible.
(function () {
  var chips = document.querySelectorAll(".chip");
  var cards = document.querySelectorAll(".card[data-filters]");
  var groups = document.querySelectorAll(".group");
  var count = document.getElementById("filter-count");

  function apply(key) {
    var shown = 0;
    cards.forEach(function (c) {
      var hit = key === "all" || c.getAttribute("data-filters").split(" ").indexOf(key) !== -1;
      c.hidden = !hit;
      if (hit) shown++;
    });
    groups.forEach(function (g) {
      g.hidden = !g.querySelector(".card:not([hidden])");
    });
    chips.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-filter") === key ? "true" : "false");
    });
    if (count) count.textContent = "Showing " + shown + " of " + cards.length + " projects";
  }

  chips.forEach(function (b) {
    b.addEventListener("click", function () { apply(b.getAttribute("data-filter")); });
  });
  apply("all");
})();
