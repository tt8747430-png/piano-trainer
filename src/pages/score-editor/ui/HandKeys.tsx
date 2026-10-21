import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { barAt, isHandLayer, notesAt } from '@/features/score-editor'
import { FINGERS, writtenName } from '@/shared/lib/music'
import { ToolKey } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * The Hand tab: the caret's bar written out from the pattern, or given back to it; and a finger on
 * each note at the caret, 1 to 5, the one on pressed again taking it off.
 */
export function HandKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const written = useEditorState((state) =>
    isHandLayer(state.layer) ? barAt(state.draft, state.caret).bar[state.layer] : false,
  )
  const notes = useEditorState(
    useShallow((state) =>
      isHandLayer(state.layer) ? notesAt(state.draft, state.layer, state.caret) : [],
    ),
  )
  return (
    <>
      <ToolKey
        label={written ? t('backToPattern') : t('writeOut')}
        span="row"
        className="text-base font-semibold"
        onClick={written ? () => actions.dispatch({ type: 'backToPattern' }) : actions.writeOut}
      >
        {written ? t('backToPattern') : t('writeOut')}
      </ToolKey>
      {notes.length === 0 ? (
        <p className="col-span-full py-2 text-center text-sm text-muted-foreground">
          {t('noNotes')}
        </p>
      ) : (
        // What the numbers stand for, once over the notes' rows.
        <p className="col-span-full text-xs text-muted-foreground">{t('fingers')}</p>
      )}
      {notes.map((n) => {
        const name = writtenName(n.midi, n.spelled)
        return (
          <div
            key={n.midi}
            role="group"
            aria-label={t('finger', { note: name })}
            className="col-span-full grid grid-cols-5 gap-1.5"
          >
            <span aria-hidden className="col-span-full text-sm font-semibold text-muted-foreground">
              {name}
            </span>
            {FINGERS.map((finger) => (
              <ToolKey
                key={finger}
                label={String(finger)}
                pressed={n.finger === finger}
                className="font-display text-xl font-semibold"
                onClick={() =>
                  actions.dispatch({
                    type: 'finger',
                    midi: n.midi,
                    finger: n.finger === finger ? null : finger,
                  })
                }
              >
                {finger}
              </ToolKey>
            ))}
          </div>
        )
      })}
    </>
  )
}
