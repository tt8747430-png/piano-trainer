import {
  TICKS_PER_BEAT,
  type NoteHand,
  type Performance,
  type PerformanceNote,
} from '@/shared/lib/arrangement'
import type { Finger } from '@/shared/lib/music'
import { noteLabel, spellPerformedNote } from './note-names'

export interface PlayedNote {
  readonly label: string
  readonly finger?: Finger
}
export interface NoteColumn {
  readonly beatGroup: number
  readonly beat: string
  readonly notes: Readonly<Record<NoteHand, readonly PlayedNote[]>>
}

/** Sixteenths as e & a, triplet eighths as ⅓ ⅔. */
const SUBDIVISIONS: Readonly<Record<number, string>> = {
  0: '',
  3: 'e',
  6: '&',
  9: 'a',
  4: '⅓',
  8: '⅔',
}

/** The beat, from 0, that a tick so far into its bar falls on. */
const beatAt = (ticksIntoBar: number): number => Math.floor(ticksIntoBar / TICKS_PER_BEAT)

export function beatLabel(ticksIntoBar: number): string {
  return `${beatAt(ticksIntoBar) + 1}${SUBDIVISIONS[ticksIntoBar % TICKS_PER_BEAT] ?? '·'}`
}

/** The beat a beat group falls on, from 0, and how many beats its bar has (a short bar's rounded up). */
export function beatInBar(
  performance: Performance,
  beatGroup: number,
): { beat: number; beats: number } | null {
  const group = performance.beatGroups[beatGroup]
  const bar = group ? performance.bars[group.bar] : undefined
  if (!group || !bar) return null
  return { beat: beatAt(group.tick - bar.startTick), beats: Math.ceil(bar.beats) }
}

/** The note grid: each beat group of a bar, its notes high to low by hand. */
export function barColumns(performance: Performance, bar: number): NoteColumn[] {
  const placed = performance.bars[bar]
  if (!placed) return []
  return performance.beatGroups.flatMap((group, beatGroup) => {
    if (group.bar !== bar) return []
    const played = group.notes
      .map((index) => performance.notes[index])
      .filter((n): n is PerformanceNote => n !== undefined)
      .sort((a, b) => b.midi - a.midi)
    const of = (hand: NoteHand) =>
      played
        .filter((n) => n.hand === hand)
        .map((n) => ({
          label: noteLabel(spellPerformedNote(performance, n)),
          ...(n.finger ? { finger: n.finger } : {}),
        }))
    return [
      {
        beatGroup,
        beat: beatLabel(group.tick - placed.startTick),
        notes: { rh: of('rh'), lh: of('lh'), melody: of('melody') },
      },
    ]
  })
}
