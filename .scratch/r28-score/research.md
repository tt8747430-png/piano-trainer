# Round 28: score settings, research

Sources: Flat's help (help.flat.io: Credits, Staves size and spacing, Measures per system, Measure
numbers, Instruments), and what Dorico for iPad and MuseScore 4 put in their score and preference
dialogs (from their manuals as known; facts only, no wording copied).

## What the apps offer

| Area | Flat | Dorico for iPad | MuseScore 4 |
|---|---|---|---|
| Credits | Title, Subtitle, Lyricist, Composer, Arranger, License; a click on the title opens them; printed at the head | Project info: title, subtitle, composer, lyricist, arranger, copyright, per flow | Score properties: work title, subtitle, composer, lyricist, arranger, translator, copyright |
| Instruments | Add, remove, replace, reorder, rename, hide; by family | Players and instruments panel | Instruments panel |
| Tempo, key, time | On the score and in the palette | Popovers on the score | Palettes; New score wizard |
| Bars | Add or remove at the end | Bars popover | Insert/append measures |
| Staff size | Rastral presets or mm (Layout tab) | Space size (Layout options) | Staff space (Page settings) |
| Bars per line | Measures per system, a maximum | Fixed bars per system | Via breaks |
| Page format | Page size, margins | Page size, margins | Page settings |
| Bar numbers | Every system, every bar, never | Every system, every n bars, none | Same |
| Note entry | Shortcuts, MIDI input | Play notes during note input, caret advance | Play notes when editing, play chord when editing a note, MIDI input |
| Playback | Mixer, metronome, count-in | Playback options | Mixer, count-in |

## What we had

The title (in place), tempo, key, time, clefs, staves (named, added, removed, the piano hidden) all on
the score; the View's layout (lines, pages, one line); the keyboard, MIDI and recorder settings. No
credits, no staff size, no bars per line, no page of the score's own settings, no note heard as it is
edited.

## Built (round 28)

- The score's Settings page (`/edit/$pieceId/settings`): credits, instruments, tempo, key, time, bars,
  staff size, bars per line, Hear notes as you edit, links to the MIDI keyboard and keyboard settings.
- Credits printed under the title in the Player and the editor (lines and pages), a click there opening
  the Settings as Flat's title opens its credits.
- Staff size (five sizes) and bars per line (as written, or 1 to 8 at most) saved with the song.

## Left, and why

- License/copyright line: a learner's song is not published as print; Publish in library has its own
  description. Worth adding with print export.
- Page size and margins: we print A4 only; a learner rarely needs Letter or margins.
- Bar numbers policy: we number each line's first bar, as Flat's default; the other choices matter for
  orchestral parts more than for a piano learner.
- Instrument families beyond voices and piano: each needs its own sound first (ADR 0097).
- Caret advance off: Flat and MuseScore advance always; Dorico's option suits step-time on a MIDI
  keyboard, which our recorder covers.
