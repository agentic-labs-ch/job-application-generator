# CV guide

These are the rules for every CV, application and motivation letter in this project. They
come from the owner's application course "ICT Standortbestimmung" (Bewerbungsatelier,
Bildungszentrum SAH Zürich with Digicomp Academy) and from the owner's instructions of
2026-09-24. The course material is in [`cv-guide/`](cv-guide/README.md).

Read this file before you write or change any CV content. The data rules in
`docs/source-of-truth.md` still apply: this guide decides what goes where, not which facts
may be published.

## 1. Start from the job ad

- No application without a job ad. What matters in the CV and the letter depends on the ad.
  About 80 % of what could be written is not important for a given ad (owner, 2026-09-24).
- Analyse the ad before you write (course day 2: "Keywords & Skillsliste"):
  1. List every requirement and mark it `must` or `plus`.
  2. For each one, find the evidence in the dataset.
  3. Name every gap.

  The analysis goes into `job.requirements` (see `docs/applications.md`). A gap is never
  claimed on the page; it is prepared for the interview.
- Then choose what to show. The three key strengths, the highlights of each position and the
  keywords answer the must-requirements first.
- Write the application in the language of the ad.

## 2. The CV from top to bottom

| # | Section | Content | Rules |
|---|---|---|---|
| 1 | Header | Photo, target role, name, a one-line positioning headline | No address, phone or e-mail here. The photo is professional, on page 1, and the person looks towards the middle of the CV (course checklist). |
| 2 | Profil (Kurzprofil) | Who I am in three to five sentences: degree, years and fields of experience, the strongest proof, hard and soft skills | At most 110 words. The checklist asks for "Hard- und Soft-Skills in wenigen Sätzen oder als Aufzählung". An optional claim adds one more sentence. |
| 3 | Kernkompetenzen | The three strongest competencies for this ad, each with one or two sentences of proof | Not the detailed skill chart (owner). Each one answers a must-requirement. |
| 4 | Berufserfahrung | Positions from newest to oldest | `MM.YYYY – MM.YYYY`, title, employer and place, then about three activities as short points (checklist). The last three to four years may have up to five points; older positions show only date, role and employer. |
| 5 | Weiterbildung & Zertifikate | Year, course or certificate, institution | Newest first. Owner decision 2026-09-23: application pages leave this section out (`omit`); a certificate the ad asks for is named once in the letter. |
| 6 | Ausbildung | `MM.YYYY – MM.YYYY`, degree, institution, place | Newest first. |
| 7 | Sprachen | Language and level | Levels: Grundkenntnisse, Gute Kenntnisse, Fliessend, Muttersprache. Name a CEFR level (A1–C2) only if there is a certificate. |
| 8 | Weitere Kenntnisse | Keywords for this ad (tools, methods) in a few groups | No levels. |
| 9 | Kontakt & Persönliches | E-mail, LinkedIn, place of residence, interests | At the end (owner). |
| 10 | Motivationsschreiben | The letter for this ad | At the end of the same page (owner, 2026-09-24). See section 5. |

Why this order: a reader decides in seconds. The profile, the three strengths and the recent
experience must come first. The owner's CVs before 2026 never had a profile, and older role
versions put a full skill chart before the experience.

The checklist also lists private data: address, phone, date of birth, civil status, children,
nationality and residence permit. This project publishes none of it by default
(`docs/source-of-truth.md`). It goes only into a private PDF dossier, and only with the owner's
approval.

Employment gaps: the checklist warns that gaps of more than one to three months are read
critically and suggests "Stellensuche" or "berufliche Neuorientierung". The owner decided not
to explain 03–06.2021 (STATUS.md).

## 3. What makes a good entry

- Results before duties. Show the result, the scope or the number, one idea per point.
- Titles and dates follow the work references (Arbeitszeugnisse). Where the owner's own CVs
  contradict each other, the reference wins. This happened for team size, the number of
  architectures, and titles. Numbers that are still open stay out.
- Weigh the evidence in this order:
  1. The approved dataset (`data/cv.yaml`).
  2. The work references.
  3. The owner's own CVs and letters, used only with the owner's approval. Their numbers
     changed from version to version.
- Say each thing once. The profile, the strengths and the letter pick different proof where
  they can.
- Use Swiss spelling (ss, never ß) and write numbers as the reference does.

### Action verbs

The owner added this list on 2026-09-27. It is Harvard College Career Services' list of
action verbs, from ["Create a Strong Resume"](https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/).
This guide stays the rule; the list is a word bank for the English texts.

- The list brings variety. It is not a rule that every point starts with one of these verbs:
  use one where it fits the CV and says what was done, and vary the verbs within a position.
- Which verbs suit which roles follows the role categories the owner is defining with the
  designer (2026-09-27). Sober roles such as banks and insurance get sober verbs. Until the
  categories exist, pick case by case.
- Where a point starts with a verb: active voice, past tense for past positions, no "I",
  facts and numbers only where the references give them.
- A verb never claims more than the evidence does. "Led" or "Spearheaded" need a lead role
  in the dataset.

| Category | Verbs |
|---|---|
| Leadership | Accomplished, Achieved, Administered, Analyzed, Assigned, Attained, Chaired, Consolidated, Contracted, Coordinated, Delegated, Developed, Directed, Earned, Evaluated, Executed, Handled, Headed, Impacted, Improved, Increased, Led, Mastered, Orchestrated, Organized, Oversaw, Planned, Predicted, Prioritized, Produced, Proved, Recommended, Regulated, Reorganized, Reviewed, Scheduled, Spearheaded, Strengthened, Supervised, Surpassed |
| Communication | Addressed, Arbitrated, Arranged, Authored, Collaborated, Convinced, Corresponded, Delivered, Developed, Directed, Documented, Drafted, Edited, Energized, Enlisted, Formulated, Influenced, Interpreted, Lectured, Liaised, Mediated, Moderated, Negotiated, Persuaded, Presented, Promoted, Publicized, Reconciled, Recruited, Reported, Rewrote, Spoke, Suggested, Synthesized, Translated, Verbalized, Wrote |
| Research | Clarified, Collected, Concluded, Conducted, Constructed, Critiqued, Derived, Determined, Diagnosed, Discovered, Evaluated, Examined, Extracted, Formed, Identified, Inspected, Interpreted, Interviewed, Investigated, Modeled, Organized, Resolved, Reviewed, Summarized, Surveyed, Systematized, Tested |
| Technical | Assembled, Built, Calculated, Computed, Designed, Devised, Engineered, Fabricated, Installed, Maintained, Operated, Optimized, Overhauled, Programmed, Remodeled, Repaired, Solved, Standardized, Streamlined, Upgraded |
| Teaching | Adapted, Advised, Clarified, Coached, Communicated, Coordinated, Demystified, Developed, Enabled, Encouraged, Evaluated, Explained, Facilitated, Guided, Informed, Instructed, Persuaded, Set Goals, Stimulated, Studied, Taught, Trained |
| Quantitative | Administered, Allocated, Analyzed, Appraised, Audited, Balanced, Budgeted, Calculated, Computed, Developed, Forecasted, Managed, Marketed, Maximized, Minimized, Planned, Projected, Researched |
| Creative | Acted, Composed, Conceived, Conceptualized, Created, Customized, Designed, Developed, Directed, Established, Fashioned, Founded, Illustrated, Initiated, Instituted, Integrated, Introduced, Invented, Originated, Performed, Planned, Published, Redesigned, Revised, Revitalized, Shaped, Visualized |
| Helping | Assessed, Assisted, Clarified, Coached, Counseled, Demonstrated, Diagnosed, Educated, Enhanced, Expedited, Facilitated, Familiarized, Guided, Motivated, Participated, Proposed, Provided, Referred, Rehabilitated, Represented, Served, Supported |
| Organizational | Approved, Accelerated, Added, Arranged, Broadened, Cataloged, Centralized, Changed, Classified, Collected, Compiled, Completed, Controlled, Defined, Dispatched, Executed, Expanded, Gained, Gathered, Generated, Implemented, Inspected, Launched, Monitored, Operated, Organized, Prepared, Processed, Purchased, Recorded, Reduced, Reinforced, Retrieved, Screened, Selected, Simplified, Sold, Specified, Steered, Structured, Systematized, Tabulated, Unified, Updated, Utilized, Validated, Verified |

The list is in English and in American spelling ("Analyzed", "Cataloged", "Modeled").
Where a verb goes into a CV, it follows this project's English (e.g. "analysed", "catalogued",
"modelled", as in the texts under `data/`). German texts keep their current style until the owner decides.

### Rules by Branche

For CVs of other people (owner, 2026-09-27), [`cv-guide/branchen/`](cv-guide/branchen/README.md)
adds what differs by Branche: Finanz & Öffentlich, Beratung & Sales, Tech & Produkt, Mensch &
Kreativ. Each file names the sub-sectors, what recruiters there expect, keywords, section order
and verbs, with sources. This guide stays the base; a Branche file only adds to it.

## 4. Skills

- The course's skills list ("Skills-Liste") is a separate document, rated on a scale such as
  1 = gering to 4 = sehr hoch. It is an optional enclosure. Examples:
  `cv-guide/BspSkills*.pdf`, `cv-guide/BspSkillMatrixBA-RE.pdf` and
  `cv-guide/SkillsListeApi_1-1.pdf`.
- The CV itself shows three key strengths near the top and keywords without levels near the
  end.

## 5. Motivation letter

- Start with the self-analysis from the course:
  - The Motivationsrad: what motivates me, with one example for each motivator. Check that
    the motivation, the profile and the job fit together.
  - The SWOT analysis: strengths become the unique selling point.
  - The Jobselection-Matrix: which company, clients, culture and size fit.
- Keep it to one A4 page, with a body of at most 350 words. Use the Swiss business letter
  form:
  1. Sender, then recipient.
  2. Place and date.
  3. Subject with the job title and the reference number.
  4. Salutation and body.
  5. "Freundliche Grüsse", the signature and the list of enclosures.
- Structure the body with AIDA:
  - Attention: open with a direct link to the role. Never "Hiermit bewerbe ich mich".
  - Interest: why this company and this role, specific enough that it fits no other
    company.
  - Desire: what I bring. Three or four points, each answering a must-requirement with proof
    and, where approved, numbers.
  - Action: ask clearly for a conversation.
- Write what you bring, not what you want to learn. The owner's older letters were generic,
  had no numbers and talked about learning.
- The owner's letters so far use the Sie form, even where an ad uses Du.

## 6. Design for each company

The design system (Granat: type, spacing, components) stays the same. The colours come from
the company: paper, ink, accent, and optional decorative marks such as a logo's colours. They
live in each application, not in the design system. `DESIGN.md` ("Company colours") has the
rules and contrast checks. Never use logos or other trademarks.

## 7. Before sending

- [ ] The job ad is saved as a PDF, the requirements are analysed and the gaps are known.
- [ ] Profile, three strengths and letter answer the must-requirements.
- [ ] Every fact is approved and every number matches the references.
- [ ] Newest first, dates `MM.YYYY`, and every gap is explained or deliberately left out.
- [ ] The photo is professional and the contact details are correct.
- [ ] The letter fits on one page, with the right recipient and the reference number in the
      subject.
- [ ] The enclosures are ready: references, diplomas, certificates.
- [ ] The PDF name follows the scheme on the coaching page, e.g.
      `Alex-Muster_Bewerbung_<Rolle>.pdf`.

## Course material

| File in `cv-guide/` | What it is | Used for |
|---|---|---|
| `InfoCV-Checkliste.pdf` | CV checklist: sections, order, formats, gaps | Sections 2 and 3 |
| `Blanco ICT Standortbestimmung.pdf` | Course plan for the five days | Scope (ad, dossier, letter, interview) |
| `BspSkills*.pdf`, `BspSkillMatrixBA-RE.pdf`, `SkillsListeApi_1-1.pdf` | Example skills lists and matrices | Section 4 |
| `Motivationsrad_Auftrag1-0.pdf` | Exercise: what motivates me | Section 5 |
| `SWOT-HilfeZurSelbstanalyse_1-0.pdf`, `SWOT_Analyse_1_2_3.pdf` | SWOT self-analysis | Strengths and unique selling point |
| `Jobselection_Matrix_Beispiel_1-0.pdf` | Criteria for choosing jobs | Choosing ads, "why this company" |
| `Lebensrad_Auftrag_1-0.pdf`, `Ressourcenrad_Auftrag_1-0.pdf`, `Alltag_Wunschalltag_Auftrag_1-1.pdf`, `Priorisieren_Eisenhower_Auftrag_1-1.pdf` | Self-management exercises (values, resources, daily routine, priorities) | Background for motivation and job choice; not used in documents |
