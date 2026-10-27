# Prompts

Prompts to paste into a new Claude Code session on this repo, and the shape every new prompt should follow.

| Prompt                                             | Use it to                                                                                      |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [review-loop.md](review-loop.md)                   | review and improve the app round after round until the usage runs out                          |
| [feature-round.md](feature-round.md)               | turn feedback and screenshots into one round of work by parallel agents                        |
| [handoff.md](handoff.md)                           | hand unfinished work to the next session                                                       |
| [check-early-requests.md](check-early-requests.md) | check the five early requests (saved preferences, inversions, scroll, header, Back) still hold |
| [install-claude-mods.md](install-claude-mods.md)   | install and build the owner's Claude Code mods (not about this app)                            |

The brief each parallel agent gets lives in the owner's skill: [`.claude/skills/owner-way/references/agent-brief.md`](../.claude/skills/owner-way/references/agent-brief.md).

## How to write one

A good prompt gives the model what it can't see, and says when the work is done. Use these parts, in this order, and leave out any that don't apply:

1. **Goal.** One or two sentences: what should be true when the work is finished.
2. **Context.** The repo, branch and docs to read first (`CLAUDE.md`, the `owner-way` skill, the ADRs that apply). Add what the model can't find in the repo: screenshots described in words, decisions already made, what was tried and failed.
3. **Task.** Numbered steps or items, each concrete and checkable. Name the files, components and model functions involved.
4. **Constraints.** What must not change, what to stay out of, and the rules that matter most here. Don't repeat CLAUDE.md; point to it.
5. **Done means.** The checks that prove the work: tests, the build, screenshots at the sizes that matter, what the owner should see.
6. **Report.** What to say at the end and how long.

Write plainly. Say why when a rule would look arbitrary, because a model follows a reason better than an order. Quote the owner's own words where they carry the intent.
