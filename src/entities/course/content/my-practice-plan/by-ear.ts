import { note } from '@/shared/lib/music'
import type { Lesson } from '@/entities/lesson'

const G_MAJOR = { tonic: note('G'), minor: false }
const D_MAJOR = { tonic: note('D'), minor: false }

/** Sixteen-Week Practice Plan, lesson 10: finding a song by ear, learning real songs and borrowing phrases. */
const byEar: Lesson = {
  id: 'by-ear',
  title: { en: 'Songs by ear', ru: 'Песни на слух' },
  summary: {
    en: 'Find the home note, follow the bass by number, choose major or minor, learn a song a little above you, and borrow phrases from players you love.',
    ru: 'Найдите тонику, следите за басом по ступеням, выберите мажор или минор, учите песню чуть выше своего уровня и заимствуйте фразы у любимых пианистов.',
  },
  after: ['improvising'],
  sections: [
    {
      heading: { en: 'Find the home note', ru: 'Найдите тонику' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Hum the song’s last note and find it on the keys. It is usually the key’s tonic, the root of chord I.',
            ru: 'Напойте последний звук песни и найдите его на клавишах. Обычно это тоника, основной тон аккорда I.',
          },
        },
        { kind: 'scale', root: note('G'), scale: 'major' },
      ],
    },
    {
      heading: { en: 'Follow the bass', ru: 'Следите за басом' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Find the chords from the bass, not the singer. Name each bass note by its number in the key: 1, 4, 5, 6.',
            ru: 'Ищите аккорды по басу, а не по певцу. Называйте каждый звук баса ступенью: 1, 4, 5, 6.',
          },
        },
        { kind: 'progression', numerals: 'I IV I V', key: G_MAJOR },
      ],
    },
    {
      heading: { en: 'Major or minor', ru: 'Мажор или минор' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'On each bass note try the major chord, then the minor, and keep the one that fits. In a major key, 2, 3 and 6 are usually minor.',
            ru: 'На каждом басу попробуйте мажор, затем минор, и оставьте подходящий. В мажоре 2, 3 и 6 обычно минорные.',
          },
        },
        { kind: 'chords', symbols: ['G', 'Am', 'Bm', 'C', 'D', 'Em'], apart: true },
      ],
    },
    {
      heading: { en: 'A song a little above you', ru: 'Песня чуть выше вашего уровня' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Pick a song a little harder than you can play.',
              ru: 'Выберите песню чуть труднее, чем вы можете.',
            },
            {
              en: 'Learn two lines a day, hands apart first.',
              ru: 'Учите по две строки в день, сначала отдельными руками.',
            },
            {
              en: 'Use each new skill in it the same day.',
              ru: 'Применяйте в ней каждый новый навык в тот же день.',
            },
            {
              en: 'Stay with it until it is automatic.',
              ru: 'Не бросайте её, пока она не пойдёт сама.',
            },
          ],
        },
        { kind: 'progression', numerals: 'I V vi IV', key: D_MAJOR },
      ],
      takeaway: {
        en: 'Watching lessons is not practice. Playing a real song is.',
        ru: 'Смотреть уроки — не заниматься. Играть настоящую песню — заниматься.',
      },
    },
    {
      heading: { en: 'Borrow a phrase', ru: 'Позаимствуйте фразу' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Copy a short phrase from a recording you love, by ear. Play it in three keys. It becomes a building block of your own.',
            ru: 'Снимите на слух короткую фразу с любимой записи. Сыграйте её в трёх тональностях. Она станет вашим собственным кирпичиком.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'G4/8 A4/8 B♭4/8 B4/8 D5 B4 C5/1',
          bass: 'C3/1 C3/1',
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: { en: 'Play chord vi in G major.', ru: 'Сыграйте аккорд vi в соль мажоре.' },
          answer: { chord: 'Em' },
        },
        {
          kind: 'link',
          title: { en: 'Progressions by ear: Quiz', ru: 'Обороты на слух: викторина' },
          target: { opens: 'quiz', trainer: 'progressions-by-ear' },
        },
        {
          kind: 'link',
          title: { en: 'Intervals by ear: Quiz', ru: 'Интервалы на слух: викторина' },
          target: { opens: 'quiz', trainer: 'intervals' },
        },
      ],
    },
  ],
}

export default byEar
