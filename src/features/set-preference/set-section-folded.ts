import { FOLDED_MAX, type SettingsStore } from '@/entities/settings'

/** Folds the section `id` away, or opens it; the newest folds kept, as many as the device keeps. */
export function setSectionFolded(store: SettingsStore, id: string, folded: boolean): void {
  store.setState((state) => {
    const others = state.foldedSections.filter((each) => each !== id)
    return { foldedSections: folded ? [...others, id].slice(-FOLDED_MAX) : others }
  })
}
