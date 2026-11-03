import { Link } from '@tanstack/react-router'
import { Mic, CirclePlay, Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FloatingBarButton, RowLink } from '@/shared/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'

/**
 * The editor's Sound (round 26), from the transport's last control, and from the recording strip's
 * while a take records: a row to each sound's one home (R18, B7): the Player's settings (each staff's
 * volume, the metronome's), and Recording's (Settings › Sound and recording), never a second copy.
 */
export function RecordingSettings({ className }: { className?: string }) {
  const { t } = useTranslation(['player', 'settings'])
  return (
    <Popover>
      <PopoverTrigger
        render={
          <FloatingBarButton label={t('sound.title')} className={className}>
            <Volume2 aria-hidden />
          </FloatingBarButton>
        }
      />
      <PopoverContent
        aria-label={t('sound.title')}
        side="top"
        align="end"
        className="max-h-(--available-height) w-80 max-w-[calc(100vw-2rem)] gap-1 overflow-y-auto overscroll-contain p-2"
      >
        <RowLink
          title={t('settingsPage.audio')}
          icon={CirclePlay}
          paint="sky"
          render={<Link to="/settings/player" />}
        />
        <RowLink
          title={t('settings:pages.sound')}
          icon={Mic}
          paint="lilac"
          render={<Link to="/settings/sound-and-recording" />}
        />
      </PopoverContent>
    </Popover>
  )
}
