import type { LocalText } from '@/shared/i18n'
import type { HanonNumber } from '@/shared/lib/exercise'

/**
 * What each of Hanon's Nos. 1 to 20 works, as the book says it (The Virtuoso Pianist, 1873): the
 * stretch or the fingers it singles out.
 */
export const HANON_TRAINS: Readonly<Record<HanonNumber, LocalText>> = {
  1: {
    en: 'The stretch from 5 to 4: the left hand going up, the right coming down',
    ru: 'Растяжка между 5-м и 4-м пальцами: левой рукой вверх, правой вниз',
  },
  2: { en: 'Fingers 3 and 4', ru: '3-й и 4-й пальцы' },
  3: { en: 'Fingers 2, 3 and 4', ru: '2-й, 3-й и 4-й пальцы' },
  4: {
    en: 'Fingers 3, 4 and 5, which the book singles out',
    ru: '3-й, 4-й и 5-й пальцы, особое упражнение книги',
  },
  5: {
    en: 'All five fingers, and a trill between 4 and 5 in the right hand',
    ru: 'Все пять пальцев и подготовка трели 4–5 в правой руке',
  },
  6: { en: 'The 5th finger', ru: '5-й палец' },
  7: {
    en: 'Fingers 3, 4 and 5: the book calls it the most important for them',
    ru: '3-й, 4-й и 5-й пальцы: по книге, самое важное для них',
  },
  8: { en: 'All five fingers', ru: 'Все пять пальцев' },
  9: {
    en: 'The stretch from 4 to 5, then all the fingers',
    ru: 'Растяжка между 4-м и 5-м пальцами, затем все пальцы',
  },
  10: {
    en: 'A trill between 3 and 4: the left hand going up, the right coming down',
    ru: 'Подготовка трели 3–4: левой рукой вверх, правой вниз',
  },
  11: { en: 'A trill between 4 and 5', ru: 'Подготовка трели 4–5' },
  12: {
    en: 'The stretch from 1 to 5, and fingers 3, 4 and 5',
    ru: 'Растяжка между 1-м и 5-м пальцами и 3-й, 4-й, 5-й пальцы',
  },
  13: { en: 'Fingers 3, 4 and 5', ru: '3-й, 4-й и 5-й пальцы' },
  14: { en: 'A trill between 3 and 4', ru: 'Подготовка трели 3–4' },
  15: {
    en: 'The stretch from 1 to 2, and all five fingers',
    ru: 'Растяжка между 1-м и 2-м пальцами и все пять пальцев',
  },
  16: {
    en: 'The stretch from 3 to 5, and fingers 3, 4 and 5',
    ru: 'Растяжка между 3-м и 5-м пальцами и 3-й, 4-й, 5-й пальцы',
  },
  17: {
    en: 'The stretches 1–2, 2–4 and 4–5, and fingers 3, 4 and 5',
    ru: 'Растяжки 1–2, 2–4 и 4–5 и 3-й, 4-й, 5-й пальцы',
  },
  18: { en: 'All five fingers', ru: 'Все пять пальцев' },
  19: { en: 'All five fingers', ru: 'Все пять пальцев' },
  20: {
    en: 'The stretches 2–4 and 4–5, and fingers 2, 3 and 4',
    ru: 'Растяжки 2–4 и 4–5 и 2-й, 3-й, 4-й пальцы',
  },
}
