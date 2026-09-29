import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const wholeAndHalfSteps: Lesson = {
  id: 'whole-and-half-steps',
  title: { en: 'Whole and half steps', ru: 'Тоны и полутоны' },
  summary: {
    en: 'The smallest step on the piano, two of them together, and the names two notes can share.',
    ru: 'Самый маленький шаг на клавиатуре, два таких шага и одна клавиша с двумя именами.',
  },
  level: 1,
  category: 'theory',
  module: 'fundamentals',
  sections: [
    {
      heading: { en: 'The half step', ru: 'Полутон' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A half step', ru: 'Полутон' },
          text: {
            en: 'goes from any key to the very next one, black or white. Between white keys there are just two: E–F and B–C, where no black key sits between.',
            ru: '— от любой клавиши до соседней, чёрной или белой. Между белыми клавишами полутонов всего два: ми–фа и си–до, где между ними нет чёрной клавиши.',
          },
        },
        { kind: 'interval', root: note('E'), interval: 'm2' },
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
            en: 'C♯ and D♭ are the same key. Which name it takes depends on the letter the music needs: going up from C it is C♯, coming down from D it is D♭.',
            ru: 'До-диез и ре-бемоль — одна и та же клавиша. Какое имя она получает, зависит от нужной музыке буквы: при движении вверх от до это до-диез, вниз от ре — ре-бемоль.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C#4/2 D♭4/2' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'quiz',
          ask: {
            en: 'Play E and the note a whole step above it.',
            ru: 'Сыграйте ми и ноту на тон выше.',
          },
          answer: { notes: ['E', 'F#'] },
        },
        {
          kind: 'quiz',
          ask: {
            en: 'Play B and the note a half step above it.',
            ru: 'Сыграйте си и ноту на полутон выше.',
          },
          answer: { notes: ['B', 'C'] },
        },
      ],
    },
  ],
}

export default wholeAndHalfSteps
