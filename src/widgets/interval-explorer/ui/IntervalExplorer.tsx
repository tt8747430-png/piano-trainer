import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { intervalRoot, useShownKeys, writesInterval } from '@/features/play-example'
import { INTERVAL_GROUP_IDS, noteFromParam, type IntervalGroup } from '@/shared/lib/music'
import type { IntervalWay } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import { FoldGroup, Labelled, NoteChoice, Segmented, type ShownKeys } from '@/shared/ui'
import { INTERVAL_ROWS, type RowInterval } from '../model/interval-rows'
import { INTERVAL_PLAY_WAYS, type IntervalView } from '../model/interval-view'
import { IntervalRow } from './IntervalRow'

type Playback = ReturnType<typeof usePlayback<RowInterval>>

/**
 * Every interval over a root as the reference app lists them (ADR 0052): the root, how a row plays
 * (at once, up or down, kept in the URL), and a row an interval, within the octave and past it, each
 * group folding under its heading as the learner left it. A row tapped plays and shows on the keys
 * pinned over them.
 */
export function IntervalExplorer({
  view,
  onChange,
}: {
  view: IntervalView
  onChange: (change: Partial<IntervalView>) => void
}) {
  const { t } = useTranslation('practice')
  const [shown, show] = useShownKeys(view.root, intervalRoot(noteFromParam(view.root)))
  const playback = usePlayback<RowInterval>()
  return (
    <div className="flex flex-col gap-6">
      <PinnedKeyboard shown={shown} />
      <div className="grid-fields gap-x-10 gap-y-5">
        <div className="col-span-full">
          <NoteChoice label={t('root')} value={view.root} onChange={(root) => onChange({ root })} />
        </div>
        <Labelled label={t('intervals.way.label')}>
          <Segmented
            label={t('intervals.way.label')}
            value={view.way}
            options={INTERVAL_PLAY_WAYS.map((way) => ({
              value: way,
              label: t(`intervals.way.${way}`),
            }))}
            onChange={(way) => onChange({ way })}
          />
        </Labelled>
      </div>
      {INTERVAL_GROUP_IDS.map((group) => (
        <IntervalGroupFold
          key={group}
          group={group}
          view={view}
          playback={playback}
          onShow={show}
        />
      ))}
    </div>
  )
}

/** One group's rows under its folding heading. */
function IntervalGroupFold({
  group,
  view,
  playback,
  onShow,
}: {
  group: IntervalGroup
  view: IntervalView
  playback: Playback
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation('practice')
  const fold = useFold(`intervals.${group}`)
  const way: IntervalWay = view.way
  return (
    <FoldGroup
      title={t(`intervals.${group}`)}
      open={fold.open}
      onToggle={fold.toggle}
      listClassName="grid grid-cols-[repeat(auto-fill,minmax(min(24rem,100%),1fr))] gap-2"
    >
      {/* An interval no letter writes over this root (the A9 over E♯) is left out. */}
      {INTERVAL_ROWS[group]
        .filter((name) => writesInterval(noteFromParam(view.root), name))
        .map((name) => (
          <li key={name}>
            <IntervalRow
              root={view.root}
              name={name}
              group={group}
              way={way}
              playing={playback.playing === name}
              onPlay={(sounds) => playback.toggle(name, sounds)}
              onShow={onShow}
            />
          </li>
        ))}
    </FoldGroup>
  )
}
