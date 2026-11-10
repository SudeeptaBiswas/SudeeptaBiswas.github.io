// Small interactive demos inside posts and popup pages. Each one is a
// <div data-demo="name"> whose plain text works without JS; this script swaps
// in the live version. The popup viewer calls window.enhanceDemos(box) for
// content it copies in, because copied scripts do not run.
(function () {
  // data-demo="temperature" data-words="cat,mat,rat" data-logits="2.0,1.0,0.5"
  // A slider for T; bars show softmax(score / T) for each word.
  function temperature(box) {
    var words = box.getAttribute("data-words").split(",");
    var logits = box.getAttribute("data-logits").split(",").map(Number);
    var id = "demo-t-" + Math.random().toString(36).slice(2, 8);

    box.innerHTML =
      '<p class="demo-title">Try it: move the temperature</p>' +
      '<div class="demo-control">' +
      '<label for="' + id + '">Temperature</label>' +
      '<output for="' + id + '">1.0</output>' +
      "</div>" +
      '<input id="' + id + '" type="range" min="0.2" max="3" step="0.1" value="1">' +
      '<div class="demo-scale"><span>0.2 · sharper, safer</span><span>3.0 · flatter, wilder</span></div>' +
      '<div class="demo-bars"></div>' +
      '<p class="demo-note">The scores stay [' + logits.map(function (x) { return x.toFixed(1); }).join(", ") +
      "]. Only the temperature changes.</p>";

    var slider = box.querySelector("input");
    var shown = box.querySelector("output");
    var bars = box.querySelector(".demo-bars");
    var fills = words.map(function (w) {
      var row = document.createElement("div");
      row.className = "demo-row";
      row.innerHTML = '<span class="demo-word"></span><span class="demo-track"><span class="demo-fill"></span></span><span class="demo-pct"></span>';
      row.querySelector(".demo-word").textContent = w;
      bars.appendChild(row);
      return { fill: row.querySelector(".demo-fill"), pct: row.querySelector(".demo-pct") };
    });

    function update() {
      var t = Number(slider.value);
      var exps = logits.map(function (x) { return Math.exp(x / t); });
      var sum = exps.reduce(function (a, b) { return a + b; }, 0);
      shown.textContent = t.toFixed(1);
      exps.forEach(function (e, i) {
        var p = e / sum * 100;
        fills[i].fill.style.width = p + "%";
        fills[i].pct.textContent = p.toFixed(1) + "%";
      });
    }
    slider.addEventListener("input", update);
    update();
  }

  var demos = { temperature: temperature };

  window.enhanceDemos = function (root) {
    (root || document).querySelectorAll("[data-demo]").forEach(function (box) {
      var make = demos[box.getAttribute("data-demo")];
      if (make && !box.classList.contains("demo-live")) { box.classList.add("demo", "demo-live"); make(box); }
    });
  };
  window.enhanceDemos(document);
})();
