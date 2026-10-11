import { routes, type VercelConfig } from '@vercel/config/v1'

// Static SPA. Hashed assets are cached forever; everything else (the app at any path, the service
// worker, the manifest, the icons) must revalidate so a deploy reaches learners. Every path falls
// back to the app (deep links) except /assets/, where a missing file is a 404 rather than the app
// under a year's cache. Every response refuses to be framed or sniffed, keeps its referrer to its
// origin, and offers only what the app uses (MIDI, the screen kept on); no script or style is
// restricted, so the two boot scripts index.html carries inline keep running.
export const config: VercelConfig = {
  framework: 'vite',
  buildCommand: 'npm run build',
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
