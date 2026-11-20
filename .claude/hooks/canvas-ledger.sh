#!/usr/bin/env bash
# Prints the canvas change ledger so it outlives a compaction: on PreCompact it goes into the summary's
# instructions, on SessionStart (compact, resume) back into the context. The ledger is the record of truth.
f="$CLAUDE_PROJECT_DIR/.scratch/r39/canvas/CHANGES.md"
[ -f "$f" ] || exit 0
echo "Keep this canvas change ledger verbatim in the summary (pending lines in full): every change since the last compaction, its commit, boards and published version. Before any further publish, read the Pending section and send those boards too."
echo
sed -n '/^## Pending/,$p' "$f" | head -60
