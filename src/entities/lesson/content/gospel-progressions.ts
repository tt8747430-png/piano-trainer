import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const F_MAJOR = { tonic: note('F'), minor: false }
const G_MAJOR = { tonic: note('G'), minor: false }

const gospelProgressions: Lesson = {
  id: 'gospel-progressions',
  title: { en: 'Gospel progressions', ru: 'Госпел-последовательности' },
  summary: {
    en: 'Play the progressions gospel is built on, in 7th chords.',
    ru: 'Играйте последовательности, на которых строится госпел, септаккордами.',
  },
  sections: [
    {
      heading: { en: 'The gospel sound', ru: 'Звучание госпела' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Gospel keeps each chord’s role in the key but makes it richer: 7ths and 9ths on almost every beat.',
            ru: 'Госпел сохраняет роль каждого аккорда в тональности, но делает его богаче: септаккорды и нонаккорды почти на каждой доле.',
          },
        },
        { kind: 'chords', symbols: ['C', 'CMaj7', 'CMaj9'] },
      ],
    },
    {
      heading: { en: 'The hymn', ru: 'Гимн' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'I–IV–I–V is the old hymn’s plain change, back and forth between home and its neighbours.',
            ru: 'I–IV–I–V — простая смена старого гимна: туда и обратно между тоникой и её соседями.',
          },
        },
        { kind: 'progression', numerals: 'I IV I V', key: G_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'The standard', ru: 'Стандарт' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'I–iii–IV–V climbs to the dominant: up a third, then step by step.',
            ru: 'I–iii–IV–V поднимается к доминанте: сначала на терцию, затем по ступеням.',
          },
        },
        { kind: 'progression', numerals: 'I iii IV V', key: F_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'The lift', ru: 'Подъём' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'IV–V–iii–vi rises from IV and lands on the minor vi, ready to go on.',
            ru: 'IV–V–iii–vi поднимается от IV и приходит на минорную vi, откуда можно идти дальше.',
          },
        },
        { kind: 'progression', numerals: 'IV V iii vi', key: C_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'The 7–3–6', ru: '7–3–6' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Named for its bass, the key’s 7th, 3rd and 6th notes, it is a ii–V–i into the relative minor.',
            ru: 'Она названа по басу, VII, III и VI ступеням тональности. Это ii–V–i в параллельный минор.',
          },
        },
        { kind: 'progression', numerals: 'vii° III vi', key: C_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'The resolution', ru: 'Разрешение' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'V–IV–I steps back through IV on the way home, softening the dominant’s pull.',
            ru: 'V–IV–I возвращается домой через IV, и тяготение доминанты становится мягче.',
          },
        },
        { kind: 'progression', numerals: 'V IV I', key: F_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'The walk-up', ru: 'Подход снизу' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'The walk-up,', ru: 'Подход снизу,' },
          text: {
            en: '♭VI–♭VII–I, the gospel ending, climbs home by whole steps. Its roots come from minor, each played as a dominant 7th.',
            ru: '♭VI–♭VII–I, госпел-окончание, поднимается к тонике целыми тонами. Его основные тоны взяты из минора, и на каждом звучит доминантсептаккорд.',
          },
        },
        { kind: 'progression', numerals: '♭VI ♭VII I', key: C_MAJOR, size: 'sevenths' },
      ],
    },
    {
      heading: { en: 'In the rhythm', ru: 'В ритме' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'The right hand strikes between the beats and ties over one. The bass walks on every beat.',
            ru: 'Правая рука берёт аккорды между долями и один тянет через долю. Бас шагает на каждую долю.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'r/8 E5/8 r/8 E5/8~ E5/8 E5/8 r/4 r/8 F5/8 r/8 F5/8~ F5/8 F5/8 r/4',
        },
        { kind: 'notes', clef: 'bass', notes: 'C3 G2 C3 E3 F3 C3 F3 F♯3' },
        {
          kind: 'note',
          text: {
            en: 'The top line is each chord’s top note. F♯ walks the bass up to G.',
            ru: 'Верхняя строка — верхний звук аккордов. Фа-диез ведёт бас вверх, к соль.',
          },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play the iii7 of C major.', ru: 'Сыграйте iii7 до мажора.' },
          answer: { chord: 'Em7' },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the 7–3–6’s first chord in C: the half-diminished 7th on B.',
            ru: 'Сыграйте первый аккорд 7–3–6 в до мажоре: полууменьшённый септаккорд от си.',
          },
          answer: { chord: 'Bm7♭5' },
        },
        {
          kind: 'link',
          title: { en: 'The lift in the Player', ru: 'Подъём в плеере' },
          target: { opens: 'player', numerals: 'IV V iii vi', key: C_MAJOR, size: 'sevenths' },
        },
        {
          kind: 'link',
          title: { en: 'The 7–3–6 through the keys', ru: '7–3–6 по всем тональностям' },
          target: {
            opens: 'player',
            numerals: 'vii° III vi',
            key: C_MAJOR,
            size: 'sevenths',
            walk: 'fifths',
          },
        },
      ],
    },
  ],
}

export default gospelProgressions
