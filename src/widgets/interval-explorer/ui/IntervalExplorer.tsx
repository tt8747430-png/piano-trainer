import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PinnedKeyboard } from '@/features/live-keyboard'
import { intervalExample, writesInterval } from '@/features/play-example'
import {
  INTERVAL_GROUP_IDS,
  noteFromParam,
  noteParam,
  pitchClassOf,
  type IntervalGroup,
} from '@/shared/lib/music'
import { notate } from '@/shared/lib/notation'
import { intervalSounds } from '@/shared/lib/schedule'
import { usePlayback } from '@/shared/lib/services'
import {
  FloatingActions,
  FloatingBar,
  FloatingBarPlay,
  Labelled,
  PitchPicker,
  Segmented,
  usualName,
} from '@/shared/ui'
import { INTERVAL_ROWS, everyInterval, groupOf, type RowInterval } from '../model/interval-rows'
import { intervalMusic } from '../model/interval-music'
import { INTERVAL_PLAY_WAYS, type IntervalView } from '../model/interval-view'
import { IntervalHero } from './IntervalHero'
import { IntervalTiles } from './IntervalTiles'
import { WayPicture } from './WayPicture'

/**
 * Intervals as the canvas draws them (canvas 170): the interval chosen is the page's subject, its
 * name with its facts behind the ⓘ, its notes on the staff and the keys pinned below, what it sounds
 * like with Hear it; under it the intervals as tiles, Simple · Compound; then From and Play as. The
 * interval, the root and the way are the URL's. Play all is the floating transport's.
 */
export function IntervalExplorer({
  view,
  onChange,
}: {
  view: IntervalView
  onChange: (change: Partial<IntervalView>) => void
}) {
  const { t } = useTranslation('practice')
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
  const play = (name: RowInterval) => {
    const { low, high } = intervalExample(root, name)
    playback.toggle(name, () => intervalSounds(low, high, view.way))
  }
  return (
    <div className="flex flex-col gap-6">
      <PinnedKeyboard shown={example.shown} />
      {/* On a laptop From and Play as stand in a column beside the interval (canvas 170). */}
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8">
        <div className="flex min-w-0 flex-col gap-6">
          <IntervalHero
            name={chosen}
            root={root}
            score={score}
            playing={playback.playing === chosen}
            onPlay={() => play(chosen)}
          />
          <div className="flex flex-col gap-3">
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
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3 lg:sticky lg:top-24 lg:flex-col lg:items-stretch lg:card lg:p-4">
          <PitchPicker
            label={t('intervals.from')}
            value={pitchClassOf(root)}
            onChange={(pc) => onChange({ root: noteParam(usualName(pc)) })}
          />
          <div className="min-w-0 basis-full sm:max-w-md sm:flex-1 sm:basis-auto lg:max-w-none">
            <Labelled label={t('intervals.playAs')}>
              <Segmented
                label={t('intervals.playAs')}
                value={view.way}
                options={INTERVAL_PLAY_WAYS.map((way) => ({
                  value: way,
                  label: t(`intervals.way.${way}`),
                  icon: <WayPicture way={way} />,
                }))}
                onChange={(way) => onChange({ way })}
              />
            </Labelled>
          </div>
        </div>
      </div>
      <FloatingActions>
        <FloatingBar label={t('transport')}>
          <FloatingBarPlay
            named
            label={t('intervals.playAll')}
            playing={playback.playing === 'all'}
            onClick={() => playback.toggle('all', () => everyInterval(root, view.way))}
          />
        </FloatingBar>
      </FloatingActions>
    </div>
  )
}
