import { describe, expect, it } from 'vitest'
import { BLOCK_PRESETS, DEFAULT_STYLE, sanitiseStyle, styleVars } from './style'

describe('the block style (R29 B9)', () => {
  it('drops unknown keys, values out of range and any url() or free text', () => {
    expect(
      sanitiseStyle({
        radius: 9,
        border: 2,
        shadow: 'deep',
        surface: 'url(javascript:alert(1))',
        text: '#12ab9F',
        padding: 'roomy',
        layout: 'grid',
        position: 'fixed',
      }),
    ).toEqual({ ...DEFAULT_STYLE, border: 2, text: '#12ab9f', padding: 'roomy', layout: 'grid' })
    expect(sanitiseStyle({ surface: 'red; background: url(x)' }).surface).toBe(
      DEFAULT_STYLE.surface,
    )
    expect(sanitiseStyle('not a style')).toEqual(DEFAULT_STYLE)
  })

  it('keeps a paint by its name and a colour only as #rrggbb', () => {
    expect(sanitiseStyle({ surface: 'lilac', text: '#fff' })).toMatchObject({
      surface: 'lilac',
      text: DEFAULT_STYLE.text,
    })
  })

  it('makes every preset a whole style, each passing the sanitiser unchanged', () => {
    for (const preset of Object.values(BLOCK_PRESETS)) {
      expect(sanitiseStyle(preset)).toEqual(preset)
      expect(Object.keys(preset).sort()).toEqual(Object.keys(DEFAULT_STYLE).sort())
    }
  })

  it('sets custom properties alone, from values the sanitiser kept', () => {
    const vars = styleVars({ ...DEFAULT_STYLE, surface: 'sky', text: '#102030', radius: 3 })
    expect(Object.keys(vars).every((key) => key.startsWith('--block-'))).toBe(true)
    expect(vars['--block-surface']).toBe('var(--paint-sky)')
    expect(vars['--block-text']).toBe('#102030')
    expect(vars['--block-radius']).toBe('var(--block-radius-3)')
  })

  it('writes a paint chosen as text in its ink, never its pale wash (R31-S)', () => {
    const vars = styleVars({ ...DEFAULT_STYLE, surface: 'sky', text: 'sky' })
    expect(vars['--block-surface']).toBe('var(--paint-sky)')
    expect(vars['--block-text']).toBe('var(--on-paint-sky)')
    expect(styleVars(DEFAULT_STYLE)['--block-text']).toBe('var(--foreground)')
  })
})
