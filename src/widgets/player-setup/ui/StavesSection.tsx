import { MicVocal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectSound, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { trackOf, type PlayerStaves, type TrackChoice, type TrackId } from '@/features/practice'
import { onlyTheChords, setSound, setStaffVolume } from '@/features/set-preference'
import { clefGlyph } from '@/shared/lib/music'
import { RECORDING_SYNC } from '@/entities/piece'
import { MenuSection, Stepper, VolumeSlider } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Switch } from '@/shared/ui/primitives/switch'
import type { ScoreTrack } from '@/widgets/practice-player'

/** A recording's Sync (R34): how far it is moved against the music, in milliseconds, later where positive. */
export interface RecordingSync {
  readonly ms: number
  readonly onChange: (ms: number) => void
}

/**
 * The Setup's first section (A35, Flat's Audio playback): the music's tracks top down, each staff by
 * its name and its clef, a song's recording by a microphone; each with Play and Show (the recording
 * Play alone), both on until switched off, and how loud it plays while it does (R31-P: the volumes
 * here, one page for a track). The last staff in sight keeps Show. Only the chords turns a recording
 * right down.
 */
export function StavesSection({
  tracks,
  staves,
  sync,
  onChange,
}: {
  tracks: readonly ScoreTrack[]
  staves: PlayerStaves
  /** The recording's Sync, under its volume while it plays. */
  sync?: RecordingSync | undefined
  onChange: (id: TrackId, change: Partial<TrackChoice>) => void
}) {
  const { t } = useTranslation(['player', 'music'])
  const inSight = tracks.filter((track) => track.drawn && trackOf(staves, track.id).show).length
  const settings = useSettingsStoreApi()
  const sound = useSettings(selectSound)
  const volume = (id: TrackId) => (id === 'recording' ? sound.recording : (sound.staves[id] ?? 100))
  const setVolume = (id: TrackId, percent: number) =>
    id === 'recording'
      ? setSound(settings, { recording: percent })
      : setStaffVolume(settings, id, percent)
  return (
    <MenuSection title={t('staves.title')} info={t('staves.about')}>
      <div role="group" aria-label={t('staves.title')} className="overflow-hidden card">
        <div
          aria-hidden
          className="grid grid-cols-[minmax(0,1fr)_4rem_4rem] items-center border-b border-hairline px-3 py-1.5 text-sm text-muted-foreground"
        >
          <span />
          <span className="text-center">{t('staves.play')}</span>
          <span className="text-center">{t('staves.show')}</span>
        </div>
        <ul className="divide-y divide-hairline">
          {tracks.map((track) => {
            const { play, show } = trackOf(staves, track.id)
            const last = track.drawn && show && inSight === 1
            return (
              <li
                key={track.id}
                className="grid min-h-14 grid-cols-[minmax(0,1fr)_4rem_4rem] items-center gap-y-1 px-3 py-1.5"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center text-muted-foreground"
                  >
                    {track.clef ? (
                      <span className="font-music text-xl leading-none">
                        {clefGlyph(track.clef)}
                      </span>
                    ) : (
                      <MicVocal className="size-5" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-base font-semibold">{track.label}</span>
                  </span>
                </span>
                <span className="grid place-items-center">
                  <Switch
                    aria-label={t('staves.playOf', { track: track.label })}
                    checked={play}
                    onCheckedChange={(on) => onChange(track.id, { play: on })}
                  />
                </span>
                <span className="grid place-items-center">
                  {track.drawn ? (
                    <Switch
                      aria-label={t('staves.showOf', { track: track.label })}
                      title={last ? t('music:view.lastStaff') : undefined}
                      checked={show}
                      disabled={last}
                      onCheckedChange={(on) => onChange(track.id, { show: on })}
                    />
                  ) : null}
                </span>
                {play ? (
                  <div className="col-span-full ps-11">
                    <VolumeSlider
                      label={t('staves.volumeOf', { track: track.label })}
                      setting={track.id === 'recording' ? 'sound.recording' : 'sound.staves'}
                      value={volume(track.id)}
                      onChange={(percent) => setVolume(track.id, percent)}
                    />
                    {track.id === 'recording' && sync ? (
                      <div className="mt-2 flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground">{t('staves.sync')}</span>
                        <Stepper
                          label={t('staves.sync')}
                          value={sync.ms}
                          min={RECORDING_SYNC.min}
                          max={RECORDING_SYNC.max}
                          step={RECORDING_SYNC.step}
                          format={(ms) =>
                            ms === 0
                              ? t('staves.inTime')
                              : t(ms < 0 ? 'staves.earlierBy' : 'staves.laterBy', {
                                  ms: Math.abs(ms),
                                })
                          }
                          decrease={t('staves.earlier')}
                          increase={t('staves.later')}
                          onChange={sync.onChange}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
      {tracks.some((track) => track.id === 'recording') ? (
        <Button
          variant="outline"
          className="min-h-11 self-start rounded-pill px-4 text-base"
          onClick={() => onlyTheChords(settings)}
        >
          {t('sound.onlyChords')}
        </Button>
      ) : null}
    </MenuSection>
  )
}
