import { useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { PROGRESSION_STYLES, type LibraryProgression } from '@/entities/progression-library'
import { useProgressionDraft } from '@/features/edit-original'
import { i18n, localText, useLocale, type Locale } from '@/shared/i18n'
import { parseNumerals } from '@/shared/lib/music'
import { Dropdown, InfoTip, TypedField } from '@/shared/ui'
import {
  DocText,
  DraftScreen,
  LanguageChoice,
  Properties,
  PropertyRow,
} from '@/widgets/content-editor'

/** A line of numerals as the field holds it: none where it is empty. */
const lineOf = (text: string): string | undefined => (text.trim() === '' ? undefined : text)

/**
 * The progression as one document in one language (round 21): its name as the page's heading and
 * how it sounds under it, written in place; its style and its lines of numerals as properties, a
 * line that does not read saying which word. Each change saved to the draft as it rests.
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
  const unread = (line: string) => (parseNumerals(line) ? null : t('progressions.unread'))
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <DocText
          size="title"
          label={t('progressions.edit.name')}
          value={progression.name}
          locale={locale}
          placeholder={words('progressions.edit.name')}
          onChange={(name) => change({ ...progression, name })}
        />
        <DocText
          label={t('progressions.edit.character')}
          value={progression.character}
          locale={locale}
          placeholder={words('progressions.edit.character')}
          onChange={(character) => change({ ...progression, character })}
        />
      </div>
      <Properties label={t('progressions.edit.heading')}>
        <PropertyRow name={t('progressions.edit.style')}>
          <Dropdown
            bare
            className="max-w-full"
            label={t('progressions.edit.style')}
            value={progression.style}
            options={PROGRESSION_STYLES.map((value) => ({
              value,
              label: t(`progressions.style.${value}`),
            }))}
            onChange={(style) => change({ ...progression, style })}
          />
        </PropertyRow>
      </Properties>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <h2 className="font-display text-2xl">{t('progressions.edit.lines')}</h2>
          <InfoTip name={t('progressions.edit.lines')}>{t('progressions.edit.info')}</InfoTip>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <TypedField
            label={t('progressions.edit.major')}
            value={progression.major ?? ''}
            error={unread(progression.major ?? '')}
            onChange={(major) => setLines(major, progression.minor ?? '')}
          />
          <TypedField
            label={t('progressions.edit.minor')}
            value={progression.minor ?? ''}
            error={unread(progression.minor ?? '')}
            onChange={(minor) => setLines(progression.major ?? '', minor)}
          />
        </div>
      </div>
    </div>
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
  const { t } = useTranslation('practice')
  const shown = useLocale()
  // The language written: the interface's to start with, switched in the bar.
  const [locale, setLocale] = useState<Locale>(shown)
  const draft = useProgressionDraft(progression)
  // A new progression's name is its draft's: the device has none of it.
  const opened = draft.load.state === 'ready' ? draft.load.value : progression
  const title = localText(opened.name, shown) || opened.id
  return (
    <DraftScreen
      draft={draft}
      heading={t('progressions.edit.bar')}
      title={title}
      back={back}
      backTo={{ link: toProgressions, label: t('progressions.edit.back') }}
      editorsOnly={t('progressions.edit.editorsOnly')}
      unreadable={t('progressions.edit.unreadable')}
      bar={<LanguageChoice value={locale} onChange={setLocale} />}
    >
      {(initial) => (
        <ProgressionDocument key={locale} initial={initial} locale={locale} onChange={draft.save} />
      )}
    </DraftScreen>
  )
}
