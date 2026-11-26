import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const SRC = resolve(import.meta.dirname, '..')

/** The shape scale (R14, DESIGN.md Shapes): the only corners a class may name. */
const SCALE = [
  'control',
  'card',
  'sheet',
  'pill',
  'key-black',
  'key-white',
  'thumb',
  'menu',
  'tile',
  'mark',
  'keys',
  'none',
  '[inherit]',
]

/**
 * Where a one-off may stand: the shadcn primitives keep their own classes, which `theme.css` maps
 * onto the scale; a test names the class it checks (a round button's is the primitive's).
 */
const ALLOWED_PATHS = ['shared/ui/primitives/']

/**
 * Files another change owns for now. The sign-in page is being redrawn alongside this change; its
 * buttons' `rounded-full` already resolves to the pill. Take an entry out once its file is on the
 * scale.
 */
const PENDING: readonly string[] = ['pages/account/ui/SocialButtons.tsx']

/**
 * Drawings whose corners scale with what they draw rather than stand on the scale: the small keys'
 * feet (DESIGN.md: the keys are drawings, not controls), a chord chip's corner in its own em so it
 * grows with the chord's name, and the week's bars' 2px tops.
 */
const DRAWINGS: Readonly<Record<string, readonly string[]>> = {
  'shared/ui/MiniKeys.tsx': ['rounded-b-[5px]', 'rounded-b-[3px]'],
  'widgets/chord-views/ui/ChordChip.tsx': ['rounded-[0.3125em]'],
  'pages/profile/ui/WeekCard.tsx': ['rounded-t-[2px]'],
}

/** A Tailwind corner class, with any side and variant prefix: `first:rounded-t-card`. */
const CORNER =
  /(?<![\w-])rounded(?:-(?:tl|tr|bl|br|ss|se|es|ee|t|b|l|r|s|e))?(?:-([\w[\]().%-]+))?(?![\w-])/g

/** A corner written in CSS: any value but a scale token, zero, or inherit is a one-off. */
const CSS_RADIUS = /border(?:-[a-z]+)*-radius:\s*([^;]+);/g

/** Corners written in CSS that are motion, not shape: the keys folding into their round button. */
// A styled place's corner (R29 B9) is the learner's choice among `--block-radius-0…4`, each a
// step of the scale's `--radius`, read through `--block-radius`.
const CSS_ALLOWED = new Set(['styles/theme.css:1.75rem', 'styles/theme.css:var(--block-radius)'])

function filesUnder(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return filesUnder(path)
    return /\.(tsx?|css)$/.test(entry.name) ? [path] : []
  })
}

const files = filesUnder(SRC)
  .map((path) => ({ path: relative(SRC, path), text: readFileSync(path, 'utf8') }))
  .filter(
    ({ path }) =>
      !ALLOWED_PATHS.some((allowed) => path.startsWith(allowed)) && !/\.test\.tsx?$/.test(path),
  )

describe('the shape scale', () => {
  it('names only the scale’s corners in a class', () => {
    const oneOffs = files
      .filter(({ path }) => !PENDING.includes(path))
      .flatMap(({ path, text }) =>
        [...text.matchAll(CORNER)]
          // Prose ("a rounded foot") is not a class: a class names a size or stands alone in quotes.
          .filter((match) => match[1] !== undefined && !SCALE.includes(match[1]))
          .filter((match) => !DRAWINGS[path]?.includes(match[0]))
          .map((match) => `${path}: ${match[0]}`),
      )
    expect(oneOffs).toEqual([])
  })

  it('writes a corner in CSS only through a scale token', () => {
    const oneOffs = files
      .filter(({ path }) => path.endsWith('.css'))
      .flatMap(({ path, text }) =>
        [...text.matchAll(CSS_RADIUS)]
          .map((match) => match[1]!.trim())
          .filter(
            (value) =>
              !/^var\(--radius-(control|card|sheet|pill)\)$/.test(value) &&
              value !== '0' &&
              value !== 'inherit' &&
              !CSS_ALLOWED.has(`${path}:${value}`),
          )
          .map((value) => `${path}: ${value}`),
      )
    expect(oneOffs).toEqual([])
  })

  it('maps Tailwind’s own sizes, which the primitives keep, onto the scale', () => {
    const theme = readFileSync(join(SRC, 'styles/theme.css'), 'utf8')
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl', '2xl'])
      expect(theme).toContain(`--radius-${size}: var(--radius-control);`)
    expect(theme).toContain('--radius-3xl: var(--radius-card);')
    expect(theme).toContain('--radius-4xl: var(--radius-sheet);')
  })

  it('fails a one-off it is shown', () => {
    const found = [...'p-2 rounded-lg first:rounded-t-[3px] rounded-card'.matchAll(CORNER)].map(
      (match) => match[1],
    )
    expect(found.filter((size) => size !== undefined && !SCALE.includes(size))).toEqual([
      'lg',
      '[3px]',
    ])
  })
})
