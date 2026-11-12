import { routes, type VercelConfig } from '@vercel/config/v1'

// Static SPA. Hashed assets are cached forever; everything else (the app at any path, the service
// worker, the manifest, the icons) must revalidate so a deploy reaches learners. Every path falls
// back to the app (deep links) except /assets/, where a missing file is a 404 rather than the app
// under a year's cache. Every response refuses to be framed or sniffed, keeps its referrer to its
// origin, and offers only what the app uses (MIDI, the screen kept on); no script or style is
// restricted, so the two boot scripts index.html carries inline keep running.
//
// The build reads only `src`, `public`, `e2e`, `index.html`, the root configs and the package files.
// Everything else is the work around the app: source material, design canvases and drawings, agent
// skills, docs, scripts, the backend's migrations. `.vercelignore` lists these same paths, so a
// deployment leaves them out; and a push that changes nothing but these builds nothing (the
// command exits 0 when nothing else changed since the last deployment). Without a previous
// deployment, or one outside the shallow clone, `git diff` fails and the build goes ahead.
export const NOT_DEPLOYED = [
  // Source material and design work
  'piano-data',
  '.scratch',
  'r10',
  '.impeccable',
  'DESIGN.md',
  'PRODUCT.md',
  // Agents, their skills and prompts
  '.claude',
  '.agents',
  '.codex',
  'prompts',
  'skills-lock.json',
  '.mcp.json',
  'CLAUDE.md',
  // Docs, scripts, the backend and the tools around the code
  'docs',
  'scripts',
  'supabase',
  '.github',
  'README.md',
  'renovate.json',
  'components.json',
  'eslint.config.js',
  '.prettierrc.json',
  '.prettierignore',
  '.env.example',
] as const

export const config: VercelConfig = {
  framework: 'vite',
  buildCommand: 'npm run build',
  ignoreCommand: `git diff --quiet "\${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}" HEAD -- . ${NOT_DEPLOYED.map((path) => `':(exclude)${path}'`).join(' ')}`,
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
