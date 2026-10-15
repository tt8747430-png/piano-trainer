import type { Lesson } from '@/entities/lesson'

const rightHandSongs: Lesson = {
  id: 'right-hand-songs',
  title: { en: 'Easy songs for the right hand', ru: 'Простые песни для правой руки' },
  summary: {
    en: 'Three tunes in the C position: Hot Cross Buns on three notes, Mary Had a Little Lamb on four, Au clair de la lune with a skip.',
    ru: 'Три мелодии в позиции до: «Горячие булочки» на трёх нотах, «У Мэри был барашек» на четырёх и «При лунном свете» со скачком.',
  },
  sections: [
    {
      heading: { en: 'Three notes, three fingers', ru: 'Три ноты, три пальца' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Hot Cross Buns uses E, D and C, fingers 3, 2 and 1. It walks down one key at a time.',
            ru: '«Горячие булочки» — это ми, ре и до, пальцы 3, 2 и 1. Мелодия спускается по одной клавише.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'E4 D4 C4/2 E4 D4 C4/2 C4/8 C4/8 C4/8 C4/8 D4/8 D4/8 D4/8 D4/8 E4 D4 C4/2',
        },
        {
          kind: 'link',
          title: { en: 'Hot Cross Buns in the Player', ru: '«Горячие булочки» в плеере' },
          target: { opens: 'piece', piece: 'hot-cross-buns' },
        },
      ],
    },
    {
      heading: { en: 'Half a beat', ru: 'Половина доли' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'An eighth note', ru: 'Восьмая' },
          text: {
            en: 'lasts half a beat, so two fit in one count. Say “1 and 2 and” to keep them even.',
            ru: 'длится половину доли: на один счёт приходятся две. Считайте «раз-и, два-и», чтобы они шли ровно.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes: 'C4/8 C4/8 C4/8 C4/8 D4/8 D4/8 D4/8 D4/8 E4 D4 C4/2',
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the three notes of Hot Cross Buns.',
            ru: 'Сыграйте три ноты «Горячих булочек».',
          },
          answer: { notes: ['E', 'D', 'C'] },
        },
      ],
    },
    {
      heading: { en: 'Mary Had a Little Lamb', ru: '«У Мэри был барашек»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'This tune adds G, finger 5. Play repeated notes from the key itself, not from high above it.',
            ru: 'Здесь добавляется соль, пятый палец. Повторяющиеся ноты играйте с клавиши, не замахиваясь сверху.',
          },
        },
        {
          kind: 'notes',
          clef: 'treble',
          notes:
            'E4 D4 C4 D4 E4 E4 E4/2 D4 D4 D4/2 E4 G4 G4/2 E4 D4 C4 D4 E4 E4 E4 E4 D4 D4 E4 D4 C4/1',
        },
        {
          kind: 'link',
          title: {
            en: 'Mary Had a Little Lamb in the Player',
            ru: '«У Мэри был барашек» в плеере',
          },
          target: { opens: 'piece', piece: 'mary-lamb' },
        },
      ],
    },
    {
      heading: { en: 'Steps and skips', ru: 'Шаги и скачки' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A step', ru: 'Шаг' },
          text: {
            en: 'moves to the very next key. A skip jumps over one key, from line to line or space to space.',
            ru: '— переход на соседнюю клавишу. Скачок перепрыгивает через одну: с линейки на линейку или с промежутка на промежуток.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 F4 C4 E4 G4/2' },
        {
          kind: 'question',
          ask: {
            en: 'Play the skip from C up to E.',
            ru: 'Сыграйте скачок от до вверх к ми.',
          },
          answer: { notes: ['C', 'E'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Au clair de la lune', ru: '«При лунном свете»' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'This French song stays on C, D and E. Its third bar skips from C to E, fingers 1 to 3.',
            ru: 'Эта французская песня держится на до, ре и ми. В третьем такте — скачок от до к ми, пальцы 1 и 3.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 C4 C4 D4 E4/2 D4/2 C4 E4 D4 D4 C4/1' },
        {
          kind: 'link',
          title: { en: 'Au clair de la lune in the Player', ru: '«При лунном свете» в плеере' },
          target: { opens: 'piece', piece: 'au-clair' },
        },
      ],
    },
    {
      heading: { en: 'Learning a tune', ru: 'Как разучивать мелодию' },
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              en: 'Say the finger numbers aloud before you play.',
              ru: 'Перед игрой проговорите номера пальцев вслух.',
            },
            {
              en: 'Play slowly, counting every beat.',
              ru: 'Играйте медленно, считая каждую долю.',
            },
            {
              en: 'Speed up only once it sounds even.',
              ru: 'Ускоряйтесь, только когда звучит ровно.',
            },
          ],
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the four notes Mary Had a Little Lamb uses.',
            ru: 'Сыграйте четыре ноты, из которых состоит «У Мэри был барашек».',
          },
          answer: { notes: ['C', 'D', 'E', 'G'] },
        },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play the keys under fingers 1, 3 and 5 one after another, from the thumb.',
            ru: 'Сыграйте по очереди клавиши под пальцами 1, 3 и 5, начиная с большого.',
          },
          answer: { notes: ['C', 'E', 'G'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note Mary adds to Hot Cross Buns’ three.',
            ru: 'Сыграйте ноту, которую «Барашек» добавляет к трём нотам «Булочек».',
          },
          answer: { notes: ['G'] },
        },
        {
          kind: 'link',
          title: { en: 'Hot Cross Buns in the Player', ru: '«Горячие булочки» в плеере' },
          target: { opens: 'piece', piece: 'hot-cross-buns' },
        },
        {
          kind: 'link',
          title: {
            en: 'Mary Had a Little Lamb in the Player',
            ru: '«У Мэри был барашек» в плеере',
          },
          target: { opens: 'piece', piece: 'mary-lamb' },
        },
        {
          kind: 'link',
          title: { en: 'Au clair de la lune in the Player', ru: '«При лунном свете» в плеере' },
          target: { opens: 'piece', piece: 'au-clair' },
        },
      ],
    },
  ],
}

export default rightHandSongs
