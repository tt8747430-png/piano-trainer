import { MicOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { selectTuner, useSettings } from '@/entities/settings'
import { openBrowserMicrophone, type OpenMicrophone } from '@/shared/api/audio'
import { cn } from '@/shared/lib'
import { centsOff, detectPitch, nearestNote } from '@/shared/lib/music'
import { Said } from '@/shared/ui'

/** Each key's name, sharps for the black keys, as a tuner reads them. */
const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'] as const

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

/** The gauge's ticks, every 5 cents from −50 to +50 over 120°, the 25s longer. */
const TICKS = Array.from({ length: 21 }, (_, place) => {
  const cents = -50 + place * 5
  const angle = (cents / 50) * 60 * (Math.PI / 180)
  const from = cents % 25 === 0 ? 110 : 120
  const at = (radius: number) =>
    `${(160 + Math.sin(angle) * radius).toFixed(1)} ${(170 - Math.cos(angle) * radius).toFixed(1)}`
  return `M${at(from)}L${at(134)}`
})

/**
 * The Tuner's face (canvas 180), the same in the Player's sheet and on its own page, as the board's
 * `NOTE` and `GAUGE`: the note heard large with its octave lowered, how far it is in words (In tune in
 * grass, else so many cents flat or sharp) and its frequency; under it the needle on an arc ±50 cents
 * with the in-tune band, read against the A4 the Tuner keeps. While nothing is heard the note is a
 * faint dash, the word Listening and the needle at rest, "Play or sing a note" under the arc; where the
 * microphone is refused or missing, the kit's empty state, No microphone with Try again, in its place.
 */
export function TunerReadout({
  listening,
  microphone = openBrowserMicrophone,
  large = false,
}: {
  listening: boolean
  /** Where its sound comes from: the browser's microphone, or a test's. */
  microphone?: OpenMicrophone
  /** On its own page: the note and gauge larger on a laptop. */
  large?: boolean
}) {
  const { t } = useTranslation('player')
  const { a4 } = useSettings(selectTuner)
  const [heard, setHeard] = useState<Heard>({ kind: 'listening' })
  // Each Try again asks for the microphone afresh.
  const [attempt, setAttempt] = useState(0)
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
  }, [listening, microphone, a4, attempt])
  const pitch = heard.kind === 'pitch' ? heard : null
  const cents = pitch ? Math.max(-50, Math.min(50, pitch.cents)) : 0
  const off = pitch ? Math.round(pitch.cents) : 0
  const tuned = pitch !== null && Math.abs(pitch.cents) <= IN_TUNE
  // At rest, a faint dash with no octave, as the board's quiet state.
  const name = pitch ? NAMES[((pitch.key % 12) + 12) % 12] : '–'
  const octave = pitch ? Math.floor(pitch.key / 12) - 1 : 4
  if (heard.kind === 'denied')
    return (
      <div role="alert" data-fill className="flex w-full flex-1 flex-col justify-center">
        <Said
          icon={MicOff}
          title={t('tuner.noMicrophone')}
          description={t('tuner.denied')}
          primary
          action={
            <button type="button" onClick={() => setAttempt((count) => count + 1)}>
              {t('tuner.retry')}
            </button>
          }
        />
      </div>
    )
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <output
          aria-live="polite"
          aria-label={t('tuner.note')}
          className={cn(
            'font-bold',
            pitch === null && 'text-border',
            large ? 'text-[6rem]/none lg:text-[10.5rem]/none' : 'text-[6rem]/none',
          )}
        >
          {name}
          {/* The browser's own subscript, lowered as the board's, not the reset's. */}
          <sub
            className={cn(
              'static align-sub text-[0.333em] leading-none font-semibold',
              !pitch && 'invisible',
            )}
          >
            {octave}
          </sub>
        </output>
        <p
          className={cn(
            'text-[1.125rem]/[normal] font-semibold',
            pitch === null ? 'text-muted-foreground' : tuned ? 'text-learned' : 'text-attention',
          )}
        >
          {pitch === null
            ? t('tuner.waiting')
            : tuned
              ? t('tuner.inTune')
              : off < 0
                ? t('tuner.flat', { count: -off })
                : t('tuner.sharp', { count: off })}
        </p>
        {/* Kept while nothing is heard, so the gauge never jumps when a note comes. */}
        <p
          className={cn(
            'text-[0.9375rem]/[normal] text-muted-foreground tabular-nums',
            !pitch && 'invisible',
          )}
        >
          {t('tuner.hz', { hz: pitch ? pitch.frequency.toFixed(1) : a4.toFixed(1) })}
        </p>
      </div>
      <svg
        role="meter"
        aria-label={t('tuner.cents')}
        aria-valuemin={-50}
        aria-valuemax={50}
        aria-valuenow={Math.round(cents)}
        viewBox="0 0 320 188"
        className={cn('block w-full', large ? 'max-w-[340px] lg:max-w-[720px]' : 'max-w-[340px]')}
      >
        <path
          d="M43.9 104A134 134 0 0 1 276.1 104"
          fill="none"
          className="stroke-muted"
          strokeWidth={22}
        />
        <path
          d="M149.5 36.4A134 134 0 0 1 170.5 36.4"
          fill="none"
          className="stroke-paint-full-grass"
          strokeWidth={22}
        />
        {TICKS.map((tick) => (
          <path key={tick} d={tick} className="stroke-muted-foreground" strokeWidth={1.6} />
        ))}
        <g
          className="transition-transform duration-100"
          style={{ transform: `rotate(${(cents / 50) * 60}deg)`, transformOrigin: '160px 170px' }}
        >
          <path
            d="M160 170L160 44"
            strokeWidth={4}
            strokeLinecap="round"
            className={
              pitch === null ? 'stroke-border' : tuned ? 'stroke-learned' : 'stroke-attention'
            }
          />
        </g>
        <circle cx={160} cy={170} r={8} className="fill-foreground" />
        <text x={36} y={178} fontSize={12} className="fill-muted-foreground">
          −50
        </text>
        <text x={266} y={178} fontSize={12} className="fill-muted-foreground">
          +50
        </text>
      </svg>
      {/* Kept while a note is heard, so nothing below the arc moves. */}
      <p className={cn('text-[0.9375rem]/[normal] text-muted-foreground', pitch && 'invisible')}>
        {t('tuner.listening')}
      </p>
    </div>
  )
}
