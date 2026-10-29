import { useId, useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { lessonTexts, withLessonText, type Lesson, type LessonText } from '@/entities/lesson'
import { DraftStrip, useLessonDraft } from '@/features/edit-original'
import { localText, useLocale, type LocalText } from '@/shared/i18n'
import { editsContent, useAccount } from '@/shared/lib/account'
import { ButtonLink, InfoTip, ScreenHeader, Segmented } from '@/shared/ui'
import { LessonView } from '@/widgets/lesson-view'
import { Button } from '@/shared/ui/primitives/button'
import { Empty, EmptyContent, EmptyHeader, EmptyTitle } from '@/shared/ui/primitives/empty'
import { Textarea } from '@/shared/ui/primitives/textarea'

/** A text's two languages, each a field under its name, side by side where there is room. */
function TextFields({
  text,
  label,
  onChange,
}: {
  text: LessonText
  label: string
  onChange: (text: LocalText) => void
}) {
  const { t } = useTranslation('learn')
  const id = useId()
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {(['en', 'ru'] as const).map((locale) => {
          const empty = text.text[locale].trim() === ''
          return (
            <div key={locale} className="flex min-w-0 flex-col gap-1">
              <label htmlFor={`${id}-${locale}`} className="text-xs text-muted-foreground">
                {t(locale === 'en' ? 'edit.english' : 'edit.russian')}
              </label>
              <Textarea
                id={`${id}-${locale}`}
                lang={locale}
                value={text.text[locale]}
                aria-invalid={empty || undefined}
                aria-describedby={empty ? `${id}-${locale}-empty` : undefined}
                className="min-h-11"
                onChange={(event) => onChange({ ...text.text, [locale]: event.target.value })}
              />
              {empty ? (
                <p id={`${id}-${locale}-empty`} className="text-xs text-destructive">
                  {t('edit.empty')}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}

/** Every text of the lesson as fields, a group for the lesson's own and one a section; each change saved. */
function LessonForm({ lesson, onChange }: { lesson: Lesson; onChange: (lesson: Lesson) => void }) {
  const { t } = useTranslation('learn')
  const locale = useLocale()
  const texts = lessonTexts(lesson)
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
            {own.map((text, i) => {
              step = text.kind === 'step' ? (own[i - 1]?.kind === 'step' ? step + 1 : 1) : 0
              const label = t(`edit.kinds.${text.kind}`) + (step ? ` ${step}` : '')
              return (
                <TextFields
                  key={text.key}
                  text={text}
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

/** A screen saying why the form is not open yet: its line, and what to do. */
function NotOpen({ line, children }: { line: string; children?: ReactNode }) {
  return (
    <Empty className="min-h-80">
      <EmptyHeader>
        <EmptyTitle>
          <p role="status" className="text-lg">
            {line}
          </p>
        </EmptyTitle>
      </EmptyHeader>
      {children ? <EmptyContent>{children}</EmptyContent> : null}
    </Empty>
  )
}

/**
 * An editor's lesson editor (ADR 0116, round 6): the lesson's draft opened (else the lesson as
 * published), every text it shows as fields, English and Russian side by side; each change saved to
 * the draft once the editor rests; the draft's strip in the bar, with Publish, Versions and Discard.
 * Its examples stay as they are. Anyone but an editor is told so, with the way back.
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
  const { t } = useTranslation(['learn', 'editor'])
  const locale = useLocale()
  const { account } = useAccount()
  const draft = useLessonDraft(lesson, id)
  const title = localText(lesson.title, locale)
  const { load } = draft
  const body = !editsContent(account) ? (
    <NotOpen line={t('learn:edit.editorsOnly')}>
      <ButtonLink render={toLesson}>{t('learn:edit.back')}</ButtonLink>
    </NotOpen>
  ) : load.state === 'loading' ? (
    <NotOpen line={t('editor:original.opening')} />
  ) : load.state === 'failed' ? (
    <NotOpen
      line={t(load.reason === 'offline' ? 'editor:original.offline' : 'editor:original.failed')}
    >
      <Button onClick={draft.reopen}>{t('editor:original.retry')}</Button>
    </NotOpen>
  ) : (
    <DraftEditing
      key={draft.opened}
      initial={load.value}
      onChange={draft.save}
      toLesson={toLesson}
    />
  )
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-8">
      <ScreenHeader
        title={t('learn:edit.title', { title })}
        back={back}
        actions={
          editsContent(account) && load.state === 'ready' ? (
            <DraftStrip
              draft={draft}
              title={title}
              unreadable={t('learn:edit.unreadable')}
              onReset={draft.reopen}
            />
          ) : undefined
        }
      />
      {body}
    </div>
  )
}
