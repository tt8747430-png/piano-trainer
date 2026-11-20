import type { ReactNode } from 'react'
import { printedNote, sameNote, type SpelledNote } from '@/shared/lib/music'
import { OctaveGrid } from './OctaveGrid'
import { PickerShell } from './PickerShell'

/**
 * A root as it is written (Chords' root, a scale's, a walk's): its name with ⌃⌄, opening an octave of
 * twelve cells drawn as the piano's keys, a black key's cell split "C♯ | D♭", a tap on a half choosing
 * that spelling, so the spelling is seen and chosen in one tap. No E♯, F♭, B♯ or C♭ is offered.
 */
export function NotePicker({
  label,
  value,
  onChange,
  name = printedNote,
  bare,
  title,
  className,
}: {
  label: string
  value: SpelledNote
  onChange: (spelled: SpelledNote) => void
  /** How the button names the note chosen, where it says more than the note ("C♯ minor"). */
  name?: (spelled: SpelledNote) => ReactNode
  bare?: boolean
  /** A part of a name made of its pickers (`PickerShell`'s `title`). */
  title?: boolean
  className?: string
}) {
  return (
    <PickerShell
      label={label}
      value={name(value)}
      spoken={printedNote(value)}
      bare={bare}
      title={title}
      className={className}
    >
      {({ close, start }) => (
        <OctaveGrid
          label={label}
          split
          value={value}
          start={start}
          onChoose={(spelled) => {
            close()
            if (!sameNote(spelled, value)) onChange(spelled)
          }}
        />
      )}
    </PickerShell>
  )
}
