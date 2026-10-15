import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const F_MAJOR = { tonic: note('F'), minor: false }
const B_FLAT_MAJOR = { tonic: note('B', -1), minor: false }

/** Intermediate Piano Playing, lesson 3: the flat, F major's B♭ and playing in F. */
const flats: Lesson = {
  id: 'flats',
  title: { en: 'Flats', ru: 'Бемоли' },
  summary: {
    en: 'A flat lowers a note a semitone. F major needs one, B♭, and its fingering puts the 4th finger on it.',
    ru: 'Бемоль понижает звук на полутон. Фа мажору нужен один бемоль, си-бемоль, и в аппликатуре на него ложится четвёртый палец.',
  },
  sections: [
    {
      heading: { en: 'The flat sign', ru: 'Знак бемоля' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Flat (♭):', ru: 'Бемоль (♭):' },
          text: {
            en: 'lowers a note by a semitone, to the very next key on the left. B♭ is the black key just below B.',
            ru: 'понижает звук на полутон, к ближайшей клавише слева. Си-бемоль — чёрная клавиша сразу под си.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'B4/2 Bb4/2 E4/2 Eb4/2' },
      ],
    },
    {
      heading: { en: 'F major needs B♭', ru: 'Фа мажору нужен си-бемоль' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A major scale has a semitone between its 3rd and 4th notes. From F the 3rd is A, so the 4th must be B♭.',
            ru: 'В мажорной гамме между третьей и четвёртой ступенями полутон. От фа третья ступень — ля, значит, четвёртая должна быть си-бемоль.',
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
            en: 'F major writes one flat, on the B line, at the start of every line. Every B you read is then B♭.',
            ru: 'В фа мажоре в начале каждой строки стоит один бемоль на линейке си. Каждое си, которое вы читаете, — си-бемоль.',
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
          kind: 'notes',
          clef: 'treble',
          notes: 'F4/8 G4/8 A4/8 Bb4/8 C5/8 D5/8 E5/8 F5/8 F5/1',
          key: F_MAJOR,
        },
        {
          kind: 'text',
          text: {
            en: 'The right hand plays 1-2-3-4, 1-2-3-4. The 4th finger takes B♭ and the thumb passes under onto C. The left hand plays 5-4-3-2-1, 3-2-1.',
            ru: 'Правая рука играет 1-2-3-4, 1-2-3-4. Четвёртый палец берёт си-бемоль, а первый подкладывается на до. Левая играет 5-4-3-2-1, 3-2-1.',
          },
        },
      ],
    },
    {
      heading: { en: 'F major’s chords', ru: 'Аккорды фа мажора' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The main chords of F are F, B♭ and C. B♭ major stands on the flat itself: B♭, D, F.',
            ru: 'Главные аккорды фа мажора — F, B♭ и C. Си-бемоль мажор строится от самого бемоля: си-бемоль, ре, фа.',
          },
        },
        { kind: 'chords', symbols: ['F', 'B♭', 'C'], apart: true },
        { kind: 'progression', numerals: 'I IV V7 I', key: F_MAJOR },
      ],
    },
    {
      heading: { en: 'One more flat: B♭ major', ru: 'Ещё один бемоль: си-бемоль мажор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each key a 5th lower adds one flat. B♭ major has B♭ and E♭. Flats arrive in the order B E A D G C F.',
            ru: 'Каждая тональность квинтой ниже добавляет один бемоль. В си-бемоль мажоре си-бемоль и ми-бемоль. Бемоли появляются в порядке си, ми, ля, ре, соль, до, фа.',
          },
        },
        { kind: 'scale', root: note('B', -1), scale: 'major' },
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
          ask: { en: 'Play B♭.', ru: 'Сыграйте си-бемоль.' },
          answer: { notes: ['Bb'] },
        },
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
            en: 'Play the chord built on F major’s flat.',
            ru: 'Сыграйте аккорд, построенный на бемоле фа мажора.',
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
