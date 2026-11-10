"""Writes blog/topics/{softmax,quantization,cosine}.html from the .py files next to this script,
and puts each script's real output under its code. bpe.html is hand-written (its code: bpe.py here).
Usage: python tools/topics/make_pages.py   (site root defaults to two folders up)"""
import html
import pathlib
import subprocess
import sys

HERE = pathlib.Path(__file__).parent
SITE = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else HERE.parents[1]
POST = "ai-engineering-llm-fundamentals.html"


def code(name: str, runnable: bool = True) -> str:
    text = (HERE / name).read_text(encoding="utf-8").rstrip("\n")
    attrs = f' data-run="python" data-file="{name}"' if runnable else f' data-file="{name}"'
    return f"<pre{attrs}><code>{html.escape(text, quote=False)}</code></pre>"


def output(name: str) -> str:
    result = subprocess.run([sys.executable, "-I", str(HERE / name)], capture_output=True, text=True, check=True)
    return f"<pre><code>{html.escape(result.stdout.rstrip(), quote=False)}</code></pre>"


def page(slug: str, title: str, description: str, label: str, back_anchor: str, body: str, demos: bool = False) -> None:
    extra = '\n<script src="../../assets/js/demos.js"></script>' if demos else ""
    text = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} — Sudeepta Biswas</title>
  <meta name="description" content="{description}">
  <script>(function(){{var t,r=document.documentElement,m=location.hash.match(/theme=(dark|light)/);try{{t=localStorage.getItem("theme");}}catch(e){{}}if(m)t=m[1];if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";r.setAttribute("data-theme",t);if(window.self!==window.top)r.classList.add("in-frame");}})();</script>
  <link rel="canonical" href="https://sudeeptabiswas.github.io/blog/topics/{slug}.html">
  <link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../../assets/css/style.css">
</head>
<body>
<main id="main" class="page-solo">
  <p class="solo-back"><a href="../{POST}#{back_anchor}">← AI Engineering: LLM Fundamentals</a></p>
  <article class="article" data-popup-content>
    <p class="label">{label}</p>
    <h1>{title}</h1>
{body}
  </article>
</main>
<script src="../../assets/js/code.js"></script>{extra}
</body>
</html>
"""
    (SITE / "blog" / "topics" / f"{slug}.html").write_text(text, encoding="utf-8")
    print("wrote", slug)


page("softmax", "Softmax and temperature",
     "How a model's raw scores become odds, how temperature reshapes them, and how top_k, top_p and a seed shape the pick. Runnable Python.",
     "AI · Sampling", "logits", f"""
    <p class="lead">For every next token, the model gives each word in its vocabulary a raw score
    (a <b>logit</b>). <b>Softmax</b> turns those scores into odds that add up to 100%. Sampling then
    picks one token from those odds.</p>

    <h2>From scores to odds</h2>
    <pre><code>softmax(score_i) = e^score_i / (e^score_1 + e^score_2 + ...)</code></pre>
    <div class="table-wrap">
    <table>
      <thead><tr><th>Word</th><th>Score (logit)</th><th>e^score</th><th>Odds</th></tr></thead>
      <tbody>
        <tr><td>cat</td><td>2.0</td><td>7.39</td><td>7.39 / 11.76 = 63%</td></tr>
        <tr><td>mat</td><td>1.0</td><td>2.72</td><td>2.72 / 11.76 = 23%</td></tr>
        <tr><td>rat</td><td>0.5</td><td>1.65</td><td>1.65 / 11.76 = 14%</td></tr>
      </tbody>
    </table>
    </div>
    <p><code>e^x</code> makes every value positive and stretches the gaps: a score 1 point higher
    means about 2.7 times the odds.</p>

    <h2>Temperature</h2>
    <p>Temperature is one division, score ÷ T, right before softmax:</p>
    <div class="table-wrap">
    <table>
      <thead><tr><th>T</th><th>cat</th><th>mat</th><th>rat</th><th>Feels like</th></tr></thead>
      <tbody>
        <tr><td>0.2</td><td>0.99</td><td>0.01</td><td>0.00</td><td>almost greedy: safe, repeats</td></tr>
        <tr><td>1.0</td><td>0.63</td><td>0.23</td><td>0.14</td><td>the model's own odds</td></tr>
        <tr><td>2.0</td><td>0.48</td><td>0.29</td><td>0.23</td><td>flatter: rare words come up often</td></tr>
      </tbody>
    </table>
    </div>
    <div data-demo="temperature" data-words="cat,mat,rat" data-logits="2.0,1.0,0.5">
      <p>Interactive demo (needs JavaScript): a slider from T 0.2 to 3.0 that redraws the odds above.</p>
    </div>
    <p>T = 0 would divide by zero; Ollama treats it as greedy (always the top token). Measured with
    qwen3:1.7b, "Invent an unusual name for a pet cat", five calls: at T 0 it said Zephyrclaw five
    times; at T 0.6 it gave five different names.</p>

    <h2>top_k, top_p and the seed</h2>
    <ul>
      <li><b>top_k 2</b> keeps the 2 most likely tokens, then softmax runs again on them: cat 0.73, mat 0.27. Java/SQL view: <code>ORDER BY prob DESC LIMIT 2</code>.</li>
      <li><b>top_p 0.8</b> keeps the most likely tokens until they cover 80%: cat (0.63), then mat (0.86), stop.</li>
      <li>The <b>pick</b> is a weighted random choice, like a loot table. A <b>seed</b> makes it repeatable, like <code>new Random(42)</code> in a JUnit test.</li>
    </ul>
    <div data-demo="topk" data-words="cat,mat,rat" data-logits="2.0,1.0,0.5">
      <p>Interactive demo (needs JavaScript): sliders for top_k and top_p that show which words are kept.</p>
    </div>

    <h2>The code</h2>
    {code("softmax.py")}
    <p>Output:</p>
    {output("softmax.py")}
    <p>At T 1.0 the 10 picks are mostly cat, sometimes mat, once rat: close to the 63 / 23 / 14 odds.
    Run it again: the seed gives the same 10 picks.</p>

    <h2>Why it matters</h2>
    <ul>
      <li>JSON output, tool calls, an LLM judge: use T 0. One "creative" token breaks parsing.</li>
      <li>Answers too samey or too wild? Fix the prompt first. The prompt sets the scores; temperature only reshapes them.</li>
    </ul>""", demos=True)

page("quantization", "Quantization",
     "Why a 4-billion-weight model is 8 GB or 2.5 GB depending on bits per weight, what that does to RAM and speed, and a toy version in Python.",
     "AI · Models", "size", f"""
    <p class="lead">A model is billions of numbers (weights). <b>Quantization</b> stores each one in
    fewer bits: the file gets smaller and faster to run, and a little less precise. Java view:
    <code>double</code> vs <code>float</code> vs <code>short</code> vs <code>byte</code>.</p>

    <h2>The formula</h2>
    <pre><code>file size (GB) ≈ billions of weights × bits per weight ÷ 8</code></pre>
    <div class="table-wrap">
    <table>
      <thead><tr><th>Format</th><th>Bits per weight</th><th>qwen3:4b size</th><th>Quality</th></tr></thead>
      <tbody>
        <tr><td>FP16</td><td>16</td><td>8.0 GB</td><td>original</td></tr>
        <tr><td>Q8_0</td><td>8.5</td><td>4.2 GB</td><td>almost the same</td></tr>
        <tr><td>Q4_K_M</td><td>about 5</td><td>2.5 GB (measured)</td><td>small loss; Ollama's usual default</td></tr>
      </tbody>
    </table>
    </div>
    <p>Rule of thumb: a <b>bigger model at 4 bits usually beats a smaller model at 16</b>.</p>

    <h2>RAM: the file is not the whole story</h2>
    <p>While running, the model also needs memory for the text it is reading (the <b>KV cache</b>,
    which grows with the context window) and some overhead. Measured: the 2.5 GB file used
    <b>3.2 GB</b> in RAM, 28% more. So plan with <b>file size × 1.3</b>.</p>

    <h2>Speed</h2>
    <p>On a CPU, every new token reads all the weights from RAM once. A smaller file means less to
    read per token. Measured on a PC with no GPU:</p>
    <div class="table-wrap">
    <table>
      <thead><tr><th>Model</th><th>File</th><th>Writing speed</th></tr></thead>
      <tbody>
        <tr><td><code>qwen3:4b</code></td><td>2.5 GB</td><td>7.1 tokens/s</td></tr>
        <tr><td><code>qwen3:1.7b</code></td><td>1.4 GB</td><td>15.4 tokens/s</td></tr>
      </tbody>
    </table>
    </div>
    <p>About half the file, about twice the speed.</p>

    <h2>The code</h2>
    <p>The size formula, then a toy version of the idea: each weight is stored as a small whole
    number between the lowest and highest weight, and turned back into a decimal when used.</p>
    {code("quantization.py")}
    <p>Output:</p>
    {output("quantization.py")}
    <p>8 bits barely changes the weights; 2 bits moves one of them by 0.27. Real formats such as
    Q4_K_M work on small blocks of weights, each block with its own scale, so the error stays lower
    than in this toy.</p>
    <div data-demo="quant" data-weights="0.82,-0.41,0.07,-0.93,0.55,0.13" data-billions="4">
      <p>Interactive demo (needs JavaScript): a bits-per-weight slider that shows the file size and the toy weights.</p>
    </div>""", demos=True)

page("cosine", "Cosine similarity",
     "How embeddings are compared: dot product, length, and cosine, with a toy search in plain Python and in numpy.",
     "AI · Embeddings", "embeddings", f"""
    <p class="lead">An embedding turns a text into a list of numbers, a <b>vector</b>. Texts with
    similar meaning get vectors that point the same way. <b>Cosine similarity</b> measures how alike
    two directions are: 1 same, 0 unrelated, -1 opposite.</p>

    <h2>Arrows on a map</h2>
    <p>Real embeddings have 768 numbers. With two numbers, [about animals, about money], you can draw them:</p>
    <div class="table-wrap">
    <table>
      <thead><tr><th>Text</th><th>Vector</th><th>Points</th></tr></thead>
      <tbody>
        <tr><td>animal</td><td>[0.9, 0.1]</td><td>east</td></tr>
        <tr><td>kitten</td><td>[0.8, 0.2]</td><td>nearly the same way</td></tr>
        <tr><td>invoice</td><td>[0.1, 0.9]</td><td>north</td></tr>
      </tbody>
    </table>
    </div>

    <h2>The formula</h2>
    <pre><code>dot(a, b)    = a0*b0 + a1*b1 + ...                 (Java: a for loop)
norm(a)      = sqrt(dot(a, a))                     (arrow length, Pythagoras)
cosine(a, b) = dot(a, b) / (norm(a) * norm(b))</code></pre>
    <p><b>Why divide by the lengths?</b> A long note and a short note about the same thing point the
    same way but have different lengths. <code>dot</code> grows with length; cosine doesn't.</p>

    <h2>Step by step</h2>
    <p>Question "a small pet" = [0.7, 0.3], note "kitten" = [0.8, 0.2].</p>
    <ol>
      <li><b>dot</b>: multiply the numbers in the same position, then add.
        <code>0.7×0.8 + 0.3×0.2 = 0.56 + 0.06 = 0.62</code>.
        In Java: <code>for (int i = 0; i &lt; a.length; i++) sum += a[i] * b[i];</code>
        It is big when both arrows point the same way, but also when they are long.</li>
      <li><b>norm</b>: the length of one arrow, by Pythagoras: √(x² + y²).
        Question: <code>√(0.49 + 0.09) = √0.58 = 0.762</code>. Kitten: <code>√(0.64 + 0.04) = √0.68 = 0.825</code>.
        With 768 numbers it is the same: square all 768, add, take the square root.
        <code>sqrt(dot(a, a))</code> is that sum of squares, reused.</li>
      <li><b>cosine</b>: dot divided by both lengths, so only the direction is left.
        <code>0.62 / (0.762 × 0.825) = 0.62 / 0.629 = 0.99</code>.</li>
    </ol>
    <p>It is called cosine because the result is the cosine of the angle between the two arrows.
    The question points 23° up from "animals", kitten 14°: 9° apart, and cos 9° = 0.99.
    Same arrow direction gives 1 (0°), a right angle gives 0 (90°), opposite gives -1 (180°).</p>
    <div data-demo="angle" data-a="0.9,0.1" data-a-name="animal">
      <p>Interactive demo (needs JavaScript): turn and stretch an arrow and watch dot, norm and cosine change.</p>
    </div>

    <h2>The code</h2>
    {code("cosine.py")}
    <p>Output:</p>
    {output("cosine.py")}
    <p>Search is just this: score the question against every note, sort, keep the top k.</p>

    <h2>The same with numpy</h2>
    <p>numpy does the whole table in one line. This block loads numpy when you run it.</p>
    {code("cosine_numpy.py")}
    <p>Output:</p>
    <pre><code>kitten   0.99
animal   0.96
invoice  0.49</code></pre>

    <h2>Real scores</h2>
    <p>Measured with <code>nomic-embed-text</code> (768 numbers per text):</p>
    <div class="table-wrap">
    <table>
      <thead><tr><th>Pair</th><th>Cosine</th></tr></thead>
      <tbody>
        <tr><td>cat vs kitten</td><td>0.84</td></tr>
        <tr><td>I love this movie vs I hate this movie</td><td>0.69</td></tr>
        <tr><td>happy vs sad</td><td>0.66</td></tr>
        <tr><td>cat vs dog</td><td>0.60</td></tr>
        <tr><td>cat vs invoice</td><td>0.40</td></tr>
      </tbody>
    </table>
    </div>
    <ul>
      <li><b>Unrelated is about 0.3–0.45, not 0.</b> Compare scores with each other; never hard-code "0.5 = match".</li>
      <li><b>Love vs hate scores high:</b> embeddings measure what a text is about, not whether it is positive or true.</li>
      <li><b>Use the same model</b> for notes and question. Vectors from two models give nonsense scores, with no error.</li>
      <li>nomic's vectors already have length 1.0, so for them cosine equals dot.</li>
    </ul>""", demos=True)
