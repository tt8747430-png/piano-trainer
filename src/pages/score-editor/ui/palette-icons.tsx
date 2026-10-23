import type { ReactNode } from 'react'
import type { BarEdit } from '@/features/score-editor'
import type { PaletteCategory } from '../model/palette-categories'

/**
 * The palette's pictures, drawn as a score draws them: each on one 24-unit square, in one stroke's
 * weight, so every category's and every bar key's picture sits level in the same box. The clef is Bravura's own
 * outline (SMuFL U+E050, as Verovio engraves it).
 */
function Icon({ children, viewBox = '0 0 24 24' }: { children: ReactNode; viewBox?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
    >
      {children}
    </svg>
  )
}

/** A staff's five lines, faint, under what a picture draws on them. */
const STAFF = (
  <path d="M2 6 H22 M2 9 H22 M2 12 H22 M2 15 H22 M2 18 H22" strokeWidth="0.9" opacity="0.45" />
)

const G_CLEF =
  'M376 415l25 -145c3 -18 3 -18 29 -18c147 0 241 -113 241 -241c0 -113 -67 -198 -168 -238c-14 -6 -15 -5 -13 -17c11 -62 29 -157 29 -214c0 -170 -130 -200 -197 -200c-151 0 -190 98 -190 163c0 62 40 115 107 115c61 0 96 -47 96 -102c0 -58 -36 -85 -67 -94c-23 -7 -32 -10 -32 -17c0 -13 26 -29 80 -29c59 0 159 18 159 166c0 47 -15 134 -27 201c-2 12 -4 11 -15 9c-20 -4 -46 -6 -69 -6c-245 0 -364 165 -364 339c0 202 153 345 297 464c12 10 11 12 9 24c-7 41 -14 106 -14 164c0 104 24 229 98 311c20 22 51 48 65 48c11 0 37 -28 52 -50c41 -60 65 -146 65 -233c0 -153 -82 -280 -190 -381c-6 -6 -8 -7 -6 -19zM470 943c-61 0 -133 -96 -133 -252c0 -32 2 -66 6 -92c2 -13 6 -14 13 -8c79 69 174 159 174 270c0 55 -27 82 -60 82zM361 262l-21 128c-2 11 -4 12 -14 4c-47 -38 -93 -75 -153 -142c-83 -94 -93 -173 -93 -232c0 -139 113 -236 288 -236c20 0 40 2 56 5c15 3 16 3 14 14l-50 298c-2 11 -4 12 -20 8c-61 -17 -100 -60 -100 -117c0 -46 30 -89 72 -107c7 -3 15 -6 15 -13c0 -6 -4 -11 -12 -11c-7 0 -19 3 -27 6c-68 23 -115 87 -115 177c0 85 57 164 145 194c18 6 18 5 15 24zM430 103l49 -285c2 -12 4 -12 16 -6c56 28 94 79 94 142c0 88 -67 156 -148 163c-12 1 -13 -2 -11 -14z'
/** The glyph's height in its units (1000 to an em), from its top at 1098 down to −658. */
const G_CLEF_TOP = 1098
const G_CLEF_HEIGHT = 1756
/** The scale that stands the clef 20 units tall in a 24-unit square, flipped to the screen's y. */
const G_CLEF_SCALE = 20 / G_CLEF_HEIGHT

/** A word or numeral drawn in the box: a dynamic, a chord, a time signature's figures. */
function Word({
  text,
  y = 16,
  size = 11,
  italic = false,
}: {
  text: string
  y?: number
  size?: number
  italic?: boolean
}) {
  return (
    <text
      x="12"
      y={y}
      textAnchor="middle"
      fontFamily="Georgia, serif"
      fontStyle={italic ? 'italic' : 'normal'}
      fontWeight="700"
      fontSize={size}
      fill="currentColor"
      stroke="none"
    >
      {text}
    </text>
  )
}

/** A sharp, drawn as the staff draws it, filled. */
const SHARP = (
  <path
    d="M8.5 3h1.4v18H8.5zM14.1 2h1.4v18h-1.4zM5 9.6 19 6.6v2.8L5 12.4zM5 15.6l14-3v2.8L5 18.4z"
    fill="currentColor"
    stroke="none"
  />
)

/** Each category's picture in the palette's bar. */
const CATEGORY_ICONS: Readonly<Record<PaletteCategory, ReactNode>> = {
  // An eighth note.
  notes: (
    <Icon>
      <g fill="currentColor" stroke="none">
        <ellipse cx="9" cy="17.5" rx="4.2" ry="3" transform="rotate(-20 9 17.5)" />
        <rect x="12.1" y="3" width="1.6" height="14.5" />
        <path d="M13.7 3c0 3 5 4 4.5 9-.5-2.5-2.5-3.6-4.5-3.8z" />
      </g>
    </Icon>
  ),
  // Flat's ♭•↕: a note moved up or down, its accidental beside it; a sharp alone would read as
  // the accidentals, which are the Notes' (research 2026-10-flat-and-dorico §1).
  pitch: (
    <Icon>
      <path d="M3.5 3.5V18.5c3.4-1.5 4.7-4 3.4-5.4-1-.9-2.5-.5-3.4.8" />
      <ellipse
        cx="12.6"
        cy="14"
        rx="3.2"
        ry="2.3"
        transform="rotate(-20 12.6 14)"
        fill="currentColor"
        stroke="none"
      />
      <path d="M19.5 3.5V20.5M17 6l2.5-2.5L22 6M17 18l2.5 2.5L22 18" />
    </Icon>
  ),
  // An accent over a notehead.
  articulations: (
    <Icon>
      <path d="M6 4 L18 8 L6 12" strokeWidth="2" />
      <ellipse
        cx="12"
        cy="18"
        rx="4.2"
        ry="3"
        transform="rotate(-20 12 18)"
        fill="currentColor"
        stroke="none"
      />
    </Icon>
  ),
  // A dynamic over a crescendo's hairpin.
  dynamics: (
    <Icon>
      <Word text="mf" y={11} size={11} italic />
      <path d="M3 16 L21 19 M3 16 L21 13" />
    </Icon>
  ),
  // A slur over two notes.
  lines: (
    <Icon>
      <path d="M4 12 C8 4 16 4 20 12" />
      <ellipse
        cx="5"
        cy="17"
        rx="3.4"
        ry="2.4"
        transform="rotate(-20 5 17)"
        fill="currentColor"
        stroke="none"
      />
      <ellipse
        cx="19"
        cy="17"
        rx="3.4"
        ry="2.4"
        transform="rotate(-20 19 17)"
        fill="currentColor"
        stroke="none"
      />
    </Icon>
  ),
  // A bar between its barlines.
  bar: (
    <Icon>
      {STAFF}
      <path d="M5 6 V18 M19 6 V18" strokeWidth="2" />
    </Icon>
  ),
  // The treble clef, Bravura's.
  clef: (
    <Icon>
      <path
        d={G_CLEF}
        fill="currentColor"
        stroke="none"
        transform={`translate(12 ${2 + G_CLEF_TOP * G_CLEF_SCALE}) scale(${G_CLEF_SCALE} ${-G_CLEF_SCALE}) translate(-336 0)`}
      />
    </Icon>
  ),
  // A key signature: two sharps on the staff.
  key: (
    <Icon>
      {STAFF}
      <g transform="translate(1 1) scale(0.5)">{SHARP}</g>
      <g transform="translate(10 5) scale(0.5)">{SHARP}</g>
    </Icon>
  ),
  // A time signature's figures, one over the other.
  time: (
    <Icon>
      <Word text="4" y={11} size={11} />
      <Word text="4" y={22} size={11} />
    </Icon>
  ),
  // An end-repeat barline: its dots, a thin line and a thick one.
  repeats: (
    <Icon>
      {STAFF}
      <path d="M14 6 V18" strokeWidth="1.5" />
      <path d="M18.5 6 V18" strokeWidth="3" strokeLinecap="butt" />
      <circle cx="10" cy="10.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="10" cy="13.5" r="1.3" fill="currentColor" stroke="none" />
    </Icon>
  ),
  // Expression text as printed: italic words over the notes.
  text: (
    <Icon>
      <Word text="espr." y={16} size={10.5} italic />
    </Icon>
  ),
  // A note with its finger's number over it.
  fingering: (
    <Icon>
      <Word text="3" y={9.5} size={9.5} />
      <ellipse
        cx="12"
        cy="17"
        rx="4.2"
        ry="3"
        transform="rotate(-20 12 17)"
        fill="currentColor"
        stroke="none"
      />
    </Icon>
  ),
  // A chord symbol.
  chords: (
    <Icon>
      <Word text="C7" y={16} size={11} />
    </Icon>
  ),
}

/** A category's picture. */
export function CategoryIcon({ category }: { category: PaletteCategory }) {
  return CATEGORY_ICONS[category]
}

/** The bar edits the palette's Bar holds: copy, cut and paste are the edit row's. */
export type BarKeyEdit = Exclude<BarEdit, 'copy' | 'cut' | 'paste'>

/** Each bar edit's picture, drawn on a staff as the edit changes it. */
const BAR_ICONS: Readonly<Record<BarKeyEdit, ReactNode>> = {
  // A new bar after a barline, its +.
  insert: (
    <Icon>
      {STAFF}
      <path d="M3 6 V18 M11 6 V18" strokeWidth="1.5" />
      <path d="M17 8 V16 M13 12 H21" strokeWidth="2.25" />
    </Icon>
  ),
  // A new bar before a barline, its +.
  insertBefore: (
    <Icon>
      {STAFF}
      <path d="M13 6 V18 M21 6 V18" strokeWidth="1.5" />
      <path d="M7 8 V16 M3 12 H11" strokeWidth="2.25" />
    </Icon>
  ),
  // A bar crossed out.
  delete: (
    <Icon>
      {STAFF}
      <path d="M3 6 V18 M21 6 V18" strokeWidth="1.5" />
      <path d="M8 8 L16 16 M16 8 L8 16" strokeWidth="2.25" />
    </Icon>
  ),
  // A system break: the line goes on below.
  newLine: (
    <Icon>
      <path d="M3 6 H20 V12 H5" />
      <path d="M8.5 8.5 L5 12 L8.5 15.5" />
      <path d="M5 18 H14" opacity="0.45" />
    </Icon>
  ),
  // The next line's bars brought up onto this one.
  joinLine: (
    <Icon>
      <path d="M3 7 H12" />
      <path d="M3 17 H9 C15 17 17 13 17 8" />
      <path d="M14 10.5 L17 7.5 L20 10.5" />
    </Icon>
  ),
  // A rehearsal mark's boxed letter after a double barline: a new section.
  newSection: (
    <Icon>
      <path d="M3 6 V18" strokeWidth="1.25" />
      <path d="M5.5 6 V18" strokeWidth="2.5" strokeLinecap="butt" />
      <rect x="9" y="5" width="12" height="14" rx="1.5" strokeWidth="1.5" />
      <text
        x="15"
        y="16.2"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontWeight="700"
        fontSize="10"
        fill="currentColor"
        stroke="none"
      >
        A
      </text>
    </Icon>
  ),
}

/** A bar edit's picture. */
export function BarIcon({ edit }: { edit: BarKeyEdit }) {
  return BAR_ICONS[edit]
}

/** The coda's sign, a circle crossed, drawn rather than set: the music font's is too small to read. */
export function CodaSign() {
  return (
    <Icon>
      <ellipse cx="12" cy="12" rx="5.5" ry="6.5" strokeWidth="2" />
      <path d="M12 2 V22 M3 12 H21" strokeWidth="1.5" />
    </Icon>
  )
}

/** How each barline key draws its mark, on a staff. */
const BARLINE_ICONS = {
  repeatStart: (
    <Icon>
      {STAFF}
      <path d="M5.5 6 V18" strokeWidth="3" strokeLinecap="butt" />
      <path d="M10 6 V18" strokeWidth="1.5" />
      <circle cx="14" cy="10.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="14" cy="13.5" r="1.3" fill="currentColor" stroke="none" />
    </Icon>
  ),
  repeatEnd: CATEGORY_ICONS.repeats,
  ending1: (
    <Icon>
      {STAFF}
      <path d="M4 18 V3 H20" strokeWidth="1.5" />
      <Word text="1." y={11} size={8} />
    </Icon>
  ),
  ending2: (
    <Icon>
      {STAFF}
      <path d="M4 18 V3 H20" strokeWidth="1.5" />
      <Word text="2." y={11} size={8} />
    </Icon>
  ),
  double: (
    <Icon>
      {STAFF}
      <path d="M13 6 V18 M17 6 V18" strokeWidth="1.5" />
    </Icon>
  ),
  final: (
    <Icon>
      {STAFF}
      <path d="M12.5 6 V18" strokeWidth="1.5" />
      <path d="M17.5 6 V18" strokeWidth="3.5" strokeLinecap="butt" />
    </Icon>
  ),
  plain: (
    <Icon>
      {STAFF}
      <path d="M15 6 V18" strokeWidth="1.5" />
    </Icon>
  ),
} as const

/** A barline key's picture. */
export function BarlineIcon({ choice }: { choice: keyof typeof BARLINE_ICONS }) {
  return BARLINE_ICONS[choice]
}

/** A slur or an octave line's picture: a slur's arc, a hairpin, 8va over its dashed line. */
const LINE_ICONS = {
  slur: CATEGORY_ICONS.lines,
  cresc: (
    <Icon>
      <path d="M21 7 L3 12 L21 17" strokeWidth="2" />
    </Icon>
  ),
  dim: (
    <Icon>
      <path d="M3 7 L21 12 L3 17" strokeWidth="2" />
    </Icon>
  ),
  '8va': (
    <Icon>
      <Word text="8va" y={12} size={9} italic />
      <path d="M4 17 H18 V21" strokeDasharray="2 2" />
    </Icon>
  ),
  '8vb': (
    <Icon>
      <path d="M4 7 H18 V3" strokeDasharray="2 2" />
      <Word text="8vb" y={18} size={9} italic />
    </Icon>
  ),
} as const

/** A line key's picture. */
export function LineIcon({ line }: { line: keyof typeof LINE_ICONS }) {
  return LINE_ICONS[line]
}
