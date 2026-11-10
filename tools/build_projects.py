"""Writes projects/index.html + one page per project from projects_data.py.

Run from anywhere: python tools/build_projects.py
"""
import html, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.dont_write_bytecode = True
from projects_data import FILTERS, GROUPS, PROJECTS

OUT = os.path.join(os.path.dirname(HERE), "projects")
os.makedirs(OUT, exist_ok=True)

# Catch data typos before writing anything.
REQUIRED = ("slug", "group", "kind", "filters", "title", "org", "role", "dates", "card", "stats", "sections", "stack")
filter_keys = {k for k, _ in FILTERS}
group_keys = {k for k, _ in GROUPS}
slugs = [p.get("slug") for p in PROJECTS]
assert len(slugs) == len(set(slugs)), "duplicate slug"
for p in PROJECTS:
    missing = [k for k in REQUIRED if k not in p]
    assert not missing, f"{p.get('slug')}: missing {missing}"
    assert re.fullmatch(r"[a-z0-9-]+", p["slug"]), f"bad slug {p['slug']}"
    assert p["group"] in group_keys, f"{p['slug']}: unknown group {p['group']}"
    assert p["kind"] in ("work", "personal"), f"{p['slug']}: kind must be work or personal"
    unknown = set(p["filters"] + [p["kind"]]) - filter_keys
    assert not unknown, f"{p['slug']}: unknown filters {unknown}"

THEME = ('<script>(function(){var t;try{t=localStorage.getItem("theme");}catch(e){}'
         'if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";'
         'document.documentElement.setAttribute("data-theme",t);})();</script>')


SAFE_URL = re.compile(r"(https?://[^\s<>]+|[A-Za-z0-9_./#-]+)")


def link(m):
    url = m.group(2)
    assert SAFE_URL.fullmatch(url), f"unsafe link URL: {url}"
    return f'<a href="{url}">{m.group(1)}</a>'


def md(s):
    """Escape text, then apply **bold**, `code` (literal) and [text](url)."""
    codes = []

    def keep(m):
        codes.append(f"<code>{html.escape(m.group(1))}</code>")
        return f"\x00{len(codes) - 1}\x00"

    s = re.sub(r"`([^`]+)`", keep, s)
    s = html.escape(s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", link, s)
    return re.sub("\x00(\\d+)\x00", lambda m: codes[int(m.group(1))], s)


def plain(s):
    """Text for meta descriptions: markup removed."""
    s = re.sub(r"\[([^\]]+)\]\([^)\s]+\)", r"\1", s)
    return s.replace("**", "").replace("`", "")


def e(s):
    return html.escape(s)


def page(title, desc, body, path):
    url = "https://sudeeptabiswas.github.io/projects/" + path
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(title)}</title>
  <meta name="description" content="{e(desc)}">
  <link rel="canonical" href="{url}">
  <meta property="og:title" content="{e(title)}">
  <meta property="og:description" content="{e(desc)}">
  <meta property="og:url" content="{url}">
  <meta property="og:type" content="website">
  {THEME}
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

<header class="site-header">
  <div class="wrap">
    <a class="brand" href="../">Sudeepta Biswas</a>
    <nav class="nav" aria-label="Main">
      <a href="./" aria-current="page">Projects</a>
      <a href="../#skills">Skills</a>
      <a href="../#experience">Experience</a>
      <a href="../blog/">Blog</a>
    </nav>
    <button class="theme-toggle" type="button">Dark</button>
  </div>
</header>

<main id="main">
{body}
</main>

<footer class="site-footer">
  <div class="wrap">
    <span>© 2026 Sudeepta Biswas</span>
    <span><a href="https://www.linkedin.com/in/sudeepta-biswas" rel="noopener">LinkedIn</a> · <a href="https://github.com/SudeeptaBiswas" rel="noopener">GitHub</a> · <a href="../blog/">Blog</a></span>
  </div>
</footer>

<script src="../assets/js/theme.js"></script>
"""


def meta_line(p):
    parts = [p["org"], p["dates"]]
    return " · ".join(e(x) for x in parts)


def role_line(p):
    r = e(p["role"])
    if p.get("designation"):
        r += f' <span class="muted">(designation: {e(p["designation"])})</span>'
    return r


def tags(items, limit=None):
    items = items[:limit] if limit else items
    return '<ul class="tags">' + "".join(f"<li>{e(t)}</li>" for t in items) + "</ul>"


def card(p):
    filt = " ".join([p["kind"]] + p["filters"])
    return f"""      <article class="card" data-filters="{filt}">
        <h3><a href="{p['slug']}.html">{e(p['title'])}</a></h3>
        <p class="meta">{meta_line(p)}<br>{e(p['role'])}</p>
        <p>{md(p['card'])}</p>
        <div class="foot">{tags(p['stack'], 6)}</div>
        <details class="more">
          <summary><span class="closed">Show details</span><span class="opened">Hide details</span></summary>
          <div class="more-body">
{story(p, "h4")}
            <p><a href="{p['slug']}.html">Open the full page →</a></p>
          </div>
        </details>
      </article>"""


def story(p, hx):
    """Facts, note, stats, links, sections and stack: shared by card and page."""
    facts = [("Organization", e(p["org"])), ("Role", role_line(p)), ("When", e(p["dates"]))]
    if p.get("team"):
        facts.append(("Team", e(p["team"])))
    out = '<dl class="facts">' + "".join(f"<dt>{k}</dt><dd>{v}</dd>" for k, v in facts) + "</dl>\n"
    if p.get("note"):
        out += f'<div class="note">{md(p["note"])}</div>\n'
    if p["stats"]:
        out += '<div class="stats">' + "".join(
            f'<div class="stat"><b>{e(v)}</b><span>{e(l)}</span></div>' for v, l in p["stats"]) + "</div>\n"
    if p.get("links"):
        out += '<p class="links">' + "".join(
            f'<a class="btn primary" href="{e(u)}" rel="noopener">{e(t)}</a>' for t, u in p["links"]) + "</p>\n"
    out += "".join(section(h, c, hx) for h, c in p["sections"])
    out += f"<{hx}>Stack</{hx}>\n{tags(p['stack'])}"
    return out


def index():
    buttons = "".join(
        f'<button type="button" class="chip" data-filter="{k}" aria-pressed="{"true" if k == "all" else "false"}">{e(v)}</button>'
        for k, v in FILTERS)
    groups = []
    for gk, gt in GROUPS:
        cards = "\n".join(card(p) for p in PROJECTS if p["group"] == gk)
        groups.append(f"""  <section class="group" aria-labelledby="g-{gk}">
    <h2 id="g-{gk}">{e(gt)}</h2>
    <div class="grid">
{cards}
    </div>
  </section>""")
    n = len(PROJECTS)
    body = f"""<div class="wrap">
  <section class="page-head">
    <h1>Projects</h1>
    <p class="lead">All {n} projects, from my first job in 2011 to today. Use "Show details" to open the full story in place, or click a title for its own page.</p>
    <p class="muted small">Client systems are private, so work projects have no screenshots.
    At BJIT one person often plays four roles on a project: tech lead, architect, engineering manager and project manager.
    Each project shows the role I played; my official designation is in brackets.</p>
    <div class="chips" role="group" aria-label="Filter projects">{buttons}</div>
    <p class="muted small" id="filter-count" aria-live="polite"></p>
  </section>
{chr(10).join(groups)}
</div>"""
    out = page("Projects — Sudeepta Biswas",
               "All projects of Sudeepta Biswas, Senior Java Engineer & Tech Lead: enterprise Java, Spring Boot, release management, PLM, AI tools and personal projects.",
               body, "")
    out += '<script src="../assets/js/filter.js"></script>\n<script src="../assets/js/toc.js"></script>\n</body>\n</html>\n'
    return out


def section(h, content, hx="h2"):
    if isinstance(content, str):
        inner = f"<p>{md(content)}</p>"
    else:
        inner = "<ul>" + "".join(f"<li>{md(x)}</li>" for x in content) + "</ul>"
    return f"<{hx}>{e(h)}</{hx}>\n{inner}\n"


MONTHS = {m: i for i, m in enumerate(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], 1)}


def start_key(p):
    """Start date from 'Mon YYYY – ...' or 'YYYY – ...'. Year only = month 0, so it
    sorts after the dated projects of that year (the month is not known)."""
    m = re.match(r"(?:([A-Z][a-z]{2}) )?(\d{4})", p["dates"])
    assert m and (m.group(1) is None or m.group(1) in MONTHS), f"{p['slug']}: can't read start of dates {p['dates']!r}"
    return (int(m.group(2)), MONTHS.get(m.group(1), 0))


# Newest first. sorted() is stable, so equal dates keep their order in projects_data.py.
BY_DATE = sorted(PROJECTS, key=start_key, reverse=True)


PANEL_GROUPS = [("work", "Work"), ("personal", "Personal")]
# Panel order, also used for prev/next: Work then Personal, each newest first.
ORDER = [p for k, _ in PANEL_GROUPS for p in BY_DATE if p["kind"] == k]


def project_list(current):
    """Left panel on project pages: titles only, in 2 groups, newest first."""
    groups = []
    for k, label in PANEL_GROUPS:
        items = []
        for p in ORDER:
            if p["kind"] != k:
                continue
            cur = ' class="active" aria-current="page"' if p is current else ""
            # "short" (optional): panel text that fits one line; the full title shows on hover.
            name = p.get("short", p["title"])
            tip = f' title="{e(p["title"])}"' if name != p["title"] else ""
            items.append(f'        <li><a href="{p["slug"]}.html"{tip}{cur}>{e(name)}</a></li>')
        # The group holding the current page starts open; the other opens on click.
        is_open = " open" if current["kind"] == k else ""
        groups.append(f'      <li class="toc-group"><details{is_open}><summary>{label}</summary>\n'
                      f'        <ul>\n{chr(10).join(items)}\n        </ul></details></li>')
    return f"""  <nav class="toc" aria-label="All projects">
    <details>
    <summary>All projects</summary>
    <div class="toc-body">
    <div class="toc-head"><span>All projects</span><a class="toc-back" href="./" aria-label="Back to Projects">← Back</a></div>
    <ul class="toc-list">
{chr(10).join(groups)}
    </ul>
    </div>
    </details>
  </nav>"""


def detail(p):
    i = ORDER.index(p)
    prev_p = ORDER[i - 1] if i > 0 else None
    next_p = ORDER[i + 1] if i < len(ORDER) - 1 else None
    pn = '<nav class="pager" aria-label="More projects">'
    pn += f'<a href="{prev_p["slug"]}.html">← {e(prev_p["title"])}</a>' if prev_p else "<span></span>"
    pn += f'<a href="{next_p["slug"]}.html">{e(next_p["title"])} →</a>' if next_p else "<span></span>"
    pn += "</nav>"
    kind = "Work project" if p["kind"] == "work" else "Personal project"
    body = f"""<div class="page-layout">
{project_list(p)}
<article class="article">
  <p class="crumb"><a href="./">Projects</a> / {kind}</p>
  <h1>{e(p['title'])}</h1>
{story(p, "h2")}
  {pn}
</article>
</div>"""
    desc = plain(p["card"])
    out = page(f"{p['title']} — Sudeepta Biswas", desc, body, p["slug"] + ".html")
    return out + '<script src="../assets/js/toc.js"></script>\n</body>\n</html>\n'


with open(os.path.join(OUT, "index.html"), "w", encoding="utf-8", newline="\n") as f:
    f.write(index())
for p in PROJECTS:
    with open(os.path.join(OUT, p["slug"] + ".html"), "w", encoding="utf-8", newline="\n") as f:
        f.write(detail(p))
print(f"wrote index + {len(PROJECTS)} project pages")

# Pages left from a renamed or removed project stay live until deleted by hand.
stale = sorted(f for f in os.listdir(OUT)
               if f.endswith(".html") and f != "index.html" and f[:-5] not in slugs)
for f in stale:
    print(f"STALE: projects/{f} matches no project — delete it by hand")
