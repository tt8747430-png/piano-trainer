import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const LOCALES = resolve(import.meta.dirname, 'locales')

/** Plain phrases the owner rejected (A6), each a whole string; the musician's term goes in their place. */
const AVOIDED = [
  'Between two chords', // passing chords
  'Между двумя аккордами', // проходящие аккорды
  'Move smoothly', // voice leading
  'Плавный переход', // голосоведение
  'Starting position', // inversion
  'Начальное положение', // обращение
  'Lead into each chord', // approach chords
  'Подвести к каждому аккорду', // подводящие аккорды
  'Root motion', // root movement
  'Function', // harmonic function
  'Pulsing chords', // repeated chords
  'Who wrote it', // credits, composer, lyricist
]

const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function localeFiles(): string[] {
  return readdirSync(LOCALES).flatMap((locale) =>
    readdirSync(join(LOCALES, locale)).map((file) => join(LOCALES, locale, file)),
  )
}

describe('the app says the musician’s word (A6)', () => {
  it('uses none of them in a locale file', () => {
    const found = localeFiles().flatMap((file) => {
      const text = readFileSync(file, 'utf8')
      return AVOIDED.filter((phrase) => new RegExp(`['\`]${escaped(phrase)}['\`]`).test(text)).map(
        (phrase) => `${file.slice(LOCALES.length + 1)}: ${phrase}`,
      )
    })
    expect(found).toEqual([])
  })
})
