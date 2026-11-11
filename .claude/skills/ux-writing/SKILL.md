---
name: ux-writing
description: Use in piano-trainer when reviewing, rewriting, generating or harmonising the words on a canvas board or an app screen (labels, buttons, errors, empty states, toasts, settings), or when the owner says a label is unclear, asks what a button should say, or asks for a copy review.
---

# UX writing

Work as a context-aware UX writer on the board in hand. Treat interface copy as part of a user task, not as isolated prose. Improve the experience without inventing product behavior or redesigning beyond the user's request.

Write in the language of the selected design or the user's request. When a file contains multiple locales, preserve each locale and its conventions unless the user explicitly asks for translation.

## On our canvas

This skill was written for Figma. In Piano Trainer it runs on the owner's Design canvas (Claude Design), inside the
loop `redesigning-a-screen` sets out; `owner-way` and `CLAUDE.md` still bind every change.

| Written for Figma        | Here                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| the file                 | the area's published canvas (its link is the first line of the area's spec)               |
| a frame                  | a board: `<Name>` for the phone, 402 wide; `<Name>Laptop` for the laptop, 1710 wide       |
| the selection            | the board the owner names or has open; with none, the area being worked on                |
| layers and auto layout   | the board's markup, written by its generator in `.scratch/<round>/canvas/` (flex, inline  |
|                          | styles)                                                                                   |
| components and instances | the kit's helpers (`GROUP`, `BSHEET`, `POPOVER`, `SEGC`, `TOGGLE`); in the app, the kit   |
|                          | in `shared/ui`                                                                            |
| variables and styles     | the kit's constants (`INK`, `SOFT`, `LINE`, `FILL`, `PAGE`, `SHEET`, `ACCENT`, `SHADOW`); |
|                          | in the app, `DESIGN.md` and the theme                                                     |
| inspecting a node        | run the board in the real runtime and measure it: `.scratch/r39/canvas/checks/`           |
| editing the file         | change the generator, rebuild, run the layout check, look at whole-screen screenshots at  |
|                          | both sizes, publish to the same canvas                                                    |

- **Read the rulings first** (the area's spec, "The rulings as they stand"). Nothing a ruling removed comes back.
- **A review changes nothing.** A fix is one turn of the loop: canvas, checks, publish, the ruling in the spec, the
  feedback log, the drawing, commit and push.
- **Measure, then say.** Every finding cites a number from the runtime or a line of the generator.
- **The words are the owner's:** musician's terms, `avoid-words.test.ts`, every string in `en` and `ru` when ported.

- **Both languages.** The canvas is drawn in English; a string that changes here changes in `en` and `ru` when it
  is ported, and a Russian string is checked for fit (it runs longer).
- **Names come from musicians,** never invented phrases: check `owner-way`'s feedback log for the area before
  proposing a new word.

## Respect the Working Boundary

- Treat the named board, sheet, drawer or flow as the edit boundary.
- Inspect the whole board, its other size, its sheets and neighbouring boards, and the rulings when they provide necessary context. Do not edit them unless requested.
- If the user asks for a review, make no canvas changes.
- If the user asks to rewrite, edit only the requested copy.
- If the user asks to generate content, distinguish confirmed product facts from assumptions requiring validation.
- If the user asks to harmonize content, normalize terminology only within the stated scope.
- Preserve the kit's helpers, the board's states, its layout and its look: only the words change.

## Protect Meaning and Trust

- Preserve product behavior, information hierarchy, brand voice, and the consequence of every action.
- Never invent features, prices, limits, timelines, policies, guarantees, research, analytics, testimonials, or legal claims.
- Do not silently alter consent, privacy, security, payment, deletion, or other high-stakes content.
- Do not claim that a static design proves usability, accessibility compliance, localization quality, or implementation behavior.
- Use visible evidence first. Ask one concise question only when missing context would materially change the result; otherwise state the assumption and proceed.

## Determine the Mode

Infer the requested mode:

- **Review**: diagnose and propose; do not edit.
- **Rewrite**: improve existing copy within the requested scope.
- **Generate**: create copy for specified screens or missing states.
- **Harmonize**: align terminology and patterns across a selected flow.

When edit intent is unclear, default to Review.

## Follow the Workflow

### 1. Frame the Experience

Establish from the prompt and visible design:

1. who is reading and which language, expertise, or access needs matter;
2. what the person is trying to accomplish;
3. whether the moment is discovery, decision, waiting, error, risk, success, or return use;
4. what action the interface actually allows next;
5. which terms, components, rules, constraints, and states already exist;
6. what the design can prove and what requires later validation.

Never present an invented persona or need as research.

### 2. Inspect the Design Context

- Read each string on its whole screen, in a screenshot, never as a line of the generator alone.
- Inspect adjacent steps, related states, responsive variants, and repeated components when available.
- Identify the primary task, primary and secondary actions, feedback, help, and recovery paths.
- Check established terminology before introducing a synonym.
- Note variables, placeholders, dynamic values, plural-sensitive strings, and legally or operationally constrained content.
- Distinguish user-facing copy from annotations, sample data, layer names, and internal notes.

### 3. Inventory and Diagnose

Classify visible content by role: orientation, action, input, feedback, recovery, assistance, state, decision, and variable data.

Evaluate material issues against:

- **Clarity**: understandable on first reading;
- **Action**: a specific next step that is genuinely available;
- **Context**: appropriate to this moment in the flow;
- **Consistency**: stable names for the same object, action, and state;
- **Recovery**: a usable path after a problem;
- **Trust**: honest consequences and uncertainty;
- **Inclusion**: plain, respectful, culturally portable language;
- **Accessibility**: meaningful visible labels and wording that does not rely only on color or icons;
- **Fit**: compatibility with the visible hierarchy and space without losing meaning.

Resolve the interaction or information problem before polishing the sentence. Do not shorten copy merely to make it look cleaner.

### 4. Act According to the Mode

#### Review

- Make no edits.
- Group repeated systemic issues into one finding.
- Cite the board and the control by its visible label (and the generator's line when fixing).
- Provide complete replacements, not fragments.
- Report only findings that materially improve comprehension, completion, recovery, trust, consistency, or fit.

#### Rewrite

- Apply the smallest copy change that resolves the issue.
- Preserve dynamic tokens, variables, numeric meaning, and product terminology.
- Keep component structure and bindings intact.
- Re-read the full static flow after editing.

#### Generate

- Base new copy on visible product facts and the stated scenario.
- Cover the necessary orientation, action, feedback, and recovery content.
- Mark uncertain behavior, timing, policy, or data as needing confirmation.
- Add only content that helps the task.

#### Harmonize

- Establish the preferred term from existing evidence before replacing variants.
- Keep one term per object, one verb per recurring action, and one progression vocabulary per flow.
- Preserve legitimate tone differences between routine, celebratory, error, and high-stakes moments.

### 5. Verify

- Confirm that every requested screen or state was addressed.
- Compare the phone and laptop boards, each sheet and each state for terminology and action consistency.
- Inspect wrapping, truncation, clipping, overlap, hierarchy, and likely text expansion.
- Confirm that no unrequested layer, binding, structure, or visual property changed.
- Confirm that buttons describe real actions and messages describe real states.
- State what remains unverified, such as runtime interaction, implementation strings, analytics, user comprehension, accessibility behavior, localization, and legal approval.

## Apply the Writing Rules

### Voice and Language

- Reuse the established product voice and terminology.
- Keep a stable voice while adapting tone to the stakes: encouraging for low-risk onboarding, neutral for routine actions, calm for errors, and explicit for sensitive decisions.
- Prefer concrete words over idioms, humor, or fashionable abstractions. A musician's term is never jargon here: it
  always wins over a plain-language paraphrase, and an option is never explained in a line under it (`CLAUDE.md`,
  owner, canvas 158: "Chromatically", never "in every key, up by half steps"). "Diatonic | Chromatic",
  not "In the key | Chromatic" (owner, canvas 109). Choices side by side are the same kind of word.
- Use active constructions, one instruction at a time, and parallel structures for comparable choices.
- Follow locale conventions for capitalization, punctuation, dates, numbers, and units.
- Translate meaning and intent, not word order.

### Actions, Forms, and Links

- Start action labels with a precise verb and name the real outcome.
- Repeat the consequence in destructive confirmations: use “Delete project”, not “Yes”.
- Keep recurring actions consistent unless behavior differs.
- Make link text identify its destination or purpose.
- Keep a visible label for every field; use placeholders only for examples or formats.
- State requirements, constraints, units, and consequences before input when possible.
- Keep labels, hints, validation, and actions semantically connected.

### Errors, Empty States, and Feedback

- For errors, say what happened, what is affected, and what the reader can do next.
- Distinguish correctable validation from system failures requiring retry, reconnection, waiting, or support.
- Avoid blame, jokes, “Oops”, and generic “Something went wrong” messages.
- Distinguish first use, no data, no results, filtered results, unavailable content, and loading failure.
- Explain what belongs in an empty state and provide the most useful next action.
- Distinguish saved, sent, uploaded, submitted, queued, processed, and published states.
- Never imply success before the system confirms it.

### Consent and Sensitive Content

- Make the choice, consequence, scope, and reversibility understandable without weakening legal meaning.
- Keep acceptance and refusal choices honest unless a legitimate hierarchy is confirmed.
- Never turn an obligation into a guarantee or a legal statement into marketing copy.
- Flag substantive changes for product, policy, security, or legal validation.

## Prioritize Findings

- **Critical**: obscures a consequence, creates material risk, misleads, or prevents task completion or recovery.
- **Important**: causes substantial ambiguity, inconsistency, unnecessary effort, or likely layout failure.
- **Improvement**: strengthens clarity, tone, scanning, or consistency without blocking the task.

Do not inflate severity.

## Report the Result

For a review, start with one sentence defining the scope, then use:

| Priority | Location | Current | Proposed | Why |
| --- | --- | --- | --- | --- |
| Critical / Important / Improvement | Board and control | Complete current copy | Complete replacement | User and task impact |

Add systemic terminology decisions, static verification performed, and questions needing product, implementation, accessibility, localization, research, or legal confirmation. If no material issue exists, say so directly.

After an edit or generation, report only:

1. **Updated**: boards, sheets or content groups changed.
2. **Decisions**: terminology, tone, and pattern choices applied.
3. **Verified**: fit, wrapping, variants, flow consistency, and preserved structure.
4. **Needs confirmation**: remaining assumptions and specialist checks.

## Definition of Done

Finish only when the requested scope and mode are respected; material copy roles and states are addressed; terminology and actions are consistent; no capability, product fact, research result, or legal meaning was invented; edits preserve structure and visible fit; and completed checks and remaining unknowns are explicit.
