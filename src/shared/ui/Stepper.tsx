import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from './primitives/button'
import { Input } from './primitives/input'

/**
 * A number set a step at a time (Flat's tempo and measures): its value between − and +, each 44px,
 * greyed at its least and its most. Said in words (`format`), or, `typed`, a field the number is
 * typed into as well, kept between its least and its most once it is left.
 */
export function Stepper({
  label,
  value,
  min,
  max,
  step = 1,
  format = String,
  typed = false,
  onChange,
  decrease,
  increase,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  /** The value as it reads: "4 weeks". */
  format?: (value: number) => string
  /** The number typed in a field, Flat's: its digits alone, `format` its name for a screen reader. */
  typed?: boolean
  onChange: (value: number) => void
  /** The buttons' names: "Fewer weeks", "More weeks". */
  decrease: string
  increase: string
}) {
  // What is being typed, read once the field is left or Enter pressed.
  const [draft, setDraft] = useState<string | null>(null)
  const commit = () => {
    if (draft === null) return
    const read = Number.parseInt(draft, 10)
    if (Number.isFinite(read)) onChange(Math.min(max, Math.max(min, read)))
    setDraft(null)
  }
  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      {typed ? (
        <Input
          inputMode="numeric"
          enterKeyHint="done"
          aria-label={label}
          aria-valuetext={format(value)}
          value={draft ?? String(value)}
          onChange={(event) => setDraft(event.target.value.replace(/\D/g, '').slice(0, 4))}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              commit()
            }
          }}
          className="h-11 min-w-0 flex-1 rounded-xl bg-card px-4 text-base font-semibold tabular-nums"
        />
      ) : (
        <output
          aria-live="polite"
          className="min-w-0 flex-1 rounded-xl bg-card px-4 py-2.5 font-semibold tabular-nums"
        >
          {format(value)}
        </output>
      )}
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11 rounded-xl"
        aria-label={decrease}
        title={decrease}
        disabled={value - step < min}
        onClick={() => onChange(Math.max(min, value - step))}
      >
        <Minus aria-hidden />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-11 rounded-xl"
        aria-label={increase}
        title={increase}
        disabled={value + step > max}
        onClick={() => onChange(Math.min(max, value + step))}
      >
        <Plus aria-hidden />
      </Button>
    </div>
  )
}
