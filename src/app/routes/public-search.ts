import type { PublicView } from '@/pages/public-library'
import { readText } from '@/shared/lib'
import { routeSearch, type Raw } from './read-search'

// The Public library: songs or patterns, its sort and what is searched, in the URL, never remembered.
const PUBLIC_DEFAULTS: PublicView = { kind: 'song', sort: 'new', q: '' }
const readPublicSearch = (raw: Raw): PublicView => ({
  kind: raw.kind === 'pattern' ? 'pattern' : 'song',
  sort: raw.sort === 'saved' ? 'saved' : 'new',
  q: readText(raw.q, PUBLIC_DEFAULTS.q),
})
export const publicSearch = routeSearch(readPublicSearch, PUBLIC_DEFAULTS)
