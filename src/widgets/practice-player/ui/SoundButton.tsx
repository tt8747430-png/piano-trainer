import { Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { selectPractice, selectSound, useSettings, useSettingsStoreApi } from '@/entities/settings'
import {
  onlyTheChords,
  setPracticeToggle,
  setSound,
  setStaffVolume,
} from '@/features/set-preference'
import { formatPercent, useLocale } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { MenuSection, SwitchRow } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { Slider, SliderLabel } from '@/shared/ui/primitives/slider'
import { useDockSide } from '../model/dock-side'
import type { ScoreTrack } from '../model/score-tracks'
import { DOCK_BUTTON } from './dock-sizes'

/** A volume as a screen reader says it: its percent, as the language writes one. */
const PERCENT = { style: 'unit', unit: 'percent' } as const
/** A volume's steps on its slider, and with the arrow keys. */
const VOLUME_STEP = 5
/** A switch's row in the popover: a finger's reach, no hairline under it. */
const SWITCH_ROW = 'min-h-11 border-b-0 py-0 text-base'

/**
 * The transport's Sound (ADR 0105, Chordify's mix), after the loop: the count-in (its bar counted down
 * large over the music, a click on each beat) and the click while the music plays, the saved
 * toggles; a volume for each part of the music, saved, the staves over the piano's and the
 * recording's where the music has them; and, with a recording, Only the chords, Chordify's tip.
 */
export function SoundButton({
  tracks,
  click,
  onClick,
}: {
  /** The click while the music plays: the Player's, this visit's where a lesson set it (ADR 0111). */
  click: boolean
  onClick: (on: boolean) => void
  /** The music's tracks, each its volume (A35); with a recording, Only the chords too. */
  tracks: readonly ScoreTrack[]
}) {
  const { t } = useTranslation(['player', 'common'])
  const side = useDockSide()
  const settings = useSettingsStoreApi()
  const { countIn } = useSettings(selectPractice)
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('player:sound.title')}
            title={t('player:sound.title')}
            className={cn('size-12 rounded-pill', DOCK_BUTTON)}
          />
        }
      >
        <Volume2 aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        aria-label={t('player:sound.title')}
        side={side}
        align="end"
        className="max-h-(--available-height) w-80 gap-4 overflow-y-auto overscroll-contain p-4"
      >
        <div className="flex flex-col">
          <SwitchRow
            label={t('player:sound.countIn')}
            info={t('player:sound.countInInfo')}
            checked={countIn}
            onCheckedChange={(on) => setPracticeToggle(settings, 'countIn', on)}
            className={SWITCH_ROW}
          />
          <SwitchRow
            label={t('player:sound.click')}
            info={t('player:sound.clickInfo')}
            checked={click}
            onCheckedChange={(on) => onClick(on)}
            className={SWITCH_ROW}
          />
        </div>
        <SoundVolumes tracks={tracks} />
      </PopoverContent>
    </Popover>
  )
}

/**
 * A volume for each part of the music, saved (ADR 0105): the hands, the staves over the piano's and
 * the recording's where the music has them, and the click; with a recording, Only the chords. The
 * Player's Sound's and the editor's (round 26): one Sound, one place, in both.
 */
export function SoundVolumes({ tracks }: { tracks: readonly ScoreTrack[] }) {
  const { t } = useTranslation(['player', 'common'])
  const locale = useLocale()
  const settings = useSettingsStoreApi()
  const sound = useSettings(selectSound)
  const recording = tracks.some((track) => track.id === 'recording')
  const parts = [
    ...tracks.map(({ id, label }) => ({
      key: id,
      label,
      volume: id === 'recording' ? sound.recording : (sound.staves[id] ?? 100),
      onChange: (percent: number) =>
        id === 'recording'
          ? setSound(settings, { recording: percent })
          : setStaffVolume(settings, id, percent),
    })),
    {
      key: 'click',
      label: t('player:sound.click'),
      volume: sound.click,
      onChange: (percent: number) => setSound(settings, { click: percent }),
    },
  ]
  return (
    <MenuSection title={t('player:sound.volume')} info={t('player:sound.volumeInfo')}>
      {parts.map(({ key, label, volume, onChange }) => (
        <Slider
          key={key}
          min={0}
          max={100}
          step={VOLUME_STEP}
          value={volume}
          onValueChange={onChange}
          format={PERCENT}
          locale={locale}
          // Room under the track for the thumb's 44px reach, which the popover's edge would cut.
          className="flex flex-col gap-2 pb-2.5"
        >
          <div className="flex justify-between gap-3 text-base">
            <SliderLabel>{label}</SliderLabel>
            <span className="text-muted-foreground tabular-nums">
              {formatPercent(locale, volume)}
            </span>
          </div>
        </Slider>
      ))}
      {recording ? (
        <Button
          variant="outline"
          className="min-h-11 self-start rounded-pill px-4 text-base"
          onClick={() => onlyTheChords(settings)}
        >
          {t('player:sound.onlyChords')}
        </Button>
      ) : null}
    </MenuSection>
  )
}
