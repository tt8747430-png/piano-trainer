import { MOST_RECENT_SEARCHES, type ViewsStore } from '@/entities/views'

/**
 * Remembers a search the learner opened a result of (rule 27): first among the recent ones, once
 * (the same words in another case count as one), the oldest let go past `MOST_RECENT_SEARCHES`.
 */
export function rememberSearch(store: ViewsStore, query: string): void {
  const words = query.trim()
  if (words === '') return
  const same = words.toLocaleLowerCase()
  const { searchRecent } = store.getState()
  if (searchRecent[0] === words) return
  store.setState({
    searchRecent: [
      words,
      ...searchRecent.filter((each) => each.toLocaleLowerCase() !== same),
    ].slice(0, MOST_RECENT_SEARCHES),
  })
}
