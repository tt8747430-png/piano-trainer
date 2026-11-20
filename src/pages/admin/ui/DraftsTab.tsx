import { Link } from '@tanstack/react-router'
import { Fragment, useCallback, type ReactElement, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { DraftListing } from '@/shared/api/content-editing'
import { localText, useLocale, type LocalText } from '@/shared/i18n'
import { useContentEditing } from '@/shared/lib/content-editing'
import { OpensMark, SettingsGroup } from '@/shared/ui'
import { useLoaded } from '../model/use-loaded'
import { LoadedState } from './LoadedState'
import { daySaid, useNow } from '@/shared/lib'

/**
 * The editor a draft opens in: a song's original, a lesson's (a course's under its course), a
 * course's, a level's, the courses' order, a progression's.
 */
function editorOf(
  { kind, id }: Pick<DraftListing, 'kind' | 'id'>,
  row: { className: string; children: ReactNode },
): ReactElement {
  switch (kind) {
    case 'piece':
      return <Link {...row} to="/edit/$pieceId" params={{ pieceId: id }} />
    case 'course':
      return <Link {...row} to="/courses/$courseId/edit" params={{ courseId: id }} />
    case 'journey':
      // A level and the shelves are edited in place, on their pages (R29 B4).
      return (
        <Link {...row} to="/levels/$levelId" params={{ levelId: id }} search={{ edit: true }} />
      )
    case 'catalog':
      return <Link {...row} to="/courses" search={{ edit: true }} />
    case 'progression':
      return (
        <Link
          {...row}
          to="/practice/progressions/$progressionId/edit"
          params={{ progressionId: id }}
        />
      )
    case 'lesson': {
      const [courseId, lessonId] = id.split('/')
      return courseId && lessonId ? (
        <Link {...row} to="/courses/$courseId/$lessonId/edit" params={{ courseId, lessonId }} />
      ) : (
        <Link {...row} to="/lessons/$lessonId/edit" params={{ lessonId: id }} />
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
 * The drafts editors left (content as data, ADR 0116), the newest first, one card as the Admin
 * board's: each its kind as a chip, its name, the day it was edited and, never published, Not yet
 * published in rust; each opens its editor.
 */
export function DraftsTab() {
  const { t } = useTranslation('admin')
  const locale = useLocale()
  const now = useNow()
  const editing = useContentEditing()
  const load = useCallback(() => editing.drafts(), [editing])
  const { loaded, reload } = useLoaded(load)
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
          <SettingsGroup flush>
            {drafts.map((draft) => (
              <Fragment key={`${draft.kind} ${draft.id}`}>
                {editorOf(draft, {
                  className:
                    'flex min-h-16 items-center gap-3 py-2 ps-4 pe-3 leading-[normal] transition-colors duration-150 ease-out hover:bg-muted/40 focus-visible:-outline-offset-3',
                  children: (
                    <>
                      <span className="flex h-6.5 min-w-16 shrink-0 items-center justify-center rounded-pill bg-muted px-2 text-xs font-bold">
                        {t(`drafts.kinds.${draft.kind}`)}
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="truncate font-semibold">{nameOf(draft)}</span>
                        <span className="truncate text-sm leading-[normal] text-muted-foreground">
                          {t('drafts.edited', {
                            date: daySaid(draft.updatedAt, locale, now, false),
                          })}
                          {draft.published ? null : (
                            <>
                              {' · '}
                              <span className="text-eyebrow">{t('drafts.unpublished')}</span>
                            </>
                          )}
                        </span>
                      </span>
                      <OpensMark />
                    </>
                  ),
                })}
              </Fragment>
            ))}
          </SettingsGroup>
        )
      }
    </LoadedState>
  )
}
