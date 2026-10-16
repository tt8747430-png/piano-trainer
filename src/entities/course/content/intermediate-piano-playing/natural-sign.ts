import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const G_MAJOR = { tonic: note('G'), minor: false }
const F_MAJOR = { tonic: note('F'), minor: false }
const D_MINOR = { tonic: note('D'), minor: true }

/** Intermediate Piano Playing, lesson 8: the natural, cancelling a sharp or flat for the rest of a bar. */
const naturalSign: Lesson = {
  id: 'natural-sign',
  title: { en: 'The natural sign', ru: 'Знак бекара' },
  summary: {
    en: 'Read a natural that cancels the key’s sharp or flat.',
    ru: 'Читать бекар, отменяющий ключевой диез или бемоль.',
  },
  sections: [
    {
      heading: { en: 'The natural sign', ru: 'Знак бекара' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Natural (♮):', ru: 'Бекар (♮):' },
          text: {
            en: 'cancels a sharp or a flat. In G major every F is F♯, until a natural makes it F.',
            ru: 'отменяет диез или бемоль. В соль мажоре каждое фа — фа-диез, пока бекар не сделает его просто фа.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4 F#4 G4/2 G4 F4 E4/2', key: G_MAJOR },
      ],
    },
    {
      heading: { en: 'It lasts the bar', ru: 'Действует до конца такта' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In F every B is B♭. The natural in bar 1 makes both its Bs plain. In bar 2, B is B♭ again.',
            ru: 'В фа мажоре каждое си — си-бемоль. Бекар в первом такте делает оба си простыми. Во втором такте снова си-бемоль.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C5 B4 A4 B4 C5/2 Bb4 A4 F4/1',
          key: F_MAJOR,
        },
      ],
    },
    {
      heading: { en: 'A natural changes the chord', ru: 'Бекар меняет аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'In G major, F♮ added to G makes G7. It pulls to C, the IV chord.',
            ru: 'В соль мажоре фа-бекар, добавленный к G, даёт G7. Он тянется к C, аккорду IV ступени.',
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
            en: 'Scarborough Fair is written in D minor, whose signature flats every B. Its tune sings B♮ instead.',
            ru: '«Ярмарка в Скарборо» записана в ре миноре, где в ключе си-бемоль. А мелодия поёт си-бекар.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'D5/2 C5 A4 B4 G4 A4/2.',
          meter: '3/4',
          key: D_MINOR,
        },
        {
          kind: 'link',
          title: { en: 'Scarborough Fair in the Player', ru: '«Ярмарка в Скарборо» в плеере' },
          target: { opens: 'piece', piece: 'scarborough-fair' },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'In G major, play F♯, then F with a natural.',
            ru: 'В соль мажоре сыграйте фа-диез, затем фа-бекар.',
          },
          answer: { notes: ['F#', 'F'] },
        },
        {
          kind: 'question',
          ask: { en: 'In F major, play B with a natural.', ru: 'В фа мажоре сыграйте си-бекар.' },
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
      ],
    },
  ],
}

export default naturalSign
