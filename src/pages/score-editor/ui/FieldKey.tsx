import { useTranslation } from 'react-i18next'
import type { SheetField } from '@/widgets/score-sheet'
import { useScoreEditorContext } from '../model/editor-context'
import { fieldClosedBy } from '../model/fields'
import { CategoryIcon } from './palette-icons'
import { CaptionKey } from './palette-keys'

type Kind = SheetField['kind']

/** Each field's key: its name, the field it opens, and its picture. */
const KEYS = {
  chord: { label: 'chord.symbol', field: { kind: 'chord' }, icon: 'chords' },
} as const satisfies Readonly<
  Record<
    Kind,
    { label: string; field: SheetField; icon: Parameters<typeof CategoryIcon>[0]['category'] }
  >
>

/**
 * The palette's one key for a field typed where it is printed (ADR 0096): it opens the field at the
 * caret; greyed where the field cannot open there, its tooltip saying why.
 */
export function FieldKey({ field }: { field: Kind }) {
  const { t } = useTranslation('editor')
  const { view } = useScoreEditorContext()
  const why = fieldClosedBy(field, view)
  const key = KEYS[field]
  return (
    <CaptionKey
      label={t(key.label)}
      reason={why === null ? undefined : t(`reason.${why}`)}
      disabled={why !== null}
      onClick={() => view.openField(key.field)}
    >
      <CategoryIcon category={key.icon} />
    </CaptionKey>
  )
}
