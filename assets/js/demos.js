// Small interactive demos inside posts and popup pages. Each one is a
// <div data-demo="name"> whose plain text works without JS; this script swaps
// in the live version. The popup viewer calls window.enhanceDemos(box) for
// content it copies in, because copied scripts do not run.
//   temperature  data-words="cat,mat,rat" data-logits="2.0,1.0,0.5"   (softmax page)
//   topk         data-words="cat,mat,rat" data-logits="2.0,1.0,0.5"   (softmax page)
//   quant        data-weights="0.82,-0.41,..." data-billions="4"     (quantization page)
//   angle        data-a="0.9,0.1" data-a-name="animal"                (cosine page)
(function () {
  function numbers(box, name) { return box.getAttribute(name).split(",").map(Number); }
  function softmax(xs) {
    var exps = xs.map(function (x) { return Math.exp(x); });
    var sum = exps.reduce(function (a, b) { return a + b; }, 0);
    return exps.map(function (e) { return e / sum; });
  }
  function add(box, tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    box.appendChild(el);
    return el;
  }

  // A labelled slider with its value shown big on the right and the two ends under it.
  function slider(box, o) {
    var id = "demo-" + Math.random().toString(36).slice(2, 8);
    var wrap = add(box, "div", "demo-slider");
    var head = add(wrap, "div", "demo-control");
    var label = add(head, "label", null, o.label);
    label.htmlFor = id;
    var out = add(head, "output");
    out.htmlFor = id;
    var input = add(wrap, "input");
    input.type = "range"; input.id = id;
    input.min = o.min; input.max = o.max; input.step = o.step; input.value = o.value;
    var scale = add(wrap, "div", "demo-scale");
    add(scale, "span", null, o.left);
    add(scale, "span", null, o.right);
    return { input: input, value: function () { return Number(input.value); }, show: function (t) { out.textContent = t; } };
  }

  // One bar per name: name | bar | text on the right.
  function bars(box, names) {
    var list = add(box, "div", "demo-bars");
    return names.map(function (n) {
      var row = add(list, "div", "demo-row");
      add(row, "span", "demo-word", n);
      var track = add(row, "span", "demo-track");
      var fill = add(track, "span", "demo-fill");
      var pct = add(row, "span", "demo-pct");
      return { row: row, set: function (share, text) { fill.style.width = share * 100 + "%"; pct.textContent = text; } };
    });
  }

  function start(box, title) { box.replaceChildren(); add(box, "p", "demo-title", title); }
  function percent(p) { return (p * 100).toFixed(1) + "%"; }

  // softmax(score / T) for each word, T from a slider.
  function temperature(box) {
    var words = box.getAttribute("data-words").split(","), logits = numbers(box, "data-logits");
    start(box, "Try it: move the temperature");
    var t = slider(box, { label: "Temperature", min: 0.2, max: 3, step: 0.1, value: 1,
                          left: "0.2 · sharper, safer", right: "3.0 · flatter, wilder" });
    var rows = bars(box, words);
    add(box, "p", "demo-note", "The scores stay [" + logits.map(function (x) { return x.toFixed(1); }).join(", ") +
        "]. Only the temperature changes.");
    function update() {
      t.show(t.value().toFixed(1));
      softmax(logits.map(function (x) { return x / t.value(); }))
        .forEach(function (p, i) { rows[i].set(p, percent(p)); });
    }
    t.input.addEventListener("input", update);
    update();
  }

  // top_k cuts to the k most likely words, then top_p keeps the most likely until they cover p.
  // The words left share 100% again (the order Ollama uses: top_k first, then top_p).
  function topk(box) {
    var words = box.getAttribute("data-words").split(","), logits = numbers(box, "data-logits");
    var n = words.length, model = softmax(logits);
    start(box, "Try it: top_k and top_p");
    var k = slider(box, { label: "top_k", min: 1, max: n, step: 1, value: 2,
                          left: "1 · only the top word", right: n + " · off, all words" });
    var p = slider(box, { label: "top_p", min: 0.1, max: 1, step: 0.05, value: 1,
                          left: "0.1 · only the top word", right: "1.0 · off" });
    var rows = bars(box, words);
    add(box, "p", "demo-note", "Model odds: " + words.map(function (w, i) { return w + " " + percent(model[i]); }).join(", ") +
        ". top_k cuts first, then top_p counts on what is left. The words left share 100% again.");
    var order = words.map(function (w, i) { return i; }).sort(function (a, b) { return model[b] - model[a]; });
    function update() {
      k.show(k.value() === n ? n + " (off)" : String(k.value()));
      p.show(p.value() >= 1 ? "1.0 (off)" : p.value().toFixed(2));
      var kept = order.slice(0, k.value());
      var sum = kept.reduce(function (s, i) { return s + model[i]; }, 0), cover = 0, keep = [];
      for (var j = 0; j < kept.length; j++) {          // smallest set that covers p
        keep.push(kept[j]);
        cover += model[kept[j]] / sum;
        if (cover >= p.value() - 1e-9) break;
      }
      var total = keep.reduce(function (s, i) { return s + model[i]; }, 0);
      words.forEach(function (w, i) {
        var on = keep.indexOf(i) > -1;
        rows[i].row.classList.toggle("demo-off", !on);
        rows[i].set(on ? model[i] / total : 0, on ? percent(model[i] / total) : "dropped");
      });
    }
    k.input.addEventListener("input", update);
    p.input.addEventListener("input", update);
    update();
  }

  // Bits per weight -> file size, and a toy quantize/restore of a few weights.
  function quant(box) {
    var weights = numbers(box, "data-weights"), billions = Number(box.getAttribute("data-billions"));
    start(box, "Try it: bits per weight");
    var b = slider(box, { label: "Bits per weight", min: 2, max: 16, step: 1, value: 4,
                          left: "2 · tiny, rough", right: "16 · original (FP16)" });
    var size = bars(box, ["File", "RAM"]);
    var table = add(add(box, "div", "table-wrap"), "table", "demo-table");
    table.innerHTML = "<thead><tr><th>Weight</th><th>Stored as</th><th>Comes back as</th><th>Error</th></tr></thead><tbody></tbody>";
    var body = table.tBodies[0];
    var worst = add(box, "p", "demo-sum");
    add(box, "p", "demo-note", "Sizes are for a " + billions + "-billion-weight model (qwen3:4b): billions × bits ÷ 8, RAM about × 1.3. " +
        "Real Q4_K_M uses about 5 bits: each small block of weights also stores its own scale, so its error is lower than this toy.");
    var fullGb = billions * 16 / 8 * 1.3;
    function update() {
      var bits = b.value(), steps = Math.pow(2, bits) - 1;
      b.show(bits + " bits");
      var gb = billions * bits / 8;
      size[0].set(gb / fullGb, gb.toFixed(1) + " GB");
      size[1].set(gb * 1.3 / fullGb, (gb * 1.3).toFixed(1) + " GB");
      var low = Math.min.apply(null, weights), high = Math.max.apply(null, weights), step = (high - low) / steps;
      var max = 0;
      body.replaceChildren();
      weights.forEach(function (w) {
        var code = Math.round((w - low) / step), back = low + code * step, err = Math.abs(w - back);
        max = Math.max(max, err);
        var tr = add(body, "tr");
        [w.toFixed(2), code + " of " + steps, back.toFixed(3), err.toFixed(3)].forEach(function (t) { add(tr, "td", null, t); });
      });
      worst.textContent = (steps + 1) + " possible values between " + low.toFixed(2) + " and " + high.toFixed(2) +
        ". Worst error: " + max.toFixed(3);
    }
    b.input.addEventListener("input", update);
    update();
  }

  // Two arrows: A fixed, B set by direction and length. Shows dot, norm and cosine live.
  function angle(box) {
    var a = numbers(box, "data-a"), aName = box.getAttribute("data-a-name") || "A";
    var aAngle = Math.atan2(a[1], a[0]) * 180 / Math.PI;
    start(box, "Try it: turn and stretch arrow B");
    var ns = "http://www.w3.org/2000/svg", S = 100;     // 100 px per unit
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "-165 -165 330 185");
    svg.setAttribute("class", "demo-plot");
    svg.setAttribute("role", "img");
    svg.innerHTML =
      '<line class="demo-axis" x1="-160" y1="0" x2="160" y2="0"/><line class="demo-axis" x1="0" y1="0" x2="0" y2="-160"/>' +
      '<text class="demo-label" x="160" y="16" text-anchor="end">about animals →</text>' +
      '<text class="demo-label" x="6" y="-150">↑ about money</text>' +
      '<line class="demo-a" x1="0" y1="0"/><circle class="demo-a-dot" r="4"/><text class="demo-label demo-a-name"></text>' +
      '<line class="demo-b" x1="0" y1="0"/><circle class="demo-b-dot" r="4"/><text class="demo-label demo-b-name">B</text>';
    box.appendChild(svg);
    function place(cls, v) {
      var x = v[0] * S, y = -v[1] * S;
      var line = svg.querySelector("line." + cls), dot = svg.querySelector("." + cls + "-dot");
      line.setAttribute("x2", x); line.setAttribute("y2", y);
      dot.setAttribute("cx", x); dot.setAttribute("cy", y);
      var t = svg.querySelector("." + cls + "-name");
      t.setAttribute("x", x + (x < 0 ? -8 : 8)); t.setAttribute("y", y - 6);
      t.setAttribute("text-anchor", x < 0 ? "end" : "start");
    }
    svg.querySelector(".demo-a-name").textContent = aName;
    place("demo-a", a);

    var dir = slider(box, { label: "B direction", min: 0, max: 180, step: 1, value: 14,
                            left: "0° · all animals", right: "180° · opposite" });
    var len = slider(box, { label: "B length", min: 0.2, max: 1.5, step: 0.1, value: 0.8,
                            left: "0.2 · short", right: "1.5 · long" });
    var math = add(box, "div", "demo-math");   // not <pre>: code.js would add Copy buttons
    add(box, "p", "demo-note", "Make B longer: dot grows, cosine stays the same. Turn B: cosine follows the angle " +
        "between the arrows (0° → 1, 90° → 0, 180° → -1).");
    function f(x) { return x.toFixed(2); }
    function update() {
      var deg = dir.value(), L = len.value(), r = deg * Math.PI / 180;
      var bv = [L * Math.cos(r), L * Math.sin(r)];
      dir.show(deg + "°"); len.show(L.toFixed(1));
      place("demo-b", bv);
      var dot = a[0] * bv[0] + a[1] * bv[1];
      var na = Math.sqrt(a[0] * a[0] + a[1] * a[1]), nb = Math.sqrt(bv[0] * bv[0] + bv[1] * bv[1]);
      var between = Math.abs(deg - aAngle);
      svg.setAttribute("aria-label", aName + " arrow and arrow B, " + between.toFixed(0) + " degrees apart");
      // Short lines (about 33 characters) so the box fits a phone without scrolling.
      var w = Math.max(6, aName.length), pad = function (t) { return (t + "          ").slice(0, w); };
      math.textContent =
        pad(aName) + " = [" + f(a[0]) + ", " + f(a[1]) + "]\n" +
        pad("B") + " = [" + f(bv[0]) + ", " + f(bv[1]) + "]\n" +
        pad("dot") + " = " + f(a[0]) + "×" + f(bv[0]) + " + " + f(a[1]) + "×" + f(bv[1]) + "\n" +
        pad("") + " = " + f(dot) + "\n" +
        pad("norm") + " = " + aName + " " + f(na) + ", B " + f(nb) + "\n" +
        pad("cosine") + " = " + f(dot) + " / (" + f(na) + " × " + f(nb) + ")\n" +
        pad("") + " = " + f(dot / (na * nb)) + "\n" +
        pad("angle") + " = " + between.toFixed(0) + "° apart";
    }
    dir.input.addEventListener("input", update);
    len.input.addEventListener("input", update);
    update();
  }

  var demos = { temperature: temperature, topk: topk, quant: quant, angle: angle };

  window.enhanceDemos = function (root) {
    (root || document).querySelectorAll("[data-demo]").forEach(function (box) {
      var make = demos[box.getAttribute("data-demo")];
      if (make && !box.classList.contains("demo-live")) { box.classList.add("demo", "demo-live"); make(box); }
    });
  };
  window.enhanceDemos(document);
})();
