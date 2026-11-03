import { readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { compile } from 'tailwindcss'
import { describe, expect, it } from 'vitest'

const SRC = path.resolve(import.meta.dirname, '..')
const tailwind = path.dirname(createRequire(import.meta.url).resolve('tailwindcss/package.json'))

async function compiled(classes: string[]): Promise<string> {
  const compiler = await compile(`@import 'tailwindcss'; @import './theme.css';`, {
    base: 'src/styles',
    loadStylesheet: async (id, base) => {
      const file = id === 'tailwindcss' ? path.join(tailwind, 'index.css') : path.resolve(base, id)
      return { path: file, base: path.dirname(file), content: readFileSync(file, 'utf8') }
    },
  })
  return compiler.build(classes)
}

function filesUnder(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) return filesUnder(file)
    return /\.tsx$/.test(entry.name) && !entry.name.includes('.test.') ? [file] : []
  })
}

describe('one selected style (R15)', () => {
  it('fills the chosen with the chosen fill and a hover with the lighter muted one', async () => {
    const css = await compiled(['choice'])
    expect(css).toMatch(/:hover:not\([^)]*\)\s*\{\s*background-color: var\(--color-muted\)/)
    expect(css).toMatch(/\[aria-pressed='true'\][^{]*\{\s*background-color: var\(--color-chosen\)/)
    for (const state of ['[data-checked]', "[aria-current='page']", "[data-status='active']"])
      expect(css).toContain(state)
  })

  it('marks the chosen by its fill alone, never a second highlight (a line, a colour)', () => {
    // A switch is on or off, not chosen; a colour swatch is its own fill, so its ring marks it.
    const own = ['shared/ui/primitives/switch.tsx', 'features/manage-library/ui/LookFields.tsx']
    const twice = filesUnder(SRC)
      .filter((file) => !own.includes(path.relative(SRC, file)))
      .flatMap((file) =>
        [
          ...readFileSync(file, 'utf8').matchAll(
            /(?:aria-pressed|data-checked|aria-checked|data-\[status=active\]):(?:border-(?!transparent)|ring-|text-link)\S*/g,
          ),
        ].map((match) => `${path.relative(SRC, file)}: ${match[0]}`),
      )
    expect(twice).toEqual([])
  })

  it('is what the shared choices wear', () => {
    for (const file of [
      'shared/ui/Segmented.tsx',
      'shared/ui/ChoiceChips.tsx',
      'shared/ui/PictureTiles.tsx',
      'shared/ui/primitives/toggle.tsx',
      'shared/ui/pickers/PickerGrid.tsx',
      'widgets/app-nav/ui/AppNav.tsx',
    ])
      expect(readFileSync(path.join(SRC, file), 'utf8'), file).toMatch(/\bchoice\b/)
    expect(readFileSync(path.join(SRC, 'styles/theme.css'), 'utf8')).toMatch(
      /@utility tab \{[^}]*\bchoice\b/,
    )
  })
})
