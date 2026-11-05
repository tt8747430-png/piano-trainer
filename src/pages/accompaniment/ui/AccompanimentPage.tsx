import { Link, useSearch } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BackButton, ButtonLink, FabLink, FloatingActions, ScreenHeader } from '@/shared/ui'
import { PracticeLibrary, useArrangeMode } from '@/widgets/practice-library'
import { useAccompanimentLibrary } from '../model/use-accompaniment-library'

/**
 * Accompaniment (R30-4, R32): the accompaniment patterns as a library, the Songs library's shape,
 * patterns only: each method book (Called to Play, Called to Play 2, Боброва, Gorshkov) and the rhythm
 * styles a place of its patterns, a book's course in Learn and its songs in Songs linked over them;
 * Mine what the learner made, Hidden what they hid. The pencil in its bar arranges it; New pattern
 * floats, the honey +.
 */
export function AccompanimentPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/accompaniment' })
  const { groups, items, mine } = useAccompanimentLibrary()
  const { editing, edit } = useArrangeMode()
  return (
    <div className="flex flex-col gap-4 pb-4">
      <ScreenHeader title={t('pages.accompaniment')} back={<BackButton />} edit={edit} />
      <PracticeLibrary
        kind="accompaniment"
        view={view}
        items={items}
        groups={groups}
        groupWord="book"
        levels
        extra={t('library.table.hands')}
        {...(mine
          ? {
              mine: {
                empty: (
                  <ButtonLink
                    variant="soft"
                    render={<Link to="/practice/accompaniment/patterns/new" />}
                  >
                    <Plus data-icon="inline-start" aria-hidden />
                    {t('patterns.new')}
                  </ButtonLink>
                ),
              },
            }
          : {})}
        screen={t('pages.accompaniment')}
        editing={editing}
      />
      {editing ? null : (
        <FloatingActions>
          <FabLink
            label={t('patterns.new')}
            icon={Plus}
            render={<Link to="/practice/accompaniment/patterns/new" />}
          />
        </FloatingActions>
      )}
    </div>
  )
}
