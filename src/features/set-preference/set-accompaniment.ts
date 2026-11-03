import type { SettingsStore } from '@/entities/settings'

/** Shows or hides one of Accompaniment's sources in its tabs (A24). */
export function setAccompaniment(store: SettingsStore, source: string, shown: boolean): void {
  store.setState(({ accompaniment }) => {
    const others = accompaniment.hidden.filter((id) => id !== source)
    return { accompaniment: { ...accompaniment, hidden: shown ? others : [...others, source] } }
  })
}
