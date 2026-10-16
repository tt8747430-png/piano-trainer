import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const C_MAJOR = { tonic: note('C'), minor: false }
const TWELVE_BARS = 'I7 I7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7'

const syncopationAndSwing: Lesson = {
  id: 'syncopation-and-swing',
  title: { en: 'Syncopation and swing', ru: 'Синкопа и свинг' },
  summary: {
    en: 'Put notes between the beats, bring notes and chords in early, and swing a pair of eighths.',
    ru: 'Ставить звуки между долями, брать звуки и аккорды раньше времени и свинговать пару восьмых.',
  },
  sections: [
    {
      heading: { en: 'Off the beat', ru: 'Мимо доли' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Syncopation', ru: 'Синкопа' },
          text: {
            en: 'puts the accent between the beats. Below, a quarter note starts on the “and” after 1. It keeps sounding through beat 2.',
            ru: '— это ударение между долями. Ниже четвертная начинается на «и» после «раз». Она звучит и на второй доле.',
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
            en: 'A tie from an “and” across the next beat hides that beat. You do not play it, but you still feel it.',
            ru: 'Лига с «и» через следующую долю прячет эту долю. Вы её не играете, но чувствуете.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'r/8 G4/8 C5/8 E5/8~ E5/8 D5/8 C5 G4/1' },
        {
          kind: 'note',
          text: {
            en: 'Count “1 and 2 and” aloud. Keep counting through the tie.',
            ru: 'Считайте вслух «раз-и, два-и». Не прерывайте счёт на лиге.',
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
            en: 'plays the next bar’s note an eighth early and ties it over the barline. Here F arrives on the “and” after 4.',
            ru: '— это звук следующего такта, взятый на восьмую раньше и залигованный через тактовую черту. Здесь фа приходит на «и» после «четыре».',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C5 E5 G5 E5/8 F5/8~ F5/1' },
        { kind: 'notes', clef: 'bass', notes: 'C3/1 F2/1' },
        {
          kind: 'note',
          text: {
            en: 'The bass still changes on beat 1.',
            ru: 'Бас по-прежнему меняется на первую долю.',
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
            en: 'Pop and gospel push whole chords early the same way. The next chord comes on the bar’s last “and” and holds over. The staff shows each chord’s top note.',
            ru: 'В попе и госпеле так же сдвигают целые аккорды. Следующий берут на последнее «и» такта и держат дальше. На стане — верхний звук каждого.',
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
            en: 'plays each pair of eighths long then short, like the first and last notes of a triplet. Swung, the first line sounds like the 12/8 line.',
            ru: '— это пара восьмых «долго — коротко», как первая и последняя ноты триоли. В свинге первая строка звучит как строка в 12/8.',
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
            en: 'Classical, rock and most pop play eighths straight, all equal. Jazz, blues and gospel swing them. Try the blues below with swung eighths.',
            ru: 'Классика, рок и почти весь поп играют восьмые ровно. Джаз, блюз и госпел их свингуют. Сыграйте блюз ниже со свингом.',
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
