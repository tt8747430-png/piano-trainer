import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const G_MAJOR = { tonic: note('G'), minor: false }
const D_MAJOR = { tonic: note('D'), minor: false }

/** Intermediate Piano Playing, lesson 2: the sharp, G major's F♯ and its signature. */
const sharps: Lesson = {
  id: 'sharps',
  title: { en: 'Sharps', ru: 'Диезы' },
  summary: {
    en: 'Learn what a sharp does, why G major needs F♯, and how a key signature writes it.',
    ru: 'Узнать, что делает диез, зачем соль мажору фа-диез и как его пишут ключевые знаки.',
  },
  sections: [
    {
      heading: { en: 'The sharp sign', ru: 'Знак диеза' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Sharp (♯):', ru: 'Диез (♯):' },
          text: {
            en: 'raises a note by a semitone, the very next key to the right. F♯ is the black key just right of F.',
            ru: 'повышает звук на полутон, то есть на соседнюю клавишу справа. Фа-диез — чёрная клавиша сразу справа от фа.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F4/2 F#4/2 C4/2 C#4/2' },
      ],
    },
    {
      heading: { en: 'Why G major needs F♯', ru: 'Зачем соль мажору фа-диез' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In a major scale, the 7th note sits a semitone below the top note. From G, a semitone below the top G is F♯, so F♯ is the 7th.',
            ru: 'В мажорной гамме седьмая ступень на полутон ниже верхней тоники. От соль на полутон ниже верхнего соль стоит фа-диез: это и есть седьмая ступень.',
          },
        },
        { kind: 'scale', root: note('G'), scale: 'major' },
      ],
    },
    {
      heading: { en: 'The key signature', ru: 'Ключевые знаки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Key signature:', ru: 'Ключевые знаки:' },
          text: {
            en: 'the sharps or flats written once at the start of every line. G major has one sharp, on the F line, so every F is F♯.',
            ru: 'диезы или бемоли в начале каждой строки. В соль мажоре один диез, на линейке фа, поэтому каждое фа в любой октаве — фа-диез.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'D5 E5 F#5 G5 F#5 E5 D5/2', key: G_MAJOR },
      ],
    },
    {
      heading: { en: 'Playing in G', ru: 'Играем в соль мажоре' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Put the right thumb on G and one finger on each key up to D. When the tune dips to F♯, move the thumb down onto it.',
            ru: 'Поставьте первый палец правой руки на соль, по пальцу на каждую клавишу до ре. Когда мелодия опускается на фа-диез, сдвиньте на него первый палец.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'G4 A4 B4 C5 D5/2 B4/2 C5 A4 F#4 A4 G4/1',
          key: G_MAJOR,
        },
      ],
    },
    {
      heading: { en: 'G major’s chords', ru: 'Аккорды соль мажора' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'G major’s three main chords are G, C and D. The D chord holds F♯, so you hear the sharp in the harmony too.',
            ru: 'Три главных аккорда соль мажора — G, C и D. В аккорде D есть фа-диез, поэтому диез слышен и в гармонии.',
          },
        },
        { kind: 'progression', numerals: 'I IV V7 I', key: G_MAJOR },
      ],
    },
    {
      heading: { en: 'One more sharp: D major', ru: 'Ещё один диез: ре мажор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each key a 5th higher adds one sharp. D major has F♯ and C♯. Sharps always arrive in the order F C G D A E B.',
            ru: 'Каждая тональность квинтой выше добавляет один диез. В ре мажоре фа-диез и до-диез. Диезы всегда идут в одном порядке: фа, до, соль, ре, ля, ми, си.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'D4 E4 F#4 G4 A4 B4 C#5 D5', key: D_MAJOR },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the G major scale up from G.',
            ru: 'Сыграйте гамму соль мажор вверх от соль.',
          },
          answer: { notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the main chord of G major that holds F♯.',
            ru: 'Сыграйте главный аккорд соль мажора, в котором есть фа-диез.',
          },
          answer: { chord: 'D' },
        },
        {
          kind: 'question',
          ask: { en: 'Play D major’s two sharps.', ru: 'Сыграйте два диеза ре мажора.' },
          answer: { notes: ['F#', 'C#'] },
        },
        {
          kind: 'link',
          title: { en: 'G major on the circle of fifths', ru: 'Соль мажор на квинтовом круге' },
          target: { opens: 'key', key: G_MAJOR },
        },
        {
          kind: 'link',
          title: { en: 'Name key signatures in the Quiz', ru: 'Ключевые знаки в тестах' },
          target: { opens: 'quiz', trainer: 'key-signatures' },
        },
        {
          kind: 'link',
          title: { en: 'G major scale in the Player', ru: 'Гамма соль мажор в плеере' },
          target: { opens: 'exercise', exercise: 'scale', root: note('G') },
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

export default sharps
