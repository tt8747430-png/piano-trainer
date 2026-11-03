import { useTranslation } from 'react-i18next'
import { useFold } from '@/features/fold-section'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { intervalRoot, useShownKeys, writesInterval } from '@/features/play-example'
import {
  INTERVAL_GROUP_IDS,
  noteFromParam,
  noteParam,
  pitchClassOf,
  type IntervalGroup,
} from '@/shared/lib/music'
import type { IntervalWay } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import {
  FloatingActions,
  FloatingBar,
  FloatingBarButton,
  FloatingBarPlay,
  FoldGroup,
  PitchPicker,
  usualName,
  type ShownKeys,
} from '@/shared/ui'
import { INTERVAL_ROWS, everyInterval, type RowInterval } from '../model/interval-rows'
import { INTERVAL_PLAY_WAYS, type IntervalView } from '../model/interval-view'
import { IntervalRow } from './IntervalRow'
import { WayPicture } from './WayPicture'

type Playback = ReturnType<typeof usePlayback<RowInterval | 'all'>>

/**
 * Every interval over a root as the reference app lists them (ADR 0052): the root, and a row an
 * interval, within the octave and past it, each group folding under its heading as the learner left
 * it. A row tapped plays and shows on the keys pinned over them. How it plays (harmonic, melodic
 * rising or falling, kept in the URL) is the floating transport's, beside Play all (A22).
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
  const playback = usePlayback<RowInterval | 'all'>()
  return (
    <div className="flex flex-col gap-6">
      <PinnedKeyboard shown={shown} />
      <div>
        <PitchPicker
          label={t('root')}
          value={pitchClassOf(noteFromParam(view.root))}
          onChange={(pc) => onChange({ root: noteParam(usualName(pc)) })}
        />
      </div>
      <FloatingActions>
        <FloatingBar label={t('transport')}>
          {INTERVAL_PLAY_WAYS.map((way) => (
            <FloatingBarButton
              key={way}
              label={t(`intervals.way.${way}`)}
              aria-pressed={view.way === way}
              className="aria-pressed:bg-selected aria-pressed:text-selected-foreground"
              onClick={() => onChange({ way })}
            >
              <WayPicture way={way} />
            </FloatingBarButton>
          ))}
          <FloatingBarPlay
            label={t('intervals.playAll')}
            playing={playback.playing === 'all'}
            onClick={() =>
              playback.toggle('all', () => everyInterval(noteFromParam(view.root), view.way))
            }
          />
        </FloatingBar>
      </FloatingActions>
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
