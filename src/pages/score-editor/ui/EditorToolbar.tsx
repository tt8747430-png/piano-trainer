import { Play, Redo2, Type, Undo2, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { PlayLabel, RoundButton } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Toggle } from '@/shared/ui/primitives/toggle'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { PieceSettings } from './PieceSettings'
import { RecorderSheet } from './RecorderSheet'

/**
 * The editor's toolbar: Close and the title, Undo and Redo, Chord names, MIDI, the takes, the song's settings, and
 * Play (on a phone, the tools in a row of their own under the title and Play); while a take records,
 * only Close and MIDI.
 */
export function EditorToolbar() {
  const { t } = useTranslation(['editor', 'common'])
  const { actions, meta, takes, view } = useScoreEditorContext()
  const canUndo = useEditorState((state) => state.past.length > 0)
  const canRedo = useEditorState((state) => state.future.length > 0)
  const recording = takes.stage !== 'idle'
  return (
    <div className="flex flex-wrap items-center gap-2">
      <RoundButton label={t('common:close')} icon={X} onClick={actions.close} />
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="truncate text-lg">{meta.title}</h1>
        {meta.hasVersion ? (
          <span className="text-sm text-muted-foreground">{t('editor:yourVersion')}</span>
        ) : null}
      </div>
      {/* On a phone the tools take a row of their own under the title and Play. */}
      <div className="order-last flex w-full items-center gap-2 sm:order-none sm:w-auto">
        <RoundButton
          label={t('editor:undo')}
          icon={Undo2}
          disabled={recording || !canUndo}
          onClick={() => actions.dispatch({ type: 'undo' })}
        />
        <RoundButton
          label={t('editor:redo')}
          icon={Redo2}
          disabled={recording || !canRedo}
          onClick={() => actions.dispatch({ type: 'redo' })}
        />
        <Toggle
          pressed={view.chordNames}
          onPressedChange={view.showChordNames}
          aria-label={t('editor:chordNames')}
          title={t('editor:chordNames')}
          className="size-11 rounded-full px-0 lg:w-auto lg:px-4"
        >
          <Type aria-hidden />
          <span aria-hidden className="max-lg:hidden">
            {t('editor:chordNames')}
          </span>
        </Toggle>
        <MidiButton />
        <RecorderSheet />
        <PieceSettings />
      </div>
      <Button disabled={recording} onClick={actions.togglePlay}>
        <PlayLabel playing={meta.playing}>
          <Play data-icon="inline-start" />
          {t('editor:play')}
        </PlayLabel>
      </Button>
    </div>
  )
}
