import { Link, Navigate, useNavigate, useSearch } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { isMethodBookId } from '@/entities/book'
import { ACCOMPANIMENT_PARTS, usePartName } from '@/entities/pattern'
import { selectAccompaniment, useSettings } from '@/entities/settings'
import { BackButton, Dropdown, RoundLink, ScreenHeader } from '@/shared/ui'
import { SettingsGear } from '@/widgets/practice-pages'
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
  const { hidden } = useSettings(selectAccompaniment)
  const partName = usePartName()
  const navigate = useNavigate()
  const parts = ACCOMPANIMENT_PARTS.filter((part) => !hidden.includes(part))
  // A source hidden on Accompaniment's Settings opens on the first one still shown.
  const first = parts[0]
  if (!parts.includes(show) && first) {
    return <Navigate to="/practice/accompaniment" search={{ show: first }} replace />
  }
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={t('pages.accompaniment')}
        back={<BackButton />}
        actions={
          <>
            <RoundLink
              label={t('patterns.new')}
              icon={Plus}
              render={<Link to="/practice/accompaniment/patterns/new" />}
            />
            <SettingsGear page="accompaniment" />
          </>
        }
      />
      {/* Where the patterns come from, one menu at the page's head (A25): never a second bar row. */}
      <Dropdown
        label={t('accompaniment.source')}
        value={show}
        onChange={(part) =>
          void navigate({ to: '/practice/accompaniment', search: { show: part }, replace: true })
        }
        options={parts.map((part) => ({ value: part, label: partName(part) }))}
        className="self-start"
      />
      <div className="flex flex-col gap-8">
        <PatternShelves part={show} />
        {isMethodBookId(show) ? <BookPieces book={show} /> : null}
      </div>
    </div>
  )
}
