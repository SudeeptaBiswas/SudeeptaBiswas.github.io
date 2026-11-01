# SudeeptaBiswas.github.io

Personal portfolio + blog. Plain HTML + CSS, served by GitHub Pages from `main`.

## Run
Open `index.html` in a browser. No build step. Optional local server:
`python -m http.server 8000` then http://localhost:8000

## Where things live
| What | Where |
|---|---|
| Plan, decisions, backlog | `PLAN.md` |
| Pages | `index.html`, `now.html`, `404.html`, `blog/`, `projects/` (index + one page per project) |
| Styles / scripts | `assets/css/style.css`, `assets/js/theme.js` (dark mode), `assets/js/filter.js` (project filter) |
| Fact sources | `PLAN.md` Section 2 (FACTS.md, master.md, Java CV) |

## Never break
- Every claim must trace to FACTS.md / master.md / Java CV, and obey FACTS.md "never claim" rules. No phone number.
- No client internals beyond what a CV shows (team names, server layouts, module names, security controls).
- Study topics never shown as work experience; posts keep the "study notes" box.
- No client screenshots, client code or internal data.
- Header/footer are copied in every page: change all pages together.
- `.nojekyll` stays (stops GitHub running Jekyll).
