import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { compile } from 'tailwindcss'
import { describe, expect, it } from 'vitest'

const tailwind = path.dirname(createRequire(import.meta.url).resolve('tailwindcss/package.json'))

/** The CSS the app's theme makes of some classes, compiled as the build compiles it. */
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

/** Each style rule's selector, with the at-rules it stands in, outermost first. */
function rulesOf(css: string): { selector: string; within: string[] }[] {
  const rules: { selector: string; within: string[] }[] = []
  const open: string[] = []
  let text = ''
  for (const char of css) {
    if (char === '{') {
      const prelude = text.trim()
      if (!prelude.startsWith('@'))
        rules.push({ selector: prelude, within: open.filter((at) => at.startsWith('@')) })
      open.push(prelude)
      text = ''
    } else if (char === '}' || char === ';') {
      if (char === '}') open.pop()
      text = ''
    } else text += char
  }
  return rules
}

describe('the theme', () => {
  it('washes what a pointer rests on only where a fine pointer hovers: a tap leaves nothing behind', async () => {
    // A phone that says it hovers keeps a tapped element hovered; its wash would stay (the title's).
    const hovered = rulesOf(
      await compiled([
        'hover:bg-foreground/5',
        'group-hover:scale-x-150',
        'disabled:hover:bg-card',
      ]),
    ).filter((rule) => rule.selector.includes(':hover'))
    expect(new Set(hovered.map((rule) => rule.selector)).size).toBe(3)
    for (const rule of hovered)
      expect(rule.within).toContain('@media (hover: hover) and (pointer: fine)')
  })

  it('sets ♭ ♮ ♯ in both faces as text sets them, before the music font draws them for a staff', async () => {
    const css = await compiled(['font-sans', 'font-display'])
    expect(css).toContain(`'Onest Variable', 'Text Accidentals', 'Noto Music'`)
    expect(css).toContain(`'Literata Variable', 'Text Accidentals', 'Noto Music'`)
    const face = readFileSync('src/styles/fonts/text-accidentals.css', 'utf8')
    expect(face).toContain(`font-family: 'Text Accidentals'`)
    expect(face).toMatch(/unicode-range: U\+266D-266F, U\+1D12A-1D12B;/)
  })
})
