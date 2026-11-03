# Brief: one look (round 29, A8, A31, A36, R2, R14, R15)

Read first: CLAUDE.md; `.scratch/r29/prompt.md` items A8 ("8. **Shapes and selected states"), A31 ("31. **Nothing
flickers"), A36 ("36. **Focus and keyboard walking") and rules R2, R14, R15, R29; DESIGN.md (Shapes, Choices, Motion);
`src/styles/theme.css`. Do NOT touch `pages/settings`, `pages/midi-settings` or the settings rows (another agent owns them).

Build, one commit per item:
1. A8/R14: one radius scale as tokens in `theme.css` (control, card, sheet, pill), named in DESIGN.md; replace every
   one-off `rounded-*` in `src/` (outside `shared/ui/primitives`, which take the tokens through their classes) with the
   token classes. Add a test (static scan) that fails a new one-off `rounded-` value outside an allow-list.
2. A8/R15/R2: one selected style (one fill, one border rule, one weight, fill to the control's edges; hover lighter than
   selected) as shared classes/data-attributes used by Segmented, chips, toggle chips, view cards, toolbar capsule items,
   tabs, sidebar items, list rows, and the new pickers (`shared/ui/pickers`). No control shows two highlights at once.
3. A36: one focus ring (`:focus-visible`, token colour, offset) everywhere; Tab walks every place and its pages in visual
   order; fix any trap or skipped control you find on Learn, Songs, a song, the Player, Practice, Chords, Settings
   (read-only there: report settings issues in `.scratch/r29/audit.md` rather than editing them). Add an e2e-free jsdom
   test where practical (tab order on one page).
4. A31: list every flicker/jump (layout shift on load, a control moving between Player and editor, Select mode, page
   switches, theme boot) with Playwright screenshots/timings at 402 and 1280; fix each (reserved space, skeletons of the
   final size, no layout swap). Write findings and fixes in `.scratch/r29/audit.md`.
Update DESIGN.md (shapes, selected style, focus, motion) and the ADR 0011 History with one line.
Check at 402, 320 and 1280 (Playwright as in CLAUDE.md's repo facts: playwright-core, `/opt/pw-browsers/chromium`, dev
server `npx vite --port 5195 --strictPort`, stopped by PID); after-shots to `.scratch/r29/shots/after/look-*.png`.
