import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const compoundMeter: Lesson = {
  id: 'compound-meter',
  title: { en: 'Compound meter: 6/8 and 12/8', ru: 'Сложные размеры: 6/8 и 12/8' },
  summary: {
    en: 'Count and play 6/8 and 12/8, whose beats split in three.',
    ru: 'Считайте и играйте 6/8 и 12/8, где доля делится на три.',
  },
  sections: [
    {
      heading: { en: 'Simple and compound', ru: 'Простой и сложный размер' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'In simple meter', ru: 'В простом размере' },
          text: {
            en: 'each beat splits in two eighths. In compound meter it splits in three. Hear two beats of each.',
            ru: 'каждая доля делится на две восьмые. В сложном — на три. Послушайте по две доли того и другого.',
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
            en: 'In 6/8 the beat is a dotted quarter, three eighths long. A bar has two such beats, a bar of 12/8 four.',
            ru: 'В 6/8 доля — четвертная с точкой, длиной в три восьмые. В такте две такие доли, в такте 12/8 — четыре.',
          },
        },
        { kind: 'notes', clef: 'treble', meter: '6/8', notes: 'C5/4. G4/4. E4/4. C4/4.' },
      ],
    },
    {
      heading: { en: 'Counting 1-2-3 4-5-6', ru: 'Счёт: раз-два-три, четыре-пять-шесть' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Count every eighth, leaning on 1 and 4. A quarter then an eighth is long–short: it sounds on 1 and 3.',
            ru: 'Считайте каждую восьмую, опираясь на «раз» и «четыре». Четвертная и восьмая — долгая и короткая: они звучат на «раз» и «три».',
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
            en: 'Both hold six eighths. 3/4 groups them in three pairs: three beats. 6/8 groups them in two threes: two beats.',
            ru: 'В обоих размерах шесть восьмых. 3/4 группирует их по две: три доли. 6/8 — по три: две доли.',
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
            en: 'In a slow 12/8 the right hand rocks in threes over a steady bass, one bass note to a beat.',
            ru: 'В медленном 12/8 правая рука покачивается тройками над ровным басом, по басовой ноте на долю.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          meter: '12/8',
          notes:
            'E4/8 G4/8 C5/8 E4/8 G4/8 C5/8 F4/8 A4/8 C5/8 F4/8 A4/8 C5/8 D4/8 G4/8 B4/8 D4/8 G4/8 B4/8 E4/8 G4/8 C5/8 C5/4.',
        },
        {
          kind: 'notes',
          clef: 'bass',
          meter: '12/8',
          notes: 'C3/4. C3/4. F2/4. F2/4. G2/4. G2/4. C3/2.',
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
          title: { en: 'F major’s arpeggio in the Player', ru: 'Арпеджио фа мажора в плеере' },
          target: { opens: 'exercise', exercise: 'arpeggio', root: note('F'), quality: 'maj' },
        },
      ],
    },
  ],
}

export default compoundMeter
