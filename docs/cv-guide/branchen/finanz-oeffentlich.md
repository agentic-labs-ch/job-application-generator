# Finanz & Öffentlich (banking, audit, IT audit, finance, trading, insurance, public sector)

Researched 2026-09-27 for the CV generator. Rules for CVs of other people in this Branche; `docs/cv-guide.md` stays the base rule set. Sources are listed at the end, numbered [1], [2] …

Job ads carry short ids per sub-sector (B banking, A audit, I IT audit, F finance, T trading,
V insurance/Versicherung, P public). All were public LinkedIn job pages that opened without
login, or a jobs.ch page, seen on 2026-09-27. LinkedIn shows only relative ages ("1 week
ago"), so the date in each ad table is the posting date worked out from that label (~ means
approximate). Ads age quickly: check them before relying on a keyword. Recruiter ads are
marked; their client is not named.

## How readers in this Branche read a CV

- The first human pass is seconds long. jobs.ch writes that the first six seconds decide
  whether a hiring manager looks closer [5]. Michael Page Switzerland: the first half of the
  CV must show seniority, experience and functional knowledge at once [8].
- In finance, readers check hard facts first: specific systems and language skills; soft
  skills come second [8]. In the ads the filters are certificates (CISA, CIA, dipl.
  Wirtschaftsprüfer, Aktuar SAV, VBV), standards (Swiss GAAP FER, IFRS, OR), systems (SAP,
  Avaloq, FactSet) and languages (A1, I1, B3, F3, V1, V2).
- Software often reads first. Hays tells applicants to use the ad's keywords so that
  automated tools do not sort them out [7]; jobs.ch explains how an ATS filters on keywords
  and prefers plain layouts [6]. Exceptions exist: PwC Switzerland states that it uses no AI
  or automated tools to evaluate candidates [10].
- Precision is itself tested. Deloitte Switzerland calls spelling mistakes and poor formatting
  "huge red flags" and reads a seven-page CV as a sign the candidate cannot report concisely
  [9]. Penn stresses that attention to detail is "extremely important" for banking [11].
- The chronology is checked for gaps. Hays: gap-free dates are a must [7]; Deloitte asks
  applicants to say what they did in a gap [9]. Titles and dates are compared with the
  Arbeitszeugnisse, which Swiss employers expect in the dossier [7][9] (P2).
- Protected titles are checked. Audit licences are granted by the RAB [17], insurance
  intermediaries need the VBV exam [21], and the CFA Institute prescribes how the CFA may be
  named [12]. A wrong title reads as a misstatement, not a typo.
- In private banking the reader asks one question: can the adviser bring clients? Recruiters
  assess AuM portability, revenue quality and compliance history before any introduction [20].
- Public employers recruit per unit, through their own portal, and ask for the full dossier
  (letter, CV, Arbeitszeugnisse, diplomas) [27] (P2). Language skills in the official
  languages are a formal requirement, with fixed levels by pay class [23].

## Common to all sub-sectors

### Length and format

- Pages: two A4 pages for experienced people in Swiss firms [3][7]; a third page only for long
  careers [2][7]. One page for graduates and for English CVs to investment banks and US or UK
  firms [1][11]. Quant CVs stay short; list publications briefly [13].
- Photo: usual in Switzerland but not required [7]; UZH calls it optional unless the ad asks
  for it [2]; HSG recommends it for DACH [3]. Harvard and CQF advise against photos on
  US-style and quant CVs [1][13]. Generator default: photo on for German-language CVs to Swiss
  banks, insurers, audit firms and public employers; off for one-page English CVs to
  international investment banks and trading firms.
- Dates: month and year, newest first, e.g. `09/2022 – 06/2025` [2]; this project writes
  `MM.YYYY – MM.YYYY`. No signature, place or date on the CV: it is not customary in
  Switzerland [2].
- Numbers: in German use the Swiss apostrophe (CHF 1'250'000) or `Mio.`/`Mrd.`; in English
  `CHF 1.25m` / `CHF 2bn`. Keep one style per CV.
- Languages: mother tongue first [4], then the others with a level (Muttersprache,
  verhandlungssicher or CEFR A1–C2) [2]; base guide section 2 row 7 decides when to name a
  CEFR level. In the federal administration "active" means B2 and "passive" B1 [23].
- Format: PDF, plain fonts, one column, no tables or images in the text flow [6][7]. Keep
  skill bars out: they cannot be read by an ATS and cannot be verified.
- Private data (date of birth, nationality, permit) is expected by many Swiss employers [2]
  but stays in the private dossier under `docs/source-of-truth.md`, never on a public page.

### Section order

Experienced (default for this Branche):

| # | Section | Note |
|---|---|---|
| 1 | Header | Target role, name; full designations as post-nominals (CFA, CISA, CIA) |
| 2 | Profil | 3–4 sentences: role, years, segment or standard, strongest proof [5] |
| 3 | Kernkompetenzen | Three, each answering a must-requirement of the ad |
| 4 | Berufserfahrung | Newest first; scope line (book, mandates, budget) before the bullets |
| 5 | Zertifikate & Weiterbildung | Moves up to position 3 when the ad makes it a must (CISA, VBV, dipl. Wirtschaftsprüfer) |
| 6 | Ausbildung | Degree, institution, place |
| 7 | Sprachen | Up to position 4 for public roles and multilingual client desks |
| 8 | IT / Systeme | SAP modules, Avaloq, Bloomberg, Python, Power BI, as named in the ad |
| 9 | Kontakt & Persönliches | As base guide |

Graduates and one-page English CVs: Education first (with grades if strong), then experience,
then skills and interests [3][11].

### Tone and verbs

- Sober, factual, past tense for past roles, no "I" [1]. Readers here distrust hype; the
  base guide already asks for sober verbs in banks and insurance.
- Harvard verbs that fit well: Analyzed, Audited, Allocated, Appraised, Budgeted, Calculated,
  Forecasted, Projected, Reviewed, Evaluated, Examined, Inspected, Verified, Validated,
  Reconciled, Consolidated, Executed, Structured, Monitored, Negotiated, Advised, Prepared,
  Drafted, Reported, Coordinated, Supervised, Led (with a lead role in the evidence) [1].
- Use with care or avoid: Spearheaded, Orchestrated, Energized and similar hype words,
  Maximized, Convinced, Persuaded. In audit and public roles, verbs of persuasion clash with
  the independence the job requires; "Managed" alone says little [1].
- Extra verbs typical here (not in the Harvard list): Tested (controls), Assessed (risks),
  Remediated, Onboarded (clients), Acquired (clients, net new money), Priced, Underwrote,
  Hedged, Closed (the books), Modelled, Documented (KYC), Signed off.
- German CVs in this Branche often use the nominal style ("Prüfung von Jahres- und
  Konzernabschlüssen nach Swiss GAAP FER"). It is accepted; keep one style per CV and put
  the result in the same line.

### Numbers to show

| Type | Fictional example |
|---|---|
| Size of book or scope | 160 affluent clients, CHF 230m AuM |
| Growth | Net new money CHF 14m in 2025 |
| Mandates and entities | 12 audit engagements, 3 as in-charge |
| Speed or quality | Month-end close from D+9 to D+5 |
| Risk and control | 120 key controls tested, 6 findings closed on time |
| Transactions | 5 sell-side deals, total CHF 900m (public deals only) |
| Budget | Unit budget CHF 38m, variance explained to the finance director |
| Volume in public work | 250 Verfügungen per year, processing time from 20 to 12 days |

Confidentiality limits the numbers: no client names (Swiss bank-client confidentiality),
deal names only when public, trading P&L as a range or share of desk target. When a number
is not in a reference or the approved dataset, it stays out (base guide section 3).

### What to avoid

- Duties without results ("responsible for the audit of…") [1].
- Unexplained gaps [7][9], long CVs [9], typos [9].
- Certificates claimed early: "CISA (expected)", "CFA Level II" after the name [12]. Write
  "Passed Level II of the CFA Program" or "CISA exam passed, certification pending".
- Colour, logos, icons, rating bars; creative layouts read as unserious here [6][13].
- Client names, internal system names that are confidential, figures from non-public deals.
- A photo on a US-style one-page CV to an international bank or trading firm [1][13].

## Banking (retail, private banking & wealth management, investment banking)

### What recruiters expect

- Retail and affluent (Privat- und Affluentkunden): bank training (Bankausbildung) or a
  business degree, further training such as FA Finanzplaner or a Banking & Finance bachelor
  (B1); years with an own client book (eigenes Kundenbuch) (B2); advisory in investing,
  financing and retirement (Anlegen, Finanzieren, Vorsorge) (B1, B2); local network and the
  region's languages, e.g. German and French in Biel (B2).
- Certification: many Swiss banks certify client advisers with SAQ (Kundenberater Bank,
  Affluent, CWMA). SAQ certifications are ISO 17024 accredited and FinSA-compliant (FIDLEG);
  CWMA is valid three years [19]. Put the certificate with its level and year.
- Private banking and WM: 5–10+ years in client-facing private banking (B3, B4), HNWI/UHNWI
  focus, languages of the target market (Cantonese, Mandarin or Japanese in B4), knowledge of
  AML, FATCA and MiFID (B3), Avaloq as core system (B3). Recruiters test AuM portability and
  compliance history [20]; show book size, markets and booking centre, keep the business plan
  for the interview.
- Investment banking: prior IB experience, M&A execution, financial modelling and valuation,
  financial statement analysis, FactSet and advanced Office (B5). One page, deal experience
  first; list tools like Capital IQ or FactSet in skills [11].

### Keywords (DE / EN)

| Keyword | German term | Seen in |
|---|---|---|
| Investing, financing, retirement advice | Anlegen, Finanzieren, Vorsorge | B1, B2 |
| Affluent / wealthy private clients | vermögende Privatkundschaft | B1, B2 |
| Own client book | eigenes Kundenbuch | B2 |
| Acquisition and networking | Akquisition, Netzwerk | B2, B4 |
| Real-estate financing | Immobilienfinanzierung, Hypotheken | B1 |
| Bank training | Bank(fach)ausbildung | B1 |
| Financial planner (federal certificate) | Finanzplaner:in mit eidg. Fachausweis | B1 |
| UHNWI, entrepreneurs, asset gathering | Neugeld, Kundenakquisition | B4 |
| AML, FATCA, MiFID | Geldwäschereibekämpfung | B3 |
| External asset managers (EAM) | externe Vermögensverwalter | B3 |
| Avaloq | – | B3 |
| Digital affinity in advice | Digitalaffinität | B1, B4 |
| M&A execution, financial modelling, valuation | Unternehmensbewertung | B5 |
| Financial statement analysis | Bilanzanalyse | B5 |
| FactSet, Excel, PowerPoint | – | B5 |

### Section order and what goes first

- Retail/affluent (German): Profil with segment and book size → Kernkompetenzen (advice,
  financing, acquisition) → experience → SAQ and FA certificates → Bankausbildung → languages.
- Private banking: Profil naming markets, client segment and booking centre → experience with a
  scope line per role (clients, AuM, NNM as far as approved) → languages high up → education.
- Investment banking (English, one page): Education (for analysts) → Experience with a
  "Selected transactions" block (type, sector, size, own role) → Skills (modelling, FactSet,
  Capital IQ, languages) → Interests [11].

### Example bullets (fictional)

- Advised 160 affluent clients (CHF 230m AuM) on investing, mortgages and retirement; net
  new money CHF 14m in 2025.
- Converted 30 % of mortgage renewals into full advisory relationships through structured
  annual reviews.
- Onboarded 11 HNWI relationships (CHF 48m) with complete KYC/AML files and no compliance
  findings in the annual review.
- Built the operating model, DCF and trading comparables for a sell-side mandate of a
  mid-sized industrial company (deal value CHF 300m).
- Prepared management presentations and ran the data room for two cross-border sell-side
  processes.
- Betreuung von 150 vermögenden Privatkunden (CHF 210 Mio. verwaltete Vermögen) in Anlegen,
  Finanzieren und Vorsorge; Netto-Neugeld CHF 12 Mio. (2025).
- Ausbau des Kundenbuchs um 20 Neukunden durch Anlässe mit regionalen KMU-Netzwerken.

### Job ads seen

| Ref | Title | Employer | Place | Date | Link |
|---|---|---|---|---|---|
| B1 | Kundenberater:in Privatkunden Affluent | Zürcher Kantonalbank | Wetzikon ZH | ~2026-09-24 | [LinkedIn](https://ch.linkedin.com/jobs/view/kundenberater-in-privatkunden-affluent-at-z%C3%BCrcher-kantonalbank-4451650752) |
| B2 | Kundenberaterin Vermögende Privatkunden Biel (w/m) | Bank Cler | Biel/Bienne | ~2026-09-20 | [LinkedIn](https://ch.linkedin.com/jobs/view/kundenberaterin-verm%C3%B6gende-privatkunden-biel-w-m-at-bank-cler-4466852812) |
| B3 | CRM External Asset Manager | J. Safra Sarasin | Basel | ~2026-09-22 | [LinkedIn](https://ch.linkedin.com/jobs/view/crm-external-asset-manager-at-j-safra-sarasin-4469960733) |
| B4 | Client Advisor, WM APAC Switzerland, Team UHNWI | UBS | Zürich-Flughafen | ~2026-09-20 | [LinkedIn](https://ch.linkedin.com/jobs/view/client-advisor-wm-apac-switzerland-team-uhnwi-at-ubs-4332531176) |
| B5 | Switzerland Investment Banking, Analyst/Associate, Global Advisory | Rothschild & Co | Zürich | ~2026-09-20 | [LinkedIn](https://ch.linkedin.com/jobs/view/switzerland-investment-banking-analyst-associate-ch-global-advisory-at-rothschild-co-4465687826) |

## Audit (external/financial audit incl. Big Four; internal audit)

### What recruiters expect

- External audit: a business degree with accounting or audit focus, 3–5 years of audit, and
  the Swiss CPA (dipl. Wirtschaftsprüfer/in) started or completed (A1); at senior manager level
  the diploma plus at least three audit seasons (A2). The diploma needs about four years and
  4,800 hours of practice before the exam [16].
- Standards: OR, Swiss GAAP FER and IFRS for single and consolidated accounts (A1, A2);
  internal control audits (IKS) with a process-oriented approach (A1).
- Licences: the RAB licenses audit experts and, for FINMA regulatory audits, lead auditors
  (leitende Prüfer) [17]. Name the licence exactly as granted.
- Internal audit: CIA (A3), often plus CISA, CPA, CA or CFA (A4); 3+ years in internal or
  external audit (A3); risk-based audits, annual audit plan, follow-up of management actions
  and data-based audit techniques (A3, A4); travel 15–30 % (A3, A4). The IIA's Global
  Internal Audit Standards apply since 9 January 2025 [15]; write "Global Internal Audit
  Standards", not the old "IPPF 2017".

### Keywords (DE / EN)

| Keyword | German term | Seen in |
|---|---|---|
| Audit of single and consolidated accounts | Abschlussprüfung von Einzel- und Konzernabschlüssen | A1, A2 |
| Swiss GAAP FER, IFRS, Code of Obligations | OR | A1, A2 |
| Internal control system | IKS (internes Kontrollsystem) | A1, A3 |
| Process-oriented audit approach | prozessorientierter Prüfungsansatz | A1 |
| Swiss Certified Public Accountant | dipl. Wirtschaftsprüfer/in | A1, A2 |
| Audit seasons | Revisionssaisons | A2 |
| Engagement lead, review, quality assurance | Mandatsleitung, Qualitätssicherung | A2 |
| Financial and tax-driven closing | handelsrechtliche und steuerliche Abschlussgestaltung | A2 |
| CIA, CISA, CPA, CFA | – | A3, A4 |
| Risk-based audit, audit plan | risikobasierte Prüfung, Prüfplan | A4 |
| Process, financial and compliance audits | Prozess-, Finanz- und Compliance-Prüfungen | A3 |
| Follow-up of corrective actions | Nachverfolgung von Massnahmen | A3, A4 |
| Data-based audit, CAAT | datenbasierte Prüfungsansätze | A3, A4 |
| Travel | Reisebereitschaft | A3, A4 |

### Section order and what goes first

- Profil names the standards and the client segment (e.g. "Corporates, OR/Swiss GAAP FER,
  IFRS") and the status of the Swiss CPA.
- Certificates move up to position 3: dipl. Wirtschaftsprüfer (or "in progress, modules
  passed"), RAB licence, CIA, CISA.
- Experience: one scope line per role (number and type of engagements, own role such as
  in-charge or manager), then 3–5 bullets.
- For graduates to the Big Four: education first, then internships and audit-related modules.

### Example bullets (fictional)

- Led the year-end audit of 6 mid-sized industrial groups under Swiss GAAP FER as in-charge,
  with teams of up to 4.
- Tested the IKS of the purchase-to-pay and revenue processes; 14 control gaps reported and
  closed before the next interim audit.
- Coached 3 first-year assistants through their first audit season.
- Ran 9 risk-based audits in wealth management per annual plan; all reports issued within 3
  weeks of fieldwork end.
- Introduced data analytics for journal-entry testing, covering 100 % of postings instead of a
  sample.
- Abschlussprüfung von 8 KMU-Mandaten nach OR und Swiss GAAP FER als Mandatsleiter.
- Prüfung des IKS im Einkaufsprozess; 5 Empfehlungen umgesetzt und im Follow-up bestätigt.

### Job ads seen

| Ref | Title | Employer | Place | Date | Link |
|---|---|---|---|---|---|
| A1 | Senior Assistant/Assistant Manager – Audit Corporates | KPMG Switzerland | Zürich | ~2026-09-20 | [LinkedIn](https://ch.linkedin.com/jobs/view/senior-assistant-assistant-manager-audit-corporates-at-kpmg-switzerland-4468840944) |
| A2 | Senior Manager Wirtschaftsprüfung (a) | OBT AG | Zürich | ~2026-09-21 | [LinkedIn](https://ch.linkedin.com/jobs/view/senior-manager-wirtschaftspr%C3%BCfung-a-at-obt-ag-4361972630) |
| A3 | Group Internal Auditor (m/w/d) | Liebherr Group | Nussbaumen | ~2026-09-26 | [LinkedIn](https://ch.linkedin.com/jobs/view/group-internal-auditor-m-w-d-at-liebherr-group-4461969114) |
| A4 | Lead Risk-Based Auditor Private Banking | coni+partner AG (recruiter) | Zürich | ~2026-09-26 | [LinkedIn](https://ch.linkedin.com/jobs/view/lead-risk-based-auditor-private-banking-at-coni%2Bpartner-ag-4470538491) |

## IT audit (ISACA/CISA, ITGC, SOX, FINMA-related)

### What recruiters expect

- CISA is the anchor credential (I1–I4); CISM, CISSP, CRISC add weight (I3, I4); CIA for
  internal audit roles (I2). ISACA's newer AI audit credential (AAIA) already shows up (I3).
- The CISA exam covers five domains: audit process, IT governance, acquisition and
  development, operations and resilience, and protection of information assets [14]. These
  are good headings for the Kernkompetenzen.
- Experience: 3–6 years of IT audit in the Big Four or internal audit (I1, I4), ideally in
  financial services (I1, I3); lead of IT audit mandates at manager level (I1).
- Regulation: Swiss banks work under FINMA Circular 2023/1 "Operational risks and resilience
  – banks" (in force since 1 January 2024), which tightened ICT, cyber and critical-data risk
  rules [18]. None of the four ads names it literally; they ask for regulatory requirements,
  IT governance and IKS (I1, I2). ITGC and SOX were not literally named in these four ads;
  name them only when the person has tested ITGC or SOX controls, e.g. for US-listed clients.
- Data skills are now standard: SQL, Python, Power BI (PL-300), continuous auditing and
  monitoring (I2, I3).
- Assurance reports: "third-party attestation" (I4) means ISAE 3402 / SOC reports; use the
  report name in the CV.

### Keywords (DE / EN)

| Keyword | German term | Seen in |
|---|---|---|
| CISA | – | I1, I2, I3, I4 |
| CISM, CISSP, CRISC | – | I3, I4 |
| CIA | – | I2 |
| IT governance | IT-Governance | I2 |
| Internal control system | IKS | I2 |
| Continuous auditing / monitoring | – | I2 |
| SQL, Python, Power BI | Datenanalyse | I2, I3 |
| Regulatory and compliance requirements | regulatorische Anforderungen | I1, I2 |
| Cyber security | Cybersicherheit | I3 |
| Information security assessment | – | I4 |
| Migration testing, third-party attestation | – | I4 |
| IT risk assessment | IT-Risikobeurteilung | I2, I4 |
| Financial services | Bankwesen, Finanzdienstleistungen | I1, I3 |
| IT audit mandate lead | Leitung von IT-Audit-Mandaten | I1 |

### Section order and what goes first

- Header: name with CISA (and CIA/CISM) as post-nominals once earned.
- Profil: years in IT audit, sector (banks, insurers), frameworks (COBIT, ISAE 3402, FINMA
  2023/1) as far as the evidence goes.
- Kernkompetenzen: map to the CISA domains [14] or to the ad (ITGC, cyber, data analytics).
- Experience, then certificates, then a short tools line (SQL, Python, Power BI, ACL/IDEA).

### Example bullets (fictional)

- Tested ITGC (access, change, operations) for 5 core banking applications; 9 deficiencies
  reported, 8 remediated within the audit year.
- Planned and led the IT audit of a cloud migration for a regional bank against FINMA
  Circular 2023/1 requirements.
- Built SQL and Power BI scripts for continuous monitoring of privileged access, cutting
  manual sampling by 60 %.
- Issued 2 ISAE 3402 Type II reports for an outsourcing provider as in-charge.
- Prüfung der Zugriffs- und Änderungskontrollen in 4 Kernapplikationen; 6 Feststellungen
  mit dem Management priorisiert und nachverfolgt.
- Aufbau eines Datenanalyse-Dashboards (Power BI) für das Continuous Auditing der
  Zahlungsprozesse.

### Job ads seen

| Ref | Title | Employer | Place | Date | Link |
|---|---|---|---|---|---|
| I1 | (Assistant) Manager – IT Audit Financial Services | KPMG Switzerland | Zürich | ~2026-09-26 | [LinkedIn](https://ch.linkedin.com/jobs/view/assistant-manager-it-audit-financial-services-at-kpmg-switzerland-4472216479) |
| I2 | Senior IT-Auditor Data Analysis | Schwyzer Kantonalbank | Schwyz | ~2026-09-13 | [LinkedIn](https://ch.linkedin.com/jobs/view/senior-it-auditor-data-analysis-at-schwyzer-kantonalbank-4462967617) |
| I3 | IT Auditor – Trusted Advisor für Technology (80–100%) | Cembra | Zürich | ~2026-09-20 | [LinkedIn](https://ch.linkedin.com/jobs/view/it-auditor-%E2%80%93-trusted-advisor-f%C3%BCr-technology-all-genders-80-100%25-at-cembra-4458671922) |
| I4 | Senior Consultant – Assurance – Technology Risk | EY | Zürich | ~2026-09-13 | [LinkedIn](https://ch.linkedin.com/jobs/view/senior-consultant-assurance-technology-risk-at-ey-4385087789) |

## Finance & controlling / accounting (FP&A, controlling, CFO office)

### What recruiters expect

- Swiss diplomas: Fachfrau/Fachmann im Finanz- und Rechnungswesen mit eidg. Fachausweis, then
  dipl. Expertin/Experte in Rechnungslegung und Controlling [26] (F3, P1). International
  firms also accept CPA, CMA or ACCA (F1).
- Standards: Swiss GAAP FER (F3), IFRS in groups; public sector uses HRM2 (cantons and
  communes) and IPSAS-based federal accounts [25].
- Tasks in the ads: budget, forecast and mid-term planning; variance analysis; KPI reporting;
  business partnering with regional or unit heads; closing and liquidity planning; scenario
  modelling; process standardisation and automation (F1, F2, F3).
- Systems: SAP (S/4HANA, FI/CO) (F2, P1), planning tools (Anaplan, Board) and BI (F1, F3),
  advanced Excel (F1, F3), AI tools for automation (F3).
- Experience: 3–5+ years in controlling or finance (F1, F2, F3); sector fit is a plus (SaaS
  metrics such as ARR and NRR in F3).

### Keywords (DE / EN)

| Keyword | German term | Seen in |
|---|---|---|
| Budget, forecast, mid-term planning | Budget, Forecast, Mittelfristplanung | F1, F2, F3 |
| Variance analysis | Abweichungsanalyse (Ist/Budget) | F1, F3 |
| Business partnering | – | F1 |
| KPI reporting, dashboards | Kennzahlen, Reporting | F1, F3 |
| Closing process | Abschlussprozess | F2 |
| Liquidity planning | Liquiditätsplanung | F2 |
| Cost centre accounting | Kostenstellenrechnung | F3 |
| Swiss GAAP FER | – | F3 |
| SAP S/4HANA | – | F2, P1 |
| Anaplan, Board, BI tools | – | F1, F3 |
| Scenario modelling, business cases | Szenarien, Business Case | F1, F3 |
| Process automation | Prozessautomatisierung | F1, F2 |
| CPA, CMA, ACCA | – | F1 |
| Federal certificate in finance and accounting | eidg. Fachausweis Finanz- und Rechnungswesen | F3, P1 |

### Section order and what goes first

- Profil: function (business controller, group controller, FP&A), years, standards, ERP.
- Kernkompetenzen: planning and forecasting, reporting and analysis, systems/automation.
- Experience with a scope line (entities, revenue or budget size, close deadline).
- Diplomas (Fachausweis, Diplom, CPA) directly after experience; move up if the ad requires
  them.

### Example bullets (fictional)

- Ran the annual budget and two forecasts for 4 business units (CHF 180m revenue) in Anaplan.
- Cut the month-end close from D+9 to D+5 by automating 12 accrual postings in SAP S/4HANA.
- Built a driver-based cost model that explained 95 % of the budget variance to the CFO.
- Set up a KPI dashboard in Power BI for regional heads, replacing 20 Excel reports.
- Konsolidierung von 7 Gesellschaften nach Swiss GAAP FER; Abschluss innert 6 Arbeitstagen.
- Einführung einer rollierenden Liquiditätsplanung über 13 Wochen für die Geschäftsleitung.

### Job ads seen

| Ref | Title | Employer | Place | Date | Link |
|---|---|---|---|---|---|
| F1 | Business Controller EMEA and Americas | Rieter | Winterthur | ~2026-09-20 | [LinkedIn](https://ch.linkedin.com/jobs/view/business-controller-emea-and-americas-at-rieter-4469137810) |
| F2 | Corporate Controller (w/m/d) | CKW | Emmen LU | ~2026-09-24 | [LinkedIn](https://ch.linkedin.com/jobs/view/corporate-controller-w-m-d-at-ckw-4452428794) |
| F3 | Business Controller / Financial Planning & Analysis (80–100%) | Adcubum AG | Wallisellen | ~2026-09-20 | [LinkedIn](https://ch.linkedin.com/jobs/view/business-controller-financial-planning-analysis-80%E2%80%93100%25-at-adcubum-ag-4467508583) |

See also P1 and P4 (controlling in the public sector).

## Trading (sales & trading, quantitative/algorithmic trading, risk)

### What recruiters expect

- Execution and flow trading: degree in STEM or economics (T1) or bank training plus finance
  degree (T2); product knowledge (FX spot, forwards, options in T1; equities, ETFs, listed
  derivatives in T2); best execution and monitoring of algorithmic orders (T2); electronic
  trading systems and API connectivity (T1, T2); shift or weekend work (T1, T3).
- Quantitative trading: MSc or PhD in a quantitative field, 6+ years, Python and SQL plus an
  OOP language, portfolio construction and systematic strategies, P&L responsibility (T4).
  Code samples may be asked in the language the CV names [13]; list only languages the person
  can code in under test.
- Risk: 5+ years as risk manager or auditor, Swiss banking regulation, market, credit
  (Lombard), liquidity and ALM risks (T5). FRM or CFA add weight where held; follow the CFA wording
  rules [12].
- Languages: German and English for Zürich desks (T2), French and English in Geneva (T5).

### Keywords (DE / EN)

| Keyword | German term | Seen in |
|---|---|---|
| FX spot, forwards, options | Devisenhandel | T1 |
| Equities, ETFs, listed derivatives | Aktien, ETF, ETD | T2 |
| Best execution | – | T2 |
| Algorithmic execution | algorithmischer Handel | T2, T3 |
| Electronic trading systems, API | elektronische Handelssysteme | T1, T2 |
| Liquidity management | – | T1 |
| Share buyback programmes | Aktienrückkaufprogramme | T2 |
| P&L responsibility | – | T3, T4 |
| Risk on large tickets | – | T3 |
| Python, SQL, OOP language | – | T3, T4 |
| Systematic strategies, portfolio optimisation | – | T4 |
| Market, credit, liquidity, ALM risk | Markt-, Kredit-, Liquiditätsrisiko | T5 |
| Lombard lending, margin products | Lombardkredit | T5 |
| Shift / 24-5 coverage | Schichtbetrieb | T1, T3 |

### Section order and what goes first

- Traders (English, 1–2 pages): Profil with asset class, venue and role (flow, prop, sales) →
  experience with desk, products and limits → education → technical skills.
- Quants: Education with thesis topic first for graduates, then research/trading experience,
  then a skills block (languages, libraries, data) and short publications list [13].
- Risk: Profil with risk types and regulation → experience → FRM/CFA → systems.

### Example bullets (fictional)

- Quoted and executed client FX spot and forward orders in 12 currency pairs; average
  daily volume USD 150m.
- Monitored algorithmic equity orders across 9 European venues and cut average slippage
  against VWAP by 2 bp.
- Developed a Python backtesting framework for commodity spread strategies used by 3 traders.
- Ran daily VaR and stress tests for a CHF 2bn trading book and reported limit breaches to the
  risk committee.
- Ausführung von Kundenaufträgen in Schweizer Aktien und ETFs unter Einhaltung der Best
  Execution.
- Überwachung der Lombardkredite und Margenaufrufe für 300 Kundenportfolios.

### Job ads seen

| Ref | Title | Employer | Place | Date | Link |
|---|---|---|---|---|---|
| T1 | FX/Execution Trader | Swissquote | Gland VD | ~2026-09-20 | [LinkedIn](https://ch.linkedin.com/jobs/view/fx-execution-trader-at-swissquote-4468669631) |
| T2 | Sellside Execution Trader:in (w/m/d) | Zürcher Kantonalbank | Zürich | ~2026-09-25 | [LinkedIn](https://ch.linkedin.com/jobs/view/sellside-execution-trader-in-w-m-d-at-z%C3%BCrcher-kantonalbank-4469748816) |
| T3 | OTC Trader – Digital Assets | IMC Trading | Zug | ~2026-09-22 | [LinkedIn](https://ch.linkedin.com/jobs/view/otc-trader-digital-assets-at-imc-trading-4382897168) |
| T4 | Advisor, Quantitative Trader | Cargill | Geneva | ~2026-09-13 | [LinkedIn](https://ch.linkedin.com/jobs/view/advisor-quantitative-trader-at-cargill-4427388504) |
| T5 | Risk Manager | EFG Private Banking | Geneva | ~2026-09-26 | [LinkedIn](https://ch.linkedin.com/jobs/view/risk-manager-at-efg-private-banking-4454593836) |

## Insurance

### What recruiters expect

- Distribution and advice: since the revised Insurance Supervision Act (VAG, in force
  1 January 2024) insurance intermediaries must prove minimum training, in practice the VBV
  exam, with the transition period ending in 2025 [21]. Ads ask for "Versicherungsvermittler/in
  VBV" (V1, V3). Put it in certificates with profile and year (e.g. "Nichtleben").
- Underwriting: basic insurance training plus Fachausweis or Versicherungsdiplom; risk
  analysis, coverage concepts, premium calculation, risk inspections, underwriting within
  authority (V1).
- Actuarial: Aktuar SAV or an equivalent qualification (V2). The SAV title needs three years
  of practice and an oral colloquium [22]. Standards: Solvency II and IFRS 17 (V2); Swiss
  insurers also report under the Swiss Solvency Test (SST), which fits when the evidence
  covers it.
- Sales roles value an existing regional client base, acquisition of new clients and
  cross-selling (V3).

### Keywords (DE / EN)

| Keyword | German term | Seen in |
|---|---|---|
| Insurance intermediary (VBV) | Versicherungsvermittler/in VBV | V1, V3 |
| Federal certificate / insurance diploma | Fachausweis, Versicherungsdiplom | V1 |
| Risk analysis, risk inspection | Risikoanalyse, Risikobesichtigung | V1 |
| Coverage concepts, quotes | Deckungskonzepte, Offerten | V1 |
| Premium calculation, policy issuing | Prämienkalkulation, Policierung | V1 |
| Underwriting authority | Zeichnung innerhalb der Kompetenzen | V1 |
| Property / commercial lines | Sachversicherung, Unternehmensgeschäft | V1 |
| Qualified actuary | Aktuar SAV | V2 |
| Solvency II, IFRS 17 | – | V2 |
| Pricing, portfolio profitability | Pricing, Portfolio-Profitabilität | V2 |
| Model validation | Modellvalidierung | V2 |
| New client acquisition, client base | Neukundenakquisition, Kundenstamm | V3 |
| Cross-selling | – | V3 |
| Negotiation skills | Verhandlungsgeschick | V1, V3 |

### Section order and what goes first

- Advisers: Profil with region, segment and portfolio → certificates (VBV) → experience with
  portfolio and growth → languages → education.
- Underwriters: Profil with line of business and authority level → experience → Fachausweis /
  Diplom → languages.
- Actuaries: Profil with line (life, P&C, health, reinsurance) and standards → experience →
  qualifications (Aktuar SAV, exam progress) → tools (R, Python, SQL, actuarial software).

### Example bullets (fictional)

- Underwrote property and business-interruption risks for 70 mid-sized companies within a
  CHF 5m authority.
- Priced 25 reinsurance treaties per year and presented portfolio profitability to the pricing
  committee.
- Grew the agency's non-life portfolio by 9 % in premium volume through cross-selling to
  existing clients.
- Validated the reserving model for a health portfolio ahead of the SST reporting.
- Beratung von 400 Privat- und KMU-Kunden in Sach-, Haftpflicht- und Vorsorgeversicherungen.
- Durchführung von 30 Risikobesichtigungen pro Jahr und Erarbeitung der Deckungskonzepte.

### Job ads seen

| Ref | Title | Employer | Place | Date | Link |
|---|---|---|---|---|---|
| V1 | (Senior) Underwriter Sachversicherungen nationales Unternehmensgeschäft (w/m/d) | die Mobiliar | Zürich | ~2026-09-24 | [LinkedIn](https://ch.linkedin.com/jobs/view/senior-underwriter-sachversicherungen-nationales-unternehmensgesch%C3%A4ft-w-m-d-at-die-mobiliar-4471460162) |
| V2 | Reinsurance Pricing Actuary, 80–100% (w/m/d) | Swiss Life | Zürich | ~2026-09-25 | [LinkedIn](https://ch.linkedin.com/jobs/view/reinsurance-pricing-actuary-80-100%25-w-m-d-at-swiss-life-group-4470715147) |
| V3 | Versicherungsberater:in für die Hauptagentur Rüti ZH | AXA Schweiz | Rüti ZH | ~2026-09-20 | [LinkedIn](https://ch.linkedin.com/jobs/view/versicherungsberater-in-f%C3%BCr-die-hauptagentur-r%C3%BCti-zh-at-axa-switzerland-4467081917) |

## Public administration (Bund, Kanton, Gemeinde)

### What recruiters expect

- Dossier: letter, CV, Arbeitszeugnisse and diplomas, uploaded in the unit's application
  system (P2). Federal recruiting is decentralised to each unit; unsolicited applications are
  generally not taken [27]. Some units exclude recruitment agencies (P3).
- Languages are formal requirements. Federal staff need active B2 in one official language;
  middle management two official languages, with managers also a third passively (B1); senior
  management the same [23]. Ads ask for "very good knowledge of one official language and good
  knowledge of a second" (P1, P2, P3). Show all official languages with a level, even a passive
  one.
- Education paths: commercial apprenticeship (kaufmännische Ausbildung) plus specialist
  training (P2, P3, P5); higher vocational diploma or bachelor for specialists (P1); master for
  expert roles (P4). Public-management training (MAS Public Administration, Gemeindeschreiber
  courses) is a plus.
- Systems and methods: SAP (FI, S/4HANA, BW, SAC) (P1, P2, P4), Microsoft 365 and AI tools
  (P3), HERMES project method (P4). Knowledge of the public administration is welcome (P3, P5).
- Security-sensitive roles require a personnel security check (Personensicherheitsprüfung)
  [24]; the CV must match the references exactly because it will be verified.
- Public finance: HRM2 for cantons and communes [25]; state budget, financial plan and
  business report (Geschäftsbericht) at canton level (P4).

### Keywords (DE / EN)

| Keyword | German term | Seen in |
|---|---|---|
| Second official language | zweite Amtssprache | P1, P2, P3 |
| Controlling and reporting | Controlling und Reporting | P1, P4 |
| SAP FI / S/4HANA / BW / SAC | – | P1, P2, P4 |
| Financial plan, state budget | Finanzplan, Staatsbudget | P4 |
| Harmonisation and automation of processes | Harmonisierung, Automatisierung | P4 |
| HERMES project method | HERMES | P4 |
| Commercial apprenticeship | kaufmännische Ausbildung | P2, P3, P5 |
| Knowledge of public administration | Kenntnisse der öffentlichen Verwaltung | P3, P5 |
| Rulings, applications | Verfügungen, Gesuche | P3 |
| EU/EFTA bilateral agreements | Personenfreizügigkeit, bilaterale Abkommen | P2 |
| Service orientation | Dienstleistungsorientierung | P3, P5 |
| Precise, independent working | selbständige, präzise Arbeitsweise | P1, P3, P4 |
| Clear writing on complex matters | Schreibkompetenz | P4 |
| Customer contact at counter and phone | Schalter- und Telefondienst | P5 |

### Section order and what goes first

- Profil: function, years, level of government (Bund, Kanton, Gemeinde), legal field.
- Sprachen high up (position 4, right after Kernkompetenzen) with levels for German, French
  and Italian [23].
- Experience with a scope line (unit, budget, number of cases or Geschäfte).
- Education and Weiterbildung (public management, Fachausweis), then IT (SAP, M365).
- Tone: neutral and exact. No sales language; public readers look for legality, reliability
  and service to citizens ("zum Wohl der Bevölkerung", P3).

### Example bullets (fictional)

- Prepared the unit's quarterly controlling reports (budget CHF 38m) and explained variances
  to the finance director.
- Drafted 250 rulings per year on refund applications; processing time down from 20 to 12
  days.
- Harmonised cost-centre structures of 6 offices in SAP S/4HANA with the ERP team.
- Answered enquiries in German and French for 3 federal programmes.
- Vorbereitung und Protokollierung der Sitzungen des Gemeinderats; 120 Geschäfte pro Jahr.
- Erstellung der Finanzplanung nach HRM2 für eine Gemeinde mit 12'000 Einwohnerinnen und
  Einwohnern.

### Job ads seen

| Ref | Title | Employer | Place | Date | Link |
|---|---|---|---|---|---|
| P1 | Fachspezialist/-in Controlling | Eidg. Finanzverwaltung EFV (Bund) | Bern | ~2026-09-06 | [LinkedIn](https://ch.linkedin.com/jobs/view/fachspezialist-in-controlling-at-federal-finance-administration-4460967730) |
| P2 | Fachspezialist/-in internationale Leistungsabrechnungen (Arbeitslosenversicherung) | SECO (Bund) | Bern | ~2026-08-27 | [LinkedIn](https://ch.linkedin.com/jobs/view/fachspezialist-in-internationale-leistungsabrechnungen-arbeitslosenversicherung-at-state-secretariat-for-economic-affairs-seco-4447919267) |
| P3 | Assistent/-in Abteilung Energieeffizienz und Erneuerbare Energien | Bundesamt für Energie BFE (Bund) | Ittigen | 2026-09-26 | [jobs.ch](https://www.jobs.ch/de/stellenangebote/detail/01c4632c-2b18-4a2e-bc77-fa96ace2de59/) |
| P4 | Experte/in Konzern-Controlling 80–100% | Finanzdirektion Kanton Zürich | Zürich | ~2026-09-20 | [LinkedIn](https://ch.linkedin.com/jobs/view/experte-in-konzern-controlling-80-100%25-at-finanzdirektion-kanton-z%C3%BCrich-4467879900) |
| P5 | Sachbearbeiter/in Zivilstandsamt | Einwohnergemeinde Baar | Baar ZG | ~2026-09-20 | [LinkedIn](https://ch.linkedin.com/jobs/view/sachbearbeiter-in-zivilstandsamt-at-einwohnergemeinde-baar-4465075221) |

## Notes for the designer

- Serious and compact: one column, generous margins, a sober typeface, dark neutral text and
  at most one restrained accent. No icons, logos, rating bars or decorative images.
- Stand out: the header line with target role and earned designations (CFA, CISA, CIA);
  the scope line under each position (book, mandates, budget) as a quiet second line; dates
  right-aligned so a gap check takes one glance.
- Certificates and languages are first-class blocks here, not footnotes; the layout must allow
  moving them up (section order above).
- Numbers are text, not charts, so an ATS can read them [6]. Tabular figures help align
  amounts.
- Variants: two-page A4 German (photo on) and one-page English (photo off, education first,
  optional "Selected transactions" block for investment banking).

## Sources

Sources marked (s) were read through search-result summaries only, because the page did not
open directly (403 or timeout) or was not fetched; all others were opened.

[1] Create a Strong Resume, Harvard FAS Mignone Center for Career Success, https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/, accessed 2026-09-27
[2] Lebenslauf / CV, Career Services der Universität Zürich, https://www.careerservices.uzh.ch/de/ratgeber/bewerbung/bewerbungsdossier/Lebenslauf.html, accessed 2026-09-27
[3] Curriculum Vitae, Career & Corporate Services Universität St.Gallen (HSG), https://hsgcareer.ch/curriculum-vitae/, accessed 2026-09-27
[4] Lebenslauf erstellen, berufsberatung.ch (SDBB), https://www.berufsberatung.ch/de/lebenslauf-erstellen, accessed 2026-09-27
[5] Kurzprofil und Titel im Lebenslauf, jobs.ch Job Coach, https://www.jobs.ch/de/job-coach/ratgeber-checklisten/kurzprofil-und-titel-im-lebenslauf/, accessed 2026-09-27
[6] Den ATS-Code knacken: So optimierst du deinen CV, jobs.ch Job Coach, https://www.jobs.ch/de/job-coach/5-schritte-lebenslauf-ats/, accessed 2026-09-27
[7] Perfektes Bewerbungsdossier: Lebenslauf, Anschreiben & Zeugnisse, Hays Schweiz, https://www.hays.ch/bewerber/karrieretipps/bewerbung, accessed 2026-09-27
[8] Make your CV work for you, Michael Page Switzerland, https://www.michaelpage.ch/advice/career-advice/cover-letter-and-cv-advice/make-your-cv-work-you, accessed 2026-09-27
[9] Ask our recruiters, Deloitte Switzerland, https://www.deloitte.com/ch/en/careers/deloitte-life/careers-stories/top-5-recruitment-questions-from-instagram.html, accessed 2026-09-27
[10] (s) Our application process, PwC Switzerland, https://www.pwc.ch/en/careers-with-pwc/pwc-as-an-employer/our-application-process.html, accessed 2026-09-27 (403 on direct fetch)
[11] Investment Banking Insights: Creating an Effective Investment Banking Resume, University of Pennsylvania Career Services, https://careerservices.upenn.edu/blog/2021/02/06/investment-banking-insights-creating-an-effective-investment-banking-resume/, accessed 2026-09-27
[12] How to Share Your Achievements, CFA Institute, https://www.cfainstitute.org/programs/candidate-resources/share-achievement, accessed 2026-09-27
[13] A Guide to Seeking a Job in Quantitative Finance, CQF Institute, https://www.cqf.com/blog/guide-seeking-job-quantitative-finance, accessed 2026-09-27
[14] CISA Exam Content Outline, ISACA, https://www.isaca.org/credentialing/cisa/cisa-exam-content-outline, accessed 2026-09-27
[15] (s) The IIA Celebrates the Effective Date of the Global Internal Audit Standards, The Institute of Internal Auditors, https://www.theiia.org/en/content/communications/press-releases/2025/january/the-iia-celebrates-the-effective-date-of-the-global-internal-audit-standards/, accessed 2026-09-27
[16] (s) Dipl. Wirtschaftsprüfer/-in, EXPERTsuisse, https://expertsuisse.ch/de/bildung/ausbildung/dipl-wirtschaftspruefer-in, accessed 2026-09-27
[17] (s) Zulassung, Eidgenössische Revisionsaufsichtsbehörde RAB, https://www.rab-asr.ch/de/zulassung, accessed 2026-09-27
[18] (s) FINMA Circular 2023/1 "Operational risks and resilience – banks", Grant Thornton Switzerland, https://www.grantthornton.ch/en/insights/finma-circular-operational-risks-resilience/, accessed 2026-09-27
[19] (s) Kundenberater Bank, SAQ Swiss Association for Quality, https://www.saq.ch/zertifizierungen/banking/kundenberater-bank, accessed 2026-09-27 (timeout on direct fetch)
[20] Private Banking Recruiter Switzerland, Executive Partners, https://www.execpartners.ch/en/private-banking-recruiter-switzerland, accessed 2026-09-27
[21] (s) Mindeststandards für Versicherungsvermittler – neues VAG, VBV Berufsbildungsverband der Versicherungswirtschaft, https://www.vbv.ch/de/versicherungsvermittlung/projekt-mindeststandards, accessed 2026-09-27
[22] Diplom der Schweizerischen Aktuarvereinigung, Universität Bern, Departement Mathematik und Statistik, https://www.math-stat.unibe.ch/weiterbildung/diplom_der_schweizerischen_aktuarvereinigung/index_ger.html, accessed 2026-09-27
[23] Bedienung der Applikation "Sprachkompetenz" – Anleitung und FAQ (SpV Art. 8), Eidgenössisches Personalamt EPA, https://www.plurilingua.admin.ch/dam/de/sd-web/8nYrUh4d0YDV/32010_ecl_sprachkompetenzen_anleitung_faq_d%20(7).pdf, accessed 2026-09-27
[24] Wer braucht eine Personensicherheitsprüfung?, Staatssekretariat für Sicherheitspolitik SEPOS, https://www.sepos.admin.ch/de/personensicherheitspruefung-personenkreise, accessed 2026-09-27
[25] (s) Handbuch HRM2, Schweizerisches Rechnungslegungsgremium für den öffentlichen Sektor SRS-CSPCP, https://www.srs-cspcp.ch/en/handbook-ham2-full-version-n18363, accessed 2026-09-27
[26] Eidg. Fachausweis in Finanz- und Rechnungswesen, swissaccounting.org, https://swissaccounting.org/eidg.-fachausweis-in-finanz-und-rechnungswesen, accessed 2026-09-27
[27] Häufige Fragen, Stellenportal Bund (STELLE.admin.ch), https://www.stelle.admin.ch/de/haeufige-fragen, accessed 2026-09-27
