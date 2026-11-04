import { describe, expect, it } from 'vitest'
import { midi, note, TICKS_PER_BEAT } from '@/shared/lib/music'
import { notate } from './notate'
import { noteIds, notePlace } from './note-ids'
import type { TimedNote } from './types'

const B = TICKS_PER_BEAT
const played = (key: number, hand: 'rh' | 'lh', beat: number, beats: number): TimedNote => ({
  midi: midi(key),
  spelled: note('C'),
  hand,
  startTick: beat * B,
  durationTicks: beats * B,
})

describe('noteIds', () => {
  it('names each note’s engraving by where it is played, a tied continuation left out', () => {
    const score = notate({
      key: { tonic: note('C'), minor: false },
      meter: '4/4',
      bars: [
        { startTick: 0, beats: 4 },
        { startTick: 4 * B, beats: 4 },
      ],
      // A whole note over the barline, tied into the second bar; a chord under it.
      notes: [played(72, 'rh', 2, 4), played(48, 'lh', 0, 4), played(52, 'lh', 0, 4)],
      chords: [],
    })
    const ids = noteIds(score)
    expect(ids.get(notePlace(2 * B, 72))).toEqual([`n-treble-${2 * B}-0`])
    expect(ids.get(notePlace(0, 48))).toEqual(['n-bass-0-0'])
    expect(ids.get(notePlace(0, 52))).toEqual(['n-bass-0-1'])
    expect(ids.get(notePlace(4 * B, 72))).toBeUndefined()
  })
})
