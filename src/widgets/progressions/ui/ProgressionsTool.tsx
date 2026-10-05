import { useTranslation } from 'react-i18next'
import { libraryProgression } from '@/entities/progression-library'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { ChordRow, progressionRow, RowChords, RowPlay, useShownKeys } from '@/features/play-example'
import { localText, useLocale } from '@/shared/i18n'
import { keyFromParam, parseNumerals } from '@/shared/lib/music'
import { ChordSizeField, KeyChoice, Labelled, NO_KEYS } from '@/shared/ui'
import type { ProgressionsView } from '../model/progressions-view'
import { ProgressionChoice } from './ProgressionChoice'
import { ProgressionField } from './ProgressionField'
import { ProgressionPractice, type InPlayer } from './ProgressionPractice'

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
  const named = libraryProgression(view.p, key.minor)
  // The Player opens on what is shown, with the pattern the library's progression is practised in.
  const inPlayer: InPlayer = {
    p: view.p,
    key: view.key,
    ...(view.size === 'triads' ? {} : { chordSize: view.size }),
    ...(named?.pattern ? { pattern: named.pattern } : {}),
  }
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
          <ProgressionChoice view={view} musicKey={key} onChange={onChange} />
          <ProgressionField progression={view.p} musicKey={key} onChange={(p) => onChange({ p })} />
        </div>
        <KeyChoice value={view.key} onChange={(next) => onChange({ key: next })} />
        <Labelled label={t('music:chordSize.label')}>
          <ChordSizeField value={view.size} onChange={(size) => onChange({ size })} />
        </Labelled>
      </div>
      <ProgressionPractice musicKey={key} inPlayer={inPlayer} />
    </div>
  )
}
