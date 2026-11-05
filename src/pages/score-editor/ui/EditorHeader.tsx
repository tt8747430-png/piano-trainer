import { Play, Redo2, Settings, Square, Undo2, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { useFoldKeys } from '@/features/live-keyboard'
import { barAt } from '@/features/score-editor'
import { Button } from '@/shared/ui/primitives/button'
import { ScoreEditToggle } from '@/widgets/mode-switch'
import { BarTitle, KeysToggle } from '@/widgets/practice-player'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * The editor's bar's lead, as the Player's (ADR 0115, R31-E Flat's): Close, the score's title from
 * 40rem, and Done.
 */
export function EditorLead({ done }: { done?: ReactNode }) {
  const { t } = useTranslation('common')
  const { actions, meta, takes } = useScoreEditorContext()
  const bar = useEditorState((state) => barAt(state.draft, state.caret).index + 1)
  const recording = takes.stage !== 'idle'
  return (
    <>
      <Button
        variant="tool"
        size="icon"
        aria-label={t('close')}
        title={t('close')}
        onClick={actions.close}
      >
        <X aria-hidden />
      </Button>
      {/* The title prints at the head of the score: in the bar from 40rem, where it has the room. */}
      <span className="hidden min-w-0 sm:contents">
        <BarTitle title={meta.title} />
      </span>
      {done ?? <ScoreEditToggle pieceId={meta.id} editing bar={bar} disabled={recording} />}
    </>
  )
}

/**
 * Play, the bar's one honey control (R31-E, Flat's): from the caret's bar to the end, Stop while it
 * sounds; it waits while a take records.
 */
function PlayButton() {
  const { t } = useTranslation('editor')
  const { actions, meta, takes } = useScoreEditorContext()
  const label = meta.playing ? t('stop') : t('play')
  return (
    <Button
      size="icon"
      aria-label={label}
      title={label}
      disabled={takes.stage !== 'idle'}
      className="rounded-full"
      onClick={actions.togglePlay}
    >
      {meta.playing ? <Square aria-hidden className="fill-current" /> : <Play aria-hidden />}
    </Button>
  )
}

/**
 * The editor's bar's end (R31-E, Flat's): from 40rem the piano keys and the MIDI keyboard (hidden
 * without Web MIDI), then Play, Undo, Redo and the one gear, the score's acts and its Settings
 * (`EditorGear`). While a take records they wait for Stop.
 */
export function EditorActions() {
  const { t } = useTranslation('editor')
  const { actions, takes, view } = useScoreEditorContext()
  const canUndo = useEditorState((state) => state.past.length > 0)
  const canRedo = useEditorState((state) => state.future.length > 0)
  const recording = takes.stage !== 'idle'
  const keys = useFoldKeys()
  return (
    <>
      {/* A phone held upright keeps its keys' own fold, and Settings › Connect a piano. */}
      <span className="contents max-sm:hidden">
        <KeysToggle shown={!keys.folded} onShow={(shown) => keys.fold(!shown)} />
        <MidiButton variant="tool" />
      </span>
      <PlayButton />
      <Button
        variant="tool"
        size="icon"
        aria-label={t('undo')}
        title={t('undo')}
        disabled={!canUndo || recording}
        onClick={() => actions.dispatch({ type: 'undo' })}
      >
        <Undo2 aria-hidden />
      </Button>
      <Button
        variant="tool"
        size="icon"
        aria-label={t('redo')}
        title={t('redo')}
        disabled={!canRedo || recording}
        onClick={() => actions.dispatch({ type: 'redo' })}
      >
        <Redo2 aria-hidden />
      </Button>
      <Button
        variant="tool"
        size="icon"
        aria-label={t('scoreSettings.title')}
        title={t('scoreSettings.title')}
        aria-expanded={view.gear !== null}
        disabled={recording}
        onClick={() => view.setGear(view.gear === null ? 'main' : null)}
      >
        <Settings aria-hidden />
      </Button>
    </>
  )
}
