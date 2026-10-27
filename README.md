# Piano Trainer

Learn to play songs at the piano: lessons and courses, the chords and scales each song needs, and a player that plays
along, loops, or waits for your keys. Installable, works offline, in English and Russian.

## Run it

Needs Node 24 (`nvm use`).

```bash
npm install
npm run dev                        # http://localhost:5173
npm run test                       # all tests
npm run build && npm run preview   # the production build, with the service worker
```

CI (`.github/workflows/ci.yml`) runs only when started by hand; the local checks in [CLAUDE.md](CLAUDE.md) are the
gate. Vercel previews each pull request and deploys `main` (`vercel.ts`).

## Docs

- What it is and for whom: [PRODUCT.md](PRODUCT.md). Its look: [DESIGN.md](DESIGN.md).
- How the code is organised and the rules for changing it: [CLAUDE.md](CLAUDE.md), then
  [docs/CODE_STYLE.md](docs/CODE_STYLE.md).
- Adding a song, pattern, lesson or course: [docs/CONTENT.md](docs/CONTENT.md).
- The words we use: [docs/UBIQUITOUS_LANGUAGE.md](docs/UBIQUITOUS_LANGUAGE.md).
- Decisions and why: [docs/adr](docs/adr).
