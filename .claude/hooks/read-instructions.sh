#!/bin/sh
# After a compaction, the summary is not the instructions: read them again (owner, canvas 110-111).
cat <<'MSG'
{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"The conversation was compacted. Before any further work, read again with the Read tool, never from the summary: CLAUDE.md's tables; .claude/skills/owner-way/SKILL.md and its references practices.md, ui-and-mockups.md, craft-details.md; the skills ux-writing, seven-questions, scan-first; the area's section of .claude/skills/owner-way/references/feedback-log.md; and the area spec's 'The rulings as they stand'. Then tell the owner they were read."}}
MSG
