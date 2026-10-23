import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { fingerableNotes } from '@/features/score-editor'
import { FINGERS } from '@/shared/lib/music'
import { ToolKey } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'
import { GlyphGrid } from './palette-keys'

/**
 * The palette's Fingering, Flat's (ADR 0091): five keys, 1 to 5, each putting its finger on the
 * notes chosen in a hand (a note alone at its place, the chord's one note chosen with Alt ↑ ↓, a
 * range's single notes), the chosen note's finger pressed, the same key again taking it off. Greyed
 * where no note takes one: the section says why.
 */
export function FingeringKeys() {
  const { t } = useTranslation('editor')
  const { actions } = useScoreEditorContext()
  const any = useEditorState((state) => fingerableNotes(state).length > 0)
  // Each finger's key pressed where every note it would go on wears that finger.
  const pressed = useEditorState(
    useShallow((state) => {
      const notes = fingerableNotes(state)
      return FINGERS.map((finger) => notes.length > 0 && notes.every((n) => n.finger === finger))
    }),
  )
  return (
    <GlyphGrid>
      {FINGERS.map((finger, i) => (
        <ToolKey
          key={finger}
          label={t('fingerOf', { finger })}
          pressed={pressed[i] ?? false}
          disabled={!any}
          className="font-display text-xl font-semibold"
          onClick={() => actions.dispatch({ type: 'finger', finger })}
        >
          {finger}
        </ToolKey>
      ))}
    </GlyphGrid>
  )
}
