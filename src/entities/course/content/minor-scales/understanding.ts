import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

const understanding: Lesson = {
  id: 'understanding',
  title: { en: 'Understanding minor scales', ru: 'Как устроены минорные гаммы' },
  summary: {
    en: 'Learn the three forms of a minor scale, natural, harmonic and melodic, and why the 6th and 7th notes change.',
    ru: 'Выучить три вида минорной гаммы, натуральный, гармонический и мелодический, и понять, зачем меняются шестая и седьмая ступени.',
  },
  sections: [
    {
      heading: { en: 'Natural minor', ru: 'Натуральный минор' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Natural minor', ru: 'Натуральный минор' },
          text: {
            en: 'climbs whole, half, whole, whole, half, whole, whole. The half step comes after the 2nd note, much earlier than in major, which gives minor its darker sound.',
            ru: 'поднимается так: тон, полутон, тон, тон, полутон, тон, тон. Полутон стоит сразу после второй ступени, раньше, чем в мажоре, и от этого минор звучит темнее.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'natural' },
      ],
    },
    {
      heading: { en: 'The relative minor', ru: 'Параллельный минор' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The relative minor', ru: 'Параллельный минор' },
          text: {
            en: 'starts on the 6th note of a major scale and uses the same notes and key signature. A minor is the relative minor of C major.',
            ru: 'начинается с шестой ступени мажора и берёт те же ноты и ключевые знаки. Ля минор — параллельный минор до мажора.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4/2. A4 B4 C5 D5 E5 F5 G5 A5' },
      ],
    },
    {
      heading: { en: 'Harmonic minor', ru: 'Гармонический минор' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Harmonic minor', ru: 'Гармонический минор' },
          text: {
            en: 'raises the 7th note by a half step. In A minor, G becomes G♯. That leaves a wide gap of a step and a half between F and G♯.',
            ru: 'повышает седьмую ступень на полутон. В ля миноре соль становится соль-диезом. Между фа и соль-диезом остаётся широкий шаг в полтора тона.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'harmonic' },
      ],
    },
    {
      heading: { en: 'Why the 7th rises', ru: 'Зачем повышать седьмую ступень' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The leading note', ru: 'Вводный тон' },
          text: {
            en: 'is a 7th note a half step below the tonic, the home note. G♯ also turns the V chord into E major, which pulls home to Am much more strongly than Em.',
            ru: '— седьмая ступень на полутон ниже тоники, главного звука. Соль-диез ещё и делает аккорд V ступени мажорным: E тянется к Am гораздо сильнее, чем Em.',
          },
        },
        { kind: 'chords', symbols: ['Am', 'Dm', 'E', 'Am'] },
      ],
    },
    {
      heading: { en: 'Melodic minor', ru: 'Мелодический минор' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Melodic minor', ru: 'Мелодический минор' },
          text: {
            en: 'raises both the 6th and the 7th on the way up, to F♯ and G♯. This smooths out the wide gap. On the way down it plays natural minor.',
            ru: 'на пути вверх повышает и шестую, и седьмую ступени: фа-диез и соль-диез. Так широкий шаг сглаживается. Вниз играется натуральный минор.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'melodic' },
      ],
    },
    {
      heading: { en: 'Fingering minor scales', ru: 'Аппликатура минорных гамм' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'A, D, E and G minor use C major’s fingers. Right hand 1-2-3-1-2-3-4-5, left hand 5-4-3-2-1-3-2-1.',
              ru: 'Ля, ре, ми и соль минор играются пальцами до мажора. Правая рука 1-2-3-1-2-3-4-5, левая 5-4-3-2-1-3-2-1.',
            },
            {
              en: 'In these keys, harmonic and melodic minor keep the fingers of natural minor.',
              ru: 'В этих тональностях гармонический и мелодический минор сохраняют аппликатуру натурального.',
            },
          ],
        },
        { kind: 'notes', clef: 'treble', notes: 'A4 B4 C5 D5 E5 F5 G#5 A5' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play natural A minor up one octave.',
            ru: 'Сыграйте натуральный ля минор вверх на октаву.',
          },
          answer: { notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'A'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play harmonic A minor up one octave.',
            ru: 'Сыграйте гармонический ля минор вверх на октаву.',
          },
          answer: { notes: ['A', 'B', 'C', 'D', 'E', 'F', 'G#', 'A'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the tonic chord of G major’s relative minor.',
            ru: 'Сыграйте тоническое трезвучие минора, параллельного соль мажору.',
          },
          answer: { chord: 'Em' },
        },
        {
          kind: 'link',
          title: { en: 'Harmonic A minor in Scales', ru: 'Гармонический ля минор в гаммах' },
          target: { opens: 'scales', root: note('A'), scale: 'harmonic' },
        },
        {
          kind: 'link',
          title: { en: 'Build scales in the Quiz', ru: 'Построение гамм в тестах' },
          target: { opens: 'quiz', trainer: 'build-scale' },
        },
      ],
    },
  ],
}

export default understanding
