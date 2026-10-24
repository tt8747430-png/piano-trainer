import {
  C_MAJOR,
  parseNoteInOctave,
  TICKS_PER_BEAT,
  type Hand,
  type Key,
  type Midi,
  type SpelledNote,
} from '@/shared/lib/music'
import type { StaffId, TimedMusic, TimedNote } from '@/shared/lib/notation'

const WHOLE_BAR = 4 * TICKS_PER_BEAT

/** A key of a voicing, as it is spelled. */
export interface VoicedKey {
  readonly midi: Midi
  readonly note: SpelledNote
}

/** A voicing as a lesson writes it: its symbol, what is written under it, and its keys by hand. */
export interface WrittenVoicing {
  readonly symbol: string
  readonly caption?: string
  /** What each key is of the chord, as the hands are written: `1 ♭5 | ♭7 ♭3`. */
  readonly degrees?: string
  /** `D3 A♭3 | C4 F4`: the left hand's keys, a bar, the right hand's; each with its octave. */
  readonly hands: string
}

const readKeys = (text: string): VoicedKey[] =>
  text
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => {
      const read = parseNoteInOctave(token)
      if (!read) throw new RangeError(`Cannot read "${token}" as a key`)
      return { midi: read.midi, note: read.note }
    })
    .sort((a, b) => a.midi - b.midi)

/**
 * A voicing's two hands as a lesson writes them, `D3 A♭3 | C4 F4`, each from its lowest key: the
 * left before the bar, the right after it; with no bar, the right hand alone.
 */
export function readHands(text: string): { readonly lh: VoicedKey[]; readonly rh: VoicedKey[] } {
  const parts = text.split('|')
  if (parts.length > 2) throw new RangeError(`A voicing has two hands: "${text}"`)
  const [left = '', right = ''] = parts.length === 2 ? parts : ['', text]
  const hands = { lh: readKeys(left), rh: readKeys(right) }
  if (hands.lh.length + hands.rh.length === 0) throw new RangeError('A voicing needs a key')
  return hands
}

/** Every key of a voicing, the bass first: what it plays. */
export const voicingKeys = (hands: string): Midi[] => {
  const { lh, rh } = readHands(hands)
  return [...lh, ...rh].map((each) => each.midi).sort((a, b) => a - b)
}

const STAFF_OF: Readonly<Record<Hand, StaffId>> = { lh: 'bass', rh: 'treble' }

/**
 * Voicings on the grand staff exactly as a lesson writes them: each a whole note in a bar of its own
 * with its symbol over it, each hand on its own staff with its keys spelled as written, a staff with
 * no hand left blank; in a key, whose signature it writes.
 */
export function voicingsMusic(voicings: readonly WrittenVoicing[], key: Key = C_MAJOR): TimedMusic {
  const read = voicings.map(({ hands }) => readHands(hands))
  return {
    key,
    meter: '4/4',
    bars: read.map((hands, i) => {
      const blank = (['lh', 'rh'] as const)
        .filter((hand) => hands[hand].length === 0)
        .map((hand) => STAFF_OF[hand])
      return blank.length > 0
        ? { startTick: i * WHOLE_BAR, beats: 4, blank }
        : { startTick: i * WHOLE_BAR, beats: 4 }
    }),
    chords: voicings.map(({ symbol }, i) => ({ startTick: i * WHOLE_BAR, symbol })),
    notes: read.flatMap((hands, i) =>
      (['lh', 'rh'] as const).flatMap((hand) =>
        hands[hand].map((each): TimedNote => ({
          midi: each.midi,
          spelled: each.note,
          hand,
          startTick: i * WHOLE_BAR,
          durationTicks: WHOLE_BAR,
        })),
      ),
    ),
  }
}
