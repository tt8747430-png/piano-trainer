import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const seventhChords: Lesson = {
  id: 'seventh-chords',
  title: { en: 'Seventh chords', ru: 'Септаккорды' },
  summary: {
    en: 'Build the five common 7th chords on any root, and hear how the dominant 7th leads home.',
    ru: 'Строить пять основных септаккордов от любой ноты и слышать, как доминантсептаккорд ведёт к тонике.',
  },
  sections: [
    {
      heading: { en: 'A triad and a 7th', ru: 'Трезвучие и септима' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A seventh chord', ru: 'Септаккорд' },
          text: {
            en: 'is a triad with one more 3rd on top. That new note is the 7th. Five kinds cover most music.',
            ru: '— это трезвучие и ещё одна терция сверху. Новый звук — септима. Пять видов покрывают бо́льшую часть музыки.',
          },
        },
        { kind: 'chords', symbols: ['CMaj7', 'C7', 'Cm7', 'Cm7♭5', 'C°7'] },
        {
          kind: 'text',
          text: {
            en: 'Play all five on C and hear how each one differs.',
            ru: 'Сыграйте все пять от до и послушайте, чем они отличаются.',
          },
        },
      ],
    },
    {
      heading: { en: 'What each is made of', ru: 'Из чего каждый состоит' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Number each note by its root’s major scale. A flat lowers that note a half step.',
            ru: 'Нумеруйте звуки по мажорной гамме от основного тона. Бемоль перед числом понижает звук на полутон.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'CMaj7', degrees: '1 3 5 7', hands: 'C4 E4 G4 B4' },
            { symbol: 'C7', degrees: '1 3 5 ♭7', hands: 'C4 E4 G4 B♭4' },
            { symbol: 'Cm7', degrees: '1 ♭3 5 ♭7', hands: 'C4 E♭4 G4 B♭4' },
            { symbol: 'Cm7♭5', degrees: '1 ♭3 ♭5 ♭7', hands: 'C4 E♭4 G♭4 B♭4' },
          ],
        },
        {
          kind: 'note',
          text: {
            en: 'The diminished 7th lowers the 7th once more. On B it is B D F A♭.',
            ru: 'Уменьшённый септаккорд понижает септиму ещё раз. От си это си, ре, фа, ля-бемоль.',
          },
        },
      ],
    },
    {
      heading: { en: 'The dominant 7th leads home', ru: 'Доминантсептаккорд ведёт к тонике' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The dominant 7th', ru: 'Доминантсептаккорд' },
          text: {
            en: 'is built on the 5th degree: G7 in C major. Its B and F form a tense tritone. B rises to C and F falls to E.',
            ru: 'строят на пятой ступени: в до мажоре это G7. Его си и фа образуют напряжённый тритон. Си идёт вверх в до, фа вниз в ми.',
          },
        },
        { kind: 'chords', symbols: ['G7', 'C'] },
        { kind: 'interval', root: note('F'), interval: 'A4' },
      ],
    },
    {
      heading: { en: 'On every root', ru: 'От каждой ноты' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each grid shows one kind on all twelve roots: dominant 7ths, then minor 7ths. Play along a row.',
            ru: 'Каждая таблица показывает один вид от всех двенадцати нот: доминантсептаккорды, затем малые минорные. Сыграйте ряд подряд.',
          },
        },
        { kind: 'grid', quality: 'd7' },
        { kind: 'grid', quality: 'm7' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play D7.', ru: 'Сыграйте D7.' },
          answer: { chord: 'D7' },
        },
        {
          kind: 'question',
          ask: { en: 'Play Am7.', ru: 'Сыграйте Am7.' },
          answer: { chord: 'Am7' },
        },
        {
          kind: 'link',
          title: {
            en: 'Notes to add on top of a 7th chord',
            ru: 'Какие ноты добавить поверх септаккорда',
          },
          target: { opens: 'tensions', chord: 'd7' },
        },
      ],
    },
  ],
}

export default seventhChords
