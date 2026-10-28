import { describe, expect, it } from 'vitest'
import { note, noteName } from '@/shared/lib/music'
import { BAR } from './time'
import { ROUTINE_PARTS, scaleRoutine } from './routine'

describe('scaleRoutine', () => {
  const routine = scaleRoutine({ root: note('G'), kind: 'major' })
  // Two octaves up and back are 29 8ths: four bars a part.
  const starts = [0, 4, 8, 12, 16].map((bar) => bar * BAR)
  const partOf = (tick: number) => starts.filter((start) => start <= tick).length - 1
  const inPart = (part: number) => routine.notes.filter((n) => partOf(n.startTick) === part)

  it('walks its five parts, each two octaves up and back from a bar of its own', () => {
    expect(ROUTINE_PARTS).toEqual(['rh', 'lh', 'together', 'staccato', 'dynamics'])
    expect(routine.bars).toHaveLength(5 * 4)
    for (const [part, start] of starts.entries())
      expect(inPart(part)[0]?.startTick, `part ${part}`).toBe(start)
  })

  it('plays each hand alone, then both, fingered as the scale is taught', () => {
    expect(new Set(inPart(0).map((n) => n.hand))).toEqual(new Set(['rh']))
    expect(new Set(inPart(1).map((n) => n.hand))).toEqual(new Set(['lh']))
    expect(new Set(inPart(2).map((n) => n.hand))).toEqual(new Set(['rh', 'lh']))
    const rh = inPart(0)
    expect(rh).toHaveLength(29)
    expect(
      rh
        .slice(0, 8)
        .map((n) => noteName(n.spelled))
        .join(' '),
    ).toBe('G A B C D E F# G')
    expect(
      rh
        .slice(0, 15)
        .map((n) => n.finger)
        .join(''),
    ).toBe('123123412312345')
  })

  it('writes staccato on every note of its fourth part, and piano < forte > piano on its last', () => {
    expect(inPart(3).every((n) => n.marks?.articulations?.includes('staccato'))).toBe(true)
    const marked = inPart(4).flatMap((n) =>
      n.marks?.dynamic ? [`${n.marks.dynamic} ${n.marks.hairpin}`] : [],
    )
    expect(marked).toEqual(['p cresc', 'f dim', 'p end'])
  })
})
