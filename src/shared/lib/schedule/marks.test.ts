import { describe, expect, it } from 'vitest'
import type { PerformanceNote } from '@/shared/lib/arrangement'
import { C_MAJOR, midi, note, type NoteMarks } from '@/shared/lib/music'
import { glissandoTargets, loudness, markedSounds, rollOffsets, stressOf } from './marks'

const played = (m: number, startTick: number, marks?: NoteMarks): PerformanceNote => ({
  midi: midi(m),
  spelled: note('C'),
  hand: 'rh',
  startTick,
  durationTicks: 24,
  velocity: 0.1,
  chord: 0,
  ...(marks ? { marks } : {}),
})
const sound = { kind: 'note' as const, midi: midi(72), at: 1, duration: 0.5, velocity: 0.1 }
/** At 60 bpm a 32nd lasts an eighth of a second. */
const at60 = { key: C_MAJOR, thirtySecond: 0.125, full: 0.5 }

describe('stressOf', () => {
  it('strikes a note harder for an accent or a marcato, harder still for both', () => {
    expect(stressOf(undefined)).toBe(1)
    expect(stressOf({ articulations: ['staccato'] })).toBe(1)
    expect(stressOf({ articulations: ['accent'] })).toBe(1.3)
    expect(stressOf({ articulations: ['marcato'] })).toBe(1.4)
    expect(stressOf({ articulations: ['accent', 'marcato'] })).toBeCloseTo(1.82)
  })
})

describe('markedSounds', () => {
  it('sounds a note as it was without marks', () => {
    expect(markedSounds(sound, undefined, at60)).toEqual([sound])
  })

  it('shortens staccato and staccatissimo, holds a tenuto its full length', () => {
    const length = (marks: NoteMarks) =>
      markedSounds(sound, marks, { ...at60, full: 0.52 })[0]?.duration
    expect(length({ articulations: ['staccato'] })).toBe(0.25)
    expect(length({ articulations: ['staccatissimo'] })).toBe(0.125)
    expect(length({ articulations: ['tenuto'] })).toBe(0.52)
    expect(length({ articulations: ['fermata'] })).toBe(0.75)
  })

  it('strikes an accent and a marcato louder, a marcato shorter too', () => {
    expect(markedSounds(sound, { articulations: ['accent'] }, at60)[0]?.velocity).toBeCloseTo(0.13)
    const [marcato] = markedSounds(sound, { articulations: ['marcato'] }, at60)
    expect(marcato?.velocity).toBeCloseTo(0.14)
    expect(marcato?.duration).toBe(0.375)
  })

  it('plays grace notes just before the beat', () => {
    const grace = [{ midi: midi(74), spelled: note('D') }]
    const sounds = markedSounds(sound, { grace }, at60)
    expect(sounds.map((s) => [s.midi, s.at])).toEqual([
      [74, 0.94],
      [72, 1],
    ])
  })

  it('trills with the key’s next note above in 32nds', () => {
    const sounds = markedSounds(sound, { ornament: 'trill' }, at60)
    expect(sounds.map((s) => s.midi)).toEqual([72, 74, 72, 74])
    expect(sounds.map((s) => s.at)).toEqual([1, 1.125, 1.25, 1.375])
  })

  it('plays a mordent and a lower mordent, then holds the note', () => {
    const upper = markedSounds(sound, { ornament: 'mordent' }, at60)
    expect(upper.map((s) => s.midi)).toEqual([72, 74, 72])
    expect(upper.at(-1)?.duration).toBe(0.25)
    expect(markedSounds(sound, { ornament: 'lower-mordent' }, at60).map((s) => s.midi)).toEqual([
      72, 71, 72,
    ])
  })

  it('turns round the note and repeats it as a tremolo', () => {
    const turn = markedSounds(sound, { ornament: 'turn' }, at60)
    expect(turn.map((s) => s.midi)).toEqual([74, 72, 71, 72])
    expect(markedSounds(sound, { ornament: 'tremolo-3' }, at60)).toHaveLength(4)
  })

  it('turns the other way round for an inverted turn', () => {
    const turn = markedSounds(sound, { ornament: 'inverted-turn' }, at60)
    expect(turn.map((s) => s.midi)).toEqual([71, 72, 74, 72])
  })

  it('repeats a tremolo’s note in 8ths, 16ths or 32nds by its strokes', () => {
    const strokes = (ornament: NoteMarks['ornament']) =>
      markedSounds(sound, { ornament }, at60).map((s) => s.at)
    expect(strokes('tremolo-1')).toEqual([1])
    expect(strokes('tremolo-2')).toEqual([1, 1.25])
    expect(strokes('tremolo-3')).toEqual([1, 1.125, 1.25, 1.375])
  })

  it('plays portato a little detached, and leaves a breath or a caesura’s silence after the note', () => {
    const length = (marks: NoteMarks) => markedSounds(sound, marks, at60)[0]?.duration
    expect(length({ articulations: ['portato'] })).toBe(0.375)
    expect(length({ articulations: ['breath'] })).toBe(0.25)
    expect(length({ articulations: ['caesura'] })).toBe(0.25)
    expect(length({ articulations: ['caesura'], ornament: 'trill' })).toBe(0.125)
  })

  it('slides a glissando over the white keys to the next note, which it does not play', () => {
    const up = markedSounds(sound, { glissando: true }, { ...at60, glissTo: midi(79) })
    expect(up.map((s) => s.midi)).toEqual([72, 74, 76, 77])
    expect(up.map((s) => s.at)).toEqual([1, 1.125, 1.25, 1.375])
    const down = markedSounds(sound, { glissando: true }, { ...at60, glissTo: midi(69) })
    expect(down.map((s) => s.midi)).toEqual([72, 71])
    expect(markedSounds(sound, { glissando: true }, at60)).toHaveLength(1)
  })
})

describe('loudness', () => {
  it('sets a hand’s level from each dynamic on', () => {
    const notes = [
      played(60, 0, { dynamic: 'p' }),
      played(62, 24),
      played(64, 48, { dynamic: 'f' }),
    ]
    expect(loudness(notes)).toEqual([0.7, 0.7, 1.25])
    const extremes = [played(60, 0, { dynamic: 'ppp' }), played(62, 24, { dynamic: 'fff' })]
    expect(loudness(extremes)[0]).toBeLessThan(0.5)
    expect(loudness(extremes)[1]).toBeGreaterThan(1.5)
  })

  it('strikes a sforzando note alone harder, and a forte-piano loud then holds it soft', () => {
    const sforzando = [
      played(60, 0, { dynamic: 'p' }),
      played(62, 24, { dynamic: 'sfz' }),
      played(64, 48),
    ]
    const [p, sfz, after] = loudness(sforzando)
    expect(sfz).toBeGreaterThan(p ?? 1)
    expect(after).toBe(p)
    const fortePiano = loudness([played(60, 0, { dynamic: 'fp' }), played(62, 24)])
    expect(fortePiano).toEqual([1.25, 0.7])
    expect(loudness([played(60, 0, { dynamic: 'pf' }), played(62, 24)])).toEqual([0.7, 1.25])
  })

  it('ramps a hairpin to the next dynamic, else a step past where it began', () => {
    const toForte = [
      played(60, 0, { dynamic: 'p', hairpin: 'cresc' }),
      played(62, 24),
      played(64, 48, { dynamic: 'f' }),
    ]
    expect(loudness(toForte).map((x) => +x.toFixed(3))).toEqual([0.7, 0.975, 1.25])
    const open = [
      played(60, 0, { hairpin: 'dim' }),
      played(62, 24),
      played(64, 48, { hairpin: 'end' }),
    ]
    expect(loudness(open).map((x) => +x.toFixed(3))).toEqual([1, 0.9, 0.8])
  })
})

describe('rollOffsets', () => {
  it('rolls a chord marked arpeggio from its lowest key up', () => {
    const notes = [
      played(67, 0, { arpeggio: true }),
      played(60, 0, { arpeggio: true }),
      played(64, 0, { arpeggio: true }),
      played(72, 24),
    ]
    expect(rollOffsets(notes)).toEqual([0.06, 0, 0.03, 0])
  })
})

describe('glissandoTargets', () => {
  it('slides to the nearest note of its part’s next onset', () => {
    const notes = [
      played(60, 0, { glissando: true }),
      played(72, 24),
      played(76, 24),
      { ...played(40, 24), hand: 'lh' as const },
    ]
    expect(glissandoTargets(notes)).toEqual([72, undefined, undefined, undefined])
    expect(glissandoTargets([played(60, 0, { glissando: true })])).toEqual([undefined])
  })
})
