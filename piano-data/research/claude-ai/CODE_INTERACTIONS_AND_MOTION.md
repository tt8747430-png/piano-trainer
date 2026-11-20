# claude.ai code: interactions, timings and motion

Read statically from the minified production bundles of build `0d4c697ee92cd073dd85742c468e4621a7382bc3` (Vite/rolldown ES modules, no source maps). The live UI walk-through is in `UI_FLOWS_AND_MENUS.md` and every setting is in `SETTINGS.md`; this file adds what only the code shows: ids, key bindings, delays, durations, storage keys and branching.

**How to read this file**

- **exact** means the claim was read from code. Evidence is `file` + a short grep-able snippet (one line or less). Identifiers such as `nH`, `Op` or `wl` are **minified names**: they are only stable inside this build.
- **inferred** means the claim is reasoned from surrounding code or from the live recording, not read directly.
- The bundle set has **no `.css` files** (only `.js` chunks were captured). CSS keyframes (`cds-dot-pulse`, `cds-reveal-in`, the menu popup transition) and the `:root` token declarations are therefore not in the evidence. Where a value lives only in CSS, it is marked **not in captured code**. Token *values* are still exact, because a JS design-token table repeats them (section 9).
- Anthropic code is not copied. Snippets are at most one line; the sketches are mine.

---

## 1. Keyboard shortcut system

### What it does
There is one central command registry. Each entry has an id, a description, a group and optional bindings per platform (`mac` or `non-mac`) and per app (`web` or `desktop`). One hook resolves the active binding, matches key events and produces the display string. A separate list (`FV`) holds the three "global" palette and sidebar shortcuts. Users can override chords (`customShortcuts`).

### How

**Registry.** The registry is `I6` in `shared-1-oCC5mj_Q.js`. From it `MQ` is derived: id → `{bindings, description, sessionDescription}`, kept only for entries that have a `shortcut`. **exact**: `shared-1-oCC5mj_Q.js` `Object.entries(I6).flatMap(([e, t]) => "shortcut" in t && t.shortcut`.

**Binding shape** (**exact**, from the `dt` and `_x` literals): `{ key, code?, matchBy?: "char", modifiers: ("cmd"|"ctrl"|"alt"|"shift")[], platform: "mac"|"non-mac", app?: "web"|"desktop" }`. A binding applies when `(!platform || platform === current) && (!app || app === current)`. **exact**: `bT = function ({ platform: e, app: t }, n, r) {`.

**Platform resolution.**
- The hook (`w7` in shared-1) computes `f = n ? "mac" : "non-mac"` and `p = r ? "desktop" : "web"`, then filters the bindings with `bT`. **exact**: `f = n ? "mac" : "non-mac",`.
- Each command declares its Mac and non-Mac chords separately, usually `cmd` on Mac and `ctrl` elsewhere. The palette pair is generated: `v$(id)` returns `[{key, modifiers:["cmd",...shift], platform:"mac"}, {key, modifiers:["ctrl",...shift], platform:"non-mac"}]`. **exact**: `{ key: t, modifiers: ["cmd", ...r], platform: "mac" },`.
- For display and for parsing user-typed chords, the word `cmd` is rewritten to `ctrl` when not on a Mac. **exact** (`c561be045-SZ4_rT5O.js`): `return n === "cmd" && !t ? "ctrl" : n;`.
- Aliases normalised: command/meta → cmd, control → ctrl, option → alt, escape → esc, return → enter, arrowup → up, `+` → plus, and so on. **exact**: `["option", "alt"],`.

**Matching (`a$` in shared-1).**
- If the binding has a `code` and `matchBy:"char"`, the produced character is compared (layout-aware); otherwise `event.code` is compared.
- For a single letter combined with ctrl or meta, a layout-aware comparison (`wK`) is used.
- All four modifier flags must match exactly.
- A `ctrl+alt` chord without `cmd` is **rejected** when AltGraph is active, so European AltGr characters do not fire shortcuts. **exact**: `(i && o && !r && (e.getModifierState?.("AltGraph") || wm(e))) ||`.

**Auto-repeat.** When a matched key event has `repeat`, the default is prevented and the command does not fire again. **exact**: `? t.repeat ? (t.preventDefault(), null)`.

**Input-focus exclusions.**
- `skipInEditable: !0` is set on `toggle_sidebar` (`⌘B`/`Ctrl+B`) and on `toggle_comment_mode` (`⌥C`). These do nothing while the caret is in a text field. **exact**: `{ id: "toggle_sidebar", key: "b", skipInEditable: !0 },`.
- When the document is an embedded artifact frame (`data-artifact-composed` on `<html>`), **all** shortcuts are disabled except `command_palette`, `search_palette`, `toggle_sidebar` and the two F6 commands. **exact**: `if (Pv() && !da.has(e) && !cc.has(e) && !s) {`, with `Pv` = `e.documentElement.hasAttribute("data-artifact-composed")` (`shared-l-p-m-w-3-BmU3nrSV.js`).
- A command bound to an `href` only fires when the event target is inside `#root, #portal-root` (`cT`). **exact**: `e.target.closest("#root, #portal-root") !== null`.

**Custom shortcuts.**
- Stored under the settings key `customShortcuts` (an object of id → chord string). **exact**: `h.read("customShortcuts")`.
- These ids are **not** rebindable: `settings, new_session, open_file, open_folder, find, find_next, find_previous, back, forward, close, close_window`. **exact**: `x = [ "settings", "new_session", "open_file",`.
- "Reset all" keeps only the `send` override. **exact**: `e.filter(([e]) => e === "send")`.

### Registry: every claude.ai web/shared entry with a binding

`⌘` = cmd on Mac. The non-Mac column is the binding with `platform:"non-mac"`. Ids in the `c561be045` message table that belong only to the Code/desktop product (terminal, diff, browser pane, split view) are left out unless they also run on web chat. **exact**: the `I6` literal, dumped with my own script into `work-interactions/registry.tsv`.

| id | Group | Mac | Windows/Linux | Effect (description string) |
|---|---|---|---|---|
| `command_palette` | other | ⌘K | Ctrl+K | "Command menu" / in chat "Quick chat or search" |
| `search_palette` | other (hidden in palette) | ⇧⌘K | Ctrl+Shift+K | "Search conversations and projects" |
| `quick_chat` | other (hidden) | ⌘⌃K | Ctrl+Alt+K | "Quick chat" |
| `new_conversation` | navigation | ⇧⌘O (web) | Ctrl+Shift+O (web) | New chat / New session |
| `settings` | settings (hidden) | ⇧⌘, | Ctrl+Shift+, (web also Ctrl+Shift+<) | Open settings |
| `incognito` | chat | ⇧⌘I | Ctrl+Shift+I | Incognito chat |
| `new_incognito_chat` | chat (hidden) | ⇧⌘N (desktop only) | Ctrl+Shift+N (desktop) | New incognito chat |
| `file_upload` | chat | ⌘U | Ctrl+U | "Add files or photos" |
| `extended_thinking` | chat (hidden) | ⇧⌘E | Ctrl+Shift+E | "Toggle extended thinking" |
| `model_selector` | chat | ⇧⌘. | Ctrl+Shift+. (also Ctrl+Shift+>) | "Open model menu" |
| `toggle_dictation` | chat (hidden) | ⌘D (desktop) | Ctrl+D (desktop) | "Toggle dictation" |
| `btw_side_chat` | chat (hidden) | ⌘; | Ctrl+; | "Toggle side chat" |
| `cai_rosy_feather_toggle` | chat | ⌘. | Ctrl+. | "Toggle side panel" |
| `toggle_sidebar_and_chat` | chat | ⇧⌘\ | Ctrl+Shift+\ | "Toggle sidebar and chat" |
| `cai_cheeky_fountain_pane_toggle` | chat | ⌥⌘. | Ctrl+Alt+. | "Side pane" |
| `cai_goofy_tome_comment_mode` | chat (hidden) | ⌥C | Alt+C | "Comments" |
| `copy_project_link` | project | ⌥⌘L (desktop also ⌘L) | Ctrl+Alt+L | Copy link |
| `toggle_sidebar` | general | ⌘B (from `FV`: `key:"b"`, `skipInEditable`; the ⌘/Ctrl modifier is **inferred**, since `FV` entries carry no modifier field) | Ctrl+B | "Toggle sidebar" |
| `shortcuts_modal` | general | ⌘/ | Ctrl+/ | "Keyboard shortcuts" |
| `switch_organization` | general (hidden) | ⌃⌘S | Ctrl+Alt+S | "Switch organization" |
| `focus_next_region` | general (hidden) | F6 (web also ⌘F6) | F6 or Ctrl+F6 | "Focus next page area" |
| `focus_previous_region` | general (hidden) | ⇧F6 (web also ⇧⌘F6) | Shift+F6 or Ctrl+Shift+F6 | Focus previous page area |
| `jump_to_navigation`, `jump_to_main_content`, `jump_to_last_message`, `jump_to_question`, `jump_to_input`, `jump_to_side_panel`, `jump_to_artifact`, `jump_to_project_knowledge` | general | (no default binding) | — | Palette-only "Jump to …" commands, with search hints such as "sidebar", "composer", "prompt" |

Composer and dialog-only bindings are shown in the shortcuts dialog with literal chord strings rather than registry bindings. **exact** (`c518a31cc-C5ScAqpT.js` and `cd707be34`):

- send = `enter`, new line = `shift+enter`, queue = `cmd+enter`.
- finish dictation = `enter`, cancel dictation = `esc`.
- stop = `esc`, edit last message = `esc esc`.
- reuse earlier message = `up`/`down`; from an empty box: `up` (last message) and `cmd+up`.
- find = `cmd+f`, plus `find_next` and `find_previous`.
- Code only: next session = `cmd+shift+]`, previous session = `cmd+shift+[`, jump to session = `cmd+1…9`, close = `cmd+w`.

Evidence: `[Z.send_message, ["enter"]]`, `shortcut: "cmd+enter",`.

### Shortcuts dialog search (⌘/)
The search box has two modes. **exact** (`c561be045`, function `re`):
- **Text mode** (`by:"text"`) matches when every word is in the description, or when the words spell a chord. For example "cmd k", "⌘K" or "arrow up" are parsed through the alias tables, and the glyphs `⌘⌥⌃⇧⏎⌫⇥␣↑↓←→` are understood.
- **Press mode** (`by:"press"`) filters by the chord you physically press. It compares the pressed combination, built from `code`, `key` and the layout, with each binding.

Evidence: `if (e.by === "press") {`.

### F6 region cycling
**exact** (`ca1d33d05-aX-mU6pu.js`):
- A capture-phase `keydown` listener handles `F6`. It ignores the event when `altKey` or `isComposing` is set.
- On `repeat` it prevents the default and does nothing.
- Direction comes from `matchShortcut` of `focus_next_region` / `focus_previous_region`.
- The candidate regions are all registered page regions except `conversation` and `lastMessage`. A pseudo-region `"notifications"` is added when a pinned toast exists (`[data-cds="Toast"] [data-pinned]`).
- Focus moves to the next region in the chosen direction.

Evidence: `n.key!=="F6"||n.altKey||n.isComposing`, `var ci = "notifications";`.

Wrap-around at the ends is **inferred** (the helper `ze` was not read).

### Piano Trainer takeaway
Build one `commands.ts` registry (`id → {descKey, group, bindings: [{key, mods, platform}]}`). Store `cmd` and show ⌘ on Mac and Ctrl elsewhere. Ignore `repeat`, skip single-letter chords in text fields, and reject AltGr chords. Add F6 to cycle Library / Score / Player transport / Settings regions.

---

## 2. Menus and submenus

### Library
Menus, popovers, tooltips, dialogs and toasts are built on **Base UI** (MUI's headless library), wrapped by Anthropic's design system ("CDS", `data-cds="…"`).
- **exact**: `vendor-frame-C062bkKI.js` `gr("https://base-ui.com/production-error", "Base UI")`.
- The DOM attributes `data-base-ui-focus-guard`, `data-base-ui-portal`, `data-base-ui-inert` and `data-base-ui-scroll-locked` appear in 32 chunks.
- Radix appears only as a stray `data-radix` string in a few chunks. `cmdk` appears in 5 chunks. Neither drives the main menus.

The CDS menu facade is `Op` in `shared-frame-BQUGvpxX.js`. **exact**: `export var Op = Object.assign(i$, {`. It has these members:
- `Root`, `Bar`, `Trigger`, `TriggerButton`, `Popup`
- `Item`, `Separator`, `Group`, `GroupLabel`, `Header`
- `Submenu`, `SubmenuTrigger`, `SearchablePopup`, `PendingList`

### Base UI defaults that apply (exact, `vendor-frame-C062bkKI.js`)

| Setting | Value | Snippet |
|---|---|---|
| Menu trigger hover-open delay (when `openOnHover`) | 100 ms; close delay 0 ms | `delay: l = 100, closeDelay: u = 0,` |
| Submenu trigger | `openOnHover` **true** by default, delay 100 ms, close delay 0 ms | `openOnHover: c = !0, delay: l = 100,` |
| Keyboard focus loop | `loopFocus: true` (wraps at top and bottom) | `loopFocus: l = !0,` |
| Highlight follows the pointer | `highlightItemOnHover: true` | `highlightItemOnHover: g = !0,` |
| Typeahead | resets after **500 ms** without typing | `resetMs: 500,` |
| Submenu placement | `side: "inline-end"`, `align: "start"`, collision avoidance `{fallbackAxisSide:"end"}` | `((ne ??= "inline-end"), (U ??= "start"), (te = e.collisionAvoidance ?? Io))` |
| Collision padding (default) | 5 px; boundary `clipping-ancestors` | `collisionPadding: d = 5,` |
| Popover trigger hover delay | 300 ms | `delay: u = 300,` |
| Tooltip provider "timeout" (instant hand-over window) | 400 ms | `timeout: r = 400` |
| Context menu | `sideOffset -5`, `alignOffset 2` when no side is given | `((ee = e.alignOffset ?? 2), (V = e.sideOffset ?? -5))` |
| Sibling submenus | opening one submenu closes its open siblings (`"sibling-open"`) | `v.setOpen(!1, Hi("sibling-open"))` |

### CDS layer on top (exact, `shared-frame-BQUGvpxX.js`)
- **Offset.** A top-level menu sits **6 px** from its trigger and a submenu **2 px**. **exact**: `N = o ?? (k ? void 0 : O && l === void 0 ? 2 : 6),`.
- **Popup size.** `min-w-[128px] max-w-[320px] max-h-[var(--available-height)]`, scroll fade 8 px. **exact**: `group/menu-popup relative flex flex-col min-w-[128px] max-w-[320px]`.
- **Menu aim.** When the pointer leaves a submenu trigger heading toward the open submenu:
  - The sibling `menuitem`s get `pointer-events:none`, so a diagonal move does not switch submenus.
  - The hold is released when the pointer "rests": its speed falls under 0.1 px/ms, or it stays still for **40 ms**. A `pointerdown` elsewhere also releases it.
  - It arms only after **3 pointer moves** on the trigger (moves more than 100 ms apart reset the count).
  - **exact**: `(e - h.x) ** 2 + (t - h.y) ** 2 < ((n - h.time) * 0.1) ** 2`, `(g = p.setTimeout(c, 40))`, `x.current >= 3`.
- **Hover-then-click guard.** A trigger press within **500 ms** of a hover-open is ignored, so clicking the row that just opened does not close it again. **exact**: `t.event.timeStamp - l.current.openedAt < 500`.
- **Phone layout.** Menus render as bottom sheets (`MenuSheetPopup`) when a sheet context is present. **exact**: `gl(n.MenuSheetPopup, { ...e, ref: t })`.
- **Close on select.** Base UI menu items close the menu on click unless the CDS `Item` gets `keepOpen`. **exact** prop name: `keepOpen: S,`. Toggles such as Research and Memory in the + menu stay open: **inferred** from the live UI.

### Specific menus

| Menu | Facts |
|---|---|
| **Model picker** (`⇧⌘.`) | **exact** (`shared-36-CE33gQ90.js` `qZ`): the top-level rows are "main" models plus the current deprecated model if selected. When `digitsActive`, the first 9 selectable models get number keys **1–9**: a capture-phase keydown on `[data-cds-model-selector-digits]` clicks `[data-number-key="N"]`, ignored with ⌘/Ctrl/⌥ or repeat (`/^(?:Digit|Numpad)([1-9])$/`). "More models" is a submenu whose group label is "More models". Typing filters the list, with the empty state "No matches" (`cV("searchModels", "Search models")`). Effort is an `Op.SubmenuTrigger` with `data-testid="effort-menu-trigger"` and a header: "Higher effort means more thorough responses, but takes longer and uses your limits faster." (`shared-33-CItXY69I.js`). Options: Low / Medium / High / Extra / Max, with a warning icon `data-testid="effort-menu-trigger-warning"` when the current choice warns (`QS(f)`). |
| **Sidebar "More" row menu** | Opens on hover: **delay 120 ms, closeDelay 180 ms**. **exact** (`shared-21-ko7h9tVJ.js`): `openOnHover:!0,delay:120,closeDelay:180`. |
| **Hover cards and secondary hover menus** | Several use `delay:200, closeDelay:150` (`c12bca653`, `c5f70b858`) or `delay:300` (`shared-9`, `c1c1ec7b9`, `c29d48294`). **exact** snippet: `openOnHover:!0,delay:200,closeDelay:150`. |
| **Sidebar row hover card** | `side:"right"`, `delay:500`, `closeDelay:200`, `handover:"glide"`, and inside it `--cds-dur-snap` is overridden to `--cds-dur-fast` (60 ms). **exact** (`shared-59-DsEB6dbB.js`): `dS={delay:500,closeDelay:200,handover:"glide"}`. |
| **Account menu → "Language" row** | On hover or focus it cycles native names of other languages next to the label: the first swap at **800 ms**, then every **1100 ms**, **4** swaps, cross-fading with `opacity var(--cds-dur-slow) var(--cds-ease-out)`. **exact** (`shared-19-CEl4Es6d.js`): `f.current=setTimeout(i,1100)};f.current=setTimeout(i,800)`. |
| **Composer + menu** | Built with `Op.SubmenuTrigger`. The Connectors submenu has `openOnHover:!1` (opens on click only) in the side-chat variant. **exact** (`shared-21`): `Op.SubmenuTrigger,{icon:"Connectors",openOnHover:!1`. Item list: see `UI_FLOWS_AND_MENUS.md` §2. |

### Piano Trainer takeaway
Use Base UI (`@base-ui-components/react`) Menu with these values: submenu hover 100 ms, `loopFocus`, typeahead 500 ms, `sideOffset` 6 for menus and 2 for submenus, collision padding 5 px, and width 128–320 px. Add the 500 ms hover-then-click guard. Apply it to the Songs row "⋯" menu, the score editor's Insert ▸ Notes/Rests submenus and a Player "Speed ▸" submenu; digits 1–9 can pick speed presets.

---

## 3. Dialogs and popovers

### What it does
Dialogs are Base UI `Dialog` wrapped as CDS `Dialog` (`data-cds="Dialog"`). Modal dialogs trap focus with Base UI focus guards (`data-base-ui-focus-guard`), make the rest of the page inert (`data-base-ui-inert`), close on Esc, and close on a backdrop press unless they are marked `dismissible:false`.

### How (exact, `shared-frame-BQUGvpxX.js` and `vendor-frame`)
- **Backdrop dismissal.** `dismissible:false` maps to Base UI `disablePointerDismissal:true`. By default the dialog can be dismissed by a pointer press. **exact**: `c = n ?? (r === !1 || void 0),`.
- **Scroll lock.** While open, the scroll container gets `overflow:hidden`. Its width is set to `calc(100vw - scrollbar)` so the layout does not jump, `data-base-ui-scroll-locked` is set, and scroll position and `scroll-behavior` are restored on close. **exact**: `n.setAttribute("data-base-ui-scroll-locked", ""),`.
- **Dialog popup enter/exit.** Opacity 0→1 and scale 0.98→1 over `duration-base` (200 ms) with `ease-out` (= `--cds-ease-out`). Exit is the reverse. With reduced motion the transition is none and scale stays 1. **exact**: `transition-[opacity,scale,filter] duration-base ease-out motion-reduce:transition-none data-[starting-style]:opacity-0 data-[starting-style]:scale-[0.98]`.
- **Backdrop.** `fixed inset-0 bg-backdrop`, fading over `duration-base ease-out`. A nested dialog makes the outer backdrop transparent and darkens the parent dialog through an `::after` overlay instead. **exact**: `has-[~[data-nested]]:bg-transparent`, `data-[nested-dialog-open]:after:opacity-100`.
- **Sheets (phone).** Backdrop transition `duration-sheet ease-out` (300 ms). **exact**: `var gM = "duration-sheet ease-out motion-reduce:transition-none";`. A sheet covered by a second sheet scales to 0.94 and shifts up 0.75 rem (`-translate-y-3`). **exact**: `data-[cds-sheet-covered]:scale-[0.94]`. A bottom sheet slides from `translate-y-[calc(100%+1.5rem)]`.
- **Popover / InfoTip popup.** Opacity plus scale **0.97**, `duration-base ease-out`, maximum width `clamp(280px, 17.5rem, 45vw)`. **exact**: `data-[starting-style]:scale-[0.97]`.
- **Tooltip.** Opacity plus scale 0.98, **`duration-snap ease-snap`** (120 ms, `cubic-bezier(.32,.72,0,1)`), and `data-[instant]:duration-0` when hand-over is instant. Maximum width 240 px. **exact**: `transition-[opacity,scale] duration-snap ease-snap motion-reduce:transition-none`.
- **Collapsible / disclosure.** The height animates to `--cds-disclosure-panel-height` over `duration-base ease-out`. **exact**: `h-[var(--cds-disclosure-panel-height)] transition-[height] duration-base ease-out`.

### Specific dialogs

| Dialog | Facts |
|---|---|
| **Settings** | Opened by the URL hash. Any hash equal to or starting with `#settings/` or `#customize/` is treated as a settings route. **exact** (`shared-l-p-m-w-0-DeNDzI6I.js`): `e==="#settings"||e.startsWith("#settings/")`. Left nav 200 px wide with a "Search settings" field. **exact** (`c71860c77-CN_oc90o.js`): `nav",{className:"flex w-[200px] shrink-0`. (The live recording measured 212 px including the border and padding.) |
| **Language** | `size:"lg"`, header with a close button, title "Choose your language". **exact** (`shared-19`): `gl(wM,{open:t,onClose:n,size:"lg",header:r,title:i`. |
| **Keyboard shortcuts** | See §1 (search with text or press mode). |
| **⌘K palette** | See §4. |
| **Share popover** | Not traced in code; see `UI_FLOWS_AND_MENUS.md` §10. **inferred**: it is a CDS `Popover`, so it uses the popover motion above. |

The menu popup's own transition class is **not in captured code**: it is set through `data-cds-overlay="menu"` CSS. By analogy with the tooltip it is **inferred** to be an opacity plus scale `snap` transition.

### Piano Trainer takeaway
Every modal (Settings, Song import, Export) should use opacity plus scale 0.98 at 200 ms `cubic-bezier(.165,.84,.44,1)`, with Esc to close, a backdrop click unless the dialog has unsaved edits (`dismissible:false`), scroll lock that compensates the scrollbar, and a hash route (`#settings/audio`) so dialogs survive reloads and links.

---

## 4. ⌘K search palette

All facts below come from `c2771e1f6-CjVOEJga.js` (formatted to `work-interactions/palette.js`).

### What it does
One input does three jobs: **search**, **compose** (type a message and send it as a new chat), and **actions** (commands from the registry, §1). The placeholder changes by mode. **exact**:
- search: "Search or start a chat" or, in the Code product, "Search or start a session"
- compose: "Write a message…"
- otherwise: "Search"

### How

**Debounce.** Server-backed searches debounce the query by **500 ms**. A local match waits **250 ms** and only runs for queries of **3 or more characters**. **exact**: `[h] = On(t, 500),`, `let n = !t && e.length >= 3, [r] = On(n ? e : null, 250);`. Session search runs only with **2 or more characters** (`d.length >= 2`).

**"Searching deeper…".** A spinner appears with a **150 ms** delay. Staged "deeper" steps fire at **300, 450 and 3000 ms**. **exact**: `delay: 150,`, `var og = [300, 450, 3e3];`.

**Data sources** (query keys and endpoints seen):
- stored chats via `searchStoredChats({limit: 25, snippetSize: 100})`
- conversation lists with `limit: 30, orderBy: "latest_chat"`
- projects with `limit: 50`
- `/v1/code/sessions?statuses=archived&limit=200`, retried after 300 and 900 ms on 5xx (`var tp = [300, 900];`), with a 10 s abort timeout
- artifacts, scheduled tasks, skills, connectors and plugins (lazy chunk `c0410e058`), and settings sections (rendered as "Settings → {group} → {section}")

**Ranking.** Fuzzy matching with weighted fields. **exact** weight tables:

| Item kind | Field weights |
|---|---|
| Commands | description 0.7, hints 0.3 |
| Chats | title 0.7, descriptions 0.3 |
| Code sessions | title 0.4, repo 0.25, branch 0.2, PR number 0.15, summary 0.1 |
| Projects (Code spaces) | name 0.6, description 0.2, folder paths 0.2 |
| Sessions | title 0.5, initial message 0.3, summary 0.3, folder paths 0.2 |

Example snippet: `{ name: "repoNameLower", weight: 0.25 },`.

**Status sort.** Session status orders as awaiting 0, error 1, unread 2, running 3, draft 4. **exact**: `var Lh = { awaiting: 0, error: 1, unread: 2, running: 3, draft: 4 },`.

**Caps.**
- Local cowork/space recents: the top **20** by `lastMessageAt` (`.slice(0, 20)`).
- Per-kind lists are capped at 50 or 100.
- One group is capped at **3** results (`.slice(0, 3)`).

Which cap is the "Recents" section on the empty palette is **inferred** (20 is the most likely). The live palette showed about 8 rows.

**Filter chips.** The chip set is All / Artifacts / Sessions / Code / Projects / Scheduled (see the live doc §5). In code:
- The type filter is `X.type`.
- ← and → cycle the type filter when the caret is at an edge (`Qs([null, ...types], current, dir)`).
- Backspace or Delete in an empty input clears the type filter, then leaves compose and actions modes.

**exact**: `(e.key === "ArrowLeft" || e.key === "ArrowRight") &&`, `Ac({ ...X, type: null }) || Ue(!0)`.

**Key handling** (input `onKeyDown`, **exact**):

| Key | Effect |
|---|---|
| ↑ / ↓ | Move the highlighted row (list keyboard handler, `case "ArrowDown"`) |
| ↵ | Open the highlighted row. While composing it sends; IME composition (`isComposing` / keyCode 229) is respected. |
| ⌥↵ (alt+Enter; the helper `Js`) | Open the row's actions (secondary actions). Holding repeats is suppressed (`Ic` flag). |
| Tab | Toggle compose mode (`xn(!J, "keyboard")`). When compose is unavailable it switches to **actions** mode (`se("actions")`). Not intercepted with ⌥, ⌘ or Ctrl. |
| ⌘1 / ⌘2 / ⌘3 (in compose) | Send as message / New task / New Code session. **exact**: `if (e.key === "1" && o?.sendMessage) {` |
| Backspace on empty | Leave compose, then leave actions mode |
| Esc | Close |
| `/` | Focus the filter. The footer hint is in the live doc; the handler sits in an i18n-id-only branch, so it is **inferred**. |

The footer hint copy comes from public-catalog message ids such as `footerArrows`, `boxKeys` (with `{alt}` filled in as the platform's spoken Alt name) and `hintLabel`. It has no English `defaultMessage` in code. **exact**: `dl(N, "boxKeys", { alt: id })`.

### Piano Trainer takeaway
Use a ⌘K "Find & do" palette over Songs (title 0.7, composer 0.3), Lessons, and commands such as "Start metronome" or "Transpose +1". Debounce 250 ms locally and 500 ms for any server search; use Tab for "actions", ←/→ for the type chips (Songs · Lessons · Exercises · Settings) and ⌥↵ for row actions.

---

## 5. Toasts ("Popups")

### What it does
Toasts stack in the bottom-right corner (bottom-left in RTL). By default they auto-dismiss after a minimum of 6 s. The Accessibility setting "Popups" (On-screen / Auto-dismiss) can make them sticky until the user closes them.

### How (exact)
- **Setting storage.** The localStorage key is `persisted.snazzy-globe`, a boolean that defaults to `true` (auto-dismiss). **exact** (`shared-l-p-m-w-5-7sFZKaAU.js`): `Ho("persisted.snazzy-globe", !0)`. The control writes `"auto-dismiss"` or `"on-screen"`. **exact** (`ca3a83b94-xZ2KnnZD.js`): `value: n ? "auto-dismiss" : "on-screen",`. Copy: "Keep popups on screen until you close them. Otherwise, they're automatically dismissed after a few seconds." The setting is behind gate `__gb__1069680821`; when the gate is off, auto-dismiss always applies.
- **Temporary override.** The hook also exposes a "dismiss for now" timestamp that re-enables auto-dismiss for **30 s**. **exact**: `setTimeout(() => a(0), 3e4)`.
- **Root provider.** `sticky = !autoDismissEffective`, `timeout: 6500`, `autoDismiss: !sticky`. **exact** (`shared-l-p-m-w-14-Bs7C5aQZ.js`): `ix=6500`, `jL,{timeout:ix,autoDismiss:u`.
- **Toast provider defaults.** `timeout ?? 6e3`, `autoDismiss ?? true`. **exact**: `p = n ?? f?.defaultTimeout ?? 6e3,`.
- **Minimum duration.** Any timeout shorter than 6000 ms is raised to 6000. `Infinity` becomes 0 (sticky). **exact**: `e < 6e3 ? 6e3 : e`.
- **Sticky rules.** A toast **with an action button** is always sticky (timeout 0). With auto-dismiss off, every toast gets timeout 0 and is flagged `heldOpen`. **exact**: `D = T ? 0 : P8(l), O = S ? 0 : D,`.
- **Pausing.** The timer pauses while the toast is hovered or holds focus, while the window is unfocused or the document hidden, or while the toast is behind another (`[data-behind]`). **exact** (`c860a621f`, undo toast): `t.matches(":hover")||t.contains(r.document.activeElement)`.
- **Dedupe.** A toast with the same `dedupeKey` updates the existing one: the count rises and the title gains "(×2)". **exact**: `` `${C} (×2)` ``.
- **Priority.** `variant "danger"` makes the toast `priority:"high"` (announced assertively, **inferred**). **exact**: `priority: m === "danger" ? "high" : "low",`.
- **User dismissal.** A close within **1000 ms** of a user press counts as user-dismissed (`VL = 1e3`).
- **Remaining time.** Remaining time is `max(expiresAt - now, 6000)` when a toast moves between stacks. **exact**: `Math.max((e?.expiresAt ?? t) - t, 6e3)`.
- **Undo-style toast.** The session undo notice uses a **6000 ms** window when auto-dismiss is on, and no window otherwise. **exact** (`c39a247c4`): `Z.setWindowMs(f?6e3:null)`.

### Positions (exact)
- **Web.** Bottom-right at `right: max(--launch-drawer-width, --toast-home-inset) + 1rem` and `bottom: max(--dev-dashboard-height + --session-expiry-banner-height, --toast-clearance) + 1rem`. Mirrored in RTL.
- **Mobile webview.** The safe-area insets are added.
- **Code product.** Toasts sit top-right at `top: var(--toast-top-offset, 68px); end: 1rem`. The frame sets `--toast-top-offset` to **92px** with window-controls-overlay (desktop title bar) and **56px** otherwise. **exact** (`shared-22-BgeCig4R.js`): `e.style.setProperty("--toast-top-offset",n?"92px":"56px")`.
- **Toast slide.** A toast slides in from `translate-y-[calc(100%+1.5rem)]` (**exact** class in `shared-frame`). Its duration is in CSS: **not in captured code**.

### Piano Trainer takeaway
Use 6000 ms minimum auto-hide (6500 ms default). Make action toasts sticky ("Recording saved · Undo"). Pause on hover, focus or window blur. Dedupe with "(×2)". Add a Settings → Accessibility "Popups: On-screen / Auto-dismiss" switch stored as a boolean.

---

## 6. Sidebar

### State and persistence (exact, `shared-l-p-m-w-3-BmU3nrSV.js`)
- **Store.** A Zustand persisted store named **`dframe-store`**, version 1, in **localStorage** (`j0 = pK(() => pU("localStorage"))`). A backup key is `dframe-store.backup.v1`. **exact**: `name: "dframe-store",`.
- **Width limits.** `Ie = { MIN: 200, MAX: 420, DEFAULT: 288 }`. Every stored width is clamped with `Math.min(MAX, Math.max(MIN, w))`. **exact**: `Ie = { MIN: 200, MAX: 420, DEFAULT: 288 };`.
- **Defaults.** `{ collapsed: false, sidebarWidth: 288 }`.
- **Floor.** `sidebarFloor` is a transient field starting at MIN (200). It feeds the effective width `max(sidebarWidth, sidebarFloor)`. **exact**: `Math.max(e.sidebarWidth, e.sidebarFloor)`.
- **Persisted fields.** `collapsed`, `sidebarWidth`, `lastKnownMode`, `pinnedOrder`, `groupByByMode`, `sortByByMode`, `recentsTypeFilter`, `recentsStatusFilter`, `coworkActivityDays`, `recentsOwnerPick`, `interfaceFont`, `collapsedGroups`, `openedGroups`, `customGroupsByScope`, `navPinnedIds`, and more.
- **Recents grouping.** `groupByByMode` per mode, one of `date | project | coder | state | custom | unread | type | folder | none`.
- **Recents sort.** `recency | alpha | created`.
- **Type filter.** `all | chat | task | code`.
- **Status filter.** `active | archived | all` (default `active`).
- **Activity window** (days): `[0, 1, 3, 7, 30]`.

**exact**: `(r === "recency" || r === "alpha" || r === "created")`, `export var w7 = [0, 1, 3, 7, 30];`.

### Collapse, narrow and phone
- `⌘B`/`Ctrl+B` toggles `collapsed`; it is skipped in editable fields (§1).
- **Narrow viewport** = `(max-width: max(700, ceil(sidebarWidth) + 330 − 1) px)`. In a narrow viewport the sidebar becomes an overlay (`composedSidebarOpen`) instead of a column. **exact**: `return Math.max(700, Math.ceil(e) + 330 - 1);`, `` `(max-width: ${B_(e)}px)` ``.
- **Phone** = `(max-width: 700px)` (`si`); the sidebar is a sheet (`isPhoneSheet`).

### Rail mode / hover peek (exact, `shared-20-CM_y5i88.js`, `shared-21-ko7h9tVJ.js`)
When the sidebar is collapsed, moving the mouse to the screen edge "peeks" it. Thresholds: `{ hintPx: 48, openPx: 16, dwellMs: 100 }`:
- Within 48 px of the edge it shows a hint.
- Within 16 px it opens.
- The pointer must dwell for 100 ms.

**exact**: `wi={hintPx:48,openPx:16,dwellMs:100}`.

The peek closes **180 ms** after the pointer leaves. It is kept open while the overflow menu is open, while focus is inside `#frame-peek-popover`, or while the popover is hovered (rechecked every 180 ms). **exact**: `tD = window.setTimeout($0, 180)`. A touch or pen press outside closes it at once (`"outside_press"`).

### Resize handle (exact, `shared-21`)
- `aria-label` "Resize sidebar", tooltip "Drag to resize", `aria-valuemin` = floor and `aria-valuemax` = 420.
- **Keys.** **Home** jumps to the minimum width; **End** jumps to the maximum allowed for the window (`FL(innerWidth)`).
- **Drag.** Width follows `startW + dx` and is clamped. Dragging below the hide threshold collapses the sidebar (`setCollapsedPref(true)`).
- **Cancel and commit.** **Esc** during a drag cancels and restores. Window blur commits. If the mouse button is released outside the window, the drag ends after **200 ms**.

**exact**: `e.key === "Home" ? n : e.key === "End"`, `}, 200)`.

### Piano Trainer takeaway
Library sidebar: default 288 px, clamp 200–420, stored in a persisted store (`pt-frame`, version 1). Peek at 16 px from the edge with 100 ms dwell and a 180 ms close. Home/End and Esc-to-cancel on the resize handle. Persist the Songs list `groupBy` (date / composer / level / none) and `sortBy` (recent / A–Z / created).

---

## 7. Usage-limit banner above the composer

All facts below come from `shared-4-Dpd_bBGW.js` and `shared-3-BdK7SYJ7.js`.

### What it does
The banner appears when the server's message-limit object has `type === "approaching_limit"` (or a rate-limit window reports a surpassed threshold). The server decides the threshold. The client only formats it and remembers dismissals per window.

### Copy variants (exact `defaultMessage`s)

| Window | Copy |
|---|---|
| Per-model | "You've used {pct} of your {model} limit · Resets {day} at {time}" |
| `5h` | "Over {pct} of your 5-hour limit used · Resets at {time}"; "Over {pct} of your 5-hour limit used"; "You've used {pct} of your 5-hour limit · Resets at {time}"; "You've used {pct} of your 5-hour limit"; fallback "Approaching 5-hour limit". The Pro upsell appends "{notice} · Get more usage with Claude Pro." |
| `7d` | "You've used {surpassedThresholdFormatted} of your weekly limit"; when the percentage is 0, "Approaching weekly limit" |
| Usage-based seats | "You've used {surpassedThresholdFormatted} of <link>your usage</link>" |
| Reached | "You've reached your weekly limit. It resets {day} at {time}."; "You've reached your {model} limit. Get more usage to keep using {model} or switch models to continue." |
| Credits out | "You're out of usage credits. Get more usage to keep going now, or wait until {time} when your plan usage resets." (and day/time and model variants) |

The percentage is `min(1, utilisation)` formatted as a percent. "Over" is used when the fraction is strictly between 0 and 1 but the reported value is approximate. **exact**: `h = yF(Math.min(1, r || (n ?? 0)) * 100) / 100,`.

### Dismiss persistence (exact)
- **On dismiss.** The state is set to `{[windowName]: { validUntil: resetsAt, threshold: surpassedThreshold }}`. **exact**: `[_ ?? ""]: { validUntil: u, threshold: h ?? 0 },`.
- **Hidden while** a record exists **and** the current threshold is at most the dismissed threshold **and** the window's reset time is at most `validUntil`. **exact** (`shared-3`): `return e!==void 0&&t<=e.threshold&&n<=e.validUntil`.
- **Effect.** Dismissing at 65 % hides the banner until the next threshold step (for example 75 %) or the next reset, whichever comes first.
- **Storage.** The state lives in an atom (`VC`). Its storage key was not found: **inferred** to be per-org local storage.
- **Analytics.** Dismissing sends the event `lW("approaching", window, "alert_band", arm)`.

### Piano Trainer takeaway
Show the same threshold-dismiss rule for a "Daily practice goal" band above the Practice composer: "You've practised {pct} of today's goal". Store `{validUntil, threshold}` per goal window so dismissing at 50 % re-shows at 75 % or tomorrow.

---

## 8. Composer

**exact** facts:
- **Placeholders.** `c$()` returns `["How can I help you today?", "Type / for skills"]`. The second string is the focused, empty, home variant (**exact**, `shared-9-BHEAa9ig.js`). In a chat the live UI shows "Reply" (German "Antworten").
- **Send / newline / queue.** ↵ sends and ⇧↵ adds a newline. ⌘↵ = "Queue for later (while Claude is working)"; it is hidden when incognito or when there is no active conversation (`tt()` in `c518a31cc`). Esc stops the response; Esc Esc edits the last message. ↑ in an empty box goes to the last message; ⌘↑ reuses an earlier message.
- **The `send` override.** It is the only custom shortcut kept on "reset all" (§1), so users can swap ↵ and ⌘↵.
- **"/" for skills.** "/" opens the skills list (copy above). The trigger code itself was not traced: **inferred** from the placeholder.
- **Dictation.** ⌘D toggles dictation on desktop. While dictating, ↵ finishes and Esc cancels.
- **Attachments motion.** Adding or removing attachments uses a View Transition `{types: ["cds-attachments"]}` when there is more than one attachment and the tab is visible. It locks each clipped row's `min-block-size` during the transition. **exact** (`shared-1`): `e.startViewTransition({ types: ["cds-attachments"], update: t })`.
- **IME.** Enter during IME composition is never treated as send (`isComposing || keyCode === 229`), both in the palette composer and in the main composer (**inferred** for the main one).

### Piano Trainer takeaway
For the score editor text and lyric fields: ↵ commits, ⇧↵ adds a newline, Esc cancels, and composition is respected (Russian input). A "/" in the practice-notes box can list commands ("/metronome 80").

---

## 9. Motion system

### Tokens (exact values from the JS token table `c25d7186f-CgCcBKEC.js`)

| Token | Value | Tailwind class (from `c0f94f226-BWbmOsOB.js` config) |
|---|---|---|
| `--cds-dur-fast` | **60ms** | `duration-fast` |
| `--cds-dur-snap` | **120ms** | `duration-snap` |
| `--cds-dur-base` | **200ms** | `duration-base` |
| `--cds-dur-sheet` | **300ms** | `duration-sheet` |
| `--cds-dur-slow` | **450ms** | `duration-slow` |
| `--cds-ease-out` | `cubic-bezier(0.165, 0.84, 0.44, 1)` | `ease-out` (remapped) |
| `--cds-ease-snap` | `cubic-bezier(0.32, 0.72, 0, 1)` | `ease-snap` |
| `--cds-ease-overshoot` | `cubic-bezier(0.34, 1.3, 0.64, 1)` | `ease-overshoot` |
| `--cds-btn-spring` | `linear(0, 0.2459, 0.6526, 0.9468, 1.0764, 1.0915, 1.0585, 1.0219, 0.9993, 0.9914, 0.9921, 0.9957, 0.9988, 1.0004, 1)` | button press spring |

Evidence: `snap:{cssVar:"var(--cds-dur-snap)",value:"120ms"`. Tailwind's `ease-out` maps to the CDS curve. **exact**: `"transitionTimingFunction":{"out":"var(--cds-ease-out)"`.

### Where each token is used (exact class strings)

| Token | Uses |
|---|---|
| fast 60 ms | Button hover background and focus ring (`transition-[background-color,box-shadow] duration-fast ease-out`); inputs (`transition duration-fast`); checkbox colour; icon rotation (`transition-transform duration-fast`); a code-change marker scale (`scale var(--cds-dur-fast) var(--cds-ease-out)`); the hover-card override of snap |
| snap 120 ms | Tooltips (`duration-snap ease-snap`); the checkbox tick clip-path (base when checked); **switch knob** (`transition-transform duration-snap ease-overshoot`); the message actions reveal-in (120 ms, from the live doc) |
| base 200 ms | Dialog popup and backdrop; popovers; disclosure height; tab and segment indicators; `cds-reveal-in` keyframes; nested-dialog overlay |
| sheet 300 ms | Phone sheet backdrop; covered-sheet scale 0.94; drag-to-dismiss fade (`opacity var(--cds-dur-sheet) var(--cds-ease-snap)`); JS-driven animations that read `--cds-dur-sheet` with `getComputedStyle` |
| slow 450 ms | Language-name cross-fade (§2); onboarding "coach" reveals (`coachDockEnter var(--cds-dur-slow) var(--cds-ease-out)`) |
| overshoot | Switch knob; check-in dot pop (`lucky-meadow-dot-in var(--cds-dur-base) var(--cds-ease-overshoot) calc(var(--cds-dur-snap) / 2)`) |
| ease-snap | Tooltips; sheet fade; sliding indicators (read in JS: `getPropertyValue("--cds-ease-snap")`) |

Also hard-coded: `cds-morph-in 0.18s cubic-bezier(.2,0,0,1)`, `cds-placeholder-reveal 150ms ease-out`, skeleton `cds-shimmer 2s linear infinite`, spinner `spin 1s linear infinite`, and a framer-motion `{duration: .15, ease: "easeOut"}` row height animation (`shared-59`).

### Reduced motion (exact)
- **Setting.** "Motion": `System` / `Reduced`, stored under the key **`appearance:reduceMotion`** (default `"system"`). **exact**: `var _f = "appearance:reduceMotion";`.
- **Effective value.** `shouldReduceMotion = mode === "reduce" || matchMedia("(prefers-reduced-motion: reduce)")`. **exact**: `vd("(prefers-reduced-motion: reduce)", e),`.
- **Applied as.** `<html data-reduce-motion="true">`. Components use Tailwind `motion-reduce:` / `motion-safe:` variants, and CSS can guard with `:root:not([data-reduce-motion=true])`. **exact**: `e ? (t.dataset.reduceMotion = "true") : delete t.dataset.reduceMotion`.
- **Pattern.** Every transition class above carries `motion-reduce:transition-none`. Dialogs keep the fade but drop the scale (`motion-reduce:data-[starting-style]:scale-100`). Shimmer text falls back to a solid colour (`motion-reduce:animate-none motion-reduce:bg-none`).

### Streaming / "working" indicators (exact, `shared-frame` and `c7c7e4c7b-DxWsR2RW.js`)
- **Indicator kinds.** `xR = { spinner: "spin", pulse: "pulse", dots: "cds-dot-pulse", shimmerText: "cds-shimmer-text-" }`. There are also `dframe-dot-pulse`, `dframe-dot-blink`, `dframe-dot-rest` and `dframe-clay-breathe` (the clay asterisk "breathing" while Claude works). **exact**: `dots: "cds-dot-pulse",`.
- **Shimmer text** ("Thinking…" labels): a 400 % wide gradient band moving with `cds-shimmer-text-shine 3s linear infinite` at an angle of 120deg (240deg in RTL). Ink and peak colours are set per tone. A `--cds-shimmer-text-delay` (ms) staggers several labels.
- **Animation clock** (`c7c7e4c7b`), when gate `__gb__2974676965` is not set:
  - Every infinite loader animation whose duration is a whole multiple of **33.33 ms** is switched to `steps(n)`, so loaders tick at 30 fps. Its `startTime` is aligned to `performance.timeOrigin`, so all spinners and dots on the page beat in phase. **exact**: `d = Number(o) / 33.333333333333336,`.
  - Stepped dot and shimmer loops are merged into an **18 s** keyframe span (`S = 18e3`).
  - Resting dots (`dframe-dot-rest`) are snapped to a **600 ms** grid (`Math.floor((t + 20) / 600)`).
- **Motion rest.** With `<html data-motion-rest>`, each infinite animation is paused (`playbackRate = 0`) after **20 s** of running (`T = 2e4`). It is then nudged forward by 1/8 of its duration on a 600 ms beat. Voice and waveform animations are excluded (`/waveform|voice/i`).
- **Caret rest.** A focused text caret gets `data-caret-rest` after **30 s** without focus, keydown, pointer or selection activity, which stops the blinking. Any activity clears it after a **500 ms** check. **exact**: `e.setTimeout(o, 3e4)`.
- **Not in captured code:** the `cds-dot-pulse` keyframes and their per-dot delay (CSS).

### Piano Trainer takeaway
Copy the five durations and three curves as CSS variables (one `motion.css`), plus the `data-reduce-motion` attribute driven by "System / Reduced". Use `overshoot` for toggles (metronome on/off), `snap` for tooltips over keys, `base` for dialogs, and `sheet` for the mobile mixer sheet. For "listening…" while the mic is analysing, use a 3-dot pulse stepped at 30 fps and phase-aligned. Pause it after 20 s of no input to save battery on a tablet at the piano.

---

## 10. Piano Trainer interaction blueprint

| Piano Trainer place | Adopt | Exact value from claude.ai |
|---|---|---|
| Global (all screens) | Command registry with Mac/non-Mac bindings and a `customShortcuts` override map | §1 shapes; `cmd`→`ctrl` off Mac; ignore `repeat`; AltGr guard |
| Global | ⌘K / Ctrl+K "Find & do" palette | debounce 250 ms local (≥3 chars) and 500 ms remote; Tab = actions, ←/→ = type chips, ⌥↵ = row actions |
| Global | ⌘/ shortcuts dialog with press-to-search | text mode plus press mode (§1) |
| Global | ⌘B sidebar toggle (not in text fields); F6 / ⇧F6 cycle Library → Score → Transport → Toasts | `skipInEditable`, `"notifications"` region |
| Global | ⇧⌘, Settings, opened by hash `#settings/<page>` | `#settings/` prefix rule |
| Songs (Library sidebar) | Width 288 px, clamp 200–420, persisted; peek at 16 px with 100 ms dwell and 180 ms close; Home/End/Esc on the resize handle | `Ie = {MIN:200, MAX:420, DEFAULT:288}`, `{openPx:16, dwellMs:100}`, 180 ms |
| Songs | Group by date / composer / level / none; sort recent / A–Z / created; filter active / archived / all | `groupByByMode`, `sortByByMode`, `recentsStatusFilter` |
| Songs row "⋯" menu | Base UI Menu: offset 6, submenu offset 2, hover 100 ms, typeahead 500 ms, loop focus, menu aim (40 ms rest), 500 ms click guard | §2 |
| Player | ⇧⌘. opens a "Speed" menu; digits 1–9 pick presets while it is open | model-picker digits pattern |
| Player | Space play/pause, ⌘↵ "queue next song" (mirrors queue-for-later) | composer bindings |
| Score editor | Context menu at `sideOffset −5`, `alignOffset 2`; Insert ▸ submenus open on hover after 100 ms | Base UI context-menu defaults |
| Practice tools | Daily-goal band with threshold-and-reset dismissal | `t <= threshold && resetsAt <= validUntil` |
| Practice tools | "Listening" dots at 30 fps steps, phase-aligned, resting after 20 s | §9 animation clock |
| Learn (lesson dialogs) | Dialog: opacity plus scale 0.98, 200 ms, `cubic-bezier(.165,.84,.44,1)`; Esc closes; backdrop closes unless `dismissible:false`; scroll lock | §3 |
| Learn (hints) | Tooltip: snap 120 ms `cubic-bezier(.32,.72,0,1)`, scale 0.98, max width 240 px; hover cards: delay 500 ms, close 200 ms | §2, §3 |
| Toasts (save, export, MIDI connected) | Bottom-right, +1rem inset; minimum 6000 ms (default 6500); sticky when they have an action; pause on hover/focus/blur; "(×2)" dedupe; danger = assertive | §5 |
| Settings → Accessibility | "Popups: On-screen / Auto-dismiss" (boolean, default auto); "Motion: System / Reduced" → `data-reduce-motion` | `persisted.snazzy-globe`, `appearance:reduceMotion` |
| Settings → Language (EN/RU) | Language row cycles the native names: 800 ms, then every 1100 ms, ×4, fading over 450 ms | §2 |
| All motion | `--dur-fast 60ms`, `--dur-snap 120ms`, `--dur-base 200ms`, `--dur-sheet 300ms`, `--dur-slow 450ms`; `--ease-out (.165,.84,.44,1)`, `--ease-snap (.32,.72,0,1)`, `--ease-overshoot (.34,1.3,.64,1)`; every transition gets `motion-reduce:transition-none` | §9 |

## Could not determine
- **CSS keyframes and popup transitions.** Keyframes (`cds-dot-pulse` timing, `cds-reveal-in`), the menu popup transition and the toast slide duration live in CSS files that were not captured.
- **Banner dismissal key.** The storage key of the usage-banner dismissal atom (`VC`).
- **Recents count.** The exact Recents count on the empty ⌘K palette (candidate caps 20, 50, 100).
- **"/" handlers.** The handler bodies for "/" in the palette and in the composer, which sit in i18n-id-only branches.
