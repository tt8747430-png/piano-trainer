import { describe, expect, it } from 'vitest'
import { midi, note } from '@/shared/lib/music'
import { scaleExample } from './scale-example'

describe('scaleExample', () => {
  it('shows the scale up an octave from its root, the tonic in its own colour', () => {
    const { shown } = scaleExample(note('D'), 'dorian')
    expect(shown.keys).toEqual([62, 64, 65, 67, 69, 71, 72, 74])
    expect(shown.marks.get(midi(62))).toMatchObject({ tone: 'tonic', label: '1', note: 'D' })
    expect(shown.marks.get(midi(65))).toMatchObject({ tone: 'scale', label: '♭3', note: 'F' })
    expect(shown.marks.get(midi(74))).toMatchObject({ tone: 'tonic', label: '1', note: 'D' })
  })

  it('runs it up and back in the scale’s key, one hand', () => {
    const { music } = scaleExample(note('D'), 'dorian')
    expect(music.notes.map((n) => n.midi)).toEqual([
      62, 64, 65, 67, 69, 71, 72, 74, 72, 71, 69, 67, 65, 64, 62,
    ])
    expect(music.key).toEqual({ tonic: note('C'), minor: false })
    expect(new Set(music.notes.map((n) => n.hand))).toEqual(new Set(['rh']))
  })

  it('fingers the right hand on each note of the run, the keys carrying degrees alone (R34)', () => {
    const { shown, music } = scaleExample(note('C'), 'major')
    expect(music.notes.map((n) => n.finger).join('')).toBe('123123454321321')
    expect(shown.keys.map((key) => shown.marks.get(key)?.label).join('')).toBe('12345671')
  })

  it('brings melodic minor back down as natural minor', () => {
    const { music } = scaleExample(note('A'), 'melodic')
    expect(music.notes.slice(7).map((n) => n.midi)).toEqual([81, 79, 77, 76, 74, 72, 71, 69])
  })
})
