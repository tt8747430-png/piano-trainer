import { ListMusic } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { selectIntervals, useSettings } from '@/entities/settings'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { intervalExample, writesInterval } from '@/features/play-example'
import {
  INTERVAL_GROUP_IDS,
  noteFromParam,
  noteParam,
  pitchClassOf,
  printedNote,
  type IntervalGroup,
} from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { usePlayback } from '@/shared/lib/services'
import {
  ActionMenu,
  FloatingActions,
  FloatingPiece,
  FloatingPieces,
  FloatingPlaySplit,
  PitchPicker,
  Segmented,
  usePlayKey,
  usualName,
} from '@/shared/ui'
import {
  INTERVAL_ROWS,
  ROW_INTERVALS,
  everyInterval,
  groupOf,
  oneInterval,
  type RowInterval,
} from '../model/interval-rows'
import { intervalMusic } from '../model/interval-music'
import { INTERVAL_PLAY_WAYS, type IntervalView } from '../model/interval-view'
import { IntervalHero } from './IntervalHero'
import { IntervalTiles } from './IntervalTiles'
import { useIntervalName } from './use-interval-name'

/** The intervals in a new order each time, for Play all shuffled (Interval settings). */
function shuffled(names: readonly RowInterval[]): RowInterval[] {
  const order = [...names]
  for (let at = order.length - 1; at > 0; at -= 1) {
    const other = Math.floor(Math.random() * (at + 1))
    const here = order[at]
    const there = order[other]
    if (here === undefined || there === undefined) continue
    order[at] = there
    order[other] = here
  }
  return order
}

/**
 * Intervals in the Chords page's shape (canvas 176): the keys at the top lighting the interval's two
 * notes; its name with its facts behind the ⓘ; its notes on the staff with the song it sounds like and
 * Hear it; Simple · Compound over the tiles. One floating bar as Scales': From (the root), Play with
 * how it plays (Ascending, Descending, Harmonic), and Play all. On a laptop the keys run across the
 * top, as Scales', and the tiles stand in a column beside the interval. The interval, the root and the way are the URL's.
 */
export function IntervalExplorer({
  view,
  onChange,
}: {
  view: IntervalView
  onChange: (change: Partial<IntervalView>) => void
}) {
  const { t } = useTranslation('practice')
  const said = useIntervalName()
  const { order, speed } = useSettings(selectIntervals)
  const playback = usePlayback<RowInterval | 'all'>()
  const root = noteFromParam(view.root)
  // An interval no letter writes over this root (the A9 over E♯) falls back to the 5th.
  const chosen: RowInterval = writesInterval(root, view.iv) ? view.iv : 'P5'
  const example = useMemo(() => intervalExample(root, chosen), [root, chosen])
  const score = useMemo(
    () => notate(intervalMusic(example.music, view.way)),
    [example.music, view.way],
  )
  const group = groupOf(chosen)
  const play = (name: RowInterval) =>
    playback.toggle(name, () => oneInterval(root, name, view.way, speed))
  usePlayKey(() => play(chosen))
  const playAll = () =>
    playback.toggle('all', () =>
      everyInterval(
        root,
        view.way,
        speed,
        order === 'shuffled' ? shuffled(ROW_INTERVALS) : ROW_INTERVALS,
      ),
    )
  const fromName = printedNote(usualName(pitchClassOf(root)))
  return (
    <div className="flex flex-col gap-4">
      <PinnedKeyboard shown={example.shown} place="top" />
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_26.25rem] lg:items-start lg:gap-10">
        <div className="flex min-w-0 flex-col gap-4">
          <IntervalHero
            name={chosen}
            root={root}
            score={score}
            playing={playback.playing === chosen}
            onPlay={() => play(chosen)}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-24">
          <Segmented<IntervalGroup>
            label={t('intervals.size.label')}
            value={group}
            options={INTERVAL_GROUP_IDS.map((each) => ({
              value: each,
              label: t(`intervals.size.${each}`),
            }))}
            onChange={(each) => {
              const first = INTERVAL_ROWS[each].find((name) => writesInterval(root, name))
              if (first) onChange({ iv: first })
            }}
          />
          <IntervalTiles
            names={INTERVAL_ROWS[group].filter((name) => writesInterval(root, name))}
            chosen={chosen}
            onPick={(name) => {
              onChange({ iv: name })
              play(name)
            }}
          />
        </div>
      </div>
      <FloatingActions>
        {/* Scales' three pieces of glass: where the interval is played from, Play with how, all. */}
        <FloatingPieces label={t('transport')}>
          <PitchPicker
            label={t('intervals.from')}
            value={pitchClassOf(root)}
            onChange={(pc) => onChange({ root: noteParam(usualName(pc)) })}
            trigger={
              <FloatingPiece
                label={`${t('intervals.from')}: ${fromName}`}
                caption={t('intervals.from')}
                aria-haspopup="dialog"
              >
                <span className="text-lg font-bold">{fromName}</span>
              </FloatingPiece>
            }
          />
          <FloatingPlaySplit
            label={t('intervals.play', { name: said(chosen).short })}
            playing={playback.playing === chosen}
            onPlay={() => play(chosen)}
            menuLabel={t('intervals.playAs')}
            menu={(trigger) => (
              <ActionMenu
                label={t('intervals.playAs')}
                align="end"
                render={trigger}
                trigger={null}
                actions={INTERVAL_PLAY_WAYS.map((way) => ({
                  key: way,
                  group: t('intervals.playAs'),
                  label: t(`intervals.way.${way}`),
                  checked: view.way === way,
                  onSelect: () => onChange({ way }),
                }))}
              />
            )}
          />
          <FloatingPiece
            label={t('intervals.playAll')}
            caption={t('intervals.all')}
            aria-pressed={playback.playing === 'all'}
            onClick={playAll}
          >
            <ListMusic aria-hidden />
          </FloatingPiece>
        </FloatingPieces>
      </FloatingActions>
    </div>
  )
}
