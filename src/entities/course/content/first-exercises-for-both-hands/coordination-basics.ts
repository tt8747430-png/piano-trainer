import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const D_MAJOR = { tonic: note('D'), minor: false }

const coordinationBasics: Lesson = {
  id: 'coordination-basics',
  title: { en: 'Coordination basics', ru: 'Основы координации' },
  summary: {
    en: 'Five-finger patterns with both hands together, the same way and in mirror, then in other keys.',
    ru: 'Упражнения в позиции пяти пальцев двумя руками вместе: в одну сторону и зеркально, затем в других тональностях.',
  },
  sections: [
    {
      heading: { en: 'Same keys, mirrored fingers', ru: 'Те же клавиши, зеркальные пальцы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Parallel motion', ru: 'Параллельное движение' },
          text: {
            en: 'moves both hands the same way, an octave apart. The right hand plays 1 2 3 4 5 while the left plays 5 4 3 2 1.',
            ru: '— обе руки идут в одну сторону на расстоянии октавы. Правая играет 1 2 3 4 5, а левая — 5 4 3 2 1.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 F4 E4 D4 C4/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3 D3 E3 F3 G3 F3 E3 D3 C3/1' },
        {
          kind: 'link',
          title: {
            en: 'The five-finger position in the Player',
            ru: 'Позиция пяти пальцев в плеере',
          },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('C') },
        },
      ],
    },
    {
      heading: { en: 'Same fingers, mirrored keys', ru: 'Те же пальцы, зеркальные клавиши' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Contrary motion', ru: 'Противоположное движение' },
          text: {
            en: 'moves the hands apart and back. Both start on the thumb, so both use the same finger at each moment.',
            ru: '— руки расходятся и сходятся. Обе начинают с большого пальца, поэтому в каждый момент играют одинаковыми пальцами.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 F4 E4 D4 C4/1' },
        { kind: 'notes', clef: 'bass', notes: 'G3 F3 E3 D3 C3 D3 E3 F3 G3/1' },
        {
          kind: 'link',
          title: { en: 'Contrary motion in the Player', ru: 'Противоположное движение в плеере' },
          target: { opens: 'exercise', exercise: 'contrary', root: note('C') },
        },
      ],
    },
    {
      heading: { en: 'Slow and even', ru: 'Медленно и ровно' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Set a slow beat and count aloud.',
              ru: 'Возьмите медленный темп и считайте вслух.',
            },
            {
              en: 'Both hands land exactly together, like one sound.',
              ru: 'Руки попадают строго вместе, как один звук.',
            },
            {
              en: 'Listen for even notes: no finger louder than the rest.',
              ru: 'Слушайте ровность: ни один палец не громче других.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C in both hands together, an octave apart.',
            ru: 'Сыграйте до обеими руками вместе, на расстоянии октавы.',
          },
          answer: { notes: ['C'] },
        },
      ],
    },
    {
      heading: { en: 'Skips in both hands', ru: 'Скачки в обеих руках' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Now a pattern of skips and steps: up a 3rd, back a step. Keep the hands together through the skips.',
            ru: 'Теперь фигура из скачков и шагов: на терцию вверх, на шаг назад. Руки остаются вместе и на скачках.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 E4 D4 F4 E4 G4 F4 D4 C4/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3 E3 D3 F3 E3 G3 F3 D3 C3/1' },
      ],
    },
    {
      heading: { en: 'The G position', ru: 'Позиция соль' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move both hands up to G. The pattern is the same, so the fingers are too.',
            ru: 'Перенесите обе руки к соль. Фигура та же, значит, и пальцы те же.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4 A4 B4 C5 D5 C5 B4 A4 G4/1' },
        { kind: 'notes', clef: 'bass', notes: 'G2 A2 B2 C3 D3 C3 B2 A2 G2/1' },
        {
          kind: 'link',
          title: { en: 'The five-finger position on G', ru: 'Позиция пяти пальцев от соль' },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('G') },
        },
      ],
    },
    {
      heading: { en: 'A black key in the position', ru: 'Чёрная клавиша в позиции' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'D major’s five notes are D, E, F♯, G, A. Finger 3 plays the black key, a little further in.',
            ru: 'Пять звуков ре мажора: ре, ми, фа-диез, соль, ля. Третий палец берёт чёрную клавишу, чуть глубже.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'D4 E4 F#4 G4 A4 G4 F#4 E4 D4/1', key: D_MAJOR },
        { kind: 'notes', clef: 'bass', notes: 'D3 E3 F#3 G3 A3 G3 F#3 E3 D3/1', key: D_MAJOR },
        {
          kind: 'link',
          title: { en: 'The five-finger position on D', ru: 'Позиция пяти пальцев от ре' },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('D') },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the five notes of the G position, up from G.',
            ru: 'Сыграйте пять звуков позиции соль вверх от соль.',
          },
          answer: { notes: ['G', 'A', 'B', 'C', 'D'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the five notes of D major’s position, up from D.',
            ru: 'Сыграйте пять звуков позиции ре мажора вверх от ре.',
          },
          answer: { notes: ['D', 'E', 'F♯', 'G', 'A'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Start contrary motion: play both thumbs, G and C.',
            ru: 'Начало противоположного движения: сыграйте оба больших пальца, соль и до.',
          },
          answer: { notes: ['G', 'C'] },
        },
        {
          kind: 'link',
          title: {
            en: 'The five-finger position in the Player',
            ru: 'Позиция пяти пальцев в плеере',
          },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('C') },
        },
        {
          kind: 'link',
          title: { en: 'Contrary motion in the Player', ru: 'Противоположное движение в плеере' },
          target: { opens: 'exercise', exercise: 'contrary', root: note('C') },
        },
      ],
    },
  ],
}

export default coordinationBasics
