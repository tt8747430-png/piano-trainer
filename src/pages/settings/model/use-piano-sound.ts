import { useCallback, useEffect, useState } from 'react'
import { createPianoDownload, type PianoDownload } from '@/shared/api/audio'

/** The grand piano's files on this device, as Storage and backup shows them (A27). */
export type PianoSound =
  | { readonly state: 'reading' }
  /** The browser keeps no caches, or the manifest cannot be had: nothing to show. */
  | { readonly state: 'none' }
  | {
      readonly state: 'known'
      readonly kept: number
      readonly total: number
      /** The share kept while a download runs (0 to 1); null when none runs. */
      readonly downloading: number | null
      readonly failed: boolean
    }

/**
 * How much of the grand this device keeps, `download` to fetch the rest for offline, with its
 * progress, and `remove` to free its space.
 */
export function usePianoSound(files?: PianoDownload) {
  const [download] = useState(() => files ?? createPianoDownload())
  const [sound, setSound] = useState<PianoSound>({ state: 'reading' })

  const measure = useCallback(
    async (failed = false) => {
      const kept = await download.measure()
      setSound(kept ? { state: 'known', ...kept, downloading: null, failed } : { state: 'none' })
    },
    [download],
  )

  useEffect(() => {
    let current = true
    void download.measure().then((kept) => {
      if (current)
        setSound(
          kept ? { state: 'known', ...kept, downloading: null, failed: false } : { state: 'none' },
        )
    })
    return () => {
      current = false
    }
  }, [download])

  const start = useCallback(async () => {
    const whole = await download.download((share) =>
      setSound((was) =>
        was.state === 'known' ? { ...was, downloading: share, failed: false } : was,
      ),
    )
    await measure(!whole)
  }, [download, measure])

  const remove = useCallback(async () => {
    await download.remove()
    await measure()
  }, [download, measure])

  return { sound, download: start, remove }
}
