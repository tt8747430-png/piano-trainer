import type { SettingsStore } from '@/entities/settings'

/** A tip put away, or done (R31-P): it shows no more, on this visit or any after. */
export function retireTip(store: SettingsStore, id: string): void {
  const { tipsSeen } = store.getState()
  if (!tipsSeen.includes(id)) store.setState({ tipsSeen: [...tipsSeen, id] })
}
