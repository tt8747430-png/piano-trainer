# Piano Trainer

Learn to play songs at the piano: a path from easy to hard, the chords and scales each song needs, and a practice
player that plays along, steps through, or waits for you. Installable, works offline, in English and Russian.

> The rewrite is in progress. The current app is `legacy/index.html`, still served on GitHub Pages; the new app
> replaces it at the end of Phase 4 ([spec](docs/superpowers/specs/2026-09-24-piano-trainer-rewrite-design.md)).

## Run it

Needs Node 24 (`nvm use`).

```bash
npm install
npm run dev                        # http://localhost:5173
npm run test                       # all tests
npm run build && npm run preview   # the production build, with the service worker
```

## Work on it

- How code is organised and written: [CLAUDE.md](CLAUDE.md), [docs/CODE_STYLE.md](docs/CODE_STYLE.md).
- The words we use: [docs/UBIQUITOUS_LANGUAGE.md](docs/UBIQUITOUS_LANGUAGE.md).
- Decisions and why: [docs/adr](docs/adr).
- Every push and pull request runs typecheck, lint, tests with coverage and the build
  (`.github/workflows/ci.yml`). Vercel builds a preview of each pull request.

- How to add a song, a progression, a pattern or a path step: [docs/CONTENT.md](docs/CONTENT.md).
