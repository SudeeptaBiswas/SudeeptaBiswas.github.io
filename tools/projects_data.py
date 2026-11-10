# Project content. Facts from cv/FACTS.md + cv/master.md + Java CV + lab READMEs.
# Text markup: **bold**, `code`, [text](url). Everything else is escaped.
# Required per project: slug, group, kind (work|personal), filters, title, org, role,
#   dates, card, stats (list, may be empty), sections, stack.
# Optional: designation, team, note, links. build_projects.py checks these.

FILTERS = [
    ("all", "All"), ("work", "Work"), ("personal", "Personal"),
    ("java", "Java & Spring"), ("devops", "DevOps & Release"), ("plm", "PLM"),
    ("ai", "AI"), ("testing", "Testing"), ("frontend", "Frontend"), ("data", "Data & Search"),
]

GROUPS = [
    ("lead", "Work — tech lead years (2015 – now)"),
    ("early", "Work — early career (2011 – 2015)"),
    ("personal", "Personal projects"),
]

PROJECTS = [
# ---------------------------------------------------------------- lead
dict(
    slug="rims-legacy-migration", group="lead", kind="work", filters=["java", "testing", "frontend", "ai"],
    title="RIMS — Legacy Migration to Spring Boot & React.js",
    short="RIMS Migration",   # left panel only (one line)
    org="BJIT Limited — Client: Shin-Etsu Chemical Co., Ltd. (Japan)",
    role="Tech Lead & Architect", designation="Senior Project Manager",
    dates="Mar 2025 – May 2026", team="10+ in frontend, backend and SRS teams; coordinated UI/UX, QA and DevOps teams",
    card="Moved a 105-screen PowerBuilder desktop system to Java 21, Spring Boot and React.js. 300+ APIs, 135 man-months, live on time.",
    stats=[("105", "screens migrated"), ("300+", "REST APIs (40+ written by me)"), ("135", "man-months, on time"), ("90%", "test coverage"), ("~74", "CVE fixes led"), ("9", "releases")],
    sections=[
        ("Context", "RIMS (Research Inventory Management System) tracks research inventory for Shin-Etsu. It was a PowerBuilder desktop app, and the client asked for a web version. It was BJIT's trial project with this client."),
        ("The problem", [
            "Move **105 screens** to Spring Boot and React.js.",
            "Keep the existing **Oracle 19c schema**, so no data migration was needed.",
            "Make the web app match the desktop app's speed, behaviour and navigation.",
        ]),
        ("My role", [
            "**Architect:** system architecture and non-functional requirements (security, performance, scalability).",
            "**Tech lead:** wrote code, set code review standards, designed features, mentored and trained developers.",
            "**Engineering manager:** 1:1s, performance, training, development process.",
            "**Project manager:** WBS, effort-to-cost estimates, sprints, change control, risks and dependencies. Also the main client contact: daily client meetings, steering committee meetings, releases, UAT and go-live.",
        ]),
        ("Architecture", [
            "**Feature-based modules (6):** each module owns one feature area, which means less coupling and easier changes.",
            "**Patterns:** Repository, Builder, DTO mapping (MapStruct), one global error handler (`@RestControllerAdvice`).",
            "**API governance:** a generic request/response pattern, localized messages (English and Japanese), error handling, encryption and documentation standards.",
            "**Security:** username/password login with Spring Security, stateless JWT, and role-based authorization.",
            "**Concurrency:** optimistic locking. The UPDATE compares every column it read earlier. If the row changed, the user sees \"data already updated, search again\".",
        ]),
        ("Hands-on work", [
            "Wrote **40+ of the 300+ REST APIs** in Java 21 and Spring Boot.",
            "Built the **Excel (Apache POI) and CSV exports**.",
            "Wrote integration tests (JUnit 5, Mockito, AssertJ, Spring Security Test).",
            "Reviewed team code.",
        ]),
        ("AI-first delivery", [
            "The client approved AI use on its code before we started.",
            "AI analyzed the legacy PowerBuilder code before design and coding.",
            "**Parent-child prompts** per screen and per API. AI wrote the code; developers reviewed every line and owned it.",
            "Team rules: AI must not guess beyond the spec, must follow the existing code structure, no auto-commit, no proprietary code uploaded.",
        ]),
        ("Challenges and how we handled them", [
            "**Desktop feel on the web:** the client wanted desktop-style switching between many tabs. We built it, with limits the client approved before development. We tested desktop and web side by side to match every feature.",
            "**Pagination:** the client didn't want paging. We pushed back because large data would be slow, and built a configurable page size.",
            "**Pixel-perfect PDFs** with no font or sample: we built a sample for review. The client then shared the font and a sample PDF.",
            "**Prompt adoption:** in the first month, developers skipped the parent-child prompts. I found this in code review, trained them and followed up.",
        ]),
        ("Quality and security", [
            "**90% test coverage** (JUnit 5, Mockito, JaCoCo).",
            "SonarQube runs in the Jenkins pipeline. The DevOps team set it up.",
            "Started the **OSV-Scanner** checks and led **~74 CVE fixes**, then shared the work across the team. The fixes were Spring Boot 3.3 → 3.5 upgrades, forced transitive versions and Gradle dependency locking.",
            "Deploys moved to Jenkins and Docker. The DevOps team configured them.",
        ]),
        ("Results", [
            "**Live on time**; handover done.",
            "9 releases (6 sprint, 3 milestone). The client signed off UAT.",
            "Client feedback after every release; lessons-learned session after each milestone.",
            "**Trial project win:** after milestone 2, the client gave BJIT **3 more migration projects**, run by other teams.",
        ]),
    ],
    stack=["Java 21", "Spring Boot 3.5", "Spring Security 6.5", "Spring Data JPA", "Hibernate", "JWT", "MapStruct", "Apache POI", "React.js", "Oracle 19c", "Gradle", "JUnit 5", "Mockito", "JaCoCo", "Jenkins", "Docker", "JasperReports", "SonarQube", "OSV-Scanner", "GitHub Copilot"],
),
dict(
    slug="ai-requirements-platform", group="lead", kind="work", filters=["ai", "frontend"],
    title="AI Requirements Documentation Platform",
    short="AI Requirements Docs",   # left panel only (one line)
    org="BJIT Limited — AI Transformation department",
    role="Tech Lead & Architect", designation="Senior Project Manager",
    dates="Jun 2026 – now", team="Team of 5",
    card="A tool that reads legacy PowerBuilder/Oracle systems and writes screen-level SRS and API specs. ~60% less manual effort in pilot.",
    stats=[("~60%", "less manual SRS effort (pilot)"), ("50%", "lower documentation cost on the next migration"), ("5", "people in the team")],
    sections=[
        ("Context", "A legacy migration starts by documenting the old system: every screen, rule and API. Done by hand, this is slow and costly. The product is still in development and built for reuse on legacy migrations."),
        ("My role", [
            "**Architect:** system architecture and tech stack choice.",
            "**Tech lead:** hands-on coding, technical design of features, unblocking and mentoring developers.",
            "**Engineering manager:** 1:1s and performance, team growth and training, development process.",
            "**Project manager:** plan, estimates, WBS, stakeholder updates, scope, roadmap, risks, pilot and release.",
        ]),
        ("What we built", [
            "Reads legacy PowerBuilder/Oracle code and writes **screen-level SRS** and **API specs**.",
            "**Hybrid design:** rule-based extraction with no LLM for the facts; LLM calls only for prose such as requirements, user stories and use cases.",
            "**Configurable LLM provider:** Claude or GitHub Copilot, picked in settings.",
            "Output to DOCX, XLSX and Markdown.",
        ]),
        ("How the team works", [
            "**Agentic development lifecycle (ADLC):** AI agents (Claude Code) plan, code and check each change. A human gives final approval.",
            "Set team AI standards: reusable Claude Code skills and shared prompt rules.",
            "Planned the next features and changed the plan after the pilot. Gave demos to stakeholders.",
        ]),
        ("Results", [
            "Manual SRS effort cut by **~60%** in pilot tests.",
            "Used on the next legacy migration project: documentation cost cut by **50%**.",
        ]),
    ],
    stack=["Electron", "React.js", "TypeScript", "Python", "Claude Code", "GitHub Copilot", "PowerBuilder", "Oracle"],
),
dict(
    slug="ericsson-release-management", group="lead", kind="work", filters=["devops", "plm"],
    title="Release Management for a 12-App PLM Platform",
    short="Release Management",   # left panel only (one line)
    org="BJIT Limited — Client: Ericsson (Sweden), CPD team",
    role="Release & DevOps Consultant (one of 5 release managers)", designation="Project Manager → Senior Project Manager (Jul 2023)",
    dates="Aug 2021 – Feb 2025", team="One of 5 peer release managers; supported 2–3 of 6 teams at a time",
    card="Planned and shipped releases for a distributed 12-app 3DEXPERIENCE platform. 18/18 PROD releases on time, deploy time cut 50%.",
    stats=[("18 / 18", "monthly PROD releases on time"), ("~100", "SIT and UAT deploys"), ("50%", "faster deploys"), ("16", "PROD instances on 4 servers")],
    sections=[
        ("Context", "Ericsson runs a distributed Dassault 3DEXPERIENCE platform: 12 apps, including 3DSpace, 3DPassport, 3DDashboard and full-text search, on separate servers. PROD ran on 4 Linux servers with 16 instances."),
        ("The problem", "6 development teams shipped into the same platform. Every release had to land on time without breaking production."),
        ("What I did", [
            "Planned and owned release schedules: **3 SIT** and **1–2 UAT** deploys a month, and a **monthly PROD** release. 2–3 deploys a day to the test environments.",
            "Found the code changes for each release and wrote the deployment plan from them.",
            "**Automated packaging and deployment** with Jenkins, Ansible and Ant.",
            "Designed the **Gerrit branching strategy**; led code review, merges and release-package QA.",
            "Briefed the client before and after every release.",
            "Maintained 3DSpace **full-text search**: index updates and data indexing.",
            "Kept 6 teams on one delivery line without delaying any release; supported on-demand deploys.",
        ]),
        ("Results", [
            "**All 18 monthly PROD releases on time** over 1.5 years.",
            "**~100 SIT/UAT deploys.**",
            "Deploy time cut by **50%**.",
        ]),
    ],
    stack=["3DEXPERIENCE R2021x/R2022x", "Java", "JavaScript", "JPO", "MQL", "TCL", "Gerrit", "Ant", "Tomcat", "Jenkins", "Ansible", "Linux"],
),
dict(
    slug="valmet-plm-platform", group="lead", kind="work", filters=["java", "plm", "devops", "frontend", "data"],
    title="Enterprise PLM Platform (CATIA V6)",
    short="PLM Platform (V6)",   # left panel only (one line)
    org="BJIT Limited — Client: Valmet Technologies Oy (Finland)",
    role="Tech Lead & Architect", designation="Project Manager",
    dates="Oct 2017 – Aug 2021", team="Team of 5",
    card="Built apps, integrations and search on Valmet's distributed 3DEXPERIENCE platform; ran 2–3 small projects at once.",
    stats=[("5", "engineers led"), ("2–3", "small projects at once"), ("R2015x → R2021x", "platform upgrades")],
    sections=[
        ("Context", "Valmet manages product data on Dassault 3DEXPERIENCE: 3DSpace, 3DPassport, 3DDashboard, file and search servers. My team built and maintained apps on this distributed platform."),
        ("My role", [
            "**Architect:** system architecture, non-functional requirements, API and integration design.",
            "**Tech lead:** coding, code review standards, feature design, mentoring.",
            "**Engineering manager:** interview panels and written-exam review, 1:1s and performance, training, development process and CI/CD.",
            "**Project manager:** POCs, requirement analysis, SRS, functional specs, WBS, effort budgets in man-months, Jira dashboards, risks, client communication, weekly reports and sign-off. Ran Scrum: standups, retros, grooming.",
        ]),
        ("What I built and ran", [
            "**Translation Management widget:** integration with the third-party Global Translation System (GTS). It requests new translations, fetches missing ones and saves approved ones.",
            "**REST and integration services** with Spring MVC and eMatrix REST: services used by the apps, and integration services that talk to other systems.",
            "**Exalead CloudView search:** indexed 3DSpace data for search and analysis, with results shown through filters.",
            "**ELK monitoring:** see the [ELK Log Monitoring](elk-log-monitoring.html) page.",
            "**CATIA Client Tool** moved to R2018x and R2020x, with new features.",
            "Platform upgrades R2015x → R2018x → R2021x. Built and deployed apps to the DEV and TEST environments.",
            "**CI/CD:** set up, configured and ran pipelines with Rundeck, Jenkins, Ant and JFrog.",
            "Researched and introduced new technologies.",
        ]),
        ("Documents", "User guides, deployment documents, deployment plans for each release, release notes and weekly status reports."),
        ("Results", [
            "Delivered for nearly 4 years (Oct 2017 – Aug 2021) with a team of 5; owned client communication, weekly reports and sign-off.",
            "Ran 2–3 small projects in parallel: translations, ELK, product-structure export/import, CloudView.",
        ]),
    ],
    stack=["Java", "Spring MVC", "Spring Boot", "JPO", "eMatrix REST", "JavaScript", "RequireJS", "AJAX", "jQuery", "Bootstrap", "Thymeleaf", "VBScript", "Shell", "RHEL 6/7", "Windows Server 2012 R2", "Jira", "Confluence", "Redmine", "Bitbucket", "Gerrit"],
),
dict(
    slug="elk-log-monitoring", group="lead", kind="work", filters=["devops", "data"],
    title="ELK Log Monitoring",
    org="BJIT Limited — Client: Valmet Technologies Oy (Finland)",
    role="Owner, end to end", designation=None,
    dates="2015 – 2021", team=None,
    card="Ran ELK on Docker for 2–3 TB of logs: 50+ log formats, 10+ Kibana dashboards, alerts. From first R&D to production support.",
    stats=[("2–3 TB", "of logs"), ("50+", "log formats parsed"), ("10+", "Kibana dashboards"), ("100", "visualizations")],
    sections=[
        ("Context", "Valmet's PLM platform needed one place to collect, search and alert on its logs."),
        ("What I did", [
            "Owned it end to end: first R&D, production release, then investigating issues after release.",
            "Ran **Elasticsearch, Logstash, Kibana and Filebeat on Docker** (Red Hat).",
            "**Log parsing and ingestion** for 50+ log formats, plus indexing.",
            "Built **10+ Kibana dashboards** with 100 visualizations.",
            "Set up **alerts** in Kibana and Jenkins.",
            "Protected the Kibana login with **nginx authentication**.",
            "Used the logs to investigate and fix production issues.",
        ]),
        ("Results", "2–3 TB of logs searchable in one place, with dashboards and alerts, used to troubleshoot production issues."),
    ],
    stack=["Elasticsearch", "Logstash", "Kibana", "Filebeat", "Docker", "nginx", "Jenkins", "RHEL"],
),
dict(
    slug="valmet-enovia-platform", group="lead", kind="work", filters=["java", "plm", "frontend", "data"],
    title="ENOVIA PLM Platform (CATIA V5)",
    short="ENOVIA PLM (V5)",   # left panel only (one line)
    org="BJIT Limited — Client: Valmet Technologies Oy (Finland)",
    role="Tech Lead", designation="Senior Software Engineer",
    dates="Nov 2015 – Sep 2017", team="Team of 5",
    card="Built 3 ENOVIA widgets and a desktop release tool from scratch, plus Excel/CSV product-structure import/export and a data migration tool.",
    stats=[("3", "widgets built from scratch"), ("1000+", "products per structure (export/import)"), ("5", "engineers led")],
    sections=[
        ("Context", "Valmet used ENOVIA and CATIA V5 to manage product designs. The team built tools to help engineers release, move and find product data."),
        ("My role", "Led the team of 5: requirement analysis, design, WBS, client communication, code review and branching (merges, conflict resolution, tagging). Wrote design and technical documents."),
        ("What I built", [
            "**3 ENOVIA widgets** from scratch with JavaScript, JPO, MQL, Java and TCL.",
            "**CATIA Client Tool (R2015x):** designed and built a desktop app for continuous package release.",
            "**Product-structure export/import** with Excel and CSV: export, import and update 1000+ products per structure.",
            "**Data migration and comparison tool.**",
            "**OCR document search:** see the [OCR Document Search](ocr-document-search.html) page.",
        ]),
    ],
    stack=["Java", "JavaScript", "JPO", "MQL", "TCL", "Shell", "PHP", "Maven", "Ant", "Jenkins", "Rundeck", "Docker", "RHEL", "Git"],
),
dict(
    slug="ocr-document-search", group="lead", kind="work", filters=["java", "data"],
    title="OCR Document Search",
    org="BJIT Limited — Client: Valmet Technologies Oy (Finland)",
    role="Developer (built it from scratch)", designation=None,
    dates="2015 – 2017", team=None,
    card="Made large document sets, including scanned image PDFs, searchable with Solr, Apache Tika and Tesseract OCR.",
    stats=[],
    sections=[
        ("The problem", "Many documents were scanned images inside PDFs. Normal search could not read them."),
        ("What I built", [
            "**Text extraction** from documents with Apache Tika.",
            "**OCR** for scanned images and image PDFs with Tesseract.",
            "**Indexing and search** with Apache Solr and SolrJ.",
        ]),
        ("Results", "Large document sets, including image-only PDFs, became searchable by their text."),
    ],
    stack=["Java", "Apache Solr", "SolrJ", "Apache Tika", "Tesseract OCR"],
),
# ---------------------------------------------------------------- early
dict(
    slug="omron-test-automation", group="early", kind="work", filters=["testing", "java"],
    title="Omron Wellness — Test Automation",
    short="Omron Testing",   # left panel only (one line)
    org="BJIT Limited — Client: Omron (US)",
    role="Senior Software Engineer", designation=None,
    dates="Aug 2015 – Oct 2015", team=None,
    card="Selenium test automation in Java using the Factory pattern; regression testing and performance analysis.",
    stats=[],
    sections=[
        ("What I did", [
            "Analyzed, designed, wrote and ran test cases.",
            "Built **automated test suites with Selenium** in Java, using the **Factory pattern**.",
            "Ran regression testing.",
            "Analyzed and improved performance.",
        ]),
    ],
    stack=["Java", "Selenium", "Gerrit", "Eclipse"],
),
dict(
    slug="shopbook-db-migration", group="early", kind="work", filters=["data"],
    title="ShopBook — Oracle to PostgreSQL Migration R&D",
    short="ShopBook Migration",   # left panel only (one line)
    org="BJIT Limited",
    role="Senior Software Engineer", designation=None,
    dates="Jun 2015 – Aug 2015", team=None,
    card="R&D on moving an Oracle 11g database to PostgreSQL 9.4: tables, procedures and interfaces.",
    stats=[],
    sections=[
        ("What I did", [
            "R&D on an **Oracle 11g → PostgreSQL 9.4** migration: tables, procedures, TCL and interfaces.",
            "Fixed compatibility issues and checked data integrity.",
        ]),
    ],
    stack=["Oracle 11g", "PostgreSQL 9.4", "SQL"],
),
dict(
    slug="issue-book", group="early", kind="work", filters=["java", "frontend"],
    title="Issue Book",
    org="BJIT Limited — Client: NTT Data (Thailand)",
    role="Software Engineer", designation=None,
    dates="Jul 2014 – May 2015", team=None,
    card="Java EE app on intra-mart: requirements, design, business logic, UI, mail integration and end-user documents.",
    stats=[],
    sections=[
        ("What I did", [
            "Requirement analysis, design, business logic, UI and testing.",
            "Server-side and browser JavaScript on the intra-mart platform.",
            "Mail features with Postfix, IMAP and SMTP.",
            "Investigated and fixed issues; wrote end-user documents.",
        ]),
    ],
    stack=["intra-mart Accel Platform (Java EE)", "JSP", "JPA", "JavaScript", "jQuery", "Postfix", "IMAP", "SMTP", "PostgreSQL", "Ubuntu"],
),
dict(
    slug="hrms", group="early", kind="work", filters=["java", "frontend"],
    title="HRMS — HR Management System",
    short="HRMS",   # left panel only (one line)
    org="BJIT Limited — Client: NTT Data (Myanmar)",
    role="Software Engineer", designation=None,
    dates="Jun 2013 – Jun 2014", team=None,
    card="HR system on intra-mart: requirements, WBS, Hibernate data models, UI, and code review for the team.",
    stats=[],
    sections=[
        ("What I did", [
            "Requirement analysis, design, documentation and WBS.",
            "Business logic, UI and **Hibernate ORM data models**.",
            "**Reviewed team code.**",
        ]),
    ],
    stack=["intra-mart Accel Platform", "Java", "Hibernate", "PostgreSQL", "Tomcat", "HTML", "CSS", "JavaScript", "AJAX", "jQuery", "Gerrit"],
),
dict(
    slug="food-navi", group="early", kind="work", filters=["java", "testing"],
    title="Food Navi — Food Navigation System",
    short="Food Navi",   # left panel only (one line)
    org="BJIT Limited",
    role="Software Engineer", designation=None,
    dates="Mar 2013 – May 2013", team=None,
    card="Server-side Java with TERASOLUNA, built test-first: 98% test coverage, UML design, functional spec.",
    stats=[("98%", "test coverage (TDD)")],
    sections=[
        ("What I did", [
            "Server-side business logic, UI and bug fixing.",
            "Worked **test-first (TDD)** and reached **98% test coverage**.",
            "Wrote the functional spec and **UML diagrams**.",
        ]),
    ],
    stack=["Java", "TERASOLUNA", "Tomcat 7", "MySQL", "JUnit", "Gerrit"],
),
dict(
    slug="ntt-offshore-trial", group="early", kind="work", filters=["java", "testing"],
    title="NTT Data Offshore Trial",
    short="NTT Data Trial",   # left panel only (one line)
    org="BJIT Limited — Client: NTT Data (Japan)",
    role="Software Engineer", designation=None,
    dates="Jan 2013 – Feb 2013", team=None,
    card="My first BJIT project: Java Servlet business logic, built test-first with 98% test coverage.",
    stats=[("98%", "test coverage (TDD)")],
    sections=[
        ("What I did", [
            "Business logic with Java Servlets on intra-mart J2EE.",
            "Worked **test-first (TDD)** with JUnit/djUnit and reached **98% test coverage**.",
        ]),
    ],
    stack=["Java", "Servlet", "intra-mart J2EE 7.0", "JUnit", "djUnit", "Resin", "Oracle 10g R2"],
),
dict(
    slug="sms-vas", group="early", kind="work", filters=["java"],
    title="SMS Value-Added Services",
    short="SMS VAS",   # left panel only (one line)
    org="True Services (Pvt.) Limited, Bangladesh",
    role="Software Engineer", designation=None,
    dates="Aug 2012 – Dec 2012", team=None,
    card="Java server components (sockets, threads) for telco SMS value-added services, from client requirements to delivery.",
    stats=[],
    sections=[
        ("What I did", [
            "Built **Java server components** for telco SMS value-added services, using sockets and threads.",
            "Talked to the client: gathered requirements, then did the analysis and design.",
            "Built the UI, business logic and data access layers; tested and delivered.",
        ]),
    ],
    stack=["Java", "Servlet", "Sockets", "Threads", "XML (DOM/SAX)", "Log4j", "MySQL", "Tomcat", "Linux"],
),
dict(
    slug="database-copy-tool", group="early", kind="work", filters=["java", "data", "testing"],
    title="Dynamic Relational Database Copy Tool",
    short="DB Copy Tool",   # left panel only (one line)
    org="Therap (BD) Ltd",
    role="Programmer", designation=None,
    dates="Nov 2011 – Mar 2012", team=None,
    card="My first job: a Java tool that copies data between relational databases.",
    stats=[],
    sections=[
        ("What I did", [
            "Analysis, design, implementation and unit testing of a **relational database copy tool**.",
            "XML handling with DOM and SAX; logging with Log4j; build with Ant.",
        ]),
    ],
    stack=["Java", "XML (DOM/SAX)", "Log4j", "JUnit", "Apache Ant", "Oracle"],
),
# ---------------------------------------------------------------- personal
dict(
    slug="fleetcheck", group="personal", kind="personal", filters=["testing"],
    title="FleetCheck — Quarterly Random Pick",
    short="FleetCheck",   # left panel only (one line)
    org="Personal case study",
    role="Designer and reviewer (code drafted with Claude Code)", designation=None,
    dates="2026", team=None,
    card="Fair, repeatable random vehicle inspections: HMAC-SHA256 scoring, one pick per company and quarter, 48 tests.",
    stats=[("48", "tests"), ("~0.9 s", "200,000 vehicles on my PC"), ("O(n log n)", "time")],
    sections=[
        ("The problem", "Each quarter, a set share of a company's active vehicles gets a surprise inspection. The pick must be fair, an auditor must be able to repeat it, and it may run only once per company and quarter."),
        ("How it works", [
            "**Score:** each vehicle gets `HMAC-SHA256(seed, \"quarter:vehicleId\")`.",
            "**Pick:** sort by score, take the first `ceil(n × percent / 100)`.",
            "**Fair:** every vehicle has the same chance, k / n. A test checks this over 4,000 seeds.",
            "**Seed:** 32 random bytes, made when the pick runs and saved with it. Nobody can know the pick before it runs; anyone with the seed can repeat it.",
            "**Once per quarter:** one saved pick per company and quarter. In Postgres: a unique key and `INSERT ... ON CONFLICT DO NOTHING`.",
            "**Audit:** the vehicle list, its SHA-256 hash, the seed and the result are saved, so an auditor gets the same vehicles.",
        ]),
        ("How it was built", "I chose the design: a random seed with HMAC ranking, Vitest, and a thin store for run-once. Claude Code drafted the code, tests and README; I reviewed every line."),
        ("Results", [
            "48 tests, each named after the rule it checks.",
            "200,000 vehicles with 50,000 picked in 876–962 ms (6 runs, Node 24, my PC).",
        ]),
    ],
    stack=["TypeScript", "Node.js", "Vitest"],
    links=[("View code on GitHub", "https://github.com/SudeeptaBiswas/fleetcheck_quarterly_pick")],
),
dict(
    slug="pc-organizer", group="personal", kind="personal", filters=["data"],
    title="PC Organizer",
    org="Personal tool",
    role="Owner (built with AI coding agents)", designation=None,
    dates="2026", team=None,
    card="Finds duplicate files, reviews them in a local web page, organizes files, and backs up and syncs between two PCs through a USB folder. Safety first.",
    stats=[("3", "modules"), ("0", "third-party packages")],
    sections=[
        ("The problem", "Two PCs, many drives, and years of copied files. I wanted to clean them up without ever losing a file."),
        ("Modules", [
            "**Duplicates:** a report-only scanner finds duplicate files; a local web page reviews them side by side, with previews.",
            "**Librarian:** classifies files, reports misplaced ones and suggests moves.",
            "**Courier / Backup:** offline backup and sync between my two PCs through a USB or transfer folder.",
        ]),
        ("Safety rules", [
            "Deletes always go to the Recycle Bin. Never the last copy, and never a bulk \"delete all\".",
            "The tool only suggests. A move or delete happens only when I click.",
            "The web server listens on this PC only (`127.0.0.1`).",
            "Each PC writes only to its own data folder.",
            "Tests run on fake folders, never on real drives.",
        ]),
        ("How it's built", "Python standard library only, with no `pip install`. Tests use the built-in `unittest`. AI coding agents work on it in parallel, so it has a written process, short module docs and tagged commits."),
    ],
    stack=["Python", "unittest", "HTML", "JavaScript"],
    note="Private repo. Screenshots coming.",
),
dict(
    slug="avocabulary", group="personal", kind="personal", filters=["frontend"],
    title="avocabulary",
    org="Personal mobile app",
    role="Owner", designation=None,
    dates="2026", team=None,
    card="Offline vocabulary app: dictionary lookup, bookmarks, GRE and IELTS word lists, courses and text-to-speech.",
    stats=[],
    sections=[
        ("Features", [
            "**Offline dictionary** lookup from `.slob` files (XDXF/HTML).",
            "Bookmark and revisit words.",
            "Word lists: GRE, IELTS and more.",
            "Courses with a learning schedule.",
            "Text-to-speech pronunciation.",
        ]),
        ("How it's built", "Flutter, Android first, with a multi-platform setup. Dictionary files are not bundled; free ones come from the Kiwix library and aard2."),
    ],
    stack=["Flutter", "Dart", "Android"],
    note="Private repo. Screenshots coming.",
),
dict(
    slug="ai-engineering-lab", group="personal", kind="personal", filters=["ai"],
    title="AI Engineering Lab",
    org="Personal learning project",
    role="Learner and builder", designation=None,
    dates="Nov 2026 – now", team=None,
    card="Learning AI engineering by building: RAG, agents and MCP, ending with Spring Boot calling a Python AI service.",
    stats=[("12 of 68", "topics done"), ("~9%", "of a ~200 h plan"), ("10", "phases")],
    sections=[
        ("Status", "Phases 1 (Python for Java developers) and 2 (LLM fundamentals) are under way: 12 of 68 topics done, about 9% of the plan by hours (updated 9 Nov 2026). Next: the first version of the lab's app, a command-line chatbot with memory."),
        ("Done so far", [
            "**Python for Java developers:** setup with uv, syntax, collections, classes, modules and exceptions, files, JSON and HTTP, pytest.",
            "**LLM fundamentals:** tokens and the context window, Ollama and quantization, the chat API and streaming, sampling, embeddings and search.",
            "Every topic ends with exercises that must pass, e.g. 14/14 tests for pytest, 17/17 for embeddings.",
            "Everything runs locally with Ollama on a CPU, no GPU. Times and sizes are measured, not guessed.",
            "Notes on the blog: [Python for Java Developers](../blog/python-for-java-developers.html) and [AI Engineering: LLM Fundamentals](../blog/ai-engineering-llm-fundamentals.html).",
        ]),
        ("How it is built", [
            "**One growing app** (`assistant/`, v1 to v10): each phase adds to the same app, instead of 10 separate projects.",
            "Python topics come just before the AI lesson that first needs them.",
            "Strict type checks (pyright, 0 errors), and a script that checks every lesson file against the lab's rules.",
        ]),
        ("Goal", "Learn RAG, agents and MCP by building each idea by hand first, then with a framework. Free and open-source tools first."),
        ("Plan", [
            "Python for Java developers (typing, async, pydantic, pytest, uv).",
            "LLM basics: tokens, sampling, context, embeddings.",
            "Prompting, structured output and raw tool calling.",
            "RAG by hand, then LangChain, then reranking.",
            "Evals and tracing (Langfuse).",
            "Agents: a hand-written loop, then LangGraph.",
            "MCP: server, client, and an agent that uses MCP tools.",
            "Serving with FastAPI and Docker, with guardrails.",
            "**Java bridge:** Spring Boot calls the AI service; a Java MCP server.",
            "Capstone: an enterprise assistant with RAG, agents and MCP.",
        ]),
    ],
    stack=["Python", "uv", "pytest", "Ollama", "LangChain", "LangGraph", "Chroma", "MCP", "FastAPI", "Spring Boot"],
    note="Self-study. Not work experience.",
),
]
