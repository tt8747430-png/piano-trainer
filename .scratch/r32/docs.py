# R32-A: DESIGN.md's keyboard, ADR 0105's and 0062's decisions and History, the feedback log's ruling.
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]


def edit(path, pairs, append=None):
    p = ROOT / path
    text = p.read_text()
    for old, new in pairs:
        assert old in text, (path, old[:50])
        text = text.replace(old, new)
    if append:
        text = text.rstrip('\n') + '\n' + append + '\n'
    p.write_text(text)


edit('DESIGN.md', [(
    """The whole piano, A0 to C8, under a slim strip and scrolling sideways with no bar.

- **The strip** (R31-P): no box of its own, a hairline at its foot. It holds the chord a hand holds at its start, then −
  and + for the keys' size and ⚙ to the piano's settings (the screen's own sheet where it has one), and at its end the
  pedals. Every other piano choice is its settings page's, never a second button on the strip.
- **The pedals:** drawn as the player sees them from the bench, a brass paddle (`--pedal`) on its shank, sinking and
  darkening while down, 48px to press; the sustain alone, or soft, sostenuto and sustain. Hold one to hold it; a tap
  locks the sustain down, a padlock on it, the next lifts it. While music plays, the sustain shows the score's pedal;
  stopped, nothing is down or lit.""",
    """The whole piano, A0 to C8, scrolling sideways, nothing above its keys: they follow the music directly.

- **The rail** (R32): the instrument's case beneath the keys, 56px in `--key-rail`. The chord a hand holds at its
  start (Literata), the pedals centred, ‹ › (a mouse, a long keyboard), − and + for the keys' size and ⚙ to the
  On-screen piano's page at its end. Every other piano choice is that page's, never a second button on the rail.
- **The pedals:** centred on a dark lyre (`--pedal-lyre`) as on an upright or a grand: the sustain alone, or soft,
  sostenuto and sustain left to right. Each a brass plate (`--pedal`) on its shank with its name under it
  (`--pedal-name`), 48px to press. Down it sinks 3px under a honey glow; latched (a tap on the sustain) it carries a
  honey dot; a second tap lifts it. While music plays, the sustain shows the score's pedal; stopped, nothing is down
  or lit.""",
)])

edit('docs/adr/0105-the-player.md', [
    ("""- **The pedal shown** (A27): the sheet draws the pedal as it plays; the Ped. mark the music plays under is lit in
  the playhead's ink while its pedal is down; the drawn sustain pedal under the keys goes down while the score's pedal holds (R31-P), outlined only while
  playing; keys sounding only under the
  pedal ringed, apart from a hand's.""",
     """- **The pedal shown** (A27): the sheet draws the pedal as it plays; the Ped. mark the music plays under is lit in
  the playhead's ink while its pedal is down (an id selector, restyling that mark alone); the sustain on the piano's
  rail goes down while the score's pedal holds, keys sounding only under the pedal ringed, apart from a hand's, while
  playing alone."""),
], append="""- r32 (R32-A) — Performance: the sheet's lines memoised (`SheetLine`), a line rendering only as the music enters or
  leaves it, lines out of sight skipped by the browser (`drawn-in-sight`); the keys' looks memoised; the lookahead
  reads only its due head (Fantaisie-Impromptu, 10 s: 2.25 s blocked → 0.6 s). Nothing reserved: the Player's rows
  meet, the status row only while it speaks, the tip a capsule over the music's foot. Settings one ranked list —
  Score view, Playback, Staves, Accompaniment, then a link to the On-screen piano's page, the one home of every
  keyboard's settings — each row with its line and value, each option with its line. `/settings/player` is gone: the
  Player's gear is its settings' home. MIDI shows only while connected; the tempo reads ♩ = 92; a laptop's dock is one
  row from 80rem (2026-11-05).""")

edit('docs/adr/0062-the-keyboard.md', [], append="""- r32 (R32-A) — Nothing above the keys: the strip becomes the rail beneath them, the pedals centred on a lyre as a
  piano's (soft · sostenuto · sustain, or the sustain alone), the chord held at its start, ‹ › − + ⚙ at its end; a
  latched sustain carries a honey dot. The On-screen piano's page is the one home of the keys' settings, the
  Player's gear a link to it; its options ordered Keys · While you play · Placement, each with its line (2026-11-05).""")
