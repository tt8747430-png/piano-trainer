# Flat 26.11.0 — UI shell and motion reference

Source: the extracted ASAR, `out/renderer/assets/*` (minified Vite chunks). Chunk names below leave out the hash (e.g. `ScoreEditorDesktop.js` is `ScoreEditorDesktop-DJ1kC6ku.js`). CSS-module class hashes such as `_fwux8_` are quoted only so you can find the rule again.
Confidence tags: **[exact]** means the value was read directly from code or CSS. **[inferred]** means it is my interpretation of minified logic.

> Important context: in the Electron desktop app, `window.flatSettings.isDesktopApp` forces `displayMobileEditor = false` and `isTablet = false` (scoreViewer.js) [exact]. The desktop app therefore always renders **ScoreEditorDesktop**. MobileSidebar, the tablet bottom sheet and `useToolBottomSheet` only run in the web build on phones and tablets. They are documented here because they are good patterns.

---

## 1. Editor sidebar / panel system

### 1.1 Two desktop sidebar implementations, selected at runtime
| Implementation | When | Source |
|---|---|---|
| **Panel system** (`EditorPanelSidebar` = `SidebarRail` + `SidebarPanelHost`) | `(isEdu \|\| isEditorRailFileMenuEnabled()) && isEditorNewToolbarEnabled() && !displayMobileEditor` | ScoreEditorDesktop.js (`TP()`) [exact] |
| **Tabbed sidebar** (`EditorSidebar`, with SlidingTabs header: Notation / Instruments / Layout) | otherwise, when the new toolbar is on | ScoreEditorDesktop.js [exact] |
| Legacy editor | new toolbar disabled | ScoreEditorDesktopLegacy.js [inferred] |

Both are mounted in the left column of a 3-column CSS grid (`ScoreEditorDesktop.css`, `_mainContent_w15kb_`) [exact]:
`grid-template-columns: var(--left-sidebar-width) var(--content-width) var(--right-sidebar-width)`.

| Grid state | Value |
|---|---|
| `--left-sidebar-width` tabbed sidebar open | `352px` |
| `--left-sidebar-width` panel system | `64px` collapsed / `416px` expanded (`PP="64px"`, `LP="416px"`, set inline) |
| `--right-sidebar-width` help panel open | `352px` (`DP=352`) |
| `--right-sidebar-width` learner tutorial open | `304px` |
| Grid transition (legacy/tabbed) | `grid-template-columns var(--ScoreEditor-layout-transition-duration)` = **.5s** (token in App.css) |
| Grid transition (panel system) | `grid-template-columns .2s ease` |
| Main toolbar row | `height:56px`; hidden state `height:0; overflow:clip`; `transition: height var(--ScoreEditor-layout-transition-duration)` |

All values above are [exact] from ScoreEditorDesktop.css/.js.

The toolbar row is hidden (height 0) while the Layout panel is active, or the Instruments panel on the edit route (`B` computed in ScoreEditorDesktop.js) [exact]. This gives the layout preview the full height.

**Auto-zoom coupling** [exact]: each sidebar calls `setZoomAutoWidthSubtract("editorPanelSidebar", collapsed ? 64 : 416)` or `("editorSidebar", collapsed ? 0 : 352)`, and the help panel calls `("helpPanel", 352)`, followed by `applyZoomAuto()`. The score's fit-to-width zoom re-flows whenever a panel opens. This is worth copying.

### 1.2 Panel-system anatomy (ScoreEditorDesktop.js/.css)
- `aside#editor-panel-sidebar` holds a `wrapper` (flex, `border-right:1px`), which contains:
  - `railColumn`: `width:64px`, scrollable [exact].
  - `panelColumn`: `flex:1 0 351px` (64 + 351 + 1px border = 416) [exact/inferred].
- **SidebarRail**: a vertical `role=tablist`, `aria-orientation=vertical`. Each entry has a 32×32 `iconBox`, a label clamped to 2 lines (single words use ellipsis), and a tooltip only when the label is truncated (measured with a ResizeObserver). ArrowUp/ArrowDown move between panels with wrap-around. Entries with `group:"bottom"` are pushed down with `margin-top:auto` [exact]. The active entry gets `--surface-accent-tertiary-default` behind the icon, and `iconBox` has `transition: background-color .15s, color .15s` [exact]. The status dot has a `_status-pulse` 1.4s ease-in-out infinite pulse, removed under reduced motion [exact].
- **SidebarPanelHost**: `role=tabpanel`, a header (title + optional badge + close "collapse" button) and a scrolling content area. Panels flagged `chromeless:true` render without the header [exact].

**Panel registry** (`GD` for Flat, `ND` for Edu), built with `pu()`. Panels are sorted by group (top, then bottom) and then by `order`, and filtered by `isAvailable(ctx)` [exact]:

| Order | id | label key | Notes |
|---|---|---|---|
| 30 | notation | editor:sidebar.tab-notation | |
| 40 | instruments | editor:sidebar.tab-instruments | |
| 50 | layout | editor:sidebar.tab-layout | `writeOnly` (hidden without write rights) |
| 60 | audio | editor:sidebar.panel-audio | |
| 70 | assistant | editor:assistant.rail-label | lazy-loads AssistantRailPanel.js, chromeless, has `status()` dot |
| bottom 10 | search | editor:sidebar.panel-search | an **action** entry (`action:()=>showHelp`), not a panel |
| bottom 20 | shortcuts | editor:sidebar.panel-shortcuts | action: showKeyboardShortcuts |

The Edu registry adds assignment (10), submission (10), comments (20, with a badge count) and insights (25) [exact].

**Open, close and collapse** [exact]:
- The store is `editorPanelSystem` (Pinia, editorPanelSystem.js) with `activePanelId`, `collapsed`, `setActivePanel` (which also un-collapses), `collapse`, `expand` and `toggleCollapsed`.
- Clicking the active rail entry toggles collapse. Clicking another entry switches panels. Both go through a **dirty guard**: if the Layout panel has unsaved draft changes, a "Save / Don't save" dialog appears first (`editor:sidebar.layout.unsaved-*`).
- The panel column is wrapped in `<Transition>` with enter/leave class `panelFade` = `transition: opacity .2s ease` and from/to class `panelHidden` = `opacity:0`. Only opacity is animated; the grid width animates separately (.2s ease).
- **Persistence**: the active panel id is stored under key `editor.rail.activePanel` in the app's `flat_ux` storage namespace (vue-data.js `i$("flat_ux")`; a desktop-specific storage class when `isDesktopApp`, otherwise browser storage) [exact key, inferred backend]. It is only stored when not in Edu mode. Default resolution order: `assignment`, `submission`, the stored id, `notation`, then the first available panel.
- The **collapsed** flag is *not* persisted. It is plain store state [exact].
- **Auto-collapse during live MIDI** (`AP()`): when `liveMidiPhase !== "idle"`, both sidebars are collapsed after snapshotting their states, and the states are restored when the phase returns to idle [exact].

### 1.3 Tabbed EditorSidebar (non-rail variant)
- `wrapper`: `position:absolute; width:352px; transition: transform .2s ease .15s` [exact].
- Collapsed: wrapper `transform: translate(-352px)` with `transition: transform .2s ease, visibility 0s .2s; visibility:hidden`. A mini "collapsedContent" tab (56px wide, `box-shadow: var(--f-shadow-lifted)`) slides in from behind with `transform .2s ease .15s`. This is a sequenced **slide-out then pop-tab** pattern [exact].
- Header: 48px, with SlidingTabs (Notation / Instruments / Layout; Layout is hidden when not `scoreWrite`), a keyboard-shortcuts button and a collapse button [exact].
- Store `scoreEditorLayout` (useInstrumentsSubPages.js): `sidebarCollapsed`, `sidebarActiveTab` (default `"notation"`), `collapseSidebar`, `expandSidebar`, `toggleSidebar`. Not persisted [exact].
- Commands are routed through `setSidebarUi(...)`: `toggle`, `notation|instruments|layout`, `collapseSections`, `expandSections`, `toggleSections`, `expandDynamics` and `expandArticulationsAndDynamics` [exact]. These map to the editor actions `toggleSidebar`, `showNotationSidebar`, `collapseSidebarSections`, `expandSidebarSections` and `toggleSidebarSections` (editor-*.js exports) [exact names].
- Focus management: on collapse, focus moves to the rail's expand button. On expand, it returns to the header collapse button [exact].

### 1.4 Notation panel sections (config.js, `U.tempo` order) [exact]
modes, pitch (`editor:pitchRepresentation.title`), articulations, ornaments, dynamics, stringsTechniques, tabTechniques, percussion, tempo, measures (with a "brackets" trailing cell), clef, keySignature, timeSignature, barlinesAndRepeats, text.

- The legacy variant swaps in jazzArticulations and removes tempo.
- Grid columns: `{sidebar:7, tabletGrid:8}`.
- `modes` and `pitch` have `defaultOpen:true`; the other sections start closed.

**Section component** `EditorSidebarSection` (EditorSidebarInstrumentsTab.js/.css `_s99y2_`) [exact]:
- A header button 48px high with `aria-expanded`. It shows a shortcut hint while open.
- The caret swaps between two icons via opacity, `.15s ease`.
- Body expand/collapse uses the **CSS grid-rows trick**: `grid-template-rows: 0fr → 1fr`, `transition: grid-template-rows .2s ease`, with an inner `overflow:hidden; min-height:0`.
- `reveal()` opens the section and then calls `scrollIntoView({block:"start", behavior:"smooth"})`.
- A "dirty" section shows a 4px accent bar on the left.

**Main toolbar groups** (config.js `ye`) [exact]:
- `essentials` (left, pill style): accidentals [voices, natural, sharp, flat, quarterAccidental, switchEnharmonic], noteheads, durations [whole … 64th, dots, tie, tuplets, insertRest].
- `actions` (right, flat style): delete [remove], history [undo, redo], selectionClipboard [lasso, copy, cut, paste], view [zoomIn, zoomOut, switchScoreDisplayMode, switchTouchUI], export [export, print].

### 1.5 Sidebar dropdown tools and tool opening
- **sidebarDropdownConfigs.js** [exact]: three multi-variant tools.
  - `mordent`: 10 mordent variants, default `toggleMordent`.
  - `toggleTrill`: 6 trill accidentals.
  - `quarterAccidental`: 4 quarter-tone actions.
  - It also has an icon-size map: `note-*` and `dynamics-*` icons are 32, clefs and key signatures 40, voice/beaming 16, everything else 24.
- **SidebarDropdownButton.js** [exact]: a ToolButton trigger that opens a dropdown (`direction:"bottom-start"`, `distance:[0,6]`, no arrow, teleported, closes on wheel). Inside is a grid of 32px option buttons (`repeat(n, 32px)`).
  - The trigger icon shows the *currently active* variant, or the default variant.
  - The trigger is marked disabled only when **every** variant is disabled.
  - Clicking a disabled option does nothing.
- **useSidebarToolOpener.js** [exact]: tool buttons register for a global `toolUiOpenRequest {tool, tab, section, nonce}`. When the request matches the tool, the opener runs only if an injected `toolHostShown` flag (default `true`) is set. It waits for `nextTick`, calls `.open()` on the tool's dropdown ref (or a custom opener), and then clears the request. The panel host handles `tab`/`section` first: it switches panel (through the dirty guard), expands, and then expands and reveals the section. This is a **deep-link-to-tool** pipeline usable from search or command palette.
- **useToolBottomSheet.js** [exact]: `useBottomSheet = displayMobileEditor && isSmallScreen` (viewport < 768). In that case the same tool opens a bottom sheet (`open` toggle) instead of a dropdown. A module-level counter tracks open sheets and drives a shared backdrop (`setHasBackdrop(count>0)`). The sheet auto-closes when the condition flips to false.
- **sidebarToolExecution.js**: a tiny pub/sub that notifies listeners when a sidebar tool executes [exact]. I infer it is used to close popovers or track usage.

### 1.6 Instruments panel: PanelStack (push/pop sub-pages)
EditorSidebarInstrumentsTab.js/.css (`_18n3e_`) [exact]:
- Each level is absolutely positioned. The container carries `data-nav="push|pop"`.
- Durations:
  - `--panel-stack-duration` = prop `duration` (default **300ms**).
  - Header hold = 30% of duration (90ms) for push/pop.
  - Vue `<Transition :duration>` = duration + hold (390ms), or **150ms** under reduced motion.
- Push:
  - Entering level goes `translate(100%) → 0`, and its `[data-panel-stack-header]` starts at `translate(48px)` and settles after a 90ms delay. This is a parallax title.
  - Leaving level goes to `translate(-25%)` and `opacity:0`.
- Pop: the mirror of push.
- Easing:
  - transform `var(--motion-easing-decelerate)` = `cubic-bezier(.2,0,0,1)`.
  - opacity `calc(duration*.6) linear`.
  - `will-change: transform, opacity`.
- Reduced motion: opacity-only crossfade, `var(--motion-duration-fast)` (.15s) linear, with no transforms.
- Behaviour:
  - Saves `scrollTop` per depth and restores it on pop.
  - Remembers the focused element by `data-panel-stack-focus-key` and index, and restores focus on pop. Otherwise it focuses `[data-panel-stack-autofocus]`.
  - Marks the leaving level `inert`.
- Instruments list drag-reorder uses SortableJS: `handle:.drag-handle`, `animation:150`, `forceFallback`, ghost/drag classes. A sort-mode variant in App.js also uses `animation:150` [exact].
- **partsSortingTransition.js** is *not* a CSS transition. It is a state helper [exact]. When a manual bracket edit or part drag turns a preset sorting (orchestra, concertBand, jazzBigBand, choir, chamber, britishBrassBand) into `custom`, it emits XP plus a `partsSortingChanged {from,to,cause}` event. The UI then shows the toasts `editor:sidebar.instruments.sorting.drag-toast` / `bracket-toast` [inferred link].

---

## 2. Hidden vs disabled

Flat consistently **hides** a tool when it can never apply in the current context (rights, toolset, instrument type). It **disables** a tool when it could apply but not at the current cursor or selection, and in that case it explains why.

### 2.1 Hidden (rendered with v-if, or filtered out of a list)
| Level | Condition | Source |
|---|---|---|
| Rail panel | `isAvailable(ctx)` false (platform, role, mode, assignmentType), `writeOnly && !scoreWrite`, or toolset gate: instruments/layout need `enabledActionsSet.has("instruments"/"layout")`, notation needs ≥1 visible section | ScoreEditorDesktop.js `bk()`/`T()` [exact] |
| Tabbed sidebar tab | Layout tab `writeOnly` | ScoreEditorDesktop.js [exact] |
| Notation section | `modes`/`clef`/`keySignature`/`timeSignature` hidden if `!scoreWrite`; `instrumentGroups` mismatch (e.g. stringsTechniques only for `strings`, tabTechniques only `plucked-strings`, percussion only `unpitched-percussion`); `excludeInstrumentGroups` (ornaments hidden for unpitched); section hidden if all its tools were filtered out | ConnectedPlaybackPill.js `wn()` [exact] |
| Individual tool | `checkVisibility(tool)` is false when: read-only and the tool is not RO-safe; pitched/unpitched mismatch (`xr`); insert-mode mismatch; `!toolset.isAvailable(action)`; per-tool visibility ref false | ConnectedPlaybackPill.js `$e()` [exact] |
| Toolset gate | Pinia `toolset` store: `disabledGroupsDefault` + `disabledGroupsExtra` + feature-flagged groups (lasso, tempoText) yield `enabledActionsSet`; `isAvailable(a)` is false for flag-disabled groups or when not in the set (embed/edu restrictions) | scoreCursor.js [exact] |
| Mobile sidebar menu | Credits / Instruments / Layout are hidden when `isEditionBlocked`; Search is shown only when the new toolbar is on | MobileSidebar.js [exact] |
| Measure +/- controls | `canAddMeasure = enabledActionsSet.has("addMeasureToEnd")` | EduAssignmentSidebarToggle.js [exact] |
| Library | The playlist "more" trigger is **removed** when offline | ScoresLayout.js [exact] |

### 2.2 Disabled (still visible and focusable, with an explanation)
- Reason resolver (useToolTooltip.js) [exact]:
  - When `isEditionBlocked` and the action's groups do not include `"ro"`, the reason is `"editionBlocked"`.
  - Otherwise the reason is the cursor store's `` `${action}DisabledReason` `` string, or `null`.
- Disabled means `reason !== null`. The tooltip becomes `"<Title>: <reason text>"` using i18n `editor:action-disabled.<reason>`. Missing keys fall back to `editor:action-disabled.default` and log a warning once.
- **ToolButton.js** uses `aria-disabled="true"` (not the native `disabled` attribute), so the button stays focusable and hoverable for its tooltip [exact]. Hover and active styles are guarded with `:not(._disabled)`.
- Library examples [exact]:
  - The New score button is `disabled` when offline (unless running as the desktop library).
  - The create-playlist IconButton is `disabled` when offline.
  - IconButton `[aria-disabled=true]` uses `pointer-events:none`.

### 2.3 Disabled visual style [exact]
| Element | Style | Source |
|---|---|---|
| ToolButton | `cursor:not-allowed; color: var(--icon-general-secondary-disabled)` (neutral-200 light / neutral-400 dark); sidebar context adds `background: var(--surface-general-primary-disabled)`; active+disabled uses `--icon-accent-primary-disabled`; label uses `--text-general-primary-disabled` | ToolButton.css |
| Dropdown option | `color: --icon-general-secondary-disabled; cursor:not-allowed`; hover background suppressed | SidebarDropdownButton.css |
| Legacy toolbar icons | fill/stroke `--f-grey-disabled-content #b7b7b7` / `--f-grey-disabled-container #d7d8dc` | ToolbarSimpleIcon.css, ToolbarGroup.css |
| Menu item (Radix) | `[data-disabled]` uses secondary text colour and `cursor:not-allowed` | dropdownMenu.css |
| Cards | `opacity:.4; cursor:default` | ScoreEditorDesktop.css (`_card_1mnsl_`, `_card_127hq_`) |
| Range slider | `opacity:.5; cursor:not-allowed` | ScoreEditorDesktop.css |
| Plain buttons | `:disabled { color: --icon-general-tertiary-default / --icon-general-secondary-disabled; cursor:default }` | ScoreEditorDesktop.css |

In short, editor tools use **colour tokens rather than opacity**. Opacity (.4/.5) appears only on cards and sliders.

---

## 3. Animations and transitions

**Motion tokens** (common-vue.css) [exact]: `--motion-duration-fast:.15s`, `--motion-duration-base:.2s`, `--motion-duration-slow:.3s`, `--motion-easing-standard:ease`, `--motion-easing-decelerate:cubic-bezier(.2,0,0,1)`. Legacy layout token: `--ScoreEditor-layout-transition-duration:.5s` (App.css).
**Sheet/iOS curve** used widely: `cubic-bezier(.32,.72,0,1)`.

| Element | Trigger | Property | Duration | Easing | Source |
|---|---|---|---|---|---|
| Editor grid columns (panel system) | open/collapse panel | grid-template-columns | .2s | ease | ScoreEditorDesktop.css [exact] |
| Editor grid columns (legacy) | sidebar/help toggle | grid-template-columns | .5s | default (ease) | ScoreEditorDesktop.css + App.css [exact] |
| Panel column content | v-if Transition (`panelFade`/`panelHidden`) | opacity 0↔1 | .2s | ease | ScoreEditorDesktop.css `_fwux8_` [exact] |
| Help panel | open/close | opacity | .5s (.2s in panel layout via `--motion-duration-base`) | default | ScoreEditorDesktop.css [exact] |
| Main toolbar row | Layout/Instruments panel | height 56→0 | .5s | default | ScoreEditorDesktop.css [exact] |
| Tabbed sidebar wrapper | collapse / expand | transform translateX(-352px), visibility | .2s (expand delayed .15s) | ease | ScoreEditorDesktop.css `_73q2j_` [exact] |
| Collapsed mini-tab | collapse | transform, visibility | .2s, delay .15s | ease | same [exact] |
| Rail icon box | hover/active | background-color, color | .15s | ease | `_1kja0_` [exact] |
| Rail status dot | status | opacity pulse (`_status-pulse`, 50% opacity .35) | 1.4s infinite | ease-in-out | `_1kja0_` [exact] |
| Sidebar section body | header click | grid-template-rows 0fr↔1fr | .2s | ease | EditorSidebarInstrumentsTab.css `_s99y2_` [exact] |
| Section caret | open state | opacity swap | .15s | ease | same [exact] |
| Other carets in instruments tab | open state | transform (rotate) | .15s | ease | EditorSidebarInstrumentsTab.css [exact] |
| PanelStack levels | push/pop | transform translateX(100%/-25%), opacity | 300ms (+90ms header hold; opacity 180ms linear) | cubic-bezier(.2,0,0,1) | `_18n3e_` + JS [exact] |
| Instrument drag reorder | drag | Sortable FLIP | 150ms | Sortable default | EditorSidebarInstrumentsTab.js [exact] |
| `list` TransitionGroup (instrument list rows) | add/remove/move | all; opacity 0 on enter/leave; leaving rows `position:absolute` | .5s | ease | App.css `.list-*` [exact] |
| SlidingTabs indicator | tab change | transform translateX + width (JS-measured offsetLeft/offsetWidth) | .15s | ease | slidingTabs.css/.js [exact] |
| SlidingTabs text | active/hover | color | .15s | ease | slidingTabs.css [exact] |
| FTab (legacy tabs) | active | none (border-bottom 2px swap) | — | — | tabs.css [exact] |
| Bottom sheet panel | open / close (`animated`, `closing`) | `@keyframes` translateY(100%)↔0 | .3s, fill both | cubic-bezier(.32,.72,0,1) | bottomSheets.css [exact] |
| Bottom sheet overlay `#0b233edb`, z 699 | open/close | opacity keyframes | .3s | cubic-bezier(.32,.72,0,1) | bottomSheets.css [exact] |
| (close is committed on `animationend`, then `close` is emitted) | | | | | bottomSheets.js [exact] |
| Tablet bottom sheet (hidden/reduced/expanded) | drag / tap | height (CSS vars `--sheet-transition-ms`/`--sheet-transition-easing`) | 500ms default; velocity-adjusted 250–500ms | `cubic-bezier(.32, k, 0, 1)` with k derived from release velocity | SidebarGridRow.js `je()` + App.js `TabletBottomSheet` [exact] |
| Tablet instruments sheet | open/close | fade opacity / slide translateY(100%) | .26s | cubic-bezier(.32,.72,0,1) | App.css `_1o48c_` [exact] |
| Tablet add-note hint | show/hide | opacity + translateY(8px) | .2s | ease | App.css `_xzthd_` [exact] |
| Mobile toolbar panel (`v-enter`) | show | margin-bottom −319px→0, opacity | .4s | ease | ScoreEditorMobile.css `_2xgfx_` [exact] |
| MobileSidebar drawer | open | **none** (instant v-if) | — | — | MobileSidebar.js/.css [exact] |
| Floating dropdown (popper) | open/close | opacity 0→1, scale .6→1; visibility delayed .2s on close; transform-origin follows placement | .2s | default (ease) | dropdown.css [exact] |
| Radix dropdown menu | open | `_scaleIn` keyframes opacity 0→1, scale 0→1, origin = radix transform origin | .2s | ease-out | dropdownMenu.css [exact] |
| Menu item | hover/highlight | all | .2s | ease | dropdownMenu.css [exact] |
| ContentDialog (modal) | enter/leave | backdrop opacity; dialog opacity + scale(.95→1) | .3s | cubic-bezier(.32,.72,0,1) | ContentDialog.css `_3emij_` [exact] |
| ContentDialog size morph | content change | width/height | .22s | cubic-bezier(.32,.72,0,1) | same [exact] |
| QuickSearchModal (command palette) | enter | backdrop opacity; panel opacity + translateY(-20px) scale(.98)→0/1; rows `[role=option]` `_rowIn` (opacity, translateY 6px) staggered 88/133/178/223/268/313ms | panel .25s, rows .1s | cubic-bezier(.16,1,.3,1) | App.css `_1fkrt_` [exact] |
| QuickSearchModal | leave | opacity + translateY(-12px) scale(.98) | .14s | cubic-bezier(.4,0,1,1) | same [exact] |
| Toast (MessageCenter) | enter/leave | opacity + `scale` .6↔1 | .5s | default | MessageCenter.css [exact] |
| Tooltip hotspot / onboarding | show / hide | opacity | 1s / .5s | linear | tooltipCommons.css [exact] |
| ToolButton | hover/press | background, color, box-shadow | .2s | ease | ToolButton.css [exact] |
| Score playback cursor fade | playback stop | opacity | .3s, delay .1s | cubic-bezier(0,0,.2,1) | ScoreDrawer.css [exact] (ScoreDrawer is the score renderer, not a drawer) |
| Library row active bar (`:before`) | hover/selected | opacity, scaleY(.5→1) | .2s | default | ScoresLibrary.css / PlaylistMenu.css [exact] |
| Library row side-actions | hover | opacity, scale(.8→1) | .2s (trash rows add .1s delay) | default | same [exact] |
| Library batch-action footer | selection made | opacity, translateY(100%)→0, visibility | .2s | default | ScoresLayout.css `_1eqz7_` [exact] |
| Library search filters | show | `fade` Transition opacity | .15s | ease | ScoresLibrary.css [exact] |
| Sort arrow | direction change | rotate | .2s | ease-in-out | ScoresLayout/ScoresLibrary.css [exact] |
| Header buttons (top bar) | press | transform | .2s | cubic-bezier(.165,.84,.44,1) | ScoreEditorTopBar.css [exact] |
| Welcome screens | enter | opacity + translateY(6px) | .2s | ease | welcome.css [exact] |

**prefers-reduced-motion** [exact]:
- CSS `@media(prefers-reduced-motion:reduce)` blocks in App.css (QuickSearch → 0ms; tablet sheet → none; paywall pop-ins off), ContentDialog.css (1ms, no transform), EditorSidebarInstrumentsTab.css (PanelStack → crossfade), ScoreEditorDesktop.css (rail pulse, loaders, check icon), EduAssignmentSidebarToggle.css, AssistantRailPanel.css, OmrImportFlow.css and ScoreEditor.css (orientation sequence durations collapsed to the fade token).
- JS `matchMedia` in PanelStack (live listener → 150ms), smooth `scrollTo` → `auto` (ScoreEditorDesktop.js), and video autoplay suppression.
- No global kill switch was found. Each component opts out on its own.

**Floating menu positioning** (useActionMenuFloating.js) [exact]: floating-ui with `offset(5)`, `flip`, `shift`, `size` (padding 5), optional `hide`, `arrow` (padding 8), `strategy:"fixed"`, default placement `top`, and `autoUpdate`. When the anchor disconnects, the last position is kept.

---

## 4. Library window (ScoresLayout / ScoresLibrary / ScoresLibraryHome)

- **Layout switch** [exact]: `ScoresLayout` renders `DesktopLayout` when `isLargeScreen` (viewport ≥1024px), otherwise `MobileLayout` (vue-data.js viewport store: large ≥1024, medium 768–1023, small <768).
- **DesktopLayout** [exact]: `main` grid `grid-template-columns: var(--ScoresLayout-sidebar-width) 1fr` with `--ScoresLayout-sidebar-width: 280px`, `gap: var(--spacing-2)` (8px), and side margins `calc(100% - 2*spacing-6)`. Edu on the web (not the desktop library) gets `noSidebar` (single column). There is **no collapse or toggle** for the library sidebar: it is fixed at ≥1024 and replaced by the mobile layout below that [exact/inferred]. The router view is keyed by `collectionId`, so changing collection remounts the content.
- **NavigationSidebar** order [exact]:
  1. Header section: title "My scores" (`flat:score.my-scores`), then the nav link **All scores** (`flat:collec.all`, with the score count in its aside slot).
  2. **New score** split CTA (new / import / import PDF), disabled offline unless running as the desktop library.
  3. Storage quota (hidden when `:empty`).
  4. **Playlists** section (`Collections` in Edu): a title row with a sort menu (only when playlists exist) and a "+" create button (disabled offline). Then a scrolling list: pinned playlists first, then unpinned, with infinite pagination (an in-view loader).
  5. **Trash** card pinned at the bottom (with count).
  6. `SyncStatusWidget` (desktop library only).
  - All entries are drag-and-drop targets for scores or files. The drop-zone highlight `dz-active` uses inset accent borders and a tertiary background.
  - The playlist row menu offers pin/unpin, rename and delete (PlaylistMenu.js).
- **ScoresLibraryHome** sections (by string order in the chunk) [inferred order]: Recent scores (`flat:nav.recent-scores`), Shared with me, My library / See all scores, then Playlists or Collections and Trash. Desktop uses grids `repeat(auto-fill, minmax(280px,1fr))` with gap 12px [exact]. Lists are truncated to 8/8/6 items (`slice(0,8)`, `slice(0,6)`) [exact].
- **Empty states** (ScoresTableEmpty.js) [exact component names]: EmptyStateAllScores (`scoresTableEmpty.yourScores.*`), EmptyStateCollaborations, EmptyStateCustomPlaylist, EmptyStateNoResults (`score.no-results`), EmptyStateOffline (with per-context copy: allScores, collaborations, customPlaylists, community, browseExplore), EmptyStatePlaylistsList and EmptyStateTrash (separate copy for power users and for upgrade). Home uses `YourScoresEmptyStateDesktop/Mobile` ("create your first score"). The sidebar shows an inline CreatePlaylist CTA when there are no playlists.
- On mobile, actions (sort, rename, delete, filters, more instruments) are **bottom sheets** (`BottomSheetSort`, `BottomSheetPlaylistMenu`, `BottomSheetSearchFilter*`). On desktop the same actions are dialogs or dropdowns [exact names].

---

## 5. Breakpoints and what changes

| Breakpoint | Effect | Source |
|---|---|---|
| JS `<768` (`isSmallScreen`) | phone layouts; tools open as bottom sheets in the mobile editor | vue-data.js, useToolBottomSheet.js [exact] |
| JS `768–1366` + tablet UA/flag | `isTablet` (web only; never in the desktop app) | scoreViewer.js [exact] |
| JS `≥1024` (`isLargeScreen`) | library DesktopLayout with 280px sidebar | ScoresLayout.js [exact] |
| `max-width:767/768` | library filters restyle, dialogs full-width, mobile instrument rows, top-bar padding 8/16 | ScoresLibrary.css, ScoreEditorTopBar.css, many dialogs [exact] |
| `768–1023` | QuickSearch panel 560px wide (otherwise 500px max) | App.css [exact] |
| `max-width:1023` (+orientation) | video recording footer stacks; preview hidden in landscape | ScoreEditorTopBar.css [exact] |
| `max-width:767` portrait/landscape | performance assignment sidebar 100% vs 338px | ScoreEditorDesktop.css [exact] |
| `max-width:650` | dialogs go edge-to-edge | ContentDialog/DialogWrapper/dialog.css [exact] |
| `pointer:coarse` | 44px touch targets in top-bar menus | ScoreEditorTopBar.css [exact] |
| `max-width:1260` | layout music-font panel becomes single column | App.css [exact] |
| `hover:hover` | hover styles only on hover-capable devices | ToolButton.css etc. [exact] |
| MobileSidebar drawer | right side, `width:80%`, min 300px, max 500px, z 1000; backdrop `#0b233edb` z 699; no animation | MobileSidebar.css [exact] |
| Bottom sheet | full width, `max-height: calc(100% - 48px)`, radius 16px top, z 700 | bottomSheets.css [exact] |
| Tablet sheet tuning | `dragActivationPx 8`, `snapVelocityPxPerS 125`, `transitionMs 500`, `expandedHeightRatio .45` (45vh), grabber 104×6, `commitDistanceRatio 1`; view (grid/list) persisted under `score-editor.bottom-sheet-view` in `flat_ux` | SidebarGridRow.js [exact] |

---

## Takeaways for a TS web piano/score app
1. Use a 3-column CSS grid driven by width variables and animate `grid-template-columns` (.2s ease). Tell your auto-fit zoom about every panel width change.
2. A 64px icon rail plus a ~352px panel. Clicking the active rail item collapses the panel. Persist only the *active panel*, not the collapsed state.
3. Collapse sections with the `grid-template-rows 0fr→1fr` trick (.2s).
4. Hide what can never apply (rights, instrument type, toolset). Disable what can't apply *right now*, use `aria-disabled` so it stays focusable, and show the reason in the tooltip.
5. Use one shared easing family: `cubic-bezier(.32,.72,0,1)` for sheets and modals (.3s) and `cubic-bezier(.2,0,0,1)` for push navigation (300ms). Honour reduced motion per component by falling back to a short opacity crossfade.
