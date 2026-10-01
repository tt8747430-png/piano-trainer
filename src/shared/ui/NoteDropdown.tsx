import {
  noteName,
  noteParam,
  PITCH_CLASSES,
  type NoteParam,
  type PitchClass,
  type SpelledNote,
} from '@/shared/lib/music'
import { Dropdown } from './Dropdown'

/**
 * One of the twelve notes behind a pop-up button, each spelled by `spell`: the rule of what the note
 * roots or where it sits (a scale's root, a chord's, a note in a key); each named by `name`, else by
 * the note alone (a piece's key names its mode: "E♭ major").
 */
export function NoteDropdown({
  label,
  value,
  spell,
  name = noteName,
  onChange,
  className,
}: {
  label: string
  value: NoteParam
  spell: (pc: PitchClass) => SpelledNote
  name?: (note: SpelledNote) => string
  onChange: (note: NoteParam) => void
  className?: string
}) {
  return (
    <Dropdown
      label={label}
      value={value}
      options={PITCH_CLASSES.map((pc) => {
        const spelled = spell(pc)
        return { value: noteParam(spelled), label: name(spelled) }
      })}
      onChange={onChange}
      className={className}
    />
  )
}
