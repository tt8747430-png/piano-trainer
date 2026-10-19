import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { RoundButton, usePageHeading } from '@/shared/ui'
import { useScoreEditorContext } from '../model/editor-context'
import { PieceSettings } from './PieceSettings'

/**
 * The editor's bar, one row at every size: Close, the title (and Your version), MIDI and the song's
 * settings. What edits and plays is the dock's (`EditorDock`), in the thumb's reach.
 */
export function EditorToolbar() {
  const { t } = useTranslation(['editor', 'common'])
  const { actions, meta } = useScoreEditorContext()
  const heading = usePageHeading<HTMLHeadingElement>(meta.title)
  return (
    <div className="flex items-center gap-2">
      <RoundButton label={t('common:close')} icon={X} onClick={actions.close} />
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 {...heading} className="truncate text-lg outline-none">
          {meta.title}
        </h1>
        {meta.hasVersion ? (
          <span className="truncate text-sm text-muted-foreground">{t('editor:yourVersion')}</span>
        ) : null}
      </div>
      <MidiButton />
      <PieceSettings />
    </div>
  )
}
