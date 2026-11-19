import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { note, pitchClassOf, printedNote, sameNote, type SpelledNote } from '@/shared/lib/music'

/** The twelve roots as the boards spell them (`ROOTS`): C, C♯, D, E♭, E, F, F♯, G, A♭, A, B♭, B. */
const ROOTS: readonly SpelledNote[] = [
  note('C'),
  note('C', 1),
  note('D'),
  note('E', -1),
  note('E'),
  note('F'),
  note('F', 1),
  note('G'),
  note('A', -1),
  note('A'),
  note('B', -1),
  note('B'),
]
const TRACKS = [ROOTS.slice(0, 6), ROOTS.slice(6)] as const

/**
 * A run's Root in its Setup (the kit's `ROOTGRID`): all twelve roots in sight, two even tracks of six
 * 8 apart, each the segmented fill 3 in and 2 apart, 14 round, a root 44 tall in 18px, the chosen on
 * the sheet in bold. The root chosen reads on its cell by its sound, whichever way it is spelled.
 */
export function RootGrid({
  label,
  value,
  onChange,
}: {
  label: string
  value: SpelledNote
  onChange: (root: SpelledNote) => void
}) {
  const chosen = ROOTS.find((root) => pitchClassOf(root) === pitchClassOf(value)) ?? ROOTS[0]
  return (
    <RadioGroup
      aria-label={label}
      value={chosen && printedNote(chosen)}
      onValueChange={(next) => {
        const root = ROOTS.find((each) => printedNote(each) === next)
        if (root && !sameNote(root, value)) onChange(root)
      }}
      className="flex flex-col gap-2"
    >
      {TRACKS.map((track, index) => (
        <div key={index} className="grid grid-cols-6 gap-0.5 rounded-[14px] bg-muted p-0.75">
          {track.map((root) => (
            <Radio.Root
              key={printedNote(root)}
              value={printedNote(root)}
              className="inline-flex h-11 min-w-0 cursor-default items-center justify-center rounded-[11px] text-lg font-medium text-foreground select-none focus-visible:-outline-offset-3 data-checked:bg-card data-checked:font-bold data-checked:shadow-[0_1px_3px_rgb(51_41_33/0.18),0_0_0_0.5px_rgb(51_41_33/0.12)]"
            >
              {printedNote(root)}
            </Radio.Root>
          ))}
        </div>
      ))}
    </RadioGroup>
  )
}
