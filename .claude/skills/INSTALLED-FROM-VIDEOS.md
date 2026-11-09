# Skills installed from the design videos

Installed 2026-11-07 at the owner's word ("install all the mentioned skills"), copied from each repository's default
branch (the `skills` CLI could not run in the cloud session, so they are not in `skills-lock.json`). Each folder
keeps its licence. `CLAUDE.md`, `DESIGN.md` and the owner's rulings win over any of them (`owner-way`).

| Skills | Source (commit) | Licence |
| ------ | --------------- | ------- |
| `stageshow` | github.com/benjitaylor/skills (299140f) | MIT |
| `agentation`, `agentation-self-driving` | github.com/benjitaylor/agentation (0e3236e) | PolyForm Shield 1.0.0 |
| `make-interfaces-feel-better` | github.com/jakubkrehel/make-interfaces-feel-better (35545ea) | MIT |
| `baseline-ui`, `improve-ui`, `fixing-accessibility`, `fixing-motion-performance`, `fixing-metadata`, `create-design-md`, `component-canvas`, `create-canvas`, `ui-skills-root` | github.com/ibelick/ui-skills (97dea9e) | MIT |
| `emil-design-eng` (with `ui-cheatsheet.md`), `animate`, `animation-performance`, `animation-vocabulary`, `apple-design`, `ask-sonner`, `break-ui`, `choreograph`, `find-animation-opportunities`, `improve-animations`, `mobile-native`, `pick-ui-library`, `remove-animations`, `review-animations`, `prototype-variants` | github.com/emilkowalski/skills (c8a7962) | MIT |
| `grill-me`, `grill-with-docs`, `wait-what`, `to-tickets`, `implement-spec`, `pr`, `retro`, `writing-for-agents` (new, 2026-11-09), and `grilling`, `code-review`, `implement`, `to-spec`, `tdd`, `prototype`, `research`, `domain-modeling`, `diagnosing-bugs`, `codebase-design`, `improve-codebase-architecture`, `triage`, `handoff` brought to v1.3.2; `wizard`, `ask-matt`, `wayfinder`, `setup-matt-pocock-skills`, `to-questionnaire`, `teach` added | github.com/mattpocock/skills v1.3.2 (4ae2317, the default branch's head on 2026-11-09) | MIT (`LICENSE-mattpocock-skills.txt`) |

- Emil's `prototype` is installed as `prototype-variants`, since the repo already has a `prototype` skill.
- Not installed: Emil's `write-swift` (Swift) and `animate-expo` (React Native and Expo), which are outside this
  app's stack.
- `impeccable` was already installed.
- `stageshow` has its own `package.json` for its playground. Run `npm install` inside its folder only when using the
  playground; it never joins the app's dependencies.
- `agentation` needs its npm package and its toolbar on the page. Adding them to the app is a separate change.
- Run only when called by name (`disable-model-invocation: true`, added here to save context and to stop them firing
  during the redesign canvases): `stageshow`, `agentation`, `agentation-self-driving`, `ask-sonner` (the app does not
  use Sonner), `animation-vocabulary`, `fixing-metadata`, `create-canvas`, `component-canvas`, `create-design-md`
  (`DESIGN.md` exists) and `ui-skills-root` (needs its CLI).
- Matt Pocock's set (the video on v1.3): `implement-spec` starts one agent per ticket, against the owner's rule to work
  inline, so it runs only at the owner's word; `to-issues` is the older name of `to-tickets` and stays for old plans.
- The Firecrawl CLI's 32 skills are user-level, installed by the cloud environment's setup script, not in this folder.
- Not installed from Matt Pocock's repository: its `misc/` (his own tooling: shoehorn, exercises, pre-commit, git
  guardrails) and `in-progress/` (unfinished) folders.
