import { Check } from 'lucide-react'
import { useEffect, useEffectEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DIAGRAM_KEYS, type DiagramChord } from '@/features/practice'
import { LiveKeyboard } from '@/features/live-keyboard'
import { useServices } from '@/shared/lib/services'
import { InfoTip } from '@/shared/ui'
import { holdsChord } from '../model/holds-chord'
import { useHandKeys } from '../model/use-hand-keys'

/**
 * Where a chord's sheet learns it (ADR 0100, 0111): how many times it was held so far, how many
 * learn it, and what a hold counted does.
 */
export interface ChordLearn {
  /** The holds counted so far: `needed` once it is learned. */
  readonly held: number
  readonly needed: number
  /** A hold counted: its keys held together, every key let go since the last. */
  readonly onHeld: () => void
}

/** A hold heard: the click on a bar's first beat, short and plain over the chord the hand holds. */
const HELD_SOUND = [{ kind: 'click', at: 0, accent: true }] as const

/**
 * A chord learned by holding it `needed` times (ADR 0111, Chordify's three): a line asking for it,
 * its ⓘ saying how, over the holds counted (a dot each, filled as it is counted, and "1 of 3"), then
 * the keys to play it on, the diagram's own, F3 to B4 (ADR 0101). Its keys held together, on a MIDI
 * keyboard or these keys with several fingers, count a hold, heard and seen; the next counts once
 * every key is let go and the chord held again, never by holding it longer.
 */
export function ChordLearning({
  chord,
  held,
  needed,
  onHeld,
}: { chord: DiagramChord } & ChordLearn) {
  const { t } = useTranslation('music')
  const { audio } = useServices()
  const keys = useHandKeys()
  const holding = holdsChord(keys, chord)
  // A hold counts as the chord is reached with the hand let go since the last; this visit's count
  // tells the effect a new one came.
  const [ready, setReady] = useState(true)
  const [counted, setCounted] = useState(0)
  if (holding && ready) {
    setReady(false)
    setCounted(counted + 1)
  } else if (!ready && keys.size === 0) setReady(true)
  const learned = held >= needed
  const count = useEffectEvent(() => {
    if (learned) return
    audio.play(HELD_SOUND)
    onHeld()
  })
  useEffect(() => {
    if (counted > 0) count()
  }, [counted])
  const line = t(learned ? 'chordSheet.learned' : 'chordSheet.learn')
  const shown = Math.min(held, needed)
  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <p className="flex min-h-7 items-center gap-2 text-lg font-semibold">
          {learned ? <Check aria-hidden className="size-5 text-learned" /> : null}
          {line}
          {learned ? null : (
            <InfoTip name={line}>{t('chordSheet.learnInfo', { count: needed })}</InfoTip>
          )}
        </p>
        <p aria-live="polite" className="flex items-center gap-2 text-sm text-muted-foreground">
          <span aria-hidden className="flex gap-1.5">
            {Array.from({ length: needed }, (_, i) => (
              <span
                key={i}
                className="grid size-3 place-items-center rounded-full ring-2 ring-learned ring-inset"
              >
                {/* Filled as it is counted, growing in. */}
                {i < shown ? (
                  <span className="size-3 rounded-full bg-learned animate-in duration-300 ease-out zoom-in-0 motion-reduce:animate-none" />
                ) : null}
              </span>
            ))}
          </span>
          <span className="tabular-nums">{t('chordSheet.held', { held: shown, needed })}</span>
        </p>
      </div>
      {/* The keys keep a finger's drag: the sheet does not swipe away under them. */}
      <div data-base-ui-swipe-ignore="" className="w-full">
        <LiveKeyboard range={DIAGRAM_KEYS} />
      </div>
    </>
  )
}
