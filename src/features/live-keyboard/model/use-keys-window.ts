import {
  selectKeysWindow,
  useSettings,
  useSettingsStoreApi,
  type KeysScreenSize,
  type KeysWindow,
} from '@/entities/settings'
import { setKeysWindow } from '@/features/set-preference'
import { LANDSCAPE_PHONE, useMediaQuery } from '@/shared/lib'

/** A phone held upright: narrower than 40rem. */
const PHONE_UPRIGHT = '(max-width: 39.99rem)'

/**
 * Where the keys' window stands for this screen's size (loop round 24): a phone upright, a phone on
 * its side and a wider screen each keep their own, so a window a phone left small never comes up
 * small on a laptop; null where the learner moved none (at the foot, the screen's width). `set`
 * keeps it for this size, null putting it back.
 */
export function useKeysWindow(): {
  window: KeysWindow | null
  set: (window: KeysWindow | null) => void
} {
  const store = useSettingsStoreApi()
  const side = useMediaQuery(LANDSCAPE_PHONE)
  const phone = useMediaQuery(PHONE_UPRIGHT)
  const size: KeysScreenSize = side ? 'side' : phone ? 'phone' : 'wide'
  const window = useSettings((state) => selectKeysWindow(state)[size])
  return { window, set: (next) => setKeysWindow(store, size, next) }
}
