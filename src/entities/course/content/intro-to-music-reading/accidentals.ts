import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

/** Sharps, flats and naturals: a half step either way, lasting to the barline, two names for a key. */
const accidentals: Lesson = {
  id: 'accidentals',
  title: { en: 'Accidentals', ru: 'Знаки альтерации' },
  summary: {
    en: 'Read sharps, flats and naturals, and give every black key its names.',
    ru: 'Читать диезы, бемоли и бекары и называть любую чёрную клавишу.',
  },
  sections: [
    {
      heading: { en: 'The half step', ru: 'Полутон' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A half step', ru: 'Полутон' },
          text: {
            en: 'is the move to the key right beside it, black or white. It is the smallest step on the piano. E to F and B to C are half steps too.',
            ru: '— расстояние от клавиши до самой близкой соседней, чёрной или белой. Это самый маленький шаг на фортепиано. Ми — фа и си — до тоже полутоны.',
          },
        },
        { kind: 'interval', root: note('C'), interval: 'm2' },
      ],
    },
    {
      heading: { en: 'The sharp', ru: 'Диез' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A sharp (♯)', ru: 'Диез (♯)' },
          text: {
            en: 'raises a note a half step, to the next key on the right. F♯ is the black key just right of F. The sign goes before the note.',
            ru: 'повышает ноту на полутон, до соседней клавиши справа. Фа-диез — чёрная клавиша справа от фа. Знак пишут перед нотой.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F4 F#4 G4/2' },
      ],
    },
    {
      heading: { en: 'The flat', ru: 'Бемоль' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A flat (♭)', ru: 'Бемоль (♭)' },
          text: {
            en: 'lowers a note a half step, to the next key on the left. B♭ is the black key just left of B.',
            ru: 'понижает ноту на полутон, до соседней клавиши слева. Си-бемоль — чёрная клавиша слева от си.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'B4 Bb4 A4/2' },
      ],
    },
    {
      heading: { en: 'The natural', ru: 'Бекар' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A natural (♮)', ru: 'Бекар (♮)' },
          text: {
            en: 'cancels a sharp or a flat, so the note goes back to its white key. Here F♯ returns to F.',
            ru: 'отменяет диез или бемоль, и нота возвращается на свою белую клавишу. Здесь фа-диез снова становится фа.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F#4 G4 F4/2' },
      ],
    },
    {
      heading: { en: 'A sign lasts to the barline', ru: 'Знак действует до тактовой черты' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An accidental', ru: 'Случайный знак' },
          text: {
            en: 'is a sharp, flat or natural before a note. It lasts to the end of its bar, so the second C♯ needs no sign. The next bar starts fresh.',
            ru: '— диез, бемоль или бекар перед нотой. Он действует до конца такта, поэтому второму до-диезу знак не нужен. В следующем такте до снова без знака.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5 C#5 D5 C#5 C5 D5 C5/2' },
      ],
    },
    {
      heading: { en: 'Two names for one key', ru: 'Два названия одной клавиши' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Enharmonic notes', ru: 'Энгармонически равные звуки' },
          text: {
            en: 'sound the same but are written differently. F♯ and G♭ are the same black key. E♯ and F are the same white key.',
            ru: 'звучат одинаково, но пишутся по-разному. Фа-диез и соль-бемоль — одна и та же чёрная клавиша. Ми-диез и фа — одна белая.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'F#4/2 Gb4/2 E4/2 E#4/2' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 Eb4 F4 G4 Ab4 G4 F4 Eb4 D4 C4/2' },
        {
          kind: 'text',
          text: {
            en: 'A new bar starts without accidentals, so the E♭ in the third bar needs its sign again.',
            ru: 'Новый такт начинается без случайных знаков, поэтому ми-бемолю в третьем такте снова нужен знак.',
          },
        },
        {
          kind: 'question',
          ask: { en: 'Play F♯, then F.', ru: 'Сыграйте фа-диез, затем фа-бекар.' },
          answer: { notes: ['F#', 'F'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play D♭, the other name of C♯.',
            ru: 'Сыграйте ре-бемоль, второе название до-диеза.',
          },
          answer: { notes: ['Db'] },
        },
        {
          kind: 'question',
          ask: { en: 'Play B♭.', ru: 'Сыграйте си-бемоль.' },
          answer: { notes: ['Bb'] },
        },
        {
          kind: 'link',
          title: { en: 'Practise reading notes in the Quiz', ru: 'Чтение нот в тестах' },
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
