import { useTranslation } from 'react-i18next'
import { useSectionHeading } from '@/entities/piece'
import { barsOf, chosenBars } from '@/features/score-editor'
import { useEditorState } from './editor-context'

/**
 * Where the palette's Key signature or Time signature changes from (ADR 0114, 0097), as Flat changes
 * either from a bar: the section of the first bar chosen (or the caret's; a sign tapped on the score
 * chooses its bar), from there on up to the next change; in the song's first section, the whole
 * song. `said` names which, over the choice.
 */
export function useSignatureFrom() {
  const { t } = useTranslation('editor')
  const named = useSectionHeading()
  const from = useEditorState((state) => chosenBars(state).from)
  const section = useEditorState((state) => barsOf(state.draft)[from]?.section ?? 0)
  const heading = useEditorState((state) => state.draft.sections[section]?.heading)
  // The section's first bar, as printed.
  const first = useEditorState(
    (state) => (barsOf(state.draft).find((placed) => placed.section === section)?.index ?? 0) + 1,
  )
  const song = section === 0
  const said = song
    ? t('signature.song')
    : t('signature.fromSection', {
        section: heading ? named({ ...heading, lines: [] }) : '',
        bar: first,
      })
  return { from, section, song, said }
}
