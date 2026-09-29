import { describe, expect, it } from 'vitest'
import { midi, pitchClass } from '@/shared/lib/music'
import { noteOnTop } from './note-on-top'

const C7 = {
  keys: [midi(60), midi(64), midi(67), midi(70)],
  marks: new Map([[midi(70), { tone: '7th' as const, label: '♭7' }]]),
}

describe('noteOnTop', () => {
  it('puts a note on the nearest key above the chord, with the mark given', () => {
    const ninth = noteOnTop(C7, pitchClass(2), { tone: '9th', label: '9' })
    expect(ninth.keys).toEqual([60, 64, 67, 70, 74])
    expect(ninth.marks.get(midi(74))).toEqual({ tone: '9th', label: '9' })
    expect(noteOnTop(C7, pitchClass(10), { tone: '7th', label: '♭7' }).keys.at(-1)).toBe(82)
    expect(noteOnTop(C7, pitchClass(0), { tone: 'root', label: '1' }).keys.at(-1)).toBe(72)
  })
})
