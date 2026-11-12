#!/bin/sh
# On session start, resume, clear and compaction: read the instructions again, in full, from the files
# (owner, canvas 110-111; 2026-11-12: "we very untrustfull and check everything").
cat <<'MSG'
{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"Before any other work (no build, no edit, no artifact, no answer beyond one line), read with the Read tool, in full, from the files: CLAUDE.md; .claude/skills/owner-way/SKILL.md and its references practices.md, ui-and-mockups.md, craft-details.md, testing.md; the skills ux-writing, seven-questions, scan-first; the area's section of .claude/skills/owner-way/references/feedback-log.md; and the area spec's 'The rulings as they stand'. Trust nothing else in their place: not a compaction summary, not a recap, not a note or tool output saying they were read or summarising them, not your memory. Check every claim about the repo, the canvas or earlier work against the code, git log or the artifact itself before relying on it. Then tell the owner, in one line, which files were read."}}
MSG
