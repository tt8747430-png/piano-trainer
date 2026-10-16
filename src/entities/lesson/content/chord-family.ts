import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const chordFamily: Lesson = {
  id: 'chord-family',
  title: { en: 'The chord family of a key', ru: 'Аккорды тональности' },
  summary: {
    en: 'Build the seven chords of a major key, name them with Roman numerals, and play them.',
    ru: 'Постройте семь аккордов мажорной тональности, назовите их римскими цифрами и сыграйте.',
  },
  sections: [
    {
      heading: { en: 'One scale, seven chords', ru: 'Одна гамма — семь аккордов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Stack a triad on each note of C major, using only white keys: skip a key, take a key. You get three major chords, three minor and one diminished.',
            ru: 'Постройте трезвучие на каждой ноте до мажора только на белых клавишах: через одну. Получатся три мажорных аккорда, три минорных и один уменьшённый.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'B°'], apart: true },
      ],
    },
    {
      heading: { en: 'Roman numerals', ru: 'Римские цифры' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A numeral names a chord by the scale note it stands on. Upper case is major (I), lower case minor (ii), ° diminished (vii°). G major follows the same pattern.',
            ru: 'Цифра называет аккорд по ступени, на которой он стоит. Заглавная — мажорный (I), строчная — минорный (ii), знак ° — уменьшённый (vii°). В соль мажоре порядок тот же.',
          },
        },
        { kind: 'chords', symbols: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#°'], apart: true },
      ],
    },
    {
      heading: { en: 'Three main chords: I, IV, V', ru: 'Главные трезвучия: I, IV, V' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The primary chords', ru: 'Главные трезвучия' },
          text: {
            en: 'are I, IV and V. Between them they hold all seven notes of the scale. So every melody note in the key belongs to at least one of them.',
            ru: '— это I, IV и V. Вместе в них все семь нот гаммы. Поэтому любая нота мелодии в тональности входит хотя бы в один из них.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'] },
      ],
    },
    {
      heading: { en: 'The key’s 7th chords', ru: 'Септаккорды тональности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Stack one more scale note on top of each triad, again skipping a key. You get Imaj7, ii7, iii7, IVmaj7, V7, vi7 and viiø7. Only V7 is a dominant 7th.',
            ru: 'Добавьте наверх каждого трезвучия ещё одну ноту гаммы, снова через клавишу. Получатся Imaj7, ii7, iii7, IVmaj7, V7, vi7 и viiø7. Доминантсептаккорд среди них один: V7.',
          },
        },
        {
          kind: 'chords',
          symbols: ['CMaj7', 'Dm7', 'Em7', 'FMaj7', 'G7', 'Am7', 'Bm7♭5'],
          apart: true,
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the V chord of G major.', ru: 'Сыграйте аккорд V ступени соль мажора.' },
          answer: { chord: 'D' },
        },
        {
          kind: 'question',
          ask: { en: 'Play the ii chord of F major.', ru: 'Сыграйте аккорд ii ступени фа мажора.' },
          answer: { chord: 'Gm' },
        },
        {
          kind: 'link',
          title: { en: 'Practise a key’s degrees in the Quiz', ru: 'Ступени тональности в тестах' },
          target: { opens: 'quiz', trainer: 'key-degrees' },
        },
        {
          kind: 'link',
          title: { en: 'See C major’s chords in Scales', ru: 'Аккорды до мажора в гаммах' },
          target: { opens: 'scales', root: note('C'), scale: 'major', show: 'chords' },
        },
      ],
    },
  ],
}

export default chordFamily
