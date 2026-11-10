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
| Pages | `index.html`, `404.html`, `blog/`, `projects/` (index + one page per project) |
| Project content + generator | `tools/projects_data.py`, `tools/build_projects.py` |
| Styles / scripts | `assets/css/style.css`, `assets/js/theme.js` (dark mode), `assets/js/filter.js` (project filter), `assets/js/toc.js` (left Contents / All projects panel and its height; header ☰ menu below 1100px; on phones every page's site links sit in the ☰ menu) |
| Fact sources | `PLAN.md` Section 2 (FACTS.md, master.md, Java CV) |

## Never break
- Every claim must trace to FACTS.md / master.md / Java CV, and obey FACTS.md "never claim" rules. No phone number.
- No client internals beyond what a CV shows (team names, server layouts, module names, security controls).
- Blog posts NEVER get a "study notes" box, label or tag (owner, 2026-11-10, decision 45). The Blog is a blog. Do not add one, do not recommend one. A blog post is not a work-experience claim. Study topics still stay off Home skills/experience.
- No client screenshots, client code or internal data.
- Header/footer are copied in every page: change all pages together. For `projects/`,
  edit `page()` in `tools/build_projects.py` and rerun (hand edits there are lost).
- `.nojekyll` stays (stops GitHub running Jekyll).
