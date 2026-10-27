/**
 * The largest file of the app's own the service worker precaches (Workbox's own default, stated):
 * anything larger would be left out and need the network. A piece's recording must fit (ADR 0034).
 */
export const PRECACHE_FILE_LIMIT = 2 * 1024 * 1024

/**
 * The one file past it: the engraver's worker, Verovio with its WebAssembly inlined (about 8 MB, 2.4 MB
 * as it travels), precached all the same so the music is drawn offline (ADR 0087).
 */
export const PRECACHE_ENGRAVER_LIMIT = 10 * 1024 * 1024
