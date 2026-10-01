import { useTranslation } from 'react-i18next'
import { barAt, notesAt } from '@/features/score-editor'
import { noteName, writtenOctave, type Finger } from '@/shared/lib/music'
import { Dropdown } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

const FINGERS: readonly Finger[] = [1, 2, 3, 4, 5]

/** In a hand: write the caret's bar out from the pattern, or give it back; a finger on each note there. */
export function HandBarTools() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  const written = useEditorState((state) =>
    state.layer === 'rh' || state.layer === 'lh'
      ? barAt(state.draft, state.caret).bar[state.layer]
      : false,
  )
  const draft = useEditorState((state) => state.draft)
  const caret = useEditorState((state) => state.caret)
  if (layer !== 'rh' && layer !== 'lh') return null
  const notes = notesAt(draft, layer, caret)
  return (
    <>
      {written ? (
        <Button variant="outline" onClick={() => actions.dispatch({ type: 'backToPattern' })}>
          {t('backToPattern')}
        </Button>
      ) : (
        <Button variant="outline" onClick={actions.writeOut}>
          {t('writeOut')}
        </Button>
      )}
      {notes.map((n) => {
        const name = `${noteName(n.spelled)}${writtenOctave(n.midi, n.spelled)}`
        return (
          <Dropdown<number>
            key={n.midi}
            label={t('finger', { note: name })}
            value={n.finger ?? 0}
            options={[
              { value: 0, label: t('noFinger') },
              ...FINGERS.map((finger) => ({ value: finger, label: String(finger) })),
            ]}
            onChange={(finger) =>
              actions.dispatch({
                type: 'finger',
                midi: n.midi,
                finger: FINGERS.find((one) => one === finger) ?? null,
              })
            }
          />
        )
      })}
    </>
  )
}
