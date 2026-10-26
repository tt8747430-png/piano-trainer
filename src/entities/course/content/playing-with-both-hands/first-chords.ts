import { C_MAJOR } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const firstChords: Lesson = {
  id: 'first-chords',
  title: { en: 'Your first chords', ru: 'Первые аккорды' },
  summary: {
    en: 'Build the C, F and G chords, move between them with little hand movement, and play a tune over them.',
    ru: 'Построить аккорды C, F и G, переходить между ними почти без движения руки и сыграть над ними мелодию.',
  },
  sections: [
    {
      heading: { en: 'What a chord is', ru: 'Что такое аккорд' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A chord', ru: 'Аккорд' },
          text: {
            en: 'is three or more notes played together. To build C, stack two 3rds: C, E, G. Play them with right-hand fingers 1, 3 and 5.',
            ru: '— три звука или больше, взятые вместе. Чтобы построить C, поставьте две терции друг на друга: до, ми, соль. Играйте их правой рукой, пальцами 1, 3 и 5.',
          },
        },
        { kind: 'chords', symbols: ['C'] },
      ],
    },
    {
      heading: { en: 'C, F and G', ru: 'C, F и G' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The root', ru: 'Основной тон' },
          text: {
            en: 'is the note a chord is named after. It sits at the bottom, with the 3rd and the 5th above it. Many songs in C need only these three chords.',
            ru: '— звук, по которому назван аккорд. Он стоит внизу, над ним терция и квинта. Многим песням в до мажоре хватает этих трёх аккордов.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', degrees: '| 1 3 5', hands: '| C4 E4 G4' },
            { symbol: 'F', degrees: '| 1 3 5', hands: '| F4 A4 C5' },
            { symbol: 'G', degrees: '| 1 3 5', hands: '| G4 B4 D5' },
          ],
        },
        {
          kind: 'question',
          ask: { en: 'Play the G chord.', ru: 'Сыграйте аккорд G.' },
          answer: { chord: 'G' },
        },
      ],
    },
    {
      heading: { en: 'Short moves between chords', ru: 'Короткие переходы между аккордами' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An inversion', ru: 'Обращение' },
          text: {
            en: 'puts a different note of the chord at the bottom. Play F as C, F, A and G as B, D, G. The hand barely moves.',
            ru: '— аккорд, в котором внизу стоит не основной тон. Сыграйте F как до, фа, ля, а G как си, ре, соль. Рука почти не двигается.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C3 | C4 E4 G4' },
            { symbol: 'F', hands: 'F3 | C4 F4 A4' },
            { symbol: 'G', hands: 'G3 | B3 D4 G4' },
            { symbol: 'C', hands: 'C3 | C4 E4 G4' },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G as B, D, G, from the bottom up.',
            ru: 'Сыграйте G как си, ре, соль, снизу вверх.',
          },
          answer: { notes: ['B', 'D', 'G'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Chords by number: I, IV, V, I', ru: 'Аккорды по номерам: I, IV, V, I' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Roman numerals', ru: 'Римские цифры' },
          text: {
            en: 'name a chord by the step of the scale its root stands on. In C major, C is I, F is IV and G is V.',
            ru: 'называют аккорд по ступени гаммы, на которой стоит его основной тон. В до мажоре C — это I, F — IV, G — V.',
          },
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
        {
          kind: 'link',
          title: { en: 'I IV V I in the Player', ru: 'I IV V I в плеере' },
          target: { opens: 'player', numerals: 'I IV V I', key: C_MAJOR },
        },
      ],
    },
    {
      heading: { en: 'A tune over chords', ru: 'Мелодия над аккордами' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Now share the work. The left hand plays the chord and the right hand plays the tune: E, D, C over C, G and C.',
            ru: 'Теперь разделите работу. Левая рука берёт аккорд, правая играет мелодию: ми, ре, до над C, G и C.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'C', hands: 'C3 E3 G3 | E4' },
            { symbol: 'G', hands: 'B2 D3 G3 | D4' },
            { symbol: 'C', hands: 'C3 E3 G3 | C4' },
          ],
        },
        {
          kind: 'link',
          title: { en: 'The Saints in the Player', ru: '«Святые» в плеере' },
          target: { opens: 'piece', piece: 'saints' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the IV chord in C.', ru: 'Сыграйте аккорд IV ступени в до мажоре.' },
          answer: { chord: 'F' },
        },
        {
          kind: 'link',
          title: { en: 'Jingle Bells in the Player', ru: '«Бубенцы» в плеере' },
          target: { opens: 'piece', piece: 'jingle-bells' },
        },
        {
          kind: 'link',
          title: { en: 'Build chords in the Quiz', ru: 'Построение аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'build-chord' },
        },
      ],
    },
  ],
}

export default firstChords
