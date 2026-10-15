import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

/** Sharps, flats and naturals: a half step either way, lasting to the barline, two names for a key. */
const accidentals: Lesson = {
  id: 'accidentals',
  title: { en: 'Accidentals', ru: 'Знаки альтерации' },
  summary: {
    en: 'Sharps raise, flats lower and naturals cancel, each by a half step and only to the barline. Every black key has two names.',
    ru: 'Диез повышает, бемоль понижает, бекар отменяет — на полутон и только до тактовой черты. У каждой чёрной клавиши два названия.',
  },
  sections: [
    {
      heading: { en: 'The half step', ru: 'Полутон' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A half step', ru: 'Полутон' },
          text: {
            en: 'is the distance from one key to the very next, black or white, with no key between.',
            ru: '— расстояние от клавиши до соседней, чёрной или белой, без клавиш между ними.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'm2' },
        {
          kind: 'note',
          text: {
            en: 'E to F and B to C are half steps between two white keys.',
            ru: 'Ми — фа и си — до — полутоны между двумя белыми клавишами.',
          },
        },
      ],
    },
    {
      heading: { en: 'The sharp', ru: 'Диез' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A sharp (♯)', ru: 'Диез (♯)' },
          text: {
            en: 'raises a note a half step, to the very next key on the right. F♯ is the black key just right of F.',
            ru: 'повышает ноту на полутон, до соседней клавиши справа. Фа-диез — чёрная клавиша сразу справа от фа.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F4 F#4 G4/2' },
        {
          kind: 'question',
          ask: { en: 'Play F♯.', ru: 'Сыграйте фа-диез.' },
          answer: { notes: ['F#'] },
        },
      ],
    },
    {
      heading: { en: 'The flat', ru: 'Бемоль' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A flat (♭)', ru: 'Бемоль (♭)' },
          text: {
            en: 'lowers a note a half step, to the very next key on the left. B♭ is the black key just left of B.',
            ru: 'понижает ноту на полутон, до соседней клавиши слева. Си-бемоль — чёрная клавиша сразу слева от си.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'B4 Bb4 A4/2' },
        {
          kind: 'question',
          ask: { en: 'Play B♭.', ru: 'Сыграйте си-бемоль.' },
          answer: { notes: ['Bb'] },
        },
      ],
    },
    {
      heading: { en: 'The natural', ru: 'Бекар' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A natural (♮)', ru: 'Бекар (♮)' },
          text: {
            en: 'cancels a sharp or a flat. The note goes back to its white key.',
            ru: 'отменяет диез или бемоль. Нота возвращается на свою белую клавишу.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F#4 G4 F4/2' },
        {
          kind: 'question',
          ask: {
            en: 'Play F♯, then F with a natural.',
            ru: 'Сыграйте фа-диез, затем фа-бекар.',
          },
          answer: { notes: ['F#', 'F'] },
        },
      ],
    },
    {
      heading: { en: 'To the barline', ru: 'До тактовой черты' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'An accidental lasts to the end of its bar, so a second C♯ in the bar needs no sign. The barline cancels it.',
            ru: 'Знак действует до конца такта, поэтому второму до-диезу в такте знак не нужен. Тактовая черта его отменяет.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5 C#5 D5 C#5 C5 D5 C5/2' },
        {
          kind: 'note',
          text: {
            en: 'In the second bar every C is C again.',
            ru: 'Во втором такте каждая до — снова до.',
          },
        },
      ],
    },
    {
      heading: { en: 'Two names for one key', ru: 'Два названия одной клавиши' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Enharmonic notes', ru: 'Энгармонически равные звуки' },
          text: {
            en: 'sound the same but are written differently. F♯ and G♭ are one black key.',
            ru: 'звучат одинаково, но пишутся по-разному. Фа-диез и соль-бемоль — одна чёрная клавиша.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F#4/2 Gb4/2 C#5/2 Db5/2' },
        {
          kind: 'question',
          ask: {
            en: 'Play D♭, the other name of C♯.',
            ru: 'Сыграйте ре-бемоль, второе название до-диеза.',
          },
          answer: { notes: ['Db'] },
        },
      ],
    },
    {
      heading: { en: 'White keys with accidentals', ru: 'Белые клавиши со знаками' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'No black key lies between E and F, or B and C. So E♯ is F’s key, and C♭ is B’s.',
            ru: 'Между ми и фа, си и до нет чёрной клавиши. Поэтому ми-диез — это клавиша фа, а до-бемоль — клавиша си.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4/2 E#4/2 C5/2 Cb5/2' },
      ],
    },
    {
      heading: { en: 'Read with accidentals', ru: 'Читайте со знаками' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 Eb4 F4 G4 Ab4 G4 F4 Eb4 D4 C4/2' },
        {
          kind: 'text',
          text: {
            en: 'Each bar writes its own flats. The E♭ in the third bar needs its sign again.',
            ru: 'В каждом такте свои бемоли. Ми-бемолю в третьем такте снова нужен знак.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play C, C♯ and D, each a half step above the last.',
            ru: 'Сыграйте до, до-диез и ре, каждую на полутон выше предыдущей.',
          },
          answer: { notes: ['C', 'C#', 'D'], rising: true },
        },
        {
          kind: 'question',
          ask: { en: 'Play E♭.', ru: 'Сыграйте ми-бемоль.' },
          answer: { notes: ['Eb'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play A♭, the other name of G♯.',
            ru: 'Сыграйте ля-бемоль, второе название соль-диеза.',
          },
          answer: { notes: ['Ab'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play E♯, the key a half step above E.',
            ru: 'Сыграйте ми-диез, клавишу на полутон выше ми.',
          },
          answer: { notes: ['E#'] },
        },
        {
          kind: 'link',
          title: { en: 'Key signatures in the Quiz', ru: 'Ключевые знаки в тестах' },
          target: { opens: 'quiz', trainer: 'key-signatures' },
        },
        {
          kind: 'link',
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
        {
          kind: 'link',
          title: { en: 'Play Oh! Susanna', ru: 'Сыграйте «О, Сюзанна»' },
          target: { opens: 'piece', piece: 'oh-susanna' },
        },
      ],
    },
  ],
}

export default accidentals
