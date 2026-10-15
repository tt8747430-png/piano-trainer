import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Intermediate Piano Playing, lesson 6: moving the hand to a new position, and leaps of an octave. */
const keyJumps: Lesson = {
  id: 'key-jumps',
  title: { en: 'Mastering key jumps', ru: 'Скачки по клавиатуре' },
  summary: {
    en: 'Music outgrows one hand position. Move the hand in time, read ahead, and land an octave leap without looking down.',
    ru: 'Музыке тесно в одной позиции. Переносите руку вовремя, читайте наперёд и берите скачок на октаву, не глядя на клавиатуру.',
  },
  sections: [
    {
      heading: { en: 'A new hand position', ru: 'Новая позиция руки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Hand position:', ru: 'Позиция:' },
          text: {
            en: 'five fingers over five neighbouring keys. A shift moves the whole hand to a new one. Here the thumb moves from C to G.',
            ru: 'пять пальцев над пятью соседними клавишами. При переносе вся рука переходит в новую позицию. Здесь первый палец переходит с до на соль.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1 G4 A4 B4 C5 D5/1' },
      ],
    },
    {
      heading: { en: 'Move on the long note', ru: 'Переносите на долгой ноте' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'E4 D4 C4/2 r/2 G4/2 A4 B4 C5/2 G4/1' },
        {
          kind: 'text',
          text: {
            en: 'A rest or a long note is your moment to move. Shift during the rest in bar 2, so G lands right on beat 3.',
            ru: 'Пауза или долгая нота — ваш момент для переноса. Переносите руку во время паузы во втором такте, чтобы соль прозвучало точно на третью долю.',
          },
        },
      ],
    },
    {
      heading: { en: 'Read ahead', ru: 'Читайте наперёд' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'G4 F4 E4 D4 C4/1 A4 B4 C5 D5 E5/1' },
        {
          kind: 'steps',
          steps: [
            {
              en: 'While you play a bar, read the next one.',
              ru: 'Играя такт, читайте следующий.',
            },
            {
              en: 'Find the new thumb note before you move.',
              ru: 'Найдите новую ноту для первого пальца до переноса.',
            },
            {
              en: 'Move the arm, and let the fingers follow.',
              ru: 'Переносите рукой от плеча, а пальцы последуют за ней.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Leaps of an octave', ru: 'Скачки на октаву' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Octave:', ru: 'Октава:' },
          text: {
            en: 'the next key of the same name, eight white keys up counting both. Leap with one finger and feel the distance in your arm.',
            ru: 'ближайшая клавиша с тем же названием, восемь белых клавиш вместе с крайними. Прыгайте одним пальцем и чувствуйте расстояние рукой.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'P8' },
        { kind: 'notes', clef: 'treble', notes: 'C4/2 C5/2 D4/2 D5/2 E4/2 E5/2 C4/1' },
      ],
    },
    {
      heading: { en: 'Measuring with the hand', ru: 'Октава в руке' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'G4 G5 G4 G5 F4 F5 E4 E5 D4 D5 C4 C5 C4/1' },
        {
          kind: 'text',
          text: {
            en: 'Spread the thumb and 5th finger an octave apart and keep that width. Now the leap is only a hand shape moving.',
            ru: 'Раскройте первый и пятый пальцы на октаву и сохраняйте эту ширину. Тогда скачок — просто перенос готовой формы руки.',
          },
        },
      ],
    },
    {
      heading: { en: 'Jumps in the left hand', ru: 'Скачки в левой руке' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Bass lines leap often: low root, then the chord above. Glance at the next bass note early and let the arm carry the hand.',
            ru: 'Басовые линии часто прыгают: низкий бас, затем аккорд выше. Заранее найдите взглядом следующий бас и переносите руку от плеча.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'A2 E3 A3 E3 C3 G3 C4 G3 A2 E3 A3 E3 E2 B2 E3/2',
        },
        {
          kind: 'link',
          title: {
            en: 'The House of the Rising Sun in the Player',
            ru: '«Дом восходящего солнца» в плеере',
          },
          target: { opens: 'piece', piece: 'house-rising-sun' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play C, then leap to the C an octave above.',
            ru: 'Сыграйте до, затем прыгните на до октавой выше.',
          },
          answer: { notes: ['C', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Shift to the G position and play its five notes upwards.',
            ru: 'Перенесите руку в позицию от соль и сыграйте её пять звуков вверх.',
          },
          answer: { notes: ['G', 'A', 'B', 'C', 'D'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the bass line’s first chord, A minor.',
            ru: 'Сыграйте первый аккорд басовой линии, ля минор.',
          },
          answer: { chord: 'Am' },
        },
        {
          kind: 'link',
          title: { en: 'Five-finger positions in the Player', ru: 'Позиции пяти пальцев в плеере' },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('G') },
        },
        {
          kind: 'link',
          title: { en: 'Minuet in G in the Player', ru: 'Менуэт соль мажор в плеере' },
          target: { opens: 'piece', piece: 'minuet-g' },
        },
        {
          kind: 'link',
          title: {
            en: 'The House of the Rising Sun in the Player',
            ru: '«Дом восходящего солнца» в плеере',
          },
          target: { opens: 'piece', piece: 'house-rising-sun' },
        },
      ],
    },
  ],
}

export default keyJumps
