import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Mastering Chords, lesson 2: a minor chord on any root, three semitones then four. */
const buildMinorChords: Lesson = {
  id: 'build-minor-chords',
  title: { en: 'Build any minor chord', ru: 'Минорный аккорд от любой ноты' },
  summary: {
    en: 'Build a minor chord on any of the twelve roots.',
    ru: 'Стройте минорный аккорд от любой из двенадцати нот.',
  },
  sections: [
    {
      heading: { en: 'Three semitones, then four', ru: 'Три полутона, затем четыре' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Minor chord:', ru: 'Минорное трезвучие:' },
          text: {
            en: 'a root, the note 3 semitones above it, and the note 4 above that. From A: C, then E.',
            ru: 'основной тон, звук на 3 полутона выше и звук ещё на 4 выше. От ля: до, затем ми.',
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
            en: 'Lower a major chord’s 3rd a semitone and it turns minor. C, E, G becomes C, E♭, G.',
            ru: 'Опустите терцию мажорного аккорда на полутон — и он станет минорным. До, ми, соль превращается в до, ми-бемоль, соль.',
          },
        },
        { kind: 'chords', symbols: ['C', 'Cm', 'G', 'Gm'], apart: true },
      ],
    },
    {
      heading: { en: 'On the white keys', ru: 'От белых клавиш' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'D, E and A minor are all white. C, F and G minor have one black key in the middle. B minor’s 5th is F♯.',
            ru: 'Ре, ми и ля минор — только белые клавиши. В до, фа и соль миноре посередине одна чёрная. Квинта си минора — фа-диез.',
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
      heading: { en: 'On the black keys', ru: 'От чёрных клавиш' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C♯, F♯ and G♯ minor go black, white, black. E♭ minor is all black. B♭ minor is black, black, white.',
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
            en: 'Play each beside its major chord and hear only the 3rd move.',
            ru: 'Играйте каждый рядом с мажорным и слушайте, как сдвигается только терция.',
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
          target: { opens: 'quiz', trainer: 'build-chord' },
        },
        {
          kind: 'link',
          title: { en: 'Major or minor by ear', ru: 'Мажор или минор на слух' },
          target: { opens: 'quiz', trainer: 'chords-by-ear' },
        },
      ],
    },
  ],
}

export default buildMinorChords
