import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

/** Reading drill: the right hand's thumb on middle C, fingers 2 and 3 on D and E. */
const rhCDE: Lesson = {
  id: 'rh-c-d-e',
  title: { en: 'C, D and E in the right hand', ru: 'До, ре и ми в правой руке' },
  summary: {
    en: 'Read C, D and E on the treble staff and play them with right-hand fingers 1, 2 and 3.',
    ru: 'Читать до, ре и ми в скрипичном ключе и играть их первым, вторым и третьим пальцами правой руки.',
  },
  sections: [
    {
      heading: { en: 'Finger numbers', ru: 'Номера пальцев' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Finger numbers', ru: 'Номера пальцев' },
          text: {
            en: 'run from the thumb (1) to the little finger (5). Put the right thumb on middle C, finger 2 on D and finger 3 on E.',
            ru: 'идут от большого пальца (1) до мизинца (5). Поставьте первый палец правой руки на до первой октавы, второй на ре, третий на ми.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 D4 C4/1' },
      ],
    },
    {
      heading: { en: 'C, D and E on the staff', ru: 'До, ре и ми на стане' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Middle C sits on a ledger line below the staff. D hangs just under the bottom line. E sits on the bottom line.',
            ru: 'До первой октавы стоит на добавочной линейке под станом. Ре висит прямо под нижней линейкой. Ми стоит на нижней линейке.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4/2 E4 D4 C4/2 C4 D4 E4 D4 C4/1' },
      ],
    },
    {
      heading: { en: 'Steps', ru: 'Шаги' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A step on the staff is the next finger on the keys. First see which way the notes move, up or down. Then name them.',
            ru: 'Шаг на стане — соседний палец на клавишах. Сначала посмотрите, куда идут ноты, вверх или вниз. Потом назовите их.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 D4 C4 D4 E4/2 D4/2 C4 D4 E4 D4 C4/1' },
      ],
    },
    {
      heading: { en: 'The skip from C to E', ru: 'Скачок от до к ми' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'C to E is a skip, from the ledger line to the bottom line. Fingers 1 and 3 play it. Finger 2 waits over D.',
            ru: 'До — ми — скачок с добавочной линейки на нижнюю. Его играют первый и третий пальцы, а второй ждёт над ре.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 E4 C4 E4 D4/2 C4/2 E4 C4 D4 E4 C4/1' },
      ],
    },
    {
      heading: { en: 'Repeated notes', ru: 'Повторяющиеся ноты' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'A repeated note stays on the same line or space. Play the same key again with the same finger.',
            ru: 'Повторённая нота остаётся на той же линейке или в том же промежутке. Сыграйте ту же клавишу тем же пальцем.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'E4 E4 D4 D4 C4 C4 E4/2 D4 D4 E4 D4 C4/1' },
      ],
    },
    {
      heading: { en: 'Sight-reading', ru: 'Чтение с листа' },
      blocks: [
        {
          kind: 'text',
          lead: { en: 'Sight-reading', ru: 'Чтение с листа' },
          text: {
            en: 'means playing music you have not practised. Play each line once, slowly. Keep going even after a wrong note.',
            ru: '— игра незнакомых нот без подготовки. Сыграйте каждую строку один раз, медленно. Не останавливайтесь даже после ошибки.',
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
        {
          kind: 'question',
          ask: { en: 'Play C, then skip up to E.', ru: 'Сыграйте до, затем скачком вверх ми.' },
          answer: { notes: ['C', 'E'], rising: true },
        },
        {
          kind: 'link',
          title: { en: 'Practise reading notes in the Quiz', ru: 'Чтение нот в тестах' },
          target: { opens: 'quiz', trainer: 'reading-notes' },
        },
        {
          kind: 'link',
          title: { en: 'Play the C position in the Player', ru: 'Позиция до в плеере' },
          target: { opens: 'exercise', exercise: 'five-finger', root: note('C') },
        },
      ],
    },
  ],
}

export default rhCDE
