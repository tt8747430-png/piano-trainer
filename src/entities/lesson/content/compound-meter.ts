import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const compoundMeter: Lesson = {
  id: 'compound-meter',
  title: { en: 'Compound meter: 6/8 and 12/8', ru: 'Размеры 6/8 и 12/8' },
  summary: {
    en: 'Count and play 6/8 and 12/8, where each beat splits into three eighth notes.',
    ru: 'Считайте и играйте 6/8 и 12/8, где каждая доля делится на три восьмые.',
  },
  sections: [
    {
      heading: { en: 'Simple and compound', ru: 'Доля на две и на три восьмые' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'In simple meter', ru: 'В 2/4, 3/4 и 4/4' },
          text: {
            en: 'each beat splits into two eighth notes. In compound meter, each beat splits into three. Play two beats of each and compare.',
            ru: 'каждая доля делится на две восьмые. В 6/8 и 12/8 каждая доля делится на три. Сыграйте по две доли каждого и сравните.',
          },
        },
        { kind: 'notes', clef: 'treble', meter: '2/4', notes: 'C5/8 G4/8 C5/8 G4/8' },
        { kind: 'notes', clef: 'treble', meter: '6/8', notes: 'C5/8 G4/8 G4/8 C5/8 G4/8 G4/8' },
      ],
    },
    {
      heading: { en: 'The dotted-quarter beat', ru: 'Доля — четвертная с точкой' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In 6/8 one beat is a dotted quarter note, as long as three eighths. A bar of 6/8 has two beats. A bar of 12/8 has four.',
            ru: 'В 6/8 одна доля — четвертная с точкой, длиной в три восьмые. В такте 6/8 две доли. В такте 12/8 их четыре.',
          },
        },
        { kind: 'notes', clef: 'treble', meter: '6/8', notes: 'C5/4. G4/4. E4/4. C4/4.' },
      ],
    },
    {
      heading: { en: 'Counting to six', ru: 'Счёт до шести' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Count every eighth, 1 2 3 4 5 6, and lean on 1 and 4. A quarter then an eighth is a long and a short note, on 1 and 3.',
            ru: 'Считайте каждую восьмую, от «раз» до «шесть», с опорой на «раз» и «четыре». Четвертная и восьмая — долгая и короткая нота, на «раз» и «три».',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          meter: '6/8',
          notes: 'C4/4 E4/8 G4/4 E4/8 F4/4 D4/8 C4/4.',
        },
      ],
    },
    {
      heading: { en: '6/8 or 3/4?', ru: '6/8 или 3/4?' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Both bars hold six eighths. 3/4 groups them in three pairs, so it has three beats. 6/8 groups them in two threes, so it has two beats.',
            ru: 'В обоих тактах шесть восьмых. 3/4 делит их на три пары, поэтому в нём три доли. 6/8 делит на две тройки, поэтому в нём две доли.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          meter: '3/4',
          notes: 'C5/8 D5/8 C5/8 D5/8 C5/8 D5/8 C5/2.',
        },
        {
          kind: 'notes',
          clef: 'treble',
          meter: '6/8',
          notes: 'C5/8 D5/8 E5/8 C5/8 D5/8 E5/8 C5/2.',
        },
      ],
    },
    {
      heading: { en: '12/8 ballads', ru: 'Баллады в 12/8' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Slow ballads often use 12/8. The right hand plays the chord in rising threes. The left hand plays one bass note on each beat.',
            ru: 'Медленные баллады часто пишут в 12/8. Правая рука играет аккорд тройками вверх. Левая берёт по одной басовой ноте на каждую долю.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          meter: '12/8',
          notes:
            'E4/8 G4/8 C5/8 E4/8 G4/8 C5/8 F4/8 A4/8 C5/8 F4/8 A4/8 C5/8 D4/8 G4/8 B4/8 D4/8 G4/8 B4/8 E4/8 G4/8 C5/8 C5/4.',
          bass: 'C3/4. C3/4. F2/4. F2/4. G2/4. G2/4. C3/2.',
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play one beat of 6/8 on C major: C, E and G rising, three eighths.',
            ru: 'Сыграйте одну долю 6/8 на до мажоре: до, ми и соль вверх, три восьмые.',
          },
          answer: { notes: ['C', 'E', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the first 12/8 bar’s third beat: F, A and C rising.',
            ru: 'Сыграйте третью долю первого такта 12/8: фа, ля и до вверх.',
          },
          answer: { notes: ['F', 'A', 'C'], rising: true },
        },
        {
          kind: 'link',
          title: {
            en: 'Practise F major’s arpeggio in the Player',
            ru: 'Арпеджио фа мажора в плеере',
          },
          target: { opens: 'exercise', exercise: 'arpeggio', root: note('F'), quality: 'maj' },
        },
      ],
    },
  ],
}

export default compoundMeter
