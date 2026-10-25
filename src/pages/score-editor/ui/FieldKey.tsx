import { WholeWord } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { SheetField } from '@/widgets/score-sheet'
import { useScoreEditorContext } from '../model/editor-context'
import { fieldOf } from '../model/fields'
import { useFieldReason } from '../model/use-field-reason'
import { FieldIcon } from './palette-icons'
import { CaptionKey } from './palette-keys'

type Kind = SheetField['kind']

/** Each field's key: its name and its picture. */
const KEYS = {
  chord: { label: 'chord.symbol', picture: <FieldIcon field="chord" /> },
  lyrics: { label: 'lyrics.label', picture: <WholeWord /> },
  fingering: { label: 'fingering', picture: <FieldIcon field="fingering" /> },
} as const satisfies Readonly<Record<Kind, { label: string; picture: ReactNode }>>

/**
 * The palette's one key for a field typed where it is printed (ADR 0096): it opens the field at the
 * caret; greyed where the field cannot open there, its tooltip saying why.
 */
export function FieldKey({ field }: { field: Kind }) {
  const { t } = useTranslation('editor')
  const { view } = useScoreEditorContext()
  const why = useFieldReason(field)
  const key = KEYS[field]
  return (
    <CaptionKey
      label={t(key.label)}
      reason={why}
      disabled={why !== undefined}
      onClick={() => view.openField(fieldOf(field))}
    >
      {key.picture}
    </CaptionKey>
  )
}
