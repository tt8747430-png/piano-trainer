import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Intermediate Piano Playing, lesson 1: moving the hand beyond five keys without a jump. */
const fingeringTechniques: Lesson = {
  id: 'fingering-techniques',
  title: { en: 'Fingering techniques', ru: 'Приёмы аппликатуры' },
  summary: {
    en: 'Play past five keys without jumping: pass the thumb under, cross over, swap fingers and stretch.',
    ru: 'Выходить за пять клавиш без скачка: подкладывать и перекладывать пальцы, подменять их и растягивать руку.',
  },
  sections: [
    {
      heading: { en: 'Passing the thumb under', ru: 'Подкладывание первого пальца' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Passing the thumb under:', ru: 'Подкладывание:' },
          text: {
            en: 'the thumb slides beneath the hand to the next key. Going up C major, the right hand plays C D E with 1-2-3. Then the thumb takes F.',
            ru: 'первый палец проходит под ладонью к следующей клавише. Вверх по до мажору правая рука играет до, ре, ми пальцами 1-2-3. Затем первый берёт фа.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 D4/8 E4/8 F4/8 G4/8 A4/8 B4/8 C5/8 C5/1',
        },
      ],
    },
    {
      heading: { en: 'Crossing over', ru: 'Перекладывание пальца' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Crossing over:', ru: 'Перекладывание:' },
          text: {
            en: 'coming down, a finger reaches over the thumb. The right hand plays C B A G F with 5-4-3-2-1. Then finger 3 crosses over to E.',
            ru: 'при движении вниз палец переносится через первый. Правая рука играет до, си, ля, соль, фа пальцами 5-4-3-2-1. Затем третий переносится на ми.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C5/8 B4/8 A4/8 G4/8 F4/8 E4/8 D4/8 C4/8 C4/1',
        },
      ],
    },
    {
      heading: { en: 'The left hand', ru: 'Левая рука' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand mirrors the right. Going up C major, it plays C D E F G with 5-4-3-2-1. Then finger 3 crosses over the thumb to A.',
            ru: 'Левая рука действует зеркально. Вверх по до мажору она играет до, ре, ми, фа, соль пальцами 5-4-3-2-1. Затем третий переносится через первый на ля.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'C3/8 D3/8 E3/8 F3/8 G3/8 A3/8 B3/8 C4/8 C4/1',
        },
      ],
    },
    {
      heading: { en: 'Swapping fingers on a key', ru: 'Подмена пальца' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Finger substitution:', ru: 'Подмена пальца:' },
          text: {
            en: 'changing fingers on a key you are holding. Hold E with finger 3 and slip the thumb onto it. Now fingers 2-3-4-5 reach F, G, A and B.',
            ru: 'смена пальца на клавише, которую вы держите. Держите ми третьим пальцем и подставьте первый. Теперь пальцы 2-3-4-5 достают фа, соль, ля и си.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4/2~ E4/2 F4 G4 A4 B4' },
      ],
    },
    {
      heading: { en: 'Stretching the hand', ru: 'Растяжка' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Extension:', ru: 'Растяжка:' },
          text: {
            en: 'one finger reaches past the five keys under the hand, and the hand stays where it is. Keep the thumb on C and stretch finger 5 up to A.',
            ru: 'один палец выходит за пять клавиш позиции, а рука остаётся на месте. Держите первый палец на до и дотянитесь пятым до ля.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 E4 G4 A4 G4 E4 C4/2' },
      ],
    },
    {
      heading: { en: 'Planning a phrase', ru: 'Как спланировать фразу' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 G4 A4 G4 F4 E4 D4 C4/2' },
        {
          kind: 'steps',
          steps: [
            {
              en: 'Find the phrase’s lowest and highest notes.',
              ru: 'Найдите самый низкий и самый высокий звук фразы.',
            },
            {
              en: 'Decide where the thumb passes under. Here it is on F.',
              ru: 'Решите, где подложить первый палец. Здесь это фа.',
            },
            {
              en: 'Play it with the same fingers every time.',
              ru: 'Играйте её одними и теми же пальцами каждый раз.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play C major up an octave, passing the thumb under to F.',
            ru: 'Сыграйте до мажор вверх на октаву, подкладывая первый палец на фа.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Coming down C major, play the note that finger 3 crosses over to.',
            ru: 'Вниз по до мажору сыграйте ноту, на которую переносится третий палец.',
          },
          answer: { notes: ['E'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Keep the thumb on C and play C, E, G and A going up.',
            ru: 'Держите первый палец на до и сыграйте вверх до, ми, соль и ля.',
          },
          answer: { notes: ['C', 'E', 'G', 'A'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'C major scale in the Player', ru: 'Гамма до мажор в плеере' },
          target: { opens: 'exercise', exercise: 'scale', root: note('C') },
        },
        {
          kind: 'link',
          title: { en: 'Minuet in G in the Player', ru: 'Менуэт соль мажор в плеере' },
          target: { opens: 'piece', piece: 'minuet-g' },
        },
      ],
    },
  ],
}

export default fingeringTechniques
