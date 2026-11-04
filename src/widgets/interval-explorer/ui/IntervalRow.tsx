import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { intervalExample } from '@/features/play-example'
import { cn } from '@/shared/lib'
import { INTERVALS, noteFromParam, type NoteParam } from '@/shared/lib/music'
import { intervalSounds, type IntervalWay } from '@/shared/lib/schedule'
import type { ShownKeys } from '@/shared/ui'
import { Play, Square } from 'lucide-react'
import type { RowInterval } from '../model/interval-rows'
import { intervalSongs } from '../model/interval-songs'
import { IntervalSongsTip } from './IntervalSongsTip'
import { useIntervalName } from './use-interval-name'

/**
 * One interval over the root (R29-P12): its short name in soft ink, its name, what it sounds like and
 * where it is met under it, its size in semitones, and the songs it opens behind its ⓘ. A tap on the
 * card ("Play minor third") plays it the way Play as chose (ascending, descending or harmonic) and
 * shows it on the page's keys; the row playing is lit. No keyboard of its own: the page's keys show it.
 */
export function IntervalRow({
  root,
  name,
  way,
  playing,
  onPlay,
  onShow,
}: {
  root: NoteParam
  name: RowInterval
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
        'card relative grid h-full w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5 transition-colors has-[>button:hover]:bg-muted sm:gap-3 sm:px-4',
        playing &&
          'border-primary bg-selected text-selected-foreground has-[>button:hover]:bg-selected',
      )}
    >
      {/* The card is the button: its face stretched over the card, the ⓘ above it. */}
      <button
        type="button"
        aria-label={t('practice:intervals.play', { name: title })}
        aria-pressed={playing}
        onClick={() => {
          onShow(example.shown)
          onPlay(() => intervalSounds(example.low, example.high, way))
        }}
        className="grid min-w-0 grid-cols-[1rem_2rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[1.25rem_2.25rem_minmax(0,1fr)] sm:gap-3 text-left after:absolute after:inset-0 after:rounded-[inherit] after:content-['']"
      >
        {/* A row that plays says so, Stop while it sounds (A22). */}
        <span data-play-mark="" aria-hidden className="text-muted-foreground">
          {playing ? <Square className="size-4" /> : <Play className="size-4" />}
        </span>
        <span className="font-semibold text-muted-foreground">{short}</span>
        <span className="flex min-w-0 flex-col">
          <span className="font-semibold">{title}</span>
          <span className="text-sm text-pretty">{t(`practice:intervals.meaning.${name}`)}</span>
          <span className="text-sm text-muted-foreground">
            {t('practice:intervals.semitones', { count: INTERVALS[name].semitones })}
          </span>
        </span>
      </button>
      {songs ? <IntervalSongsTip name={title} songs={songs} /> : <span />}
    </div>
  )
}
