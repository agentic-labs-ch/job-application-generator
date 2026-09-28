# Tech & Produkt (software, cloud, data, security, product, research)

Researched 2026-09-27 for the CV generator. Rules for CVs of other people in this Branche; `docs/cv-guide.md` stays the base rule set. Sources are listed at the end, numbered [1], [2] …

Job ads carry short ids per sub-sector (S, O, D, SEC, P, R). All were public LinkedIn job
pages that opened without login, or an employer's careers page, seen on 2026-09-27. The date
in each ad table is the posting date. Ads age quickly: check them before relying on a keyword.

## How readers in this Branche read a CV

- The first reader is often software. Large Swiss employers run an applicant tracking system
  (ATS) that filters on keywords, skills, previous employer and qualifications; ETH calls
  keywords from the ad and the profession's standard vocabulary essential [2]. Agencies search
  their databases by technical skills and certificates [9] and advise the ad's exact wording [8].
- The first human pass is short: about six seconds in the eye-tracking study ETH cites, 80 %
  of it on name, current position, last employer, their dates and education [2]. MIT gives six
  to ten seconds [3], Stanford under 30 [18].
- In tech that pass looks for the stack, the years with it and the level. Ads state minimums
  plainly: "5+ years" (S2), "4+ years" (D1), three years with Kubernetes operators (O2).
  Specific systems and language skills come first, soft skills second [9].
- The second reader is the hiring manager (engineer, team lead, head of product). They read
  for depth: what was built, at what scale, and whether the person ran it in production.
  On-call duty and third-level support are in the ads themselves (S3, O3).
- Dates and titles are checked against the work references (Arbeitszeugnisse); they must match
  across CV, letter and online profiles [8]. Some employers want only CV, diplomas and
  references and say a motivation letter can be left out (D2).
- Language is a filter. German-language ads ask for very good German, sometimes with a CEFR
  level (B2 in O4, C1 in SEC2). International employers write English-only ads and treat
  German or French as a plus (S3, O2, O3).
- Research is read differently: a CV with full publication list, a research statement and
  referees (R4, R5), judged relative to career stage [13][14].

## Common to all sub-sectors

### Length and format

- Pages: two A4 pages for industry roles [7][8]; ETH allows up to three for doctoral
  candidates [2]. The US one-page rule [1][6] is not the Swiss norm.
- Photo: common in German-speaking Switzerland but optional [2][7][8]; the base guide keeps
  it. For English-only ads of international employers a photo is not expected, and Harvard
  advises against one [1]. A no-photo variant for such ads is an owner decision.
- Dates: `MM.YYYY` as in the base guide (ETH samples use `MM/YYYY` [2]); one format throughout.
- Languages: native language first, then by relevance, one scale throughout [2]. jobs.ch
  recommends CEFR levels [7]; the base guide names one only with a certificate.
- Links: GitHub or GitLab, portfolio or live product, Google Scholar or ORCID. Ads reward
  visible work: open-source code (R1, R3), "a homelab, self-hosted services or side projects"
  (O3). Link only public work that is the person's own; print the full URL for paper.
- Skills: grouped by type (languages, frameworks, cloud, data, tools) [2], without graphic
  levels: ATS software misreads filled circles and bars [2], and the base guide uses no levels.
- ATS-safe PDF: standard fonts, contact details not only in header or footer, no key content
  inside tables, text boxes or images [2][3].

### Section order

The base guide's order stays. What changes in this Branche:

1. Header: target role plus two or three core technologies ("Backend Engineer · Java, Kafka,
   Kubernetes").
2. Profil: years, domain, main stack and one proof with a number.
3. Kernkompetenzen: three competencies that answer the must-requirements.
4. Berufserfahrung: per position a one-line context (product, volume, team size), the points,
   then a short "Stack:" line.
5. Projekte (optional) for juniors, career changers and open-source maintainers. With less
   than two years of experience, Projekte and Ausbildung move before Berufserfahrung: order
   headings by importance [1] and put strengths first [12].
6. Weiterbildung & Zertifikate weighs more in operations, security and product.
7. Ausbildung, Sprachen, Weitere Kenntnisse (the grouped stack), Kontakt, as in the base guide.

### Tone and verbs

- Factual and technical, past tense for past positions, no "I" [1][4]. Name the technology in
  the point and carry the ad's keywords into it [4].
- One idea per point: action, context, result [4][5]. Google's former head of people
  operations wrote it as "Accomplished [X] as measured by [Y] by doing [Z]", with a baseline
  for the number [6].
- Harvard verbs that fit (base guide list, written in British spelling): Technical: Built,
  Designed, Engineered, Programmed, Optimised, Standardised, Streamlined, Upgraded, Maintained,
  Operated, Solved. Research: Investigated, Identified, Diagnosed, Modelled, Tested,
  Evaluated, Resolved. Organizational: Implemented, Launched, Consolidated, Centralised,
  Reduced, Monitored, Validated, Verified. Leadership: Led, Prioritised, Coordinated.
  Teaching: Coached, Trained, Enabled, Guided (platform and security teams enable others).
- Use with care: Spearheaded and Orchestrated read as inflated here, and "orchestrated"
  collides with container orchestration. Avoid Energized, Fashioned, Acted, Mastered,
  Surpassed, Utilized (write "used").
- Extra verbs typical here, not in the Harvard list: Automated, Migrated, Deployed, Shipped,
  Refactored, Containerised, Instrumented, Hardened, Scaled, Benchmarked, Prototyped,
  Open-sourced, Mentored, Triaged, Remediated, Provisioned.

### Numbers to show

Only numbers the references or other evidence support (base guide), with a baseline where
there is one [6]. Examples are fictional.

| Type | Fictional example |
|---|---|
| Scale | 4 million requests a day; 2 billion events a month; 120 shops |
| Performance | p95 latency from 400 to 120 ms; build time from 25 to 8 minutes |
| Reliability | availability 99.95 %; mean time to recovery from 90 to 25 minutes |
| Delivery | releases from monthly to daily |
| Cost | cloud costs down 18 %; inference cost down 35 % |
| Security | median time to patch critical findings from 30 to 7 days |
| Product | 45 % adoption within 6 months; 30-day retention from 62 % to 71 % |
| People | team of 6; 2 juniors mentored; 5 master's theses supervised |
| Research | 3 peer-reviewed papers; CHF 300,000 of third-party funding |

### What to avoid

- Keyword walls: forty tools with no trace in the experience. A must-keyword appears where it
  was used; the duplicate check (`cv-doppelungen-pruefen`) decides what the grouped list repeats.
- Skill bars, stars and percentages [2]; clichés such as "ninja" or "guru" [16]; openings like
  "passionate, hard-working individual" [14]; duty lists ("responsible for …") [1].
- Old technology given as much room as the current stack, unless the ad asks for it.
- Confidential detail: clients under non-disclosure, internal system names, vulnerabilities in
  named systems. Describe the class of problem instead.
- Vague AI claims. Ads ask for AI-assisted development or operations (S1, S2, O3): name the
  tool and what it changed.
- Rare acronyms unexplained [1]. Standard ones (CI/CD, AWS, SIEM) are keywords; keep them.

## 1. Software engineering (backend, frontend, full-stack)

### What recruiters expect

- Degree in computer science or business informatics (Uni, ETH, FH) or HF, "or comparable"
  (S1, S3, S4); five years or more for senior titles (S2).
- A primary language with framework and database: Java, Jakarta EE and Quarkus (S3); C#, .NET,
  Blazor and React (S1); F#, TypeScript, React and PostgreSQL (S2); TypeScript, Angular,
  ASP.NET and MS SQL Server (S4).
- Craft: object-oriented design and patterns, code reviews, automated tests, CI/CD and Git,
  documentation (S1–S4).
- Ownership in production: deployment, monitoring, incident response, on-call (S3); cloud and
  Terraform (S2). AI-assisted development and test automation (S1, S2).
- Certificates are rarely asked for. Languages: very good German for local firms (S1, S4);
  English codebases with German as a plus (S2); English, national languages a plus (S3).

### Keywords (DE / EN)

| Keyword | German term | Seen in |
|---|---|---|
| Java, Jakarta EE, Quarkus, Maven | – | S3 |
| C#, .NET, ASP.NET Web API | – | S1, S4 |
| TypeScript, React, Angular | – | S1, S2, S4 |
| Relational databases, PostgreSQL, MS SQL Server | relationale Datenbanken | S2, S3, S4 |
| Object-oriented development, design principles | objektorientierte Software-Entwicklung, Design-Prinzipien | S1, S4 |
| Software architecture principles | Software-Architektur-Prinzipien | S4 |
| Code reviews, clean and testable code | – | S2, S3 |
| Test automation (Vitest, Jest) | Test-Automation | S1, S4 |
| CI/CD, build pipelines, Git | Build Pipelines | S2, S3, S4 |
| Docker, Kafka, Linux | – | S3 |
| Monitoring, incident response, on-call | – | S3 |
| AI-assisted development | AI-gestützte Software-Entwicklung | S1, S2 |
| Develop, test and document features | Funktionen erarbeiten, testen und dokumentieren | S1 |

### Section order and what goes first

- Header with role and core stack; Profil with years, domain and the strongest proof.
- Berufserfahrung right after the strengths, with a context line and "Stack:" line.
- Juniors and career changers: Projekte with repository links right after the strengths.
- Frontend roles: a link to a live product or portfolio next to the contact details.
- Weitere Kenntnisse: Languages · Frameworks · Data · Cloud & DevOps · Tools.

### Example bullets (fictional)

- Built a payment status API in Java and Quarkus that serves 4 million requests a day at a
  p95 latency under 120 ms.
- Moved releases from monthly to daily by introducing trunk-based development, automated
  tests and a GitLab CI pipeline.
- Migrated a legacy AngularJS client to Angular and TypeScript module by module, without
  downtime.
- Cut the checkout error rate by 40 % after tracing failures with OpenTelemetry and fixing
  the retry logic.
- Reviewed code for a team of six and mentored two junior developers to their first
  production releases.
- DE: Entwickelte eine Web-Applikation in C# (.NET) und React für die Auftragserfassung von
  300 Anwenderinnen und Anwendern.
- DE: Verkürzte die Laufzeit der CI-Pipeline von 25 auf 8 Minuten durch parallele Tests und
  Caching.

### Job ads seen

| Id | Title | Employer | Place | Date | Link |
|---|---|---|---|---|---|
| S1 | Senior Softwareentwickler/Softwareentwicklerin (w/m/d) | Galenica (for Aquantic AG) | Rheinfelden AG | 2026-09-22 | https://www.linkedin.com/jobs/view/4461507964 |
| S2 | Senior Software Engineer Fullstack (f/m/d) | Valora Group | Zurich | 2026-09-21 | https://www.linkedin.com/jobs/view/4468774165 |
| S3 | Backend Software Engineer (Java) | Worldline | Biel/Bienne | 2026-09-25 | https://www.linkedin.com/jobs/view/4471884959 |
| S4 | Senior Web Frontend Entwickler:in 80–100 % | inova:solutions AG | Ostermundigen (Bern) | 2026-09-17 | https://www.linkedin.com/jobs/view/4466254296 |

## 2. IT operations, cloud and platform engineering (incl. DevOps/SRE)

### What recruiters expect

- Kubernetes everywhere: OpenShift or EKS, Helm, GitOps with Argo CD, Crossplane and operators
  in Go (O1, O2, O3). Infrastructure as code with Terraform, Ansible or Puppet (O3, O4);
  Azure landing zones, Entra ID, Azure DevOps and PowerShell in Microsoft shops (O4).
- Platform as a product: an internal developer platform with self-service and golden paths
  (O1, O2); policy as code and supply chain security (O1).
- Reliability: SLIs, SLOs, error budgets; observability with Prometheus, Grafana, Elastic or
  OpenTelemetry; canary releases; Linux, TCP/IP, DNS, load balancing (O3).
- Operations duty: third-level support and on-call (O3), second- and third-level incidents
  (O4). Enabling other teams through documentation, workshops and pairing (O2, O4).
- Education: HF or FH in computer science (O1), or an IT apprenticeship with experience (O4);
  three years or more (O2, O3).
- Certificates: CKA, CKAD or CKS as a plus, "equivalent hands-on" experience accepted (O3).
  None of these ads required a cloud certificate.
- Languages: very good German and good English (O1); both at least B2 (O4); English and
  conversational French in Romandie (O3).

### Keywords (DE / EN)

| Keyword | German term | Seen in |
|---|---|---|
| Kubernetes, OpenShift, Helm | – | O1, O2, O3 |
| GitOps, Argo CD | GitOps-Konzepte | O1, O3 |
| Crossplane, Kubernetes operators, Go | – | O1, O2 |
| Internal developer platform, platform as a product | Internal Developer Platform, «Platform as a Product» | O1, O2 |
| Self-service, golden paths | Self-Service-Funktionalitäten | O1, O2 |
| Infrastructure as code, Terraform | Infrastructure-as-Code-Module | O3, O4 |
| Azure landing zones, Entra ID | Standardisierung von Azure-Plattformen | O4 |
| CI/CD, supply chain security, policy as code | automatisierte Softwarelieferkette | O1, O2 |
| SLI, SLO, error budgets, observability | – | O3 |
| Service mesh (Istio, Linkerd), mTLS | – | O3 |
| Architecture, lifecycle management, operations | Architektur, Lifecycle Management und Betrieb | O1 |
| Incidents and service requests (2nd/3rd level) | Service Requests und Incidents | O3, O4 |
| Enabling and advising teams | Beratung und Befähigung von Teams | O2, O4 |
| Scripting (Python, PowerShell, Bash) | Scripting | O2, O3, O4 |

### Section order and what goes first

- Header with the platform focus ("Platform Engineer · Kubernetes, Terraform, Azure").
- Profil names environment size and operating model (24/7, on-call). A certificate the ad
  names is said once: on application pages the base guide puts it in the letter.
- Each position opens with an environment line: clusters, services, users, uptime target.
- Weitere Kenntnisse: Cloud · Containers · IaC · CI/CD · Observability · Scripting.

### Example bullets (fictional)

- Built an internal developer platform on Kubernetes and Argo CD that lets 25 product teams
  deploy through self-service templates.
- Automated Azure landing zones with Terraform modules, cutting the set-up of a new
  environment from two weeks to one day.
- Defined SLOs and error budgets for 12 customer-facing services and reduced mean time to
  recovery from 90 to 25 minutes.
- Migrated 60 Java services from virtual machines to OpenShift with canary releases and no
  customer-facing downtime.
- Trained four application teams to write their own pipelines through workshops and runbooks.
- DE: Betrieb und Weiterentwicklung einer Kubernetes-Plattform mit 3 Clustern und rund 400
  Services im 24/7-Betrieb, inklusive Pikettdienst.
- DE: Standardisierte die Infrastruktur mit Terraform-Modulen und senkte die monatlichen
  Cloud-Kosten um 18 %.

### Job ads seen

| Id | Title | Employer | Place | Date | Link |
|---|---|---|---|---|---|
| O1 | Platform Engineer | PostFinance | Bern | 2026-09-24 | https://www.linkedin.com/jobs/view/4462424931 |
| O2 | Platform Engineer – Infrastructure Control Plane & Workflow Automation | Julius Baer | Zurich | 2026-09-17 | https://www.linkedin.com/jobs/view/4399483297 |
| O3 | Site Reliability Engineer – Cloud Operations | Swissquote | Gland | 2026-09-19 | https://www.linkedin.com/jobs/view/4460385083 |
| O4 | Senior IT System Engineer «Platform Services» 80–100 % | Geberit Schweiz | Rapperswil-Jona | 2026-09-18 | https://www.linkedin.com/jobs/view/4467853476 |

## 3. Data and AI (data engineering, data science, ML engineering)

### What recruiters expect

- Data engineering: streaming and batch pipelines (Apache Beam, Dataflow, PySpark), BigQuery,
  Python APIs with FastAPI, pytest, four years or more (D1). In banks: data warehouse, Microsoft
  Fabric, SAP and core banking systems, regulated settings and sensitive data (D2).
- Data science: statistics, segmentation, Python and dashboards, and above all recommendations
  that non-technical leaders can act on; a master's or PhD (D3). In industry: machine learning
  and computer vision applications, sub-project lead, code quality rules (D4).
- ML engineering: LLM applications in production, agentic systems, evaluations, MLOps, Python
  with PyTorch or LangChain, AWS, RAG and fine-tuning, five years or more (D5).
- Domain knowledge counts: banking and regulatory reporting (D2), MedTech (D3), pharma and
  machine building (D4).
- No certificates were asked for. With a PhD, ETH advises the thesis title and, for industry,
  only a few selected publications [2].

### Keywords (DE / EN)

| Keyword | German term | Seen in |
|---|---|---|
| Streaming and batch pipelines, Apache Beam, Dataflow | Datenlieferstrecken | D1, D2 |
| BigQuery, Bigtable, PySpark | – | D1 |
| Data warehouse, data management | Data Warehouse, Datenmanagement | D2 |
| Microsoft Fabric, cloud data platform | cloudbasierte Datenplattformen | D2 |
| Data modelling, data products | Datenquellen modellieren, Datenprodukte | D1, D2 |
| KPIs from several sources | aussagekräftige Kennzahlen | D2 |
| Regulatory reporting, sensitive data | aufsichtsrechtliches Reporting, sensible Daten | D2 |
| Python, FastAPI, pytest | – | D1, D3, D5 |
| Statistics, segmentation, dashboards | Statistik | D3, D4 |
| Machine learning, computer vision | Machine-Learning-Verfahren, Computer Vision | D4, D5 |
| LLMs, RAG, agentic systems, evaluations, MLOps | – | D5 |
| Sub-project lead, code quality | Teilprojektleitung, Code-Qualitätsrichtlinien | D4 |

### Section order and what goes first

- Header names the track: Data Engineer, Data Scientist or ML Engineer. They share tools, not
  expectations; do not blur them.
- Profil names data volumes or model types and the domain.
- For data science, one point per position says which decision the analysis changed.
- With a PhD: thesis title under Ausbildung, one to three selected publications after it [2].
- Weitere Kenntnisse: Languages · Data platforms · ML frameworks · Visualisation.

### Example bullets (fictional)

- Built a streaming pipeline in Apache Beam that loads 2 billion events a month into BigQuery
  with an end-to-end delay under one minute.
- Segmented 80,000 product users by usage and presented four profiles that shaped the next
  product roadmap.
- Deployed a retrieval-augmented support assistant and built a 500-question evaluation set
  that catches quality regressions before release.
- Reduced model inference cost by 35 % through quantisation and request batching.
- Replaced 30 manual spreadsheet reports with one governed dashboard used by 150 people a week.
- DE: Konzipierte Datenlieferstrecken aus dem Kernbankensystem in eine Cloud-Datenplattform
  und stellte 40 Kennzahlen für das Risk Reporting bereit.
- DE: Entwickelte ein Computer-Vision-Modell für die Qualitätskontrolle, das die Fehlerquote
  in der Endprüfung um 25 % senkte.

### Job ads seen

| Id | Title | Employer | Place | Date | Link |
|---|---|---|---|---|---|
| D1 | Senior Data Engineer | Futurae Technologies AG | Zurich | 2026-09-21 | https://www.linkedin.com/jobs/view/4467618577 |
| D2 | Data Engineer – banksteuerndes und aufsichtsrechtliches Reporting | aity AG | Liebefeld (Bern) | 2026-09-21 | https://www.linkedin.com/jobs/view/4469901602 |
| D3 | Data Scientist (m/f/d) | Sonova Group | Stäfa | 2026-09-22 | https://www.linkedin.com/jobs/view/4461721508 |
| D4 | Data Scientist (m/w/d) | Körber Pharma | Grabs | 2026-09-24 | https://www.linkedin.com/jobs/view/4471460242 |
| D5 | Senior AI Machine Learning Engineer | Nexthink | Lausanne | 2026-09-20 | https://www.linkedin.com/jobs/view/4422984564 |

## 4. Cybersecurity (security engineering, SOC, security architecture)

### What recruiters expect

- Security engineering: vulnerability management (OWASP, CVSS, CVE), penetration tests,
  incident containment and root-cause analysis, cloud security, Kubernetes, Linux, IaC and
  Git, SIEM or pentest tools; two to five years; English at C1 (SEC1).
- SOC: SIEM, network and endpoint alerts, triage, threat hunting for indicators of compromise,
  MITRE ATT&CK, KQL and SQL, incident reports and runbooks, Python; two to four years in a SOC
  or CSIRT; a rotating 24/7 shift model (SEC2). Microsoft Sentinel and Defender and direct
  customer work at a service provider (SEC3).
- Architecture: IAM, network security and Zero Trust, application and API security, data
  protection, threat modelling, ISO 27001, NIST, CIS (SEC4); standards and guidelines, risk
  reviews as second line of defence, PCI DSS for card processing (SEC5, SEC6); five years in a
  senior role (SEC4, SEC6).
- Certificates weigh more here than anywhere else in the Branche. Seen as a plus: CompTIA
  Security+, CySA+, GSEC, GCIA, GCIH, CEH (SEC2); CISSP, CCSP, CCIE Security (SEC5); CISSP,
  CISM, SABSA, TOGAF (SEC6). CISSP requires five years of full-time experience in two of its
  eight domains; after the exam without that experience the title is "Associate of ISC2", and
  the CV says exactly that [15].
- Degree in computer science or information security (SEC2, SEC3, SEC5, SEC6); very good
  German and English in most Swiss ads (SEC3, SEC5), C1 in both for the SOC (SEC2).

### Keywords (DE / EN)

| Keyword | German term | Seen in |
|---|---|---|
| Vulnerability management, OWASP, CVSS, CVE | Schwachstellen aufspüren und bewerten | SEC1, SEC3 |
| Penetration testing | Penetrationstests | SEC1, SEC2 |
| Incident handling, containment, root-cause analysis | Sicherheitsvorfälle eindämmen, Root-Cause-Analyse | SEC1, SEC2, SEC3 |
| SIEM, XDR, EDR, Microsoft Sentinel and Defender | – | SEC1, SEC2, SEC3 |
| Threat hunting, IOCs, MITRE ATT&CK | Threat Hunting | SEC2 |
| KQL, SQL, Python scripting | Abfragesprachen | SEC2, SEC3 |
| Incident reports, runbooks, 24/7 shifts | Dokumentation von Security Incidents, 24/7/365-Schichtmodell | SEC2 |
| Security architecture, threat modelling | Sicherheitsarchitektur | SEC1, SEC4, SEC6 |
| IAM, Zero Trust, network security | Netzwerksicherheit | SEC4, SEC5 |
| Security standards and guidelines, risk analysis | Security-Standards und -Richtlinien, Risikoanalysen | SEC5 |
| Second line of defence | 2nd Line of Defense | SEC5 |
| ISO 27001, NIST CSF, CIS, PCI DSS | – | SEC4, SEC5, SEC6 |
| Training engineers, guardrails | technische Teams schulen, Guardrails | SEC1 |

### Section order and what goes first

- Header with the track: Security Engineer, SOC Analyst L2 or Security Architect.
- A certificate the ad names is said once, with official name and year: in the profile, or
  on application pages in the letter as the base guide says. Mark an expired one or leave it out.
- Berufserfahrung describes environments by type and size, never by client or system name.
- SOC CVs state tooling and shift experience; architecture CVs state frameworks and the scope
  of reviews (number of systems, cloud or on-premise, regulated or not).
- Weitere Kenntnisse: Detection · Cloud & platform · Frameworks · Scripting.

### Example bullets (fictional)

- Ran monthly vulnerability scans across 600 hosts and brought the median time to patch
  critical findings from 30 to 7 days.
- Wrote 25 detection rules in KQL mapped to MITRE ATT&CK techniques, cutting false positives
  by a third.
- Performed threat modelling for ten new cloud applications and set their security
  requirements before the build started.
- Added static analysis and dependency scanning to the CI pipelines of 30 repositories.
- Authored the network security standard for a hybrid cloud and reviewed project designs
  against it.
- DE: Führte Penetrationstests nach OWASP für 8 Webapplikationen durch und begleitete die
  Teams bis zur Behebung aller kritischen Schwachstellen.
- DE: Baute ein Vulnerability Management mit Priorisierung nach CVSS auf und senkte die Zahl
  offener kritischer Schwachstellen um 60 %.

### Job ads seen

| Id | Title | Employer | Place | Date | Link |
|---|---|---|---|---|---|
| SEC1 | Security Engineer (m/w/d) 80–100 % | bexio AG | Rapperswil-Jona | 2026-09-24 | https://www.linkedin.com/jobs/view/4469397248 |
| SEC2 | SOC Analyst L2 / Security Analyst L2 | Senthorus | Zurich | 2026-09-17 | https://www.linkedin.com/jobs/view/4467801674 |
| SEC3 | Cybersecurity Operations Engineer | Swisscom | Bern | 2026-09-14 | https://www.linkedin.com/jobs/view/4467030780 |
| SEC4 | Cyber Security Architect (m/f/d) | Generali Switzerland | Adliswil | 2026-09-16 | https://www.linkedin.com/jobs/view/4467919215 |
| SEC6 | Senior IT Security Architect | Viseca | Bioggio | 2026-09-24 | https://www.linkedin.com/jobs/view/4354612549 |

## 5. Product management and product ownership

### What recruiters expect

- Product owner: owns and prioritises the backlog; analyses requirements with customers,
  business analysts and developers; understands interfaces, data flows and integration;
  represents the product to customers; supports tenders (P1). Scaled: SAFe and PI planning,
  product KPIs, delivery on time and budget (P2).
- Product manager: business responsibility; vision, strategy and roadmap; product discovery
  and evidence-based decisions; go-to-market; proven, measurable customer and business impact;
  five years or more in complex B2B products (P3). Seven to ten years in B2B SaaS, launches,
  adoption, activation, retention, a sense for UX and a technical background (P4).
- Technical product management in hardware firms: agile requirements engineering in SAFe and
  structured specifications across hardware, firmware, software and cloud (P5).
- Domain knowledge is often a must: population registers (P1), health insurance claims (P2),
  identity and application security (P3, P4), fire detection (P5).
- Education: FH or university, technical or business (P3); business informatics (P2);
  engineering FH or HF (P5). SAFe is named as desirable (P2); Scrum product owner certificates
  were not named, so they belong in Weiterbildung, not the headline.
- Very good German in every German-language ad (P1, P2, P3, P5); English only in P4.

### Keywords (DE / EN)

| Keyword | German term | Seen in |
|---|---|---|
| Product backlog, prioritisation | Product Backlog verantworten und priorisieren | P1, P2, P5 |
| Requirements analysis and engineering | Anforderungen analysieren und bewerten, Requirements Engineering | P1, P2, P5 |
| Stakeholder management | Anspruchsgruppen koordinieren | P1, P2 |
| Interfaces, data flows, system integration | Schnittstellen, Datenflüsse, Systemintegrationen | P1 |
| Vision, strategy, roadmap | Produktvision und -strategie, Roadmaps | P3, P4, P5 |
| Product discovery, evidence-based decisions | evidenzbasierte Entscheidungsfindung | P3 |
| Go-to-market | Go-to-Market-Strategie | P3 |
| Product KPIs, adoption, activation, retention | KPIs zur Bewertung des Produkterfolgs | P2, P4 |
| SAFe, PI planning | SAFe, PI | P2, P5 |
| Tenders and offers | Ausschreibungen und Angebote | P1 |
| Business responsibility, market success | Business-Verantwortung, Markterfolg | P3, P5 |

### Section order and what goes first

- Header with role, product type and domain ("Product Owner · B2B insurance software").
- Profil: years in product roles, market, domain, number of development teams, one outcome
  with a number.
- Each position names the product and its users, then outcomes (adoption, retention, revenue,
  time to market) before activities (backlog, ceremonies).
- Technical understanding shows in the points (interfaces, data, APIs) and in Weitere
  Kenntnisse (Jira, SQL, analytics tools). Link public launches or a portfolio [16].

### Example bullets (fictional)

- Owned the backlog of a B2B onboarding product and prioritised it with three development
  teams in quarterly PI planning.
- Launched a self-service portal that 45 % of business customers adopted within six months.
- Raised 30-day retention from 62 % to 71 % after twelve discovery interviews showed where new
  users dropped off.
- Defined five product KPIs and a monthly review that the steering committee uses for funding
  decisions.
- Prepared the product part of three public tenders with sales and solution architects.
- DE: Verantwortete das Product Backlog einer Applikation für die Schadenbearbeitung und
  priorisierte die Anforderungen von 5 Versicherungskunden.
- DE: Entwickelte mit Sales und Marketing die Go-to-Market-Strategie für ein neues Modul, das
  im ersten Jahr 20 Neukunden gewann.

### Job ads seen

| Id | Title | Employer | Place | Date | Link |
|---|---|---|---|---|---|
| P1 | Product Owner Personenregister 80–100 % | Abraxas Informatik AG | Zürich-Flughafen | 2026-09-25 | https://www.linkedin.com/jobs/view/4472085561 |
| P2 | Product Owner Claims | Centris AG | Solothurn | 2026-09-15 | https://www.linkedin.com/jobs/view/4467719211 |
| P3 | Senior Product Manager – Identity & Application Security | Ergon Informatik AG | Zurich | 2026-09-24 | https://www.linkedin.com/jobs/view/4459985308 |
| P4 | Senior Product Manager B2B (VPN) | Proton | Geneva | 2026-09-18 | https://www.linkedin.com/jobs/view/4459865897 |
| P5 | Senior Produktmanager Technik 80–100 % | Securiton AG | Zollikofen | 2026-09-16 | https://www.linkedin.com/jobs/view/4459175310 |

## 6. Research (industrial R&D and academic research)

### What recruiters expect

- Corporate labs: PhD or equivalent, often with years of experience (six or more in R1); a
  consistent publication record at top venues (R1, R2); open-source code and reproducible
  results (R1, R3); prototypes, patent applications and technical reports that reach products
  (R2); strong programming in Python, C/C++, Rust, Java or Scala (R1–R3). Research engineer
  roles may ask for a master's, PhD a plus, and weigh systems experience over papers (R3).
- Academic posts: PhD or near completion; publications relative to career stage in leading
  journals and conferences; CV with publication list, research statement of up to three pages,
  cover letter, three referees (R4). Doctoral posts: master's, full transcripts, one-page
  motivation letter, two referees; teaching and supervising master's theses (R5).
- Swiss conventions [2]: ETH awards "Doctor of Science (Dr. sc. ETH Zürich)"; "PhD" is the
  colloquial English term. The doctorate appears twice: under Ausbildung with thesis title,
  chair and university, and under Berufserfahrung as research assistant with teaching,
  supervision and projects. For industry: at most three selected publications, no conference
  list, professors named only if widely known. For academia: thesis details, methods,
  conferences and professors' names.
- Swiss National Science Foundation CV (for grants): education, employment, one to three
  major achievements as short narratives with at most ten selected outputs (articles, data
  sets, software, patents), net academic age, ORCID iD [10]. Following DORA, no citation
  metrics, journal rankings, impact factors or h-index [10][11]. Leave these out of CVs for
  Swiss academic posts too unless the ad asks for them.
- Early-career grants count: travel and conference grants belong in the CV; teaching entries
  state level and format [14].

### Keywords (DE / EN)

| Keyword | German term | Seen in |
|---|---|---|
| PhD, doctorate | Doktorat, Dissertation | R1, R2, R4 |
| Publication record, top-tier venues | Publikationsliste | R1, R2, R4 |
| Research statement, referees | Referenzen | R4, R5 |
| Open-source code, reproducibility | – | R1, R3, R4 |
| Prototypes, patent applications, technical reports | Prototypen, Patentanmeldungen | R2 |
| Technology transfer to products | – | R2 |
| Teaching, supervising master's theses | Lehre, Masterarbeiten betreuen | R5 |
| Research network, collaboration | – | R2, R4 |
| Distributed systems, Spark, Flink | – | R3 |
| Third-party funding, grants | Drittmittel | [10][14] |

### Section order and what goes first

- Industry research CV (two to three pages): header with research field; Profil with PhD
  topic and strongest result; Kernkompetenzen; Berufserfahrung including the doctorate;
  Ausbildung with thesis title; up to three selected publications with a link to the full
  list on Google Scholar or ORCID; patents; Weitere Kenntnisse.
- Academic CV: the most important information in the first half of page one [14]. Ausbildung
  (thesis, supervisor), research positions, publications by type with status (published,
  accepted, under review, in preparation) [13][14], talks and posters (say which) [14], grants
  and awards, teaching, supervision, service (reviewing, committees), skills, languages,
  referees. Newest first in each section [13][14].
- Length: no fixed limit, but concise and in proportion to the career stage [13][14].

### Example bullets (fictional)

- Developed a verification method for concurrent data structures and published it as first
  author at a peer-reviewed systems conference.
- Built an open-source benchmarking toolkit for graph algorithms that three external research
  groups now use.
- Supervised five master's theses, two of which led to workshop papers.
- Transferred a prototype anomaly detector to a product team and co-filed one patent
  application.
- Co-wrote a funded proposal for CHF 300,000 of third-party funding over three years.
- DE: Entwickelte im Rahmen der Dissertation ein Verfahren zur Fehlererkennung in Sensordaten
  und publizierte die Resultate in 3 begutachteten Beiträgen.
- DE: Betreute 4 Masterarbeiten und leitete die Übungen der Vorlesung «Verteilte Systeme» für
  60 Studierende.

### Job ads seen

| Id | Title | Employer | Place | Date | Link |
|---|---|---|---|---|---|
| R1 | Research Scientist, AI RL and LLMs | NVIDIA | Zurich | 2026-09-17 | https://www.linkedin.com/jobs/view/4458300947 |
| R2 | Research Scientist in Operational Technology (OT) Cybersecurity 80–100 % | ABB Research | Baden-Dättwil | 2026-09-26 | https://www.linkedin.com/jobs/view/4467574897 |
| R3 | Research Engineers / Research Scientists: Next-Generation Data Systems (Ref. 2025_016) | IBM Research Europe | Rüschlikon | no date shown, open 2026-09-27 | https://www.zurich.ibm.com/careers/2025_016.html |
| R4 | Postdoc: Keystone Project (Machine-Verified LLM Inference) | EPFL | Lausanne | 2026-09-25 | https://www.linkedin.com/jobs/view/4470312241 |
| R5 | Doctoral Student in Design and Analysis of Human-AI Systems | ETH Zürich (via ETH get hired) | Zurich | 2026-09-27 | https://www.linkedin.com/jobs/view/4472419965 |

IBM Research Zurich also lists a PhD position on proof systems (Ref. 2026_022) that asks for
a CV and two referees: https://www.zurich.ibm.com/careers/2026_022.html [17].

## Notes for the designer

- Stack at a glance: role and core stack in the header, a "Stack:" line per position. Chips are
  fine on the web page; the PDF needs plain text an ATS can read [2].
- No skill bars, dots or percentages [2]; levels, where needed, are words.
- Numbers carry the proof: tabular figures help them line up and scan.
- Links (GitHub, portfolio, Scholar, ORCID) sit with the contact details and print in full.
- Certificates as a compact text row with year; no vendor badges or logos (base guide: no
  trademarks).
- The research variant needs a long publication list: hanging indent, status labels, page
  numbers, stable over three or more pages.
- Sober and high-contrast. A monospaced face may mark code terms, sparingly.

## Sources

Job ads are listed with their links in each sub-sector's table.

[1] Harvard College Guide to Creating a Strong Resume, Harvard FAS Mignone Center for Career Success, https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/, accessed 2026-09-27
[2] Application Guide for ETH students and doctoral students (2024, English), ETH Zürich Career Center, https://ethz.ch/content/dam/ethz/main/industry/career-center/Bewerbungsratgeber/2024_BRG_EN.pdf, accessed 2026-09-27
[3] Career toolkit: Crafting an effective resume, MIT Career Advising & Professional Development, https://capd.mit.edu/resources/career-toolkit-crafting-an-effective-resume/, accessed 2026-09-27
[4] Resumes: Writing about your skills, MIT Career Advising & Professional Development, https://capd.mit.edu/resources/resumes-writing-about-your-skills/, accessed 2026-09-27
[5] Brief resume guide (Developing your resume), Stanford Career Education, https://careered.stanford.edu/sites/g/files/sbiybj22801/files/media/file/developing_your_resume_handout.pdf, accessed 2026-09-27
[6] My Personal Formula for a Winning Resume, Laszlo Bock (then SVP People Operations, Google), LinkedIn, 2014, https://www.linkedin.com/pulse/20140929001534-24454816-my-personal-formula-for-a-better-resume, accessed 2026-09-27
[7] Lebenslauf erstellen, jobs.ch Job Coach, https://www.jobs.ch/de/job-coach/ratgeber-checklisten/lebenslauf-erstellen/, accessed 2026-09-27
[8] Perfect application dossier: Optimise your CV, cover letter & references, Hays Switzerland, https://www.hays.ch/en/applicants/career-tips/application, accessed 2026-09-27
[9] Make your CV work for you, Michael Page Switzerland, https://www.michaelpage.ch/advice/career-advice/cover-letter-and-cv-advice/make-your-cv-work-you, accessed 2026-09-27
[10] Your curriculum vitae – all about the CV format, Swiss National Science Foundation, https://www.snf.ch/en/gKcnwW6aEft4bMPF/page/your-curriculum-vitae-all-about-the-cv-format, accessed 2026-09-27
[11] DORA declaration, Swiss National Science Foundation, https://www.snf.ch/en/neSdcJ948w1y33Nj/topic/dora-declaration, accessed 2026-09-27
[12] Resumes and CVs, Cornell University Graduate School, https://gradschool.cornell.edu/career-and-professional-development/pathways-to-success/prepare-for-your-career/take-action/resumes-and-cvs/, accessed 2026-09-27
[13] CVs for Faculty Job Applications, University of Pennsylvania Career Services, https://careerservices.upenn.edu/application-materials-for-the-faculty-job-search/cvs-for-faculty-job-applications/, accessed 2026-09-27
[14] 38 tips on writing an academic CV, Naturejobs blog (Nature), 2011, https://blogs.nature.com/naturejobs/2011/09/27/38-tips-on-writing-an-academic-cv/, accessed 2026-09-27
[15] CISSP experience requirements, ISC2, https://www.isc2.org/certifications/cissp/cissp-experience-requirements, accessed 2026-09-27
[16] Product manager resume templates, Aha!, https://www.aha.io/roadmapping/guide/templates/product-manager-resumes, accessed 2026-09-27
[17] Careers at IBM Research Europe, Zurich, IBM Research, https://www.zurich.ibm.com/careers/, accessed 2026-09-27
[18] Resumes/Cover letters (examples), Stanford Career Education, https://careered.stanford.edu/sites/g/files/sbiybj22801/files/media/file/resume-and-cover-letter-examples.pdf, accessed 2026-09-27
