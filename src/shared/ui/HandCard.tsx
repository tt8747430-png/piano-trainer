import { isBlackKey, type Finger, type Hand, type Midi } from '@/shared/lib/music'

/** A white key's width and length, a black key's, in the drawing's units. */
const WHITE = 18
const LONG = 64
const BLACK = 11
const SHORT = 38
/** Where a fingertip lands on a white key (its front) and on a black one; the thumb, shorter, nearer. */
const ON_WHITE = 52
const ON_BLACK = 28
const THUMB_ON_WHITE = 58
const THUMB_ON_BLACK = 33
/** Where the four fingers meet the palm, where the thumb leaves its side, and the wrist. */
const KNUCKLES = 86
const THUMB_BASE = 108
const WRIST = 142
/** A finger's width, and the outline's. */
const FINGER = 14
const LINE = 1.5

/** One note of the hand's: its key and the finger on it. */
export interface FingeredKey {
  readonly key: Midi
  readonly finger: Finger
}

/** Each white key from `from` to `to` in turn, and where it starts. */
function whiteKeys(from: number, to: number): { key: number; x: number }[] {
  const keys: { key: number; x: number }[] = []
  for (let key = from; key <= to; key += 1)
    if (!isBlackKey(key as Midi)) keys.push({ key, x: keys.length * WHITE })
  return keys
}

/**
 * A hand drawn over the keys it plays, as the method books draw fingering (R29-P5, Alfred's, Faber's,
 * the Russian school's "аппликатура" pictures): the keys from a key under the lowest to one over the
 * highest, those played tinted; over them a hand's outline, palm down, the thumb short and to the
 * side, each finger that plays reaching its key, its number in an ink circle on its tip; a finger
 * that plays nothing drawn light, curled at its knuckle. The right hand's thumb is at the left, the
 * left hand's at the right: the left hand is the right mirrored.
 */
export function HandCard({
  hand,
  notes,
  label,
  className,
}: {
  hand: Hand
  notes: readonly FingeredKey[]
  /** The drawing's name to a screen reader: "Right hand: E♭ 1, G 2, B♭ 3, D 5". */
  label: string
  className?: string
}) {
  const lowest = Math.min(...notes.map((note) => note.key))
  const highest = Math.max(...notes.map((note) => note.key))
  // A white key either side, so the played keys never stand at the edge.
  let from = lowest - 1
  while (isBlackKey(from as Midi)) from -= 1
  let to = highest + 1
  while (isBlackKey(to as Midi)) to += 1
  const whites = whiteKeys(from, to)
  const width = whites.length * WHITE
  const xOf = (key: number): number => {
    if (!isBlackKey(key as Midi))
      return (whites.find((white) => white.key === key)?.x ?? 0) + WHITE / 2
    // A black key stands on the line between the white keys either side of it.
    return (whites.find((white) => white.key === key - 1)?.x ?? 0) + WHITE
  }
  const played = new Set<number>(notes.map((note) => note.key))
  // Where each finger's tip lands: on its key where it plays; else curled over its knuckle.
  const fingers = ([1, 2, 3, 4, 5] as const).map((finger) => {
    const note = notes.find((each) => each.finger === finger)
    return { finger, note }
  })
  const playedXs = notes.map((note) => xOf(note.key))
  const centre = (Math.min(...playedXs) + Math.max(...playedXs)) / 2
  const spread = Math.max(FINGER + 3, (Math.max(...playedXs) - Math.min(...playedXs)) / 4.6)
  // Fingers 2 to 5 rise from the knuckles left to right on the right hand, right to left on the
  // left; the thumb leaves the palm's side, the right hand's at the left.
  const way = hand === 'rh' ? 1 : -1
  const natural = (finger: Finger): number => centre + way * (finger - 3.5) * spread
  const noteOf = (finger: Finger) => notes.find((each) => each.finger === finger)
  // A knuckle leans toward its finger's key, so a finger reaching wide still reads as one hand.
  const knuckleX = (finger: Finger): number => {
    const note = noteOf(finger)
    return note ? (natural(finger) * 2 + xOf(note.key)) / 3 : natural(finger)
  }
  const palm = {
    left: Math.min(...([2, 3, 4, 5] as const).map(knuckleX)) - FINGER / 2 - 2,
    right: Math.max(...([2, 3, 4, 5] as const).map(knuckleX)) + FINGER / 2 + 2,
  }
  const knuckle = (finger: Finger): { x: number; y: number } =>
    finger === 1
      ? { x: way === 1 ? palm.left + 3 : palm.right - 3, y: THUMB_BASE }
      : { x: knuckleX(finger), y: KNUCKLES }
  const tipOf = (finger: Finger, note: FingeredKey | undefined): { x: number; y: number } => {
    if (!note) {
      const base = knuckle(finger)
      return { x: base.x - (finger === 1 ? way * 8 : 0), y: base.y - 14 }
    }
    const black = isBlackKey(note.key)
    const y = finger === 1 ? (black ? THUMB_ON_BLACK : THUMB_ON_WHITE) : black ? ON_BLACK : ON_WHITE
    return { x: xOf(note.key), y }
  }
  const height = WRIST + 6
  const minX = Math.min(0, palm.left - FINGER, knuckle(1).x - FINGER * 2)
  const maxX = Math.max(width, palm.right + FINGER, knuckle(1).x + FINGER * 2)
  /** A finger's shape: a thick round-ended stroke drawn twice, the outline under the paper. */
  const limb = (from: { x: number; y: number }, tip: { x: number; y: number }) =>
    `M ${from.x} ${from.y} L ${tip.x} ${tip.y}`
  return (
    <svg
      role="img"
      aria-label={label}
      data-hand={hand}
      viewBox={`${minX} 0 ${maxX - minX} ${height}`}
      className={className}
    >
      <g aria-hidden>
        {whites.map(({ key, x }) => (
          <rect
            key={key}
            x={x}
            y={0}
            width={WHITE}
            height={LONG}
            rx={2}
            strokeWidth={1}
            className={
              played.has(key) ? 'fill-key-scale stroke-border' : 'fill-key-white stroke-border'
            }
          />
        ))}
        {Array.from({ length: to - from + 1 }, (_, at) => from + at)
          .filter((key) => isBlackKey(key as Midi))
          .map((key) => (
            <rect
              key={key}
              x={xOf(key) - BLACK / 2}
              y={0}
              width={BLACK}
              height={SHORT}
              rx={1.5}
              className={played.has(key) ? 'fill-key-scale-down' : 'fill-foreground'}
            />
          ))}
        {/* Each finger from its knuckle, an outline with paper inside; then the palm over their
            roots, its outline arched at the knuckles and narrowing to the wrist. */}
        {fingers.map(({ finger, note }) => (
          <g key={finger} data-finger={finger} data-used={note ? 'true' : 'false'}>
            <path
              d={limb(knuckle(finger), tipOf(finger, note))}
              strokeLinecap="round"
              strokeWidth={FINGER + LINE * 2}
              className={note ? 'stroke-foreground' : 'stroke-border'}
            />
            <path
              d={limb(knuckle(finger), tipOf(finger, note))}
              strokeLinecap="round"
              strokeWidth={FINGER}
              className="stroke-card"
            />
          </g>
        ))}
        <path
          d={`M ${palm.left} ${KNUCKLES + 2} Q ${(palm.left + palm.right) / 2} ${KNUCKLES - 10} ${palm.right} ${KNUCKLES + 2} L ${palm.right - 8} ${WRIST + 6} L ${palm.left + 8} ${WRIST + 6} Z`}
          className="fill-card"
        />
        <path
          d={`M ${palm.left} ${KNUCKLES + 2} C ${palm.left - 3} ${KNUCKLES + 30} ${palm.left + 2} ${WRIST - 14} ${palm.left + 8} ${WRIST} M ${palm.right} ${KNUCKLES + 2} C ${palm.right + 3} ${KNUCKLES + 30} ${palm.right - 2} ${WRIST - 14} ${palm.right - 8} ${WRIST}`}
          fill="none"
          strokeWidth={LINE}
          strokeLinecap="round"
          className="stroke-foreground"
        />
        {fingers
          .filter((each) => each.note)
          .map(({ finger, note }) => {
            const tip = tipOf(finger, note)
            return (
              <g key={finger} data-tip={finger} data-key={note?.key}>
                <circle cx={tip.x} cy={tip.y} r={8} className="fill-foreground" />
                <text
                  x={tip.x}
                  y={tip.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-background text-[11px] font-bold"
                >
                  {finger}
                </text>
              </g>
            )
          })}
      </g>
    </svg>
  )
}
