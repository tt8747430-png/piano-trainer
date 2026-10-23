import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { barAt, isHandLayer, notesAt } from '@/features/score-editor'
import { FINGERS, writtenName } from '@/shared/lib/music'
import { ToolKey } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * The palette's Fingering (ADR 0080): a finger goes on a written note, so a hand's bar the song's
 * pattern plays from the chords says so and offers to write it out as notes first. Written out, each
 * note at the caret takes a finger, 1 to 5 (pressed again, taken off). Giving the bar back to the
 * pattern is Bar's.
 */
export function FingeringPanel() {
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
  if (!written)
    return (
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm text-pretty text-muted-foreground">{t('bars.fromPattern')}</p>
        <Button variant="soft" onClick={actions.writeOut}>
          {t('bars.writeOut')}
        </Button>
      </div>
    )
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
