import { describe, expect, it } from 'vitest'
import { BUILT_IN_PATTERNS } from '@/entities/pattern'
import type { ChartPiece } from '@/entities/piece'
import { arrangePiece, ownChoice } from '@/features/practice'
import type { Performance } from '@/shared/lib/arrangement'
import { shownView, viewNeeds } from './view-needs'

/** A song of two 4/4 bars in C: its line of chords (`_` a bar of none), a tune and its words. */
function song(line: string, { lyrics }: { lyrics?: readonly string[] } = {}): Performance {
  const piece: ChartPiece = {
    id: 'my-1',
    kind: 'song',
    title: 'Morning',
    key: 'C',
    meter: '4/4',
    tempo: 90,
    pattern: 'r1',
    sections: [{ kind: 'verse', lines: [line] }],
    staves: [{ notes: 'E4/2 F4/2 | G4/4' }],
    hands: { rh: 'C4/4 | D4/4', lh: 'C3/4 | G2/4' },
    ...(lyrics ? { lyrics } : {}),
  }
  return arrangePiece(piece, ownChoice(piece), BUILT_IN_PATTERNS, { unfold: true })
}

describe('viewNeeds', () => {
  it('opens every view to a song of chords and words', () => {
    expect(viewNeeds(song('C G', { lyrics: ['Good morn- ing'] }))).toEqual({})
  })

  it('closes Chords over lyrics to music of no words', () => {
    expect(viewNeeds(song('C G'))).toEqual({ lyrics: 'words' })
  })

  it('closes the chord views to music of no chord symbols, words or none', () => {
    const closed = { lyrics: 'chords', diagrams: 'chords', grid: 'chords' }
    expect(viewNeeds(song('_ _', { lyrics: ['Good morn- ing'] }))).toEqual(closed)
    expect(viewNeeds(song('_ _'))).toEqual(closed)
  })
})

describe('shownView', () => {
  it('shows the view saved where the music can show it', () => {
    for (const view of ['sheet', 'lyrics', 'diagrams', 'grid'] as const)
      expect(shownView(view, {})).toBe(view)
  })

  it('falls back from Chords over lyrics to Diagrams, and from Diagrams or the Grid to the sheet music', () => {
    expect(shownView('lyrics', { lyrics: 'words' })).toBe('diagrams')
    const noChords = { lyrics: 'chords', diagrams: 'chords', grid: 'chords' } as const
    expect(shownView('lyrics', noChords)).toBe('sheet')
    expect(shownView('diagrams', noChords)).toBe('sheet')
    expect(shownView('grid', noChords)).toBe('sheet')
    expect(shownView('sheet', noChords)).toBe('sheet')
  })
})
