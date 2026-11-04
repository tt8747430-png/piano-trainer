import { figures, runInk, runOrigins, UNITS_PER_SPACE } from './run'
import { SMUFL, type SmuflName } from './smufl'

/**
 * One SMuFL glyph inside a picture's SVG, as the score draws it: its origin (the baseline's left) at
 * `x`, `y`, `space` of the picture's units to a staff space, every glyph at that one scale.
 */
export function SmuflPath({
  name,
  x,
  y,
  space,
}: {
  name: SmuflName
  x: number
  y: number
  space: number
}) {
  const scale = space / UNITS_PER_SPACE
  return (
    <path
      data-smufl={name}
      data-scale={scale}
      d={SMUFL[name].d}
      transform={`translate(${x} ${y}) scale(${scale} ${-scale})`}
      fill="currentColor"
      stroke="none"
    />
  )
}

/**
 * A run of glyphs set one after another on one baseline (a time signature's 12, a tuplet's 3:2, 8va),
 * centred on `x`.
 */
export function SmuflRun({
  names,
  x,
  y,
  space,
}: {
  names: readonly SmuflName[]
  x: number
  y: number
  space: number
}) {
  const scale = space / UNITS_PER_SPACE
  const [from, to] = runInk(names)
  const left = x - ((from + to) / 2) * scale
  const origins = runOrigins(names)
  return (
    <>
      {names.map((name, at) => (
        <SmuflPath
          key={`${name}-${at}`}
          name={name}
          x={left + (origins[at] ?? 0) * scale}
          y={y}
          space={space}
        />
      ))}
    </>
  )
}

/** A time signature's figures, count over unit, or common or cut time's sign, centred on `x` and the middle line `y`. */
export function TimeSignatureSign({
  count,
  unit,
  symbol = null,
  x,
  y,
  space,
}: {
  count: number
  unit: number
  symbol?: 'common' | 'cut' | null
  x: number
  y: number
  space: number
}) {
  if (symbol) {
    const name = symbol === 'common' ? 'timeSigCommon' : 'timeSigCutCommon'
    return <SmuflRun names={[name]} x={x} y={y} space={space} />
  }
  return (
    <>
      <SmuflRun names={figures(count, 'timeSig')} x={x} y={y - space} space={space} />
      <SmuflRun names={figures(unit, 'timeSig')} x={x} y={y + space} space={space} />
    </>
  )
}

/**
 * A run of glyphs as a picture of its own (a palette key's face): at `em` pixels to the em, every one
 * at that one size, the run centred in a `cell`-pixel square on its own box.
 */
export function SmuflGlyph({
  names,
  em = 22,
  cell = 44,
}: {
  names: readonly SmuflName[]
  em?: number
  cell?: number
}) {
  const space = em / 4
  const scale = space / UNITS_PER_SPACE
  const foot = Math.min(...names.map((name) => SMUFL[name].box[1]))
  const top = Math.max(...names.map((name) => SMUFL[name].box[3]))
  // The baseline set so the run's box stands in the cell's middle.
  const baseline = cell / 2 + ((top + foot) / 2) * scale
  return (
    <svg
      aria-hidden
      data-slot="smufl-glyph"
      viewBox={`0 0 ${cell} ${cell}`}
      width={cell}
      height={cell}
      className="shrink-0 overflow-visible"
    >
      <SmuflRun names={names} x={cell / 2} y={baseline} space={space} />
    </svg>
  )
}
