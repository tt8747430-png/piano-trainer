# Practices

The habits behind the best result at the least usage. Each is a condensed skill, so most tasks need nothing more loaded.

## Before building

- **Look before you ask.** The code, the ADR, `git log` and the reference answer most questions.
- **Size the work in a line.** Small: do it. Medium: a short description. Large: a spec, then a plan (SKILL.md).
- **Plans name** files, signatures, test names and the check that proves each step, never the code itself.
- **Name approaches only when they differ in a way the owner would care about,** recommend one, and go.

## Building

- **Test first and watch it fail.** A test that passes before the change tests nothing. A bug fix starts with the test that
  reproduces it. Then the smallest code that passes, then tidy.
- **Root cause before a fix.** Read the error, reproduce it, trace the data, test one hypothesis. After three failed fixes,
  question the design. "Flaky" is not a cause.
- **Final code the first time:** resolve uncertainty before writing, by reading the source or trying it in a scratch file.
- **Same-shape edits across many files** are one pass with a script.

## Before saying done

- **Trust no "done".** A task list, a summary or your own memory says what was meant, not what is there: check each
  line of the request against the code and the running screen, every time, including tasks already marked done.
- **A second pass, always.** After the first pass works, go over it again as the owner would and improve what you
  find; better twice and checked than once and unverified.
- **Evidence before claims.** Name the command, run it fresh, read the output, say what it showed: "6,249 tests pass", never
  "should pass". Run what the claim needs, and name what you did not run.
- **Check the request line by line,** the owner's words and screenshots, not only the tests.
- **Two passes for any screen or mockup** ([testing](testing.md)).
- **Verify what you write about.** A doc naming a component, a token or a size is checked against the code before it is
  committed.
- **Leave nothing running.**

## Reviews

- **Verify a review's claim before acting;** push back with the reason when it is wrong.
- **YAGNI:** don't build a feature nobody asked for because it looks professional. This never shrinks the task asked:
  that is done completely and checked twice (SKILL.md, Overdo); the two do not conflict.
- Reviewing your own work is reading the diff with the owner's rules beside it. Ask a fresh reviewer only for a large or
  risky change, and give it the code, not your conclusion.

## Skills

Check for a fitting skill before acting, then read its current text. The owner's rules win where they differ. Skills cost
context, so load the one the task needs, and ask: would it change what I do next?

| Situation                                   | Skill                                                             |
| ------------------------------------------- | ----------------------------------------------------------------- |
| Any new code or bug fix                     | `tdd`                                                             |
| A bug that survived a fix or is intermittent | `systematic-debugging`, `diagnosing-bugs`                        |
| Anything visual                             | `impeccable` (below); `web-design-guidelines` for accessibility   |
| A mockup or any published page              | `artifact-design`, `artifact-capabilities`                        |
| A component in `shared/ui/primitives`       | `shadcn`, its CLI, never by hand                                  |
| A new component's anatomy                   | `building-components`, `vercel-composition-patterns`              |
| React, bundle, Vite performance             | `vite-react-best-practices`, `vercel-react-best-practices`        |
| A module's shape                            | `codebase-design`                                                 |
| View transitions                            | `vercel-react-view-transitions`                                   |
| Docs and any prose the app shows            | `humanizer`, `writing-guidelines`                                 |
| A multi-task plan                           | `writing-plans`, run inline with `executing-plans`                |
| A request with real choices left open       | `brainstorming`; `grilling` only when asked                       |
| About to say done                           | `verification-before-completion`                                  |
| A large change wanting fresh eyes           | `requesting-code-review` or `code-review`                         |
| Findings from a reviewer                    | `receiving-code-review`                                           |
| A merge conflict                            | `resolving-merge-conflicts`                                       |
| A question needing primary sources          | `research`                                                        |
| A throwaway try-out                         | `prototype`                                                       |
| The database                                | `supabase`, then `supabase-postgres-best-practices`               |
| Vercel config                               | `knowledge-update` before touching `vercel.ts`; `vercel-cli`      |
| Changing a skill                            | `writing-skills`                                                  |
| Handing work on                             | `handoff`, `prompts/handoff.md`                                   |

Superpowers' skills may appear with or without the `superpowers:` prefix. Plans run inline, never through
`subagent-driven-development`, because a fresh context per task is what eats the usage; `implement-spec` is the one
exception, on SKILL.md's terms. Not for this app unless asked:
`workflow`, `autoship`, `remotion-best-practices`, json-render's `core` and `react`.

## Impeccable

The design skill for every visual change, called with a command and a target (`skill: "impeccable"`, `args: "polish
src/pages/songs"`).

| Want                                             | Command                       |
| ------------------------------------------------ | ----------------------------- |
| Plan a screen before coding                      | `shape`                       |
| Problems: accessibility, performance, responsive | `audit`                       |
| What holds the design back, scored               | `critique`                    |
| The last pass before shipping                    | `polish`                      |
| Clutter out                                      | `distill`                     |
| Labels, copy, error messages                     | `clarify`                     |
| Phone, on its side, laptop                       | `adapt`                       |
| Errors, edge cases, i18n, offline                | `harden`                      |
| Spacing, hierarchy, type                         | `layout`, `typeset`           |
| Motion that shows state                          | `animate`                     |
| Too loud, too bland                              | `quieter`, `bolder`           |
| First run and empty states                       | `onboard`                     |
| A slow screen                                    | `optimize`                    |
| Record the look                                  | `document`, `extract`         |

A good order for an existing screen: `critique` or `audit`, fix, `polish`, with `adapt` and `harden` where it matters.
Refinement keeps the identity. Context drift is reported, never fixed as a side effect. `hooks` and `doctor` are the owner's
to turn on.

## Writing skills and docs

- A skill holds judgment; what a linter or test can enforce goes there; repo conventions go in `CLAUDE.md`.
- SKILL.md stays short, detail goes in `references/`, and the description says when to use it, never what it does step by
  step.
- Test a change: give a fresh agent the old text and a task it got wrong, then the new text, and compare.
- Say what the output is (a recipe) rather than listing what to avoid, unless the failure is a rule skipped under pressure.

## Outside skills: where the owner's rules win

The skills in `.claude/skills/` and the plugins carry their authors' workflow. Where one differs from `CLAUDE.md`,
`DESIGN.md` or this skill, the owner's rule wins, always. Design and motion differences are in
[craft-details](craft-details.md) ("Where the app's own rules differ"); the workflow ones are here.

- **Which copy:** read every skill from `.claude/skills/<name>/`. A `superpowers:` or `anthropic-skills:` copy of the
  same name (`impeccable`, `owner-way`, the superpowers set) is ignored; the repo's copy is the current one.
- **No pull requests, no worktrees for your own work:** never `finishing-a-development-branch`'s menu or
  `using-git-worktrees`; an agent started with `isolation: "worktree"` ([agent-brief](agent-brief.md)) is the one use. Work on
  the session's branch, commit each task, and push to `main` after the gate (SKILL.md, Merge). `executing-plans` and
  `writing-plans` run that way: plans beside the spec in `.scratch/<round>/plan/`, no execution question, no stop
  before a push, its final fresh reviewer only for a large or risky change.
- **Every finding is fixed,** whatever its grade: no "deferred minors" (`executing-plans`, `requesting-code-review`).
- **No questions in autonomous mode:** `brainstorming`, `tdd`'s seams, `receiving-code-review`'s clarifications and
  `systematic-debugging`'s "discuss before more fixes" take the recommendation and go, the question in the report.
- **`tdd` is the one TDD skill;** `test-driven-development` only when another skill loads it, read as the same rule.
- **Skills load when they change what you do next,** not on a 1% chance; no "Using [skill]" announcement before the
  answer (`using-superpowers` yields to "answer first").
- **Never stage with `git add .`** or deploy (`deploy-to-vercel`); hosting is the owner's. Never read `.env` (`wizard`).
- **Nothing written outside its home:** no `docs/superpowers/`, `design-plans/`, `.ua/`, `MISSION.md`, questionnaires
  or a new `DESIGN.md` (`impeccable`'s redesign, `create-design-md`); `DESIGN.md` is amended in place.
- **Not for this app:** `finishing-a-development-branch`, `using-git-worktrees`, `deploy-to-vercel`, `wizard`,
  `before-and-after`, `understand` and `understand-*`, `review` (use `code-review`), `improve-ui`,
  `setup-matt-pocock-skills`, `triage`, `wayfinder`, `to-spec`, `teach`, `to-questionnaire`, `diagnosing-superpowers`,
  `dispatching-parallel-agents` and `design-an-interface`'s fan-out (agents as below).

## Agents

- Inline by default (SKILL.md, How work runs). When agents are worth it: one per independent problem, briefed from a file ([agent-brief](agent-brief.md)), dispatched in one message.
- The model fits the task: extraction on a small one, design and judgment on the strongest.
- Wait for the notification, never poll. Integrate yourself: read each diff and run the full suite once.
