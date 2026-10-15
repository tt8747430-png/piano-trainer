import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const G_MAJOR = { tonic: note('G'), minor: false }
const D_MAJOR = { tonic: note('D'), minor: false }

/** Intermediate Piano Playing, lesson 2: the sharp, G major's F♯ and its signature. */
const sharps: Lesson = {
  id: 'sharps',
  title: { en: 'Sharps', ru: 'Диезы' },
  summary: {
    en: 'A sharp raises a note a semitone. G major needs one, F♯, and writes it once in its key signature.',
    ru: 'Диез повышает звук на полутон. Соль мажору нужен один диез, фа-диез, и он пишется один раз в ключе.',
  },
  sections: [
    {
      heading: { en: 'The sharp sign', ru: 'Знак диеза' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Sharp (♯):', ru: 'Диез (♯):' },
          text: {
            en: 'raises a note by a semitone, to the very next key on the right. Usually that is a black key: F♯ sits just above F.',
            ru: 'повышает звук на полутон, к ближайшей клавише справа. Обычно это чёрная клавиша: фа-диез стоит сразу над фа.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F4/2 F#4/2 C4/2 C#4/2' },
      ],
    },
    {
      heading: { en: 'G major needs F♯', ru: 'Соль мажору нужен фа-диез' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A major scale needs a semitone between its 7th note and the top. From G that 7th note must be F♯, not F.',
            ru: 'В мажорной гамме между седьмой ступенью и верхней тоникой полутон. От соль седьмой ступенью должен быть фа-диез, а не фа.',
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
            en: 'the sharps written once at the start of each line. One sharp on the F line makes every F an F♯, in every octave.',
            ru: 'знаки, выписанные один раз в начале каждой строки. Один диез на линейке фа делает каждое фа фа-диезом в любой октаве.',
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
            en: 'Put the right thumb on G, a finger on each key up to D. When F♯ comes, the thumb shifts down or the hand stretches.',
            ru: 'Поставьте первый палец правой руки на соль, по пальцу на каждую клавишу до ре. Когда появится фа-диез, рука сдвигается вниз или растягивается.',
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
            en: 'The main chords of G are G, C and D. D major holds the F♯, so the sharp sounds in the harmony too.',
            ru: 'Главные аккорды соль мажора — G, C и D. В ре мажоре звучит фа-диез, так что диез слышен и в гармонии.',
          },
        },
        { kind: 'chords', symbols: ['G', 'C', 'D'], apart: true },
        { kind: 'progression', numerals: 'I IV V7 I', key: G_MAJOR },
      ],
    },
    {
      heading: { en: 'One more sharp: D major', ru: 'Ещё один диез: ре мажор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each key a 5th higher adds one sharp. D major has F♯ and C♯. Sharps always arrive in the same order: F C G D A E B.',
            ru: 'Каждая тональность квинтой выше добавляет один диез. В ре мажоре фа-диез и до-диез. Диезы всегда появляются в одном порядке: фа, до, соль, ре, ля, ми, си.',
          },
        },
        { kind: 'scale', root: note('D'), scale: 'major' },
        { kind: 'notes', clef: 'treble', notes: 'D4 E4 F#4 G4 A4 B4 C#5 D5', key: D_MAJOR },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play F♯.', ru: 'Сыграйте фа-диез.' },
          answer: { notes: ['F#'] },
        },
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
            en: 'Play the chord of G major that holds the F♯.',
            ru: 'Сыграйте аккорд соль мажора, в котором есть фа-диез.',
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
