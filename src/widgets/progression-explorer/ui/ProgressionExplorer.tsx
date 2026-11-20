import { Link } from '@tanstack/react-router'
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
  firstChordShown,
} from '@/features/play-example'
import { useScaleName } from '@/shared/i18n'
import {
  keyFromParam,
  keyParam,
  keysAround,
  numeralChord,
  numeralGrows,
  printedSymbol,
  LEAD_INS,
  CHORD_SIZES,
} from '@/shared/lib/music'
import { ActionMenu, GroupLink, GroupRows, KeyPicker } from '@/shared/ui'
import {
  changedView,
  playedNumerals,
  playerSearch,
  rowPosition,
  type ProgressionsView,
} from '../model/progressions-view'
import { ProgressionBetween } from './ProgressionBetween'
import { ProgressionField } from './ProgressionField'
import { ProgressionPractice } from './ProgressionPractice'
import { ProgressionReading } from './ProgressionReading'
import { ProgressionSongs } from './ProgressionSongs'

/**
 * A progression's page in the Chords page's shape (canvas 177): the keys at the top; its name in the
 * serif with its ♡ (`favourite`), how it sounds and its style (`about`), and Key; for a line typed or
 * kept (`typed`), its numerals and the mode they are read in; its chords as tiles by role with each
 * root's move, then the chords on the staff on the paper; practising it
 * through the keys in the Player, Passing chords, and the songs it is heard in with Open in the Chord
 * player. One floating bar: Loop and Play with what it plays (Chords, Approach chords); it is practised by
 * its Practise rows alone. On a
 * laptop the keys run across the top over the progression and, beside it, the rest. How it is written
 * and voiced is Progressions' Settings, read here.
 */
export function ProgressionExplorer({
  view,
  onChange,
  typed,
  name,
  favourite,
  about,
}: {
  view: ProgressionsView
  onChange: (view: ProgressionsView) => void
  /** A line the learner typed or keeps: its numerals and their mode are its choices. */
  typed: boolean
  name: string
  /** Its ♡, beside its name. */
  favourite?: ReactNode
  /** How it sounds and its style, under its name. */
  about?: string | undefined
}) {
  const { t } = useTranslation(['music', 'practice'])
  const scaleName = useScaleName()
  const settings = useSettings(selectProgressions)
  const key = keyFromParam(view.key)
  const played = playedNumerals(view)
  const change = (next: Partial<ProgressionsView>) => onChange(changedView(view, next))
  const row = progressionRow(played, key, view.size, { mode: view.mode, names: settings.names })
  // The row's first chord is chosen at rest, its keys shown (canvas 198); a new row starts again there.
  const context = `${view.key} ${view.p} ${view.mode} ${view.size} ${settings.voicing} ${settings.inversion} ${view.lead}`
  const [shown, setShown] = useShownKeys(context, firstChordShown(row, rowPosition(settings)))
  const lead = view.lead ?? 'none'
  return (
    <div className="flex flex-col gap-4 lg:gap-7">
      <PinnedKeyboard shown={shown} place="top" least={PROGRESSION_KEYS} />
      <div className="flex flex-col gap-4 lg:mx-auto lg:w-full lg:max-w-220 lg:gap-6">
        <div className="flex min-w-0 flex-col gap-4 lg:gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-0.5">
                <h2 className="font-display text-[2.25rem] leading-[1.1] font-bold tracking-[-0.01em] text-balance">
                  {name}
                </h2>
                {favourite}
              </div>
              {about ? (
                <p className="ms-0.5 text-[0.9375rem]/[normal] text-pretty text-muted-foreground">
                  {about}
                </p>
              ) : null}
            </div>
            {view.mode ? (
              <p className="text-lg font-semibold">
                {printedSymbol(scaleName(key.tonic, view.mode))}
              </p>
            ) : null}
            <KeyPicker
              value={key}
              onChange={(next) => change({ key: keyParam(next) })}
              className="self-start"
            />
          </div>
          {typed ? (
            <div className="grid-fields gap-x-10 gap-y-5">
              <ProgressionField
                progression={view.p}
                musicKey={key}
                inMode={view.mode !== undefined}
                onChange={(p, read) => change({ p, key: keyParam(read) })}
              />
              <ProgressionReading view={view} onChange={change} />
            </div>
          ) : null}
          <ChordRow
            key={context}
            chords={row}
            position={rowPosition(settings)}
            onShow={setShown}
            chooses
          >
            <RowRoles />
            {/* The chords on the staff at reading size, on the paper with no card round them
                (canvas, "A progression's chords on the staff at reading size"), the column's gap
                under the legend, as the board's (16, 20 on a laptop). */}
            <figure className="mt-1 flex flex-col items-center lg:mt-2">
              <RowStaff spans />
            </figure>
            <RowPlay
              variant="pieces"
              menuLabel={t('practice:progressions.plays')}
              menu={(trigger) => (
                <ActionMenu
                  label={t('practice:progressions.plays')}
                  align="end"
                  render={trigger}
                  trigger={null}
                  actions={[
                    // A chord size changes only a line with a chord that grows.
                    ...(played.some(numeralGrows)
                      ? CHORD_SIZES.map((size) => ({
                          key: size,
                          group: t('practice:progressions.chords'),
                          label: t(`music:chordSize.${size}`),
                          checked: view.size === size,
                          onSelect: () => change({ size }),
                        }))
                      : []),
                    ...(['none', ...LEAD_INS] as const).map((each) => ({
                      key: `lead-${each}`,
                      group: t('practice:progressions.lead.label'),
                      label: t(`practice:progressions.lead.${each}`),
                      checked: lead === each,
                      onSelect: () => change({ lead: each === 'none' ? undefined : each }),
                    })),
                  ]}
                />
              )}
            />
          </ChordRow>
        </div>
        <div className="flex min-w-0 flex-col gap-4 lg:gap-6">
          <ProgressionPractice musicKey={key} inPlayer={playerSearch(view, settings)} />
          <ProgressionBetween
            chords={played.map((numeral) => numeralChord(numeral, key, view.size))}
            musicKey={key}
            onShow={setShown}
          />
          <ProgressionSongs line={view.p} minor={key.minor} modal={view.mode !== undefined} />
          {/* The Chord player is not a song: its own card under the songs, with the way to a line of
              the learner's own from this one (the board's SONGS62). */}
          <GroupRows surface="sheet">
            <GroupLink
              label={t('practice:progressions.inChordPlayer')}
              render={<Link to="/practice/chord-player" search={{ p: view.p, key: view.key }} />}
            />
            {typed ? null : (
              <GroupLink
                label={t('practice:patterns.makeOwn')}
                render={
                  <Link to="/practice/progressions/line" search={{ p: view.p, key: view.key }} />
                }
              />
            )}
          </GroupRows>
        </div>
      </div>
    </div>
  )
}

/** The board's keys under the chords: C3 to C5 on a phone, C2 to C6 on a laptop. */
const PROGRESSION_KEYS = keysAround(48, [0, 24], [12, 36])
