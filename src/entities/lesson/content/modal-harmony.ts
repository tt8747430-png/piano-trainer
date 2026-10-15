import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const modalHarmony: Lesson = {
  id: 'modal-harmony',
  title: { en: 'Chords of the modes', ru: 'Аккорды ладов' },
  summary: {
    en: 'A mode is heard through two chords: its tonic, and the chord that holds its colour note.',
    ru: 'Лад слышен через два аккорда: тонический и тот, в котором звучит его характерная нота.',
  },
  sections: [
    {
      heading: { en: 'Dorian: i and IV', ru: 'Дорийский: i и IV' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Swing between Dm and G. The B in G is Dorian’s raised 6th.',
            ru: 'Чередуйте Dm и G. Си в аккорде G — повышенная шестая ступень дорийского лада.',
          },
        },
        { kind: 'progression', numerals: 'i IV i IV', key: { tonic: note('D'), minor: true } },
      ],
    },
    {
      heading: { en: 'Mixolydian: I and ♭VII', ru: 'Миксолидийский: I и ♭VII' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Go from G to F and back. The F is Mixolydian’s lowered 7th, the sound of rock and gospel vamps.',
            ru: 'Переходите от G к F и обратно. Фа — пониженная седьмая ступень миксолидийского лада, звук рок- и госпел-вампов.',
          },
        },
        { kind: 'progression', numerals: 'I ♭VII IV I', key: { tonic: note('G'), minor: false } },
      ],
    },
    {
      heading: { en: 'Lydian: I and II', ru: 'Лидийский: I и II' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Move from F to G over a held F in the bass. The B in G is Lydian’s raised 4th.',
            ru: 'Переходите от F к G над выдержанным фа в басу. Си в аккорде G — повышенная четвёртая ступень лидийского лада.',
          },
        },
        { kind: 'chords', symbols: ['F', 'G/F', 'F', 'G/F'] },
      ],
    },
    {
      heading: { en: 'Phrygian: i and ♭II', ru: 'Фригийский: i и ♭II' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Slide from Em to F and back. The half step above the tonic is Phrygian’s colour.',
            ru: 'Скользите от Em к F и обратно. Полутон над тоникой — краска фригийского лада.',
          },
        },
        { kind: 'chords', symbols: ['Em', 'F', 'Em', 'F'] },
      ],
    },
    {
      heading: { en: 'Aeolian: i, ♭VI, ♭VII', ru: 'Эолийский: i, ♭VI, ♭VII' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The natural minor climbs Am, F, G back to Am, with no major V to pull it home.',
            ru: 'Натуральный минор идёт Am, F, G и снова Am, без мажорной V, которая тянет к тонике.',
          },
        },
        { kind: 'progression', numerals: 'i VI VII i', key: { tonic: note('A'), minor: true } },
      ],
    },
    {
      heading: { en: 'Stay on the vamp', ru: 'Оставайтесь на вампе' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Modal music stays on its two chords for a long time. Improvise over the vamp with the mode’s notes.',
            ru: 'Ладовая музыка долго стоит на своих двух аккордах. Импровизируйте над вампом нотами лада.',
          },
        },
        { kind: 'scale', root: note('D'), scale: 'dorian' },
        {
          kind: 'link',
          title: { en: 'D Dorian on Scales and keys', ru: 'Ре дорийский в разделе «Гаммы»' },
          target: { opens: 'scales', root: note('D'), scale: 'dorian', show: 'chords' },
        },
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
          title: { en: 'D Dorian', ru: 'Ре дорийский' },
          target: { opens: 'scales', root: note('D'), scale: 'dorian' },
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
