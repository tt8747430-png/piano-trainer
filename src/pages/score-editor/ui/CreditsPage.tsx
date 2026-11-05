import { Plus } from 'lucide-react'
import { useId, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  HEADER_FIELDS,
  HEADER_MAX,
  TITLE_MAX,
  USUAL_HEADER_FIELDS,
  type HeaderField,
} from '@/entities/piece'
import { ActionMenu, SettingsGroup } from '@/shared/ui'
import { useEditorState, useScoreEditorContext } from '../model/editor-context'

/** A name typed in its row (Flat's credits): its label, the field at its end, saved as it is left. */
function NameRow({
  label,
  value,
  max,
  placeholder,
  onSave,
}: {
  label: string
  value: string
  max: number
  placeholder: string
  onSave: (text: string) => void
}) {
  const id = useId()
  // What the field holds while it is typed in; null while it shows the score's.
  const [typed, setTyped] = useState<string | null>(null)
  const save = () => {
    if (typed !== null && typed.trim() !== value) onSave(typed)
    setTyped(null)
  }
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') event.currentTarget.blur()
    if (event.key === 'Escape') {
      event.preventDefault()
      setTyped(null)
      event.currentTarget.blur()
    }
  }
  return (
    <div className="flex min-h-14 items-center gap-3 rounded-control pr-3 pl-3 focus-within:bg-muted/60">
      <label htmlFor={id} className="shrink-0 text-lg leading-snug font-semibold">
        {label}
      </label>
      <input
        id={id}
        value={typed ?? value}
        maxLength={max}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        onFocus={() => setTyped(value)}
        onChange={(event) => setTyped(event.target.value)}
        onBlur={save}
        onKeyDown={onKeyDown}
        className="h-11 min-w-0 flex-1 bg-transparent text-end text-lg text-muted-foreground outline-none placeholder:text-muted-foreground/60 focus:text-foreground"
      />
    </div>
  )
}

/**
 * Title and credits (round 28, R31-E, Flat's credits), a page of the gear's Settings: the title and
 * what prints under it, each typed in its row; the usual credits always, the others once written or
 * added by their role (Add credit). Each change is one Undo step in the editor.
 */
export function CreditsPage() {
  const { t } = useTranslation('editor')
  const { actions, meta } = useScoreEditorContext()
  const header = useEditorState((state) => state.draft.header)
  const nameOf = (field: HeaderField) => t(`scoreSettings.names.${field}`)
  const [added, setAdded] = useState<readonly HeaderField[]>([])
  const shown = HEADER_FIELDS.filter(
    (field) =>
      USUAL_HEADER_FIELDS.includes(field) || header?.[field] !== undefined || added.includes(field),
  )
  const addable = HEADER_FIELDS.filter((field) => !shown.includes(field))
  return (
    <SettingsGroup flush info={t('scoreSettings.namesInfo')}>
      <NameRow
        label={t('scoreSettings.names.title')}
        value={meta.title}
        max={TITLE_MAX}
        placeholder={t('scoreSettings.add')}
        onSave={(title) => actions.dispatch({ type: 'title', title })}
      />
      {shown.map((field) => (
        <NameRow
          key={field}
          label={nameOf(field)}
          value={header?.[field] ?? ''}
          max={HEADER_MAX}
          placeholder={t('scoreSettings.add')}
          onSave={(text) => actions.dispatch({ type: 'header', field, text })}
        />
      ))}
      {addable.length > 0 ? (
        <div className="px-1 py-2">
          <ActionMenu
            label={t('scoreSettings.addCredit')}
            trigger={
              <>
                <Plus aria-hidden />
                {t('scoreSettings.addCredit')}
              </>
            }
            actions={addable.map((field) => ({
              key: field,
              label: nameOf(field),
              onSelect: () => setAdded((was) => [...was, field]),
            }))}
          />
        </div>
      ) : null}
    </SettingsGroup>
  )
}
