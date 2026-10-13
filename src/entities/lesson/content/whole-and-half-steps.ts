import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const wholeAndHalfSteps: Lesson = {
  id: 'whole-and-half-steps',
  title: { en: 'Whole and half steps', ru: 'Тоны и полутоны' },
  summary: {
    en: 'The smallest step on the piano, the step of two, and why one key can have two names.',
    ru: 'Самый маленький шаг на клавиатуре, шаг вдвое больше и почему у одной клавиши бывает два имени.',
  },
  level: 1,
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'The half step', ru: 'Полутон' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A half step', ru: 'Полутон' },
          text: {
            en: 'goes to the very next key, black or white. E–F and B–C are the only white pairs with no black key between.',
            ru: '— шаг к соседней клавише, чёрной или белой. Ми–фа и си–до — единственные белые пары без чёрной клавиши между ними.',
          },
        },
        { kind: 'interval', root: note('E'), interval: 'm2' },
        { kind: 'interval', root: note('B'), interval: 'm2' },
      ],
    },
    {
      heading: { en: 'The whole step', ru: 'Тон' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A whole step', ru: 'Тон' },
          text: {
            en: 'is two half steps, with one key between: C–D, E–F♯.',
            ru: '— два полутона, через одну клавишу: до–ре, ми–фа♯.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'M2' },
      ],
    },
    {
      heading: { en: 'Two names, one key', ru: 'Два имени, одна клавиша' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C♯ and D♭ are one key. Going up from C, call it C♯. Coming down from D, call it D♭.',
            ru: 'До-диез и ре-бемоль — одна клавиша. Вверх от до это до-диез, вниз от ре — ре-бемоль.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C#4/2 D♭4/2' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play E and the note a whole step above it.',
            ru: 'Сыграйте ми и ноту на тон выше.',
          },
          answer: { notes: ['E', 'F#'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play B and the note a half step above it.',
            ru: 'Сыграйте си и ноту на полутон выше.',
          },
          answer: { notes: ['B', 'C'], rising: true },
        },
      ],
    },
  ],
}

export default wholeAndHalfSteps
