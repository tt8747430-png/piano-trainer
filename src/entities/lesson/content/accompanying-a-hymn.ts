import { note } from '@/shared/lib/music'
import type { Lesson } from '../model/types'

const G_MAJOR = { tonic: note('G'), minor: false }

const accompanyingAHymn: Lesson = {
  id: 'accompanying-a-hymn',
  title: { en: 'Accompanying a hymn', ru: 'Аккомпанемент гимна' },
  summary: {
    en: 'From the chord chart to the service: prepare, play an introduction, pick a type for verse and chorus, breathe with the singers, end.',
    ru: 'От аккордов к служению: подготовка, вступление, вид для куплета и для припева, дыхание вместе с поющими, окончание.',
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
              en: 'Find the key and the meter. Look at the key signature, the last chord and the time signature.',
              ru: 'Определите тональность и размер. Посмотрите на ключевые знаки, последний аккорд и размер такта.',
            },
            {
              en: 'Play the chords in blocks, in order, until every change is easy.',
              ru: 'Сыграйте аккорды целиком, по порядку, пока все смены не станут лёгкими.',
            },
            {
              en: 'Sing or hum the tune over the chords. Note where the words take a breath.',
              ru: 'Спойте или напойте мелодию под аккорды. Заметьте, где в словах берут дыхание.',
            },
            {
              en: 'Choose a type of accompaniment for the verse and a fuller one for the chorus.',
              ru: 'Выберите вид аккомпанемента для куплета и более насыщенный — для припева.',
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
            en: 'Before the singers start, play a short introduction in the harmonic basis (type 1). Use the hymn’s last line, or simply I–IV–V–I in its key.',
            ru: 'Перед пением сыграйте короткое вступление гармонической основой (первый вид). Возьмите последнюю строку гимна или просто I–IV–V–I в его тональности.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'The singers hear the key and the tempo. They breathe in on its last chord.',
            ru: 'Поющие услышат тональность и темп. На последнем аккорде они вдохнут.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'Amazing Grace is in G major, and its last line is vi–V–I. Play it below, then I–IV–V–I.',
            ru: '«О, благодать» — в соль мажоре, её последняя строка — vi–V–I. Сыграйте её ниже, затем I–IV–V–I.',
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
            en: 'Accompany the verse lightly, with figuration (type 4). Play the chorus more fully, with the chord’s pulse (type 3).',
            ru: 'Куплет сопровождайте легко, фигурацией (четвёртый вид). Припев играйте полнее, аккордовой пульсацией (третий вид).',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'For a quiet prayer, stay with the harmonic basis throughout.',
            ru: 'Для тихой молитвы оставайтесь в гармонической основе от начала до конца.',
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
            en: 'Keep the tempo steady. Hold the last chord of a line while the singers breathe. Before a new verse, give them a beat or two to start together.',
            ru: 'Держите ровный темп. Задерживайте последний аккорд строки, пока поющие берут дыхание. Перед новым куплетом дайте им одну-две доли, чтобы начать вместе.',
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
            en: 'End on the tonic chord, I, held long. Or play the last line again, more slowly.',
            ru: 'Закончите долгим тоническим аккордом, I. Или повторите последнюю строку медленнее.',
          },
        },
        {
          kind: 'text',
          text: {
            en: 'To close like an Amen, add IV to I after the last chord. In G major that is C, then G.',
            ru: 'Чтобы завершить гимн, как «аминь», добавьте IV–I после последнего аккорда. В соль мажоре это C, затем G.',
          },
        },
        { kind: 'chords', symbols: ['G', 'C', 'G'] },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'link',
          title: { en: 'Amazing Grace in the Player', ru: '«О, благодать» в плеере' },
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
