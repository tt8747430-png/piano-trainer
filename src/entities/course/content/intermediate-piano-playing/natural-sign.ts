import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const G_MAJOR = { tonic: note('G'), minor: false }
const F_MAJOR = { tonic: note('F'), minor: false }
const D_MAJOR = { tonic: note('D'), minor: false }
const D_MINOR = { tonic: note('D'), minor: true }

/** Intermediate Piano Playing, lesson 8: the natural, cancelling a sharp or flat for the rest of a bar. */
const naturalSign: Lesson = {
  id: 'natural-sign',
  title: { en: 'The natural sign', ru: 'Знак бекара' },
  summary: {
    en: 'A natural cancels a sharp or a flat until the barline. A courtesy accidental reminds you of what the barline already did.',
    ru: 'Бекар отменяет диез или бемоль до конца такта. Предупредительный знак напоминает о том, что уже сделала тактовая черта.',
  },
  sections: [
    {
      heading: { en: 'The natural sign', ru: 'Знак бекара' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Natural (♮):', ru: 'Бекар (♮):' },
          text: {
            en: 'cancels a sharp or a flat, so the plain white key returns. In G major every F is F♯, until a natural makes it F.',
            ru: 'отменяет диез или бемоль, и возвращается обычная белая клавиша. В соль мажоре каждое фа — фа-диез, пока бекар не сделает его просто фа.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4 F#4 G4/2 G4 F4 E4/2', key: G_MAJOR },
      ],
    },
    {
      heading: { en: 'It lasts the bar', ru: 'Действует до конца такта' },
      blocks: [
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C5 B4 A4 B4 C5/2 Bb4 A4 F4/1',
          key: F_MAJOR,
        },
        {
          kind: 'text',
          text: {
            en: 'In F every B is B♭. The natural in bar 1 makes both its Bs plain. The barline cancels it, so bar 2’s B is B♭ again.',
            ru: 'В фа мажоре каждое си — си-бемоль. Бекар в первом такте делает оба си простыми. Тактовая черта отменяет его, и во втором такте снова си-бемоль.',
          },
        },
      ],
    },
    {
      heading: { en: 'Courtesy accidentals', ru: 'Предупредительные знаки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Courtesy accidental:', ru: 'Предупредительный знак:' },
          text: {
            en: 'a reminder, often in brackets, after a barline has cancelled a sign. It changes nothing, it only helps you read.',
            ru: 'напоминание, часто в скобках, после того как тактовая черта уже отменила знак. Он ничего не меняет, а лишь помогает читать.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 F#4 G4/2 F4 E4 D4/2' },
      ],
    },
    {
      heading: { en: 'A natural in D major', ru: 'Бекар в ре мажоре' },
      blocks: [
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'A4 B4 C#5 D5 C5 B4 A4/2',
          key: D_MAJOR,
        },
        {
          kind: 'text',
          text: {
            en: 'D major has C♯. A natural lowers it to C for a moment, and the tune takes on a folk colour.',
            ru: 'В ре мажоре есть до-диез. Бекар на миг понижает его до до, и мелодия приобретает народный оттенок.',
          },
        },
      ],
    },
    {
      heading: { en: 'A natural changes the chord', ru: 'Бекар меняет аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In G major, F♮ added to G makes G7. Its pull leads to C, the chord of IV.',
            ru: 'В соль мажоре фа-бекар, добавленный к G, превращает его в G7. Это тяготение ведёт к C, аккорду IV ступени.',
          },
        },
        { kind: 'chords', symbols: ['G', 'G7', 'C'] },
      ],
    },
    {
      heading: { en: 'A natural in a song', ru: 'Бекар в песне' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Scarborough Fair is written in D minor, whose signature flats every B. Its tune sings B♮ instead, an old Dorian colour.',
            ru: '«Ярмарка в Скарборо» записана в ре миноре, где в ключе стоит си-бемоль. А мелодия поёт си-бекар — старинная дорийская краска.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'D5/2 C5 A4 B4 G4 A4/2.',
          meter: '3/4',
          key: D_MINOR,
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'In G major, play F♯, then cancel it with a natural.',
            ru: 'В соль мажоре сыграйте фа-диез, затем отмените его бекаром.',
          },
          answer: { notes: ['F#', 'F'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'In F major, play B with a natural.',
            ru: 'В фа мажоре сыграйте си с бекаром.',
          },
          answer: { notes: ['B'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the chord F♮ turns G into.',
            ru: 'Сыграйте аккорд, в который фа-бекар превращает G.',
          },
          answer: { chord: 'G7' },
        },
        {
          kind: 'link',
          title: { en: 'Name key signatures in the Quiz', ru: 'Ключевые знаки в тестах' },
          target: { opens: 'quiz', trainer: 'key-signatures' },
        },
        {
          kind: 'link',
          title: { en: 'Read notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
        {
          kind: 'link',
          title: { en: 'Scarborough Fair in the Player', ru: '«Ярмарка в Скарборо» в плеере' },
          target: { opens: 'piece', piece: 'scarborough-fair' },
        },
      ],
    },
  ],
}

export default naturalSign
