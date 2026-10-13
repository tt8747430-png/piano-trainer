import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const G_MAJOR = { tonic: note('G'), minor: false }

const accompanyingAHymn: Lesson = {
  id: 'accompanying-a-hymn',
  title: { en: 'Accompanying a hymn', ru: 'Аккомпанемент гимна' },
  summary: {
    en: 'From the chord chart to the service: prepare, introduce, verse and chorus, end.',
    ru: 'От аккордов к служению: подготовка, вступление, куплет и припев, окончание.',
  },
  level: 2,
  module: 'seven-types',
  sections: [
    {
      heading: { en: 'Before you play', ru: 'Прежде чем играть' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Find the key and meter: the signature, the last chord, the time signature.',
              ru: 'Определите тональность и размер: по ключевым знакам, последнему аккорду и размеру такта.',
            },
            {
              en: 'Play the chords in blocks until every change is easy.',
              ru: 'Играйте аккорды целиком, пока все смены не станут лёгкими.',
            },
            {
              en: 'Hum the tune over them and mark the breaths.',
              ru: 'Напойте мелодию под них и отметьте, где берут дыхание.',
            },
          ],
        },
        { kind: 'chords', symbols: ['G', 'G7', 'C', 'G'] },
      ],
    },
    {
      heading: { en: 'An introduction', ru: 'Вступление' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play a short introduction in the harmonic basis (type 1): the hymn’s last line, or I–IV–V–I. The singers hear key and tempo, and breathe on its last chord.',
            ru: 'Сыграйте короткое вступление гармонической основой (первый вид): последнюю строку гимна или I–IV–V–I. Поющие услышат тональность и темп и вдохнут на последнем аккорде.',
          },
        },
        { kind: 'progression', numerals: 'vi V I', key: G_MAJOR },
        {
          kind: 'note',
          text: {
            en: 'Amazing Grace’s last line is vi–V–I.',
            ru: 'Последняя строка «О, благодать» — vi–V–I.',
          },
        },
        { kind: 'progression', numerals: 'I IV V I', key: G_MAJOR },
      ],
    },
    {
      heading: { en: 'Verse and chorus', ru: 'Куплет и припев' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play the verse lightly with figuration (type 4), the chorus fuller with the chord’s pulse (type 3). For a quiet prayer, keep the harmonic basis.',
            ru: 'Куплет играйте легко, фигурацией (четвёртый вид), припев — полнее, аккордовой пульсацией (третий вид). Для тихой молитвы оставайтесь в гармонической основе.',
          },
        },
        { kind: 'pattern', pattern: 'r4', piece: 'amazing' },
        { kind: 'pattern', pattern: 'r3', piece: 'amazing' },
        {
          kind: 'note',
          text: {
            en: 'Hold each line’s last chord while the singers breathe.',
            ru: 'Задерживайте последний аккорд строки, пока поющие берут дыхание.',
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
            en: 'End on I, held long, or play the last line again more slowly. To close like an Amen, add IV–I: in G, C then G.',
            ru: 'Закончите долгим аккордом I или повторите последнюю строку медленнее. Чтобы закончить, как «аминь», добавьте IV–I: в соль мажоре C, затем G.',
          },
        },
        { kind: 'chords', symbols: ['G', 'C', 'G'] },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the chord a hymn in G major ends on.',
            ru: 'Сыграйте аккорд, которым заканчивается гимн в соль мажоре.',
          },
          answer: { chord: 'G' },
        },
        {
          kind: 'link',
          title: { en: 'Amazing Grace in the Player', ru: '«О, благодать» в плеере' },
          target: { opens: 'piece', piece: 'amazing' },
        },
        {
          kind: 'link',
          title: { en: 'Silent Night in the Player', ru: '«Тихая ночь» в плеере' },
          target: { opens: 'piece', piece: 'silent' },
        },
      ],
    },
  ],
}

export default accompanyingAHymn
