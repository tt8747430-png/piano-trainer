import {
  selectKeysHeight,
  useSettings,
  useSettingsStoreApi,
  type KeysScreenSize,
} from '@/entities/settings'
import { setKeysHeight } from '@/features/set-preference'
import { LANDSCAPE_PHONE, useMediaQuery } from '@/shared/lib'

/** A phone held upright: narrower than 40rem. */
const PHONE_UPRIGHT = '(max-width: 39.99rem)'

/**
 * The keys' height the divider set for this screen's size (R34): a phone upright, a phone on its side
 * and a wider screen each keep their own, so the keys a phone left short never come up short on a
 * laptop; null where the learner set none (a piano's proportion). `set` keeps a height for this size,
 * null forgetting it.
 */
export function useKeysHeight(): {
  height: number | null
  set: (height: number | null) => void
} {
  const store = useSettingsStoreApi()
  const side = useMediaQuery(LANDSCAPE_PHONE)
  const phone = useMediaQuery(PHONE_UPRIGHT)
  const size: KeysScreenSize = side ? 'side' : phone ? 'phone' : 'wide'
  const height = useSettings((state) => selectKeysHeight(state)[size])
  return { height, set: (next) => setKeysHeight(store, size, next) }
}
