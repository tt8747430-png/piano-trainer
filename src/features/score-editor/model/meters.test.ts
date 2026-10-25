import { describe, expect, it } from 'vitest'
import { draftOf, form, lengths, shape } from '../testing/test-draft'
import { metersFor, setMeter, setSectionMeter } from './meters'

describe('the song’s meter', () => {
  const draft = draftOf({
    key: 'C',
    sections: [{ kind: 'verse', lines: ['C G7/B'] }],
    melody: 'E4/4 | D4/4',
    hands: { lh: 'C3/4 | r/4' },
  })

  it('offers the meters of the same kind: a quarter keeps its length in 2/4, 3/4 and 4/4', () => {
    expect(metersFor('4/4')).toEqual(['2/4', '3/4', '4/4'])
    expect(metersFor('6/8')).toEqual(['6/8', '12/8'])
  })

  it('makes each full bar the new meter’s, its notes and chords past the new end taken', () => {
    const three = setMeter(draft, '3/4')
    expect(three.meter).toBe('3/4')
    expect(three.sections[0]?.lines[0]?.map((bar) => bar.ticks)).toEqual([72, 72])
    expect(shape(three.melody)).toEqual(['E4@0/72', 'D4@72/72'])
    expect(form(three)).toEqual([[['C@0', 'G7/B@0']]])
  })

  it('lengthens each full bar to a longer meter, its last chord held on', () => {
    const two = setMeter(setMeter(draft, '2/4'), '4/4')
    expect(two.sections[0]?.lines[0]?.map((bar) => bar.ticks)).toEqual([96, 96])
    expect(shape(two.melody)).toEqual(['E4@0/48', 'D4@96/48'])
  })

  it('keeps a pickup one, cut from its start, so the beats leading into the downbeat stay', () => {
    const pickup = draftOf({
      sections: [{ kind: 'verse', lines: ['G@3 C'] }],
      melody: 'C4/1 D4/1 E4/1 | F4/4',
    })
    const two = setMeter(pickup, '2/4')
    expect(two.sections[0]?.lines[0]?.[0]?.ticks).toBe(24)
    expect(shape(two.melody)[0]).toBe('E4@0/24')
    const three = setMeter(pickup, '3/4')
    expect(three.sections[0]?.lines[0]?.[0]?.ticks).toBe(48)
    expect(shape(three.melody).slice(0, 2)).toEqual(['D4@0/24', 'E4@24/24'])
  })

  it('keeps a pickup bar shorter than the meter’s as it is, and changes nothing across kinds', () => {
    const pickup = draftOf({ sections: [{ kind: 'verse', lines: ['G@1 C'] }] })
    const before = pickup.sections[0]?.lines[0]?.[0]?.ticks
    expect(setMeter(pickup, '3/4').sections[0]?.lines[0]?.[0]?.ticks).toBe(before)
    expect(setMeter(draft, '6/8')).toBe(draft)
  })

  it('counts the whole song in the new meter, a section’s own given up (ADR 0095)', () => {
    const changing = draftOf({
      sections: [
        { kind: 'verse', lines: ['G C'] },
        { kind: 'bridge', meter: '3/4', lines: ['E A'] },
      ],
    })
    const two = setMeter(changing, '2/4')
    expect(two.meter).toBe('2/4')
    expect(two.sections.map((section) => section.heading.meter)).toEqual([undefined, undefined])
    expect(lengths(two)).toEqual([48, 48, 48, 48])
    // In its own meter already, the song gives up the bridge's alone.
    const whole = setMeter(changing, '4/4')
    expect(whole.sections.map((section) => section.heading.meter)).toEqual([undefined, undefined])
    expect(lengths(whole)).toEqual([96, 96, 96, 96])
  })
})

describe('a change of time at a section (ADR 0095)', () => {
  const song = draftOf({
    sections: [
      { kind: 'verse', n: 1, lines: ['G C'] },
      { kind: 'chorus', lines: ['C G'] },
      { kind: 'bridge', meter: '3/4', lines: ['E A'] },
      { kind: 'chorus', last: true, lines: ['C G'] },
    ],
    melody: 'B4/4 | C5/4 | E5/2 E5/2 | G5/4 | B4/3 | A4/3 | G4/4 | G4/4',
  })
  const meters = (draft: typeof song) => draft.sections.map((section) => section.heading.meter)

  it('runs from the section on, until the next change of time, each full bar the new meter’s', () => {
    const changed = setSectionMeter(song, 1, '2/4')
    expect(meters(changed)).toEqual([undefined, '2/4', '3/4', undefined])
    expect(lengths(changed)).toEqual([96, 96, 48, 48, 72, 72, 96, 96])
    // The chorus's notes past its bars' new end taken, as a bar made shorter takes them.
    expect(shape(changed.melody).slice(0, 4)).toEqual([
      'B4@0/96',
      'C5@96/96',
      'E5@192/48',
      'G5@240/48',
    ])
  })

  it('writes no meter where the section goes back to the song’s, and changes none of another kind', () => {
    const back = setSectionMeter(song, 2, '4/4')
    expect(meters(back)).toEqual([undefined, undefined, undefined, undefined])
    expect(lengths(back).slice(4, 6)).toEqual([96, 96])
    expect(setSectionMeter(song, 2, '3/4')).toBe(song)
    expect(setSectionMeter(song, 2, '6/8')).toBe(song)
  })

  it('at the first section, changes the song’s meter, the sections after the change keeping theirs', () => {
    const changing = draftOf({
      sections: [
        { kind: 'verse', lines: ['G C'] },
        { kind: 'bridge', meter: '3/4', lines: ['E'] },
        { kind: 'chorus', lines: ['C'] },
      ],
    })
    const changed = setSectionMeter(changing, 0, '2/4')
    expect(changed.meter).toBe('2/4')
    expect(meters(changed)).toEqual([undefined, '3/4', '4/4'])
    expect(lengths(changed)).toEqual([48, 48, 72, 96])
  })
})
