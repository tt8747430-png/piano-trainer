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

- Our app is impeccable's **Operate** mode (an editor, a player, tools): scanability, consistency and the platform's own patterns outrank expression; the brand lives in precise details. Lessons and How to use are **Read** mode.
- Call it by its commands with a target, e.g. `/impeccable audit src/pages/score-editor`, then `polish`, `harden`, `adapt` (phone, landscape, laptop), `clarify` (labels and copy), `distill` (remove what isn't needed), `layout`, `typeset`, `animate`, `quieter`. Start a session's first UI task with its setup (`scripts/impeccable context`), which loads PRODUCT.md and DESIGN.md.
- Its **craft floor**, checked on the rendered page at the sizes it ships at, batching fixes before looking again:
  - contrast ≥ 4.5:1 for body text, 3:1 for large;
  - tight groups and generous separation, more space above a heading than below;
  - every state: hover, focus, disabled, loading, error, empty;
  - one authored motion, eased out, honouring reduced motion;
  - the browser's own surfaces themed (selection, caret, scrollbars, focus rings, tabular numerals);
  - copy in the product's language: a control names its action, an error names the problem and the way out;
  - every requirement present and findable within seconds.
- **Refinement keeps the identity; redesign replaces it.** Never polish a look the owner has rejected.

## Before saying done

- **Evidence before claims** (verification-before-completion). Name the command that proves it, run it fresh, read the output, then say what it showed: "6,249 tests pass", never "should pass". An agent's report of success is not evidence; its diff and a test run are.
- **Check against the request line by line**, the owner's words and screenshots, not only the tests.
- Run what CLAUDE.md says (typecheck, lint, the tests the change reaches; the full suite and the build once before a push to `main`).

## Reviews and feedback

- **Verify a review's claim before acting on it**; push back with the reason when it is wrong; no performative agreement, just the fix.
- **YAGNI:** don't build what nobody asked for because it looks professional.
- A review of your own work is a read of the diff with the owner's rules beside it; ask a fresh reviewer only for a large or risky change, and give it the code, not your conclusion.

## Agents (when the owner-way rule allows one)

- One agent per independent problem domain, each with a focused, self-contained brief that says the scope, the goal, the constraints and the shape of its report.
- Pick the model by the task: extraction and mechanical edits on a small model; integration on a standard one; design and judgment on the strongest. Fewer turns beat a cheaper token: a weak model that takes three times the turns costs more.
- Dispatch the independent ones in one message so they run together; wait for the notification, never poll.
- Integrate yourself: read each report, check the diffs don't conflict, run the full suite once.
