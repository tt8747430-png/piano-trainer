import type { PathView } from '@/widgets/path-levels'
import { routeSearch, type Raw } from './read-search'

// The Path: whether its levels leave the learned steps out.
export const PATH_DEFAULTS: PathView = { hideLearned: false }
export const readPathSearch = (raw: Raw): PathView => ({ hideLearned: raw.hideLearned === true })
export const pathSearch = routeSearch(readPathSearch, PATH_DEFAULTS)
