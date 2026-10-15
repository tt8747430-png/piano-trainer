import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { chordsRange, ScaleChordGrid, scaleShown, useShownKeys } from '@/features/play-example'
import {
  fitInversion,
  keyScale,
  placeBorrowedChords,
  placeScale,
  placeScaleChords,
  walkChords,
  type Key,
} from '@/shared/lib/music'
import type { ScaleView } from '../model/scale-view'
import { CircleOfFifths } from './CircleOfFifths'
import { KeyFacts } from './KeyFacts'
import { keyThird } from '../model/holding-keys'
import { KeyHarmonise } from './KeyHarmonise'
import { KeySignature } from './KeySignature'
import { ScaleLayout } from './ScaleLayout'

/**
 * Key view: the scale's key, named and marked on the keys as its signature writes it, on the circle of
 * fifths, which chooses another, beside its signature on a staff, its notes, relative and modes; the
 * chords it borrows, to tap, in the size and inversion the Chords view was left in (triads or 7ths);
 * and a melody note harmonised in it (ADR 0052).
 */
export function KeyView({
  scale,
  name,
  musicKey,
  choice,
  onChange,
}: {
  scale: ScaleView
  name: string
  /** The scale's key (`keyOfScale`): the Key view is offered only to a scale that has one. */
  musicKey: Key
  choice: ReactNode
  onChange: (change: Partial<ScaleView>) => void
}) {
  const { t } = useTranslation('practice')
  // The key's own scale: the notes its signature writes (a minor key's natural minor).
  const { tonic } = musicKey
  const kind = keyScale(musicKey)
  const notes = scale.chords === 3 ? 3 : 4
  const inversion = fitInversion(scale.inversion, notes)
  const borrowed = useMemo(
    () => placeBorrowedChords(musicKey, notes, inversion),
    [musicKey, notes, inversion],
  )
  const range = useMemo(
    () =>
      chordsRange([...walkChords(placeScaleChords(tonic, kind, notes, inversion)), ...borrowed]),
    [tonic, kind, notes, inversion, borrowed],
  )
  const [shown, setShown] = useShownKeys(
    `${scale.root} ${scale.kind} ${scale.melody} ${scale.onlyInKey}`,
    scaleShown(placeScale(tonic, kind)),
  )
  return (
    <ScaleLayout
      keyboard={<PinnedKeyboard shown={shown} range={range} />}
      name={name}
      fields={choice}
    >
      <div className="grid-fields items-start gap-x-10 gap-y-6">
        <CircleOfFifths current={musicKey} />
        <div className="flex min-w-0 flex-col gap-6">
          <KeySignature value={musicKey} />
          <KeyFacts value={musicKey} />
        </div>
      </div>
      <section className="flex flex-col gap-3">
        <h3 className="text-2xl">{t('scales.key.borrowed')}</h3>
        <ScaleChordGrid chords={borrowed} />
      </section>
      <KeyHarmonise
        musicKey={musicKey}
        melody={scale.melody ?? keyThird(musicKey)}
        onlyInKey={scale.onlyInKey === true}
        onChange={onChange}
        onShow={setShown}
      />
    </ScaleLayout>
  )
}
