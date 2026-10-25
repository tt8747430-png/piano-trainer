import { Check } from 'lucide-react'
import { useEffect, useEffectEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DiagramChord } from '@/features/practice'
import { LiveKeyboard } from '@/features/live-keyboard'
import { diagramRange } from '@/shared/lib'
import { holdsChord } from '../model/holds-chord'
import { useHandKeys } from '../model/use-hand-keys'

/** Where a chord's sheet learns it (ADR 0100): whether it is learned, and what learning it does. */
export interface ChordLearn {
  readonly learned: boolean
  readonly onLearned: () => void
}

/**
 * A chord learned by playing it (ADR 0100): a line asking for it over the keys to play it on, the
 * diagram's keys. Its keys held together, on a MIDI keyboard or these keys with several fingers,
 * learn it, once; the line then says so, as it does from the start once the chord is learned.
 */
export function ChordLearning({ chord, learned, onLearned }: { chord: DiagramChord } & ChordLearn) {
  const { t } = useTranslation('music')
  const holding = holdsChord(useHandKeys(), chord)
  // Played once, it stays played: letting the keys go takes nothing back.
  const [played, setPlayed] = useState(false)
  if (holding && !played) setPlayed(true)
  const learn = useEffectEvent(() => {
    if (!learned) onLearned()
  })
  useEffect(() => {
    if (played) learn()
  }, [played])
  const said = learned || played
  return (
    <>
      <p aria-live="polite" className="flex min-h-7 items-center gap-2 text-lg font-semibold">
        {said ? <Check aria-hidden className="size-5 text-learned" /> : null}
        {t(said ? 'chordSheet.learned' : 'chordSheet.learn')}
      </p>
      {/* The keys keep a finger's drag: the sheet does not swipe away under them. */}
      <div data-base-ui-swipe-ignore="" className="w-full">
        <LiveKeyboard range={diagramRange(chord.keys)} />
      </div>
    </>
  )
}
