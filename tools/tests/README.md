# Browser tests

Node 22 scripts that drive headless Edge over CDP (no npm packages). Each prints
`PASS`/`FAIL` lines and `N passed, M failed`. Run every test both ways: over http
and from disk (file://), because the popup works differently in each.

## Start (Git Bash, from the site root)

```sh
python -m http.server 8765 &
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new \
  --remote-debugging-port=9333 --user-data-dir="$TEMP/edge-test" --allow-file-access-from-files about:blank &
H=http://127.0.0.1:8765/blog/
F="file:///$(pwd -W | sed 's#\\#/#g')/blog/"
OUT="$TEMP/shots"; mkdir -p "$OUT"     # screenshots go here, never in the repo
```

## Tests

| Script | Run | What it checks | Last result (2026-11-10, http / disk) |
|---|---|---|---|
| `popup_test.mjs` | `node popup_test.mjs $OUT $H` | popup opens, closes, theme, focus, links | 18/18, 18/18 |
| `code_test.mjs` | `node code_test.mjs $OUT $H` | Copy / Download buttons | 12/12, 9/9 |
| `runner_test.mjs` | `node runner_test.mjs $H` | Run plugins (needs internet: Pyodide) | 12/12, 10/10 |
| `topics_test.mjs` | `node topics_test.mjs $H $OUT` | popup pages: panel links, every Run output = shown output | 32/32, 32/32 |
| `demo_test.mjs` | `node demo_test.mjs $H $OUT` | sliders (demos.js): values, both themes, phone | 22/22, 22/22 |
| `edit_test.mjs` | `node edit_test.mjs $H $OUT` | editable Run blocks: real typing, Tab, Run, Ctrl+Enter, Esc, Download, Reset, popup, phone | 18/18, 11/11 |
| `toc_lines.mjs` | `node toc_lines.mjs ai-engineering-llm-fundamentals.html ...` | left-panel titles that wrap (blog pages, http only) | 0 wrap |
| `toc_lines_proj.mjs` | `node toc_lines_proj.mjs projects/index.html projects/fleetcheck.html ...` | left-panel titles that wrap (projects) | see PLAN.md |
| `tutor_test.mjs` | `node tutor_test.mjs $OUT` | Python Tutor runner (only if `runner: "pythontutor"`) | — |

For `$F` (disk) swap `$H` for `$F`. Stop Edge and the server when done.
