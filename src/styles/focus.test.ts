import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const SRC = path.resolve(import.meta.dirname, '..')

function filesUnder(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) return filesUnder(file)
    return /\.tsx?$/.test(entry.name) && !entry.name.includes('.test.') ? [file] : []
  })
}

/**
 * A focus drawn another way than the one ring (A36, DESIGN.md Buttons): a box-shadow ring, a line,
 * an underline, a thinner outline, a fill. A field written in place (a song's words) shows its
 * focus by its fill, as a document's line does.
 */
const OTHER_FOCUS =
  /focus-visible:(?:ring-(?!0\b)\S+|border-ring|underline|outline-[12](?![\d])|outline-hidden|bg-\S+)/g
const IN_PLACE = ['pages/piece/ui/SongEdit.tsx']

describe('one focus ring (A36)', () => {
  it('is drawn by the base rule alone: 3px of the ring colour, 2px outside', () => {
    const theme = readFileSync(path.join(SRC, 'styles/theme.css'), 'utf8')
    expect(theme).toMatch(
      /:focus-visible \{\s*outline: 3px solid var\(--color-ring\);\s*outline-offset: 2px;/,
    )
  })

  it('is never drawn another way by a control', () => {
    const other = filesUnder(SRC)
      .filter((file) => !IN_PLACE.includes(path.relative(SRC, file)))
      .flatMap((file) =>
        [...readFileSync(file, 'utf8').matchAll(OTHER_FOCUS)].map(
          (match) => `${path.relative(SRC, file)}: ${match[0]}`,
        ),
      )
    expect(other).toEqual([])
  })
})
