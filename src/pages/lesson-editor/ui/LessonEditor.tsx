import { useId, useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  exampleProblem,
  lessonExamples,
  lessonTexts,
  withExample,
  withLessonText,
  type Lesson,
  type LessonExample,
} from '@/entities/lesson'
import { useLessonDraft } from '@/features/edit-original'
import { localText, useLocale, type LocalText } from '@/shared/i18n'
import { InfoTip, Segmented } from '@/shared/ui'
import { Input } from '@/shared/ui/primitives/input'
import { LessonView } from '@/widgets/lesson-view'
import { DraftScreen } from './DraftScreen'
import { TextFields } from './TextFields'

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

/** Where a field stands in its section: its heading first, its blocks in their order, its takeaway last. */
const orderOf = (key: string): number => {
  const block = /\.blocks\.(\d+)\./.exec(key)
  return block ? Number(block[1]) : key.endsWith('.takeaway') ? Infinity : -1
}

/** Every text of the lesson as fields, a group for the lesson's own and one a section; each change saved. */
function LessonForm({ lesson, onChange }: { lesson: Lesson; onChange: (lesson: Lesson) => void }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const texts = lessonTexts(lesson)
  const examples = lessonExamples(lesson)
  const write = (key: string, text: LocalText) => onChange(withLessonText(lesson, key, text))
  const groups = [null, ...lesson.sections.map((_, i) => i)]
  return (
    <div className="flex flex-col gap-8">
      {groups.map((section) => {
        const own = texts.filter((text) => text.section === section)
        const heading =
          section === null
            ? t('edit.lesson')
            : `${t('edit.section', { n: section + 1 })} · ${localText(lesson.sections[section]?.heading ?? { en: '', ru: '' }, locale)}`
        // Steps are numbered within their block, as the lesson numbers them.
        let step = 0
        return (
          <section key={section ?? 'lesson'} className="flex flex-col gap-5">
            <div className="flex items-center gap-1">
              <h2 className="font-display text-xl">{heading}</h2>
              {section === null ? (
                <InfoTip name={t('edit.lesson')}>{t('edit.examples')}</InfoTip>
              ) : null}
            </div>
            {[
              ...own.map((text) => ({ field: 'text' as const, text })),
              ...examples
                .filter((example) => example.section === section)
                .map((example) => ({ field: 'example' as const, example })),
            ]
              .sort(
                (a, b) =>
                  orderOf(a.field === 'text' ? a.text.key : a.example.key) -
                  orderOf(b.field === 'text' ? b.text.key : b.example.key),
              )
              .map((item, i, items) => {
                if (item.field === 'example')
                  return (
                    <ExampleField
                      key={item.example.key}
                      lesson={lesson}
                      example={item.example}
                      onChange={(text) => onChange(withExample(lesson, item.example.key, text))}
                    />
                  )
                const { text } = item
                const before = items[i - 1]
                step =
                  text.kind === 'step'
                    ? before?.field === 'text' && before.text.kind === 'step'
                      ? step + 1
                      : 1
                    : 0
                const label = t(`edit.kinds.${text.kind}`) + (step ? ` ${step}` : '')
                return (
                  <TextFields
                    key={text.key}
                    value={text.text}
                    label={label}
                    onChange={(next) => write(text.key, next)}
                  />
                )
              })}
          </section>
        )
      })}
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
  const title = localText(lesson.title, locale)
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
