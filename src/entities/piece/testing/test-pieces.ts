import type { ChartPiece, DegreePiece, Section } from '../model/types'

/** A song to parse in tests: one section of the given lines unless sections are given. */
export function testSong(
  lines: readonly string[],
  overrides: Partial<ChartPiece> & { sections?: readonly Section[] } = {},
): ChartPiece {
  return {
    id: 'bz0',
    kind: 'song',
    title: 'Test',
    key: 'C',
    meter: '4/4',
    tempo: 72,
    pattern: 'r4',
    sections: [{ kind: 'verse', lines }],
    ...overrides,
  }
}

export function testProgression(
  progression: DegreePiece['progression'],
  overrides: Partial<DegreePiece> = {},
): DegreePiece {
  return {
    id: 'prog',
    kind: 'song',
    title: 'Test',
    key: 'C',
    meter: '4/4',
    tempo: 72,
    pattern: 'block',
    chordSize: { default: 'sevenths', choosable: true },
    progression,
    ...overrides,
  }
}
