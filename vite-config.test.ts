import { matchesGlob } from 'node:path'
import { describe, expect, it } from 'vitest'
import { workbox } from './vite.config'

const precached = (path: string) =>
  workbox.globPatterns.some((pattern) => matchesGlob(path, pattern)) &&
  !workbox.globIgnores.some((pattern) => matchesGlob(path, pattern))

const routeFor = (path: string) =>
  workbox.runtimeCaching.find((route) => route.urlPattern.test(`https://piano.example${path}`))

describe('the service worker’s caches (A27, R29 SND)', () => {
  it('precaches no grand piano sample, and every other set: the app plays offline from its first visit', () => {
    expect(precached('samples/piano/mf/C4.m4a')).toBe(false)
    expect(precached('samples/piano-light/C4.m4a')).toBe(true)
    expect(precached('samples/bass-electric/f/E1.m4a')).toBe(true)
    expect(precached('samples/bass-upright/p/A1.m4a')).toBe(true)
    expect(precached('samples/drums/accent/kick.m4a')).toBe(true)
  })

  it('serves the grand’s samples cache-first from their own cache, range requests too', () => {
    const route = routeFor('/samples/piano/mf/C4.m4a')
    expect(route?.handler).toBe('CacheFirst')
    expect(route?.options).toMatchObject({
      cacheName: 'samples-piano',
      cacheableResponse: { statuses: [200] },
      rangeRequests: true,
    })
    expect(route?.options).not.toHaveProperty('expiration')
    expect(routeFor('/samples/piano-light/C4.m4a')).toBeUndefined()
  })

  it('keeps every set’s manifest for offline, fresh when online', () => {
    for (const set of ['piano', 'piano-light', 'drums']) {
      const route = routeFor(`/samples/${set}/manifest.json`)
      expect(route?.handler).toBe('StaleWhileRevalidate')
      expect(route?.options).toMatchObject({ cacheName: 'samples-manifests' })
    }
  })
})
