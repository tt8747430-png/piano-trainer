import { useTranslation } from 'react-i18next'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { ChordRow, progressionRow, RowChords, RowPlay, useShownKeys } from '@/features/play-example'
import { localText, useLocale } from '@/shared/i18n'
import { keyFromParam, numeralGrows, parseNumerals } from '@/shared/lib/music'
import { ChordSizeField, KeyChoice, Labelled, NO_KEYS } from '@/shared/ui'
import {
  changedView,
  chosenView,
  playerSearch,
  viewProgression,
  type ProgressionsView,
} from '../model/progressions-view'
import { ProgressionChoice } from './ProgressionChoice'
import { ProgressionField } from './ProgressionField'
import { ProgressionPractice } from './ProgressionPractice'

/**
 * A progression in any key, read top to bottom: the keys, its row of chords that play with Play, what
 * it is (the library's or typed, its key, its chord size), then its ways into the Player.
 */
export function ProgressionsTool({
  view,
  onChange,
}: {
  view: ProgressionsView
  onChange: (change: Partial<ProgressionsView>) => void
}) {
  const { t } = useTranslation(['learn', 'music'])
  const locale = useLocale()
  const [shown, setShown] = useShownKeys(`${view.key} ${view.p} ${view.size}`, NO_KEYS)
  const key = keyFromParam(view.key)
  const numerals = parseNumerals(view.p) ?? []
  const named = viewProgression(view)
  const change = (next: Partial<ProgressionsView>) => onChange(changedView(view, next))
  return (
    <div className="flex flex-col gap-6">
      <ExplorerKeyboard shown={shown} />
      <ChordRow chords={progressionRow(numerals, key, view.size)} onShow={setShown}>
        <RowChords />
        <RowPlay variant="default" />
        {named?.note ? (
          <p className="max-w-prose text-muted-foreground">{localText(named.note, locale)}</p>
        ) : null}
      </ChordRow>
      <div className="grid-fields gap-x-10 gap-y-5">
        <div className="flex min-w-0 flex-col gap-3">
          <ProgressionChoice
            named={named}
            numerals={numerals}
            onChoose={(progression) => onChange(chosenView(view, progression))}
          />
          <ProgressionField progression={view.p} musicKey={key} onChange={(p) => change({ p })} />
        </div>
        <KeyChoice value={view.key} onChange={(next) => change({ key: next })} />
        <Labelled label={t('music:chordSize.label')}>
          <ChordSizeField
            value={view.size}
            disabled={!numerals.some(numeralGrows)}
            onChange={(size) => change({ size })}
          />
        </Labelled>
      </div>
      <ProgressionPractice musicKey={key} inPlayer={playerSearch(view)} />
    </div>
  )
}
