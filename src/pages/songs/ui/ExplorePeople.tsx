import { Link } from '@tanstack/react-router'
import { ChevronRight, SearchX, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { PublicEntry } from '@/shared/api/public-library'
import { Avatar, Said } from '@/shared/ui'

/** One person who publishes: their name, picture and how many songs Explore holds of theirs. */
interface Person {
  readonly name: string
  readonly picture: string | null
  readonly songs: number
}

/** The people behind the songs, the most published first: those whose profile names them. */
export function peopleOf(entries: readonly PublicEntry[]): readonly Person[] {
  const people = new Map<string, Person>()
  for (const entry of entries) {
    if (!entry.authorName) continue
    const had = people.get(entry.authorName)
    people.set(entry.authorName, {
      name: entry.authorName,
      picture: had?.picture ?? entry.authorAvatar,
      songs: (had?.songs ?? 0) + 1,
    })
  }
  return [...people.values()].sort((a, b) => b.songs - a.songs || a.name.localeCompare(b.name))
}

/**
 * Explore's People (R72's PERSON, Flat's): who publishes, each a card of their picture, name and how
 * many songs, opening their songs; searched by name. None matching says so, with Clear; nobody yet
 * publishing under a name (all as "Piano Trainer learner") says that, never "No one matches “”".
 */
export function ExplorePeople({
  entries,
  query,
  onClear,
}: {
  entries: readonly PublicEntry[]
  query: string
  onClear: () => void
}) {
  const { t } = useTranslation('songs')
  const wanted = query.trim().toLocaleLowerCase()
  const people = peopleOf(entries).filter(
    (person) => !wanted || person.name.toLocaleLowerCase().includes(wanted),
  )
  if (people.length === 0)
    return (
      <Said
        icon={wanted ? SearchX : Users}
        title={wanted ? t('explore.noPeople', { query: query.trim() }) : t('explore.noPeopleYet')}
        description={wanted ? undefined : t('explore.noPeopleYetLine')}
        action={
          wanted ? (
            <button type="button" onClick={onClear} className="font-semibold text-link">
              {t('explore.clear')}
            </button>
          ) : undefined
        }
      />
    )
  return (
    <ul aria-label={t('explore.people')} className="grid items-start gap-3 lg:grid-cols-3 lg:gap-4">
      {people.map((person) => (
        <li key={person.name} className="min-w-0">
          <Link
            to="/songs"
            search={(was) => ({ ...was, kind: 'songs', cat: 'all', q: '', by: person.name })}
            replace
            className="card flex min-h-18 items-center gap-4 py-3 pr-3 pl-3.5 transition-colors duration-200 ease-out hover:bg-muted"
          >
            <Avatar name={person.name} picture={person.picture} size="person" />
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-[1.0625rem] font-semibold">{person.name}</span>
              <span className="text-sm text-muted-foreground">
                {t('explore.songCount', { count: person.songs })}
              </span>
            </span>
            <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
