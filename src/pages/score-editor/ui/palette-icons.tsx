import { G_CLEF } from '@/shared/ui/pickers/picker-pictures'
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
  // A dynamic as printed: ppp, Flat's dynamics' picture.
  dynamics: (
    <Icon>
      <Word text="ppp" y={16} size={11} italic />
    </Icon>
  ),
  // A turn, Flat's ornaments' picture: the S on its side as a score prints it.
  ornaments: (
    <Icon>
      <path
        d="M3.5 14.5C3.5 10 8 8.5 10.5 11.5L13.5 15C16 18 20.5 16 20.5 11.5C20.5 8.5 17.5 7.5 16 9.5M3.5 14.5C3.5 16.5 6 17.5 8 14.5"
        strokeWidth="2"
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
  // Text, Flat's Aa: the chord symbols, the lyrics and the words over the notes.
  text: (
    <Icon>
      <Word text="Aa" y={17} size={13} />
    </Icon>
  ),
}

/** A category's picture. */
export function CategoryIcon({ category }: { category: PaletteCategory }) {
  return CATEGORY_ICONS[category]
}

/** The pictures of the keys that open a field (ADR 0096), drawn as what they write prints. */
const FIELD_ICONS = {
  // A chord symbol in a box, Flat's chord key.
  chord: (
    <Icon>
      <rect x="2.5" y="4" width="19" height="16" rx="2.5" strokeWidth="1.5" />
      <Word text="C7" y={16} size={10} />
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
  // Flat's annotation: words in italics over a line of text.
  text: (
    <Icon>
      <Word text="Aa" y={13} size={11} italic />
      <path d="M4 19 H20" strokeWidth="1.5" />
    </Icon>
  ),
  // Flat's tempo key: a quarter note = its beats.
  tempo: (
    <Icon>
      <ellipse
        cx="6"
        cy="17"
        rx="3"
        ry="2.2"
        transform="rotate(-20 6 17)"
        fill="currentColor"
        stroke="none"
      />
      <path d="M8.7 16.2 V5" strokeWidth="1.4" />
      <path d="M12 10.5 H20 M12 14 H20" strokeWidth="1.4" />
    </Icon>
  ),
} as const

/** The picture of a field's key: a chord symbol's, a finger's. */
export function FieldIcon({ field }: { field: keyof typeof FIELD_ICONS }) {
  return FIELD_ICONS[field]
}

/** The bar edits the palette's Bar holds, each with a picture. */
export type BarKeyEdit = BarEdit

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

/** A slur or an octave line's picture: a slur's arc, a hairpin, 8va over its dashed line. */
const LINE_ICONS = {
  // A slur over two notes.
  slur: (
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
  '15ma': (
    <Icon>
      <Word text="15ma" y={12} size={8} italic />
      <path d="M4 17 H18 V21" strokeDasharray="2 2" />
    </Icon>
  ),
  '15mb': (
    <Icon>
      <path d="M4 7 H18 V3" strokeDasharray="2 2" />
      <Word text="15mb" y={18} size={8} italic />
    </Icon>
  ),
  // A glissando: a wavy line rising from one notehead to another.
  gliss: (
    <Icon>
      <ellipse cx="4.5" cy="18" rx="2.2" ry="1.6" fill="currentColor" stroke="none" />
      <ellipse cx="19.5" cy="6" rx="2.2" ry="1.6" fill="currentColor" stroke="none" />
      <path d="M6.5 16 q1.5 -3 3 -1.5 t3 -1.5 t3 -1.5 t2 -2.5" />
    </Icon>
  ),
} as const

/** A line key's picture. */
export function LineIcon({ line }: { line: keyof typeof LINE_ICONS }) {
  return LINE_ICONS[line]
}
