import { describe, expect, it } from 'vitest'
import { lessonTexts } from './texts'
import type { Lesson } from './types'

const t = (en: string, ru = `ru ${en}`) => ({ en, ru })

const LESSON: Lesson = {
  id: 'triads',
  title: t('Triads'),
  summary: t('Three notes'),
  sections: [
    {
      heading: t('Stacking thirds'),
      blocks: [
        { kind: 'text', lead: t('Look'), text: t('A triad is three notes.') },
        { kind: 'chords', symbols: ['C', 'F'] },
        { kind: 'steps', steps: [t('Root'), t('Third')] },
      ],
      takeaway: t('Thirds stack'),
    },
    {
      heading: t('Asking'),
      blocks: [
        { kind: 'note', text: t('Mind the fifth'), rule: t('The rule') },
        { kind: 'question', ask: t('Play C'), answer: { chord: 'C' } },
        { kind: 'link', title: t('Open chords'), target: { opens: 'chords', chord: 'C' } },
      ],
    },
  ],
}

describe('a lesson’s words', () => {
  it('lists every text a lesson shows, in its order, each in both languages', () => {
    const texts = lessonTexts(LESSON)
    expect(texts.map((text) => [text.kind, text.section, text.text.en])).toEqual([
      ['title', null, 'Triads'],
      ['summary', null, 'Three notes'],
      ['heading', 0, 'Stacking thirds'],
      ['lead', 0, 'Look'],
      ['text', 0, 'A triad is three notes.'],
      ['step', 0, 'Root'],
      ['step', 0, 'Third'],
      ['takeaway', 0, 'Thirds stack'],
      ['heading', 1, 'Asking'],
      ['note', 1, 'Mind the fifth'],
      ['rule', 1, 'The rule'],
      ['ask', 1, 'Play C'],
      ['linkTitle', 1, 'Open chords'],
    ])
    expect(new Set(texts.map((text) => text.key)).size).toBe(texts.length)
  })
})
