import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { chordsRange, scaleShown } from '@/features/play-example'
import { PractiseChords } from '@/features/practice'
import { useKeyName, useScaleName } from '@/shared/i18n'
import {
  keyFromParam,
  keyScale,
  noteParam,
  placeBorrowedChords,
  placeScale,
  placeScaleChords,
  walkChords,
} from '@/shared/lib/music'
import { LEARN_TILES, RowGroup, RowLink } from '@/shared/ui'
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
  const keyName = useKeyName()
  // Read once per key: the signature engraves again whenever the key it is handed is new.
  const key = useMemo(() => keyFromParam(view.key), [view.key])
  const kind = keyScale(key)
  const chords = useMemo(
    () => placeScaleChords(key.tonic, keyScale(key), view.chords, view.inversion),
    [key, view.chords, view.inversion],
  )
  const borrowed = useMemo(
    () => placeBorrowedChords(key, view.chords, view.inversion),
    [key, view.chords, view.inversion],
  )
  const walk = useMemo(() => walkChords(chords), [chords])
  const scale = scaleShown(placeScale(key.tonic, kind))
  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
      <CircleOfFifths current={key} />
      <div className="flex flex-col gap-4">
        <h2 className="text-5xl">{keyName(key)}</h2>
        <KeySignature value={key} />
        <KeyFacts value={key} />
      </div>
      <ExplorerKeyboard
        shown={scale}
        range={chordsRange([...walk, ...borrowed])}
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
              {...LEARN_TILES.scales}
              render={<Link to="/learn/scales" search={{ root: noteParam(key.tonic), kind }} />}
            />
          </li>
          <li>
            <RowLink
              title={t('keys.chordsTo13ths')}
              {...LEARN_TILES.chords}
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
