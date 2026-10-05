import { describe, expect, it } from 'vitest'
import { note } from '@/shared/lib/music'
import { draftOf, form, shape } from '../testing/test-draft'
import { metersFor, setKey, setMeter, setTempo } from './settings'

describe('the song’s settings', () => {
  const draft = draftOf({
    key: 'C',
    sections: [{ kind: 'verse', lines: ['C G7/B'] }],
    melody: 'E4/4 | D4/4',
    hands: { lh: 'C3/4 | -' },
  })

  it('moves the music to a new tonic by the interval between them, letters kept', () => {
    const moved = setKey(draft, { tonic: note('E', -1), minor: false })
    expect(moved.key).toEqual({ tonic: note('E', -1), minor: false })
    expect(form(moved)).toEqual([[['E♭@0', 'B♭7/D@0']]])
    expect(shape(moved.melody)).toEqual(['G4@0/48', 'F4@48/48'])
    expect(shape(moved.hands.lh)).toEqual(['E♭3@0/48'])
  })

  it('changes only the key for the other mode of the same tonic', () => {
    const minor = setKey(draft, { tonic: note('C'), minor: true })
    expect(minor.key.minor).toBe(true)
    expect(minor.melody).toEqual(draft.melody)
    expect(form(minor)).toEqual(form(draft))
  })

  it('sets the tempo within 40 to 160', () => {
    expect(setTempo(draft, 200).tempo).toBe(160)
    expect(setTempo(draft, 72).tempo).toBe(72)
  })

  it('offers the meters of the same kind: a quarter keeps its length in 2/4, 3/4 and 4/4', () => {
    expect(metersFor('4/4')).toEqual(['2/4', '3/4', '4/4'])
    expect(metersFor('6/8')).toEqual(['6/8', '12/8'])
  })

  it('makes each full bar the new meter’s, its notes and chords past the new end taken', () => {
    const three = setMeter(draft, '3/4')
    expect(three.meter).toBe('3/4')
    expect(three.sections[0]?.lines[0]?.map((bar) => bar.ticks)).toEqual([36, 36])
    expect(shape(three.melody)).toEqual(['E4@0/36', 'D4@36/36'])
    expect(form(three)).toEqual([[['C@0', 'G7/B@0']]])
  })

  it('lengthens each full bar to a longer meter, its last chord held on', () => {
    const two = setMeter(setMeter(draft, '2/4'), '4/4')
    expect(two.sections[0]?.lines[0]?.map((bar) => bar.ticks)).toEqual([48, 48])
    expect(shape(two.melody)).toEqual(['E4@0/24', 'D4@48/24'])
  })

  it('keeps a pickup bar shorter than the meter’s as it is, and changes nothing across kinds', () => {
    const pickup = draftOf({ sections: [{ kind: 'verse', lines: ['G@1 C'] }] })
    const before = pickup.sections[0]?.lines[0]?.[0]?.ticks
    expect(setMeter(pickup, '3/4').sections[0]?.lines[0]?.[0]?.ticks).toBe(before)
    expect(setMeter(draft, '6/8')).toBe(draft)
  })
})
