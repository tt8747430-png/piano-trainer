import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Intermediate Piano Playing, lesson 1: moving the hand beyond five keys without a jump. */
const fingeringTechniques: Lesson = {
  id: 'fingering-techniques',
  title: { en: 'Fingering techniques', ru: 'Приёмы аппликатуры' },
  summary: {
    en: 'Five fingers, eighty-eight keys: pass the thumb under, cross a finger over, swap fingers on a held key and stretch, so a line never breaks.',
    ru: 'Пять пальцев на восемьдесят восемь клавиш: подкладывайте первый палец, перекладывайте пальцы, подменяйте палец на клавише и растягивайте руку, чтобы линия не прерывалась.',
  },
  sections: [
    {
      heading: { en: 'The thumb passes under', ru: 'Подкладывание первого пальца' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Thumb under:', ru: 'Подкладывание:' },
          text: {
            en: 'the thumb slides beneath the hand to the next key. Going up C major, play C D E with 1-2-3, then the thumb takes F.',
            ru: 'первый палец проходит под ладонью к следующей клавише. Вверх по до мажору играйте до, ре, ми пальцами 1-2-3, затем первый палец берёт фа.',
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
            en: 'coming down, a finger reaches over the thumb. Play C B A G F with 5-4-3-2-1, then the 3rd finger crosses onto E.',
            ru: 'при движении вниз палец переносится через первый. Сыграйте до, си, ля, соль, фа пальцами 5-4-3-2-1, затем третий палец перекладывается на ми.',
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
            en: 'The left hand mirrors the right. Going up C major it plays 5-4-3-2-1, then the 3rd finger crosses over the thumb onto A.',
            ru: 'Левая рука зеркальна правой. Вверх по до мажору она играет 5-4-3-2-1, затем третий палец перекладывается через первый на ля.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'C3/8 D3/8 E3/8 F3/8 G3/8 A3/8 B3/8 C4/8 C4/1',
        },
        { kind: 'scale', root: note('C'), scale: 'major' },
      ],
    },
    {
      heading: { en: 'Swapping fingers on a key', ru: 'Подмена пальца' },
      blocks: [
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'E4/2~ E4/2 F4 G4 A4 B4',
        },
        {
          kind: 'text',
          lead: { en: 'Finger substitution:', ru: 'Подмена пальца:' },
          text: {
            en: 'changing fingers on a held key without lifting it. Hold E with 3, slip the thumb onto it, and 2-3-4-5 reach up to B.',
            ru: 'смена пальца на звучащей клавише без её снятия. Держите ми третьим, незаметно подставьте первый, и пальцы 2-3-4-5 дотянутся до си.',
          },
        },
      ],
    },
    {
      heading: { en: 'Stretching the hand', ru: 'Растяжка' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Extension:', ru: 'Растяжка:' },
          text: {
            en: 'a finger reaches past the five-finger position while the hand stays put. Keep the thumb on C and stretch the 5th finger up to A.',
            ru: 'палец выходит за пределы позиции, а рука остаётся на месте. Держите первый палец на до и дотянитесь пятым до ля.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 E4 G4 A4 G4 E4 C4/2' },
        { kind: 'interval', root: note('C'), interval: 'M6' },
      ],
    },
    {
      heading: { en: 'Choosing a fingering', ru: 'Как выбрать аппликатуру' },
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
              en: 'Write the fingers in and keep them every time.',
              ru: 'Подпишите пальцы и играйте ими каждый раз.',
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
            en: 'Play C major up an octave with the right hand, the thumb passing under onto F.',
            ru: 'Сыграйте до мажор вверх на октаву правой рукой, подкладывая первый палец на фа.',
          },
          answer: { notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Going down, the 3rd finger crosses over the thumb onto which note? Play it.',
            ru: 'При движении вниз на какую ноту перекладывается третий палец? Сыграйте её.',
          },
          answer: { notes: ['E'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Keep the thumb on C and stretch: play C, E, G and A upwards.',
            ru: 'Держите первый палец на до и растяните руку: сыграйте до, ми, соль и ля вверх.',
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
          title: { en: 'The five-finger position', ru: 'Позиция пяти пальцев' },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('G') },
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
