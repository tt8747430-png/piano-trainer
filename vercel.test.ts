import { describe, expect, it } from 'vitest'
import { config } from './vercel'

// Vercel's build reads the `config` export (`default`, else `config`). Our sources use only
// path-to-regexp's regular-expression groups, so they read the same as a RegExp over the path.
const matches = (source: string, path: string) => new RegExp(`^${source}$`).test(path)

const servesTheApp = (path: string) =>
  (config.rewrites ?? []).some(
    (rule) => rule.destination === '/index.html' && matches(rule.source, path),
  )

const cacheControlFor = (path: string) =>
  (config.headers ?? [])
    .filter((rule) => matches(rule.source, path))
    .flatMap((rule) => rule.headers)
    .find((header) => header.key === 'Cache-Control')?.value

describe('the Vercel config', () => {
  it.each(['/', '/theory/scales', '/songs/bz5', '/play/bz5'])(
    'answers a deep link to %s with the app, so a reload keeps the screen',
    (path) => {
      expect(servesTheApp(path)).toBe(true)
    },
  )

  it('lets a missing hashed asset be a 404 rather than the app under a year-long cache', () => {
    expect(servesTheApp('/assets/index-3f9a1c.js')).toBe(false)
  })

  it('caches hashed assets for a year', () => {
    expect(cacheControlFor('/assets/index-3f9a1c.js')).toBe('public, max-age=31536000, immutable')
  })

  it.each(['/index.html', '/sw.js', '/manifest.webmanifest'])(
    'makes %s revalidate, so a deploy reaches learners',
    (path) => {
      expect(cacheControlFor(path)).toBe('public, max-age=0, must-revalidate')
    },
  )
})
