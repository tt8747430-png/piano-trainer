import type { RunStep } from '@/entities/progress'

/** The bars with a slip, to loop: from the first to the last of them. */
export function mistakeBars(steps: readonly RunStep[]): { first: number; last: number } | null {
  const slips = steps.flatMap((step, bar) => (step === 'slip' ? [bar] : []))
  const first = slips[0]
  const last = slips.at(-1)
  return first === undefined || last === undefined ? null : { first, last }
}
