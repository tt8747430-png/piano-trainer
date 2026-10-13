import type { SearchView } from '@/pages/search'
import { readText } from '@/shared/lib'
import { routeSearch, type Raw } from './read-search'

// Search: what is typed, as text.
const SEARCH_DEFAULTS: SearchView = { q: '' }
const readSearchSearch = (raw: Raw): SearchView => ({ q: readText(raw.q, SEARCH_DEFAULTS.q) })
export const searchSearch = routeSearch(readSearchSearch, SEARCH_DEFAULTS)
