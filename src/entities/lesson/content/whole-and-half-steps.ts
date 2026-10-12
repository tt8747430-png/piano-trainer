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
            en: 'goes from any key to the very next one, black or white.',
            ru: '— шаг от любой клавиши до соседней, чёрной или белой.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Only two pairs of white keys are a half step apart: E–F and B–C. No black key sits between them. Play E–F below.',
            ru: 'Только две пары белых клавиш стоят на полутон друг от друга: ми–фа и си–до. Между ними нет чёрной клавиши. Сыграйте ми–фа ниже.',
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
            en: 'is two half steps, with one key between: C–D, E–F♯. Play C–D below.',
            ru: '— два полутона, через одну клавишу: до–ре, ми–фа♯. Сыграйте до–ре ниже.',
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
            en: 'C♯ and D♭ are the same key. Play both below: they sound the same.',
            ru: 'До-диез и ре-бемоль — одна и та же клавиша. Сыграйте обе ноты ниже: они звучат одинаково.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'The name depends on the letter the music needs. Going up from C, the key is C♯. Coming down from D, it is D♭.',
            ru: 'Имя зависит от того, какая буква нужна музыке. Вверх от до эта клавиша — до-диез. Вниз от ре — ре-бемоль.',
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
          answer: { notes: ['E', 'F#'], rising: true },
        },
        {
          kind: 'quiz',
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
