import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

/** Reading drill: the right hand's thumb on middle C, fingers 2 and 3 on D and E. */
const rhCDE: Lesson = {
  id: 'rh-c-d-e',
  title: { en: 'C, D and E in the right hand', ru: 'До, ре и ми в правой руке' },
  summary: {
    en: 'Thumb on middle C: read C4, D4 and E4 on the treble staff in steps, skips and repeats, and play them on sight.',
    ru: 'Первый палец на до первой октавы: читайте до, ре и ми на скрипичном стане шагами, скачками и повторами и играйте с листа.',
  },
  sections: [
    {
      heading: { en: 'Thumb on middle C', ru: 'Первый палец на до' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'A hand position', ru: 'Позиция руки' },
          text: {
            en: 'puts one finger over each key it will play. Here the right thumb takes C4, finger 2 D4 and finger 3 E4.',
            ru: '— каждый палец над своей клавишей. Здесь первый палец правой руки на до, второй на ре, третий на ми.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4/2 D4/2 E4/1' },
        {
          kind: 'question',
          ask: {
            en: 'Play middle C with your thumb.',
            ru: 'Сыграйте до первой октавы первым пальцем.',
          },
          answer: { notes: ['C'] },
        },
      ],
    },
    {
      heading: { en: 'Where each note sits', ru: 'Где стоит каждая нота' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Middle C sits on its own ledger line below the staff. D4 hangs just under the bottom line. E4 sits on the bottom line.',
            ru: 'До стоит на добавочной линейке под станом. Ре висит прямо под нижней линейкой. Ми стоит на нижней линейке.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 D4 C4/1' },
        {
          kind: 'question',
          ask: { en: 'Play the note on the bottom line.', ru: 'Сыграйте ноту на нижней линейке.' },
          answer: { notes: ['E'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note just under the bottom line.',
            ru: 'Сыграйте ноту прямо под нижней линейкой.',
          },
          answer: { notes: ['D'] },
        },
      ],
    },
    {
      heading: { en: 'Steps', ru: 'Шаги' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Each step is the next finger. Read the direction first, then the notes.',
            ru: 'Каждый шаг — соседний палец. Сначала прочитайте направление, потом ноты.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4/2 E4 D4 C4/2 C4 D4 E4 D4 C4/1' },
        { kind: 'notes', clef: 'treble', notes: 'E4 D4 C4 D4 E4/2 D4/2 C4 D4 E4 D4 C4/1' },
      ],
    },
    {
      heading: { en: 'The skip from C to E', ru: 'Скачок от до к ми' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C to E is a skip: ledger line to bottom line. The thumb and finger 3 play it, with finger 2 waiting over D.',
            ru: 'До — ми — это скачок с добавочной линейки на нижнюю. Его играют первый и третий пальцы, второй ждёт над ре.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 E4 C4 E4 D4/2 C4/2 E4 C4 D4 E4 C4/1' },
        {
          kind: 'question',
          ask: { en: 'Play C, then skip up to E.', ru: 'Сыграйте до, затем скачком ми.' },
          answer: { notes: ['C', 'E'], rising: true },
        },
      ],
    },
    {
      heading: { en: 'Repeated notes', ru: 'Повторяющиеся ноты' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A repeat stays on the same line or space. Play the same key again with the same finger.',
            ru: 'Повтор остаётся на той же линейке или в том же промежутке. Сыграйте ту же клавишу тем же пальцем.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 E4 D4 D4 C4 C4 E4/2 D4 D4 E4 D4 C4/1' },
      ],
    },
    {
      heading: { en: 'Read on sight', ru: 'Чтение с листа' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Play each line once, slowly, without stopping. Keep going even past a wrong note.',
            ru: 'Сыграйте каждую строку один раз, медленно, без остановок. Не останавливайтесь даже после ошибки.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 D4 C4 D4 E4 E4 E4/2 D4 D4 E4 D4 C4/1' },
        { kind: 'notes', clef: 'treble', meter: '3/4', notes: 'C4 D4 E4 D4/2 C4 E4/2 D4 C4/2.' },
        { kind: 'notes', clef: 'treble', notes: 'D4 E4 D4 C4 E4/2 C4/2 D4 D4 E4 E4 C4/1' },
      ],
    },
    {
      heading: { en: 'Try it', ru: 'Попробуйте' },
      blocks: [
        {
          kind: 'question',
          ask: {
            en: 'Play C, D and E with fingers 1, 2 and 3.',
            ru: 'Сыграйте до, ре и ми первым, вторым и третьим пальцами.',
          },
          answer: { notes: ['C', 'D', 'E'], rising: true },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the note on the ledger line below the treble staff.',
            ru: 'Сыграйте ноту на добавочной линейке под скрипичным станом.',
          },
          answer: { notes: ['C'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play E, then step down twice.',
            ru: 'Сыграйте ми, затем два шага вниз.',
          },
          answer: { notes: ['E', 'D', 'C'] },
        },
        {
          kind: 'question',
          ask: {
            en: 'Play the space under the bottom line, then the bottom line.',
            ru: 'Сыграйте ноту под нижней линейкой, затем на нижней линейке.',
          },
          answer: { notes: ['D', 'E'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
        {
          kind: 'link',
          title: { en: 'The C position in the Player', ru: 'Позиция до в плеере' },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('C') },
        },
      ],
    },
  ],
}

export default rhCDE
