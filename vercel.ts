import { routes, type VercelConfig } from '@vercel/config/v1'

// Static SPA. Hashed assets are cached forever; the shell, the service worker and the manifest
// must revalidate so a deploy reaches learners. Every other path falls back to the app (deep links).
export const config: VercelConfig = {
  framework: 'vite',
  buildCommand: 'npm run build',
  rewrites: [routes.rewrite('/(.*)', '/index.html')],
  headers: [
    routes.cacheControl('/assets/(.*)', { public: true, maxAge: '365days', immutable: true }),
    routes.cacheControl('/index.html', { public: true, maxAge: '0s', mustRevalidate: true }),
    routes.cacheControl('/sw.js', { public: true, maxAge: '0s', mustRevalidate: true }),
    routes.cacheControl('/manifest.webmanifest', {
      public: true,
      maxAge: '0s',
      mustRevalidate: true,
    }),
  ],
}
