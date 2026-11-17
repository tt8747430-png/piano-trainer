import { useMemo } from 'react'
import { useStaffNames } from '@/entities/piece'
import { useHeadings } from '@/widgets/score-sheet'
import { SongPrint } from '@/widgets/song-print'
import { arrangeDraft } from '../model/arrange-draft'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/**
 * Print from the editor's menu (the boards' Print row; ADR 0107's one print): the draft as the Player
 * plays it as written, printed as the editor shows it (its chord names, words, fingering and the
 * staves in sight) on A4 pages, then its chords as diagrams; the browser's print makes the PDF.
 */
export function EditorPrint({ onDone }: { onDone: () => void }) {
  const { meta, view } = useScoreEditorContext()
  const draft = useEditorState((state) => state.draft)
  const performance = useMemo(() => arrangeDraft(draft), [draft])
  const staffNames = useStaffNames(draft.staves)
  const headings = useHeadings(draft)
  return (
    <SongPrint
      view="sheet"
      title={meta.title}
      performance={performance}
      headings={headings}
      sheet={{
        view: { chordNames: view.chordNames, lyrics: view.lyrics, hidden: view.hidden },
        piano: !draft.leadSheet,
        staffNames,
        fingers: view.fingers,
        names: false,
        positions: false,
      }}
      onDone={onDone}
    />
  )
}
