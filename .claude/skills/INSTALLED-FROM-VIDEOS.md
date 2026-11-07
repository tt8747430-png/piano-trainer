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

- Emil's `prototype` is installed as `prototype-variants`, since the repo already has a `prototype` skill.
- Not installed: Emil's `write-swift` (Swift) and `animate-expo` (React Native and Expo), which are outside this
  app's stack.
- `impeccable` was already installed.
- `stageshow` has its own `package.json` for its playground. Run `npm install` inside its folder only when using the
  playground; it never joins the app's dependencies.
- `agentation` needs its npm package and its toolbar on the page. Adding them to the app is a separate change.
