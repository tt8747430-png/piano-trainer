import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { THEME_COLORS } from './theme-colors'

const tokens = readFileSync('src/styles/tokens.css', 'utf8')

/** The custom properties a rule block in tokens.css declares. */
function declarations(selector: string) {
  const start = tokens.indexOf(`${selector} {`)
  if (start < 0) throw new Error(`tokens.css has no ${selector} block`)
  const body = tokens.slice(start, tokens.indexOf('}', start))
  return new Map(
    [...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value]),
  )
}

const root = declarations(':root')
const dark = declarations("[data-theme='dark']")

/** Follows var(--p-…) references down to the primitive's raw value. */
function resolve(value: string | undefined): string | undefined {
  const reference = value?.match(/^var\((--[\w-]+)\)$/)?.[1]
  return reference ? resolve(root.get(reference)) : value
}

describe('THEME_COLORS', () => {
  it('is the light theme’s page background', () => {
    expect(THEME_COLORS.light).toBe(resolve(root.get('--background')))
  })

  it('is the dark theme’s page background', () => {
    expect(THEME_COLORS.dark).toBe(resolve(dark.get('--background')))
  })
})
