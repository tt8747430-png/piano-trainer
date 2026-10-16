import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const D_MAJOR = { tonic: note('D'), minor: false }
const F_MAJOR = { tonic: note('F'), minor: false }
const G_MAJOR = { tonic: note('G'), minor: false }

const transposition: Lesson = {
  id: 'transposition',
  title: { en: 'Transposition', ru: 'Транспонирование' },
  summary: {
    en: 'Move a tune and its chords into any key.',
    ru: 'Переносить мелодию и её аккорды в любую тональность.',
  },
  sections: [
    {
      heading: { en: 'Same tune, new key', ru: 'Та же мелодия, новая тональность' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Transposing', ru: 'Транспонировать' },
          text: {
            en: 'moves every note by the same interval into another key. Below, a tune in C, then up a 5th in G.',
            ru: '— переносить каждую ноту на один и тот же интервал, в другую тональность. Ниже мелодия в до мажоре, затем на квинту выше, в соль мажоре.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 E4 G4 E4 F4 D4 C4/2' },
        { kind: 'notes', clef: 'treble', key: G_MAJOR, notes: 'G4 B4 D5 B4 C5 A4 G4/2' },
      ],
    },
    {
      heading: { en: 'By degrees', ru: 'По ступеням' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Easier still, read the tune as degrees: 1 3 5 3 4 2 1. Then play those degrees in the new key.',
            ru: 'Ещё проще читать мелодию ступенями: 1 3 5 3 4 2 1. Затем сыграйте те же ступени в новой тональности.',
          },
        },
        { kind: 'notes', clef: 'treble', key: F_MAJOR, notes: 'F4 A4 C5 A4 B♭4 G4 F4/2' },
        {
          kind: 'note',
          text: {
            en: 'In F the 4th degree is B♭.',
            ru: 'В фа мажоре четвёртая ступень — си-бемоль.',
          },
        },
      ],
    },
    {
      heading: { en: 'The chords move too', ru: 'Аккорды тоже переносятся' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Numerals stay the same in every key. I–IV–V–I is C F G C in C major, D G A D in D major.',
            ru: 'Римские цифры в любой тональности одни. I–IV–V–I в до мажоре — это C F G C, в ре мажоре — D G A D.',
          },
        },
        { kind: 'progression', numerals: 'I IV V I', key: C_MAJOR },
        { kind: 'progression', numerals: 'I IV V I', key: D_MAJOR },
      ],
    },
    {
      heading: { en: 'Chord symbols, letter by letter', ru: 'Аккорды, буква за буквой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move each root by the interval and keep its quality. Up a 5th, C Am F G becomes G Em C D.',
            ru: 'Перенесите каждый основной тон на интервал и сохраните вид аккорда. На квинту выше C Am F G становится G Em C D.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Am', 'F', 'G'] },
        { kind: 'chords', symbols: ['G', 'Em', 'C', 'D'] },
        {
          kind: 'link',
          title: { en: 'Read G Em C D in its key', ru: 'Прочитать G Em C D в его тональности' },
          target: { opens: 'song-chords', chords: 'G Em C D' },
        },
      ],
    },
    {
      heading: { en: 'For a singer', ru: 'Под голос' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'If a tune climbs too high for a voice, move it down. Here a line in D comes down a whole step to C.',
            ru: 'Если мелодия слишком высока для голоса, опустите её. Здесь фраза из ре мажора опускается на тон, в до мажор.',
          },
        },
        { kind: 'notes', clef: 'treble', key: D_MAJOR, notes: 'A4 D5 F♯5 E5 D5/1' },
        { kind: 'notes', clef: 'treble', notes: 'G4 C5 E5 D5 C5/1' },
      ],
    },
    {
      heading: { en: 'Through every key', ru: 'Через все тональности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Practise a progression in every key, a 5th lower each time, round the circle home.',
            ru: 'Играйте последовательность во всех тональностях, каждый раз на квинту ниже, по кругу домой.',
          },
        },
        { kind: 'progression', numerals: 'I IV V I', key: F_MAJOR },
        {
          kind: 'link',
          title: { en: 'I–IV–V–I through the keys', ru: 'I–IV–V–I по всем тональностям' },
          target: { opens: 'player', numerals: 'I IV V I', key: C_MAJOR, walk: 'fifths' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Move C–E–G up a whole step and play it.',
            ru: 'Перенесите до–ми–соль на тон вверх и сыграйте.',
          },
          answer: { notes: ['D', 'F♯', 'A'], rising: true },
        },
        {
          kind: 'question',
          ask: { en: 'Play IV in D major.', ru: 'Сыграйте IV в ре мажоре.' },
          answer: { chord: 'G' },
        },
        {
          kind: 'question',
          ask: { en: 'Play V in B♭ major.', ru: 'Сыграйте V в си-бемоль мажоре.' },
          answer: { chord: 'F' },
        },
        {
          kind: 'link',
          title: { en: 'Degrees of a key in the Quiz', ru: 'Ступени тональности в тестах' },
          target: { opens: 'quiz', trainer: 'key-degrees' },
        },
      ],
    },
  ],
}

export default transposition
