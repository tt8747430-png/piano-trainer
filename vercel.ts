import { routes, type VercelConfig } from '@vercel/config/v1'

// Static SPA. Hashed assets are cached forever; everything else (the app at any path, the service
// worker, the manifest, the icons) must revalidate so a deploy reaches learners. Every path falls
// back to the app (deep links) except /assets/, where a missing file is a 404 rather than the app
// under a year's cache. Every response refuses to be framed or sniffed, keeps its referrer to its
// origin, and offers only what the app uses (MIDI, the screen kept on); no script or style is
// restricted, so the two boot scripts index.html carries inline keep running.
//
// `piano-data/` is the owner's source material: the app reads none of it, so a push that changes
// only that folder builds nothing (the command exits 0 when nothing else changed since the last
// deployment). Without a previous deployment, or one outside the shallow clone, `git diff` fails
// and the build goes ahead.
export const IGNORED_FOLDERS = ['piano-data'] as const

export const config: VercelConfig = {
  framework: 'vite',
  buildCommand: 'npm run build',
  ignoreCommand: `git diff --quiet "\${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}" HEAD -- . ${IGNORED_FOLDERS.map((folder) => `':(exclude)${folder}'`).join(' ')}`,
  rewrites: [routes.rewrite('/((?!assets/).*)', '/index.html')],
  headers: [
    routes.header('/(.*)', [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), midi=(self), screen-wake-lock=(self)',
      },
      {
        key: 'Content-Security-Policy',
        value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'",
      },
    ]),
    routes.cacheControl('/assets/(.*)', { public: true, maxAge: '365days', immutable: true }),
    routes.cacheControl('/((?!assets/).*)', { public: true, maxAge: '0s', mustRevalidate: true }),
  ],
}
