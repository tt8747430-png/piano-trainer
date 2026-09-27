import { createMemoryHistory } from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'
import { createAppRouter } from '../router'
import { CHORDS_DEFAULTS, PLAYER_DEFAULTS, SCALES_DEFAULTS, SONGS_DEFAULTS } from './search'

/** What a route reads from a URL, however it was typed, kept or edited. */
async function searchAt(url: string) {
  const router = createAppRouter(createMemoryHistory({ initialEntries: [url] }))
  await router.load()
  return router.state.matches.at(-1)?.search
}

describe('search params', () => {
  it('fill every default for an empty URL', async () => {
    expect(await searchAt('/songs')).toEqual(SONGS_DEFAULTS)
    expect(await searchAt('/learn/chords')).toEqual(CHORDS_DEFAULTS)
    expect(await searchAt('/learn/scales')).toEqual(SCALES_DEFAULTS)
    expect(await searchAt('/play/bz5')).toEqual(PLAYER_DEFAULTS)
  })

  it('keep what is valid', async () => {
    expect(
      await searchAt('/learn/chords?root=Bb&quality=m7&inversion=2&hands=both&step=chords:sev'),
    ).toEqual({ root: 'Bb', quality: 'm7', inversion: 2, hands: 'both', step: 'chords:sev' })
    expect(
      await searchAt(
        '/play/bz5?key=A&tempo=96&hands=lh&mode=wait&speedTraining=true&swing=true&loop=2-3&pattern=chart&rh=t1&lh=o&chordSize=ninths',
      ),
    ).toEqual({
      key: 'A',
      tempo: 96,
      hands: 'lh',
      mode: 'wait',
      speedTraining: true,
      swing: true,
      loop: '2-3',
      pattern: 'chart',
      rh: 't1',
      lh: 'o',
      chordSize: 'ninths',
    })
    expect(await searchAt('/songs?q=душа&collection=hymns&level=1')).toEqual({
      q: 'душа',
      collection: 'hymns',
      level: 1,
    })
    expect(await searchAt('/learn/scales?root=Eb&kind=harmonic&chords=4')).toMatchObject({
      root: 'Eb',
      kind: 'harmonic',
      chords: 4,
    })
    expect(await searchAt('/check?of=scale:blues')).toEqual({ of: 'scale:blues' })
  })

  it('drop anything stale or hand-edited back to its default, without clamping', async () => {
    expect(
      await searchAt(
        '/play/bz5?key=H&tempo=999&mode=dance&pattern=waltz&rh=zz&chordSize=elevenths',
      ),
    ).toEqual(PLAYER_DEFAULTS)
    expect(await searchAt('/play/bz5?mode=step&loop=6-3&swing=yes&tempo=10')).toEqual(
      PLAYER_DEFAULTS,
    )
    expect(await searchAt('/play/bz5?loop=x&speedTraining=1')).toEqual(PLAYER_DEFAULTS)
    expect(await searchAt('/learn/chords?quality=maj13&inversion=7&step=scale:major')).toEqual(
      CHORDS_DEFAULTS,
    )
    expect(await searchAt('/learn/chords?quality=maj&inversion=3')).toMatchObject({
      inversion: 0,
    })
    expect(await searchAt('/learn/scales?kind=ionian&tempo=10&chords=9&step=chords:tri')).toEqual(
      SCALES_DEFAULTS,
    )
    expect(await searchAt('/songs?collection=psalms&level=9')).toEqual(SONGS_DEFAULTS)
    expect(await searchAt('/songs?collection=studies')).toEqual(SONGS_DEFAULTS)
  })

  it('read the Scales fingers, none by default, and ignore an old link’s view', async () => {
    expect(SCALES_DEFAULTS.fingers).toBe('none')
    expect(await searchAt('/learn/scales?fingers=rh')).toMatchObject({ fingers: 'rh' })
    expect(await searchAt('/learn/scales?fingers=x')).toMatchObject({ fingers: 'none' })
    expect(await searchAt('/learn/scales?view=rh')).toMatchObject({ fingers: 'none' })
  })

  it('read the Scales start and a chosen fingering, dropping one the run cannot take or takes itself', async () => {
    expect(await searchAt('/learn/scales?start=3&fingering=scale')).toMatchObject({
      start: 3,
      fingering: 'scale',
    })
    expect(await searchAt('/learn/scales?start=9')).toMatchObject({ start: 1 })
    expect(await searchAt('/learn/scales?fingering=scale')).toMatchObject({ fingering: undefined })
    expect(await searchAt('/learn/scales?kind=blues&start=3&fingering=scale')).toMatchObject({
      fingering: undefined,
    })
  })

  it('spell a root the way its explorer names it', async () => {
    expect(await searchAt('/learn/chords?root=A%23&quality=maj')).toMatchObject({ root: 'Bb' })
    expect(await searchAt('/play/bz5?key=B♭')).toMatchObject({ key: 'Bb' })
  })

  it('read the Scales view, falling back to the scale view where a scale has no chords', async () => {
    expect(SCALES_DEFAULTS).toMatchObject({ show: 'scale', keysPlay: 'chords' })
    expect(await searchAt('/learn/scales?show=chords&keysPlay=notes')).toMatchObject({
      show: 'chords',
      keysPlay: 'notes',
    })
    expect(await searchAt('/learn/scales?kind=blues&show=chords')).toMatchObject({ show: 'scale' })
    expect(await searchAt('/learn/scales?show=x&keysPlay=x')).toMatchObject({
      show: 'scale',
      keysPlay: 'chords',
    })
  })
})
