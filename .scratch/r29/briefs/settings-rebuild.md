# Brief: Settings rebuild (round 29, A12–A17, A13, R20–R25)

Read first: CLAUDE.md; `.scratch/r29/prompt.md` items A12, A13, A14, A15, A16, A17 (search "12. **Settings layout") and
standing rules R18, R20–R25; `.scratch/r29/settings-registry/spec.md` (incl. "As built"); `.scratch/r29/settings-map.md`;
DESIGN.md "Components". Reference screenshots: `piano-data/reference-apps` (iOS settings, memory-palaces).

Build, one commit per item:
1. A12/R20: Settings two panes from 64rem (list ~20rem, page ~700px, no Back in either pane, the first section open by
   default); phone one column. Remove the two-column grids (`SettingsScreen`, `MidiSettingsPage`). Pages draw their
   preference rows from `SETTING_HOMES` (add page ids as you create pages; keep `src/app/settings-homes.test.ts` green and
   extend it to render-time `data-setting` keys if practical).
2. A14/R22: rename and split "Keyboard and recording" and "MIDI keyboard" into: On-screen piano · Connect a piano
   (Audio/MIDI: devices, sound, log, how to connect) · Computer keys · Sound and recording (volumes, count-in,
   recording; a link row to the Metronome). Routes under `/settings/<id>`; update `app/routes/parents.ts` and every link.
   Sweep en/ru for "keyboard"/«клавиатура» used alone. Write the A14 quick-test answers into `.scratch/r29/audit.md`.
3. A13/R21: one shared picture-choice control in `shared/ui` (SVG drawings, R15 selected style); use it for the table in
   A13 (key size, key length, note names, keyboard position, "Fold the keyboard: Never · On its side · Always" replacing the
   two rows, swipe, theme). Coloured icon squares on every Settings list row.
4. A15: the account card (avatar initial, name, email, one status line: Synced {{when}} · {{n}} changes waiting · Offline ·
   Last sync failed; signed out: "Sign in to sync your songs on every device"). Account page: Profile → Sync (status, last
   synced, Sync now, what syncs) → Sign out → Delete account. Storage and backup page under General (space, Keep them
   safe, Save a backup, Restore from a file, Reset progress). Remove "Sync and data" and its route. Tests: card shows each
   sync status; Sync now only on the Account page.
5. A16/R23: rule-23 marks only inside the shared rows (`RowLink`, `ChoiceRow`, rows of R24); trailing marks and values on
   one right edge, hover to the card's edges. Add a test that no page module imports ChevronRight/ChevronLeft/ArrowLeft/
   ArrowRight outside the shared components and movement controls (allow-list them). Fix every offender.
6. A17/R24/R25: five row kinds, one shared component each; every destructive action last and alone in red with a
   footnote, confirmed through `ConfirmDialog` (shared/ui; Delete account typed with the email). Account, Storage and
   backup, song, lesson and course Settings. Tests per rule 25's Done line.
Update DESIGN.md (settings pattern, picture choices, row kinds, destructive rows), the glossary, ADR 0052's Settings
paragraph (as now, one line in History), CLAUDE.md's Settings sentence (Elsewhere) at the end.

Check at 402, 320 and 1280 with Playwright (`require('/opt/node-tools/node_modules/playwright-core')`,
`chromium.launch({ executablePath: '/opt/pw-browsers/chromium' })`, dev server `npx vite --port 5194 --strictPort` in the
background, stopped by PID); save after-shots of each settings page to `.scratch/r29/shots/after/settings-*.png`.
