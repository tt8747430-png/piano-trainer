import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { barAt, isHandLayer, notesAt } from '@/features/score-editor'
import { FINGERS, writtenName, type Finger } from '@/shared/lib/music'
import { Dropdown, ToolDivider } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

const NO_FINGER = 'none'

/** In a hand: write the caret's bar out from the pattern, or give it back; a finger on each note there. */
export function HandBarTools() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  const written = useEditorState((state) =>
    isHandLayer(state.layer) ? barAt(state.draft, state.caret).bar[state.layer] : false,
  )
  const notes = useEditorState(
    useShallow((state) =>
      isHandLayer(state.layer) ? notesAt(state.draft, state.layer, state.caret) : [],
    ),
  )
  if (!isHandLayer(layer)) return null
  return (
    <>
      <ToolDivider />
      {written ? (
        <Button variant="outline" onClick={() => actions.dispatch({ type: 'backToPattern' })}>
          {t('backToPattern')}
        </Button>
      ) : (
        <Button variant="outline" onClick={actions.writeOut}>
          {t('writeOut')}
        </Button>
      )}
      {notes.map((n) => (
        <Dropdown<Finger | typeof NO_FINGER>
          key={n.midi}
          label={t('finger', { note: writtenName(n.midi, n.spelled) })}
          value={n.finger ?? NO_FINGER}
          options={[
            { value: NO_FINGER, label: t('noFinger') },
            ...FINGERS.map((finger) => ({ value: finger, label: String(finger) })),
          ]}
          onChange={(finger) =>
            actions.dispatch({
              type: 'finger',
              midi: n.midi,
              finger: finger === NO_FINGER ? null : finger,
            })
          }
        />
      ))}
    </>
  )
}
