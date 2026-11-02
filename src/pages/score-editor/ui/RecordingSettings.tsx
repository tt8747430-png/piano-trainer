import { Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MetronomeSwitch, TuneSwitch } from '@/features/record-take'
import { FloatingBarButton, SettingRows } from '@/shared/ui'
import { SoundVolumes } from '@/widgets/practice-player'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { useEditorState } from '../model/editor-context'
import { hasTune } from '../model/tune'

/**
 * The editor's Sound (round 26), the Player's in icon, name and place, so a sound is set in one place
 * in both: a take's metronome after the count-in and Play melody under it where the song has a
 * melody staff (Settings › Recording's own switches), then each part's volume as the Player's Sound
 * has them. From the transport's last control, and from the recording strip's while a take records
 * (changed as it records).
 */
export function RecordingSettings({ className }: { className?: string }) {
  const { t } = useTranslation('player')
  const tune = useEditorState((state) => hasTune(state.draft))
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
        <SettingRows>
          <MetronomeSwitch />
          {tune ? <TuneSwitch /> : null}
        </SettingRows>
        <SoundVolumes staves={staves} recording={false} />
      </PopoverContent>
    </Popover>
  )
}
