import { useTranslation } from 'react-i18next'
import { DOCK_BUTTON, speedTempo, TempoButton, Transport } from '@/widgets/practice-player'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { RecordButton } from './RecordButton'
import { RecordingSettings } from './RecordingSettings'
import { TakesButton } from './TakesButton'

/**
 * The editor's transport (ADR 0110), the Player's pill (`Transport`) in shape, size and place: the
 * tempo then ‹ Play ›, then the editor's own three where the Player's loop, Sound and hands stand:
 * Record, as Dorico's transport has it (ADR 0094, 0096), the takes (greyed, saying why, until the
 * song has one), and the recording settings (the metronome and Play melody under a take). Play plays
 * from the caret's bar at the tempo's speed (the learner's, never the song's tempo); ‹ › move the
 * caret. While a take records, its strip stands here.
 */
export function EditorDock() {
  const { t } = useTranslation('editor')
  const { actions, meta, takes, view } = useScoreEditorContext()
  const ownTempo = useEditorState((state) => state.draft.tempo)
  const dispatch = actions.dispatch
  return (
    <Transport
      label={t('dock')}
      tempo={
        <TempoButton
          tempo={speedTempo(ownTempo, view.speed)}
          ownTempo={ownTempo}
          // Along the sheet's foot at every size: its pop-up opens over it.
          side="top"
          onTempo={(tempo) => view.setSpeed(tempo / ownTempo)}
        />
      }
      playing={meta.playing}
      play={{ label: t('play') }}
      back={{ label: t('back') }}
      next={{ label: t('on') }}
      disabled={takes.stage !== 'idle'}
      onPlay={actions.togglePlay}
      onBack={() => dispatch({ type: 'move', by: 'step', direction: -1 })}
      onNext={() => dispatch({ type: 'move', by: 'step', direction: 1 })}
      end={
        <>
          <RecordButton className={DOCK_BUTTON} />
          <TakesButton className={DOCK_BUTTON} />
          <RecordingSettings className={DOCK_BUTTON} />
        </>
      }
    />
  )
}
