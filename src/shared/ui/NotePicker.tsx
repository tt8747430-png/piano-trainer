import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import {
  noteName,
  noteParam,
  PITCH_CLASSES,
  type NoteParam,
  type PitchClass,
  type SpelledNote,
} from '@/shared/lib/music'

/**
 * One of the twelve notes, all in sight and a tap away: six across, twelve where its own width holds them.
 * Each is spelled by `spell` (the rule of what the note roots: a scale, a chord, a key) and named by
 * `name` for a screen reader and over the grid, where the name says more than the note ("B minor").
 */
export function NotePicker({
  label,
  value,
  spell,
  name = noteName,
  onChange,
}: {
  label: string
  value: NoteParam
  spell: (pc: PitchClass) => SpelledNote
  name?: (note: SpelledNote) => string
  onChange: (note: NoteParam) => void
}) {
  const notes = PITCH_CLASSES.map(spell)
  const chosen = notes.find((note) => noteParam(note) === value)
  return (
    <div className="@container flex min-w-0 flex-col gap-2">
      <p aria-hidden className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        {chosen ? <span className="font-semibold">{name(chosen)}</span> : null}
      </p>
      <RadioGroup
        aria-label={label}
        value={value}
        onValueChange={(next) => {
          const picked = notes.find((note) => noteParam(note) === next)
          if (picked && noteParam(picked) !== value) onChange(noteParam(picked))
        }}
        className="grid grid-cols-6 gap-1 rounded-2xl bg-muted p-1 @lg:grid-cols-12"
      >
        {notes.map((note) => (
          <Radio.Root
            key={noteParam(note)}
            value={noteParam(note)}
            aria-label={name(note)}
            className="inline-flex h-11 cursor-default items-center justify-center rounded-lg border border-transparent text-base font-semibold text-muted-foreground transition-colors duration-200 ease-out select-none hover:text-foreground data-checked:border-input data-checked:bg-card data-checked:text-foreground"
          >
            {noteName(note)}
          </Radio.Root>
        ))}
      </RadioGroup>
    </div>
  )
}
