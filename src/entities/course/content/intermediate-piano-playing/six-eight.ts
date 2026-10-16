import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Intermediate Piano Playing, lesson 7: six eighths felt as two beats of three. */
const sixEight: Lesson = {
  id: 'six-eight',
  title: { en: '6/8 time', ru: 'Размер 6/8' },
  summary: {
    en: 'Count 6/8 as two beats of three and play its lilt.',
    ru: 'Считать 6/8 как две доли по три и играть его покачивание.',
  },
  sections: [
    {
      heading: { en: 'Two beats of three', ru: 'Две доли по три' },
      blocks: [
        {
          kind: 'text',
          lead: { en: '6/8:', ru: '6/8:' },
          text: {
            en: 'six eighth notes to a bar, grouped in two threes. The bar has two beats, each a dotted quarter.',
            ru: 'шесть восьмых в такте, по три в группе. В такте две доли, каждая — четверть с точкой.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 D4/8 E4/8 F4/8 G4/8 A4/8 G4/4. C4/4.',
          meter: '6/8',
        },
      ],
    },
    {
      heading: { en: 'Counting to six', ru: 'Счёт до шести' },
      blocks: [
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 E4/8 G4/8 C5/8 G4/8 E4/8 C4/8 E4/8 G4/8 C5/4.',
          meter: '6/8',
        },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Count 1 to 6, one number to each eighth.',
              ru: 'Считайте от одного до шести, по цифре на восьмую.',
            },
            { en: 'Lean on 1 and 4.', ru: 'Опирайтесь на «раз» и «четыре».' },
            {
              en: 'Speed up until you feel only two beats.',
              ru: 'Ускоряйтесь, пока не почувствуете только две доли.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'The lilt: long, short', ru: 'Покачивание: долго, коротко' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A quarter then an eighth fills one beat: long, short. Repeated, it makes 6/8 rock.',
            ru: 'Четверть и восьмая заполняют одну долю: долго, коротко. Повторяясь, они раскачивают 6/8.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/4 E4/8 G4/4 E4/8 F4/4 A4/8 G4/4 F4/8 E4/4 D4/8 C4/4.',
          meter: '6/8',
        },
      ],
    },
    {
      heading: { en: 'Broken chords in 6/8', ru: 'Арпеджио в 6/8' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand often breaks a chord into six eighths: three up, three back down. Here A minor, then C.',
            ru: 'Левая рука часто раскладывает аккорд на шесть восьмых: три вверх, три обратно. Здесь ля минор, затем до мажор.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'A2/8 E3/8 A3/8 C4/8 A3/8 E3/8 C3/8 G3/8 C4/8 E4/8 C4/8 G3/8',
          meter: '6/8',
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the chord the left hand broke first.',
            ru: 'Сыграйте аккорд, который левая рука разложила первым.',
          },
          answer: { chord: 'Am' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play its rising notes: A, E, A, C.',
            ru: 'Сыграйте его звуки вверх: ля, ми, ля, до.',
          },
          answer: { notes: ['A', 'E', 'A', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: { en: 'Play the second chord, C major.', ru: 'Сыграйте второй аккорд, до мажор.' },
          answer: { chord: 'C' },
        },
        {
          kind: 'link',
          title: { en: 'A minor arpeggio in the Player', ru: 'Арпеджио ля минор в плеере' },
          target: { opens: 'exercise', exercise: 'arpeggio', root: note('A'), quality: 'min' },
        },
      ],
    },
  ],
}

export default sixEight
