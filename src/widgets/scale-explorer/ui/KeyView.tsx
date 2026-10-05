import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { chordsRange, ScaleChordGrid, scaleShown } from '@/features/play-example'
import {
  fitInversion,
  noteFromParam,
  placeBorrowedChords,
  placeScale,
  placeScaleChords,
  walkChords,
  type Key,
} from '@/shared/lib/music'
import type { ScaleView } from '../model/scale-view'
import { CircleOfFifths } from './CircleOfFifths'
import { KeyFacts } from './KeyFacts'
import { KeySignature } from './KeySignature'
import { ScaleLayout } from './ScaleLayout'

/**
 * Key view: the scale's key on the circle of fifths, which chooses another, beside its signature on a
 * staff, its notes, relative and modes; and the chords it borrows, to tap, in the size and inversion
 * the Chords view was left in (triads or 7ths).
 */
export function KeyView({
  scale,
  name,
  musicKey,
  choice,
}: {
  scale: ScaleView
  name: string
  /** The scale's key (`keyOfScale`): the Key view is offered only to a scale that has one. */
  musicKey: Key
  choice: ReactNode
}) {
  const { t } = useTranslation('learn')
  const { root, kind } = scale
  const notes = scale.chords === 3 ? 3 : 4
  const inversion = fitInversion(scale.inversion, notes)
  const borrowed = useMemo(
    () => placeBorrowedChords(musicKey, notes, inversion),
    [musicKey, notes, inversion],
  )
  const tonic = noteFromParam(root)
  const range = useMemo(
    () =>
      chordsRange([...walkChords(placeScaleChords(tonic, kind, notes, inversion)), ...borrowed]),
    [tonic, kind, notes, inversion, borrowed],
  )
  return (
    <ScaleLayout
      keyboard={<ExplorerKeyboard shown={scaleShown(placeScale(tonic, kind))} range={range} />}
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
        <h3 className="text-2xl">{t('keys.borrowed')}</h3>
        <ScaleChordGrid chords={borrowed} />
      </section>
    </ScaleLayout>
  )
}
