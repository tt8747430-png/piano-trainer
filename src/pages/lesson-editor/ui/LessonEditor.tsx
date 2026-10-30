import { ArrowDown, ArrowUp, Plus, X } from 'lucide-react'
import { useId, useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  blankBlock,
  exampleProblem,
  INSERTABLE_BLOCKS,
  lessonExamples,
  lessonTexts,
  withBlockInserted,
  withBlockMoved,
  withBlockRemoved,
  withExample,
  withLessonText,
  withSectionAdded,
  withSectionMoved,
  withSectionRemoved,
  type Lesson,
  type LessonBlock,
  type LessonExample,
  type LessonText,
} from '@/entities/lesson'
import { useLessonDraft } from '@/features/edit-original'
import { localText, useLocale, type LocalText } from '@/shared/i18n'
import { ActionMenu, InfoTip, Segmented } from '@/shared/ui'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { LessonView } from '@/widgets/lesson-view'
import { AddByName, DraftScreen, TextFields } from '@/widgets/content-editor'

/**
 * An example written as a line of text (a row of chords, a line of notes, numerals): its kind over a
 * field, its format behind an ⓘ, and where it does not read, the word at fault under it.
 */
function ExampleField({
  lesson,
  example,
  onChange,
}: {
  lesson: Lesson
  example: LessonExample
  onChange: (text: string) => void
}) {
  const { t } = useTranslation('learn')
  const id = useId()
  // What is typed, spaces and all: a row of chords is written a symbol a word under it.
  const [typed, setTyped] = useState(example.text)
  const problem = exampleProblem(lesson, example)
  const label = t(`edit.example.${example.kind}`)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <InfoTip name={label}>{t(`edit.example.${example.kind}Info`)}</InfoTip>
      </div>
      <Input
        id={id}
        value={typed}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        aria-invalid={problem !== null || undefined}
        aria-describedby={problem === null ? undefined : `${id}-problem`}
        className="font-mono"
        onChange={(event) => {
          setTyped(event.target.value)
          onChange(event.target.value)
        }}
      />
      {problem === null ? null : (
        <p id={`${id}-problem`} className="text-xs text-destructive">
          {problem === '' ? t('edit.example.empty') : t('edit.example.unread', { word: problem })}
        </p>
      )}
    </div>
  )
}

/** The block a field is in, by its key (`sections.0.blocks.2.text`); none for a heading or takeaway. */
const blockOf = (key: string): number | null => {
  const block = /\.blocks\.(\d+)\./.exec(key)
  return block ? Number(block[1]) : null
}

/** What a block is called in the editor: a note with a name is a rule. */
const blockKind = (block: LessonBlock) =>
  block.kind === 'note' && block.rule ? 'rule' : block.kind

/** A block as a card: its kind, its fields, and its moves up and down and its removal. */
function BlockCard({
  label,
  first,
  last,
  onMove,
  onRemove,
  children,
}: {
  label: string
  first: boolean
  last: boolean
  onMove: (by: -1 | 1) => void
  onRemove: () => void
  children: ReactNode
}) {
  const { t } = useTranslation('learn')
  return (
    <div className="flex flex-col gap-3 card p-4">
      <div className="flex items-center gap-1">
        <span className="min-w-0 flex-1 text-sm font-semibold text-muted-foreground">{label}</span>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('edit.order.moveUp', { title: label })}
          disabled={first}
          onClick={() => onMove(-1)}
        >
          <ArrowUp aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('edit.order.moveDown', { title: label })}
          disabled={last}
          onClick={() => onMove(1)}
        >
          <ArrowDown aria-hidden />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('edit.order.remove', { title: label })}
          className="text-destructive"
          onClick={onRemove}
        >
          <X aria-hidden />
        </Button>
      </div>
      {children}
    </div>
  )
}

/**
 * The lesson as blocks, a group for the lesson's own texts and one a section (ADR 0116): a section's
 * heading, its blocks as cards (each its words and examples as fields, moved up or down or removed),
 * Add block for a new one of a kind, its takeaway; sections moved, removed and added. Each change saved.
 */
function LessonForm({ lesson, onChange }: { lesson: Lesson; onChange: (lesson: Lesson) => void }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const texts = lessonTexts(lesson)
  const examples = lessonExamples(lesson)
  const write = (key: string, text: LocalText) => onChange(withLessonText(lesson, key, text))
  const textField = (text: LessonText, label: string) => (
    <TextFields
      key={text.key}
      value={text.text}
      label={label}
      onChange={(next) => write(text.key, next)}
    />
  )
  const exampleField = (example: LessonExample) => (
    <ExampleField
      key={example.key}
      lesson={lesson}
      example={example}
      onChange={(text) => onChange(withExample(lesson, example.key, text))}
    />
  )
  const own = texts.filter((text) => text.section === null)
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-1">
          <h2 className="font-display text-xl">{t('edit.lesson')}</h2>
          <InfoTip name={t('edit.lesson')}>{t('edit.examples')}</InfoTip>
        </div>
        {own.map((text) => textField(text, t(`edit.kinds.${text.kind}`)))}
      </section>
      {lesson.sections.map((section, s) => {
        const name = localText(section.heading, locale)
        const title = `${t('edit.section', { n: s + 1 })}${name ? ` · ${name}` : ''}`
        const inSection = texts.filter((text) => text.section === s)
        const heading = inSection.find((text) => text.kind === 'heading')
        const takeaway = inSection.find((text) => text.kind === 'takeaway')
        return (
          <section
            key={s}
            aria-label={title}
            className="flex flex-col gap-4 border-t border-border pt-8"
          >
            <div className="flex items-center gap-1">
              <h2 className="min-w-0 flex-1 font-display text-xl">{title}</h2>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('edit.order.moveUp', { title })}
                disabled={s === 0}
                onClick={() => onChange(withSectionMoved(lesson, s, -1))}
              >
                <ArrowUp aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('edit.order.moveDown', { title })}
                disabled={s === lesson.sections.length - 1}
                onClick={() => onChange(withSectionMoved(lesson, s, 1))}
              >
                <ArrowDown aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t('edit.order.remove', { title })}
                className="text-destructive"
                disabled={lesson.sections.length === 1}
                onClick={() => onChange(withSectionRemoved(lesson, s))}
              >
                <X aria-hidden />
              </Button>
            </div>
            {heading ? textField(heading, t('edit.kinds.heading')) : null}
            {section.blocks.map((block, b) => {
              let step = 0
              const fields = [
                ...inSection
                  .filter((text) => blockOf(text.key) === b)
                  .map((text) => {
                    step = text.kind === 'step' ? step + 1 : 0
                    return textField(text, t(`edit.kinds.${text.kind}`) + (step ? ` ${step}` : ''))
                  }),
                ...examples
                  .filter((example) => example.section === s && blockOf(example.key) === b)
                  .map(exampleField),
              ]
              return (
                <BlockCard
                  key={`${s}.${b}.${block.kind}`}
                  label={t(`edit.blocks.${blockKind(block)}`)}
                  first={b === 0}
                  last={b === section.blocks.length - 1}
                  onMove={(by) => onChange(withBlockMoved(lesson, s, b, by))}
                  onRemove={() => onChange(withBlockRemoved(lesson, s, b))}
                >
                  {fields.length > 0 ? (
                    fields
                  ) : (
                    <p className="text-sm text-muted-foreground">{t('edit.blocks.asWritten')}</p>
                  )}
                </BlockCard>
              )
            })}
            <ActionMenu
              label={t('edit.blocks.add')}
              trigger={
                <>
                  <Plus data-icon="inline-start" aria-hidden />
                  {t('edit.blocks.add')}
                </>
              }
              render={<Button variant="outline" className="self-start" />}
              actions={INSERTABLE_BLOCKS.map((kind) => ({
                key: kind,
                label: t(`edit.blocks.${kind}`),
                onSelect: () =>
                  onChange(withBlockInserted(lesson, s, section.blocks.length, blankBlock(kind))),
              }))}
            />
            {takeaway ? textField(takeaway, t('edit.kinds.takeaway')) : null}
          </section>
        )
      })}
      <AddByName
        label={t('edit.newSection')}
        action={t('edit.addSection')}
        failed={t('edit.order.addFailed')}
        onAdd={async (name) => {
          onChange(withSectionAdded(lesson, name))
          return true
        }}
      />
    </div>
  )
}

/**
 * The draft as fields, or (Preview) as the lesson reads to a learner, its examples playing: the same
 * draft, each change saved as it rests.
 */
function DraftEditing({
  initial,
  onChange,
  toLesson,
}: {
  initial: Lesson
  onChange: (lesson: Lesson) => void
  toLesson: ReactElement
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const [lesson, setLesson] = useState(initial)
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const change = (next: Lesson) => {
    setLesson(next)
    onChange(next)
  }
  return (
    <div className="flex flex-col gap-6">
      <Segmented
        label={t('edit.mode')}
        value={mode}
        onChange={setMode}
        options={[
          { value: 'edit', label: t('edit.editing') },
          { value: 'preview', label: t('edit.preview') },
        ]}
      />
      {mode === 'edit' ? (
        <LessonForm lesson={lesson} onChange={change} />
      ) : (
        <LessonView
          lesson={lesson}
          up={{ link: toLesson, label: t('edit.back'), title: localText(lesson.title, locale) }}
          onward={{ link: toLesson, onGo: () => undefined }}
        />
      )}
    </div>
  )
}

/**
 * An editor's lesson editor (ADR 0116, round 6): the lesson's draft opened (else the lesson as
 * published), every text it shows as fields, English and Russian side by side; each change saved to
 * the draft once the editor rests; the draft's strip in the bar, with Publish, Versions and Discard.
 */
export function LessonEditor({
  lesson,
  id,
  back,
  toLesson,
}: {
  lesson: Lesson
  /** The lesson's id in the database (a course's as `<course>/<lesson>`). */
  id: string
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  /** A router `Link` to the lesson's own page. */
  toLesson: ReactElement
}) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const draft = useLessonDraft(lesson, id)
  // A new lesson's name is its draft's: the device has none of it.
  const opened = draft.load.state === 'ready' ? draft.load.value : lesson
  const title = localText(opened.title, locale)
  return (
    <DraftScreen
      draft={draft}
      heading={t('edit.title', { title })}
      title={title}
      back={back}
      backTo={{ link: toLesson, label: t('edit.back') }}
      editorsOnly={t('edit.editorsOnly')}
      unreadable={t('edit.unreadable')}
    >
      {(initial) => <DraftEditing initial={initial} onChange={draft.save} toLesson={toLesson} />}
    </DraftScreen>
  )
}
