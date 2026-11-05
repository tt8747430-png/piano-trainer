import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { selectKeyboard, useSettings } from '@/entities/settings'
import type { PedalKind } from '@/shared/lib/schedule'
import { usePedal, useServices } from '@/shared/lib/services'
import { Pedal, PedalLyre } from '@/shared/ui'

/** A press shorter than this is a tap: it locks the sustain down (or lifts it, locked). */
const TAP_MS = 300

/**
 * One pedal of the live keyboard (R31-P, R32): drawn down whenever it is down, whoever holds it (the
 * music playing, `music`; a MIDI foot, Space, or this). Held, it holds; the sustain also latches on a
 * tap, a honey dot on it, and lifts on the next. Whatever this pedal holds lets up as the page hides or the keys go:
 * no screen keeps a pedal it cannot lift.
 */
function KeyPedal({ pedal, music = false }: { pedal: PedalKind; music?: boolean }) {
  const { t } = useTranslation('common')
  const { audio } = useServices()
  const down = usePedal(pedal) || music
  const held = useRef(false)
  // Set while a press has lasted past a tap: its lift lets the pedal up.
  const long = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [locked, setLocked] = useState(false)
  const lockedNow = useRef(false)
  const set = (on: boolean) => {
    if (held.current === on) return
    held.current = on
    audio.pedal(pedal, on)
  }
  useEffect(() => {
    const lift = () => {
      if (held.current) audio.pedal(pedal, false)
      held.current = false
      lockedNow.current = false
      setLocked(false)
    }
    const onHide = () => {
      if (document.visibilityState === 'hidden') lift()
    }
    document.addEventListener('visibilitychange', onHide)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      clearTimeout(timer.current)
      lift()
    }
  }, [audio, pedal])
  const lock = (on: boolean) => {
    lockedNow.current = on
    setLocked(on)
    set(on)
  }
  const locks = pedal === 'sustain'
  return (
    <Pedal
      label={t(`pedals.${pedal}.label`)}
      name={t(`pedals.${pedal}.name`)}
      down={down}
      latched={locked}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        long.current = false
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
          long.current = true
        }, TAP_MS)
        if (!lockedNow.current) set(true)
      }}
      onPointerUp={() => {
        clearTimeout(timer.current)
        if (lockedNow.current) lock(false)
        else if (!long.current && locks) lock(true)
        else set(false)
      }}
      onKeyDown={(event: KeyboardEvent) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        if (locks) lock(!lockedNow.current)
      }}
    />
  )
}

/**
 * The pedals the learner shows (On-screen piano › Pedals), on their lyre centred beneath the keys as
 * on an upright or a grand (R32): the sustain alone, or soft, sostenuto and sustain, left to right.
 * `sustained`: the music playing holds the sustain down (its score's pedal at the cursor), drawn
 * down with it.
 */
export function KeyPedals({ sustained = false }: { sustained?: boolean }) {
  const { pedals } = useSettings(selectKeyboard)
  return (
    <PedalLyre>
      {pedals === 'all' ? (
        <>
          <KeyPedal pedal="soft" />
          <KeyPedal pedal="sostenuto" />
        </>
      ) : null}
      <KeyPedal pedal="sustain" music={sustained} />
    </PedalLyre>
  )
}
