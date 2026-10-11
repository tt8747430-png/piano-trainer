import { keepBars, takeBarCount, type TakeId, type TakesStore } from '@/entities/take'

/**
 * Cuts a take to its bars `first`…`last` (from 0) for good (ADR 0028 as amended by ADR 0034). A take
 * another tab already cut short, so the bars chosen are no longer all in it, is left as it is.
 */
export function keepTakeBars(store: TakesStore, id: TakeId, first: number, last: number): void {
  store.setState((state) => ({
    takes: state.takes.map((take) =>
      take.id === id && last < takeBarCount(take) ? keepBars(take, first, last) : take,
    ),
  }))
}
