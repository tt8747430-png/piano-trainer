import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const A_MINOR = { tonic: note('A'), minor: true }

const pentatonicImprovisation: Lesson = {
  id: 'pentatonic-improvisation',
  title: { en: 'Improvising with the pentatonic', ru: 'Импровизация на пентатонике' },
  summary: {
    en: 'Make your own melodies over a progression: five safe notes, phrases that answer each other, and landing on the chord.',
    ru: 'Сочиняйте свои мелодии над последовательностью: пять надёжных нот, фразы, отвечающие друг другу, и опора на аккорд.',
  },
  sections: [
    {
      heading: { en: 'Five notes that never clash', ru: 'Пять нот, которые не режут слух' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Over C, F, G and Am, every note of the C major pentatonic sounds right. Start there.',
            ru: 'На аккордах C, F, G и Am любая нота до-мажорной пентатоники звучит верно. Начните с неё.',
          },
        },
        { kind: 'scale', root: note('C'), scale: 'pent' },
      ],
    },
    {
      heading: { en: 'Call and answer', ru: 'Вопрос и ответ' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play a short phrase, rest, then answer it with a changed copy. Space between phrases is part of the music.',
            ru: 'Сыграйте короткую фразу, сделайте паузу и ответьте её изменённой копией. Паузы между фразами — тоже музыка.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4/8 G4/8 A4 G4/2 E4/8 G4/8 A4 C5/2' },
      ],
    },
    {
      heading: { en: 'Land on the chord', ru: 'Опирайтесь на аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'End each phrase on a note of the chord under it: E or G over C, A or C over F.',
            ru: 'Заканчивайте каждую фразу нотой аккорда под ней: ми или соль на C, ля или до на F.',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'G', 'C'] },
        { kind: 'notes', clef: 'treble', notes: 'D5/8 C5/8 A4 G4/2 A4/8 G4/8 E4 C5/2' },
      ],
    },
    {
      heading: { en: 'Keep the rhythm, change the notes', ru: 'Ритм тот же, ноты новые' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Hold one rhythm and change only the notes. Then keep the notes and change the rhythm.',
            ru: 'Сохраняйте один ритм и меняйте только ноты. Потом оставьте ноты и меняйте ритм.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5/8 A4/8 G4 E4/2 D5/8 C5/8 A4 G4/2' },
      ],
    },
    {
      heading: { en: 'Over a loop', ru: 'Над повторяющейся гармонией' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Loop I–V–vi–IV in the left hand and improvise in the right. Begin with two notes, add one at a time.',
            ru: 'Повторяйте I–V–vi–IV левой рукой и импровизируйте правой. Начните с двух нот и добавляйте по одной.',
          },
        },
        { kind: 'progression', numerals: 'I V vi IV', key: C_MAJOR },
        {
          kind: 'link',
          title: { en: 'Loop I–V–vi–IV in the Player', ru: 'I–V–vi–IV в плеере' },
          target: { opens: 'player', numerals: 'I V vi IV', key: C_MAJOR },
        },
      ],
    },
    {
      heading: { en: 'The minor pentatonic over minor', ru: 'Минорная пентатоника в миноре' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Over Am, Dm and Em, play the A minor pentatonic. It holds the same notes as C’s, centred on A.',
            ru: 'На Am, Dm и Em играйте ля-минорную пентатонику. В ней те же ноты, что в до-мажорной, но с центром на ля.',
          },
        },
        { kind: 'scale', root: note('A'), scale: 'mpent' },
        { kind: 'progression', numerals: 'i iv v i', key: A_MINOR },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the C major pentatonic up from C.',
            ru: 'Сыграйте до-мажорную пентатонику вверх от до.',
          },
          answer: { notes: ['C', 'D', 'E', 'G', 'A'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play a rising phrase from the pentatonic: E, G, A.',
            ru: 'Сыграйте восходящую фразу из пентатоники: ми, соль, ля.',
          },
          answer: { notes: ['E', 'G', 'A'], rising: true },
        },
      ],
    },
  ],
}

export default pentatonicImprovisation
