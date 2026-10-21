import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const F_MAJOR = { tonic: note('F'), minor: false }
const B_FLAT_MAJOR = { tonic: note('B', -1), minor: false }

/** Intermediate Piano Playing, lesson 3: the flat, F major's B♭ and playing in F. */
const flats: Lesson = {
  id: 'flats',
  title: { en: 'Flats', ru: 'Бемоли' },
  summary: {
    en: 'Learn what a flat does, why F major needs B♭, and play in F with B♭ under finger 4.',
    ru: 'Узнать, что делает бемоль, зачем фа мажору си-бемоль, и играть в фа мажоре, беря си-бемоль четвёртым пальцем.',
  },
  sections: [
    {
      heading: { en: 'The flat sign', ru: 'Знак бемоля' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Flat (♭):', ru: 'Бемоль (♭):' },
          text: {
            en: 'lowers a note by a semitone, the very next key to the left. B♭ is the black key just left of B.',
            ru: 'понижает звук на полутон, то есть на соседнюю клавишу слева. Си-бемоль — чёрная клавиша сразу слева от си.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'B4/2 Bb4/2 E4/2 Eb4/2' },
      ],
    },
    {
      heading: { en: 'Why F major needs B♭', ru: 'Зачем фа мажору си-бемоль' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In a major scale, the 3rd and 4th notes are a semitone apart. From F the 3rd note is A, so the 4th must be B♭.',
            ru: 'В мажорной гамме между третьей и четвёртой ступенями полутон. От фа третья ступень — ля, значит, четвёртая — си-бемоль.',
          },
        },
        { kind: 'scale', root: note('F'), scale: 'major' },
      ],
    },
    {
      heading: { en: 'One flat in the signature', ru: 'Один бемоль в ключе' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'F major’s key signature is one flat, on the B line, at the start of every line. Every B is then B♭.',
            ru: 'В фа мажоре в начале каждой строки стоит один бемоль, на линейке си. Поэтому каждое си — си-бемоль.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'F4 G4 A4 Bb4 C5/2 A4/2 Bb4 G4 E4 G4 F4/1',
          key: F_MAJOR,
        },
      ],
    },
    {
      heading: { en: 'Fingering F major', ru: 'Аппликатура фа мажора' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Right hand going up: 1-2-3-4 for F G A B♭, then the thumb passes under to C for 1-2-3-4 again. Left hand: 5-4-3-2-1, then 3-2-1.',
            ru: 'Правая рука вверх: 1-2-3-4 на фа, соль, ля, си-бемоль, затем первый подкладывается на до, и снова 1-2-3-4. Левая: 5-4-3-2-1, затем 3-2-1.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'F4/8 G4/8 A4/8 Bb4/8 C5/8 D5/8 E5/8 F5/8 F5/1',
          key: F_MAJOR,
        },
      ],
    },
    {
      heading: { en: 'F major’s chords', ru: 'Аккорды фа мажора' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'F major’s three main chords are F, B♭ and C. The B♭ chord is built on the flat itself: B♭, D and F.',
            ru: 'Три главных аккорда фа мажора — F, B♭ и C. Аккорд B♭ строится от самого бемоля: си-бемоль, ре и фа.',
          },
        },
        { kind: 'progression', numerals: 'I IV V7 I', key: F_MAJOR },
      ],
    },
    {
      heading: { en: 'One more flat: B♭ major', ru: 'Ещё один бемоль: си-бемоль мажор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each key a 5th lower adds one flat. B♭ major has B♭ and E♭. Flats always arrive in the order B E A D G C F.',
            ru: 'Каждая тональность квинтой ниже добавляет один бемоль. В си-бемоль мажоре си-бемоль и ми-бемоль. Порядок бемолей всегда один: си, ми, ля, ре, соль, до, фа.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'Bb3 C4 D4 Eb4 F4 G4 A4 Bb4',
          key: B_FLAT_MAJOR,
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the F major scale up from F.',
            ru: 'Сыграйте гамму фа мажор вверх от фа.',
          },
          answer: { notes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E', 'F'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the main chord of F major that is built on its flat.',
            ru: 'Сыграйте главный аккорд фа мажора, построенный от его бемоля.',
          },
          answer: { chord: 'B♭' },
        },
        {
          kind: 'question',
          ask: { en: 'Play B♭ major’s two flats.', ru: 'Сыграйте два бемоля си-бемоль мажора.' },
          answer: { notes: ['Bb', 'Eb'] },
        },
        {
          kind: 'link',
          title: { en: 'F major on the circle of fifths', ru: 'Фа мажор на квинтовом круге' },
          target: { opens: 'key', key: F_MAJOR },
        },
        {
          kind: 'link',
          title: { en: 'F major scale in the Player', ru: 'Гамма фа мажор в плеере' },
          target: { opens: 'exercise', exercise: 'scale', root: note('F') },
        },
        {
          kind: 'link',
          title: { en: 'Name key signatures in the Quiz', ru: 'Ключевые знаки в тестах' },
          target: { opens: 'quiz', trainer: 'key-signatures' },
        },
      ],
    },
  ],
}

export default flats
