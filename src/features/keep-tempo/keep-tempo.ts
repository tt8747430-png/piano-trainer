import { withTempo, type ProgressStore } from '@/entities/progress'

/**
 * Keeps an exercise's tempo as its last (under `tempoKey`), so it opens there next time. A tempo
 * kept already writes nothing: a save is written on every setState.
 */
export function keepTempo(store: ProgressStore, key: string, tempo: number): void {
  if (store.getState().tempos[key] === tempo) return
  store.setState((state) => withTempo(state, key, tempo))
}
