import { Check, Plus, Tag, X } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { TAG_MAX, tagOf } from '@/entities/library'
import { Button } from '@/shared/ui/primitives/button'
import { Textarea } from '@/shared/ui/primitives/textarea'
import { NameField } from '@/shared/ui'
import type { PickerTools } from './PropertyPicker'

/**
 * A text property's editor (R32-C): one field, focused, and Done; Enter keeps it too. What is kept is
 * the text as typed, `onSave` deciding what an empty one means.
 */
export function TextEditor({
  label,
  initial,
  maxLength,
  multiline = false,
  placeholder,
  tools,
  onSave,
}: {
  label: string
  initial: string
  maxLength: number
  multiline?: boolean
  placeholder?: string
  tools: PickerTools
  onSave: (text: string) => void
}) {
  const { t } = useTranslation('common')
  const [text, setText] = useState(initial)
  const save = () => {
    if (text !== initial) onSave(text)
    tools.close()
  }
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        save()
      }}
      className="flex flex-col gap-4"
    >
      {multiline ? (
        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{label}</span>
          <Textarea
            ref={(node) => tools.field(node)}
            value={text}
            rows={6}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(event) => setText(event.target.value)}
            className="min-h-36 text-base"
          />
        </label>
      ) : (
        <NameField
          ref={(node) => tools.field(node)}
          label={label}
          value={text}
          maxLength={maxLength}
          placeholder={placeholder}
          enterKeyHint="done"
          onChange={(event) => setText(event.target.value)}
        />
      )}
      <Button type="submit" size="lg" className="self-end">
        {t('editMode.done')}
      </Button>
    </form>
  )
}

/** One choice of a list property: its value, its name and what is drawn before it (a level's mark). */
export interface PropertyChoice<V extends string> {
  readonly value: V
  readonly label: string
  readonly mark?: ReactNode
}

/**
 * A list property's editor (R32-C, Notion's Select): its choices as rows, the chosen one checked; a
 * tap keeps it and closes.
 */
export function ChoiceEditor<V extends string>({
  label,
  value,
  choices,
  tools,
  onChoose,
}: {
  label: string
  value: V
  choices: readonly PropertyChoice<V>[]
  tools: PickerTools
  onChoose: (value: V) => void
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-col gap-1">
      {choices.map((choice) => (
        <button
          key={choice.value}
          type="button"
          role="radio"
          aria-checked={choice.value === value}
          onClick={() => {
            if (choice.value !== value) onChoose(choice.value)
            tools.close()
          }}
          className="choice flex min-h-12 items-center gap-3 rounded-control px-3 text-left focus-visible:-outline-offset-3"
        >
          {choice.mark}
          <span className="min-w-0 flex-1">{choice.label}</span>
          {choice.value === value ? <Check aria-hidden className="size-5 shrink-0" /> : null}
        </button>
      ))}
    </div>
  )
}

/**
 * The Tags editor (R32-C, Notion's Multi-select): the song's tags, each removed by its ×; a field
 * where typing offers the library's other tags that match and Create for a new one; Enter adds what
 * is typed. Every change is kept at once.
 */
export function TagsEditor({
  tags,
  suggestions,
  tools,
  onChange,
}: {
  tags: readonly string[]
  /** The library's other tags, given what is typed. */
  suggestions: (typed: string) => readonly string[]
  tools: PickerTools
  onChange: (tags: readonly string[]) => void
}) {
  const { t } = useTranslation(['piece', 'common'])
  const [typed, setTyped] = useState('')
  const input = useRef<HTMLInputElement | null>(null)
  const created = tagOf(typed)
  const offered = suggestions(typed).slice(0, 6)
  const add = (tag: string) => {
    if (!tags.includes(tag)) onChange([...tags, tag])
    setTyped('')
    input.current?.focus()
  }
  return (
    <div className="flex flex-col gap-4">
      {tags.length > 0 ? (
        <ul aria-label={t('piece:details.tags')} className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="flex h-11 items-center gap-0.5 rounded-pill bg-muted ps-3.5 text-base"
            >
              {tag}
              <button
                type="button"
                aria-label={t('piece:details.removeTag', { tag })}
                onClick={() => onChange(tags.filter((kept) => kept !== tag))}
                className="grid size-11 place-items-center rounded-pill transition-colors hover:bg-chosen focus-visible:-outline-offset-3"
              >
                <X aria-hidden className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">{t('piece:details.noTags')}</p>
      )}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (created) add(created)
        }}
      >
        <NameField
          ref={(node) => {
            input.current = node
            tools.field(node)
          }}
          label={t('piece:details.addTag')}
          value={typed}
          maxLength={TAG_MAX}
          enterKeyHint="done"
          onChange={(event) => setTyped(event.target.value)}
        />
      </form>
      {offered.length > 0 || (created && !tags.includes(created)) ? (
        <ul aria-label={t('piece:details.tagChoices')} className="flex flex-col gap-1">
          {offered.map((tag) => (
            <li key={tag}>
              <TagChoice icon={<Tag aria-hidden className="size-4.5" />} onClick={() => add(tag)}>
                {tag}
              </TagChoice>
            </li>
          ))}
          {created && !tags.includes(created) && !offered.includes(created) ? (
            <li>
              <TagChoice
                icon={<Plus aria-hidden className="size-4.5" />}
                onClick={() => add(created)}
              >
                {t('piece:details.createTag', { tag: created })}
              </TagChoice>
            </li>
          ) : null}
        </ul>
      ) : null}
      <Button size="lg" className="self-end" onClick={tools.close}>
        {t('common:editMode.done')}
      </Button>
    </div>
  )
}

function TagChoice({
  icon,
  onClick,
  children,
}: {
  icon: ReactNode
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-12 w-full items-center gap-3 rounded-control px-3 text-left transition-colors hover:bg-muted focus-visible:-outline-offset-3"
    >
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </button>
  )
}
