# Practices for the best result at the least cost

Taken from the superpowers skills (obra/superpowers: brainstorming, writing-plans, subagent-driven-development, dispatching-parallel-agents, test-driven-development, systematic-debugging, verification-before-completion, receiving-code-review) and from impeccable (impeccable.style, installed in `.claude/skills/impeccable`), fitted to this repo and to the owner's rule: the best result for the least usage. Each line is a habit, not a ceremony; skip a step only when it truly adds nothing.

## Before building

- **Know what you know.** If the owner's message (with its screenshots and `feedback-log.md`) says what to build, build it; don't open a conversation. Ask only what changes what gets built, as one direct question at the end of a report, never as a stall.
- **Look before you ask.** Read the code, the ADR and the reference first; most questions answer themselves.
- **Size the work in a line.** Small: do it now. Medium: a short plan in your head or the todo list. Large (several areas, a new model shape): write a spec in `.scratch/<feature>/spec.md` with the decisions, then build. Plans name files, signatures, test names and the check that proves each step, never the code itself; a plan longer than its spec is a transcript.
- **Name the approaches only when they differ in a way the owner would care about**, recommend one, and go.

## Building

- **Test first, and watch it fail** (superpowers TDD's iron law). A test that passes before the change tests nothing. Then the smallest code that makes it pass, then tidy. A bug fix starts with the test that reproduces it.
- **Root cause before a fix** (systematic-debugging). Read the error, reproduce it, trace the data, form one hypothesis, test it minimally. After three failed fixes, stop and question the design. "Flaky" is not a cause.
- **One task, one commit,** its message saying what changed and why.
- **Same-shape edits across many files** are one pass with a script or a careful batch, not one agent each.

## UI work: impeccable

Impeccable (impeccable.style, v4.8 installed in `.claude/skills/impeccable`, by pbakaus) is the design skill for every visual change.

- **Who calls it.** The owner types `/impeccable <command> <target>` (or a pinned shortcut such as `/polish`). You call it yourself through the Skill tool (`skill: "impeccable"`, `args: "polish src/pages/songs"`) whenever the work is visual; it is listed as user-invocable, and the model may invoke it too. With no argument it shows a menu and never runs a command on its own, so always pass a command and a target.
- **Setup, once a session:** run `.claude/skills/impeccable/scripts/impeccable context --target <path>` (it loads PRODUCT.md, DESIGN.md and the surface brief); if it fails, say so in a line and read PRODUCT.md and DESIGN.md yourself. Read its `reference/craft-floor.md` right before any UI edit, not for planning.
- **Our mode is Operate** (the Player, the editor, the library, the tools); lessons and How to use are **Read**. Operate means: the tool disappears into the task; familiarity is a feature; one sans carries everything; a fixed rem type scale (steps of 1.125–1.2), not fluid; restrained colour, the accent only for primary actions, the current selection and states; every control's default, hover, focus, active, disabled, loading and error states; skeletons, not spinners in content; empty states that teach; overlays that escape their container (portal, popover, fixed); transitions of 150–250 ms that show state, never decoration; no modal when an inline or progressive way works.
- **Commands, by what you want** (each loads its own reference):

  | Want | Command |
  |---|---|
  | plan a screen before coding | `shape` |
  | find problems: accessibility, performance, responsive | `audit` |
  | find what holds the design back, scored | `critique` |
  | the last pass before shipping | `polish` |
  | clutter out | `distill` |
  | labels, copy, error messages | `clarify` |
  | phone, phone on its side, laptop | `adapt` |
  | errors, edge cases, i18n, offline | `harden` |
  | spacing, rhythm, hierarchy | `layout` |
  | type hierarchy | `typeset` |
  | motion that shows state | `animate` |
  | too loud / too bland | `quieter` / `bolder` |
  | first run and empty states | `onboard` |
  | a slow screen | `optimize` |
  | record the look | `document` (DESIGN.md), `extract` (tokens and components) |

  A good order for an existing screen: `critique` or `audit` → fix → `polish`, with `adapt` and `harden` where the screen is used on a phone or with real data.
- **Its craft floor**, checked on the rendered page at the sizes it ships at, batching fixes before looking again: contrast ≥ 4.5:1 (3:1 large); tight groups, generous separation, more space above a heading than below; every state; one authored motion, eased out, honouring reduced motion; the browser's own surfaces themed (selection, caret, scrollbars, focus rings, tabular numerals); copy in the product's language (a control names its action, an error names the problem and the way out); every requirement findable within seconds.
- **Its refusals** (defaults to avoid unless the owner asks): cards of icon-heading-text as the page's structure, cards in cards; a kicker above a heading (never); section numbers that carry nothing; a modal for a task that needs no interruption; gradient text; glass and blur as decoration; a thick coloured border on one side of a card; hard offset shadows; sparklines, rings and rounded rectangles standing in for content; monospace as costume.
- **Refinement keeps the identity; redesign replaces it.** Never polish a look the owner has rejected. Never fix impeccable's context drift as a side effect of design work; report it.
- `/impeccable hooks on` runs its detector after UI edits; `/impeccable doctor` repairs stale context files. Both are the owner's to turn on.

## Before saying done

- **Evidence before claims** (verification-before-completion). Name the command that proves it, run it fresh, read the output, then say what it showed: "6,249 tests pass", never "should pass". An agent's report of success is not evidence; its diff and a test run are.
- **Check against the request line by line**, the owner's words and screenshots, not only the tests.
- Run what CLAUDE.md says (typecheck, lint, the tests the change reaches; the full suite and the build once before a push to `main`).
- Leave nothing running: check `ps` and stop your finished servers, loops and runs by PID (SKILL.md, Testing).

## Reviews and feedback

- **Verify a review's claim before acting on it**; push back with the reason when it is wrong; no performative agreement, just the fix.
- **YAGNI:** don't build what nobody asked for because it looks professional.
- A review of your own work is a read of the diff with the owner's rules beside it; ask a fresh reviewer only for a large or risky change, and give it the code, not your conclusion.

## Calling skills

- **Check for a skill before acting**, including before a question or a look round the code: if one fits the task, invoke it with the Skill tool and follow it; it tells you how to explore. Process skills first, then implementation skills: a bug starts with `diagnosing-bugs`, a new feature with the size check above (and `grilling` only when the owner asks to be grilled), then `tdd`, `impeccable`, `shadcn` and the React skills carry it out.
- **Which skill, when** (all in `.claude/skills/`; the owner can type each as `/<name>`):

  | Situation | Skill |
  |---|---|
  | any new code or bug fix | `tdd` |
  | a hard bug or a slow screen | `diagnosing-bugs` |
  | anything visual | `impeccable` (above), `web-design-guidelines` for an accessibility pass |
  | a component in `shared/ui/primitives` | `shadcn` (its CLI, never by hand) |
  | React, bundle, Vite performance | `vite-react-best-practices`, `vercel-react-best-practices` |
  | a component's API | `vercel-composition-patterns`; a module's shape: `codebase-design` |
  | view transitions | `vercel-react-view-transitions` |
  | naming and domain terms | `domain-modeling`, `ubiquitous-language` |
  | docs and any prose the app shows | `humanizer`, `writing-guidelines` |
  | reviewing a branch | `code-review` (it spawns two reviewers: use it for large changes, read the diff yourself for small ones) |
  | a merge conflict | `resolving-merge-conflicts` |
  | a question that needs primary sources | `research` |
  | a throwaway try-out | `prototype` |
  | a spec, issues, triage | `to-spec`, `to-issues`, `triage` (the tracker is `.scratch/`) |
  | handing work to the next session | `handoff`, or `prompts/handoff.md` |

- **Read the skill each time**; skills change, and memory of one is not the skill.
- **Skills are not free:** each one loaded costs context. Load the one the task needs, not every one that sounds near.
- **Superpowers** (obra/superpowers) is enabled for this repo in `.claude/settings.json` (its marketplace is added and the plugin turned on, so a session here installs it). Its skills are called as `superpowers:<name>`: `brainstorming`, `writing-plans`, `executing-plans`, `test-driven-development`, `systematic-debugging`, `verification-before-completion`, `requesting-code-review`, `receiving-code-review`, `using-git-worktrees`, `finishing-a-development-branch`, `dispatching-parallel-agents`, `subagent-driven-development`, `writing-skills`. **The owner-way rule comes first** where they differ: run plans *natively* (inline), never `subagent-driven-development` or `dispatching-parallel-agents` unless the work passes the agent test in SKILL.md; `brainstorming` only for a large feature whose request leaves real choices open; `using-superpowers`' "invoke before anything" means check for a fitting skill, not load every near one.

## Owner-way or a superpowers skill?

**Default: the owner-way practices above.** They are the superpowers' rules already condensed and loaded, so they cost nothing more. Load a full superpowers skill only when its whole procedure pays for the context it takes:

| Situation | Use | Why |
|---|---|---|
| A bug you understand, a small fix | the practices (root cause, test first) | the condensed rule is enough |
| A bug that survived one fix, crosses components, or is intermittent | `superpowers:systematic-debugging` (or our `diagnosing-bugs`) | its four phases stop guessing |
| Any code change | the practices, or our `tdd` | same red-green rule, already here |
| About to say "done", commit or push | the practices' "evidence before claims" | a habit, not a procedure |
| A large feature: several areas, a new model shape, days of work | `superpowers:writing-plans`, then run it **inline** (its "native" mode) | a written plan keeps a long build straight |
| A request that leaves real choices open and the owner wants to shape it | `superpowers:brainstorming` (or our `grilling` when asked to be grilled) | one question at a time beats a wrong build |
| Review findings from a bot or a person on a PR | `superpowers:receiving-code-review` | verify each before acting, push back with reasons |
| A large change worth a fresh pair of eyes | `superpowers:requesting-code-review` or our `code-review` | an unanchored read; otherwise read the diff yourself |
| Changing a skill beyond a line or two | `superpowers:writing-skills` | test the skill against a task it got wrong |
| Several truly independent large parts | `superpowers:dispatching-parallel-agents`, only if the agent test passes | otherwise inline |
| Executing a plan task by task with an agent each | **not** `subagent-driven-development`: run the plan inline | a fresh context per task is what eats the usage |
| Worktrees and finishing a branch | the owner's own flow (CLAUDE.md, SKILL.md) | `using-git-worktrees` and `finishing-a-development-branch` don't fit it |

When unsure, ask: would following this skill change what I do next? If not, don't load it.

## Dos and don'ts

Do:
- read only the part of a file you need; filter long command output to its summary lines;
- test first and watch it fail; find the root cause; prove "done" with a fresh run;
- look at the rendered screen at 390, 320, 844×390 and 1280 before calling a UI change done;
- commit each finished task; push the branch often, `main` only after the full suite and the build;
- say what you left and why, and ask the owner's decisions as direct questions.

Don't:
- spawn an agent for work you can do inline, or more agents than truly independent parts;
- paste long material into a prompt or keep long reports in context; use files;
- claim success from an agent's report, a partial run or "should";
- fix a symptom, raise a timeout without a reason, or skip a test;
- add what nobody asked for, or leave a half feature, a placeholder or legacy code;
- put explanations under controls, hardcode text on the score, or let anything clip at 320px.

## Writing and changing skills (this one included)

- A skill holds judgment, not what a linter or a test can enforce; repo conventions go in CLAUDE.md.
- Keep SKILL.md short and move detail to `references/`, read when needed; the description says what it does and when to use it, in the words the owner uses.
- Test a change to a skill as you would code: think of a task the old version got wrong and check the new one gets it right.

## Agents (when the owner-way rule allows one)

- One agent per independent problem domain, each with a focused, self-contained brief that says the scope, the goal, the constraints and the shape of its report.
- Pick the model by the task: extraction and mechanical edits on a small model; integration on a standard one; design and judgment on the strongest. Fewer turns beat a cheaper token: a weak model that takes three times the turns costs more.
- Dispatch the independent ones in one message so they run together; wait for the notification, never poll.
- Integrate yourself: read each report, check the diffs don't conflict, run the full suite once.
