import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const speedPlan: Lesson = {
  id: 'speed-plan',
  after: ['scale-routine'],
  title: { en: 'Five days to faster fingers', ru: 'Пять дней к беглым пальцам' },
  summary: {
    en: 'One drill a day for ten to fifteen minutes. Raise the tempo 4 beats a minute after each clean pass, and write it down.',
    ru: 'Одно упражнение в день, десять–пятнадцать минут. Прибавляйте 4 удара в минуту после каждого чистого проигрыша и записывайте темп.',
  },
  sections: [
    {
      heading: { en: 'Day 1: five fingers', ru: 'День 1: пять пальцев' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Up and down from C at 60. Play four clean passes at a tempo before you raise it.',
            ru: 'Вверх и вниз от до на темпе 60. Четыре чистых проигрыша, прежде чем ускоряться.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/8 D4/8 E4/8 F4/8 G4/8 F4/8 E4/8 D4/8 C4/1' },
      ],
    },
    {
      heading: { en: 'Day 2: a sequence', ru: 'День 2: секвенция' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Fingers 1 3 4 5 4 3, started on each note of the scale, at 56. Every note equally loud.',
            ru: 'Пальцы 1 3 4 5 4 3, от каждой ступени гаммы, на темпе 56. Все звуки одинаково громко.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          meter: '3/4',
          notes: 'C4/8 E4/8 F4/8 G4/8 F4/8 E4/8 D4/8 F4/8 G4/8 A4/8 G4/8 F4/8',
        },
      ],
    },
    {
      heading: { en: 'Day 3: the scale', ru: 'День 3: гамма' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C major, one octave, at 66. No bump where the thumb passes under.',
            ru: 'До мажор, одна октава, темп 66. Без толчка там, где подкладывается большой палец.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'major' },
      ],
    },
    {
      heading: { en: 'Day 4: the arpeggio', ru: 'День 4: арпеджио' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C major over two octaves, fingers 1 2 3 1 2 3 5, at 60. Keep the elbow still.',
            ru: 'До мажор на две октавы, пальцы 1 2 3 1 2 3 5, темп 60. Локоть спокоен.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/8 E4/8 G4/8 C5/8 E5/8 G5/8 C6/4' },
      ],
    },
    {
      heading: { en: 'Day 5: chromatic', ru: 'День 5: хроматическая гамма' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'One octave from C at 52: the thumb on white keys, 3 on black. Time it and write the tempo down.',
            ru: 'Одна октава от до, темп 52: большой палец на белых, третий на чёрных. Засеките время и запишите темп.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 C#4/8 D4/8 D#4/8 E4/8 F4/8 F#4/8 G4/8 G#4/8 A4/8 A#4/8 B4/8 C5/2',
        },
      ],
      takeaway: {
        en: 'Speed is even timing, a smooth thumb and a loose wrist.',
        ru: 'Скорость — это ровность, плавный большой палец и свободное запястье.',
      },
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the C major arpeggio up: C, E, G, C.',
            ru: 'Сыграйте арпеджио до мажор вверх: до, ми, соль, до.',
          },
          answer: { notes: ['C', 'E', 'G', 'C'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'The C arpeggio in the Player', ru: 'Арпеджио до мажор в плеере' },
          target: { opens: 'exercise', exercise: 'arpeggio', root: note('C') },
        },
      ],
    },
  ],
}

export default speedPlan
