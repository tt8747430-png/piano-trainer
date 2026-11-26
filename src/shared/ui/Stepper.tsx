import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { Input } from './primitives/input'

/**
 * A number set a step at a time (Flat's tempo and measures), as the canvas's stepper draws it: − and
 * + 44px either side of its value in one white capsule with a hairline ring, greyed at its least and
 * its most, or wholly where it cannot be set (`disabled`). Said in words (`format`), or, `typed`, a field the number is
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
  disabled = false,
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
  /** Shown, but not to be set: both its buttons greyed (a MIDI keyboard's octave where the browser has no MIDI). */
  disabled?: boolean
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
  const button = (by: -1 | 1) => {
    const name = by < 0 ? decrease : increase
    const next = value + by * step
    const Icon = by < 0 ? Minus : Plus
    return (
      <button
        type="button"
        aria-label={name}
        title={name}
        disabled={disabled || next < min || next > max}
        onClick={() => onChange(Math.min(max, Math.max(min, next)))}
        className="flex size-11 shrink-0 items-center justify-center rounded-control text-foreground transition-colors hover:bg-muted disabled:text-muted-foreground/50 disabled:hover:bg-transparent [&_svg]:size-5"
      >
        <Icon aria-hidden />
      </button>
    )
  }
  return (
    <div
      role="group"
      aria-label={label}
      className="flex shrink-0 items-center rounded-control bg-card ring-1 ring-border"
    >
      {button(-1)}
      {typed ? (
        <Input
          inputMode="numeric"
          enterKeyHint="done"
          disabled={disabled}
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
          className="h-11 w-16 rounded-none border-0 bg-transparent px-0 text-center text-subhead font-semibold tabular-nums shadow-none"
        />
      ) : (
        <output
          aria-live="polite"
          className="min-w-16 px-1 text-center text-subhead font-semibold whitespace-nowrap tabular-nums"
        >
          {format(value)}
        </output>
      )}
      {button(1)}
    </div>
  )
}
