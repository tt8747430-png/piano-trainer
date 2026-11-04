// What every sample script shares (R29 SND): ffmpeg to AAC-LC in .m4a, mono, 44.1 kHz, each file cut to
// its length with a 60 ms fade, one gain for the whole set so its loudest file peaks at -1 dBFS and its
// layers keep their dynamics; then the manifest. The source WAV/FLAC files are never committed.
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const SAMPLES = fileURLToPath(new URL('../../public/samples/', import.meta.url))

/** The source folder named on the command line, or the usage and out. */
export function sourceArgument(usage) {
  const source = process.argv[2]
  if (!source) {
    console.error(`usage: ${usage}`)
    process.exit(1)
  }
  return source
}

const FADE = 0.06

/** A file's length in seconds. */
export function duration(path) {
  return Number(
    execFileSync('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'csv=p=0',
      path,
    ])
      .toString()
      .trim(),
  )
}

/**
 * The filter that mixes `inputs` (each `{ path, weight }`) into one mono signal, tuned by `rate` (a
 * playback rate; 1 is as recorded), cut to `seconds` with a fade, raised by `gainDb`.
 */
function graph(inputs, { seconds, rate = 1, gainDb = 0 }) {
  const length = Math.min(seconds, Math.min(...inputs.map((input) => duration(input.path))) / rate)
  const mix =
    inputs.length === 1
      ? '[0:a]aformat=channel_layouts=mono'
      : `${inputs.map((_, index) => `[${index}:a]`).join('')}amix=inputs=${inputs.length}:weights=${inputs
          .map((input) => input.weight)
          .join(' ')}:normalize=0,aformat=channel_layouts=mono`
  const tuned = rate === 1 ? '' : `,asetrate=44100*${rate},aresample=44100`
  return `${mix},aresample=44100${tuned},atrim=0:${length},afade=t=out:st=${Math.max(0, length - FADE)}:d=${FADE},volume=${gainDb}dB`
}

const inputArgs = (inputs) => inputs.flatMap((input) => ['-i', input.path])

/** The peak of `inputs` mixed, in dBFS (ffmpeg's volumedetect). */
export function peakOf(inputs, options) {
  const report = execFileSync(
    'sh',
    [
      '-c',
      'ffmpeg -hide_banner -nostats "$@" 2>&1 >/dev/null',
      'peak',
      ...inputArgs(inputs),
      '-filter_complex',
      `${graph(inputs, options)},volumedetect`,
      '-f',
      'null',
      '-',
    ],
    { encoding: 'utf8' },
  )
  const found = /max_volume: (-?[\d.]+) dB/.exec(report)
  if (!found) throw new Error(`no peak for ${inputs.map((input) => input.path).join(', ')}`)
  return Number(found[1])
}

/** Encodes `inputs` mixed into `output`: AAC-LC, mono, 44.1 kHz at `bitrate`. */
export function encode(inputs, output, { bitrate, ...options }) {
  mkdirSync(dirname(output), { recursive: true })
  execFileSync(
    'ffmpeg',
    [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      ...inputArgs(inputs),
      '-filter_complex',
      graph(inputs, options),
      '-ac',
      '1',
      '-ar',
      '44100',
      '-c:a',
      'aac',
      '-b:a',
      bitrate,
      '-movflags',
      '+faststart',
      '-map_metadata',
      '-1',
      output,
    ],
    { stdio: 'inherit' },
  )
  return statSync(output).size
}

/**
 * Makes a set: clears `public/samples/<folder>/`, measures every entry's peak, encodes each at one
 * gain (the loudest at -1 dBFS) and writes the manifest. Each entry is `{ file, inputs, seconds,
 * rate?, midi? | voice?, layer, tune? }`.
 */
export function makeSet(folder, { instrument, set, licence, layers, bitrate, entries }) {
  const dir = join(SAMPLES, folder)
  rmSync(dir, { recursive: true, force: true })
  const loudest = Math.max(...entries.map((entry) => peakOf(entry.inputs, entry)))
  const gainDb = -1 - loudest
  const samples = entries.map((entry) => {
    const bytes = encode(entry.inputs, join(dir, entry.file), { ...entry, bitrate, gainDb })
    const { file, midi, voice, layer, tune } = entry
    return {
      file,
      ...(midi === undefined ? {} : { midi }),
      ...(voice === undefined ? {} : { voice }),
      layer,
      bytes,
      ...(tune ? { tune } : {}),
    }
  })
  writeFileSync(
    join(dir, 'manifest.json'),
    `${JSON.stringify({ instrument, set, licence, layers, samples }, null, 2)}\n`,
  )
  const total = samples.reduce((sum, sample) => sum + sample.bytes, 0)
  console.log(
    `${folder}: ${samples.length} files, ${(total / 1e6).toFixed(2)} MB, gain ${gainDb.toFixed(1)} dB`,
  )
  return dir
}

/** A key's name in a file name: C4, Fs3 (a sharp as `s`). */
export function keyName(midi) {
  const names = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B']
  return `${names[midi % 12]}${Math.floor(midi / 12) - 1}`
}

/**
 * An SFZ map's regions, each with its opcodes and those of the `<global>`, `<master>` and `<group>`
 * over it; `sample` paths with `/` and led by the map's `default_path`.
 */
export function sfzRegions(text) {
  const regions = []
  const scopes = { global: {}, master: {}, group: {} }
  let current = null
  const clean = text.replace(/\/\/.*$/gm, '')
  for (const token of clean.split(/(<\w+>)/)) {
    const header = /^<(\w+)>$/.exec(token)
    if (header) {
      const kind = header[1]
      if (kind === 'region') {
        current = { ...scopes.global, ...scopes.master, ...scopes.group }
        regions.push(current)
      } else if (kind in scopes) {
        if (kind === 'global') Object.assign(scopes, { master: {}, group: {} })
        if (kind === 'master') scopes.group = {}
        scopes[kind] = {}
        current = scopes[kind]
      } else current = {}
      continue
    }
    if (!current) continue
    // A sample's path may hold spaces: it runs to the next opcode.
    for (const found of token.matchAll(/(\w+)=(.*?)(?=\s+\w+=|\s*$)/gs))
      current[found[1]] = found[2].trim()
  }
  return regions.map((region) => ({
    ...region,
    sample: `${region.default_path ?? ''}${region.sample ?? ''}`.replaceAll('\\', '/'),
  }))
}
