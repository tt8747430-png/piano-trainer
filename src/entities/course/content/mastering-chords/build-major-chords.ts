import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Mastering Chords, lesson 1: a major chord on any root, by counting semitones. */
const buildMajorChords: Lesson = {
  id: 'build-major-chords',
  title: { en: 'Build any major chord', ru: 'Мажорный аккорд от любой ноты' },
  summary: {
    en: 'Four semitones, then three: one rule builds a major chord on every one of the twelve roots, white keys and black.',
    ru: 'Четыре полутона, затем три: одно правило строит мажорный аккорд от каждой из двенадцати нот, белых и чёрных.',
  },
  sections: [
    {
      heading: { en: 'Four plus three', ru: 'Четыре плюс три' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Major chord:', ru: 'Мажорное трезвучие:' },
          text: {
            en: 'a root, a note 4 semitones above it, and another 3 semitones above that. The three notes are the root, the 3rd and the 5th.',
            ru: 'основной тон, звук на 4 полутона выше и ещё один на 3 полутона выше него. Эти три звука — прима, терция и квинта.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'], apart: true },
      ],
    },
    {
      heading: { en: 'The 3rd: four semitones', ru: 'Терция: четыре полутона' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From C count C♯, D, D♯, E: four semitones. E is the major 3rd, the note that makes the chord bright.',
            ru: 'От до считайте до-диез, ре, ре-диез, ми: четыре полутона. Ми — большая терция, звук, от которого аккорд звучит светло.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'M3' },
      ],
    },
    {
      heading: { en: 'The 5th: three more', ru: 'Квинта: ещё три' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From E count F, F♯, G: three more semitones. G is the 5th, seven semitones above C.',
            ru: 'От ми считайте фа, фа-диез, соль: ещё три полутона. Соль — квинта, на семь полутонов выше до.',
          },
        },
        { kind: 'interval', root: note('E'), interval: 'm3' },
        { kind: 'interval', root: note('C'), interval: 'P5' },
      ],
    },
    {
      heading: { en: 'On the white keys', ru: 'От белых клавиш' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C, F and G are all white. D, E and A take one black key in the middle. B takes two.',
            ru: 'C, F и G — только белые клавиши. В D, E и A посередине одна чёрная. В B две чёрные.',
          },
        },
        { kind: 'chords', symbols: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], apart: true },
      ],
    },
    {
      heading: { en: 'On the black keys', ru: 'От чёрных клавиш' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'D♭, E♭ and A♭ go black, white, black. G♭ is all black. B♭ is black, white, white.',
            ru: 'D♭, E♭ и A♭ — чёрная, белая, чёрная. G♭ — все чёрные. B♭ — чёрная, белая, белая.',
          },
        },
        { kind: 'chords', symbols: ['D♭', 'E♭', 'G♭', 'A♭', 'B♭'], apart: true },
      ],
    },
    {
      heading: { en: 'All twelve', ru: 'Все двенадцать' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The major chord on every root. Play them a 5th apart, C, G, D, A, and on: each shares a note with the last.',
            ru: 'Мажорное трезвучие от каждой ноты. Играйте их через квинту, C, G, D, A и дальше: у соседних аккордов есть общий звук.',
          },
        },
        { kind: 'grid', quality: 'maj' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play E major.', ru: 'Сыграйте ми мажор.' },
          answer: { chord: 'E' },
        },
        {
          kind: 'question',
          ask: { en: 'Play A♭ major.', ru: 'Сыграйте ля-бемоль мажор.' },
          answer: { chord: 'A♭' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play B major: two black keys.',
            ru: 'Сыграйте си мажор: две чёрные клавиши.',
          },
          answer: { chord: 'B' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play G♭ major, all black.',
            ru: 'Сыграйте соль-бемоль мажор, только чёрные.',
          },
          answer: { chord: 'G♭' },
        },
        {
          kind: 'link',
          title: { en: 'Build chords in the Quiz', ru: 'Построение аккордов в тестах' },
          target: { opens: 'quiz', trainer: 'build-chord' },
        },
        {
          kind: 'link',
          title: { en: 'Major chords in Chords', ru: 'Мажорные аккорды в разделе «Аккорды»' },
          target: { opens: 'chords', chord: 'C' },
        },
        {
          kind: 'link',
          title: { en: 'D major arpeggio in the Player', ru: 'Арпеджио ре мажор в плеере' },
          target: { opens: 'exercise', exercise: 'arpeggio', root: note('D'), quality: 'maj' },
        },
      ],
    },
  ],
}

export default buildMajorChords
