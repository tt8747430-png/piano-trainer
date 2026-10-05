import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { libraryProgression } from '@/entities/progression-library'
import { ExplorerKeyboard } from '@/features/live-keyboard'
import { ChordRow, progressionRow, RowChords, RowPlay, useShownKeys } from '@/features/play-example'
import { localText, useLocale } from '@/shared/i18n'
import { keyFromParam, parseNumerals } from '@/shared/lib/music'
import { ButtonLink, ChordSizeField, KeyPicker, Labelled, NO_KEYS } from '@/shared/ui'
import type { ProgressionsView } from '../model/progressions-view'
import { ProgressionChoice } from './ProgressionChoice'
import { ProgressionField } from './ProgressionField'

/**
 * A progression in any key, read top to bottom: the keys, its row of chords that play with Play and
 * the ways into the Player, then what it is (the library's or typed, its key, its chord size).
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
  const inPlayer = {
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
        <div className="flex flex-wrap items-center gap-2">
          <RowPlay variant="default" />
          <ButtonLink
            size="pill"
            variant="soft"
            render={<Link to="/play/progression" search={inPlayer} />}
          >
            {t('learn:progressions.practise')}
          </ButtonLink>
          <ButtonLink
            size="pill"
            variant="soft"
            render={<Link to="/play/progression" search={{ ...inPlayer, walk: 'fifths' }} />}
          >
            {t('learn:progressions.throughKeys')}
          </ButtonLink>
        </div>
        {named?.note ? (
          <p className="max-w-prose text-muted-foreground">{localText(named.note, locale)}</p>
        ) : null}
      </ChordRow>
      <div className="grid-fields gap-x-10 gap-y-6">
        <div className="flex min-w-0 flex-col gap-3">
          <ProgressionChoice view={view} musicKey={key} onChange={onChange} />
          <ProgressionField progression={view.p} musicKey={key} onChange={(p) => onChange({ p })} />
        </div>
        <KeyPicker value={view.key} onChange={(next) => onChange({ key: next })} />
        <Labelled label={t('music:chordSize.label')}>
          <ChordSizeField value={view.size} onChange={(size) => onChange({ size })} />
        </Labelled>
      </div>
    </div>
  )
}
