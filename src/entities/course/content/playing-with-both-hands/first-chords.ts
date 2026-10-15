import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const C_MAJOR = { tonic: note('C'), minor: false }

const firstChords: Lesson = {
  id: 'first-chords',
  title: { en: 'Playing chords', ru: 'Играем аккорды' },
  summary: {
    en: 'The C, F and G chords in the right hand, each root in the left, moved close together, and a tune over them.',
    ru: 'Аккорды C, F и G в правой руке, их основные тоны в левой, близкие соединения и мелодия над ними.',
  },
  sections: [
    {
      heading: { en: 'Three notes together', ru: 'Три ноты вместе' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A chord', ru: 'Аккорд' },
          text: {
            en: 'is three or more notes played together. Stack two 3rds on C and you get C, E, G: the C chord.',
            ru: '— три и более звука, взятые вместе. Поставьте две терции на до, и получится до, ми, соль — аккорд C.',
          },
        },
        { kind: 'chords', symbols: ['C'] },
        {
          kind: 'question',
          ask: {
            en: 'Play C, E and G together with fingers 1, 3 and 5.',
            ru: 'Сыграйте вместе до, ми и соль пальцами 1, 3 и 5.',
          },
          answer: { chord: 'C' },
        },
      ],
    },
    {
      heading: { en: 'Root, 3rd and 5th', ru: 'Основной тон, терция, квинта' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The root', ru: 'Основной тон' },
          text: {
            en: 'names the chord and sits at its bottom. Above it come the 3rd and the 5th.',
            ru: 'даёт аккорду имя и стоит внизу. Над ним — терция и квинта.',
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
      heading: { en: 'C, F and G', ru: 'C, F и G' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Three chords carry most songs in C: C, F and G. Build each the same way, a root and two skips up.',
            ru: 'Большинство песен в до мажоре держится на трёх аккордах: C, F и G. Каждый строится одинаково: основной тон и два скачка вверх.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'], apart: true },
        {
          kind: 'question',
          ask: { en: 'Play the F chord: F, A, C.', ru: 'Сыграйте аккорд F: фа, ля, до.' },
          answer: { chord: 'F' },
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
            en: 'puts another chord note at the bottom. Play F as C F A, G as B D G: the hand barely moves.',
            ru: '— аккорд, в котором внизу стоит не основной тон. Сыграйте F как до-фа-ля, а G как си-ре-соль, и рука почти не двигается.',
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
          kind: 'note',
          text: {
            en: 'The left hand plays the roots, fingers 5, 2 and 1.',
            ru: 'Левая рука играет основные тоны пальцами 5, 2 и 1.',
          },
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
            en: 'name a chord by the scale step its root stands on. In C, C is I, F is IV and G is V.',
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
            en: 'Now the left hand takes the chord and the right plays the tune. Here E, D, C sit over C, G and C.',
            ru: 'Теперь левая рука берёт аккорд, а правая играет мелодию. Здесь ми, ре, до звучат над C, G и C.',
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
          ask: { en: 'Play the G chord: G, B, D.', ru: 'Сыграйте аккорд G: соль, си, ре.' },
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
            en: 'Play G as B, D, G, close to C.',
            ru: 'Сыграйте G как си, ре, соль — рядом с C.',
          },
          answer: { notes: ['B', 'D', 'G'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'I IV V I in the Player', ru: 'I IV V I в плеере' },
          target: { opens: 'player', numerals: 'I IV V I', key: C_MAJOR },
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
