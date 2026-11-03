import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { selectProgressions, useSettings } from '@/entities/settings'
import { PinnedKeyboard } from '@/features/live-keyboard'
import {
  ChordRow,
  progressionRow,
  RowPlay,
  RowRoles,
  RowStaff,
  useShownKeys,
} from '@/features/play-example'
import { localText, useLocale, useScaleName } from '@/shared/i18n'
import { useScrollMotion } from '@/shared/lib'
import {
  chordSymbol,
  keyFromParam,
  keyParam,
  LEAD_INS,
  numeralChord,
  numeralGrows,
  numeralsLine,
  parseNumerals,
  printedSymbol,
  type Numeral,
} from '@/shared/lib/music'
import { ChordSizeField, KeyPicker, Labelled, NO_KEYS, Segmented } from '@/shared/ui'
import type { ProgressionNames } from '@/entities/settings'
import {
  changedView,
  chosenView,
  playedNumerals,
  playerSearch,
  rowPosition,
  viewProgression,
  type ProgressionsView,
} from '../model/progressions-view'
import { ProgressionBetween } from './ProgressionBetween'
import { ProgressionDiagrams } from './ProgressionDiagrams'
import { ProgressionField } from './ProgressionField'
import { ProgressionLibrary } from './ProgressionLibrary'
import { ProgressionPractice } from './ProgressionPractice'
import { ProgressionReading } from './ProgressionReading'
import { ProgressionSongs } from './ProgressionSongs'

/**
 * Progressions (ADR 0052, A23), its tab's content: the Progression (its chords on the staff, why
 * they work drawn on them, what it is and its key, chord size and approach chords, then practising it
 * in all 12 keys and the songs it is heard in); the Library, a list by style, a row opening it in
 * the Progression tab; or the Passing chords between two of its chords. How it is written and voiced
 * is Progressions' Settings (A24), read here.
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
  const scaleName = useScaleName()
  const settings = useSettings(selectProgressions)
  const [shown, setShown] = useShownKeys(
    `${view.tab} ${view.key} ${view.p} ${view.mode} ${view.size} ${settings.voicing} ${settings.inversion} ${view.lead}`,
    NO_KEYS,
  )
  const key = keyFromParam(view.key)
  const numerals = parseNumerals(view.p) ?? []
  const played = playedNumerals(view)
  const named = viewProgression(view)
  const change = (next: Partial<ProgressionsView>) => onChange(changedView(view, next))
  const names = settings.names
  const behavior = useScrollMotion()
  const keys = <PinnedKeyboard shown={shown} />
  if (view.tab === 'library')
    return (
      <div className="flex flex-col gap-6">
        <ProgressionLibrary
          musicKey={key}
          size={view.size}
          names={names}
          style={view.style}
          shown={named?.id}
          onStyle={(style) => onChange({ style })}
          onChoose={(progression) => {
            const { tab: _tab, ...rest } = chosenView(view, progression)
            onChange({ ...rest, tab: undefined })
            window.scrollTo({ top: 0, behavior })
          }}
        />
      </div>
    )
  if (view.tab === 'passing')
    return (
      <div className="flex flex-col gap-6">
        {keys}
        <ProgressionBetween
          chords={played.map((numeral) => numeralChord(numeral, key, view.size))}
          musicKey={key}
          at={view.between}
          inKey={view.inKey === true}
          onChange={onChange}
          onShow={setShown}
        />
      </div>
    )
  const row = progressionRow(played, key, view.size, { mode: view.mode, names })
  return (
    <div className="flex flex-col gap-6">
      {keys}
      <hgroup className="flex flex-col gap-1">
        <h2 className="text-3xl wrap-anywhere">
          {named ? localText(named.name, locale) : rowLine(row, names, numerals)}
        </h2>
        {named ? (
          <p className="text-lg text-muted-foreground">{localText(named.character, locale)}</p>
        ) : null}
        {view.mode ? (
          <p className="text-lg font-semibold">{printedSymbol(scaleName(key.tonic, view.mode))}</p>
        ) : null}
      </hgroup>
      <ChordRow chords={row} position={rowPosition(settings)} onShow={setShown}>
        <RowStaff />
        <RowRoles
          action={
            <Link
              to="/practice/quiz/$trainerId"
              params={{ trainerId: 'chord-role' }}
              className="font-semibold text-foreground underline underline-offset-4"
            >
              {t('music:harmony.legend.test')}
            </Link>
          }
        />
        <RowPlay variant="default" />
        <ProgressionDiagrams chords={row.map(({ chord }) => chord)} musicKey={key} />
        {named?.note ? (
          <p className="max-w-prose text-muted-foreground">{localText(named.note, locale)}</p>
        ) : null}
      </ChordRow>
      <div className="grid-fields gap-x-10 gap-y-5">
        <div className="col-span-full">
          <KeyPicker value={key} onChange={(next) => change({ key: keyParam(next) })} />
        </div>
        <ProgressionField
          progression={view.p}
          musicKey={key}
          inMode={view.mode !== undefined}
          onChange={(p, read) => change({ p, key: keyParam(read) })}
        />
        {/* A chord size changes only a line with a chord that grows (R30). */}
        {played.some(numeralGrows) ? (
          <Labelled label={t('music:chordSize.label')}>
            <ChordSizeField value={view.size} onChange={(size) => change({ size })} />
          </Labelled>
        ) : null}
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
        {named ? null : <ProgressionReading view={view} onChange={change} />}
      </div>
      <ProgressionPractice musicKey={key} inPlayer={playerSearch(view, settings)} />
      <ProgressionSongs line={view.p} minor={key.minor} modal={view.mode !== undefined} />
    </div>
  )
}

/** A typed line's name over the row: its numerals, its Nashville numbers or its chords, as the row names them. */
function rowLine(
  row: ReturnType<typeof progressionRow>,
  names: ProgressionNames,
  numerals: readonly Numeral[],
): string {
  if (names === 'numerals') return numeralsLine(numerals)
  return row.map(({ chord, caption }) => caption ?? printedSymbol(chordSymbol(chord))).join(' – ')
}
