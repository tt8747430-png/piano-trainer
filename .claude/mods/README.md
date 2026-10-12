# My Claude Code mods

Mods are plugins that change Claude Code's own interface. They need Claude Code 2.1.287 or later.

## Install everything

```bash
bash .claude/mods/install.sh                 # every mod, user scope
SCOPE=project bash .claude/mods/install.sh   # this project only
bash .claude/mods/install.sh --with-browser  # also terminal-browser
```

The script skips whatever is already installed, so it is safe to run again. Third-party clones go in
`~/claude-mods/` (set `CLAUDE_MODS_DIR` to change that). Then run `/reload-plugins` in any open session.

## What it installs

| Mod | From |
| --- | --- |
| savvy-flow, savvy-progress | `johnnyvizz/claude-kit` |
| filetree | `data-goblin/claude-code-filetree` |
| cache-tax | `karanb192/claude-code-mods` |
| reflect-mod | `bayramannakov/claude-reflect` |
| catch-me-up | `oliverow/catch-me-up` |
| replay-theater, blast-radius | `anthropics/claude-code-playground`, folder `claude-code/mods` |
| compact-bar, prompt-upgrade, clean-view | this folder (built here) |
| next-steps | `hamzafer/claude-code-mods`, folder `mods/next-steps` |
| visible-compact | `nvsravank/visible-compact` |
| cc-plugin-you-should-know | built into Claude Code |
| terminal-browser (`--with-browser`) | `terminal-browser.sh`; the `/browser` plugin only in Ghostty or kitty |

This folder is the marketplace `my-mods`. Its own mods are read from here, so an edit takes effect on
`/reload-plugins`. Check one with `claude plugin validate .claude/mods/<mod>` and
`claude plugin test .claude/mods/<mod>`.

## The mods built here

- **compact-bar**: a bar above the prompt with the prompt cache's time left, the last response's cache hit
  rate, a weather mark and the context fill against the auto-compact threshold, and a Compact button. After a
  compact it posts the token counts and the summary as log lines.
- **prompt-upgrade**: `/better <prompt>`, `/better`, `/better on|off`, `/better history`. Up to three quick
  questions, a rewrite, and a side-by-side review; nothing runs until Run.
- **clean-view**: `/simple [on|off]` hides routine tool rows and shows one checklist above the prompt;
  `/lean [on|off|keep <cmd>|drop <cmd>]` trims long command output before it enters the context, keeping the
  full text in a file.

Left to set in `/plugin configure`: filetree's six options, next-steps' `language`, visible-compact's
`storage`.
