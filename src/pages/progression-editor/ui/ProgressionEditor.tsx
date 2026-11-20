import { Link, useNavigate } from '@tanstack/react-router'
import { Settings } from 'lucide-react'
import { useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { PROGRESSION_STYLES, type LibraryProgression } from '@/entities/progression-library'
import { useProgressionDraft } from '@/features/edit-original'
import { i18n, localText, useLocale, type Locale } from '@/shared/i18n'
import { parseNumerals } from '@/shared/lib/music'
import { cn } from '@/shared/lib'
import { ChoiceChips, FormField, Labelled, NameField, RoundLink, SettingsGroup } from '@/shared/ui'
import { DraftScreen } from '@/widgets/content-editor'

/** A line of numerals as the field holds it: none where it is empty. */
const lineOf = (text: string): string | undefined => (text.trim() === '' ? undefined : text)

/**
 * The progression as its board's form (`r54_practice_more.py`'s PEEDIT), in one language: its name
 * and how it sounds as fields, its style as chips, its lines of numerals typed in the serif in one
 * card, a key to a row, a line that does not read saying so under it. Each change saved to the draft
 * as it rests. Sections 24 apart, 8 inside.
 */
function ProgressionDocument({
  initial,
  locale,
  onChange,
}: {
  initial: LibraryProgression
  locale: Locale
  onChange: (progression: LibraryProgression) => void
}) {
  const { t } = useTranslation('practice')
  const words = i18n.getFixedT(locale, 'practice')
  const [progression, setProgression] = useState(initial)
  const change = (next: LibraryProgression) => {
    setProgression(next)
    onChange(next)
  }
  // The lines written as one value: a progression keeps a line in one mode at least.
  const setLines = (major: string, minor: string) => {
    const { major: _major, minor: _minor, ...rest } = progression
    const lines = {
      ...(lineOf(major) === undefined ? {} : { major }),
      ...(lineOf(minor) === undefined ? {} : { minor }),
    }
    change({
      ...rest,
      ...(lines.major === undefined && lines.minor === undefined ? { major } : lines),
    } as LibraryProgression)
  }
  const unread = (line: string) => line.trim() !== '' && !parseNumerals(line)
  const major = progression.major ?? ''
  const minor = progression.minor ?? ''
  const wrong = unread(major) || unread(minor)
  return (
    <div className="flex flex-col gap-6">
      <NameField
        label={t('progressions.edit.name')}
        value={progression.name[locale]}
        placeholder={words('progressions.edit.name')}
        aria-invalid={progression.name[locale].trim() === '' || undefined}
        onChange={(event) =>
          change({ ...progression, name: { ...progression.name, [locale]: event.target.value } })
        }
      />
      <FormField
        label={t('progressions.edit.character')}
        value={progression.character[locale]}
        placeholder={words('progressions.edit.character')}
        aria-invalid={progression.character[locale].trim() === '' || undefined}
        onChange={(event) =>
          change({
            ...progression,
            character: { ...progression.character, [locale]: event.target.value },
          })
        }
      />
      <Labelled label={t('progressions.edit.style')}>
        <ChoiceChips
          label={t('progressions.edit.style')}
          value={progression.style}
          options={PROGRESSION_STYLES.map((value) => ({
            value,
            label: t(`progressions.style.${value}`),
          }))}
          onChange={(style) => change({ ...progression, style })}
        />
      </Labelled>
      <SettingsGroup
        title={t('progressions.edit.lines')}
        info={t('progressions.edit.linesInfo')}
        flush
      >
        <LineRow
          label={t('progressions.edit.major')}
          value={major}
          wrong={unread(major)}
          onChange={(line) => setLines(line, minor)}
        />
        <LineRow
          label={t('progressions.edit.minor')}
          value={minor}
          wrong={unread(minor)}
          onChange={(line) => setLines(major, line)}
        />
      </SettingsGroup>
      {wrong ? (
        <p role="alert" className="-mt-4 mx-4 text-sm text-destructive">
          {t('progressions.unread')}
        </p>
      ) : null}
    </div>
  )
}

/** A key's line of numerals, typed at its row's end in the book serif (the board's GROUP `val` row). */
function LineRow({
  label,
  value,
  wrong,
  onChange,
}: {
  label: string
  value: string
  wrong: boolean
  onChange: (line: string) => void
}) {
  return (
    <label className="flex min-h-12 items-center gap-3 ps-4 pe-4 text-base">
      <span className="shrink-0">{label}</span>
      <input
        value={value}
        aria-invalid={wrong || undefined}
        autoCapitalize="off"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'min-w-0 flex-1 bg-transparent text-end font-display text-base outline-none',
          wrong && 'text-destructive',
        )}
      />
    </label>
  )
}

/**
 * An editor's progression editor (content as data, ADR 0116): a progression of the library's name
 * and how it sounds in English and Russian, its style, and its line of numerals in a major key, a
 * minor key or both, on its draft: one document in one language, the draft's state in the bar.
 */
export function ProgressionEditor({
  progression,
  back,
  toProgressions,
}: {
  progression: LibraryProgression
  /** The screen's Back (`BackButton`). */
  back: ReactNode
  /** A router `Link` to Progressions. */
  toProgressions: ReactElement
}) {
  const { t } = useTranslation(['practice', 'learn'])
  const shown = useLocale()
  // The language written: the interface's to start with, switched in the bar.
  const [locale, setLocale] = useState<Locale>(shown)
  const draft = useProgressionDraft(progression)
  const navigate = useNavigate()
  const params = { progressionId: progression.id }
  // A new progression's name is its draft's: the device has none of it.
  const opened = draft.load.state === 'ready' ? draft.load.value : progression
  const title = localText(opened.name, shown) || opened.id
  return (
    <DraftScreen
      draft={draft}
      heading={t('progressions.edit.bar')}
      form
      title={title}
      back={back}
      backTo={{ link: toProgressions, label: t('progressions.edit.back') }}
      editorsOnly={t('progressions.edit.editorsOnly')}
      editorsWhy={t('progressions.edit.editorsWhy')}
      unreadable={t('progressions.edit.unreadable')}
      language={{ value: locale, onChange: setLocale }}
      // Its Publish page and its Settings (R29 B6): every item's acts in the same places.
      publishPage={{
        link: <Link to="/practice/progressions/$progressionId/publish" params={params} />,
        open: () =>
          void draft
            .flush()
            .then(() => navigate({ to: '/practice/progressions/$progressionId/publish', params })),
      }}
      settings={
        <RoundLink
          label={t('learn:settings.title')}
          icon={Settings}
          render={<Link to="/practice/progressions/$progressionId/settings" params={params} />}
        />
      }
    >
      {(initial) => (
        <ProgressionDocument key={locale} initial={initial} locale={locale} onChange={draft.save} />
      )}
    </DraftScreen>
  )
}
