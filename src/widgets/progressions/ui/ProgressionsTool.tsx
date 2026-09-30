import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import {
  NO_KEYS,
  ProgressionChords,
  ProgressionPlay,
  ProgressionRow,
  type ShownKeys,
} from '@/features/play-example'
import { keyFromParam, CHORD_SIZES, parseNumerals, type ChordSize } from '@/shared/lib/music'
import { ButtonLink, KeyDropdown, Segmented } from '@/shared/ui'
import type { ProgressionsView } from '../model/progressions-view'
import { ProgressionField } from './ProgressionField'
import { ProgressionLibrary } from './ProgressionLibrary'

/**
 * Progressions: numerals or chords in any key and chord size, written as a row of chords that play,
 * with the library by style beside it.
 */
export function ProgressionsTool({
  view,
  onChange,
}: {
  view: ProgressionsView
  onChange: (change: Partial<ProgressionsView>) => void
}) {
  const { t } = useTranslation('learn')
  const [shown, setShown] = useState<ShownKeys>(NO_KEYS)
  const key = keyFromParam(view.key)
  const numerals = parseNumerals(view.p) ?? []
  return (
    <div className="flex flex-col gap-6">
      <ExplorerKeyboard keys={shown.keys} marks={shown.marks} />
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <KeyDropdown value={view.key} onChange={(next) => onChange({ key: next })} />
            <Segmented<ChordSize>
              label={t('chordSize.label')}
              value={view.size}
              options={CHORD_SIZES.map((size) => ({
                value: size,
                label: t(`chordSize.${size}`),
              }))}
              onChange={(size) => onChange({ size })}
            />
          </div>
          <ProgressionField progression={view.p} musicKey={key} onChange={(p) => onChange({ p })} />
          <ProgressionRow numerals={numerals} musicKey={key} size={view.size} onShow={setShown}>
            <ProgressionChords />
            <ProgressionPlay variant="default" />
          </ProgressionRow>
          <ButtonLink
            size="pill"
            variant="soft"
            className="self-start"
            render={
              <Link
                to="/play/progression"
                search={{
                  p: view.p,
                  key: view.key,
                  ...(view.size === 'triads' ? {} : { chordSize: view.size }),
                }}
              />
            }
          >
            {t('progressions.practise')}
          </ButtonLink>
        </div>
        <ProgressionLibrary musicKey={key} size={view.size} />
      </div>
    </div>
  )
}
