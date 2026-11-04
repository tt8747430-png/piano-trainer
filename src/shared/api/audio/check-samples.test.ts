import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { KIT_PIECES } from '@/shared/lib/schedule'
import { parseManifest, type SampleManifest } from './sample-manifest'

/**
 * The recorded instruments' files (R29 SND, A27): each folder under `public/samples` holds its
 * manifest, its SOURCES.md and the files the manifest lists, nothing else, under its budget.
 */
const SAMPLES = fileURLToPath(new URL('../../../../public/samples', import.meta.url))

/** Each set's folder and the most it may weigh, in bytes. */
const BUDGETS: Readonly<Record<string, number>> = {
  piano: 15_000_000,
  'piano-light': 1_500_000,
  'bass-electric': 1_000_000,
  'bass-upright': 1_000_000,
  drums: 1_000_000,
}
/** What every set but the grand weighs together: the service worker precaches them (SND). */
const PRECACHED_BUDGET = 3_500_000

/** The licences a set may have (SND): CC0, public domain or CC BY; never SA, NC or none. */
const LICENCES = ['CC0-1.0', 'public-domain', 'CC-BY-3.0', 'CC-BY-4.0']

const folders = readdirSync(SAMPLES).filter((name) => statSync(join(SAMPLES, name)).isDirectory())
const manifestOf = (folder: string): SampleManifest => {
  const manifest = parseManifest(
    JSON.parse(readFileSync(join(SAMPLES, folder, 'manifest.json'), 'utf8')),
  )
  if (!manifest) throw new Error(`${folder}/manifest.json is not a sample manifest`)
  return manifest
}

const filesUnder = (folder: string): string[] =>
  readdirSync(folder, { recursive: true, encoding: 'utf8' })
    .map((name) => join(folder, name))
    .filter((path) => statSync(path).isFile())

/** An AAC file's channels and sample rate, read from its `mp4a` sample entry. */
function audioOf(path: string): { channels: number; rate: number } {
  const bytes = readFileSync(path)
  const at = bytes.indexOf('mp4a')
  if (at < 0) throw new Error(`${path} holds no AAC track`)
  // After the box's type: 6 reserved bytes, the data reference (2), 8 reserved, then the channels
  // (2), the sample size (2), 4 more, and the rate as 16.16 fixed point.
  const entry = at + 4
  return { channels: bytes.readUInt16BE(entry + 16), rate: bytes.readUInt16BE(entry + 24) }
}

describe('the recorded instruments’ files', () => {
  it('has every set the app plays', () => {
    expect(folders.toSorted()).toEqual(Object.keys(BUDGETS).toSorted())
  })

  it.each(folders)(
    '%s: every file is in its manifest and its manifest’s files are there',
    (folder) => {
      const manifest = manifestOf(folder)
      const listed = manifest.samples.map((sample) => sample.file).toSorted()
      const present = filesUnder(join(SAMPLES, folder))
        .map((path) => relative(join(SAMPLES, folder), path))
        .filter((name) => name !== 'manifest.json' && name !== 'SOURCES.md')
        .toSorted()
      expect(present).toEqual(listed)
      for (const sample of manifest.samples)
        expect(statSync(join(SAMPLES, folder, sample.file)).size, sample.file).toBe(sample.bytes)
    },
  )

  it.each(folders)(
    '%s: says where it came from, with a licence of CC0, public domain or CC BY',
    (folder) => {
      const manifest = manifestOf(folder)
      expect(LICENCES).toContain(manifest.licence)
      const sources = join(SAMPLES, folder, 'SOURCES.md')
      expect(existsSync(sources)).toBe(true)
      const text = readFileSync(sources, 'utf8')
      expect(text).toContain(manifest.set)
      expect(text).toMatch(/creativecommons\.org|public domain/i)
      expect(text).toContain(`scripts/samples/`)
    },
  )

  it.each(folders)('%s: every file AAC, mono, 44.1 kHz', (folder) => {
    for (const sample of manifestOf(folder).samples)
      expect(audioOf(join(SAMPLES, folder, sample.file)), sample.file).toEqual({
        channels: 1,
        rate: 44_100,
      })
  })

  it.each(folders)('%s: is under its budget', (folder) => {
    const bytes = manifestOf(folder).samples.reduce((sum, sample) => sum + sample.bytes, 0)
    expect(bytes).toBeLessThanOrEqual(BUDGETS[folder] ?? 0)
  })

  it('keeps what the service worker precaches small: every set but the grand', () => {
    const bytes = folders
      .filter((folder) => folder !== 'piano')
      .flatMap((folder) => manifestOf(folder).samples)
      .reduce((sum, sample) => sum + sample.bytes, 0)
    expect(bytes).toBeLessThanOrEqual(PRECACHED_BUDGET)
  })

  it('has the grand’s 30 roots, every minor third from A0 to C8, in four layers', () => {
    const manifest = manifestOf('piano')
    expect(manifest.layers.map((layer) => layer.name)).toEqual(['p', 'mp', 'mf', 'f'])
    const roots = Array.from({ length: 30 }, (_, index) => 21 + index * 3)
    for (const layer of ['p', 'mp', 'mf', 'f'])
      expect(
        manifest.samples
          .filter((sample) => sample.layer === layer)
          .map((sample) => sample.midi)
          .toSorted((a, b) => (a ?? 0) - (b ?? 0)),
      ).toEqual(roots)
  })

  it('has a drum stroke for every piece of the kit, accented and not', () => {
    const manifest = manifestOf('drums')
    expect(manifest.layers.map((layer) => layer.name)).toEqual(['normal', 'accent'])
    for (const layer of ['normal', 'accent'])
      expect(
        manifest.samples
          .filter((sample) => sample.layer === layer)
          .map((sample) => sample.voice)
          .toSorted(),
      ).toEqual(KIT_PIECES.toSorted())
  })
})
