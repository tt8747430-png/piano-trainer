import { Play, Redo2, Undo2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { PlayLabel, RoundButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { SongSettings } from './SongSettings'

/** The editor's toolbar: Close and the title, Undo and Redo, MIDI, the song's settings, and Play. */
export function EditorToolbar() {
  const { t } = useTranslation(['editor', 'common'])
  const { actions, meta } = useScoreEditorContext()
  const canUndo = useEditorState((state) => state.past.length > 0)
  const canRedo = useEditorState((state) => state.future.length > 0)
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <RoundButton label={t('common:close')} icon={X} onClick={actions.close} />
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate text-lg">{meta.title}</h1>
          {meta.hasVersion ? (
            <span className="text-sm text-muted-foreground">{t('editor:yourVersion')}</span>
          ) : null}
        </div>
      </div>
      <RoundButton
        label={t('editor:undo')}
        icon={Undo2}
        disabled={!canUndo}
        onClick={() => actions.dispatch({ type: 'undo' })}
      />
      <RoundButton
        label={t('editor:redo')}
        icon={Redo2}
        disabled={!canRedo}
        onClick={() => actions.dispatch({ type: 'redo' })}
      />
      <MidiButton />
      <SongSettings />
      <Button onClick={actions.togglePlay}>
        <PlayLabel playing={meta.playing}>
          <Play data-icon="inline-start" />
          {t('editor:play')}
        </PlayLabel>
      </Button>
    </div>
  )
}
