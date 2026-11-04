import { TAKE_NAME_MAX, type FreeTake, type TakeId, type TakesStore } from '@/entities/take'

/**
 * Names a take or a free recording (R29 B11): the text trimmed, at most `TAKE_NAME_MAX` characters;
 * a blank one takes the name away.
 */
export function renameTake(store: TakesStore, id: TakeId, text: string): void {
  const { takes, free } = store.getState()
  if (![...takes, ...free].some((take) => take.id === id)) return
  const name = text.trim().slice(0, TAKE_NAME_MAX).trim()
  const named = <T extends FreeTake>(take: T): T => {
    if (take.id !== id) return take
    const { name: _name, ...unnamed } = take
    return (name === '' ? unnamed : { ...unnamed, name }) as T
  }
  store.setState((state) => ({ takes: state.takes.map(named), free: state.free.map(named) }))
}
