import { type SongsHome } from '../model/explore-view'
import { useExploreBrowse } from '../model/use-explore-browse'

/** What Explore shows for its URL: the feed read, and the entries left once one person's are chosen. */
export function useExploreFeed(home: SongsHome) {
  const people = home.kind === 'people'
  const { browse, retry } = useExploreBrowse(
    people
      ? { cat: 'all', sort: home.shelf || 'new', q: '' }
      : { cat: home.cat, sort: home.shelf || 'new', q: home.q },
  )
  const entries =
    browse.kind !== 'found'
      ? []
      : home.by
        ? browse.entries.filter((entry) => entry.authorName === home.by)
        : browse.entries
  return { browse, retry, entries }
}
