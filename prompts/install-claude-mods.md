# Install my Claude Code mods

I want the Claude Code mods and plugins below installed on this machine, and three more built. Mods are plugins that change Claude Code's own interface (panes, bars above the prompt, slash commands). They need Claude Code 2.1.287 or later, where they load by default with no feature flag.

## Before you start

Read this entire prompt yourself and make sure you understand it. Then, before you do anything else, tell me in plain language what this prompt is going to do, every file you will create, overwrite or delete, every script you will run on my machine, and anything that costs money or is hard to undo. Ask me to confirm I have read and understood it, and wait for my yes before you begin.

After my yes, do not ask me questions. Make sensible choices and list them for me at the end.

**Scope: user** (all my projects). To install for one project instead, change this line to `project`. Project scope writes to that project's `.claude/settings.json`, which is usually tracked in git, so say so in your report if you use it.

## How to install

- Check `claude --version` and run `claude update` if it is older than 2.1.287.
- Use the `claude plugin …` CLI from the shell, one command after another. You can't run `/plugin` slash commands yourself, and when I type them only one runs per message.
- Pass the scope above with `--scope` on every `install` and `enable`.
- Run `claude plugin list` first and skip whatever is already installed at that scope.
- If a clone over SSH fails, clone the same repository over HTTPS.
- Anything that has to be cloned goes in `~/claude-mods/<repo-name>`. Keep those clones: the installs point at them.

## The mods

| #   | Mod                       | Source                                         | Install as                                               |
| --- | ------------------------- | ---------------------------------------------- | -------------------------------------------------------- |
| 1   | savvy-flow                | marketplace `johnnyvizz/claude-kit`            | `savvy-flow@claude-kit`                                  |
| 2   | savvy-progress            | same marketplace                               | `savvy-progress@claude-kit`                              |
| 3   | filetree                  | marketplace `data-goblin/claude-code-filetree` | `filetree@claude-code-filetree`                          |
| 4   | cache-tax                 | marketplace `karanb192/claude-code-mods`       | `cache-tax@claude-code-mods`                             |
| 5   | reflect-mod               | marketplace `bayramannakov/claude-reflect`     | `reflect-mod@claude-reflect-marketplace`                 |
| 6   | catch-me-up               | marketplace `oliverow/catch-me-up`             | `catch-me-up@catch-me-up`                                |
| 7   | replay-theater            | clone of `anthropics/claude-code-playground`   | `replay-theater@claude-code-playground-mods`             |
| 8   | blast-radius              | same clone                                     | `blast-radius@claude-code-playground-mods`               |
| 9   | next-steps                | clone of `hamzafer/claude-code-mods`           | from the local marketplace                               |
| 10  | visible-compact           | clone of `nvsravank/visible-compact`           | from the local marketplace                               |
| 11  | cc-plugin-you-should-know | built in                                       | `claude plugin enable cc-plugin-you-should-know@builtin` |
| 12  | terminal-browser          | installer script, then an optional plugin      | see below                                                |
| 13  | compact-bar               | you build it                                   | see below                                                |
| 14  | prompt-upgrade            | you build it                                   | see below                                                |
| 15  | clean-view                | you build it                                   | see below                                                |

What the table can't say:

- **savvy-progress (2)** has one option, `language` (`auto`, `en` or `ru`). Install it with `--config language=auto` so nothing is left unset.
- **cache-tax (4)**: if the marketplace install fails on its clone, clone `https://github.com/karanb192/cache-tax` over HTTPS and install from that folder. Install the mod only, not the settings-hook version of the same name, or every cold send is guarded twice. Its keep-warm pings cost tokens once I run `/keepwarm`.
- **reflect-mod (5)**: don't install the Python `claude-reflect` plugin beside it, or every correction is captured twice. It makes one small model call for each short prompt I type.
- **replay-theater and blast-radius (7, 8)**: clone the repository once, then add its subfolder `claude-code/mods` as the marketplace. That folder's marketplace is named `claude-code-playground-mods`.
- **next-steps (9)**: do not add `hamzafer/claude-code-mods` as a marketplace by its GitHub name. It declares the marketplace name `claude-code-mods`, the same name `karanb192/claude-code-mods` declares, and cache-tax is installed from the latter. Clone it and serve `mods/next-steps` through the local marketplace instead. That marketplace also holds a `blast-radius`; I want the one from the playground repository.
- **visible-compact (10)**: the repository has a `plugin.json` and no marketplace file, so it also goes through the local marketplace.
- **The local marketplace**: make `~/claude-mods` itself a marketplace named `local-mods` (`~/claude-mods/.claude-plugin/marketplace.json`) whose plugins point at the clones beside it, so each clone stays a clean checkout I can `git pull`. It serves next-steps, visible-compact, compact-bar, prompt-upgrade and clean-view.

## terminal-browser (12)

This is a shell program, not a mod. Download `https://terminal-browser.sh/install`, read it, then run the copy you read rather than piping it straight into `bash`. It installs to `~/.local/share/terminal-browser` and `~/.local/bin`, and its setup step adds a `terminal-browser` skill to `~/.claude/skills`.

Its Claude Code plugin (`/browser`) is `terminal-browser@terminal-browser` from the marketplace `zenbu-labs/terminal-browser`. Install it only if the terminal I'm running in supports the kitty graphics protocol: Ghostty, kitty, or a libghostty-based terminal. In any other terminal, such as VS Code's, it can garble the interface, so skip it there and tell me. Its README asks for `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1` in `~/.claude/settings.json`; other mods load without that on 2.1.296, so add it only if `/browser` doesn't appear, and tell me if you did.

## The mods to build (13, 14, 15)

Use your plugin-authoring skill for all three and follow it exactly: read the types it points you to before you write anything, put each mod in its own folder, and write at least one test for each. Build each as a function-hook mod, with no shell-script hook and no MCP server.

Develop each mod in the folder the skill names, where it hot-reloads. Once it works, copy it to its folder under `~/claude-mods` and install it from the local marketplace, and make sure the session doesn't end up loading both copies.

Rules that save you time:

- A draw must not save or change anything. Read while drawing. Change state only from a button press, a command or another event.
- A slash command must answer right away. If it opens a pane, return the text first and open the pane in the background.
- Never name a variable `h` in a `.tsx` file. It breaks drawing and the pane comes up blank.
- Keep saved data in the mod's own store. Do not write files inside the mod's folder.
- No pop-ups for routine actions. Only tell me something when it needs me.
- Wrap every command in a catch so a failure returns a plain sentence instead of nothing.

Before you say a mod is done, run `claude plugin validate` and `claude plugin test` on it and fix everything they report.

### compact-bar (13)

A mod that draws a narrow bar directly above the input field. From left to right the bar shows:

1. The prompt cache's remaining time in minutes, counted from the last response. Use the cache lifetime my session really has (5 minutes or 1 hour). Beside it, a bar of 20 boxes that empties as time passes: green, yellow in the last quarter, red in the last 10%, and the word "expired" at 0. Redraw every minute.
2. The cache hit rate of the last response in percent: the share of its input tokens that came from the cache.
3. A weather emoji for the context: ☀️ up to half of the auto-compact threshold, 🌧️ up to 80% of it, ⛈️ above that. Read my session's auto-compact threshold; if you can't, use 83%.
4. The context fill in percent, with the auto-compact threshold beside it.
5. A "Compact" button that does what `/compact` does, highlighted at ⛈️. In the Desktop app, and while Claude is still working, the direct call doesn't work: queue `/compact` as a command then, so it starts as soon as Claude finishes.
6. A small arrow that collapses the bar. Collapsed, it shows only the weather, the cache's remaining time and the context percent.
7. After `/compact` or a click on "Compact", write the summary Claude continues from into the chat, under a line with the token counts before and after. Use log lines the model does not read, and split a long summary at its paragraphs so nothing is cut off.

Once it runs, save it as a plugin in `~/claude-mods/compact-bar` and install it at user scope, whatever the scope line above says. If that name is taken, pick another and tell me.

Install the other mods first and look at what cache-tax and visible-compact already draw above the prompt and post after a compact. If compact-bar would repeat one of them, most likely by posting the same summary twice, tell me which parts overlap instead of shipping both.

### prompt-upgrade (14)

A mod that turns a rough prompt into a great one before it is sent. It opens a pane, asks up to three quick multiple-choice questions, rewrites the prompt, and shows the original and the upgrade side by side. Nothing runs until I press Run.

Save it in `~/claude-mods/prompt-upgrade`, add it to the local marketplace and install it at the scope above.

#### How it starts

- `/better <my rough prompt>` upgrades that prompt. `/better` alone opens a box to type one. `/better on` and `/better off` flip the automatic mode. `/better history` shows my last 20 upgrades.
- When automatic mode is on, a prompt I type in the prompt box goes to the pane first instead of being sent.
- Let these go straight through untouched: slash commands, prompts with files or images attached, messages sent while Claude is working, short replies like "yes" or "keep going", and anything starting with ">" (strip the ">" before sending).
- The upgraded prompt is sent by the mod, so make sure it can never loop back into the pane.
- If the pane cannot open because the window is too narrow, put my words back in the prompt box and say so in one line.

#### The four steps, shown as a tracker across the top

Your prompt, Questions, Rewrite, Review. Finished steps get a green check, the current one is gold, the rest are muted.

1. Reading. Show my prompt in a framed card with a line that says what is happening.
2. Questions. Ask a fast model for up to three multiple-choice questions that would most improve the result, each with two to four short options. Draw each question with a gold number badge that becomes a green check when answered. Options are chips. Add an "Other (type it)" chip and a quiet "Skip". Show how many are answered and a "Skip the rest, upgrade now" button. If no question would help, go straight to the rewrite.
3. Rewrite. Ask the model for the upgraded prompt and a short list of what it added.
4. Review. One line of numbers at the top (words before, words after, how many details were added). Then the buttons: Run it, Edit, Copy, Cancel. Then a "what I added" list. Then two cards side by side, my prompt on the left and the upgrade on the right with a gold outline. Keep the buttons above the cards so a long rewrite never pushes them off screen.

#### Rules for the rewrite

- Keep exactly what I meant. Add a clear goal, who it is for, the format, and what "done" looks like.
- Use what I answered. Leave out what I skipped.
- Never invent facts, names, numbers or prices. Where something is unknown, leave a [placeholder] in square brackets.
- Write it as one request I could have typed myself, in plain language.

#### Other behavior

- Cancel closes the pane and puts my original prompt back in the prompt box so nothing is lost.
- Edit lets me change the upgraded text, and Enter runs it.
- If a model call fails, show a calm error card that says my prompt is safe, with Try again, Send my original, and Cancel.
- Keep the last 20 upgrades. Clicking one in the history reopens its review.
- If the mod is reloaded mid-step, pick the step back up instead of leaving the pane stuck.

#### Tests to write

Which prompts are intercepted and which pass through, reading the questions, reading the rewrite, the full flow from `/better` to Run, Cancel restoring the prompt, and the on and off switch.

#### The look

Dark, calm and premium. No emoji, nothing that blinks, nothing blurry.

- Title in bold capitals on the left. Under it, a short gold rule (#F2C46D) the width of the title that continues as a dim hairline (#262B33) to the edge.
- Section headings in small muted capitals (#7D8590) followed by a hairline.
- Main text in #E6EDF3. Good news in green (#3DD68C). Warnings in amber (#E3B341).
- The main button on a screen is a gold chip with dark bold text. Other buttons are slate chips (#262B33) with light text. Cancel is plain muted text.
- Big numbers are drawn three rows tall with heavy box-drawing characters, inside rounded tiles.
- Size every row to the width of the pane so nothing wraps. Check it at a narrow width and a wide one.

### clean-view (15)

A mod with two jobs. It keeps the screen calm while Claude works: routine tool rows are hidden, and one checklist above the prompt shows the plan, the current step and how far along it is. And it keeps long command output out of the conversation, so the context holds what Claude needs and not thousands of lines of build log.

I'm a developer, so code changes and errors stay in sight; only the routine rows go.

Save it in `~/claude-mods/clean-view`, add it to the local marketplace and install it at the scope above. Both jobs start switched on.

#### What I should see

While Claude works through a plan, this sits just above the prompt:

```
Build my landing page · 1m 12s                     [ ● Clean View: ON ]
✓ Read your brand notes            ██████████  Done
▶ Build the pricing section        ██████░░░░  60%
○ Add the contact form             ░░░░░░░░░░  Next
○ Polish the footer                ░░░░░░░░░░  Up next
```

- **Header:** the job's name in 2 to 6 words, then how long it has been running.
- **Done steps:** a green check, a dimmed name, a full meter and "Done".
- **Current step:** a ▶, the name in bold and a meter that fills to the reported percent. If there's no percent yet, the meter shows a moving sweep and the label says "Working".
- **Upcoming steps:** dimmed. The first one says "Next" and the rest say "Up next".
- **The button** sits at the right of the header row. One click turns the view off and shows a short toast.
- **Long plans:** show five step rows at most. Fold the earlier done steps into one row ("✓ 3 done") and the later ones into "+2 more".
- **Idle:** draw nothing when no job is showing.
- **Other bands:** this one shares the space above the prompt with savvy-progress, cache-tax, reflect-mod and compact-bar. Add to what `next(e)` returns, never replace it, and stay out of the way of a survey (`hasSurvey`).

The header changes with the state of the job:

| State     | Header shows                                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------------------------------- |
| Working   | Job name · time running                                                                                                 |
| Needs you | Highlighted **Needs you** badge and the reason, e.g. "Claude needs your OK to continue". The current step's ▶ becomes ‖ |
| Stuck     | ⚠ Stuck: the reason, in one plain sentence                                                                              |
| Stopped   | ■ Stopped · job name · you pressed Esc                                                                                  |
| Done      | ✓ All done · job name · took 2m 14s. After 5 seconds it shrinks to one line                                             |

#### How the checklist works

**1. Two tools Claude calls (register them with `$.tool.register` at session start)**

- `plan_steps({ title: string, steps: string[] })`: Claude names the job in 2 to 6 words starting with a verb, and lays out every step up front, 2 to 8 short names in order. The first step starts right away. Return "Planned N steps. The first one has started."
- `report_progress({ task: string, percent: number })`: Claude reports progress on the current step. Clamp the percent to 0 to 100. When a planned step is reported, every step before it is checked off. When a step reaches 100, it's checked off and the next one starts automatically. A name that isn't in the plan becomes a new step. Return "Progress noted: N%."

**2. Tell Claude when to use them (`prompt.compose`)**

While the view is on, add a short system-prompt section that says:

- When the work has three or more steps, call `plan_steps` first (load it with ToolSearch if it's deferred), then `report_progress` as real progress happens, and with 100 the moment a step finishes. For a quick question or a one-step job, don't plan.
- A step name is under 48 characters, starts with a verb and says what the step achieves. A file or function name is fine. A full path or a command is not.
- If the work is already tracked, by a to-do list (TodoWrite, TaskCreate) or by a savvy-flow run reporting to savvy-progress, don't call `plan_steps` as well.

Never deny a tool because no plan exists. A gate costs a round trip on every request, and most of mine are short.

**3. Fill the checklist from what Claude already does**

- **On `turn.start`:** a real prompt (not a slash command) sent while nothing is running starts a new job. Until a plan arrives, show one line: the first words of my prompt and the time running. Don't call a model to name the job; the name comes from `plan_steps`.
- **TodoWrite, TaskCreate and TaskUpdate:** turn these into checklist rows.
- **Permission prompts and questions** (`classic.Notification`, AskUserQuestion): switch to **Needs you**. Clear it once the next tool runs or I reply.
- **Failures:** if I said no to a permission, show "Stuck: you said no to a step, so Claude paused". After 3 failed tool calls in a row, show "Stuck: a step keeps failing, Claude is trying another way". A success clears the Stuck state.
- **On `turn.complete`:**
  - An API error becomes one calm sentence. Rate limits: "you hit your usage limit, try again a little later". Overloaded: "Claude's servers are busy, try again in a minute". Context too long: "type /compact and try again". Network: "the internet connection dropped". Auth: "type /login".
  - A refusal becomes "Claude couldn't help with that request".
  - Esc becomes Stopped.
  - If steps are left unfinished, show Needs you with "Claude is waiting for your reply".
  - With a finished plan, show All done and collapse it after 5 seconds. With no plan, clear the line.

**4. Hide the routine rows**

While the view is on, render `ToolUse`, `ToolResult` and `ToolGroup` as hidden and blank out the `ToolProgress` hint for routine work: reads, searches, and commands that succeeded. Keep these in sight: file edits with their diffs, any result that is an error, and anything waiting for my permission. Claude's written replies always stay visible.

**5. Turn it on and off**

- The button turns the view off. `/simple on|off` does both, and with no argument it flips the setting.
- Save the setting with `$.store` so it survives restarts.
- When it's off, every hidden row comes back and the band draws nothing.

#### Lean output

What fills my context fastest is command output Claude never rereads. In a `tool.call` hook, after `next(e)` returns, shorten such a result once, before it enters the conversation. Never rewrite a result that is already there: that would break the prompt cache.

**What is trimmed:** Bash output, stdout and stderr each, when it runs over 80 lines or 8,000 characters.

- Save the full, untouched text to a file first: one folder per session, outside the repository and outside the mod's folder. If the Bash result already carries a `persistedOutputPath`, use that file. Delete a session's files when it ends, and anything older than seven days at start.
- Strip ANSI colour codes and the lines a progress bar or spinner overwrote. Fold a run of identical lines into one with "(×N)", and a run of blank lines into one.
- If it is still over the limit, keep the first 20 lines and the last 40 (the last 120 when the command failed), plus up to 40 lines in between that look like errors or warnings (error, fail, warn, exception, traceback, ✗, ×), each with one line either side.
- Cut any single line past 2,000 characters.
- Where lines were dropped, leave one marker: `… 1,812 lines trimmed by Clean View. Full output: <path>`.

**What is never touched:**

- Every tool other than Bash. Fetched content always arrives whole: WebFetch, WebSearch, MCP tools (documentation, browser pages, design files), Read, Grep, Glob and subagent reports.
- Bash commands that print the content I'm after: `curl`, `wget`, `cat`, `head`, `tail`, `sed`, `awk`, `jq`, `grep`, `rg`, `ls`, `find`, `tree`, `wc`, `git diff`, `git show`, `git log`, `git status`, `git blame`, `gh` and `terminal-browser`. If one of them appears anywhere in the command line, leave the whole result alone.
- Images, background tasks and anything under the limit.
- Commands on my keep list.

**Tell Claude:** while lean output is on, the `prompt.compose` section also says that long command output arrives trimmed with the path to the full text, that Claude reads the part it needs from that file instead of running the command again, and that when I ask for a command's full output it reads the file and shows me.

**Commands:** `/lean on|off`. `/lean` alone reports whether it is on, how many results it trimmed this session, roughly how many tokens it kept out (characters ÷ 4) and the keep list. `/lean keep <command>` and `/lean drop <command>` edit the keep list. Save the switch and the list with `$.store`.

Trim for subagents as well as the main agent.

#### Details that matter

- **One cleaner for names.** It removes backticks and keeps the word inside, shortens a path to its last part, collapses whitespace and capitalises the first letter. Names longer than 48 characters are trimmed at a word boundary and get "…". If nothing is left, use "Working on it".
- **Animation.** A 250ms clock advances a frame counter only while a job is working or waiting on me. No timers run while idle.
- **Narrow terminals.** Size the name column from `bodyColumns` so rows never wrap. The meter is always 10 cells.
- **Shared state.** Keep state under the plugin's own key, typed in `types/index.d.ts`, so other mods can read it: `cleanViewEnabled`, `leanEnabled`, `checklist` (title, phase, tasks of `{ id, name, status: done|active|upcoming, percent, hasReported }`, needsYouReason, stuckReason, startedAt, finishedAt, isCollapsed), `lean` (trimmedCount, charsSaved) and `tick`.
- **Structure.** One `register.tsx` calls `registerCleanView(on)` from `clean-view.tsx` and `registerLeanOutput(on)` from `lean-output.ts`. Keep the trimming itself a pure function, command and text in, text out, so its tests need no engine.

#### Tests to write

1. "Build the pricing section in \`src/ui/Pricing.tsx\`" cleans up to "Build the pricing section in Pricing.tsx". An 80-character name trims to 48 or less.
2. A to-do list plus a 60% report renders ✓ / ▶ 60% / Next / Up next rows, on both the terminal and desktop surfaces. A nine-step plan renders five step rows at most.
3. A permission prompt shows **Needs you**.
4. `/simple off` hides the band and brings the hidden rows back.
5. `plan_steps` followed by `report_progress` at 100 checks off step one and starts step two.
6. No tool is denied when no plan exists.
7. A read's row is hidden. An edit's row and an error's row stay.
8. A 500-line passing test run is trimmed to its head, its tail and the marker, and the file the marker names holds the full text.
9. A failing run keeps its error lines and its last 120 lines.
10. A WebFetch result, `curl` output and the `cat` of a long file pass through unchanged.
11. `/lean off` stops the trimming, and `/lean keep vitest` exempts that command.
12. A result that was trimmed is not trimmed again.

#### Done means

- I send a request with several steps and the plan appears as soon as Claude makes it, with the routine rows gone and the diffs and errors still showing.
- The meter moves as the work happens. When the job finishes I see "✓ All done · took …", and 5 seconds later it shrinks to one line.
- A permission prompt turns the header into **Needs you** right away.
- A long build or test run reaches Claude trimmed, a fetched page reaches it whole, and `/lean` shows what was kept out.
- Both switches are remembered after a restart.
- All the tests pass.

Before you finish, look through the types for other places a mod can keep noise out of the conversation, such as repeated reminders or other plugins' session-start context. List what you find for me, without building it.

## When you're done

Check the result with `claude plugin list`, then give me a table with one row per mod: installed, already there, skipped or failed, and the reason for anything that isn't installed.

For each mod you built, also tell me in plain words: how to turn it on, the commands it adds, the choices you made for me, and anything you could not verify.

End with what only I can do: run `/reload-plugins` to load the mods into an open session, and anything left to set in `/plugin configure`.
