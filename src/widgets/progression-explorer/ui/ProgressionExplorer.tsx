import { useTranslation } from 'react-i18next'
import { PinnedKeyboard } from '@/features/live-keyboard'
import {
  ChordRow,
  progressionRow,
  RowChords,
  RowStaff,
  RowPlay,
  useShownKeys,
} from '@/features/play-example'
import { localText, useLocale } from '@/shared/i18n'
import { keyFromParam, LEAD_INS, numeralGrows, parseNumerals } from '@/shared/lib/music'
import { ChordSizeField, KeyChoice, Labelled, NO_KEYS, PositionField, Segmented } from '@/shared/ui'
import {
  changedView,
  chosenView,
  playedNumerals,
  playerSearch,
  viewProgression,
  type ProgressionsView,
} from '../model/progressions-view'
import { ProgressionChoice } from './ProgressionChoice'
import { ProgressionField } from './ProgressionField'
import { ProgressionPractice } from './ProgressionPractice'
import { ProgressionTools } from './ProgressionTools'

/**
 * A progression in any key, read top to bottom: the keys, its row of chords that play with Play, what
 * it is (the library's or typed, its key, its chord size, what leads into each chord), then its ways
 * into the Player and its tools.
 */
export function ProgressionExplorer({
  view,
  onChange,
}: {
  view: ProgressionsView
  onChange: (change: Partial<ProgressionsView>) => void
}) {
  const { t } = useTranslation(['music', 'practice'])
  const locale = useLocale()
  const [shown, setShown] = useShownKeys(
    `${view.key} ${view.p} ${view.size} ${view.inversion} ${view.nearest} ${view.lead}`,
    NO_KEYS,
  )
  const key = keyFromParam(view.key)
  const numerals = parseNumerals(view.p) ?? []
  const played = playedNumerals(view)
  const named = viewProgression(view)
  const change = (next: Partial<ProgressionsView>) => onChange(changedView(view, next))
  return (
    <div className="flex flex-col gap-6">
      <PinnedKeyboard shown={shown} />
      <ChordRow
        chords={progressionRow(played, key, view.size)}
        position={{ inversion: view.inversion, nearest: view.nearest }}
        onShow={setShown}
      >
        <RowChords positions />
        <RowStaff />
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
            minor={key.minor}
            onChoose={(progression) => onChange(chosenView(view, progression))}
          />
          <ProgressionField progression={view.p} musicKey={key} onChange={(p) => change({ p })} />
        </div>
        <KeyChoice value={view.key} onChange={(next) => change({ key: next })} />
        <Labelled label={t('music:chordSize.label')}>
          <ChordSizeField
            value={view.size}
            disabled={!played.some(numeralGrows)}
            onChange={(size) => change({ size })}
          />
        </Labelled>
        <Labelled label={t('practice:progressions.lead.label')}>
          <Segmented
            label={t('practice:progressions.lead.label')}
            value={view.lead ?? 'none'}
            options={(['none', ...LEAD_INS] as const).map((lead) => ({
              value: lead,
              label: t(`practice:progressions.lead.${lead}`),
            }))}
            onChange={(lead) => change({ lead: lead === 'none' ? undefined : lead })}
          />
        </Labelled>
        <PositionField notes={view.size === 'triads' ? 3 : 4} position={view} onChange={change} />
      </div>
      <ProgressionPractice musicKey={key} inPlayer={playerSearch(view)} />
      <ProgressionTools view={view} />
    </div>
  )
}
