import { routes, type VercelConfig } from '@vercel/config/v1'

// Static SPA. Hashed assets are cached forever; everything else (the app at any path, the service
// worker, the manifest, the icons) must revalidate so a deploy reaches learners. Every path falls
// back to the app (deep links) except /assets/, where a missing file is a 404 rather than the app
// under a year's cache.
export const config: VercelConfig = {
  framework: 'vite',
  buildCommand: 'npm run build',
  rewrites: [routes.rewrite('/((?!assets/).*)', '/index.html')],
  headers: [
    routes.cacheControl('/assets/(.*)', { public: true, maxAge: '365days', immutable: true }),
    routes.cacheControl('/((?!assets/).*)', { public: true, maxAge: '0s', mustRevalidate: true }),
  ],
}
