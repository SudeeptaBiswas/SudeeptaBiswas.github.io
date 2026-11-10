# Portfolio Plan — SudeeptaBiswas.github.io

Live URL (after first push): https://sudeeptabiswas.github.io

## 1. Goal
Java-focused portfolio. Show work in detail: job projects, personal projects,
different technologies, screenshots where allowed. Blog of improved study notes.

## 2. Source of facts
- Raw facts + "never claim" rules: `G:\Workspace\Projects\2026_career_transition\Code\career_transition\cv\FACTS.md`
- Master CV (full history): `...\career_transition\cv\master.md`
- Java CV: `G:\Workspace\Projects\2026_career_transition\Code\career_transition\cv\out\java\Sudeepta_Biswas_Senior_Java_Developer_CV.md`
- Study notes: `...\career_transition\prep\study\*.md`
- Rule: site text must match these sources. Update FACTS.md / the CV first, then the site.
- Rule (from TOPICS.md): studied topics are never shown as work experience.

## 3. Decisions log
| # | Decision | Date | Replaces |
|---|---|---|---|
| 1 | Client names OK (already on CV + LinkedIn) | 2026-10-31 | — |
| 2 | Contact: email + LinkedIn + GitHub. No phone | 2026-10-31 | — |
| 3 | Headline: "Java Tech Lead" (Java CV) | 2026-11-01 | 2026-10-31 "role not fixed" |
| 4 | Tech: plain HTML + CSS now; React version later | 2026-11-01 | Astro / React + Vite ideas |
| 5 | Style: clean light + dark mode toggle | 2026-11-01 | — |
| 6 | Blog: study notes, rewritten as proper articles, grouped by topic | 2026-11-01 | — |
| 7 | Extras: skills matrix, Now page, dark mode. No CV PDF for now | 2026-11-01 | — |
| 8 | Full detail for every project, all history back to 2011. No compressing | 2026-11-01 | short cards on home only |
| 9 | Projects: one detail page per project + Projects page with filter (type, tech) | 2026-11-01 | 2 card grids on home |
| 10 | Test coverage shown as 90–98% (FACTS: Shin-Etsu 90%, NTT trial + Food Navi 98%) | 2026-11-01 | "90%" |
| 11 | Reviews: fact-check vs FACTS.md, independent reviewer, UX + accessibility | 2026-11-01 | self-review only |
| 12 | Add personal project: AI Engineering Lab | 2026-11-01 | — |
| 13 | Fact source widened: `cv/FACTS.md` + `cv/master.md` (full history) | 2026-11-01 | Java CV only |
| 14 | Project cards expand inline ("Show details"); detail pages kept for direct links | 2026-11-01 | cards link out only |
| 15 | Now page: no talk about the portfolio itself; show AI Engineering Lab instead | 2026-11-01 | "React version next" line |
| 16 | Live at https://sudeeptabiswas.github.io (GitHub Pages, branch main, root) | 2026-11-01 | — |
| 17 | Keep GitHub link on the site. Owner confirmed 2026-11-01; FACTS.md line 185 ("GitHub private, never on CV") is a CV rule and needs updating there | 2026-11-01 | — |
| 18 | Home availability: "Open to remote work · 14+ years working across time zones with clients in Japan, Europe and the US" (Java CV clients) | 2026-11-02 | 2026-11-01 "full CET (Berlin) hours" — owner: too narrow |
| 19 | Project page generator lives in repo `tools/` | 2026-11-01 | one-off script in scratchpad |
| 20 | Headline: "Senior Java Engineer & Tech Lead — Java 21, Spring Boot, REST APIs, Modernization" (new Java CV headline; ad titles = Senior SE / Senior Java Developer) | 2026-11-02 | 3 "Java Tech Lead" |
| 21 | Posts + Blog page get a left "Contents" panel: sticky on wide screens (1100px+), highlights the section being read; closed box on small screens (`assets/js/toc.js`) | 2026-11-09 | Contents box inside the post only |
| 22 | Now page merged into Blog (`blog/`); `now.html` deleted, "Now" removed from nav | 2026-11-09 | Now page part of 7, and 15 |
| 23 | Blog page has 3 sections in this order: In Progress, Published, Planned | 2026-11-09 | One list of posts grouped by topic |
| 24 | Blog "Studying": Messaging card removed (both posts published); React moved to Planned. Cloud + System design cards removed (already in Planned). "Writing now" removed: its 2 posts moved to Planned. A Planned item gets a link only when its post is published | 2026-11-09 | 5 Studying cards from old Now page |
| 25 | Contents panel: "← Back" right-aligned on the Contents line (post → Blog, Blog → Home, project → Projects). Below 1100px (with JS) the panel moves into the sticky header as a ☰ button before the site name | 2026-11-09 | Closed box above content that scrolled away |
| 26 | Project pages get the same left panel: titles only (no dates), 2 groups Work then Personal, each newest first by start date (year-only dates sort after dated ones of that year; ties keep data order). Prev/next links follow the same order | 2026-11-09 | Prev/next in data order, no list |
| 27 | Blog Studying: add card "CI/CD with Jenkins and Docker" (repo `jenkins_docker_cicd`, private: GitHub 404 on 2026-11-09, so no link). Details later | 2026-11-09 | 1 Studying card |
| 28 | Blog In Progress: date, Work list and "Studying" heading removed (Work items already have project pages). Kept: one line "Things I'm learning now. I don't list them as work experience." + study cards | 2026-11-10 | Date + Work list + Studying heading |
| 29 | Project panel groups Work / Personal collapse and expand; the current page's group starts open | 2026-11-10 | Both groups always shown |
| 30 | Blog intro is generic, so it needn't change when topics change: "Notes from what I'm learning, written as articles." Smaller gap below it | 2026-11-10 | Intro listing current topics |
| 31 | Wide screens: panel and page title start 20px under the header (was 40px), the same place the panel sticks, so it no longer jumps on scroll. Panel height capped so the footer never pushes it under the header (was happening on project pages) | 2026-11-10 | 40px top gap, panel jumped 20px; slid under header at page end |
| 32 | Blog In Progress: "not work experience" line removed. Owner: the Blog is a blog, not a work list. Rule still met: each post keeps its "study notes" box, and study topics stay off Home skills/experience | 2026-11-10 | 28 (one note line kept) |
| 33 | Phones (600px and less, pages with the panel): site links move into the ☰ menu, above Contents. Header is 1 row, 53px (was 2 rows, 82px, at 375px) | 2026-11-10 | 2-row sticky header |
| 34 | Panel height measured in toc.js, not fixed CSS numbers: list fills the free space (window bottom, or end of the content column if sooner). Thin scrollbar. At 800px window: 699px mid-page (was 580px) | 2026-11-10 | 31's fixed caps (100vh minus 140px / 210px) |
| 35 | Panel height changes only on resize, never on scroll (scroll-time resizing made it flicker and get pushed by the footer). Height = window minus header, footer and two 20px gaps; 20px above the footer, same as under the header | 2026-11-10 | 34's scroll-time resizing |
| 36 | Phones: every page gets the 1-row header with a ☰ menu (home, projects list and 404 too; site links only there) | 2026-11-10 | 33 (pages with the panel only) |
| 37 | CI/CD card: new text "Jenkins + Docker Compose pipeline: 4 environments, blue/green backend, promotion by image digest, rollback." Repo stays private but is linked, marked "(private)": owner wants the link, visitors get GitHub 404 | 2026-11-10 | 27 (no link, "details coming") |
| 38 | Post `blog/jenkins-docker-cicd.html` published (study notes, sample repo, no client named). Card stays in In Progress with a link to it, because the repo is still being worked on; post also listed under Published, label CI/CD. Review-lessons section dropped (owner: no) | 2026-11-10 | — |
| 39 | Private repo link: "(private)" / "(private for now)" → "(request access)", a mailto to the site's contact email with a subject. GitHub has no access-request button for private repos | 2026-11-10 | 37's "(private)" label |
| 40 | CI/CD post: no "Study notes" label or box (owner). Label "CI/CD"; repo line kept under the lead. No client named; not labelled "From work" either (FACTS: client Jenkins configured by DevOps team). CLAUDE.md rule narrowed to study posts | 2026-11-10 | 38 (study notes box) |
| 41 | CI/CD post date: 10 September 2026 (owner) | 2026-11-10 | 10 November 2026 |
| 42 | Blog In Progress: CI/CD card removed (post is under Published; same as decision 24). Published line: "Jenkins + Docker Compose: 4 environments, blue/green backend, promotion by image digest, rollback and backups." Repo link now only in the post. AI Engineering card alone now spans the full width | 2026-11-10 | 37, 38 (card kept with post link) |
| 43 | Blog: In Progress grid gets `.grid.fill` (auto-fill), so a lone card keeps half width on wide screens (full width on phones). Published list: no tag after the date ("Study notes", "CI/CD" dropped; posts keep their study box). Dates: Kafka 20 September 2026, RabbitMQ 5 October 2026. Published sorted newest first: Messaging (RabbitMQ, Kafka) then CI/CD | 2026-11-10 | 42 full-width card; 1 November 2026 dates; CI/CD group first |
| 44 | Blog In Progress: 2 cards, AI Engineering and Python for Java Developers, each linking an in-progress post (`ai-engineering-llm-fundamentals.html`, `python-for-java-developers.html`) built from the lab's `docs/review/`. Not under Published (owner: in progress, more later). Study box kept. Meta says "Started <date> · In progress"; dates = first topic done (2 Nov / 5 Nov 2026). Numbers are the lab's own measurements | 2026-11-10 | 42-43 (1 card, project link only) |
| 45 | Blog: NO "study notes" box, label or tag on any post or list (owner: "this is blog"). Removed from the 2 lab posts and the Planned list. CLAUDE.md rule rewritten. Kafka + RabbitMQ boxes removed too (owner: a blog is not work experience) | 2026-11-10 | 38, 43, 44 (study box kept) |
| 46 | Lab posts rebuilt from all 14 LESSON md files (not only docs/review): Python 12 sections (setup, syntax, collections, classes, modules, exceptions, files+JSON, HTTP, pytest, quiz, next, links); AI 14 sections (adds Ollama commands, quantization, speed, thinking, streaming, sampling tables, embeddings search). Lesson 2.6 left out (owner: not now). Growth plan: Section 10 (proposed) | 2026-11-10 | 44 (review docs only) |
| 47 | Popup viewer: `assets/js/popup.js` opens a `blog/topics/` page's `[data-popup-content]` in a `<dialog>` over the post (Esc, ×, click outside close; focus returns; "Open as a page" link). Topic pages are plain (no header/footer/panel) and work on their own. First one: BPE, linked from AI post section 2 and as a sub-item under "2. Tokens" in the panel. Rejected: iframe (own scroll + theme), full pages with panel (owner: not needed) | 2026-11-10 | — |
| 48 | Popup from disk: file:// blocks fetch, so popup.js shows the page in a frame inside the dialog (theme passed as `#theme=`, back link hidden when framed); http still copies the content in. Panel sub-item renamed "BPE" (owner: no "step by step"). 18/18 browser checks pass from disk and over http | 2026-11-10 | 47 (file:// fell back to opening the page) |
| 49 | Code blocks: Copy + Download buttons top-right of every `<pre>` (`assets/js/code.js`, all 5 posts + topic pages; popup calls `window.enhanceCode`). `data-run="python"` adds Run → Python Tutor 3.11 (`py=311`; `py=3` = 3.6 broke on `list[str]`). BPE page: title "Byte Pair Encoding (BPE)" (owner), in-post link "See how BPE works", code rewritten without `Counter` (Python Tutor failed on `most_common`); same output locally and in Python Tutor. Tests: 12/12 code (http), 9/9 (disk), 18/18 popup each | 2026-11-10 | — |
| 50 | Run button is a plugin chosen in `assets/js/config.js` (`runner`: "pyodide" default, "pythontutor", "off"). Plugins in `assets/js/runners/`; code.js loads config + the named plugin only where `data-run` blocks exist. Pyodide 314.0.7 from jsDelivr: output under the block, fresh names per run, errors as a traceback, imports (numpy) load by themselves. Reason: Section 11 analysis. Tests: 12/12 runner (http), 10/10 (disk); code 12/12 + 9/9, popup 18/18 + 18/18 | 2026-11-10 | 49 (Python Tutor hard-coded) |
| 51 | Left panel titles short, one line (owner). 14 wrapped at 1400px (measured); shortened in the panel only, headings unchanged: e.g. "Context window and memory" → "Context and memory", "Rollback and the configuration trap" → "Rollback". After: 0 wrap on all 6 blog pages. Rule added to CLAUDE.md | 2026-11-10 | — |
| 52 | 3 more popup pages from lessons 2.1, 2.2, 2.4, 2.5: Softmax and temperature, Quantization, Cosine similarity. Each linked in its section and as a panel sub-item (one line). Every Run block checked in the page: output = the shown output (softmax, quantization, cosine, cosine with numpy). Pyodide plugin hides its "Loading numpy" notes from the output. Tests: topics 11/11 (http + disk); runner, popup, code suites still pass | 2026-11-10 | — |
| 53 | AI Engineering Lab project page updated from the lab's STATUS/PROGRESS/DECISIONS (9 Nov 2026): stats 12 of 68 topics, ~9% of ~200 h, 10 phases (was "10 projects planned": the lab moved to one growing app). New sections "Done so far" (links to both posts) and "How it is built". Stack adds uv, pytest (in use first). Rebuilt: only this page + projects/index.html change in content | 2026-11-10 | "Just started" status |
| 54 | Interactive temperature slider on the Softmax popup page (owner asked, 10 Nov 2026). `assets/js/demos.js`: `<div data-demo="temperature" data-words data-logits>`, slider T 0.2 to 3.0, bars = softmax(score / T). Uses the page's own cat/mat/rat 2.0/1.0/0.5 (T 1.0 = 62.9 / 23.1 / 14.0%). Popup copies content without running scripts, so popup.js calls `enhanceDemos` and the post loads demos.js. Text without JS kept inside the div. Tested http + disk, light + dark, phone 390px. |
| 55 | Three more sliders (owner: "1 yes", 10 Nov 2026) in `demos.js`: top_k/top_p (Softmax page; top_k first, then top_p on what is left, as Ollama), bits per weight (Quantization: file/RAM size + toy weights, same codes and worst error as `quantization.py`), arrow angle and length (Cosine: live dot, norm, cosine). Cosine page also got a "Step by step" section: dot, norm, cosine worked out for question [0.7, 0.3] vs kitten [0.8, 0.2] (owner asked if the terms were covered: before, only the formula and "why divide by lengths"). `tools/tests/demo_test.mjs` 22/22 http + 22/22 disk. |
| 56 | Projects panel: optional `short=` per project, used only in the left panel (full title as hover tip). 13 set: AI Requirements Docs, RIMS Migration, Release Management, PLM Platform (V6), ENOVIA PLM (V5), Omron Testing, ShopBook Migration, HRMS, Food Navi, NTT Data Trial, SMS VAS, DB Copy Tool, FleetCheck. Measured at 1400px: 0 of 19 pages wrap (was 13 titles). Owner: "yes, need to check" the names. |
| 57 | Owner OK'd popup candidates 1–4 (10 Nov 2026). New pages from lessons 1.2–1.5 and 2.3: Python traps for Java developers (5 traps), Exceptions: try, except, else, finally, Dataclasses vs Java records (Python post); Reading a streamed reply (NDJSON) (AI post, sample lines, no Ollama). 14 runnable blocks, each output = real CPython output and = Pyodide output (`topics_test.mjs` 32/32 http + disk). Generator takes the post per page (`post=PY`). Links inside a popup to another popup work (http: same dialog; disk: inside the frame). Demo bars also got one colour per row (owner asked). |
| 58 | Runnable blocks are editable in place (owner OK, 10 Nov 2026): `contenteditable="plaintext-only"` on the block's code, added only when a Run plugin attaches. Run, Copy and Download use the edited code; Reset (shows once edited) restores; nothing is saved. Keys: Tab = 4 spaces, Ctrl/Cmd+Enter = Run, Esc = leave (in the popup the first Esc leaves the editor, the second closes the popup). Old browsers without plaintext-only keep read-only blocks. `edit_test.mjs` 18/18 http, 11/11 disk. Fixes the Python traps lead ("change it and run it again"), which was not true before. |
| 59 | Commit rules changed (owner, 10 Nov 2026). Was: one concern per commit, which gave many small commits plus a "push done up to <hash>" commit right after a push. Now: one commit per feature, with code, tests, docs and Section 13 together, so every pushed commit holds the full state for the other PC. No commits that only record a push or a hash; the one made was undone before it was pushed. Written in `CLAUDE.md` ("Start and finish work") and the owner's global rules. |
| 60 | Lesson coverage check (owner asked, 10 Nov 2026): all 13 lab lessons vs the two posts. Gaps filled: 1.7 Ollama HTTP endpoints (AI post section 5), 1.9 fixture example + `capsys` + `pythonpath` (Python post section 9), 2.1 "new Python" idioms table (Python post section 3), 2.2 `ollama show` output + `--verbose` (AI post section 5). 1.1 trivia (VS Code interpreter, `uv tree`) left out. Lesson 2.6 (assistant v1, owner: "prepare the document") added as AI post section 12 "A chatbot with memory" from LESSON_2_6 measured numbers only (lab code not solved yet, so no test results claimed), plus runnable popup "Generators: yield". Bug fixed: Streaming and Exceptions popups used `localhost:11434`; lesson 1.7 measured 2.16 s vs 0.02 s for `127.0.0.1`, so now `127.0.0.1`. |

Why the change (decision 4): you want to learn React. React is a separate
learning project; v1 ships fast in plain HTML/CSS.

## 4. Site map (v1)
| Page | File | Holds |
|---|---|---|
| Home | `index.html` | Hero, key numbers, projects, skills matrix, experience, contact |
| Blog | `blog/index.html` | In Progress (study cards) · Published · Planned. Study topics live here, not in skills |
| Posts | `blog/<slug>.html` | One improved study note each |

## 5. Plan review — issues found
| # | Issue | Risk |
|---|---|---|
| R1 | Study notes contain interview prep and client-project notes (e.g. "where it fits RIMS") | Leaks client context, reads as prep, not articles |
| R2 | RabbitMQ / Kafka have no work experience behind them | Looks like a false claim. SUPERSEDED by decision 45: a blog is not work experience, no box needed |
| R3 | Notes use Mermaid diagrams | Needs a JS library; not plain HTML/CSS |
| R4 | Client systems: no screenshots allowed | Projects look empty |
| R5 | avocabulary + pc_organizer repos are private | Dead links |
| R6 | Skills "years" could be guessed | Wrong facts on a public site |
| R7 | Header/footer copied in every page (no build step) | Easy to get out of sync |
| R8 | Dark mode flash on page load | Looks broken |

## 6. Improvements applied
| Issue | Fix |
|---|---|
| R1 | Posts rewritten: intro, when to use, diagram, code, pitfalls, "check yourself", official links. Client names removed; generic example instead. Interview Q&A turned into click-to-open questions |
| R2 | Was: "study notes" box on every post. Replaced by decision 45 (no box) |
| R3 | Diagrams redrawn as inline SVG, colors follow light/dark theme |
| R4 | Work projects use Problem → What I did → Result cards. Diagrams later |
| R5 | No repo link; "Private repo · screenshots coming" |
| R6 | Year ranges taken only from CV job dates; column "Where" shows the source |
| R7 | Few pages for now; React version will fix this with shared components |
| R8 | Small script in `<head>` sets theme before paint |

## 6b. Review round 2 — 2026-11-01
Three passes: my fact-check vs FACTS.md, an independent reviewer (fresh agent,
36 findings: 3 High, 17 Medium, 16 Low), UX checks (links, screenshots, filter click test).

Fixed:
- High: CSM now "renewal in progress"; Ericsson team names, SIT/UAT server layout and app list removed; Java row no longer says "every project".
- Fact: Ericsson shown as peer (not team lead); RIMS Jenkins/SonarQube credited to DevOps team; "in-house product" label removed; FleetCheck credits Claude Code drafting; PC Organizer = 3 modules, USB-folder sync; Terraform = local demo, no AWS; ~100 SIT/UAT; "from scratch" limited to the right items; Spring years 2017–2026; deploy automation and 50% stated as separate facts; hero says "every AI change needs human approval".
- Confidentiality: RIMS module names, host-ID launcher and per-phase CVE counts removed.
- Hiring view: RIMS first; Valmet V6 featured instead of ELK; 105-screens stat instead of SRS %; note explaining BJIT's 4-in-1 role.
- UX: underlined links in text, scroll offset under sticky header, reduced-motion, stronger chip/toggle borders, SVG diagrams scroll on phones, favicon, canonical + og tags, 404 page.
- Blog: RabbitMQ example moved to a neutral online-shop domain; Kafka `replicas(1)` note; blog meta fixed.

Not done (open):
- No public Java code yet (reviewer item 11) — queue.
- Next blog post should be real work (optimistic locking, CVE fixes, ADLC) — queue.
- og:image preview card — needs an image.
- Early-career timeline not folded: kept full per decision 8.

Project pages are generated: edit `tools/projects_data.py`, run
`python tools/build_projects.py` (see CLAUDE.md).

## 6c. Review round 3 — UI of left panel + Blog page (2026-11-09)
Independent agent, headless Edge at 1400 / 1200x600 / 900 / 500 px, light + dark.
Works (tested): highlight on scroll, click and at bottom; closed on small screens, tap opens, link tap closes; dark mode.

| # | Sev | Where | Problem | Fix |
|---|---|---|---|---|
| U1 | High | style.css (wide summary rules), toc.js | Wide: Enter/Space on "Contents" closes the panel; mouse can't reopen it | JS blocks the toggle when wide + `tabindex=-1`; drop pointer-events rule |
| U2 | High | style.css | Wide + no JS: panel shows only "Contents", can't open | Wide-only summary rules behind `html.js` class (or U1 fix) |
| U3 | Med | style.css `.page-layout` | Layout 1060px vs header 960px: edges don't line up | Columns `200px minmax(0,720px)`, gap 40 = 960 |
| U4 | Med | blog/index.html | Heading levels flat: cards + post titles are h3 under h3 | Inner titles → h4 |
| U5 | Med | blog/index.html | Published posts not visible on first screen | Conflicts with decision 23 (owner order) — owner to decide |
| U6 | Low | toc.js | After tap on small screens, focus drops to body | Focus target heading (`tabindex=-1`) |
| U7 | Low | style.css `.toc a.active` | Highlight mostly bold; colour close to link colour | 3px accent bar; `aria-current="location"` |
| U8 | Low | blog/index.html | Inline `style="margin-top:28px"` | Use a class |
| U9 | Low | posts, 600px and below | Header not sticky, no way back to Contents | "Back to contents" link at end of post |
| U10 | Low | blog/index.html | Wide: h1 ~30px lower than panel top | First section 40px top padding |

Not checked: real phones under 496px, Safari/Firefox, real screen reader, touch scrolling.

Fixed 2026-11-09 (retest: 24/24 browser checks pass, 0 broken links): U1–U4, U6–U10. U2 solved by U1 (wide rules only apply when JS adds `.pinned`).
U3: header content is 920px (960 minus padding), so columns are 200 + 40 + 680. U7: soft background on the active link instead of a bar (the bar overlapped the numbers).
U5: kept as is, owner keeps decision 23 order; revisit next.

## 6d. Review round 4 — all changes vs owner feedback (2026-11-10)
Independent agent checked all 25 pages against the 11 feedback items: 9 met, 2 partly (fixed below).

| # | Type | Finding | Done |
|---|---|---|---|
| R1 | Bug | Tab past the last menu link left the menu open over the page | Menu closes when focus leaves it |
| R2 | Improvement | Home, projects list, 404: 2-row phone header | ☰ menu with site links on every page (decision 36) |
| R3 | Bug | Blog cards h4 directly under h2 | Cards are h3 |
| R4 | Feedback | Post first line 12px lower than the panel top | Aligned (0px) |
| R5 | Improvement | Current project centred in list, hid the "Work" label | Scrolls only if out of view, only as far as needed |
| R6 | Bug | No JS: opened project panel went under the header at page end | CSS fallback height |
| R7 | Improvement | Wide label looks like a button but does nothing | `aria-disabled` |
| R9 | Dead code | `.sub`, h4 rules, `position: static`, fallback calc, 2 split media blocks, 60/61px fallbacks, fixed 120px threshold | Removed / merged / tied to header height |
| R10 | Improvement | Print showed "Back to contents" | Hidden in print |
| R11 | Text | "AI engineering" not Title Case | "AI Engineering" |
| R13 | Bug | 404 footer had no Blog link | Added |
| R8 | Improvement | 900px: content starts 43px right of header edge | Not done: wider text column = long lines |
| R12 | Consistency | Projects list page has no left panel | Not done: it has its own filter; the list is the page |

Retest: 26/26 new checks, 46/46 blog/menu, 11/11 groups, phone checks, panel never moves, 0 broken links.

## 7. Implementation status
- [x] Phase 1 — Home, Now, blog index, 2 posts (Kafka, RabbitMQ), CSS, dark mode
- [x] Phase 1b — Projects page with filter + 19 detail pages; review round 2 fixes
- [ ] Phase 2 — More posts (backlog below), one at a time
- [ ] Phase 3 — Screenshots: PC Organizer, avocabulary; diagrams for work projects
- [ ] Phase 4 — Polish: link preview image (og:image), favicon, 404 page
- [ ] Phase 5 — React version (learning project)

## 8. Blog backlog (from prep/study)
| Note | Topic group | Post status |
|---|---|---|
| kafka.md | Messaging | done |
| rabbitmq.md | Messaging | done |
| repo `jenkins_docker_cicd` (docs/) | CI/CD | done |
| design_patterns.md + design_patterns_tutorial.md | Java | todo (merge into one) |
| database_scaling.md | System design | todo |
| nosql_design.md | System design | todo |
| cloud_containers.md | Cloud | todo |
| aws_terraform_lab.md | Cloud | todo |
| claude_code.md | AI delivery | todo |
| ai_engineering_lab docs/review (phase 01, 02) | Python, AI | in progress (2 posts) |
| plm_3dexperience.md | PLM | todo (check client details first) |
| interview_questions.md | — | skip (prep only) |

## 9. Other ideas
- LinkedIn: add the site under "Featured" and "Contact info → Website".
- GitHub profile README (repo `SudeeptaBiswas/SudeeptaBiswas`) linking to the site.
- Pin `fleetcheck_quarterly_pick` on GitHub; add a short README screenshot.
- Make PC Organizer public (after a secrets check) so the card can link to code.
- Sample documents section later: release plan, SRS template, API spec (no client data).
- Custom domain (e.g. sudeeptabiswas.dev): small yearly cost, optional.
- RSS feed for the blog once there are 5+ posts.

## 10. AI Engineering Lab posts: growth plan (proposed 2026-11-10, owner to confirm)
The lab has 10 phases, 68 topics. One post per card would grow past 3,000 lines.

| Rule | Detail |
|---|---|
| One post per lab phase | `ai-engineering-<phase>.html`: 02 LLM Fundamentals (now), 03 Prompting + Tool Calling, 04 RAG, 05 Evals, 06 Agents, 07 MCP, 08 Serve + Ship, 09 Java Bridge, 10 Capstone |
| Python stays one post | Phase 01 only; 1.6 pydantic + 1.8 async are added there when done |
| Split a big phase | Over ~15 sections or ~600 lines → part 1 / part 2 (likely 04 RAG: 4.1–4.6 basics, 4.7–4.11 advanced; 06 Agents: by hand, then LangGraph) |
| Series links | Each AI post gets "Part N of the series" + prev/next links; the AI card lists the parts |
| When to update | A lab topic is done + its review section exists → add one section to the post (source: LESSON md + review) |
| Every post keeps | big-picture diagram, Java mapping, measured numbers with the PC named, Check yourself, Coming next, links |
| In progress → Published | A phase post moves to Published when its lab phase is 100% done |

## 11. Run button: which online runner (analysis 2026-11-10, owner to decide)
Measured on 10284Sudee: headless Edge, cache off, the BPE code (stdlib), then `numpy`. Each option was
tested from disk (file://) and over http. "MB" = bytes the page downloaded (first run; the browser caches after).

| Option | From disk | Over http | Correct output | numpy | First run | Download | Code leaves the PC | Ads |
|---|---|---|---|---|---|---|---|---|
| **Pyodide 314.0.7** (CPython in the browser, from jsDelivr) | yes | yes | yes | yes (+1.9–2.0 s) | 4.6 s start, 5 ms run | 8.8 MB | no | no |
| Python Tutor (link, new tab) | yes | yes | yes, after removing `Counter.most_common` | **no**: "Only these modules can be imported" (no numpy, no dataclasses, no pathlib) | site load ~6 s | 0 MB on our side | yes (runs on their server) | **yes** |
| Codapi 0.12 + WASI Python 3.12 | yes | yes | yes | **no**: `ModuleNotFoundError: numpy` | 7.9–10.9 s | 11.3 MB | no | no |
| PyScript 2026.7.3 `py-editor` (Pyodide) | **no** (nothing ran in 120 s) | yes | yes | yes (docs) | 5.2 s | not measured (runs in a worker) | no | no |
| PyScript `mpy-editor` (MicroPython) | **no** | yes | **NO**: merge 2 gave `('h', 'e')`, not `('t', 'h')` (MicroPython breaks `max` ties differently) | not checked | 0.5 s | 0.2 MB | no | no |

Docs read: [Pyodide](https://pyodide.org/en/stable/usage/downloading-and-deploying.html),
[PyScript editor](https://docs.pyscript.net/2026.7.3/user-guide/editor/),
[Codapi in-browser](https://antonz.org/in-browser-code-playgrounds/), [Python Tutor](https://pythontutor.com/).

Chosen (decision 50): **Pyodide**, loaded only when the reader clicks Run, output shown under the code
block on the page. The only option that is real CPython, works from disk and online, runs numpy
(needed from lab phase 04), shows no ads and keeps the code in the reader's browser. Cost: 8.8 MB
and ~5 s on the first Run per visit. Python Tutor could stay as a second "step through" link for
stdlib-only code (its visualiser is good for learning), but it has ads and a short module list.
Not possible anywhere: code that calls a local Ollama (most lab code). Those blocks get Copy/Download only.

Pyodide caching (measured, same browser profile, cache on): jsDelivr sends `Cache-Control: public, max-age=31536000`
(1 year) on `pyodide.js`, `pyodide.asm.wasm`, `python_stdlib.zip`, `pyodide-lock.json`.

| Visit | Downloaded | Python start | BPE run | numpy load |
|---|---|---|---|---|
| 1st | 8.76 MB | 6.3 s | 6 ms | 4.1 s |
| 2nd (reload) | 0.00 MB | 2.6 s | 8 ms | 1.4 s |
| 3rd (reload) | 0.00 MB | 2.6 s | 7 ms | 1.8 s |

The start time on a repeat visit is the browser preparing Python, not a download. Inside one page,
Python stays loaded after the first Run, so later Runs take milliseconds.

## 12. More popup pages: candidates (2026-11-10, owner to pick)
Done: BPE, Softmax and temperature, Quantization, Cosine similarity, Reading a streamed reply (AI post); Python traps, Exceptions, Dataclasses (Python post). Candidates 1–4 below are done (decision 57).
"Runnable" = can get a Run button (standard library or numpy, no Ollama).

| # | Page | Post, section | Source lesson | Runnable | Why |
|---|---|---|---|---|---|
| 1 | Python traps for Java developers: `/` vs `//`, `==` vs `is`, truthy values, mutable default, `zip` stopping short | Python, 2-3 | 1.2, 1.3, 2.5 | yes | Short demos a Java reader can break and rerun |
| 2 | Exceptions: try / except / else / finally, `raise ... from` | Python, 6 | 1.5 | yes | Shows `__cause__` and the order of blocks live |
| 3 | Dataclasses vs Java records | Python, 4 | 1.4 | yes | `@dataclass`, `frozen=True`, `field(default_factory=list)` side by side with Java |
| 4 | Streaming: reading NDJSON lines | AI, 9 | 2.3 | yes (sample lines, no Ollama) | Parse the stream the way the chat code does |
| 5 | Comprehensions and slicing | Python, 3 | 1.3 | yes | Stream → comprehension, with output |
| 6 | Thinking models | AI, 8 | 2.2, 2.3 | no | Measured tables only; less to gain |
| 7 | pytest fakes with monkeypatch | Python, 9 | 1.9 | not checked (needs pytest in Pyodide) | Strong topic; Run support unknown |
| 8 | Chat memory and trimming the history | AI, 3 | 2.6 | yes | Wait: owner said 2.6 not now |
| 9 | Kafka partitions + consumer groups; RabbitMQ exchange routing | Kafka, RabbitMQ | (study notes) | toy only | Diagrams more than code |

Next, if wanted: 5 (comprehensions and slicing), 7 (pytest, Run support not checked), 8 (when 2.6 is allowed).

Projects panel (left panel on project pages): done, decision 56 (`short=` names, 0 of 19 wrap).

## 13. Where we stopped (handoff, updated 2026-11-10)
Read this first in a new session (on either PC: `git pull` first), then `CLAUDE.md` and decisions 37–60 in Section 3.
Updated inside every feature commit, so the pushed repo always holds the current state. No push status or commit hashes here: `git log` has them.

**Done in the 2026-11-10 session** (details in the decisions):
- CI/CD (Jenkins + Docker) post; Blog page order, dates, cards (37–44).
- No "study notes" box on any blog post (45; also in `CLAUDE.md` and owner memory).
- AI and Python In Progress posts from the 14 lab lessons (46–47).
- Popup viewer + BPE page (48); Copy / Download / Run on code blocks; Run plugins, Pyodide default (49–50).
- One-line left-panel titles on blog posts (51) and project pages (56).
- Popup pages Softmax, Quantization, Cosine (52); AI Engineering Lab project page (53).
- Sliders: temperature (54), top_k/top_p, bits per weight, cosine angle; cosine step by step (55).
- Generator and browser tests saved in `tools/topics/` and `tools/tests/` (were only in a temp folder).
- Demo bars one colour per row; popup pages Python traps, Exceptions, Dataclasses, Streaming (57).
- Runnable blocks editable in place, with Reset (58).
- Commit rules: one commit per feature, handoff in each (59).
- All 13 lab lessons covered; 2.6 chatbot section + Generators popup; `127.0.0.1` fix (60).
  When the owner finishes lab 2.6 (tests pass), add the real results to AI post section 12.

**Open: owner to answer**
1. Check the 13 short project names (decision 56). Change any in `tools/projects_data.py`, rerun the build.
2. Popup pages 1–4 done (57). More from Section 12 only if the owner asks.
3. AI posts growth plan, Section 10: owner said "we will check later".
4. Make every code sample runnable where possible? Not answered.
5. A Claude Doc about the CI/CD post was made on claude.ai by mistake: keep or delete? Not answered.
6. `jenkins_docker_cicd` repo (private, `D:\Workspace\2026_lab_portfolio\Code\jenkins_docker_cicd`):
   review with 10 findings saved there as `docs/review-2026-11-10.md` (not committed). Only #1 checked:
   rollback of the frontend never passes `--force`. Fix it? Not answered. Never add the client's name to that repo.

**How to work here**
- Popup pages: edit `tools/topics/make_pages.py` or the `.py` files there, run it; output under each code block is real.
- Tests: `tools/tests/README.md` (headless Edge + local server; run http and disk).
- Python on 10284Sudee: `C:\Users\BJIT\AppData\Local\Programs\Python\Python314\python.exe` (no numpy; do not install).
- Python on BISWAS: `C:\apps\python-3.13.14-embed-amd64\python.exe` (no pip). Node and Edge there, for `tools/tests`: not checked.
