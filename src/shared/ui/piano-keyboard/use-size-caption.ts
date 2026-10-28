import { useEffect, useState, type RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import type { KeySize } from '@/shared/lib'
import { midi, noteName, octaveOf, pitchClass, plainSpelling, type Midi } from '@/shared/lib/music'
import type { RailCaption } from './KeyRail'

/** How long after a key size is chosen its caption says what is in sight, and how long it stays. */
const SETTLE_MS = 400
const SHOWN_MS = 2500

/** A key named as scientific pitch writes it, sharps for the black keys: `C3`, `F#4`. */
const keyName = (key: Midi) => `${noteName(plainSpelling(pitchClass(key), true))}${octaveOf(key)}`

/** The keys wholly in sight in a scroller, lowest first, as it lays them out. */
function keysInSight(scroller: HTMLElement): Midi[] {
  const view = scroller.getBoundingClientRect()
  return [...scroller.querySelectorAll<HTMLElement>('[data-midi]')].flatMap((key) => {
    const box = key.getBoundingClientRect()
    return box.width > 0 && box.left >= view.left - 1 && box.right <= view.right + 1
      ? [midi(Number(key.dataset.midi))]
      : []
  })
}

/**
 * The rail's caption for a moment after the key size changes, as the reference app's live caption:
 * how many keys are in sight and which ("Showing 36 keys (C3–B5)"). None on first sight, nor where
 * nothing is laid out.
 */
export function useSizeCaption(
  scroller: RefObject<HTMLElement | null>,
  keySize: KeySize,
): RailCaption | undefined {
  const { t } = useTranslation('common')
  const [shown, setShown] = useState<{ readonly size: KeySize; readonly text: string } | null>(null)
  const [first, setFirst] = useState(keySize)
  useEffect(() => {
    if (keySize === first) return
    const settle = window.setTimeout(() => {
      const element = scroller.current
      const keys = element ? keysInSight(element).sort((a, b) => a - b) : []
      const low = keys[0]
      const high = keys.at(-1)
      if (low === undefined || high === undefined) return
      setShown({
        size: keySize,
        text: t('rail.showing', { count: keys.length, from: keyName(low), to: keyName(high) }),
      })
    }, SETTLE_MS)
    const hide = window.setTimeout(() => {
      setShown(null)
      setFirst(keySize)
    }, SETTLE_MS + SHOWN_MS)
    return () => {
      window.clearTimeout(settle)
      window.clearTimeout(hide)
    }
  }, [keySize, first, scroller, t])
  return shown && shown.size === keySize
    ? { label: t('rail.keysInSight'), text: shown.text }
    : undefined
}
