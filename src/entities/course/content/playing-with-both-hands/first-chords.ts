import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }

const firstChords: Lesson = {
  id: 'first-chords',
  title: { en: 'Playing chords', ru: 'Играем аккорды' },
  summary: {
    en: 'Play the C, F and G chords and a tune over them.',
    ru: 'Играть аккорды C, F и G и мелодию над ними.',
  },
  sections: [
    {
      heading: { en: 'A chord', ru: 'Аккорд' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A chord', ru: 'Аккорд' },
          text: {
            en: 'is three or more notes played together. Stack two 3rds on C: C, E, G, fingers 1, 3 and 5.',
            ru: '— три и более звука вместе. Поставьте две терции на до: до, ми, соль, пальцы 1, 3 и 5.',
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
            en: 'names the chord and sits at its bottom, the 3rd and 5th above. C, F and G carry most songs in C.',
            ru: 'даёт аккорду имя и стоит внизу, над ним терция и квинта. На C, F и G держится большинство песен в до мажоре.',
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
      ],
    },
    {
      heading: { en: 'Close moves', ru: 'Близкие соединения' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An inversion', ru: 'Обращение' },
          text: {
            en: 'puts another chord note at the bottom. Play F as C F A and G as B D G: the hand barely moves.',
            ru: '— аккорд, где внизу не основной тон. Сыграйте F как до-фа-ля, G как си-ре-соль: рука почти не двигается.',
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
      ],
    },
    {
      heading: { en: 'I, IV, V, I', ru: 'I, IV, V, I' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Roman numerals', ru: 'Римские цифры' },
          text: {
            en: 'name a chord by the scale step of its root. In C, C is I, F is IV and G is V.',
            ru: 'называют аккорд по ступени его основного тона. В до мажоре C — I, F — IV, G — V.',
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
            en: 'The left hand takes the chord, the right plays the tune: E, D, C over C, G and C.',
            ru: 'Левая рука берёт аккорд, правая играет мелодию: ми, ре, до над C, G и C.',
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
          ask: { en: 'Play the G chord.', ru: 'Сыграйте аккорд G.' },
          answer: { chord: 'G' },
        },
        {
          kind: 'question',
          ask: { en: 'Play the IV chord in C.', ru: 'Сыграйте аккорд IV ступени в до мажоре.' },
          answer: { chord: 'F' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G as B, D, G, from the bottom up.',
            ru: 'Сыграйте G как си, ре, соль, снизу вверх.',
          },
          answer: { notes: ['B', 'D', 'G'], rising: true },
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
