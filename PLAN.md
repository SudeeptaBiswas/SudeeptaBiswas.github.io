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

Why the change (decision 4): you want to learn React. React is a separate
learning project; v1 ships fast in plain HTML/CSS.

## 4. Site map (v1)
| Page | File | Holds |
|---|---|---|
| Home | `index.html` | Hero, key numbers, projects, skills matrix, experience, contact |
| Now | `now.html` | Working on + learning (study topics live here, not in skills) |
| Blog index | `blog/index.html` | Posts grouped by topic |
| Posts | `blog/<slug>.html` | One improved study note each |

## 5. Plan review — issues found
| # | Issue | Risk |
|---|---|---|
| R1 | Study notes contain interview prep and client-project notes (e.g. "where it fits RIMS") | Leaks client context, reads as prep, not articles |
| R2 | RabbitMQ / Kafka have no work experience behind them | Looks like a false claim |
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
| R2 | Every post has a "study notes, not production experience" box. Study topics only on Now page |
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
| design_patterns.md + design_patterns_tutorial.md | Java | todo (merge into one) |
| database_scaling.md | System design | todo |
| nosql_design.md | System design | todo |
| cloud_containers.md | Cloud | todo |
| aws_terraform_lab.md | Cloud | todo |
| claude_code.md | AI delivery | todo |
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
