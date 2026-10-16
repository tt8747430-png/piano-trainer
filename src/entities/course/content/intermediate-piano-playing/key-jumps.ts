import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Intermediate Piano Playing, lesson 6: moving the hand to a new position, and leaps of an octave. */
const keyJumps: Lesson = {
  id: 'key-jumps',
  title: { en: 'Mastering key jumps', ru: 'Скачки по клавиатуре' },
  summary: {
    en: 'Move the hand to a new position in time, and land octave leaps without looking.',
    ru: 'Вовремя переносить руку в новую позицию и брать скачки на октаву не глядя.',
  },
  sections: [
    {
      heading: { en: 'A new hand position', ru: 'Новая позиция руки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A shift:', ru: 'Перенос:' },
          text: {
            en: 'the whole hand moves to five new keys. In this line the thumb starts on C, then moves up to G.',
            ru: 'вся рука переходит на пять новых клавиш. Здесь первый палец начинает с до, а затем переходит на соль.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1 G4 A4 B4 C5 D5/1' },
      ],
    },
    {
      heading: { en: 'Move during a rest', ru: 'Переносите на паузе' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A rest or a long note gives you time to move. Shift during the rest in bar 2, so G sounds right on beat 3.',
            ru: 'Пауза или долгая нота дают время на перенос. Переносите руку на паузе во втором такте, чтобы соль прозвучала точно на третью долю.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 D4 C4/2 r/2 G4/2 A4 B4 C5/2 G4/1' },
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
              en: 'While you play one bar, read the next.',
              ru: 'Играя один такт, читайте следующий.',
            },
            {
              en: 'Find the thumb’s new note before you move.',
              ru: 'Найдите новую ноту первого пальца до переноса.',
            },
            {
              en: 'Move with the arm and let the fingers follow.',
              ru: 'Переносите всей рукой, пальцы последуют за ней.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Octave leaps', ru: 'Скачки на октаву' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Spread the thumb and finger 5 an octave apart and keep that width. A leap is then the same hand shape moving.',
            ru: 'Раскройте первый и пятый пальцы на октаву и сохраняйте эту ширину. Тогда скачок — это перенос готовой формы руки.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4 G5 G4 G5 F4 F5 E4 E5 D4 D5 C4 C5 C4/1' },
      ],
    },
    {
      heading: { en: 'Leaps in the left hand', ru: 'Скачки в левой руке' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Bass lines often leap from a low root up to the chord. Look for the next bass note early, before your hand needs it.',
            ru: 'Бас часто прыгает от низкого основного тона вверх к аккорду. Находите взглядом следующий бас заранее, пока рука ещё занята.',
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
            en: 'Move to the G position and play its five notes going up.',
            ru: 'Перенесите руку в позицию от соль и сыграйте пять звуков вверх.',
          },
          answer: { notes: ['G', 'A', 'B', 'C', 'D'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the chord the bass line starts on, A minor.',
            ru: 'Сыграйте аккорд, с которого начинается басовая линия, ля минор.',
          },
          answer: { chord: 'Am' },
        },
        {
          kind: 'link',
          title: { en: 'Five-finger positions in the Player', ru: 'Позиции пяти пальцев в плеере' },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('G') },
        },
      ],
    },
  ],
}

export default keyJumps
