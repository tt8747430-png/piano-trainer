import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const G_MAJOR = { tonic: note('G'), minor: false }

const accompanyingAHymn: Lesson = {
  id: 'accompanying-a-hymn',
  title: { en: 'Accompanying a hymn', ru: 'Аккомпанемент гимна' },
  summary: {
    en: 'From the chord chart to the service: getting ready, an introduction, a type for the verse and another for the chorus, breathing with the singers, and an ending.',
    ru: 'От аккордов к служению: подготовка, вступление, один вид для куплета и другой для припева, дыхание вместе с поющими и окончание.',
  },
  level: 2,
  category: 'accompaniment',
  module: 'seven-types',
  sections: [
    {
      heading: { en: 'Before you play', ru: 'Прежде чем играть' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Find the key and the meter: the key signature, the last chord, the time signature.',
              ru: 'Найдите тональность и размер: ключевые знаки, последний аккорд, размер такта.',
            },
            {
              en: 'Play the chords in blocks, as they come, until every change is easy.',
              ru: 'Сыграйте аккорды целиком, по порядку, пока все смены не станут лёгкими.',
            },
            {
              en: 'Sing or hum the tune over them, so you know where the words breathe.',
              ru: 'Спойте или напойте мелодию поверх них — так вы узнаете, где слова берут дыхание.',
            },
            {
              en: 'Choose how to accompany: one type for the verse and a fuller one for the chorus.',
              ru: 'Выберите, как аккомпанировать: один вид для куплета и более насыщенный для припева.',
            },
          ],
        },
      ],
    },
    {
      heading: { en: 'An introduction', ru: 'Вступление' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Before the singers start, play the hymn’s last line, or simply I–IV–V–I in its key, in the harmonic basis. They hear the key and the tempo, and breathe in on its last chord. Amazing Grace is in G major; its last line is vi–V–I.',
            ru: 'Прежде чем начнут петь, сыграйте последнюю строку гимна или просто I–IV–V–I в его тональности, гармонической основой. Поющие услышат тональность и темп и вдохнут на последнем аккорде. «О благодать» — в соль мажоре; её последняя строка — vi–V–I.',
          },
        },
        { kind: 'progression', numerals: 'vi V I', key: G_MAJOR },
        { kind: 'progression', numerals: 'I IV V I', key: G_MAJOR },
      ],
    },
    {
      heading: { en: 'Verse and chorus', ru: 'Куплет и припев' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Accompany the verse lightly, with figuration, and the chorus more fully, with the chord’s pulse. For a quiet prayer, stay with the harmonic basis throughout.',
            ru: 'Куплет сопровождайте легко, фигурацией, а припев — полнее, аккордовой пульсацией. Для тихой молитвы оставайтесь в гармонической основе от начала до конца.',
          },
        },
        { kind: 'pattern', pattern: 'r4', piece: 'amazing' },
        { kind: 'pattern', pattern: 'r3', piece: 'amazing' },
      ],
    },
    {
      heading: { en: 'Breathing with the singers', ru: 'Дышите вместе с поющими' },
      blocks: [
        {
          kind: 'note',
          text: {
            en: 'Keep the tempo steady, and hold the last chord of a line while the singers breathe. Before a new verse, give them a beat or two to start together.',
            ru: 'Держите ровный темп и задерживайте последний аккорд строки, пока поющие берут дыхание. Перед новым куплетом дайте им одну-две доли, чтобы начать вместе.',
          },
        },
      ],
    },
    {
      heading: { en: 'An ending', ru: 'Окончание' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'End on the tonic chord held long, or play the last line again more slowly. IV to I after the last chord closes a hymn like an Amen.',
            ru: 'Закончите долгим тоническим аккордом или повторите последнюю строку медленнее. IV–I после последнего аккорда завершает гимн, как «аминь».',
          },
        },
        { kind: 'chords', symbols: ['C', 'F', 'C'] },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'link',
          title: { en: 'Amazing Grace in the Player', ru: '«О благодать» в плеере' },
          target: { place: 'piece', piece: 'amazing' },
        },
        {
          kind: 'link',
          title: { en: 'Silent Night in the Player', ru: '«Тихая ночь» в плеере' },
          target: { place: 'piece', piece: 'silent' },
        },
      ],
    },
  ],
}

export default accompanyingAHymn
