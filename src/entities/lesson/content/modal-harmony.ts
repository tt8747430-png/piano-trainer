import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const modalHarmony: Lesson = {
  id: 'modal-harmony',
  title: { en: 'Chords of the modes', ru: 'Аккорды ладов' },
  summary: {
    en: 'Make each mode heard with two chords: its tonic, and a chord that holds its colour note.',
    ru: 'Показывать каждый лад двумя аккордами: тоникой и аккордом с его характерной нотой.',
  },
  sections: [
    {
      heading: { en: 'Dorian: i and IV', ru: 'Дорийский: i и IV' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A modal vamp', ru: 'Ладовый вамп' },
          text: {
            en: 'repeats two chords: the tonic and a chord with the mode’s colour note. In D Dorian, G holds B, the raised 6th.',
            ru: '— это два аккорда по кругу: тоника и аккорд с характерной нотой лада. В ре дорийском G содержит си, повышенную шестую ступень.',
          },
        },
        { kind: 'progression', numerals: 'i IV i IV', key: { tonic: note('D'), minor: true } },
      ],
    },
    {
      heading: { en: 'Phrygian: i and ♭II', ru: 'Фригийский: i и ♭II' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Slide from Em to F and back. F sits a half step above the tonic, Phrygian’s colour.',
            ru: 'Скользите от Em к F и обратно. Фа на полутон выше тоники — краска фригийского лада.',
          },
        },
        { kind: 'chords', symbols: ['Em', 'F', 'Em', 'F'] },
      ],
    },
    {
      heading: { en: 'Lydian: I and II', ru: 'Лидийский: I и II' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move from F to G while the bass holds F. The B in G is Lydian’s raised 4th.',
            ru: 'Переходите от F к G, пока бас держит фа. Си в аккорде G — повышенная четвёртая ступень лидийского лада.',
          },
        },
        { kind: 'chords', symbols: ['F', 'G/F', 'F', 'G/F'] },
      ],
    },
    {
      heading: { en: 'Mixolydian: I and ♭VII', ru: 'Миксолидийский: I и ♭VII' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Go from G to F and back. F is Mixolydian’s lowered 7th. You hear it in rock and gospel vamps.',
            ru: 'Переходите от G к F и обратно. Фа — пониженная седьмая ступень миксолидийского лада. Её слышно в рок- и госпел-вампах.',
          },
        },
        { kind: 'progression', numerals: 'I ♭VII IV I', key: { tonic: note('G'), minor: false } },
      ],
    },
    {
      heading: { en: 'Aeolian: i, ♭VI, ♭VII', ru: 'Эолийский: i, ♭VI, ♭VII' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Natural minor climbs Am, F, G and back to Am. It has no major V pulling it home.',
            ru: 'Натуральный минор идёт Am, F, G и снова Am. В нём нет мажорной V, которая тянет к тонике.',
          },
        },
        { kind: 'progression', numerals: 'i VI VII i', key: { tonic: note('A'), minor: true } },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play IV in D Dorian.', ru: 'Сыграйте IV в ре дорийском.' },
          answer: { chord: 'G' },
        },
        {
          kind: 'question',
          ask: { en: 'Play ♭VII in G Mixolydian.', ru: 'Сыграйте ♭VII в соль миксолидийском.' },
          answer: { chord: 'F' },
        },
        {
          kind: 'question',
          ask: { en: 'Play ♭II in E Phrygian.', ru: 'Сыграйте ♭II в ми фригийском.' },
          answer: { chord: 'F' },
        },
        {
          kind: 'link',
          title: { en: 'The chords of D Dorian', ru: 'Аккорды ре дорийского' },
          target: { opens: 'scales', root: note('D'), scale: 'dorian', show: 'chords' },
        },
        {
          kind: 'link',
          title: { en: 'Scales by ear in the Quiz', ru: 'Гаммы на слух в тестах' },
          target: { opens: 'quiz', trainer: 'scales-by-ear' },
        },
      ],
    },
  ],
}

export default modalHarmony
