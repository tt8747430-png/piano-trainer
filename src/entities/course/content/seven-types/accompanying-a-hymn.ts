import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const G_MAJOR = { tonic: note('G'), minor: false }

const accompanyingAHymn: Lesson = {
  id: 'accompanying-a-hymn',
  title: { en: 'Accompanying a hymn', ru: 'Аккомпанемент гимна' },
  summary: {
    en: 'Accompany a hymn from its chords: prepare, introduce, play the verses and end.',
    ru: 'Аккомпанируйте гимну по аккордам: подготовка, вступление, куплеты и окончание.',
  },
  sections: [
    {
      heading: { en: 'Before you play', ru: 'Прежде чем играть' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Find the key from its signature and last chord, and the meter from the time signature.',
              ru: 'Определите тональность по ключевым знакам и последнему аккорду, а размер — по обозначению размера.',
            },
            {
              en: 'Play the chords in blocks until each change is easy.',
              ru: 'Играйте аккорды целиком, пока все смены не станут лёгкими.',
            },
            {
              en: 'Hum the tune and mark where the singers breathe.',
              ru: 'Напойте мелодию и отметьте, где поющие берут дыхание.',
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
            en: 'Play the hymn’s last line in type 1, the harmonic basis. The singers hear the key and tempo and breathe on its last chord.',
            ru: 'Сыграйте последнюю строку гимна первым видом, гармонической основой. Поющие услышат тональность и темп и вдохнут на последнем аккорде.',
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
      ],
    },
    {
      heading: { en: 'A shorter introduction', ru: 'Короткое вступление' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Instead of the last line, you can play I–IV–V–I in the hymn’s key.',
            ru: 'Вместо последней строки можно сыграть I–IV–V–I в тональности гимна.',
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
            en: 'Play the verse lightly in figuration (type 4) and the chorus fuller in the chord pulse (type 3). For a quiet prayer, stay in type 1.',
            ru: 'Куплет играйте легко, фигурацией (вид 4), припев — полнее, аккордовой пульсацией (вид 3). Для тихой молитвы оставайтесь в первом виде.',
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
            en: 'End on I and hold it long, or play the last line again more slowly. To close like an Amen, add IV–I: in G, C then G.',
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
