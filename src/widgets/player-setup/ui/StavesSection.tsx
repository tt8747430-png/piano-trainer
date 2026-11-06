import { MicVocal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectSound, useSettings, useSettingsStoreApi } from '@/entities/settings'
import { trackOf, type PlayerStaves, type TrackChoice, type TrackId } from '@/features/practice'
import { onlyTheChords, setSound, setStaffVolume } from '@/features/set-preference'
import { clefGlyph } from '@/shared/lib/music'
import { MenuSection, VolumeSlider } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Switch } from '@/shared/ui/primitives/switch'
import type { ScoreTrack } from '@/widgets/practice-player'

/**
 * The Setup's first section (A35, Flat's Audio playback): the music's tracks top down, each staff by
 * its name and its clef, a song's recording by a microphone; each with Play and Show (the recording
 * Play alone), both on until switched off, and how loud it plays while it does (R31-P: the volumes
 * here, one page for a track). The last staff in sight keeps Show; a recording that plays only in its
 * own key says so where the song is moved to another. Only the chords turns a recording right down.
 */
export function StavesSection({
  tracks,
  staves,
  recordingWhy,
  onChange,
}: {
  tracks: readonly ScoreTrack[]
  staves: PlayerStaves
  /** Why the recording cannot play now (another key), where it cannot. */
  recordingWhy?: string | undefined
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
            const why = track.id === 'recording' ? recordingWhy : undefined
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
                    {why ? (
                      <span className="block text-sm text-pretty text-muted-foreground">{why}</span>
                    ) : null}
                  </span>
                </span>
                <span className="grid place-items-center">
                  <Switch
                    aria-label={t('staves.playOf', { track: track.label })}
                    checked={play && why === undefined}
                    disabled={why !== undefined}
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
                {play && why === undefined ? (
                  <div className="col-span-full ps-11">
                    <VolumeSlider
                      label={t('staves.volumeOf', { track: track.label })}
                      setting={track.id === 'recording' ? 'sound.recording' : 'sound.staves'}
                      value={volume(track.id)}
                      onChange={(percent) => setVolume(track.id, percent)}
                    />
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
