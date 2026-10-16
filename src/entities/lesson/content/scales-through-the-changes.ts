import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

/**
 * Jazz Lab's "A new approach to chord-scale theory" (each chord's scale written from one note, then a
 * few notes of it as a motif) and "The ultimate guide to cool chords" (chords from a mode, constant
 * structures).
 */
const scalesThroughTheChanges: Lesson = {
  id: 'scales-through-the-changes',
  title: { en: 'Scales through the changes', ru: 'Гаммы сквозь гармонию' },
  summary: {
    en: 'Solo through changes by moving only the notes that change.',
    ru: 'Играть соло по гармонии, меняя только те звуки, что меняются.',
  },
  sections: [
    {
      heading: { en: 'A scale for each chord', ru: 'Гамма для каждого аккорда' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each chord takes a scale. Major: Ionian or Lydian. Minor: Dorian. Dominant: Mixolydian, or altered for ♭9, ♯9 and ♭13.',
            ru: 'Каждому аккорду — своя гамма. Мажор: ионийский или лидийский. Минор: дорийский. Доминанта: миксолидийский или альтерированный для ♭9, ♯9 и ♭13.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'lydian' },
        { kind: 'scale', root: note('D'), scale: 'dorian' },
        { kind: 'scale', root: note('G'), scale: 'mixolydian' },
        {
          kind: 'note',
          text: {
            en: 'Half-diminished takes Locrian ♮2.',
            ru: 'Полууменьшённому — локрийский ♮2.',
          },
        },
      ],
    },
    {
      heading: { en: 'Every scale from one note', ru: 'Все гаммы от одного звука' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play each chord’s scale from the same note. From G: C Dorian, F Dorian, D Locrian ♮2, G altered.',
            ru: 'Играйте гамму каждого аккорда от одного звука. От соль: до дорийский, фа дорийский, ре локрийский ♮2, соль альтерированный.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'G4/8 A4/8 B♭4/8 C5/8 D5/8 E♭5/8 F5/8 G5/8' },
        { kind: 'notes', clef: 'treble', notes: 'G4/8 A♭4/8 B♭4/8 C5/8 D5/8 E♭5/8 F5/8 G5/8' },
        { kind: 'notes', clef: 'treble', notes: 'G4/8 A♭4/8 B♭4/8 C5/8 D5/8 E5/8 F5/8 G5/8' },
        { kind: 'notes', clef: 'treble', notes: 'G4/8 A♭4/8 B♭4/8 B4/8 D♭5/8 E♭5/8 F5/8 G5/8' },
      ],
    },
    {
      heading: { en: 'Only the differences', ru: 'Только различия' },
      blocks: [
        { kind: 'chords', symbols: ['Cm7', 'Fm7', 'Dm7♭5', 'G7alt', 'Cm7'] },
        {
          kind: 'text',
          text: {
            en: 'From Cm7 to Fm7 only A becomes A♭. To Dm7♭5, E♭ becomes E. Learn only what changes.',
            ru: 'От Cm7 к Fm7 только ля становится ля-бемолем. К Dm7♭5 ми-бемоль становится ми. Учите только то, что меняется.',
          },
        },
      ],
    },
    {
      heading: { en: 'Three notes, one motif', ru: 'Три звука, один мотив' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Take three notes of each scale and one short rhythm off the beat. Play it over every chord, a bar each.',
            ru: 'Возьмите три звука каждой гаммы и один короткий ритм не с сильной доли. Играйте его на каждом аккорде, по такту.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes:
            'B♭4/8 C5/8 D5/2. A♭4/8 C5/8 D5/2. A♭4/8 C5/8 E5/2. A♭4/8 B4/8 E♭5/2. B♭4/8 C5/8 D5/2.',
        },
      ],
    },
    {
      heading: { en: 'Chords from a mode', ru: 'Аккорды из лада' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Pick four notes of a chord’s mode, even without its root or 3rd. Use its semitones: C Lydian has F♯–G and B–C.',
            ru: 'Возьмите четыре звука из лада аккорда, даже без основного тона или терции. Используйте его полутоны: в до лидийском это фа-диез–соль и си–до.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'CMaj7♯11', degrees: '1 | 7 1 3 ♯11', hands: 'C3 | B3 C4 E4 F♯4' },
            { symbol: 'CMaj7♯11', degrees: '1 | ♯11 5 7 9', hands: 'C3 | F♯4 G4 B4 D5' },
            { symbol: 'CMaj13♯11', degrees: '1 | 9 ♯11 5 13', hands: 'C3 | D4 F♯4 G4 A4' },
            { symbol: 'CMaj9', degrees: '1 5 | 7 1 9 3', hands: 'C3 G3 | B3 C4 D4 E4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'Constant structures', ru: 'Постоянные структуры' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Keep one shape and move it so its top note sings the melody. Here an augmented triad over the bass carries it.',
            ru: 'Сохраняйте одну фигуру и двигайте её так, чтобы верхний звук пел мелодию. Здесь её ведёт увеличенное трезвучие над басом.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'E♭+', hands: 'G2 | B3 E♭4 G4' },
            { symbol: 'F+', hands: 'A2 | C♯4 F4 A4' },
            { symbol: 'E♭+', hands: 'G2 | B3 E♭4 G4' },
            { symbol: 'C+', hands: 'E2 | G♯3 C4 E4' },
          ],
        },
      ],
    },
    {
      heading: { en: 'In one mode', ru: 'Внутри одного лада' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Or move the shape inside one mode, keeping its accidentals. Each top note climbs C Lydian.',
            ru: 'Или двигайте фигуру внутри одного лада, сохраняя его знаки. Верхний звук поднимается по до лидийскому.',
          },
        },
        {
          kind: 'voicings',
          voicings: [
            { symbol: 'I', hands: '| C4 F♯4 B4 E5' },
            { symbol: 'II', hands: '| D4 G4 C5 F♯5' },
            { symbol: 'III', hands: '| E4 A4 D5 G5' },
            { symbol: 'IV', hands: '| F♯4 B4 E5 A5' },
            { symbol: 'V', hands: '| G4 C5 F♯5 B5' },
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
            en: 'Play the note that makes F Dorian from C Dorian’s notes.',
            ru: 'Сыграйте звук, который превращает до дорийский в фа дорийский.',
          },
          answer: { notes: ['A♭'] },
        },
        {
          kind: 'link',
          title: { en: 'C Lydian in Scales', ru: 'До лидийский в гаммах' },
          target: { opens: 'scales', root: note('C'), scale: 'lydian' },
        },
        {
          kind: 'link',
          title: { en: 'G7alt in Chords', ru: 'G7alt в аккордах' },
          target: { opens: 'chords', chord: 'G7alt' },
        },
      ],
    },
  ],
}

export default scalesThroughTheChanges
