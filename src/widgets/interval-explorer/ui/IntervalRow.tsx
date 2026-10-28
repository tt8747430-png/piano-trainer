import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { intervalExample } from '@/features/play-example'
import { cn } from '@/shared/lib'
import { INTERVALS, noteFromParam, type IntervalGroup, type NoteParam } from '@/shared/lib/music'
import { intervalSounds, type IntervalWay } from '@/shared/lib/schedule'
import { KeyDiagram, type ShownKeys } from '@/shared/ui'
import { rowRange, type RowInterval } from '../model/interval-rows'
import { intervalSongs } from '../model/interval-songs'
import { IntervalSongsTip } from './IntervalSongsTip'
import { useIntervalName } from './use-interval-name'

/**
 * One interval over the root as the reference app lists it: its short name in soft ink, its name over
 * its size in semitones, the songs it opens behind its ⓘ, and a small keyboard with both keys marked.
 * A tap anywhere else on the card plays it the way chosen above the list (at once, up or down) and
 * shows it on the page's keys; the row playing is lit.
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
  const songs = intervalSongs(name)
  return (
    <div
      className={cn(
        'card relative grid h-full w-full grid-cols-[minmax(0,1fr)_auto_minmax(5.5rem,8rem)] items-center gap-3 px-4 py-2.5 transition-colors has-[>button:hover]:bg-muted',
        playing &&
          'border-primary bg-selected text-selected-foreground has-[>button:hover]:bg-selected',
      )}
    >
      {/* The card is the button: its face stretched over the card, the ⓘ above it. */}
      <button
        type="button"
        aria-pressed={playing}
        onClick={() => {
          onShow(example.shown)
          onPlay(() => intervalSounds(example.low, example.high, way))
        }}
        className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 text-left after:absolute after:inset-0 after:rounded-[inherit] after:content-['']"
      >
        <span className="font-semibold text-muted-foreground">{short}</span>
        <span className="flex min-w-0 flex-col">
          <span className="font-semibold">{title}</span>
          <span className="text-sm text-muted-foreground">
            {t('music:intervalCard.semitones', { n: INTERVALS[name].semitones })}
          </span>
        </span>
      </button>
      {songs ? <IntervalSongsTip name={title} songs={songs} /> : <span />}
      <KeyDiagram
        keys={[example.low, example.high]}
        range={rowRange(example.low, group)}
        label={t('practice:intervals.keys', { name: title })}
      />
    </div>
  )
}
