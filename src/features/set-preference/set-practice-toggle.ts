import type { PracticeToggle, SettingsStore } from '@/entities/settings'

export function setPracticeToggle(store: SettingsStore, toggle: PracticeToggle, on: boolean): void {
  store.setState((state) => ({ practice: { ...state.practice, [toggle]: on } }))
}
