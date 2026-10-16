import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Intermediate Piano Playing, lesson 7: six eighths felt as two beats of three. */
const sixEight: Lesson = {
  id: 'six-eight',
  title: { en: '6/8 time', ru: 'Размер 6/8' },
  summary: {
    en: 'Count 6/8 as two beats of three eighths, and play its rocking rhythm.',
    ru: 'Считать 6/8 как две доли по три восьмых и играть его покачивающийся ритм.',
  },
  sections: [
    {
      heading: { en: 'Two beats of three', ru: 'Две доли по три' },
      blocks: [
        {
          kind: 'text',
          lead: { en: '6/8 time:', ru: 'Размер 6/8:' },
          text: {
            en: 'six eighth notes in a bar, grouped as two threes. So the bar has two beats, and each beat lasts a dotted quarter.',
            ru: 'шесть восьмых в такте, сгруппированных по три. Значит, в такте две доли, и каждая длится четверть с точкой.',
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
              en: 'Count 1 to 6, one number for each eighth.',
              ru: 'Считайте от одного до шести, по числу на каждую восьмую.',
            },
            { en: 'Lean on 1 and 4.', ru: 'Опирайтесь на «раз» и «четыре».' },
            {
              en: 'Speed up until you feel only two beats in the bar.',
              ru: 'Ускоряйтесь, пока не почувствуете в такте только две доли.',
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
            en: 'A quarter then an eighth fill one beat: long, short. Repeat the pair and 6/8 starts to rock.',
            ru: 'Четверть и восьмая заполняют одну долю: долго, коротко. Повторяйте эту пару, и 6/8 начинает покачиваться.',
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
      heading: { en: 'Broken chords in 6/8', ru: 'Ломаные аккорды в 6/8' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand often breaks a chord into six eighths: three going up, three coming back. Here it plays A minor, then C major.',
            ru: 'Левая рука часто раскладывает аккорд на шесть восьмых: три вверх, три обратно. Здесь она играет ля минор, затем до мажор.',
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
            en: 'Play the first chord the left hand broke up.',
            ru: 'Сыграйте первый аккорд, который разложила левая рука.',
          },
          answer: { chord: 'Am' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play its notes going up: A, E, A, C.',
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
