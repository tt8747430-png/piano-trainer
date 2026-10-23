import type { MethodCode, MethodEntry } from '../model/types'

/** One of the five ways by its number ("Way 1"), so it never reads as a bar's number over it. */
const way = (code: MethodCode) => ({ en: `Way ${code}`, ru: `Способ ${code}` })
/** A right-hand technique's code as the book prints it (5.1); otherwise the source book's short label. */
const numbered = (code: MethodCode) => ({ en: code, ru: code })

export const METHODS: Readonly<Record<MethodCode, MethodEntry>> = {
  '1': { pattern: 'M1', label: way('1') },
  '2': { pattern: 'M2', label: way('2') },
  '3': { pattern: 'M3', label: way('3') },
  '4': { pattern: 'M4', label: way('4') },
  '5': { pattern: 'M5', label: way('5') },
  t1: { pattern: 't1', label: { en: '♪♩', ru: '♪♩' } },
  t2: { pattern: 't2', label: { en: '♪♪♪♪', ru: '♪♪♪♪' } },
  t3: { pattern: 't3', label: { en: '♬ down', ru: '♬ вниз' } },
  t4: { pattern: 't4', label: { en: '♬ up', ru: '♬ вверх' } },
  t5: { pattern: 't5', label: { en: '♩.♪♩', ru: '♩.♪♩' } },
  '3ch': { pattern: 'c3', label: { en: '3 chords', ru: '3 аккорда' } },
  inv: { pattern: 'inv', label: { en: 'Invers.', ru: 'Обращ.' } },
  '5.1': { pattern: 'p51', label: numbered('5.1') },
  '5.2': { pattern: 'p52', label: numbered('5.2') },
  '5.3': { pattern: 'p53', label: numbered('5.3') },
  '6u': { pattern: 's6u', label: { en: '6th↑', ru: 'Сексты ↑' } },
  '6d': { pattern: 's6d', label: { en: '6th↓', ru: 'Сексты ↓' } },
  oct: { pattern: 'oct', label: { en: 'Octaves', ru: 'Октавы' } },
  octs: { pattern: 'octs', label: { en: 'Octaves (scale)', ru: 'Октавы (гамма)' } },
  ch: { pattern: 'chd', label: { en: 'Chords', ru: 'Аккорды' } },
}
