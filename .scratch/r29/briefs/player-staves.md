# Brief: the Player plays staves, and its Settings page (round 29, A35, B7)

Read first: CLAUDE.md; `.scratch/r29/staves-play-show/spec.md`; in `.scratch/r29/prompt.md` items A35 ("35. **The
Player: play staves") and B7 ("7. **Real settings for the Player and the editor"), A27's "Pedal: As written · Off ·
Automatic" and "Show it" bullets, rules R18, R20, R30; ADRs 0105, 0097, 0115, 0034. Built already: the settings
registry and two-pane Settings (`SETTING_HOMES`, `player` and `score-editor` homes; `src/app/settings-homes.test.ts`,
`src/app/settings-pages.test.tsx`), the pedal line (`Performance.pedal`, `schedule/auto-pedal.ts` `autoPedal`/`withPedal`),
the Metronome engine (`shared/lib/schedule/meter.ts`, `metronome.ts` `beatSounds` with levels and subdivision).

Build, one commit per item, test first:
1. The staves-play-show spec: Staves (Play, Show, volume per staff; the recording a track), accompaniment only for a
   chart under "Accompaniment from the chords", Melody removed (store version bump), the other hand Show · Dim · Hide
   and Play, `controlsFor(kind)` with its audit table in `.scratch/r29/audit.md`.
2. B7: the Player's Settings page (registry home `player`, a gear in the Player's bar and a row in Settings, the same
   page): Audio playback, Playback speed, Display (clef, countdown, cursor, scroll, keyboard, fingering), Pedal
   (As written · Off · Automatic wired to `withPedal`), a link row to the Metronome's page; and the score editor's
   (`score-editor` home). Volumes and count-in move here from the Sound popover (one home).
3. The Player's click and count-in from the Metronome engine: the Metronome's sound and levels heard, the meter's beats
   (dotted in 6/8), tempo changes followed; a quick toggle stays in the transport.
4. A27 "Show it": the score's Ped. marks highlighted as the playhead passes, a pedal lamp by the on-screen piano, keys
   held only by the pedal drawn apart from keys a hand holds.
Update ADRs 0105, 0115 (decision as it stands, one History line each), the glossary, DESIGN.md if the look changed.
After-shots of the Player and its Settings at 402, 874×402 and 1280 to `.scratch/r29/shots/after/player-*.png`
(Playwright as in CLAUDE.md's repo facts; dev server `npx vite --port 5198 --strictPort`, stopped by PID).
Stay out of: the Practice pages, Songs, the Profile.
