import { SmuflGlyph, SmuflPath, SmuflRun, figures, type SmuflName } from '@/shared/ui/smufl'

/**
 * A palette key's sign as the score prints it (A34, Flat's palettes): Bravura's glyphs at one size on
 * one baseline, centred in the key's 44px cell. A run (a tuplet's 3:2, 8va) is set on that baseline.
 */
export function PaletteGlyph({ smufl }: { smufl: SmuflName | readonly SmuflName[] }) {
  return <SmuflGlyph names={typeof smufl === 'string' ? [smufl] : smufl} />
}

/** A tuplet's mark as a score prints it: its figure (or n:m) in the music font under a bracket, ⌐3¬. */
export function TupletGlyph({ num, of }: { num: number; of?: number | undefined }) {
  const names: SmuflName[] = [
    ...figures(num, 'tuplet'),
    ...(of ? (['tupletColon', ...figures(of, 'tuplet')] as const) : []),
  ]
  const space = 5.5
  const width = 44
  const baseline = 27
  return (
    <svg aria-hidden data-slot="smufl-glyph" viewBox={`0 0 ${width} 44`} width={44} height={44}>
      <path
        d="M8 26 V19 H15 M29 19 H36 V26"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <SmuflRun names={names} x={width / 2} y={baseline} space={space} />
    </svg>
  )
}

/** The octave lines' marks: 8va over its dashed line, 8vb under it; 15ma and 15mb as Bravura sets them. */
const OCTAVE_MARKS = {
  '8va': 'ottavaAlta',
  '8vb': 'ottavaBassaVb',
  '15ma': 'quindicesimaAlta',
  '15mb': 'quindicesimaBassaMb',
} as const satisfies Readonly<Record<string, SmuflName>>

/** The staff space every octave line's mark is drawn at in a 24-unit picture. */
const OCTAVE_SPACE = 3.2

/** An octave line's picture in a 24-unit square: its mark, Bravura's, and its dashed line with its hook. */
export function OctaveLineGlyph({ line }: { line: keyof typeof OCTAVE_MARKS }) {
  const over = line.endsWith('a')
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-full">
      <SmuflPath name={OCTAVE_MARKS[line]} x={2} y={over ? 10 : 20} space={OCTAVE_SPACE} />
      <path
        d={over ? 'M4 15 H20 V19' : 'M4 6 H20 V2'}
        strokeDasharray="2 2"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
