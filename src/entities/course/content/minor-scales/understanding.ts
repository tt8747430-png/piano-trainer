import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

const understanding: Lesson = {
  id: 'understanding',
  title: { en: 'Understanding minor scales', ru: 'Как устроены минорные гаммы' },
  summary: {
    en: 'Play the natural, harmonic and melodic forms of a minor scale.',
    ru: 'Играть натуральный, гармонический и мелодический минор.',
  },
  sections: [
    {
      heading: { en: 'Natural minor', ru: 'Натуральный минор' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Natural minor', ru: 'Натуральный минор' },
          text: {
            en: 'climbs whole, half, whole, whole, half, whole, whole. The half step after the 2nd makes it darker.',
            ru: 'поднимается так: тон, полутон, тон, тон, полутон, тон, тон. Полутон после второй ступени делает его темнее.',
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
            en: 'starts on the 6th note of a major scale and keeps its notes and signature. A minor is C major’s.',
            ru: 'начинается с шестой ступени мажора и сохраняет его ноты и ключевые знаки. Ля минор — параллельный до мажору.',
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
            en: 'raises the 7th: G becomes G♯. The gap from F to G♯ is a step and a half.',
            ru: 'повышает седьмую ступень: соль становится соль-диезом. Между фа и соль-диезом — полтора тона.',
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
            en: 'is a 7th a half step below the tonic. G♯ makes V major, E, which pulls home to Am far more than Em.',
            ru: '— седьмая ступень на полутон ниже тоники. Соль-диез делает V ступень мажорной: E тянется к Am сильнее, чем Em.',
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
            en: 'raises the 6th and 7th going up, F♯ and G♯, smoothing the gap. Coming down it plays natural minor.',
            ru: 'повышает шестую и седьмую ступени вверх, фа-диез и соль-диез, сглаживая скачок. Вниз играется натуральный минор.',
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
              en: 'A, D, E and G minor take C major’s fingers: 1-2-3-1-2-3-4-5 and 5-4-3-2-1-3-2-1.',
              ru: 'Ля, ре, ми и соль минор играются как до мажор: 1-2-3-1-2-3-4-5 и 5-4-3-2-1-3-2-1.',
            },
            {
              en: 'Harmonic and melodic minor keep natural minor’s fingers.',
              ru: 'Гармонический и мелодический минор сохраняют аппликатуру натурального.',
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
