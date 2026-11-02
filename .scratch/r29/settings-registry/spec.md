# Spec: the settings registry (R18, R20, R21, R24, A10, A12–A14, A24)

## Problem
Settings are drawn by hand on each page (`pages/settings`, the lesson's and course's Settings, the score's
Settings, the Player's sheets), so the same field shows in two places ("Lessons read as" on a lesson's
Settings and in Settings) and nothing stops a third. Practice pages have no Settings page at all.

## Decision
1. **One registry**, `shared/config/settings-registry.ts` (types) filled in `entities/settings/model/registry.ts`:
   ```ts
   interface SettingDef<K extends SettingKey> {
     key: K                     // a path into pt-settings: 'keyboard.keySize', 'lessonReading', …
     home: SettingsPageId       // the one page that draws it
     group: string              // i18n key of its group heading on that page
     label: string              // i18n key, ≤ ~4 words (R21)
     info?: string              // i18n key for its ⓘ, only where the label can't say it
     control: 'switch' | 'segmented' | 'picture' | 'menu' | 'stepper' | 'slider'
     options?: readonly { value; label; picture? }[]
     when?: (ctx) => boolean    // drawn only where it works (R30): a MIDI device, a laptop, …
   }
   ```
   `SettingsPageId` is a closed union: `general`, `appearance`, `on-screen-piano`, `midi`, `recording`,
   `sync-data`, `account`, `privacy`, `lesson-reading`, `player`, `score-editor`, `metronome`,
   `chords`, `scales`, `intervals`, `progressions`, `accompaniment`, `chord-finder`, `trainers`.
   An **item's** own settings (a song's name, folder, publishing; a lesson's) are not preferences and stay
   on the item's Settings page, which may hold *link rows* to kind pages.
2. **One renderer**, `widgets/settings-page`: `<SettingsPage id>` draws the page's defs in their groups with
   the five row kinds of R24 (`shared/ui` rows: `RowLink`, `ChoiceRow`, `SwitchRow`, `ActionRow`,
   `DangerRow`), reads and writes through `set-preference` commands (one generic `setSetting(key, value)`
   over the store's sanitiser). A page may add non-registry rows (actions, the account card) above or below,
   never a preference.
3. **One page per kind, reached two ways.** Each kind page has a route under Settings
   (`/settings/<id>`) and is opened from the item's gear as the *same route* (Back goes up per the
   parents table to Settings, so the gear navigates with `replace` back to the item via a `from` search
   param kept only for Back: `parentOf` reads `from` when it names a valid item route). No copy of the page.
4. **Laptop, two panes (R20)**: from 64rem `/settings` is a split view, the list (20rem) and the chosen page
   (`/settings/<id>` renders inside the right pane; `/settings` alone shows `general`). Phone: list → page.
5. **The Settings list** draws its rows from the page ids (icon in a coloured square, R21), grouped:
   account card · General (general, appearance, language) · Playing (on-screen piano, MIDI keyboard,
   recording, metronome) · Pages (lesson reading, the Player, the score editor, each Practice page) ·
   Sync and data · Help · Admin. Destructive rows never on the list (R25).

## Moves (the map is `.scratch/r29/settings-map.md`, filled in round 1)
- `lessonReading`: lesson's and course's Settings → link row; home `lesson-reading`.
- `scoreView.*`, `sound.*`, `practice.*` (fingering, named notes, count-in), `melody` → `player`.
- `editing.*`, `paletteFolded`, `paletteSections` → `score-editor` (palette place stays component state of
  the editor where it is layout, not preference: decided per row in the map).
- `keyboard.*` → `on-screen-piano`; `midi.*` → `midi`; `recorder.*` → `recording`; `metronome.*` →
  `metronome`; `chordFinder.*` → `chord-finder`; `trainer.*` → `trainers`.
- `foldedSections`, `sidebar`, `welcomed` are UI state, not settings: they stay in the store and out of the
  registry.

## Tests
- `registry.test.ts`: every key is unique, resolves to a field of `SettingsState`, and every field of
  `SettingsState` except the UI-state list is in the registry.
- `settings-pages.test.tsx`: render every page id; collect every `data-setting` key rendered; a key on two
  pages fails.
- Each kind page reached from an item's gear and from Settings renders the same rows.

## ADR
0038 (saved stores): settings are declared once in the registry; 0061 (controls): the five row kinds and the
picture rule. `pt-settings` version bumps if a field moves or is renamed.
