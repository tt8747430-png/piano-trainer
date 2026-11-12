import { describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import { config, IGNORED_FOLDERS } from './vercel'

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
  it.each(['/', '/learn/scales', '/songs/bz5', '/play/bz5'])(
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

  it.each(['/', '/learn/scales', '/index.html', '/sw.js', '/manifest.webmanifest', '/favicon.svg'])(
    'makes %s revalidate, so a deploy reaches learners',
    (path) => {
      expect(cacheControlFor(path)).toBe('public, max-age=0, must-revalidate')
    },
  )

  it.each(['/', '/play/bz5', '/assets/index-3f9a1c.js'])(
    'answers %s refusing to be framed or sniffed, and offering only MIDI and the screen kept on',
    (path) => {
      const headers = (config.headers ?? [])
        .filter((rule) => matches(rule.source, path))
        .flatMap((rule) => rule.headers)
      const value = (key: string) => headers.find((header) => header.key === key)?.value
      expect(value('X-Content-Type-Options')).toBe('nosniff')
      expect(value('Content-Security-Policy')).toContain("frame-ancestors 'none'")
      expect(value('Permissions-Policy')).toContain('midi=(self)')
      expect(value('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
    },
  )

  it('skips the build when a push changes only piano-data, and builds when anything else changes', () => {
    const command = config.ignoreCommand ?? ''
    expect(command).toContain('VERCEL_GIT_PREVIOUS_SHA')
    for (const folder of IGNORED_FOLDERS) expect(command).toContain(`':(exclude)${folder}'`)
    // The command as Vercel's shell runs it, between two trees: exit 0 skips the build.
    const runs = (changed: string) =>
      (() => {
        try {
          execFileSync('bash', [
            '-c',
            `set -e
            dir=$(mktemp -d) && cd "$dir" && git init -q && git config user.email t@t && git config user.name t
            mkdir -p piano-data src && echo a > piano-data/a && echo a > src/a && git add . && git commit -qm one
            echo b > ${changed} && git add . && git commit -qm two
            export VERCEL_GIT_PREVIOUS_SHA=$(git rev-parse HEAD^)
            ${command}`,
          ])
          return 'skipped'
        } catch {
          return 'built'
        }
      })()
    expect(runs('piano-data/a')).toBe('skipped')
    expect(runs('src/a')).toBe('built')
  })
})
