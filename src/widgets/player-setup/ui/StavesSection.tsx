import { MicVocal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { trackOf, type PlayerStaves, type TrackChoice, type TrackId } from '@/features/practice'
import { clefGlyph } from '@/shared/lib/music'
import { MenuSection } from '@/shared/ui'
import { Switch } from '@/shared/ui/primitives/switch'
import type { ScoreTrack } from '@/widgets/practice-player'

/**
 * The Setup's first section (A35, Flat's Audio playback): the music's tracks top down, each staff by
 * its name and its clef, a song's recording by a microphone; each with Play and Show (the recording
 * Play alone), both on until switched off. The last staff in sight keeps Show; a recording that plays
 * only in its own key says so where the song is moved to another. How loud each plays is the
 * Player's settings page's.
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
                className="grid min-h-14 grid-cols-[minmax(0,1fr)_4rem_4rem] items-center px-3 py-1.5"
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
              </li>
            )
          })}
        </ul>
      </div>
    </MenuSection>
  )
}
