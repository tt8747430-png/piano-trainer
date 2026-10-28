import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { intervalExample } from '@/features/play-example'
import { cn } from '@/shared/lib'
import { INTERVALS, noteFromParam, type IntervalGroup, type NoteParam } from '@/shared/lib/music'
import { intervalSounds, type IntervalWay } from '@/shared/lib/schedule'
import { KeyDiagram, type ShownKeys } from '@/shared/ui'
import { rowRange, type RowInterval } from '../model/interval-rows'
import { useIntervalName } from './use-interval-name'

/**
 * One interval over the root as the reference app lists it: its short name in soft ink, its name over
 * its size in semitones, and a small keyboard with both keys marked. A tap plays it the way chosen above the list (at once, up or
 * down) and shows it on the page's keys; the row playing is lit.
 */
export function IntervalRow({
  root,
  name,
  group,
  way,
  playing,
  onPlay,
  onShow,
}: {
  root: NoteParam
  name: RowInterval
  group: IntervalGroup
  way: IntervalWay
  playing: boolean
  onPlay: (sounds: () => ReturnType<typeof intervalSounds>) => void
  onShow: (shown: ShownKeys) => void
}) {
  const { t } = useTranslation(['practice', 'music'])
  const said = useIntervalName()
  const example = useMemo(() => intervalExample(noteFromParam(root), name), [root, name])
  const { title, short } = said(name)
  return (
    <button
      type="button"
      aria-pressed={playing}
      onClick={() => {
        onShow(example.shown)
        onPlay(() => intervalSounds(example.low, example.high, way))
      }}
      className={cn(
        'card grid h-full w-full grid-cols-[2.25rem_minmax(0,1fr)_minmax(5.5rem,8rem)] items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted',
        playing && 'border-primary bg-selected text-selected-foreground hover:bg-selected',
      )}
    >
      <span className="font-semibold text-muted-foreground">{short}</span>
      <span className="flex min-w-0 flex-col">
        <span className="font-semibold">{title}</span>
        <span className="text-sm text-muted-foreground">
          {t('music:intervalCard.semitones', { n: INTERVALS[name].semitones })}
        </span>
      </span>
      <KeyDiagram
        keys={[example.low, example.high]}
        range={rowRange(example.low, group)}
        label={t('practice:intervals.keys', { name: title })}
      />
    </button>
  )
}
