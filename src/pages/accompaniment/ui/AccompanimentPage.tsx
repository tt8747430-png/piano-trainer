import { Link, useSearch } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { isMethodBookId } from '@/entities/book'
import { BackButton, RoundLink, ScreenHeader } from '@/shared/ui'
import { AccompanimentTabs } from './AccompanimentTabs'
import { BookPieces } from './BookPieces'
import { PatternShelves } from './PatternShelves'

/**
 * Accompaniment: the patterns and what they are practised on, a part for each source. A method book's
 * part holds its groups of patterns, the pieces they are practised on (Called to Play's studies, the
 * hymns of Боброва's seven types, Gorshkov's songs) and its lessons on Learn; Styles the rhythm
 * styles; Yours what the learner starred, made and hid. New pattern in the bar.
 */
export function AccompanimentPage() {
  const { t } = useTranslation('practice')
  const { show } = useSearch({ from: '/shell/practice/accompaniment' })
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('pages.accompaniment')}
        back={<BackButton fallback={{ to: '/practice' }} />}
        actions={
          <RoundLink
            label={t('patterns.new')}
            icon={Plus}
            render={<Link to="/practice/accompaniment/patterns/new" />}
          />
        }
        tabs={<AccompanimentTabs current={show} />}
      />
      <div className="flex flex-col gap-8">
        <PatternShelves part={show} />
        {isMethodBookId(show) ? <BookPieces book={show} /> : null}
      </div>
    </div>
  )
}
