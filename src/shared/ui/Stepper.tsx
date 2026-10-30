import { Minus, Plus } from 'lucide-react'
import { Button } from './primitives/button'

/**
 * A number set a step at a time (Flat's tempo and measures): its value said in words between − and +,
 * each 44px, greyed at its least and its most.
 */
export function Stepper({
  label,
  value,
  min,
  max,
  step = 1,
  format = String,
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
  onChange: (value: number) => void
  /** The buttons' names: "Fewer weeks", "More weeks". */
  decrease: string
  increase: string
}) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      <output
        aria-live="polite"
        className="min-w-0 flex-1 rounded-xl bg-card px-4 py-2.5 font-semibold tabular-nums"
      >
        {format(value)}
      </output>
      <Button
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
