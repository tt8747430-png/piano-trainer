/**
 * The largest file the service worker precaches (Workbox's own default, stated): anything larger
 * would be left out and need the network. A piece's recording must fit (ADR 0016).
 */
export const PRECACHE_FILE_LIMIT = 2 * 1024 * 1024
