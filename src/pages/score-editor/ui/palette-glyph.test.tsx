import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CLEFS } from '@/shared/lib/music'
import { ClefSign } from '@/shared/ui/pickers/picker-pictures'
import { OctaveLineGlyph, PaletteGlyph, TupletGlyph } from './palette-glyph'

const glyphs = (container: HTMLElement) =>
  [...container.querySelectorAll('[data-smufl]')].map((each) => ({
    name: each.getAttribute('data-smufl'),
    scale: each.getAttribute('data-scale'),
  }))

describe('the palette’s glyphs (A34)', () => {
  it('every clef cell draws one SMuFL glyph at one size', () => {
    const drawn = CLEFS.map((clef) => glyphs(render(<ClefSign clef={clef} />).container))
    expect(drawn.every((cell) => cell.length === 1)).toBe(true)
    expect(new Set(drawn.map((cell) => cell[0]?.scale)).size).toBe(1)
    // An octave clef's figure is the font's own glyph, never composed.
    const names = drawn.map((cell) => cell[0]?.name)
    expect(names).toContain('gClef8vb')
    expect(names).toContain('fClef15ma')
  })

  it('draws a key’s glyph, a tuplet’s figure and an octave line’s mark from the music font', () => {
    const key = glyphs(render(<PaletteGlyph smufl="graceNoteAcciaccaturaStemUp" />).container)
    expect(key.map((each) => each.name)).toEqual(['graceNoteAcciaccaturaStemUp'])
    const tuplet = glyphs(render(<TupletGlyph num={3} />).container)
    expect(tuplet.map((each) => each.name)).toEqual(['tuplet3'])
    const ratio = glyphs(render(<TupletGlyph num={5} of={4} />).container)
    expect(ratio.map((each) => each.name)).toEqual(['tuplet5', 'tupletColon', 'tuplet4'])
    const octave = glyphs(render(<OctaveLineGlyph line="8vb" />).container)
    expect(octave.map((each) => each.name)).toEqual(['ottavaBassaVb'])
  })
})
