import { Link } from '@tanstack/react-router'
import { Play } from 'lucide-react'
import type { ReactNode } from 'react'
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
import { useScaleName } from '@/shared/i18n'
import {
  keyFromParam,
  keyParam,
  numeralChord,
  numeralGrows,
  printedSymbol,
  LEAD_INS,
} from '@/shared/lib/music'
import { ChordSizeField, KeyPicker, Labelled, NO_KEYS, RowLink, Segmented } from '@/shared/ui'
import {
  changedView,
  playedNumerals,
  playerSearch,
  rowPosition,
  type ProgressionsView,
} from '../model/progressions-view'
import { ProgressionBetween } from './ProgressionBetween'
import { ProgressionDiagrams } from './ProgressionDiagrams'
import { ProgressionField } from './ProgressionField'
import { ProgressionPractice } from './ProgressionPractice'
import { ProgressionReading } from './ProgressionReading'
import { ProgressionSongs } from './ProgressionSongs'

/**
 * A progression's page under its bar (ADR 0052, A23, R30-4): the keys pinned; `about` (what it is);
 * its choices, the key, the chord size where a chord grows, what leads into each chord and, for a
 * line typed or kept (`typed`), the numerals and the mode they are read in; its chords on the staff,
 * why they work drawn on them, as the Player's diagrams; Play it in the Chord player; practising it
 * through the keys in the Player; then, beside them on a laptop, Passing chords between two of its
 * chords and the songs it is heard in. Its floating bar loops it, practises it in the Player in this
 * key and plays it, the honey one. How it is written and voiced is
 * Progressions' Settings (A24), read here.
 */
export function ProgressionExplorer({
  view,
  onChange,
  typed,
  about,
  note,
}: {
  view: ProgressionsView
  onChange: (view: ProgressionsView) => void
  /** A line the learner typed or keeps: its numerals and their mode are its choices. */
  typed: boolean
  /** What it is, under the bar: how it sounds and its style. */
  about?: ReactNode
  /** What it teaches, in a line, under its chords. */
  note?: string | undefined
}) {
  const { t } = useTranslation(['music', 'practice'])
  const scaleName = useScaleName()
  const settings = useSettings(selectProgressions)
  const [shown, setShown] = useShownKeys(
    `${view.key} ${view.p} ${view.mode} ${view.size} ${settings.voicing} ${settings.inversion} ${view.lead}`,
    NO_KEYS,
  )
  const key = keyFromParam(view.key)
  const played = playedNumerals(view)
  const change = (next: Partial<ProgressionsView>) => onChange(changedView(view, next))
  const row = progressionRow(played, key, view.size, { mode: view.mode, names: settings.names })
  return (
    <div className="flex flex-col gap-6">
      <PinnedKeyboard shown={shown} />
      <div className="grid items-start gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          {about}
          {view.mode ? (
            <p className="text-lg font-semibold">
              {printedSymbol(scaleName(key.tonic, view.mode))}
            </p>
          ) : null}
          <div className="grid-fields gap-x-10 gap-y-5">
            <div className="col-span-full">
              <KeyPicker value={key} onChange={(next) => change({ key: keyParam(next) })} />
            </div>
            {typed ? (
              <ProgressionField
                progression={view.p}
                musicKey={key}
                inMode={view.mode !== undefined}
                onChange={(p, read) => change({ p, key: keyParam(read) })}
              />
            ) : null}
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
            {typed ? <ProgressionReading view={view} onChange={change} /> : null}
          </div>
          <ChordRow chords={row} position={rowPosition(settings)} onShow={setShown}>
            <RowRoles />
            <ProgressionDiagrams chords={row.map(({ chord }) => chord)} musicKey={key} />
            <RowStaff />
            <RowPlay
              variant="default"
              practise={{
                label: t('practice:progressions.practise'),
                render: <Link to="/play/progression" search={playerSearch(view, settings)} />,
              }}
            />
            {note ? <p className="max-w-prose text-muted-foreground">{note}</p> : null}
          </ChordRow>
          {/* The Chord player plays the same chords in a style (R29 CP1): each page opens the other. */}
          <div className="card">
            <RowLink
              title={t('practice:progressions.inChordPlayer')}
              detail={t('practice:progressions.inChordPlayerLine')}
              icon={Play}
              paint="lilac"
              render={<Link to="/practice/chord-player" search={{ p: view.p, key: view.key }} />}
            />
          </div>
          <ProgressionPractice musicKey={key} inPlayer={playerSearch(view, settings)} />
        </div>
        <div className="flex min-w-0 flex-col gap-8">
          <ProgressionBetween
            chords={played.map((numeral) => numeralChord(numeral, key, view.size))}
            musicKey={key}
            at={view.between}
            inKey={view.inKey === true}
            onChange={(next) => onChange({ ...view, ...next })}
            onShow={setShown}
          />
          <ProgressionSongs line={view.p} minor={key.minor} modal={view.mode !== undefined} />
        </div>
      </div>
    </div>
  )
}
