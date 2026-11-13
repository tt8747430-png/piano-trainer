import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

/** Sixteen-Week Practice Plan: arpeggios over two octaves, their fingering, the thumb's pass and practice rhythms. */
const arpeggios: Lesson = {
  id: 'arpeggios',
  title: { en: 'Arpeggios and their fingering', ru: 'Арпеджио и аппликатура' },
  summary: {
    en: 'From the broken chord to two octaves: the fingers in each hand, the thumb’s pass under, the black-key keys, and rhythms that make them even.',
    ru: 'От разложенного аккорда к двум октавам: пальцы каждой руки, подкладывание большого пальца, тональности от чёрных клавиш и ритмы для ровности.',
  },
  after: ['inversion-drills'],
  sections: [
    {
      heading: { en: 'The broken chord first', ru: 'Сначала разложенный аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Before the thumb crosses, play the chord broken in one hand position. Right hand C, E, G, C with 1-2-3-5, and back.',
            ru: 'Прежде чем подкладывать палец, сыграйте аккорд разложенным в одной позиции. Правая рука до, ми, соль, до пальцами 1-2-3-5 и обратно.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/8 E4/8 G4/8 C5/8 G4/8 E4/8 C4/4' },
      ],
    },
    {
      heading: { en: 'Two octaves: the right hand', ru: 'Две октавы: правая рука' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The right hand plays 1-2-3, the thumb passes under to the next C, then 1-2-3-5: 1-2-3-1-2-3-5. Coming down, 3 crosses over the thumb.',
            ru: 'Правая рука играет 1-2-3, большой палец подкладывается к следующему до, затем 1-2-3-5: 1-2-3-1-2-3-5. Вниз третий палец перекладывается через первый.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 E4/8 G4/8 C5/8 E5/8 G5/8 C6/4 G5/8 E5/8 C5/8 G4/8 E4/8 C4/8 r/4',
        },
      ],
    },
    {
      heading: { en: 'Two octaves: the left hand', ru: 'Две октавы: левая рука' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The left hand climbs 5-4-2-1, then 4 crosses over the thumb: 5-4-2-1-4-2-1. Coming down, the thumb passes under after 4.',
            ru: 'Левая рука поднимается 5-4-2-1, затем четвёртый перекладывается через большой: 5-4-2-1-4-2-1. Вниз большой палец подкладывается после четвёртого.',
          },
        },
        {
          kind: 'notes',
          clef: 'bass',
          notes: 'C2/8 E2/8 G2/8 C3/8 E3/8 G3/8 C4/4 G3/8 E3/8 C3/8 G2/8 E2/8 C2/8 r/4',
        },
      ],
    },
    {
      heading: { en: 'White-key roots', ru: 'От белых клавиш' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'On C, D, E, F, G and A, major or minor, both hands keep these same fingers. Only the black keys inside change where the hand sits.',
            ru: 'От до, ре, ми, фа, соль и ля, в мажоре и миноре, обе руки играют теми же пальцами. Меняется только положение руки из-за чёрных клавиш.',
          },
        },
        { kind: 'chords', symbols: ['D', 'E', 'A', 'Dm', 'Em', 'Am'], apart: true },
      ],
    },
    {
      heading: { en: 'Black-key roots', ru: 'От чёрных клавиш' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Starting on a black key, the right thumb takes the first white key instead. B♭ major: 4-1-2-4-1-2-4, the thumb on D. E♭ major: the same, the thumb on G.',
            ru: 'От чёрной клавиши большой палец правой руки берёт первую белую. Си-бемоль мажор: 4-1-2-4-1-2-4, большой на ре. Ми-бемоль мажор: так же, большой на соль.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'B♭3/8 D4/8 F4/8 B♭4/8 D5/8 F5/8 B♭5/4',
        },
      ],
      takeaway: {
        en: 'The thumb never takes a black key in an arpeggio.',
        ru: 'В арпеджио большой палец не ставится на чёрную клавишу.',
      },
    },
    {
      heading: { en: 'A silent thumb', ru: 'Незаметный большой палец' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move the thumb under early, while 3 is still down. Keep the wrist level and let the forearm turn a little. You should not hear the crossing.',
            ru: 'Подводите большой палец заранее, пока третий ещё на клавише. Запястье ровное, предплечье чуть поворачивается. Переход не должен быть слышен.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4/8 G4/8 C5/8 E5/8 G5/8 E5/8 C5/8 G4/8 E4/1' },
      ],
    },
    {
      heading: { en: 'Rhythms make it even', ru: 'Ритмы для ровности' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Practise long-short, then short-long, then even. Then climb the ladder in eighths: 60, 80, 100, 120. Hands apart first, then together.',
            ru: 'Играйте долго-коротко, затем коротко-долго, затем ровно. Потом лестница темпов восьмыми: 60, 80, 100, 120. Сначала отдельно, потом вместе.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8. E4/16 G4/8. C5/16 E5/8. G5/16 C6/4',
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the G major arpeggio up one octave with 1-2-3-5.',
            ru: 'Сыграйте арпеджио соль мажор на октаву вверх пальцами 1-2-3-5.',
          },
          answer: { notes: ['G', 'B', 'D', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the B♭ major arpeggio up one octave, the thumb on D.',
            ru: 'Сыграйте арпеджио си-бемоль мажор на октаву вверх, большой палец на ре.',
          },
          answer: { notes: ['B♭', 'D', 'F', 'B♭'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Arpeggio on C in the Player', ru: 'Арпеджио от до в плеере' },
          target: { opens: 'exercise', exercise: 'arpeggio', root: note('C') },
        },
        {
          kind: 'link',
          title: { en: 'Arpeggio on B♭ in the Player', ru: 'Арпеджио от си-бемоль в плеере' },
          target: { opens: 'exercise', exercise: 'arpeggio', root: note('B', -1) },
        },
      ],
    },
  ],
}

export default arpeggios
