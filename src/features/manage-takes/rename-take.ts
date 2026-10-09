import { TAKE_NAME_MAX, type TakeId, type TakesStore } from '@/entities/take'

/** Names a take: the text trimmed, at most `TAKE_NAME_MAX` characters; a blank one takes the name away. */
export function renameTake(store: TakesStore, id: TakeId, text: string): void {
  if (!store.getState().takes.some((take) => take.id === id)) return
  const name = text.trim().slice(0, TAKE_NAME_MAX).trim()
  store.setState((state) => ({
    takes: state.takes.map((take) => {
      if (take.id !== id) return take
      const { name: _name, ...unnamed } = take
      return name === '' ? unnamed : { ...unnamed, name }
    }),
  }))
}
