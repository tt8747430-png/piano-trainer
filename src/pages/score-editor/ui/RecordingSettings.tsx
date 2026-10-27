import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MetronomeSwitch, TuneSwitch } from '@/features/record-take'
import { FloatingBarButton, SettingRows } from '@/shared/ui'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/primitives/popover'
import { useEditorState } from '../model/editor-context'
import { hasTune } from '../model/tune'

/**
 * How a take sounds (ADR 0096, 0115): the metronome after the count-in and Play melody under it where
 * the song has a melody staff, Settings › Recording's own switches, in a popover from the transport's
 * last control, and from the recording strip's while a take records (changed as it records).
 */
export function RecordingSettings({ className }: { className?: string }) {
  const { t } = useTranslation('editor')
  const tune = useEditorState((state) => hasTune(state.draft))
  return (
    <Popover>
      <PopoverTrigger
        render={
          <FloatingBarButton label={t('recorder.settings')} className={className}>
            <SlidersHorizontal aria-hidden />
          </FloatingBarButton>
        }
      />
      <PopoverContent
        aria-label={t('recorder.settings')}
        side="top"
        align="end"
        className="w-72 max-w-[calc(100vw-2rem)] p-4"
      >
        <SettingRows>
          <MetronomeSwitch />
          {tune ? <TuneSwitch /> : null}
        </SettingRows>
      </PopoverContent>
    </Popover>
  )
}
