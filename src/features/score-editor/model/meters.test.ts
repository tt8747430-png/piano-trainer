import { describe, expect, it } from 'vitest'
import { TICKS_PER_BEAT } from '@/shared/lib/music'
import { draftOf, form, lengths, shape, staffNotes } from '../testing/test-draft'
import { meterBar, sameKind, setMeter, setSectionMeter, setTime } from './meters'

const B = TICKS_PER_BEAT

describe('the song’s meter', () => {
  const draft = draftOf({
    key: 'C',
    sections: [{ kind: 'verse', lines: ['C G7/B'] }],
    staves: [{ notes: 'E4/4 | D4/4' }],
    hands: { lh: 'C3/4 | r/4' },
  })

  it('tells the meters counted alike: a quarter’s beat, or a dotted quarter’s (ADR 0114)', () => {
    expect(
      ['2/2', '3/4', '5/4', '7/8', '3/2'].every((meter) => sameKind(meter as '4/4', '4/4')),
    ).toBe(true)
    expect(['3/8', '6/8', '9/8', '12/8'].some((meter) => sameKind(meter as '4/4', '4/4'))).toBe(
      false,
    )
  })

  it('offers any meter at the song’s head, one counted in the other beat only where its notes fit it', () => {
    expect(meterBar(draft, 0, '6/8')).toBeNull()
    expect(meterBar(draft, 0, '5/4')).toBeNull()
    const triplets = draftOf({
      sections: [{ kind: 'verse', lines: ['C'] }],
      staves: [{ notes: 'C4/1:3 D4/1:3 E4/1:3 F4/3' }],
    })
    expect(meterBar(triplets, 0, '6/8')).toBe('between')
    const two = draftOf({
      sections: [
        { kind: 'verse', lines: ['C'] },
        { kind: 'chorus', lines: ['G'] },
      ],
    })
    expect(meterBar(two, 1, '6/8')).toBe('otherKind')
    expect(meterBar(two, 1, '7/4')).toBeNull()
  })

  it('makes 2/2 of 4/4 as it is: four quarters a bar, every note where it was', () => {
    const cut = setMeter(draft, '2/2')
    expect(cut.meter).toBe('2/2')
    expect(cut.sections[0]?.lines[0]?.map((bar) => bar.ticks)).toEqual([4 * B, 4 * B])
    expect(shape(staffNotes(cut))).toEqual(shape(staffNotes(draft)))
  })

  it('counts the other beat with every note kept its length and the tempo its speed: 3/4 to 3/8', () => {
    const waltz = setMeter(draft, '3/4')
    const eighths = setMeter(waltz, '3/8')
    expect(eighths.meter).toBe('3/8')
    // A bar of 3/4 (72 ticks) is 48 in 3/8's ticks, then cut to 3/8's 24, as a shorter meter cuts.
    expect(eighths.sections[0]?.lines[0]?.map((bar) => bar.ticks)).toEqual([B, B])
    expect(shape(staffNotes(eighths))).toEqual(['E4@0/1', 'D4@1/1'])
    expect(eighths.tempo).toBe(waltz.tempo * (2 / 3))
    // Its mark as printed: the quarter it counted, ♩ = 90 still.
    expect(eighths.tempoUnit).toBe('4')
    // And back: the bar 3/4's again, the notes as long as they were.
    const back = setMeter(setMeter(draft, '12/8'), '4/4')
    expect(shape(staffNotes(back))).toEqual(shape(staffNotes(draft)))
  })

  it('makes each full bar the new meter’s, its notes and chords past the new end taken', () => {
    const three = setMeter(draft, '3/4')
    expect(three.meter).toBe('3/4')
    expect(three.sections[0]?.lines[0]?.map((bar) => bar.ticks)).toEqual([3 * B, 3 * B])
    expect(shape(staffNotes(three))).toEqual(['E4@0/3', 'D4@3/3'])
    expect(form(three)).toEqual([[['C@0', 'G7/B@0']]])
  })

  it('lengthens each full bar to a longer meter, its last chord held on', () => {
    const two = setMeter(setMeter(draft, '2/4'), '4/4')
    expect(two.sections[0]?.lines[0]?.map((bar) => bar.ticks)).toEqual([4 * B, 4 * B])
    expect(shape(staffNotes(two))).toEqual(['E4@0/2', 'D4@4/2'])
  })

  it('keeps a pickup one, cut from its start, so the beats leading into the downbeat stay', () => {
    const pickup = draftOf({
      sections: [{ kind: 'verse', lines: ['G@3 C'] }],
      staves: [{ notes: 'C4/1 D4/1 E4/1 | F4/4' }],
    })
    const two = setMeter(pickup, '2/4')
    expect(two.sections[0]?.lines[0]?.[0]?.ticks).toBe(B)
    expect(shape(staffNotes(two))[0]).toBe('E4@0/1')
    const three = setMeter(pickup, '3/4')
    expect(three.sections[0]?.lines[0]?.[0]?.ticks).toBe(2 * B)
    expect(shape(staffNotes(three)).slice(0, 2)).toEqual(['D4@0/1', 'E4@1/1'])
  })

  it('keeps a pickup bar shorter than the meter’s as it is', () => {
    const pickup = draftOf({ sections: [{ kind: 'verse', lines: ['G@1 C'] }] })
    const before = pickup.sections[0]?.lines[0]?.[0]?.ticks
    expect(setMeter(pickup, '3/4').sections[0]?.lines[0]?.[0]?.ticks).toBe(before)
  })

  it('counts the whole song in the new meter, a section’s own given up (ADR 0097)', () => {
    const changing = draftOf({
      sections: [
        { kind: 'verse', lines: ['G C'] },
        { kind: 'bridge', meter: '3/4', lines: ['E A'] },
      ],
    })
    const two = setMeter(changing, '2/4')
    expect(two.meter).toBe('2/4')
    expect(two.sections.map((section) => section.heading.meter)).toEqual([undefined, undefined])
    expect(lengths(two)).toEqual([2, 2, 2, 2])
    // In its own meter already, the song gives up the bridge's alone.
    const whole = setMeter(changing, '4/4')
    expect(whole.sections.map((section) => section.heading.meter)).toEqual([undefined, undefined])
    expect(lengths(whole)).toEqual([4, 4, 4, 4])
  })
})

describe('a change of time at a section (ADR 0097)', () => {
  const song = draftOf({
    sections: [
      { kind: 'verse', n: 1, lines: ['G C'] },
      { kind: 'chorus', lines: ['C G'] },
      { kind: 'bridge', meter: '3/4', lines: ['E A'] },
      { kind: 'chorus', last: true, lines: ['C G'] },
    ],
    staves: [{ notes: 'B4/4 | C5/4 | E5/2 E5/2 | G5/4 | B4/3 | A4/3 | G4/4 | G4/4' }],
  })
  const meters = (draft: typeof song) => draft.sections.map((section) => section.heading.meter)

  it('runs from the section on, until the next change of time, each full bar the new meter’s', () => {
    const changed = setSectionMeter(song, 1, '2/4')
    expect(meters(changed)).toEqual([undefined, '2/4', '3/4', undefined])
    expect(lengths(changed)).toEqual([4, 4, 2, 2, 3, 3, 4, 4])
    // The chorus's notes past its bars' new end taken, as a bar made shorter takes them.
    expect(shape(staffNotes(changed)).slice(0, 4)).toEqual([
      'B4@0/4',
      'C5@4/4',
      'E5@8/2',
      'G5@10/2',
    ])
  })

  it('writes no meter where the section goes back to the song’s, and changes none of another kind', () => {
    const back = setSectionMeter(song, 2, '4/4')
    expect(meters(back)).toEqual([undefined, undefined, undefined, undefined])
    expect(lengths(back).slice(4, 6)).toEqual([4, 4])
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
    expect(lengths(changed)).toEqual([2, 2, 3, 4])
  })
})

describe('setTime, the time signature’s picker applied (ADR 0114)', () => {
  const song = draftOf({
    sections: [
      { kind: 'verse', lines: ['C G'] },
      { kind: 'chorus', lines: ['F C'] },
    ],
    staves: [{ notes: 'C4/1 D4/1 E4/1 F4/1 | G4/4 | A4/4 | B4/4' }],
  })

  it('changes the whole song’s meter at its first section, its pickup and its C with it, in one go', () => {
    const changed = setTime(song, 0, { meter: '4/4', timeSymbol: true, pickup: B })
    expect(changed.timeSymbol).toBe(true)
    expect(lengths(changed)).toEqual([1, 4, 4, 4])
    const plain = setTime(changed, 0, { meter: '3/4', timeSymbol: false, pickup: 2 * B })
    expect(plain).not.toHaveProperty('timeSymbol')
    expect(plain.meter).toBe('3/4')
    expect(lengths(plain)).toEqual([2, 3, 3, 3])
  })

  it('changes a later section’s meter from it on, no pickup there, the song’s C kept as it was', () => {
    const common = setTime(song, 0, { meter: '4/4', timeSymbol: true })
    const chorus = setTime(common, 1, { meter: '2/4' })
    expect(chorus.meter).toBe('4/4')
    expect(chorus.timeSymbol).toBe(true)
    expect(chorus.sections[1]?.heading.meter).toBe('2/4')
    expect(lengths(chorus)).toEqual([4, 4, 2, 2])
  })

  it('leaves what is as it is: the same meter writes no section a meter of its own', () => {
    const chorus = setSectionMeter(song, 1, '2/4')
    expect(setTime(chorus, 0, { meter: '4/4' })).toBe(chorus)
  })
})
