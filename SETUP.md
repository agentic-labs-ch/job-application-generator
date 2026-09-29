# Set up your own copy

*Deutsch: [unten](#deutsch).*

You get the code, put it into a repository of your own (public or private), replace the sample
person with your CV and publish it with GitHub Pages. Nothing here needs a server or an account
other than GitHub.

Demo of what you get: <https://agentic-labs-ch.github.io/job-application-generator/uebersicht/>

## What you need

- A GitHub account.
- [Git](https://git-scm.com/downloads) and [Node.js 22 or newer](https://nodejs.org/).
- For the browser checks: Playwright's Chromium and WebKit (installed in step 3).

## 1. Download the code

Either click **Code → Download ZIP** on GitHub and unpack it, or clone it:

```sh
git clone --depth 1 https://github.com/agentic-labs-ch/job-application-generator my-cv
cd my-cv
```

## 2. Push it to your own repository

Create an **empty** repository on GitHub (no README, no licence, no .gitignore), for example
`my-cv`. Then start a fresh history, so your repository does not carry this one's:

```sh
rm -rf .git                     # Windows PowerShell: Remove-Item -Recurse -Force .git
git init -b main
git add -A
git commit -m "Start from job-application-generator"
git remote add origin https://github.com/YOUR-NAME/my-cv.git
git push -u origin main
```

With the GitHub CLI, one command creates the repository and pushes:
`gh repo create my-cv --private --source=. --push`.

## 3. Install and check

```sh
npm ci
npx playwright install --with-deps chromium webkit
npm run check
```

`npm run check` validates the data, builds `dist/` and runs every test. Open
`dist/index.html` in your browser to see the result.

## 4. Make it yours

1. **Your CV:** replace the sample person in `data/cv.yaml` with your data. The format is in
   `schema/cv.schema.json`, `docs/profiles.md` and `docs/applications.md`; what belongs in a
   CV is in `docs/cv-guide.md`.
2. **Photo:** replace `data/portrait.jpg` (and `data/portrait-2.jpg`) or remove the `photo`
   block. The build refuses images with metadata (camera, location).
3. **Demo link:** `data/cv.yaml` has a third link "Alle Lebensläufe" to this demo's
   overview. Point it to your own site (`https://YOUR-NAME.github.io/my-cv/uebersicht/`) or
   remove it.
4. **Role versions, pages, applications:** the samples in `data/profiles/`, `data/pages/` and
   `data/applications/` show every feature. Replace them with your own one by one. A few
   browser tests name sample pages; when you remove one, point those tests to your page.
5. **Notes for agents:** `CLAUDE.md` says that this repository is synchronised from a private
   one. That is not true for your copy: delete that line, and the section "About this
   repository" in `README.md`.

Anything in a public repository or on GitHub Pages is public. Leave out your address, phone
number and date of birth unless you want them online.

## 5. Publish with GitHub Pages

In your repository: **Settings → Pages → Source: GitHub Actions**. Every push to `main` then
runs `.github/workflows/pages.yml`: the checks, the PDFs, and the deploy. Your site is at
`https://YOUR-NAME.github.io/my-cv/`. For a private repository, GitHub Pages needs a paid
GitHub plan.

## Prompt for your coding agent

Copy this into Claude Code or another coding agent that can use a terminal. It does steps 1–5
with you and asks when it needs your data.

```text
Set up my own copy of the CV generator https://github.com/agentic-labs-ch/job-application-generator.

1. Clone it with --depth 1 into a new folder, delete its .git folder, and start a fresh
   repository on branch main with one commit "Start from job-application-generator".
2. Ask me for the name of my new GitHub repository and whether it is public or private.
   Create it (gh repo create) and push. If you cannot create repositories, tell me exactly
   what to click on github.com, then add it as origin and push.
3. Install: Node 22 or newer, `npm ci`, `npx playwright install --with-deps chromium webkit`.
   Run `npm run check` and tell me the result.
4. Read README.md, SETUP.md, CLAUDE.md and docs/cv-guide.md. In CLAUDE.md, delete the line
   that says this repository is synchronised from a private repository; in README.md, delete
   the section "About this repository". This copy is mine.
5. Ask me for my CV (a file or pasted text) and my photo. Replace the sample person in
   data/cv.yaml with my data, following schema/cv.schema.json and docs/cv-guide.md. Never
   invent facts: ask me when something is missing or unclear. Leave out address, phone and
   date of birth unless I ask for them.
6. In data/cv.yaml, point the link to agentic-labs-ch.github.io to my own GitHub Pages site,
   or remove it if I do not want an overview page.
7. Replace or remove the sample role versions, pages and applications in data/profiles/,
   data/pages/ and data/applications/ as I tell you. Keep data/cv.example.yaml and
   tests/fixtures/ (the tests use them). If a test names a sample page you removed, point it to
   my page; never delete or skip a check just to get green.
8. Run `npm run check` before every push. Show me the HTML (dist/index.html, screenshots are
   fine) before you publish anything.
9. Help me turn on GitHub Pages (Settings → Pages → Source: GitHub Actions), push to main and
   give me the address of my site.
```

<a id="deutsch"></a>

## Deutsch

Du lädst den Code herunter, legst ihn in ein eigenes Repository (öffentlich oder privat),
ersetzt die Beispielperson durch deinen Lebenslauf und veröffentlichst ihn mit GitHub Pages.

1. **Herunterladen:** auf GitHub **Code → Download ZIP** oder
   `git clone --depth 1 https://github.com/agentic-labs-ch/job-application-generator my-cv`.
2. **Eigenes Repository:** auf GitHub ein **leeres** Repository anlegen (ohne README). Dann im
   Ordner `.git` löschen, `git init -b main`, `git add -A`,
   `git commit -m "Start from job-application-generator"`,
   `git remote add origin https://github.com/DEIN-NAME/my-cv.git`, `git push -u origin main`.
3. **Installieren:** Node.js 22+, `npm ci`,
   `npx playwright install --with-deps chromium webkit`, dann `npm run check`.
4. **Anpassen:** die Punkte unter «4. Make it yours» oben: eigene Daten in `data/cv.yaml`,
   eigenes Foto, den Link «Alle Lebensläufe» auf die eigene Seite ändern, Beispiele ersetzen,
   in `CLAUDE.md` den Hinweis auf die Synchronisierung löschen.
5. **Veröffentlichen:** **Settings → Pages → Source: GitHub Actions**. Jeder Push auf `main`
   veröffentlicht die Seite. Bei einem privaten Repository braucht GitHub Pages ein
   kostenpflichtiges GitHub-Abo.

Mit einem Coding-Agent (zum Beispiel Claude Code) geht es schneller: Gib ihm den Prompt oben.
Er ist auf Englisch; du kannst ihm trotzdem auf Deutsch antworten.
