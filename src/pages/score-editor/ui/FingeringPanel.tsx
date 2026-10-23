import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { isHandLayer, notesAt } from '@/features/score-editor'
import { FINGERS, writtenName } from '@/shared/lib/music'
import { ToolKey } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * The palette's Fingering (ADR 0080): each note at the caret in a hand takes a finger, 1 to 5
 * (pressed again, taken off).
 */
export function FingeringPanel() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const layer = useEditorState((state) => state.layer)
  const notes = useEditorState(
    useShallow((state) =>
      isHandLayer(state.layer) ? notesAt(state.draft, state.layer, state.caret) : [],
    ),
  )
  if (!isHandLayer(layer)) return null
  return (
    <div className="flex flex-col gap-2">
      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('fingering.noNote')}</p>
      ) : (
        <>
          {/* What the numbers stand for, once over the notes' rows. */}
          <p className="text-xs text-muted-foreground">{t('fingers')}</p>
          {notes.map((n) => {
            const name = writtenName(n.midi, n.spelled)
            return (
              <div
                key={n.midi}
                role="group"
                aria-label={t('finger', { note: name })}
                className="grid grid-cols-[3rem_repeat(5,minmax(0,1fr))] items-center gap-1.5"
              >
                <span aria-hidden className="text-base font-semibold">
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
      )}
    </div>
  )
}
