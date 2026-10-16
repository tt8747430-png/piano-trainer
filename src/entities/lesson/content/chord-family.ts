import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const chordFamily: Lesson = {
  id: 'chord-family',
  title: { en: 'The chord family of a key', ru: 'Аккорды тональности' },
  summary: {
    en: 'Name a key’s seven chords by Roman numeral and play them.',
    ru: 'Называйте семь аккордов тональности римскими цифрами и играйте их.',
  },
  sections: [
    {
      heading: { en: 'One scale, seven chords', ru: 'Одна гамма — семь аккордов' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Build a triad on each note of C major from the scale’s notes only. You get three major, three minor and one diminished.',
            ru: 'Постройте трезвучие на каждой ноте до мажора только из нот гаммы. Получатся три мажорных, три минорных и одно уменьшённое.',
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
            en: 'Each chord is named by its degree: upper case for major, lower case for minor, ° for diminished. G major has the same numerals.',
            ru: 'Аккорд называют цифрой его ступени: заглавной — мажорный, строчной — минорный, со знаком ° — уменьшённый. В соль мажоре цифры те же.',
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
            en: 'are I, IV and V. Together they hold every note of the scale, so any melody note fits one of them.',
            ru: '— это I, IV и V. Вместе они содержат все ноты гаммы, поэтому любая нота мелодии ложится хотя бы на один из них.',
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
            en: 'Add one more scale 3rd to each triad: Imaj7, ii7, iii7, IVmaj7, V7, vi7, viiø7. Only V7 is a dominant 7th.',
            ru: 'Добавьте к каждому трезвучию ещё одну терцию из гаммы: Imaj7, ii7, iii7, IVmaj7, V7, vi7, viiø7. Доминантсептаккорд среди них один — V7.',
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
          title: { en: 'A key’s degrees in the Quiz', ru: 'Ступени тональности в тестах' },
          target: { opens: 'quiz', trainer: 'key-degrees' },
        },
        {
          kind: 'link',
          title: { en: 'C major’s chords in Scales', ru: 'Аккорды до мажора в гаммах' },
          target: { opens: 'scales', root: note('C'), scale: 'major', show: 'chords' },
        },
      ],
    },
  ],
}

export default chordFamily
