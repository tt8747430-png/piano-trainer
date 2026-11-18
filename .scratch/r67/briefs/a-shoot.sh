#!/bin/bash
# Agent A: shoot routes one after another, phone and laptop. a-shoot.sh <outdir> <name>=<route> ...
out=$1; shift
mkdir -p "$out"
cd /home/user/piano-trainer/.claude/worktrees/agent-a10a7c5d77bb3274a || exit 1
for pair in "$@"; do
  name=${pair%%=*}; route=${pair#*=}
  for size in phone laptop; do
    node .scratch/r67/briefs/a-app.mjs $size "$route" "$out/$name-${size:0:1}.png" 2>&1 | grep -E 'PAGEERROR|ERR|Error' | head -3
  done
done
ls "$out"
