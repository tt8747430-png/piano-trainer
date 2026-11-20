import type { ReactElement, ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** A page's small picture, drawn in a 44-unit box: what the page holds, shown rather than named. */
export type PagePicture = (props: { className?: string }) => ReactElement

const INK = 'fill-foreground'
const LINE = 'stroke-foreground'
const WHITE = 'fill-card'

function Frame({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg viewBox="0 0 44 44" aria-hidden className={cn('shrink-0', className)}>
      {children}
    </svg>
  )
}

/** Chords: seven keys, the chord's three lit in the paint. */
export const KeysPicture: PagePicture = ({ className }) => (
  <Frame className={className}>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <rect
        key={i}
        x={6 + i * 5}
        y={12}
        width={4.6}
        height={20}
        rx={1}
        className={i % 2 === 1 && i < 6 ? 'fill-paint-full-sand' : WHITE}
      />
    ))}
    {[0, 1, 3, 4, 5].map((i) => (
      <rect key={i} x={9.5 + i * 5} y={12} width={3} height={12} className={INK} />
    ))}
  </Frame>
)

/** Scales and keys: a staff, six notes climbing. */
export const StaffPicture: PagePicture = ({ className }) => (
  <Frame className={className}>
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M6 ${14 + i * 4}H38`} strokeWidth={0.7} className={LINE} />
    ))}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <ellipse key={i} cx={11 + i * 5} cy={32 - i * 2.2} rx={2.2} ry={1.7} className={INK} />
    ))}
  </Frame>
)

/** Intervals: two notes and the leap between them. */
export const ArcPicture: PagePicture = ({ className }) => (
  <Frame className={className}>
    <ellipse cx={13} cy={30} rx={3} ry={2.3} className={INK} />
    <ellipse cx={31} cy={18} rx={3} ry={2.3} className={INK} />
    <path d="M14 26Q22 6 30 14" fill="none" strokeWidth={1.4} className={LINE} />
  </Frame>
)

/** Progressions: the numerals of the commonest, each on its own place. */
export const RomanPicture: PagePicture = ({ className }) => (
  <Frame className={className}>
    {(
      [
        [10, 'I'],
        [22, 'IV'],
        [34, 'V'],
      ] as const
    ).map(([x, numeral]) => (
      <text
        key={numeral}
        x={x}
        y={27}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        className={cn('font-sans', INK)}
      >
        {numeral}
      </text>
    ))}
  </Frame>
)

/** Accompaniment: a bass under a rocking pattern. */
export const RollPicture: PagePicture = ({ className }) => (
  <Frame className={className}>
    {[0, 1, 2, 3].map((i) => (
      <rect
        key={i}
        x={6 + i * 8}
        y={28 - (i % 2) * 8}
        width={6}
        height={3.5}
        rx={1.5}
        className={INK}
      />
    ))}
    <rect x={6} y={34} width={30} height={3.5} rx={1.5} className="fill-current" />
  </Frame>
)

/** Finger technique: five fingers up and back, a Hanon bar. */
export const DrillPicture: PagePicture = ({ className }) => (
  <Frame className={className}>
    {[0, 2, 3, 4, 5, 4, 3, 2].map((step, i) => (
      <ellipse key={i} cx={8 + i * 4.4} cy={30 - step * 2.4} rx={1.8} ry={1.4} className={INK} />
    ))}
    <path d="M9.6 30V17M40 30V17" strokeWidth={0.6} className={LINE} />
  </Frame>
)

/** Jazz vocabulary: Barry Harris's 6th-diminished, its sign alone (the canvas's `sixdim`). */
export const SixDimPicture: PagePicture = ({ className }) => (
  <Frame className={className}>
    <text
      x={22}
      y={28.5}
      textAnchor="middle"
      fontSize={15}
      fontWeight={700}
      className={cn('font-sans', INK)}
    >
      6°
    </text>
  </Frame>
)

/** A jazz book: swung eighths under a triplet's 3. */
export const SwingPicture: PagePicture = ({ className }) => (
  <Frame className={className}>
    {(
      [
        [9, 31],
        [17, 28],
        [27, 31],
        [35, 26],
      ] as const
    ).map(([x, y]) => (
      <g key={x}>
        <ellipse
          cx={x}
          cy={y}
          rx={2.6}
          ry={2}
          transform={`rotate(-20 ${x} ${y})`}
          className={INK}
        />
        <path d={`M${x + 2.4} ${y}V${y - 13}`} strokeWidth={1} className={LINE} />
      </g>
    ))}
    <path d="M11.4 18H19.4M29.4 18H37.4" strokeWidth={2.2} className={LINE} />
    <text
      x={22}
      y={40.5}
      textAnchor="middle"
      fontSize={6.5}
      fontWeight={700}
      className={cn('font-sans', INK)}
    >
      3
    </text>
  </Frame>
)

/** The Chord player: a chord sheet's boxes. */
export const ChartPicture: PagePicture = ({ className }) => (
  <Frame className={className}>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect
        key={i}
        x={6 + (i % 3) * 11}
        y={12 + Math.floor(i / 3) * 11}
        width={10}
        height={10}
        rx={2}
        className={WHITE}
      />
    ))}
  </Frame>
)

/** The Metronome: its case and its pendulum. */
export const MetroPicture: PagePicture = ({ className }) => (
  <Frame className={className}>
    <path
      d="M15 34 19 10h6l4 24z"
      fill="none"
      strokeWidth={1.6}
      strokeLinejoin="round"
      className={LINE}
    />
    <path d="M22 28 29 13" strokeWidth={1.6} strokeLinecap="round" className={LINE} />
  </Frame>
)

/** The Tuner: a gauge and its needle, in copper. */
export const NeedlePicture: PagePicture = ({ className }) => (
  <Frame className={className}>
    <path d="M9 30A14 14 0 0 1 35 30" fill="none" strokeWidth={1.4} className={LINE} />
    <path d="M22 31 25 15" strokeWidth={2} strokeLinecap="round" className="stroke-(--p-copper)" />
    <circle cx={22} cy={31} r={2} className={INK} />
  </Frame>
)

/** The Chord finder: keys under a lens. */
export const LensPicture: PagePicture = ({ className }) => (
  <Frame className={className}>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={7 + i * 5} y={20} width={4.6} height={16} rx={1} className={WHITE} />
    ))}
    <circle cx={25} cy={17} r={7} fill="none" strokeWidth={1.6} className={LINE} />
    <path d="m30 22 5 5" strokeWidth={1.8} strokeLinecap="round" className={LINE} />
  </Frame>
)

/** The Circle of fifths: the wheel, C's wedge lit in honey. */
export const CirclePicture: PagePicture = ({ className }) => (
  <Frame className={className}>
    <circle cx={22} cy={22} r={14} strokeWidth={1.2} className={cn(WHITE, LINE)} />
    <circle cx={22} cy={22} r={7} fill="none" strokeWidth={0.8} className={LINE} />
    <path d="M22 8 29 9.9 22 15z" strokeWidth={0.6} className={cn('fill-primary', LINE)} />
  </Frame>
)
