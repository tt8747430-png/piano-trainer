import { useCallback, useEffect, useState } from 'react'
import { browserDeviceStorage, type DeviceStorage } from '@/shared/api/device-storage'

/** What the device keeps, as the page shows it: not yet known, or its size and whether it is kept safe. */
export type Kept =
  | { readonly state: 'unknown' }
  | { readonly state: 'known'; readonly used: number | null; readonly safe: boolean }

/**
 * What the browser keeps for the app (ADR 0116): how much, and whether it is kept safe from being
 * cleared when the device runs short of space; `keepSafe` asks for it.
 */
export function useDeviceStorage(storage: DeviceStorage = browserDeviceStorage()) {
  const [device] = useState(storage)
  const [kept, setKept] = useState<Kept>({ state: 'unknown' })
  const [refused, setRefused] = useState(false)
  useEffect(() => {
    let current = true
    void Promise.all([device.estimate(), device.persisted()]).then(([estimate, safe]) => {
      if (current) setKept({ state: 'known', used: estimate?.used ?? null, safe })
    })
    return () => {
      current = false
    }
  }, [device])
  const keepSafe = useCallback(async () => {
    const safe = await device.persist()
    setRefused(!safe)
    setKept((was) => (was.state === 'known' ? { ...was, safe } : was))
  }, [device])
  return { kept, refused, keepSafe }
}
