import type { ReactNode } from 'react'
import {
  LETTERS,
  note,
  noteFromParam,
  noteName,
  noteParam,
  ROOT_ACCIDENTALS,
  type Letter,
  type NoteParam,
  type RootAccidental,
  type SpelledNote,
} from '@/shared/lib/music'
import { StepStrip } from './StepStrip'

/** A letter's spellings in a strip's order: flat, natural, sharp, so C C♯ D♭ D runs up the keys. */
const BY_PITCH: readonly RootAccidental[] = [-1, 0, 1]

/** The sharps and flats that fall on a white key (E♯, F♭, B♯, C♭): left out of a root's strip. */
const ON_A_WHITE_KEY = (letter: Letter, accidental: RootAccidental) =>
  (accidental === 1 && (letter === 'E' || letter === 'B')) ||
  (accidental === -1 && (letter === 'F' || letter === 'C'))

/** The 17 spellings a root is named by: every letter, and each black key both ways. */
const ROOT_SPELLINGS = (letter: Letter): readonly RootAccidental[] =>
  ROOT_ACCIDENTALS.filter((accidental) => !ON_A_WHITE_KEY(letter, accidental))

/**
 * A note as it is written, chosen from a strip of its spellings with ‹ › to step along it, as the
 * reference app does: C C♯ D♭ D … B, both spellings of a black key side by side, its name beside
 * the label. What is chosen is
 * what is written: D♭ stays D♭. `accidentals` keeps each letter to the spellings it may take (a
 * key's); the note chosen is always in the strip.
 */
export function NoteChoice({
  label,
  value,
  onChange,
  accidentals = ROOT_SPELLINGS,
  name = noteName,
  children,
}: {
  label: string
  value: NoteParam
  onChange: (note: NoteParam) => void
  accidentals?: (letter: Letter) => readonly RootAccidental[]
  /** How the note chosen is named over the choice ("C♯ minor"). */
  name?: (note: SpelledNote) => string
  /** A part of the same choice after the strip: a key's mode. */
  children?: ReactNode
}) {
  const chosen = noteFromParam(value)
  const spellings = LETTERS.flatMap((letter) =>
    BY_PITCH.filter(
      (accidental) =>
        accidentals(letter).includes(accidental) ||
        (letter === chosen.letter && accidental === chosen.accidental),
    ).map((accidental) => note(letter, accidental)),
  )
  return (
    <div role="group" aria-label={label} className="@container flex min-w-0 flex-col gap-2">
      <p aria-hidden className="flex items-baseline gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-semibold">{name(chosen)}</span>
      </p>
      <div className="flex flex-col gap-2 @2xl:flex-row @2xl:items-center">
        <div className="min-w-0 flex-1">
          <StepStrip
            label={label}
            value={value}
            options={spellings.map((spelled) => ({
              value: noteParam(spelled),
              label: noteName(spelled),
            }))}
            onChange={onChange}
          />
        </div>
        {children}
      </div>
    </div>
  )
}
