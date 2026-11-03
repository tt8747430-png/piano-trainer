# Round 29: where everything is

Read in this order when you pick the round up.

| What | File | What it holds |
|---|---|---|
| The brief | [`prompt.md`](prompt.md) | The owner's whole brief: standing rules, Decided (D1–D20; **D20 is the owner's corrections of 2026-11-03 and wins over the rest**), Part A (A1–A43), Part B (B1–B11), constraints, rounds |
| The plan | [`plan.md`](plan.md), parts in [`plan/`](plan/) | What will be built, item by item: source, today, will build (route, controls, labels), not in it, done when, owner's questions. **Nothing is built before its item is in the plan and the owner has read it** (D20) |
| Where things stand | [`progress.md`](progress.md) | Each item's state, commits and notes; the owner's to-dos; round reports; decisions |
| What the code really does | [`compliance/`](compliance/) | The audit of 2026-11-03 against the brief: [`summary.md`](compliance/summary.md) (contradictions, claimed-but-not, fix order), [`part-a1.md`](compliance/part-a1.md) (rules, Step 0, A1–A19), [`part-a2.md`](compliance/part-a2.md) (A20–A43), [`part-b.md`](compliance/part-b.md) (D1–D20, B1–B11, constraints, process) |
| Area specs (Phase 1) | `<area>/spec.md` | The design of each large piece, written before building: [`back-as-up`](back-as-up/spec.md), [`settings-registry`](settings-registry/spec.md), [`key-picker`](key-picker/spec.md), [`pedal-events`](pedal-events/spec.md), [`piano-sampler`](piano-sampler/spec.md), [`metronome-engine`](metronome-engine/spec.md), [`fingering-service`](fingering-service/spec.md), [`colour-notes`](colour-notes/spec.md), [`profile`](profile/spec.md), [`staves-play-show`](staves-play-show/spec.md). Where a spec and `plan.md` differ, the plan is newer |
| Earlier audit | [`audit.md`](audit.md), [`settings-map.md`](settings-map.md) | Round 1's first audit and the map of every setting (superseded where `compliance/` and `plan.md` say so) |
| Copy changes | [`copy.md`](copy.md) | Old and new wording of every legal paragraph changed (D18) |
| Agent briefs | [`briefs/`](briefs/) | The briefs given to agents (one per task) |
| Screenshots | [`shots/before`](shots/before), [`shots/after`](shots/after) | The app before the round and after each item |

Outside this folder:
- The owner's preferences and feedback by area: `.claude/skills/owner-way/SKILL.md`, `references/feedback-log.md`.
- Decisions and their reasons: `docs/adr/` (index in its README); each area's ADR carries an `r29` line.
- Names: `docs/UBIQUITOUS_LANGUAGE.md`. Look: `DESIGN.md`. The repo map: `CLAUDE.md`.
- References the owner gave: `piano-data/` (Musicca's site files in `piano-data/musica` are reference only:
  no licence, so none of their code or audio ships; the progressions are facts and were compared).
