import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const TWELVE_BARS = 'I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7'

const syncopationAndSwing: Lesson = {
  id: 'syncopation-and-swing',
  title: { en: 'Syncopation and swing', ru: 'Синкопа и свинг' },
  summary: {
    en: 'Rhythm that leans off the beat: accents between the beats, ties over them, the anticipation, and eighths played long–short.',
    ru: 'Ритм, который смещается с доли: акценты между долями, лиги через долю, антиципация и восьмые, сыгранные «долго — коротко».',
  },
  sections: [
    {
      heading: { en: 'Off the beat', ru: 'Мимо доли' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Syncopation', ru: 'Синкопа' },
          text: {
            en: 'puts the weight where the beat does not expect it. Below, a quarter starts on the “and” of 1 and sounds through beat 2.',
            ru: '— ударение там, где доля его не ждёт. Ниже четвертная начинается на «и» после «раз» и звучит через вторую долю.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5/8 E5/4 E5/8 G5/4 E5/4 C5/1' },
      ],
    },
    {
      heading: { en: 'Tied over the beat', ru: 'Лига через долю' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A tie from an “and” over the next beat hides that beat. You hear the note early and feel the beat silently.',
            ru: 'Лига с «и» через следующую долю прячет эту долю. Звук приходит раньше, а долю вы чувствуете про себя.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'r/8 G4/8 C5/8 E5/8~ E5/8 D5/8 C5 G4/1' },
        {
          kind: 'note',
          text: {
            en: 'Count “1 and 2 and” aloud and keep counting through the tie.',
            ru: 'Считайте вслух «раз-и, два-и» и не прерывайте счёт на лиге.',
          },
        },
      ],
    },
    {
      heading: { en: 'The anticipation', ru: 'Антиципация' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An anticipation', ru: 'Антиципация' },
          text: {
            en: 'brings the next bar’s note in an eighth early, tied over the barline. Here F arrives on the “and” of 4.',
            ru: '— звук следующего такта, взятый на восьмую раньше и залигованный через тактовую черту. Здесь фа приходит на «и» после «четыре».',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5 E5 G5 E5/8 F5/8~ F5/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3/1 F2/1' },
        {
          kind: 'note',
          text: {
            en: 'The bass still changes on the beat. Only the tune runs ahead.',
            ru: 'Бас по-прежнему меняется на долю. Вперёд забегает только мелодия.',
          },
        },
      ],
    },
    {
      heading: { en: 'A chord pushed ahead', ru: 'Аккорд раньше такта' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Pop and gospel push whole chords the same way. Strike the next chord on the last “and” and hold it over the bar. Below, each chord’s top note.',
            ru: 'В попе и госпеле так же сдвигают целые аккорды. Возьмите следующий аккорд на последнее «и» и держите через такт. Ниже — верхний звук каждого.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'G4/4. G4/8 r/4 r/8 A4/8~ A4/4. A4/8 r/4 r/8 B4/8~ B4/1',
        },
        { kind: 'chords', symbols: ['C', 'F', 'G'] },
      ],
    },
    {
      heading: { en: 'Swung eighths', ru: 'Свинговые восьмые' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Swing', ru: 'Свинг' },
          text: {
            en: 'plays a pair of eighths long–short, as the first and last notes of a triplet. Written straight, they sound as the 12/8 line below.',
            ru: '— исполнение пары восьмых «долго — коротко», как первой и последней ноты триоли. Записанные ровно, они звучат как строка в 12/8 ниже.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5/8 D5/8 E5/8 F5/8 G5/8 F5/8 E5/8 D5/8 C5/1' },
        {
          kind: 'notes',
          clef: 'treble',
          meter: '12/8',
          notes: 'C5/4 D5/8 E5/4 F5/8 G5/4 F5/8 E5/4 D5/8 C5/1.',
        },
      ],
    },
    {
      heading: { en: 'Straight or swing?', ru: 'Ровно или свинг?' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Classical, rock and most pop play eighths straight. Jazz, blues and gospel swing them. A chart marks it over the first bar: “Swing”.',
            ru: 'Классика, рок и почти весь поп играют восьмые ровно. Джаз, блюз и госпел их свингуют. На листе это пишут над первым тактом: «Swing».',
          },
        },
        { kind: 'progression', numerals: TWELVE_BARS, key: C_MAJOR },
        {
          kind: 'link',
          title: {
            en: 'The twelve-bar blues in the Player',
            ru: 'Двенадцатитактовый блюз в плеере',
          },
          target: { opens: 'player', numerals: TWELVE_BARS, key: C_MAJOR },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the note the anticipation brought in early.',
            ru: 'Сыграйте звук, который антиципация взяла раньше.',
          },
          answer: { notes: ['F'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play C7, the chord the blues swings on first.',
            ru: 'Сыграйте C7 — первый аккорд блюза.',
          },
          answer: { chord: 'C7' },
        },
        {
          kind: 'link',
          title: { en: 'The twelve-bar blues', ru: 'Двенадцатитактовый блюз' },
          target: { opens: 'lesson', lesson: 'the-blues' },
        },
        {
          kind: 'link',
          title: { en: 'I–vi–IV–V in the Player', ru: 'I–vi–IV–V в плеере' },
          target: { opens: 'player', numerals: 'I vi IV V', key: C_MAJOR },
        },
      ],
    },
  ],
}

export default syncopationAndSwing
