import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const A_MINOR = { tonic: note('A'), minor: true }

const pentatonicImprovisation: Lesson = {
  id: 'pentatonic-improvisation',
  title: { en: 'Improvising with the pentatonic', ru: 'Импровизация на пентатонике' },
  summary: {
    en: 'Make up melodies over a chord loop with five notes that always fit, step by step.',
    ru: 'Сочинять мелодии на ходу над повторяющимися аккордами, на пяти нотах, которые всегда подходят.',
  },
  sections: [
    {
      heading: { en: 'Five notes that never clash', ru: 'Пять нот, которые не режут слух' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Over C, F, G and Am, every note of the C major pentatonic sounds right. Start your solos with these five.',
            ru: 'На аккордах C, F, G и Am любая нота до-мажорной пентатоники звучит верно. Начинайте импровизацию с этих пяти.',
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
            en: 'Play a short phrase and rest. Then answer it: play it again with the ending changed.',
            ru: 'Сыграйте короткую фразу и сделайте паузу. Затем ответьте: повторите её с другим окончанием.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4/8 G4/8 A4 G4/2 E4/8 G4/8 A4 C5/2' },
        {
          kind: 'text',
          text: {
            en: 'Here the call ends on G, the answer on C.',
            ru: 'Здесь вопрос кончается на соль, ответ — на до.',
          },
        },
      ],
    },
    {
      heading: { en: 'Land on the chord', ru: 'Опирайтесь на аккорд' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'End each phrase on a note of the chord below it: E or G over C, A or C over F.',
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
            en: 'Keep one rhythm and change only the notes. Then keep the notes and change the rhythm.',
            ru: 'Сохраните один ритм и меняйте только ноты. Потом оставьте ноты и меняйте ритм.',
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
            en: 'Repeat I V vi IV in the left hand and improvise in the right. Start with two notes. Add one at a time.',
            ru: 'Повторяйте I V vi IV левой рукой и импровизируйте правой. Начните с двух нот. Добавляйте по одной.',
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
            en: 'Over Am, Dm and Em, play the A minor pentatonic. It has the same notes, but A is now home.',
            ru: 'На Am, Dm и Em играйте ля-минорную пентатонику. Ноты те же, но опора теперь на ля.',
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
            en: 'Play the two pentatonic notes that end a phrase over F.',
            ru: 'Сыграйте две ноты пентатоники, которыми заканчивают фразу на F.',
          },
          answer: { notes: ['A', 'C'] },
        },
        {
          kind: 'link',
          title: { en: 'A blues in A in the Player', ru: 'Блюз в ля в плеере' },
          target: {
            opens: 'player',
            numerals: 'I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7',
            key: { tonic: note('A'), minor: false },
          },
        },
      ],
    },
  ],
}

export default pentatonicImprovisation
