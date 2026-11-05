import type { SettingsStore } from '@/entities/settings'

/** A page of Practice opened, however it was reached (R32): first for Up next, eight kept at most. */
export function notePracticeOpened(store: SettingsStore, page: string): void {
  const { practiceRecent } = store.getState()
  store.setState({
    practiceRecent: [page, ...practiceRecent.filter((id) => id !== page)].slice(0, 8),
  })
}
