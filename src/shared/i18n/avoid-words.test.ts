import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = resolve(import.meta.dirname, '../../..')
const LOCALES = resolve(import.meta.dirname, 'locales')

/** The _Avoid_ phrases of the glossary's "Words the app says" section, each a whole phrase. */
function avoided(): string[] {
  const glossary = readFileSync(join(ROOT, 'docs/UBIQUITOUS_LANGUAGE.md'), 'utf8')
  const section = glossary.split('## Words the app says')[1]?.split('\n## ')[0] ?? ''
  return section
    .split('\n')
    .flatMap(
      (line) =>
        /_Avoid:_ (.+)$/
          .exec(line)?.[1]
          ?.replace(/\s*\([^)]*\)/g, '')
          .replace(/\.$/, '')
          .split(', ') ?? [],
    )
    .map((phrase) => phrase.trim())
    .filter((phrase) => phrase.length > 0)
}

const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function localeFiles(): string[] {
  return readdirSync(LOCALES).flatMap((locale) =>
    readdirSync(join(LOCALES, locale)).map((file) => join(LOCALES, locale, file)),
  )
}

describe('the app says the musician’s word (A6)', () => {
  const phrases = avoided()

  it('reads the glossary’s avoided phrases', () => {
    expect(phrases).toContain('Move smoothly')
  })

  it('uses none of them in a locale file', () => {
    const found = localeFiles().flatMap((file) => {
      const text = readFileSync(file, 'utf8')
      return phrases
        .filter((phrase) => new RegExp(`['\`]${escaped(phrase)}['\`]`).test(text))
        .map((phrase) => `${file.slice(LOCALES.length + 1)}: ${phrase}`)
    })
    expect(found).toEqual([])
  })
})
