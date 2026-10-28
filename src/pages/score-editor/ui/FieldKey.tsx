import { MicVocal } from 'lucide-react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { SheetField } from '@/widgets/score-sheet'
import { useScoreEditorContext } from '../model/editor-context'
import { fieldOf } from '../model/fields'
import type { Tool } from '../model/shortcuts'
import { useFieldReason } from '../model/use-field-reason'
import { FieldIcon } from './palette-icons'
import { PaletteKey } from './palette-keys'

type Kind = SheetField['kind']

/** Each field's key: its name, its picture and its shortcut (Flat's ⌘L, ⌘K). */
const KEYS = {
  lyrics: { label: 'lyrics.label', picture: <MicVocal />, tool: 'lyrics' },
  chord: { label: 'chord.symbol', picture: <FieldIcon field="chord" />, tool: 'chord' },
  fingering: { label: 'fingering', picture: <FieldIcon field="fingering" />, tool: 'fingering' },
} as const satisfies Readonly<Record<Kind, { label: string; picture: ReactNode; tool: Tool }>>

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
    <PaletteKey
      label={t(key.label)}
      tool={key.tool}
      reason={why}
      disabled={why !== undefined}
      onClick={() => view.openField(fieldOf(field))}
    >
      <span aria-hidden className="grid size-7 place-items-center [&_svg]:size-6">
        {key.picture}
      </span>
    </PaletteKey>
  )
}
