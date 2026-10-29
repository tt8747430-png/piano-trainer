import { Link } from '@tanstack/react-router'
import { FileText, GraduationCap, Map as MapIcon, Music, type LucideIcon } from 'lucide-react'
import { useCallback, type ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import type { ContentKind } from '@/shared/api/content'
import type { DraftListing } from '@/shared/api/content-editing'
import { localText, useLocale, type LocalText } from '@/shared/i18n'
import { useContentEditing } from '@/shared/lib/content-editing'
import { RowLink } from '@/shared/ui'
import { useLoaded } from '../model/use-loaded'
import { LoadedState } from './LoadedState'

const ICONS: Readonly<Record<ContentKind, LucideIcon>> = {
  piece: Music,
  lesson: FileText,
  course: GraduationCap,
  journey: MapIcon,
}

/** The editor a draft opens in: a song's original, a lesson's (a course's under its course), a course's, a journey's. */
function editorOf({ kind, id }: Pick<DraftListing, 'kind' | 'id'>): ReactElement {
  switch (kind) {
    case 'piece':
      return <Link to="/edit/$pieceId" params={{ pieceId: id }} search={{ original: true }} />
    case 'course':
      return <Link to="/courses/$courseId/edit" params={{ courseId: id }} />
    case 'journey':
      return <Link to="/journeys/$journeyId/edit" params={{ journeyId: id }} />
    case 'lesson': {
      const [courseId, lessonId] = id.split('/')
      return courseId && lessonId ? (
        <Link to="/courses/$courseId/$lessonId/edit" params={{ courseId, lessonId }} />
      ) : (
        <Link to="/lessons/$lessonId/edit" params={{ lessonId: id }} />
      )
    }
  }
}

const isLocalText = (value: unknown): value is LocalText =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as LocalText).en === 'string' &&
  typeof (value as LocalText).ru === 'string'

/**
 * The drafts editors left (content as data, ADR 0116), the newest first: each its kind, name, when it
 * was changed and whether learners have any of it yet, opening its editor.
 */
export function DraftsTab() {
  const { t } = useTranslation('admin')
  const locale = useLocale()
  const editing = useContentEditing()
  const load = useCallback(() => editing.drafts(), [editing])
  const { loaded, reload } = useLoaded(load)
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
  const nameOf = (draft: DraftListing) => {
    const title = draft.title
    const name = isLocalText(title)
      ? localText(title, locale)
      : typeof title === 'string'
        ? title
        : ''
    return name.trim() || draft.id
  }
  return (
    <LoadedState loaded={loaded} reload={reload}>
      {(drafts) =>
        drafts.length === 0 ? (
          <p className="text-muted-foreground">{t('drafts.none')}</p>
        ) : (
          <ul aria-label={t('drafts.label')} className="flex flex-col card p-1.5">
            {drafts.map((draft) => (
              <li key={`${draft.kind} ${draft.id}`}>
                <RowLink
                  render={editorOf(draft)}
                  icon={ICONS[draft.kind]}
                  paint={draft.published ? 'sky' : 'yellow'}
                  title={nameOf(draft)}
                  detail={[
                    t(`drafts.kinds.${draft.kind}`),
                    draft.published
                      ? t('drafts.edited', { date: date.format(new Date(draft.updatedAt)) })
                      : t('drafts.unpublished'),
                  ].join(' · ')}
                />
              </li>
            ))}
          </ul>
        )
      }
    </LoadedState>
  )
}
