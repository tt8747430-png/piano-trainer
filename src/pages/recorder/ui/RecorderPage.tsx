import { Circle, Download, Ellipsis, FileMusic, Pencil, Play, Square, Trash2 } from 'lucide-react'
import { useState, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import type { FreeTake } from '@/entities/take'
import { isMidiConnected, MidiButton, useMidiConnection } from '@/features/connect-midi'
import { useFreeRecorder, type RecorderProgressSource } from '@/features/record-take'
import { useLocale } from '@/shared/i18n'
import {
  ActionMenu,
  confirm,
  InfoTip,
  NameField,
  Said,
  SettingsGroup,
  Sheet,
  SheetContent,
} from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { ToolPage } from '@/widgets/tool-page'
import { useRecordings, type RecordingGroup } from '../model/use-recordings'

/** Where a take stands, read beat by beat by this part alone. */
function Progress({ progress }: { progress: RecorderProgressSource }) {
  const { t } = useTranslation('practice')
  const now = useSyncExternalStore(progress.subscribe, progress.current)
  // The free recorder always counts in: it never waits for a first note.
  if (!now || now.stage === 'waiting') return null
  return (
    <p aria-live="polite" className="font-heading text-4xl font-semibold tabular-nums">
      {now.stage === 'counting'
        ? t('tools.recorder.counting', { beat: now.beat })
        : t('tools.recorder.recording', { seconds: now.seconds })}
    </p>
  )
}

/** A recording's row: its name and when, how many notes; Play, and its acts in a menu. */
function RecordingRow({
  take,
  name,
  playing,
  onPlay,
  onRename,
  onExport,
  onMakeSong,
  onDelete,
}: {
  take: FreeTake
  name: string
  playing: boolean
  onPlay(): void
  onRename(): void
  onExport(): void
  onMakeSong(): void
  onDelete(): void
}) {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const made = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
  return (
    <li className="flex min-h-14 items-center gap-2 px-3 py-1.5">
      <Button
        variant="soft"
        size="icon"
        className="shrink-0 rounded-pill"
        aria-label={playing ? t('tools.recorder.stopPlaying') : t('tools.recorder.play')}
        aria-pressed={playing}
        onClick={onPlay}
      >
        {playing ? <Square aria-hidden className="fill-current" /> : <Play aria-hidden />}
      </Button>
      <span className="flex min-w-0 flex-1 flex-col text-left">
        <span className="font-semibold break-words">{name}</span>
        <span className="text-sm text-muted-foreground">
          {take.name ? `${made.format(take.made)} · ` : ''}
          {t('tools.recorder.notes', { count: take.notes.length })}
        </span>
      </span>
      <ActionMenu
        label={t('tools.recorder.actions', { name })}
        align="end"
        trigger={<Ellipsis aria-hidden />}
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('tools.recorder.actions', { name })}
            title={t('tools.recorder.actions', { name })}
          />
        }
        actions={[
          { key: 'rename', label: t('tools.recorder.rename'), icon: Pencil, onSelect: onRename },
          { key: 'export', label: t('tools.recorder.export'), icon: Download, onSelect: onExport },
          {
            key: 'song',
            label: t('tools.recorder.makeSong'),
            icon: FileMusic,
            onSelect: onMakeSong,
          },
          {
            key: 'delete',
            label: t('tools.recorder.delete'),
            icon: Trash2,
            destructive: true,
            onSelect: onDelete,
          },
        ]}
      />
    </li>
  )
}

/**
 * The Recorder (My recordings, R29 B11), a tool of its own: Record floating records from a connected
 * piano as the editor's takes do, without a song, to the Metronome's tempo and time; the count-in and
 * the seconds in the middle while it records. Under it every recording, grouped: the free ones, then
 * each song's takes under its title. Each plays, is renamed, exported as MIDI, made a song of (its
 * notes snapped to the beat, in My songs, opened), or deleted, which asks.
 */
export function RecorderPage() {
  const { t } = useTranslation('practice')
  const locale = useLocale()
  const { connection } = useMidiConnection()
  const piano = isMidiConnected(connection)
  const recorder = useFreeRecorder()
  const recordings = useRecordings()
  const recording = recorder.stage !== 'idle'
  const [renaming, setRenaming] = useState<{ take: FreeTake; name: string } | null>(null)
  const made = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
  const nameOf = (take: FreeTake) => take.name ?? made.format(take.made)
  const title = t('pages.recorder')
  const groupTitle = (group: RecordingGroup) =>
    group.song === undefined
      ? t('tools.recorder.free')
      : t('tools.recorder.ofSong', { title: group.song })
  return (
    <ToolPage
      title={title}
      actions={
        <>
          <MidiButton />
          <InfoTip name={title} bar>
            {t('tools.recorder.info')}
          </InfoTip>
        </>
      }
      play={{
        label: t('tools.recorder.record'),
        stopLabel: t('tools.recorder.stop'),
        icon: Circle,
        playing: recording,
        disabled: !piano,
        onToggle: () => (recording ? recorder.stop() : recorder.record()),
      }}
      controls={
        recordings.groups.length === 0 ? (
          // An empty state as the app's others (B2): what goes here, and how it comes.
          <Said
            icon={FileMusic}
            paint="lilac"
            title={t('tools.recorder.noneTitle')}
            description={t('tools.recorder.none')}
            action={null}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {recordings.groups.map((group) => (
              <SettingsGroup key={group.key} title={groupTitle(group)} flush>
                <ul
                  aria-label={groupTitle(group)}
                  className="flex flex-col divide-y divide-hairline"
                >
                  {group.takes.map((take) => {
                    const name = nameOf(take)
                    const songTitle = take.name ?? group.song ?? name
                    return (
                      <RecordingRow
                        key={take.id}
                        take={take}
                        name={name}
                        playing={recordings.playing === take.id}
                        onPlay={() => recordings.play(take)}
                        onRename={() => setRenaming({ take, name: take.name ?? '' })}
                        onExport={() => recordings.exportMidi(take, songTitle)}
                        onMakeSong={() => recordings.makeSong(take, songTitle)}
                        onDelete={() =>
                          void confirm({
                            title: t('tools.recorder.deleteTitle'),
                            body: t('tools.recorder.deleteBody'),
                            action: t('tools.recorder.delete'),
                            destructive: true,
                          }).then((yes) => {
                            if (yes) recordings.remove(take.id)
                          })
                        }
                      />
                    )
                  })}
                </ul>
              </SettingsGroup>
            ))}
          </div>
        )
      }
    >
      {recording ? (
        <Progress progress={recorder.progress} />
      ) : (
        <>
          <span
            aria-hidden
            className="grid size-24 place-items-center rounded-pill bg-destructive/10 text-destructive"
          >
            <Circle className="size-12 fill-current" />
          </span>
          {piano ? null : (
            <p className="max-w-sm text-muted-foreground">{t('tools.recorder.needsPiano')}</p>
          )}
        </>
      )}
      <Sheet open={renaming !== null} onOpenChange={(open) => (open ? null : setRenaming(null))}>
        <SheetContent
          title={t('tools.recorder.renameTitle')}
          footer={
            <Button
              className="w-full"
              onClick={() => {
                if (renaming) recordings.rename(renaming.take.id, renaming.name)
                setRenaming(null)
              }}
            >
              {t('tools.recorder.save')}
            </Button>
          }
        >
          <NameField
            label={t('tools.recorder.name')}
            value={renaming?.name ?? ''}
            placeholder={renaming ? made.format(renaming.take.made) : ''}
            maxLength={40}
            onChange={(event) =>
              setRenaming((now) => (now ? { ...now, name: event.target.value } : now))
            }
          />
        </SheetContent>
      </Sheet>
    </ToolPage>
  )
}
