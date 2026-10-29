import { useState, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { PROGRESSION_STYLES, type LibraryProgression } from '@/entities/progression-library'
import { useProgressionDraft } from '@/features/edit-original'
import { localText, useLocale } from '@/shared/i18n'
import { parseNumerals } from '@/shared/lib/music'
import { Dropdown, InfoTip, TypedField } from '@/shared/ui'
import { DraftScreen, TextFields } from '@/widgets/content-editor'

/** A line of numerals as the field holds it: none where it is empty. */
const lineOf = (text: string): string | undefined => (text.trim() === '' ? undefined : text)

/** The progression's words, style and lines as fields, each change saved to the draft as it rests. */
function ProgressionForm({
  initial,
  onChange,
}: {
  initial: LibraryProgression
  onChange: (progression: LibraryProgression) => void
}) {
  const { t } = useTranslation('practice')
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
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-1">
        <h2 className="font-display text-xl">{t('progressions.edit.heading')}</h2>
        <InfoTip name={t('progressions.edit.heading')}>{t('progressions.edit.info')}</InfoTip>
      </div>
      <TextFields
        value={progression.name}
        label={t('progressions.edit.name')}
        onChange={(name) => change({ ...progression, name })}
      />
      <TextFields
        value={progression.character}
        label={t('progressions.edit.character')}
        onChange={(character) => change({ ...progression, character })}
      />
      <Dropdown
        label={t('progressions.edit.style')}
        value={progression.style}
        options={PROGRESSION_STYLES.map((value) => ({
          value,
          label: t(`progressions.style.${value}`),
        }))}
        onChange={(style) => change({ ...progression, style })}
        className="self-start"
      />
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
    </section>
  )
}

/**
 * An editor's progression editor (content as data, ADR 0116): a progression of the library's name
 * and how it sounds in English and Russian, its style, and its line of numerals in a major key, a
 * minor key or both, on its draft, with the draft's strip.
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
  const locale = useLocale()
  const draft = useProgressionDraft(progression)
  // A new progression's name is its draft's: the device has none of it.
  const opened = draft.load.state === 'ready' ? draft.load.value : progression
  const title = localText(opened.name, locale) || opened.id
  return (
    <DraftScreen
      draft={draft}
      heading={t('progressions.edit.title', { title })}
      title={title}
      back={back}
      backTo={{ link: toProgressions, label: t('progressions.edit.back') }}
      editorsOnly={t('progressions.edit.editorsOnly')}
      unreadable={t('progressions.edit.unreadable')}
    >
      {(initial) => <ProgressionForm initial={initial} onChange={draft.save} />}
    </DraftScreen>
  )
}
