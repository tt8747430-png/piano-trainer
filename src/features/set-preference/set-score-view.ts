import type { ScoreViewSettings, SettingsStore } from '@/entities/settings'
import type { StaffId } from '@/shared/lib/notation'

/** Saves how the Player shows a score: its layout and switches. */
export function setScoreView(
  store: SettingsStore,
  change: Partial<Omit<ScoreViewSettings, 'hidden'>>,
): void {
  store.setState((state) => ({ scoreView: { ...state.scoreView, ...change } }))
}

/** Shows a staff again, or hides it. */
export function setStaffShown(store: SettingsStore, staff: StaffId, shown: boolean): void {
  store.setState((state) => {
    const others = state.scoreView.hidden.filter((each) => each !== staff)
    return { scoreView: { ...state.scoreView, hidden: shown ? others : [...others, staff] } }
  })
}
