import { describe, expect, it } from 'vitest'
import { midi } from '@/shared/lib/music'
import { diagramMarksParam, markKey, readDiagramMarks } from './diagram-marks'

describe('teaching diagrams in a URL', () => {
  it('reads each mark, its key, colour and finger, and writes it back the same', () => {
    const marks = readDiagramMarks('60a3,64a,67b5')
    expect([...marks]).toEqual([
      [60, { colour: 'a', finger: 3 }],
      [64, { colour: 'a' }],
      [67, { colour: 'b', finger: 5 }],
    ])
    expect(diagramMarksParam(marks)).toBe('60a3,64a,67b5')
  })

  it('writes the marks lowest key first', () => {
    expect(diagramMarksParam(readDiagramMarks('67b,60a'))).toBe('60a,67b')
  })

  it('reads only marks on the piano, a key’s last mark standing, and leaves out the rest', () => {
    expect(diagramMarksParam(readDiagramMarks('20a,60z,x,,60a1,60b2,109a'))).toBe('60b2')
    expect(readDiagramMarks('').size).toBe(0)
  })
})

describe('markKey', () => {
  const RH_1 = { colour: 'a', finger: 1 } as const
  it('marks a key, clears it with the same mark, and gives it another mark', () => {
    const once = markKey(new Map(), midi(60), RH_1)
    expect(diagramMarksParam(once)).toBe('60a1')
    expect(markKey(once, midi(60), RH_1).size).toBe(0)
    expect(diagramMarksParam(markKey(once, midi(60), { colour: 'b' }))).toBe('60b')
    expect(diagramMarksParam(markKey(once, midi(60), { colour: 'a', finger: 2 }))).toBe('60a2')
  })
})
