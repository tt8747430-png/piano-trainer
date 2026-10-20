import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const D_MAJOR = { tonic: note('D'), minor: false }

const coordinationBasics: Lesson = {
  id: 'coordination-basics',
  title: { en: 'Coordination basics', ru: 'Основы координации' },
  summary: {
    en: 'Play the five-finger position with both hands, the same way and in mirror, on C, G and D.',
    ru: 'Играть позицию пяти пальцев двумя руками, в одну сторону и зеркально, от до, соль и ре.',
  },
  sections: [
    {
      heading: { en: 'Same keys, mirrored fingers', ru: 'Те же клавиши, зеркальные пальцы' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Parallel motion', ru: 'Параллельное движение' },
          text: {
            en: 'means both hands move the same way, an octave apart. Same notes, mirrored fingers: the right plays 1 2 3 4 5 while the left plays 5 4 3 2 1.',
            ru: '— обе руки идут в одну сторону на октаву друг от друга. Ноты одинаковые, а пальцы зеркальные: правая играет 1 2 3 4 5, левая — 5 4 3 2 1.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4 D4 E4 F4 G4 F4 E4 D4 C4/1',
          bass: 'C3 D3 E3 F3 G3 F3 E3 D3 C3/1',
        },
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
            en: 'means the hands move apart and back again. Both start on the thumb, so both hands use the same finger at every moment.',
            ru: '— руки расходятся и снова сходятся. Обе начинают с большого пальца, поэтому в каждый момент играют одинаковыми пальцами.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4 D4 E4 F4 G4 F4 E4 D4 C4/1',
          bass: 'G3 F3 E3 D3 C3 D3 E3 F3 G3/1',
        },
        {
          kind: 'link',
          title: { en: 'Contrary motion in the Player', ru: 'Противоположное движение в плеере' },
          target: { opens: 'exercise', exercise: 'contrary', root: note('C') },
        },
      ],
    },
    {
      heading: { en: 'Skips in both hands', ru: 'Скачки в обеих руках' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Now go up a 3rd, then back a step. Keep the hands exactly together, even on the skips.',
            ru: 'Теперь шаг на терцию вверх, затем на ступень назад. Руки идут строго вместе, даже на скачках.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4 E4 D4 F4 E4 G4 F4 D4 C4/1',
          bass: 'C3 E3 D3 F3 E3 G3 F3 D3 C3/1',
        },
      ],
    },
    {
      heading: { en: 'Moving to G', ru: 'Позиция соль' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move both hands up to G. The pattern is the same, so the fingers are the same too.',
            ru: 'Перенесите обе руки к соль. Фигура та же, значит, и пальцы те же.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'G4 A4 B4 C5 D5 C5 B4 A4 G4/1',
          bass: 'G2 A2 B2 C3 D3 C3 B2 A2 G2/1',
        },
        {
          kind: 'link',
          title: { en: 'The five-finger position on G', ru: 'Позиция пяти пальцев от соль' },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('G') },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the five notes of the G position, up from G.',
            ru: 'Сыграйте пять звуков позиции соль вверх от соль.',
          },
          answer: { notes: ['G', 'A', 'B', 'C', 'D'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'A black key in the position', ru: 'Чёрная клавиша в позиции' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In D major the five notes are D, E, F♯, G, A. Finger 3 plays the black key, so reach a little further in.',
            ru: 'В ре мажоре пять звуков: ре, ми, фа-диез, соль, ля. Третий палец берёт чёрную клавишу, поэтому ставьте его чуть глубже.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'D4 E4 F#4 G4 A4 G4 F#4 E4 D4/1',
          bass: 'D3 E3 F#3 G3 A3 G3 F#3 E3 D3/1',
          key: D_MAJOR,
        },
        {
          kind: 'link',
          title: { en: 'The five-finger position on D', ru: 'Позиция пяти пальцев от ре' },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('D') },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the five notes of the D major position, up from D.',
            ru: 'Сыграйте пять звуков позиции ре мажора вверх от ре.',
          },
          answer: { notes: ['D', 'E', 'F♯', 'G', 'A'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Pick a slow beat and count aloud.',
              ru: 'Возьмите медленный темп и считайте вслух.',
            },
            {
              en: 'Land both hands exactly together.',
              ru: 'Попадайте обеими руками строго вместе.',
            },
            {
              en: 'Keep every finger equally loud.',
              ru: 'Следите, чтобы ни один палец не звучал громче других.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the two starting thumb notes of contrary motion, G and C.',
            ru: 'Сыграйте две начальные ноты больших пальцев в противоположном движении: соль и до.',
          },
          answer: { notes: ['G', 'C'] },
        },
      ],
    },
  ],
}

export default coordinationBasics
