#!/usr/bin/env bash
# Installs all my Claude Code mods. Needs Claude Code 2.1.287 or later.
#   bash .claude/mods/install.sh                 # user scope, every mod
#   SCOPE=project bash .claude/mods/install.sh   # this project only (.claude/settings.json)
#   bash .claude/mods/install.sh --with-browser  # also terminal-browser (asks before running its installer)
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
SCOPE="${SCOPE:-user}"
CLONES="${CLAUDE_MODS_DIR:-$HOME/claude-mods}"

run() { echo "+ $*"; "$@" || echo "  ! failed, continuing"; }
has() { claude plugin list 2>/dev/null | grep -q "> $1\b"; }
install() { if has "$1"; then echo "= $1 already installed"; else run claude plugin install "$@" --scope "$SCOPE"; fi; }
clone() { # owner/repo -> $CLONES/repo, HTTPS (no SSH key needed)
  local dir="$CLONES/${1#*/}"
  if [ -d "$dir/.git" ]; then echo "= $dir already cloned"; else run git clone --depth 1 "https://github.com/$1" "$dir"; fi
}

echo "Claude Code $(claude --version)"

# Marketplaces on GitHub
for mp in johnnyvizz/claude-kit data-goblin/claude-code-filetree karanb192/claude-code-mods bayramannakov/claude-reflect oliverow/catch-me-up; do
  run claude plugin marketplace add "$mp"
done
install savvy-flow@claude-kit
install savvy-progress@claude-kit --config language=auto
install filetree@claude-code-filetree
install cache-tax@claude-code-mods
install reflect-mod@claude-reflect-marketplace
install catch-me-up@catch-me-up

# replay-theater and blast-radius live in a subfolder of the playground repository
mkdir -p "$CLONES"
clone anthropics/claude-code-playground
run claude plugin marketplace add "$CLONES/claude-code-playground/claude-code/mods"
install replay-theater@claude-code-playground-mods
install blast-radius@claude-code-playground-mods

# My own marketplace, this folder: compact-bar, prompt-upgrade, clean-view, next-steps, visible-compact.
# Read from this folder, so an edit here takes effect on /reload-plugins.
run claude plugin marketplace add "$HERE"
for m in compact-bar prompt-upgrade clean-view next-steps visible-compact; do install "$m@my-mods"; done

run claude plugin enable cc-plugin-you-should-know@builtin --scope "$SCOPE"

if [ "${1:-}" = "--with-browser" ]; then
  tmp="$(mktemp -d)"
  curl -fsSL https://terminal-browser.sh/install -o "$tmp/install.sh" && {
    echo "terminal-browser's installer is at $tmp/install.sh. Read it first:"
    echo "  less $tmp/install.sh"
    read -r -p "Run it now? [y/N] " yes
    [ "$yes" = "y" ] && bash "$tmp/install.sh"
  }
  case "${TERM_PROGRAM:-}${TERM:-}" in
    *ghostty*|*kitty*)
      run claude plugin marketplace add zenbu-labs/terminal-browser
      install terminal-browser@terminal-browser ;;
    *) echo "Skipping the /browser plugin: this terminal has no kitty graphics (Ghostty or kitty needed)." ;;
  esac
fi

echo
claude plugin list
echo "Now run /reload-plugins in any open session."
