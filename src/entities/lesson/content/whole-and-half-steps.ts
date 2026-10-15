import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const wholeAndHalfSteps: Lesson = {
  id: 'whole-and-half-steps',
  title: { en: 'Half steps, whole steps, sharps and flats', ru: 'Полутоны, тоны, диезы и бемоли' },
  summary: {
    en: 'The two steps every scale is built from, the black keys’ two names, and the signs that raise and lower a note.',
    ru: 'Два шага, из которых строится любая гамма, два имени чёрных клавиш и знаки, повышающие и понижающие ноту.',
  },
  sections: [
    {
      heading: { en: 'The half step', ru: 'Полутон' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A half step', ru: 'Полутон' },
          text: {
            en: 'goes to the very next key, black or white. E–F and B–C are half steps between white keys.',
            ru: '— шаг к соседней клавише, чёрной или белой. Ми–фа и си–до — полутоны между белыми клавишами.',
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
            en: 'is two half steps, with one key between: C–D, E–F♯.',
            ru: '— два полутона, через одну клавишу: до–ре, ми–фа♯.',
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
            en: 'A sharp (♯) raises a note a half step. A flat (♭) lowers it. A natural (♮) cancels either.',
            ru: 'Диез (♯) повышает ноту на полутон. Бемоль (♭) понижает. Бекар (♮) отменяет и то и другое.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F4 F#4 F4/2 B4 B♭4 B4/2' },
        {
          kind: 'note',
          text: {
            en: 'A sign written in a bar holds to the end of that bar.',
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
            en: 'C♯ and D♭ are one key. Going up from C, call it C♯. Coming down from D, call it D♭.',
            ru: 'До-диез и ре-бемоль — одна клавиша. Вверх от до это до-диез, вниз от ре — ре-бемоль.',
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
            en: 'Play every key from C to the next C: twelve half steps. Spell them with sharps going up.',
            ru: 'Сыграйте все клавиши от до до следующего до: двенадцать полутонов. Вверх пишите их с диезами.',
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
      ],
    },
  ],
}

export default wholeAndHalfSteps
