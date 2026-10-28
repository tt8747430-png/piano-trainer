import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Mastering Chords, lesson 2: a minor chord on any root, three semitones then four. */
const buildMinorChords: Lesson = {
  id: 'build-minor-chords',
  title: { en: 'Build any minor chord', ru: 'Минорное трезвучие от любой ноты' },
  summary: {
    en: 'Count 3 semitones, then 4, to build a minor chord on any of the twelve roots.',
    ru: 'Отсчитайте 3 полутона, затем 4, и постройте минорное трезвучие от любой из двенадцати нот.',
  },
  sections: [
    {
      heading: { en: 'Three semitones, then four', ru: 'Три полутона, затем четыре' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A minor chord', ru: 'Минорное трезвучие' },
          text: {
            en: 'swaps the major chord’s steps: 3 semitones from the root, then 4. From A, count three up to C, then four more to E.',
            ru: 'меняет местами шаги мажорного: 3 полутона от основного тона, затем 4. От ля отсчитайте три до до, затем ещё четыре до ми.',
          },
        },
        { kind: 'interval', root: note('A'), interval: 'm3' },
        { kind: 'chords', symbols: ['Am', 'Dm', 'Em'], apart: true },
      ],
    },
    {
      heading: { en: 'Lower the 3rd', ru: 'Понизьте терцию' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Any major chord turns minor when you lower its 3rd by a semitone. C, E, G becomes C, E♭, G. The root and 5th stay put.',
            ru: 'Мажорное трезвучие становится минорным, если опустить терцию на полутон. До, ми, соль превращается в до, ми-бемоль, соль. Прима и квинта остаются на месте.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Cm', 'G', 'Gm'], apart: true },
      ],
    },
    {
      heading: { en: 'Roots on the white keys', ru: 'От белых клавиш' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'D, E and A minor are all white. C, F and G minor have a black key in the middle. B minor has one black key on top, F♯.',
            ru: 'Ре, ми и ля минор — только белые клавиши. В до, фа и соль миноре посередине чёрная. В си миноре одна чёрная сверху, фа-диез.',
          },
        },
        {
          kind: 'chords',
          symbols: ['Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm'],
          apart: true,
        },
      ],
    },
    {
      heading: { en: 'Roots on the black keys', ru: 'От чёрных клавиш' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C♯, F♯ and G♯ minor go black, white, black. E♭ minor is all black. B♭ minor goes black, black, white.',
            ru: 'До-диез, фа-диез и соль-диез минор — чёрная, белая, чёрная. Ми-бемоль минор — все чёрные. Си-бемоль минор — чёрная, чёрная, белая.',
          },
        },
        { kind: 'chords', symbols: ['C♯m', 'E♭m', 'F♯m', 'G♯m', 'B♭m'], apart: true },
      ],
    },
    {
      heading: { en: 'All twelve', ru: 'Все двенадцать' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play each minor chord right after its major chord. Only the middle note moves, and the mood turns darker.',
            ru: 'Играйте каждое минорное трезвучие сразу после мажорного. Сдвигается только средний звук, и звучание становится темнее.',
          },
        },
        { kind: 'grid', quality: 'min' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play C minor.', ru: 'Сыграйте до минор.' },
          answer: { chord: 'Cm' },
        },
        {
          kind: 'question',
          ask: { en: 'Play F♯ minor.', ru: 'Сыграйте фа-диез минор.' },
          answer: { chord: 'F♯m' },
        },
        {
          kind: 'question',
          ask: { en: 'Play B♭ minor.', ru: 'Сыграйте си-бемоль минор.' },
          answer: { chord: 'B♭m' },
        },
        {
          kind: 'link',
          title: { en: 'Build chords in the Quiz', ru: 'Построение аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'chords', drill: 'entry' },
        },
        {
          kind: 'link',
          title: { en: 'Major or minor by ear', ru: 'Мажор или минор на слух' },
          target: { opens: 'quiz', trainer: 'chords', drill: 'ear' },
        },
      ],
    },
  ],
}

export default buildMinorChords
