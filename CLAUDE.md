# SudeeptaBiswas.github.io

Personal portfolio + blog. Plain HTML + CSS, served by GitHub Pages from `main`.

## Run
Open `index.html` in a browser. No build step, except project pages (below). Optional local server:
`python -m http.server 8000` then http://localhost:8000

## Change a project
Project pages are generated. Never hand-edit `projects/*.html`.
1. Edit `tools/projects_data.py` (markup: `**bold**`, `` `code` ``, `[text](url)`).
2. Run `python tools/build_projects.py` (stdlib only).
3. Open the changed pages and check them; commit data + pages together.
4. Added, renamed or removed a project? Also update the home page cards and the
   "See all N projects" count in `index.html`, and delete any page the script lists as STALE.

## Where things live
| What | Where |
|---|---|
| Plan, decisions, backlog | `PLAN.md` |
| Pages | `index.html`, `404.html`, `blog/`, `blog/topics/` (popup pages), `projects/` (index + one page per project) |
| Project content + generator | `tools/projects_data.py`, `tools/build_projects.py` |
| Styles / scripts | `assets/css/style.css`, `assets/js/theme.js` (dark mode), `assets/js/filter.js` (project filter), `assets/js/popup.js` (popup viewer for `blog/topics/` pages), `assets/js/code.js` (Copy / Download / Run buttons on code blocks), `assets/js/config.js` (site settings: which Run plugin), `assets/js/runners/` (Run plugins), `assets/js/toc.js` (left Contents / All projects panel and its height; header ☰ menu below 1100px; on phones every page's site links sit in the ☰ menu) |
| Fact sources | `PLAN.md` Section 2 (FACTS.md, master.md, Java CV) |

## Never break
- Every claim must trace to FACTS.md / master.md / Java CV, and obey FACTS.md "never claim" rules. No phone number.
- No client internals beyond what a CV shows (team names, server layouts, module names, security controls).
- Blog posts NEVER get a "study notes" box, label or tag (owner, 2026-11-10, decision 45). The Blog is a blog. Do not add one, do not recommend one. A blog post is not a work-experience claim. Study topics still stay off Home skills/experience.
- No client screenshots, client code or internal data.
- Header/footer are copied in every page (except `blog/topics/` popup pages, which have none): change all pages together. For `projects/`,
  edit `page()` in `tools/build_projects.py` and rerun (hand edits there are lost).
- `.nojekyll` stays (stops GitHub running Jekyll).

## Add a popup page (detail shown over a post)
1. New file `blog/topics/<slug>.html`: copy `blog/topics/bpe.html`. Content goes inside
   `<article class="article" data-popup-content>`; keep the "← post" link above it. No header, footer or panel.
2. In the post: link it with `<a href="topics/<slug>.html" data-popup>`, optionally as a sub-item
   under its section in the Contents panel, and add `<script src="../assets/js/popup.js"></script>`.
3. Test both ways: from disk (file://, the popup shows the page in a frame) and over http
   (`python -m http.server`, the content is copied in). Keep the `.solo-back` link and the head script
   from `bpe.html`: they hide the back link and set the theme inside the frame.

## Code blocks
Every post and topic page loads `assets/js/code.js`: each `<pre>` gets Copy + Download buttons.
- `data-file="name.py"` on the `<pre>` sets the download name (default `code.txt`).
- `data-run="python"` adds a Run button. Which one is a plugin, set in `assets/js/config.js`:
  `runner: "pyodide"` (default: runs in the reader's browser, output under the block),
  `"pythontutor"` (opens Python Tutor in a new tab) or `"off"`. Change the word, reload. Nothing else.
- Plugins live in `assets/js/runners/<name>.js` and register `window.CodeRunners.<name> = { attach(ctx) }`
  (`ctx`: `pre`, `wrap`, `bar`, `code()`, `icon()`, `button()`, `config`). `code.js` loads `config.js` and
  the named plugin only on pages with a runnable block.
- Only mark code that runs on its own (standard library or numpy), with no Ollama or files, and prints
  its result. Check it in the page with the Run button, and show the expected output under it.
- Comparison of runners (measured): `PLAN.md` Section 11.
