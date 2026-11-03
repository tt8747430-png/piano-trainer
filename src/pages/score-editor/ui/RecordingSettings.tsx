import { Link } from '@tanstack/react-router'
import { Mic, Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FloatingBarButton, RowLink } from '@/shared/ui'
import { SoundVolumes } from '@/widgets/practice-player'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { useEditorState } from '../model/editor-context'

/**
 * The editor's Sound (round 26), the Player's in icon, name and place: each part's volume as the
 * Player's Sound has them, then a row to Recording's own home (Settings › Keyboard and recording,
 * R18), never a second copy of its switches. From the transport's last control, and from the
 * recording strip's while a take records.
 */
export function RecordingSettings({ className }: { className?: string }) {
  const { t } = useTranslation(['player', 'settings'])
  const staves = useEditorState((state) => state.draft.staves.length > 0)
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
        className="max-h-(--available-height) w-80 max-w-[calc(100vw-2rem)] gap-4 overflow-y-auto overscroll-contain p-4"
      >
        <SoundVolumes staves={staves} recording={false} />
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
