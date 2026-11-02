import type { KeyboardEvent } from 'react'
import { cn } from '@/shared/lib'
import { usualName } from './usual-name'
import {
  note,
  PITCH_CLASSES,
  pitchClassOf,
  printedNote,
  sameNote,
  type SpelledNote,
} from '@/shared/lib/music'

/** The black keys of an octave, each by its two spellings: sharp first, as the circle writes them. */
const BLACK: ReadonlyMap<number, readonly [SpelledNote, SpelledNote]> = new Map([
  [1, [note('C', 1), note('D', -1)]],
  [3, [note('D', 1), note('E', -1)]],
  [6, [note('F', 1), note('G', -1)]],
  [8, [note('G', 1), note('A', -1)]],
  [10, [note('A', 1), note('B', -1)]],
])

/** The grid's columns: an octave in three rows of four, C to D♯ | E♭, E to G, G♯ | A♭ to B. */
const COLUMNS = 4

/**
 * Where an arrow takes the focus among the grid's choices: ← → to the one before or after, ↑ ↓ a row
 * up or down (to the same half of a split key where it has one), Home and End to the ends.
 */
function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
  const choices = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')]
  const at = choices.findIndex((choice) => choice === document.activeElement)
  if (at < 0) return
  const current = choices[at]
  const cell = Number(current?.dataset.cell)
  const half = Number(current?.dataset.half)
  const inCell = (target: number) => {
    const halves = choices.filter((choice) => Number(choice.dataset.cell) === target)
    return halves[Math.min(half, halves.length - 1)]
  }
  const next = {
    ArrowRight: choices[Math.min(choices.length - 1, at + 1)],
    ArrowLeft: choices[Math.max(0, at - 1)],
    ArrowDown: cell + COLUMNS < 12 ? inCell(cell + COLUMNS) : undefined,
    ArrowUp: cell - COLUMNS >= 0 ? inCell(cell - COLUMNS) : undefined,
    Home: choices[0],
    End: choices[choices.length - 1],
  }[event.key]
  if (!(event.key in { ArrowRight: 1, ArrowLeft: 1, ArrowDown: 1, ArrowUp: 1, Home: 1, End: 1 }))
    return
  event.preventDefault()
  next?.focus()
}

/**
 * An octave of twelve cells drawn as the piano's keys, white ones light and black ones dark, in three
 * rows of four. `split`, a black key's cell is cut in two, "C♯ | D♭", a tap on a half choosing that
 * spelling; else each cell is named by its usual name. A radio group: the arrows move, Enter or Space
 * chooses, the chosen one takes the focus as the grid opens.
 */
export function OctaveGrid({
  label,
  split,
  value,
  onChoose,
  start,
}: {
  label: string
  split: boolean
  /** The note chosen: by its spelling where the grid is split, else by its pitch. */
  value: SpelledNote
  onChoose: (spelled: SpelledNote) => void
  /** Spread on the value chosen: where the focus lands as the panel opens. */
  start?: { readonly 'data-picker-start': string }
}) {
  const cells = PITCH_CLASSES.map((pc) => {
    const black = BLACK.get(pc)
    return { pc, black: black !== undefined, spellings: split && black ? black : [usualName(pc)] }
  })
  const all = cells.flatMap((cell) => cell.spellings)
  // A spelling the grid does not offer (E♯, or a pitch alone) is shown by its key's first cell.
  const shown =
    all.find((each) => split && sameNote(each, value)) ??
    all.find((each) => pitchClassOf(each) === pitchClassOf(value))
  const isChosen = (spelled: SpelledNote) => spelled === shown
  const tabStop = all.find(isChosen) ?? all[0]
  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={moveFocus}
      className="grid grid-cols-4 gap-1.5"
    >
      {cells.map(({ pc, black, spellings }) => (
        <div
          key={pc}
          className={cn(
            'flex min-h-13 overflow-hidden rounded-xl border',
            black
              ? 'divide-x divide-on-key-black/25 border-key-black bg-key-black text-on-key-black'
              : 'border-input bg-key-white text-on-key-white',
          )}
        >
          {spellings.map((spelled, half) => {
            const on = isChosen(spelled)
            return (
              <button
                key={printedNote(spelled)}
                {...(spelled === tabStop ? start : {})}
                type="button"
                role="radio"
                aria-checked={on}
                tabIndex={spelled === tabStop ? 0 : -1}
                data-cell={pc}
                data-half={half}
                onClick={() => onChoose(spelled)}
                className={cn(
                  'flex min-w-0 flex-1 items-center justify-center font-semibold whitespace-nowrap transition-colors duration-150 outline-none select-none focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-ring',
                  spellings.length > 1 ? 'text-sm' : 'text-base',
                  on
                    ? 'bg-selected text-selected-foreground'
                    : black
                      ? 'hover:bg-on-key-black/15'
                      : 'hover:bg-muted',
                )}
              >
                {printedNote(spelled)}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
