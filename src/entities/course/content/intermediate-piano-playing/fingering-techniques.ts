import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Intermediate Piano Playing, lesson 1: moving the hand beyond five keys without a jump. */
const fingeringTechniques: Lesson = {
  id: 'fingering-techniques',
  title: { en: 'Fingering techniques', ru: 'Приёмы аппликатуры' },
  summary: {
    en: 'Pass the thumb under, cross over, swap and stretch fingers.',
    ru: 'Подкладывать и перекладывать пальцы, подменять их и растягивать руку.',
  },
  sections: [
    {
      heading: { en: 'The thumb passes under', ru: 'Подкладывание первого пальца' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Thumb under:', ru: 'Подкладывание:' },
          text: {
            en: 'the thumb slides beneath the hand to the next key. Up C major, play C D E with 1-2-3, then the thumb takes F.',
            ru: 'первый палец проходит под ладонью к следующей клавише. Вверх по до мажору: до, ре, ми пальцами 1-2-3, затем первый берёт фа.',
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
      heading: { en: 'A finger crosses over', ru: 'Перекладывание пальца' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Finger crossing:', ru: 'Перекладывание:' },
          text: {
            en: 'coming down, a finger reaches over the thumb. Play C B A G F with 5-4-3-2-1, then 3 crosses onto E.',
            ru: 'при движении вниз палец переносится через первый. До, си, ля, соль, фа пальцами 5-4-3-2-1, затем третий — на ми.',
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
            en: 'The left hand mirrors the right. Up C major it plays 5-4-3-2-1, then 3 crosses over the thumb onto A.',
            ru: 'Левая рука зеркальна правой. Вверх по до мажору: 5-4-3-2-1, затем третий палец через первый на ля.',
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
      heading: { en: 'Swap fingers on a key', ru: 'Подмена пальца' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Finger substitution:', ru: 'Подмена пальца:' },
          text: {
            en: 'changing fingers on a held key. Hold E with 3, slip the thumb onto it, and 2-3-4-5 reach up to B.',
            ru: 'смена пальца на звучащей клавише. Держите ми третьим, подставьте первый, и пальцы 2-3-4-5 дотянутся до си.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4/2~ E4/2 F4 G4 A4 B4' },
      ],
    },
    {
      heading: { en: 'Stretch the hand', ru: 'Растяжка' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Extension:', ru: 'Растяжка:' },
          text: {
            en: 'a finger reaches past the position while the hand stays put. Keep the thumb on C and stretch 5 up to A.',
            ru: 'палец выходит за позицию, а рука остаётся на месте. Держите первый палец на до и дотянитесь пятым до ля.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 E4 G4 A4 G4 E4 C4/2' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
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
              en: 'Plan where the thumb passes under: here onto F.',
              ru: 'Решите, где подложить первый палец: здесь на фа.',
            },
            {
              en: 'Keep the same fingers every time.',
              ru: 'Играйте одними и теми же пальцами каждый раз.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C major up an octave, the thumb passing under onto F.',
            ru: 'Сыграйте до мажор вверх на октаву, подкладывая первый палец на фа.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Coming down, play the note finger 3 crosses onto.',
            ru: 'При движении вниз сыграйте ноту, на которую перекладывается третий палец.',
          },
          answer: { notes: ['E'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Keep the thumb on C and play C, E, G and A upwards.',
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
