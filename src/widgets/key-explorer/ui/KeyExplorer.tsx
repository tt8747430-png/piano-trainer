import { Link } from '@tanstack/react-router'
import { ChartNoAxesColumnIncreasing, KeyboardMusic } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { PractiseChords } from '@/features/practice'
import { useScaleName } from '@/shared/i18n'
import {
  keyFromParam,
  noteName,
  noteParam,
  placeBorrowedChords,
  placeScale,
  placeScaleChords,
  rangeOf,
  walkChords,
  type ScaleKind,
} from '@/shared/lib/music'
import { RowGroup, RowLink } from '@/shared/ui'
import { keyMarks } from '../model/key-marks'
import type { KeyView } from '../model/key-view'
import { CircleOfFifths } from './CircleOfFifths'
import { KeyChordsSection } from './KeyChordsSection'
import { KeyFacts } from './KeyFacts'
import { KeySignature } from './KeySignature'

/**
 * A key's page, with the circle of fifths to choose it: its signature on a staff, notes, relative and
 * modes; its chords and the ones it borrows, to tap and to walk; practised in the Player; and in Scales.
 */
export function KeyExplorer({
  view,
  onChange,
}: {
  view: KeyView
  onChange: (change: Partial<KeyView>) => void
}) {
  const { t } = useTranslation('learn')
  const scaleName = useScaleName()
  const key = keyFromParam(view.key)
  const kind: ScaleKind = key.minor ? 'natural' : 'major'
  const chords = useMemo(() => {
    const shown = keyFromParam(view.key)
    return placeScaleChords(
      shown.tonic,
      shown.minor ? 'natural' : 'major',
      view.chords,
      view.inversion,
    )
  }, [view.key, view.chords, view.inversion])
  const borrowed = useMemo(
    () => placeBorrowedChords(keyFromParam(view.key), view.chords, view.inversion),
    [view.key, view.chords, view.inversion],
  )
  const walk = useMemo(() => walkChords(chords), [chords])
  const placed = placeScale(key.tonic, kind)
  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
      <CircleOfFifths current={key} />
      <div className="flex flex-col gap-4">
        <h2 className="text-5xl">
          {t(key.minor ? 'keys.minor' : 'keys.major', { tonic: noteName(key.tonic) })}
        </h2>
        <KeySignature value={key} />
        <KeyFacts value={key} />
      </div>
      <ExplorerKeyboard
        keys={placed.map((tone) => tone.midi)}
        range={rangeOf(
          [...walk, ...borrowed].flatMap((chord) => chord.tones.map((tone) => tone.midi)),
        )}
        marks={keyMarks(placed)}
        className="lg:col-span-2"
      />
      <KeyChordsSection
        view={view}
        chords={chords}
        borrowed={borrowed}
        walk={walk}
        onChange={onChange}
      />
      <div className="flex flex-col gap-6">
        <PractiseChords root={key.tonic} kind={kind} notes={view.chords} />
        <RowGroup title={t('keys.inScales')}>
          <li>
            <RowLink
              title={scaleName(key.tonic, kind)}
              icon={ChartNoAxesColumnIncreasing}
              paint="sky"
              render={<Link to="/learn/scales" search={{ root: noteParam(key.tonic), kind }} />}
            />
          </li>
          <li>
            <RowLink
              title={t('keys.chordsTo13ths')}
              icon={KeyboardMusic}
              paint="sand"
              render={
                <Link
                  to="/learn/scales"
                  search={{ root: noteParam(key.tonic), kind, show: 'chords' }}
                />
              }
            />
          </li>
        </RowGroup>
      </div>
    </div>
  )
}
