import { Link, useSearch } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { BackButton, ButtonLink, FabLink, FloatingActions, ScreenHeader } from '@/shared/ui'
import { PracticeLibrary } from '@/widgets/practice-library'
import { SettingsGear } from '@/widgets/practice-pages'
import { useAccompanimentLibrary } from '../model/use-accompaniment-library'

/**
 * Accompaniment (R30-4): the patterns and what they are practised on as a library, the Songs
 * library's shape. Each method book (Called to Play, Called to Play 2, Bobrova, Gorshkov) and the
 * rhythm styles a place of its patterns and of the songs they are practised on (Called to Play's
 * studies, the hymns of Боброва's seven types, Gorshkov's songs); Mine what the learner made, Hidden
 * what they hid. New pattern floats, the honey +.
 */
export function AccompanimentPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/accompaniment' })
  const { groups, items, mine } = useAccompanimentLibrary()
  return (
    <div className="flex flex-col gap-4 pb-4">
      <ScreenHeader
        title={t('pages.accompaniment')}
        back={<BackButton />}
        settings={<SettingsGear page="accompaniment" />}
      />
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
      />
      <FloatingActions>
        <FabLink
          label={t('patterns.new')}
          icon={Plus}
          render={<Link to="/practice/accompaniment/patterns/new" />}
        />
      </FloatingActions>
    </div>
  )
}
