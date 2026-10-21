import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const wholeAndHalfSteps: Lesson = {
  id: 'whole-and-half-steps',
  title: { en: 'Half steps, whole steps, sharps and flats', ru: 'Полутоны, тоны, диезы и бемоли' },
  summary: {
    en: 'Measure the distance between keys in half and whole steps, and name the black keys with sharps and flats.',
    ru: 'Измерять расстояние между клавишами полутонами и тонами и называть чёрные клавиши через диезы и бемоли.',
  },
  sections: [
    {
      heading: { en: 'The half step', ru: 'Полутон' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A half step', ru: 'Полутон' },
          text: {
            en: 'is the step to the very next key, black or white. E to F and B to C are the only half steps between two white keys.',
            ru: '— это шаг к соседней клавише, чёрной или белой. Ми–фа и си–до — единственные полутоны между двумя белыми клавишами.',
          },
        },
        { kind: 'interval', root: note('E'), interval: 'm2' },
        { kind: 'interval', root: note('B'), interval: 'm2' },
      ],
    },
    {
      heading: { en: 'The whole step', ru: 'Тон' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A whole step', ru: 'Тон' },
          text: {
            en: 'is two half steps. It skips one key in between: C to D, or E to F♯.',
            ru: '— это два полутона. Между ними пропущена одна клавиша: до–ре или ми–фа-диез.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'M2' },
        { kind: 'interval', root: note('E'), interval: 'M2' },
      ],
    },
    {
      heading: { en: 'Sharp, flat, natural', ru: 'Диез, бемоль, бекар' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A sharp (♯) raises a note a half step. A flat (♭) lowers it a half step. A natural (♮) cancels either one.',
            ru: 'Диез (♯) повышает ноту на полутон. Бемоль (♭) понижает её на полутон. Бекар (♮) отменяет и то и другое.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F4 F#4 F4/2 B4 B♭4 B4/2' },
        {
          kind: 'note',
          text: {
            en: 'A sign lasts until the end of its bar.',
            ru: 'Знак, написанный в такте, действует до конца этого такта.',
          },
        },
      ],
    },
    {
      heading: { en: 'Two names, one key', ru: 'Два имени, одна клавиша' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C♯ and D♭ are the same black key. Going up from C, call it C♯. Coming down from D, call it D♭.',
            ru: 'До-диез и ре-бемоль — одна и та же чёрная клавиша. Вверх от до это до-диез, вниз от ре — ре-бемоль.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C#4/2 D♭4/2' },
      ],
    },
    {
      heading: { en: 'Twelve half steps make an octave', ru: 'Двенадцать полутонов — октава' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'From C up to the next C is twelve half steps. Play every key, black and white, in order.',
            ru: 'От до до следующего до — двенадцать полутонов. Сыграйте подряд все клавиши, чёрные и белые.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 C#4/8 D4/8 D#4/8 E4/8 F4/8 F#4/8 G4/8 G#4/8 A4/8 A#4/8 B4/8 C5/2',
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play E and the note a whole step above it.',
            ru: 'Сыграйте ми и ноту на тон выше.',
          },
          answer: { notes: ['E', 'F#'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play B and the note a half step above it.',
            ru: 'Сыграйте си и ноту на полутон выше.',
          },
          answer: { notes: ['B', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: { en: 'Play B♭.', ru: 'Сыграйте си-бемоль.' },
          answer: { notes: ['B♭'] },
        },
        {
          kind: 'link',
          title: { en: 'Build a scale in the Quiz', ru: 'Построение гамм в тестах' },
          target: { opens: 'quiz', trainer: 'build-scale' },
        },
        {
          kind: 'link',
          title: { en: 'The C major scale in the Player', ru: 'Гамма до мажор в плеере' },
          target: { opens: 'exercise', exercise: 'scale', root: note('C') },
        },
      ],
    },
  ],
}

export default wholeAndHalfSteps
