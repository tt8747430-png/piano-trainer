import { describe, expect, it } from 'vitest'
import type { LessonBlock } from '@/entities/lesson'
import { blockExampleProblem, blockExamples, blockReads, withBlockExample } from './block-examples'

describe('a block’s examples written as text', () => {
  it('reads a row of chords, writes a new one and names the symbol that does not read', () => {
    const block: LessonBlock = { kind: 'chords', symbols: ['C', 'F'] }
    const [chords] = blockExamples(block)
    expect(chords).toMatchObject({ kind: 'chords', text: 'C F' })
    const written = withBlockExample(block, chords!, 'C Qx G7')
    expect(written).toEqual({ kind: 'chords', symbols: ['C', 'Qx', 'G7'] })
    expect(blockExampleProblem(written, chords!)).toBe('Qx')
    expect(blockReads(written)).toBe(false)
    expect(blockReads(block)).toBe(true)
  })

  it('writes a line of notes and its left hand, and a question’s answer', () => {
    const notes: LessonBlock = { kind: 'notes', clef: 'treble', notes: 'C4', bass: 'C3' }
    expect(blockExamples(notes).map((example) => example.kind)).toEqual(['notes', 'bass'])
    const question: LessonBlock = {
      kind: 'question',
      ask: { en: '', ru: '' },
      answer: { chord: 'C' },
    }
    const [answer] = blockExamples(question)
    expect(withBlockExample(question, answer!, 'Am')).toMatchObject({ answer: { chord: 'Am' } })
  })

  it('has none for an example kept as written', () => {
    expect(blockExamples({ kind: 'grid', quality: 'maj' })).toEqual([])
    expect(blockReads({ kind: 'grid', quality: 'maj' })).toBe(true)
  })
})
