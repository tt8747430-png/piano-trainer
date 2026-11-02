import { pitchClassOf, printedNote, type PitchClass } from '@/shared/lib/music'
import { OctaveGrid } from './OctaveGrid'
import { usualName } from './usual-name'
import { PickerShell } from './PickerShell'

/**
 * A pitch, whatever its spelling (Intervals' root, the melody note, the Chord finder's bass): its usual
 * name with ⌃⌄, opening an octave of twelve cells drawn as the piano's keys, each named as the major
 * keys name it (C, D♭, D, E♭, E, F, F♯, G, A♭, A, B♭, B). A tap chooses and closes.
 */
export function PitchPicker({
  label,
  value,
  onChange,
  bare,
  className,
}: {
  label: string
  value: PitchClass
  onChange: (pc: PitchClass) => void
  bare?: boolean
  className?: string
}) {
  const name = printedNote(usualName(value))
  return (
    <PickerShell label={label} value={name} spoken={name} bare={bare} className={className}>
      {({ close, start }) => (
        <OctaveGrid
          label={label}
          split={false}
          value={usualName(value)}
          start={start}
          onChoose={(spelled) => {
            close()
            const pc = pitchClassOf(spelled)
            if (pc !== value) onChange(pc)
          }}
        />
      )}
    </PickerShell>
  )
}
