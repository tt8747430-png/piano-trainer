import type { Lesson } from '@/entities/lesson'
import { note } from '@/shared/lib/music'

/** Reading drill: the right hand's thumb on middle C, fingers 2 and 3 on D and E. */
const rhCDE: Lesson = {
  id: 'rh-c-d-e',
  title: { en: 'C, D and E in the right hand', ru: 'До, ре и ми в правой руке' },
  summary: {
    en: 'Sight-read C, D and E in the right hand.',
    ru: 'Читать с листа и играть правой рукой до, ре и ми.',
  },
  sections: [
    {
      heading: { en: 'Thumb on middle C', ru: 'Первый палец на до' },
      blocks: [
        {
          kind: 'text',
          text: {
            en: 'Thumb on C4, finger 2 on D4, 3 on E4. C sits on a ledger line, D hangs under the bottom line, E sits on it.',
            ru: 'Первый палец на до, второй на ре, третий на ми. До — на добавочной линейке, ре — под нижней линейкой, ми — на ней.',
          },
        },
        { kind: 'notes', clef: 'treble', notes: 'C4 D4 E4 D4 C4/1' },
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
            en: 'C to E skips from the ledger line to the bottom line. Fingers 1 and 3 play it, 2 waits over D.',
            ru: 'До — ми — скачок с добавочной линейки на нижнюю. Его играют первый и третий пальцы, второй ждёт над ре.',
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
            en: 'A repeat stays on the same line or space: the same key, the same finger.',
            ru: 'Повтор — та же линейка или промежуток: та же клавиша, тот же палец.',
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
            en: 'Play each line once, slowly, without stopping, even past a wrong note.',
            ru: 'Сыграйте каждую строку один раз, медленно и без остановок, даже после ошибки.',
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
          ask: { en: 'Play C, then skip up to E.', ru: 'Сыграйте до, затем скачком ми.' },
          answer: { notes: ['C', 'E'], rising: true },
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
