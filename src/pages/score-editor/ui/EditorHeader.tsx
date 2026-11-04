import { useNavigate } from '@tanstack/react-router'
import { Redo2, Settings2, Undo2, X } from 'lucide-react'
import { useMemo, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { MidiButton } from '@/features/connect-midi'
import { barAt } from '@/features/score-editor'
import { Button } from '@/shared/ui/primitives/button'
import { ScoreEditToggle } from '@/widgets/mode-switch'
import { useFoldKeys } from '@/features/live-keyboard'
import { BarTitle, KeysToggle } from '@/widgets/practice-player'
import { ToolsButton } from '@/widgets/tools-sheet'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * The editor's bar's lead, as the Player's (ADR 0115, R29 Flat's): Close, the score's title, and Done
 * beside it where the Player has its pencil.
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
      {/* The title prints at the head of the score: in the bar from 40rem, where it has the room
          (on a phone it was squeezed to a sliver between Close and the bar's tools). */}
      <span className="hidden min-w-0 sm:contents">
        <BarTitle title={meta.title} />
      </span>
      {done ?? <ScoreEditToggle pieceId={meta.id} editing bar={bar} disabled={recording} />}
    </>
  )
}

/**
 * The editor's bar's end, in the slots the Player's MIDI · Setup · More stand in (ADR 0115): the MIDI
 * keyboard (hidden without Web MIDI, as the Player's), then Undo and Redo, the edits made most often,
 * where Setup and More are; an original's draft, its status and its menu (`draft`); Done at the end.
 * While a take records they wait for Stop.
 */
export function EditorActions({ draft }: { draft?: ReactNode }) {
  const { t } = useTranslation('editor')
  const { actions, meta, takes } = useScoreEditorContext()
  const canUndo = useEditorState((state) => state.past.length > 0)
  const canRedo = useEditorState((state) => state.future.length > 0)
  const recording = takes.stage !== 'idle'
  const keys = useFoldKeys()
  const tempo = useEditorState((state) => state.draft.tempo)
  const meter = useEditorState((state) => state.draft.meter)
  const song = useMemo(() => ({ bpm: tempo, meter }), [tempo, meter])
  return (
    <>
      <KeysToggle shown={!keys.folded} onShow={(shown) => keys.fold(!shown)} />
      {/* On a phone held upright the bar has room for Close, Done and five more: MIDI is the one
          that waits for a wider screen (a keyboard still plays; Settings › Connect a piano). */}
      <span className="contents max-sm:hidden">
        <MidiButton variant="tool" />
      </span>
      {/* The Tools sheet where the Player has it (R29 B11), its metronome at the song's tempo. */}
      <ToolsButton song={song} />
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
      {meta.kind === 'example' ? null : <SettingsButton id={meta.id} disabled={recording} />}
      {draft}
    </>
  )
}

/**
 * The score's Settings (round 28), the bar's gear as a song page's: its credits, instruments, tempo,
 * key, time, bars, layout and how the editor writes, a page in the editor's place.
 */
function SettingsButton({ id, disabled }: { id: string; disabled: boolean }) {
  const { t } = useTranslation('editor')
  const navigate = useNavigate()
  return (
    <Button
      variant="tool"
      size="icon"
      aria-label={t('scoreSettings.title')}
      title={t('scoreSettings.title')}
      disabled={disabled}
      onClick={() =>
        void navigate({
          to: '/edit/$pieceId/settings',
          params: { pieceId: id },
          search: (prev) => prev,
        })
      }
    >
      <Settings2 aria-hidden />
    </Button>
  )
}
