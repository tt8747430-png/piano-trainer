import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Intermediate Piano Playing, lesson 6: moving the hand to a new position, and leaps of an octave. */
const keyJumps: Lesson = {
  id: 'key-jumps',
  title: { en: 'Mastering key jumps', ru: 'Скачки по клавиатуре' },
  summary: {
    en: 'Shift the hand in time and land octave leaps without looking.',
    ru: 'Вовремя переносить руку и брать скачки на октаву не глядя.',
  },
  sections: [
    {
      heading: { en: 'A new hand position', ru: 'Новая позиция руки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A shift:', ru: 'Перенос:' },
          text: {
            en: 'the whole hand moves to five new keys. Here the thumb moves from C to G.',
            ru: 'вся рука переходит на пять новых клавиш. Здесь первый палец переходит с до на соль.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4/1 G4 A4 B4 C5 D5/1' },
      ],
    },
    {
      heading: { en: 'Move on the rest', ru: 'Переносите на паузе' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A rest or a long note is your moment to move. Shift during the rest in bar 2, so G lands on beat 3.',
            ru: 'Пауза или долгая нота — момент для переноса. Переносите руку на паузе во втором такте, чтобы соль прозвучала точно на третью долю.',
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
            { en: 'While you play a bar, read the next.', ru: 'Играя такт, читайте следующий.' },
            {
              en: 'Find the new thumb note before you move.',
              ru: 'Найдите новую ноту первого пальца до переноса.',
            },
            {
              en: 'Move the arm and let the fingers follow.',
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
            en: 'Spread the thumb and finger 5 an octave apart and keep that width. The leap is then one hand shape moving.',
            ru: 'Раскройте первый и пятый пальцы на октаву и сохраняйте эту ширину. Скачок — это перенос готовой формы руки.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4 G5 G4 G5 F4 F5 E4 E5 D4 D5 C4 C5 C4/1' },
      ],
    },
    {
      heading: { en: 'Jumps in the left hand', ru: 'Скачки в левой руке' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Bass lines leap from a low root to the chord above. Glance at the next bass note early.',
            ru: 'Бас прыгает от низкого основного тона к аккорду выше. Заранее найдите взглядом следующий бас.',
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
            ru: 'Перенесите руку в позицию соль и сыграйте пять звуков вверх.',
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
      ],
    },
  ],
}

export default keyJumps
