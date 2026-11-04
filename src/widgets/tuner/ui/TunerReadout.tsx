import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectTuner, useSettings } from '@/entities/settings'
import { openBrowserMicrophone, type OpenMicrophone } from '@/shared/api/audio'
import { cn } from '@/shared/lib'
import { centsOff, detectPitch, nearestNote } from '@/shared/lib/music'

/** Each key's name, sharps for the black keys, as a tuner reads them. */
const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'] as const
const keyName = (key: number) => `${NAMES[((key % 12) + 12) % 12]}${Math.floor(key / 12) - 1}`

/** How often the tuner listens, in ms. */
const EVERY_MS = 100
/** A pitch within this many cents reads as in tune. */
const IN_TUNE = 5

type Heard =
  | { readonly kind: 'listening' }
  | { readonly kind: 'denied' }
  | {
      readonly kind: 'pitch'
      readonly frequency: number
      readonly key: number
      readonly cents: number
    }

/**
 * The Tuner's face (R29 B8, B11), the same in the Player's sheet and on its own page: the microphone
 * listened to while `listening`, the note heard, a needle ±50 cents from it, and its frequency, read
 * against the A4 saved on the Tuner's Settings page. Says so where the microphone is refused or
 * missing.
 */
export function TunerReadout({
  listening,
  microphone = openBrowserMicrophone,
  large = false,
}: {
  listening: boolean
  /** Where its sound comes from: the browser's microphone, or a test's. */
  microphone?: OpenMicrophone
  /** On its own page: the note and needle larger. */
  large?: boolean
}) {
  const { t } = useTranslation('player')
  const { a4 } = useSettings(selectTuner)
  const [heard, setHeard] = useState<Heard>({ kind: 'listening' })
  useEffect(() => {
    if (!listening) return
    let closed = false
    let release = () => {}
    let timer: ReturnType<typeof setInterval> | undefined
    microphone().then(
      (mic) => {
        if (closed) return mic.close()
        release = () => mic.close()
        const buffer = new Float32Array(4096)
        timer = setInterval(() => {
          mic.read(buffer)
          const frequency = detectPitch(buffer, mic.sampleRate)
          if (frequency === null) return
          const key = nearestNote(frequency, a4)
          setHeard({ kind: 'pitch', frequency, key, cents: centsOff(frequency, key, a4) })
        }, EVERY_MS)
      },
      () => {
        if (!closed) setHeard({ kind: 'denied' })
      },
    )
    return () => {
      closed = true
      clearInterval(timer)
      release()
      setHeard({ kind: 'listening' })
    }
  }, [listening, microphone, a4])
  if (heard.kind === 'denied')
    return (
      <p role="alert" className="text-center text-muted-foreground">
        {t('tuner.denied')}
      </p>
    )
  const cents = heard.kind === 'pitch' ? Math.max(-50, Math.min(50, heard.cents)) : 0
  const tuned = heard.kind === 'pitch' && Math.abs(heard.cents) <= IN_TUNE
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <output
        aria-live="polite"
        aria-label={t('tuner.note')}
        className={cn(
          'font-heading font-semibold tabular-nums',
          large ? 'text-8xl' : 'text-6xl',
          tuned && 'text-paint-full-grass',
        )}
      >
        {heard.kind === 'pitch' ? keyName(heard.key) : '–'}
      </output>
      {/* The needle: from −50 cents at the left to +50 at the right, centred in tune. */}
      <div
        role="meter"
        aria-label={t('tuner.cents')}
        aria-valuemin={-50}
        aria-valuemax={50}
        aria-valuenow={Math.round(cents)}
        className={cn(
          'relative w-full rounded-control bg-muted',
          large ? 'h-14 max-w-md' : 'h-10 max-w-80',
        )}
      >
        <span aria-hidden className="absolute inset-y-1 left-1/2 w-px bg-foreground/40" />
        <span
          aria-hidden
          className={cn(
            'absolute inset-y-0 w-1 -translate-x-1/2 rounded-pill transition-[left] duration-100',
            tuned ? 'bg-paint-full-grass' : 'bg-primary',
          )}
          style={{ left: `${50 + cents}%` }}
        />
      </div>
      <p className="text-sm text-muted-foreground tabular-nums">
        {heard.kind === 'pitch'
          ? t('tuner.reading', {
              hz: heard.frequency.toFixed(1),
              cents: `${heard.cents >= 0 ? '+' : '−'}${Math.abs(Math.round(heard.cents))}`,
            })
          : t('tuner.listening')}
      </p>
      <p className="text-sm text-muted-foreground">{t('tuner.reference', { hz: a4 })}</p>
    </div>
  )
}
