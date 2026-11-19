import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Music4, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { usePatternBook } from '@/entities/pattern'
import { BackButton, ButtonLink } from '@/shared/ui'
import { PatternTile } from '@/widgets/pattern-music'
import {
  PracticeLibrary,
  useAccompanimentLibrary,
  useArrangeMode,
  useLibraryNew,
} from '@/widgets/practice-library'

/**
 * Accompaniment (R30-4, R32): the accompaniment patterns as a library, the Songs library's shape,
 * patterns only: each method book (Called to Play, Called to Play 2, Боброва, Gorshkov) and the rhythm
 * styles a place of its patterns, a book's course in Learn and its songs in Songs linked over them;
 * Mine what the learner made, Hidden what they hid. The pencil in its bar arranges it; New makes a
 * pattern or a folder, the honey + on a phone and New ▾ in the bar on a laptop (canvas 169).
 */
export function AccompanimentPage() {
  const { t } = useTranslation('practice')
  const view = useSearch({ from: '/shell/practice/accompaniment' })
  const { groups, items: rows, patterns, mine } = useAccompanimentLibrary()
  const book = usePatternBook()
  // Each pattern's row shows how it plays, its roll in small (the board's picture).
  const items = rows.map((item) => {
    const pattern = patterns.get(item.id)
    return pattern
      ? { ...item, picture: { drawn: <PatternTile pattern={pattern} book={book} /> } }
      : item
  })
  const { editing, edit } = useArrangeMode()
  const navigate = useNavigate()
  const newDial = useLibraryNew('accompaniment', [
    {
      key: 'pattern',
      label: t('patterns.new'),
      icon: Music4,
      onSelect: () => void navigate({ to: '/practice/accompaniment/patterns/new' }),
    },
  ])
  return (
    <div className="flex flex-col gap-4 pb-4">
      <PracticeLibrary
        header={{
          large: true,
          title: t('pages.accompaniment'),
          back: <BackButton />,
          edit,
        }}
        kind="accompaniment"
        view={view}
        items={items}
        groups={groups}
        groupWord="book"
        levels
        columns={{ name: t('library.table.pattern'), second: t('library.table.hands') }}
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
      {editing ? null : newDial}
    </div>
  )
}
