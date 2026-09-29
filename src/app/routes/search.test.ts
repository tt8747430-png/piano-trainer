import { createMemoryHistory } from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'
import { createAppRouter } from '../router'
import {
  CHORDS_DEFAULTS,
  CHROMATIC_DEFAULTS,
  INTERVALS_DEFAULTS,
  KEYS_DEFAULTS,
  LEARN_DEFAULTS,
  PLAYER_DEFAULTS,
  SCALES_DEFAULTS,
  SONGS_DEFAULTS,
  TENSIONS_DEFAULTS,
  WALK_DEFAULTS,
} from './search'

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
    expect(await searchAt('/play/walk')).toEqual(WALK_DEFAULTS)
    expect(await searchAt('/play/chromatic')).toEqual(CHROMATIC_DEFAULTS)
    expect(await searchAt('/learn/keys')).toEqual(KEYS_DEFAULTS)
    expect(await searchAt('/learn/intervals')).toEqual(INTERVALS_DEFAULTS)
    expect(await searchAt('/learn/tensions')).toEqual(TENSIONS_DEFAULTS)
    expect(await searchAt('/learn')).toEqual(LEARN_DEFAULTS)
  })

  it('keep what is valid', async () => {
    expect(
      await searchAt(
        '/learn/chords?root=Bb&triad=min&size=9&seventh=major&inversion=2&hands=both&step=chords:sev',
      ),
    ).toEqual({
      root: 'Bb',
      triad: 'min',
      size: 9,
      seventh: 'major',
      added: 'none',
      alter: '',
      inversion: 2,
      hands: 'both',
      step: 'chords:sev',
    })
    expect(await searchAt('/learn/chords?size=13&alter=b9s11')).toMatchObject({
      size: 13,
      alter: 'b9s11',
    })
    expect(await searchAt('/learn/chords?triad=min&added=add9')).toMatchObject({
      triad: 'min',
      added: 'add9',
    })
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
    expect(
      await searchAt(
        '/learn/chords?triad=maj13&size=6&seventh=7&added=6&alter=x&inversion=7&step=scale:major',
      ),
    ).toEqual(CHORDS_DEFAULTS)
    expect(await searchAt('/learn/chords?quality=m7')).toMatchObject(CHORDS_DEFAULTS)
    expect(await searchAt('/learn/chords?inversion=3')).toMatchObject({ inversion: 0 })
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

  it('read the Chords view’s size, inversion and walk, an inversion kept within the size', async () => {
    expect(
      await searchAt('/learn/scales?show=chords&chords=6&inversion=2&arpeggio=true'),
    ).toMatchObject({ chords: 6, inversion: 2, arpeggio: true })
    expect(await searchAt('/learn/scales?chords=3&inversion=3')).toMatchObject({ inversion: 0 })
    expect(await searchAt('/learn/scales?kind=blues&chords=6')).toMatchObject({ chords: 3 })
  })

  it('fit a chord’s parts to one another', async () => {
    expect(await searchAt('/learn/chords?triad=sus2&size=13&alter=b9')).toMatchObject({
      size: 7,
      alter: '',
    })
    expect(await searchAt('/learn/chords?size=7&added=six&alter=b5s11')).toMatchObject({
      added: 'none',
      alter: 'b5',
    })
  })

  it('read the walk’s scale and the Player’s params, a stale one dropped', async () => {
    expect(
      await searchAt('/play/walk?root=A%23&kind=locrian&chordSize=ninths&pattern=pop8&mode=wait'),
    ).toMatchObject({
      root: 'A#',
      kind: 'locrian',
      chordSize: 'ninths',
      pattern: 'pop8',
      mode: 'wait',
    })
    expect(await searchAt('/play/walk?root=H&chordSize=elevenths')).toEqual(WALK_DEFAULTS)
  })

  it('read the chromatic walk’s chords in the table’s order, its root as its first chord spells it', async () => {
    expect(
      await searchAt('/play/chromatic?chords=n9.m9.xx&root=Ab&direction=both&pattern=pop8'),
    ).toMatchObject({ chords: 'm9.n9', root: 'G#', direction: 'both', pattern: 'pop8' })
    expect(await searchAt('/play/chromatic?chords=xx&root=H&direction=sideways')).toEqual(
      CHROMATIC_DEFAULTS,
    )
    expect(await searchAt('/play/chromatic?chords=')).toEqual(CHROMATIC_DEFAULTS)
  })

  it('read a Keys key as the circle spells it, and its chords within their inversions', async () => {
    expect(await searchAt('/learn/keys?key=Bb&chords=4&inversion=3')).toEqual({
      key: 'Bb',
      chords: 4,
      inversion: 3,
    })
    expect(await searchAt('/learn/keys?key=D%23m')).toMatchObject({ key: 'Ebm' })
    expect(await searchAt('/learn/keys?key=H&chords=5&inversion=3')).toEqual(KEYS_DEFAULTS)
  })

  it('spell a root the way its explorer names it', async () => {
    expect(await searchAt('/learn/chords?root=A%23')).toMatchObject({ root: 'Bb' })
    expect(await searchAt('/learn/chords?root=Db&triad=min')).toMatchObject({ root: 'C#' })
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

  it('respell an interval’s root as the reference spells it', async () => {
    expect(await searchAt('/learn/intervals?root=C%23')).toEqual({ root: 'Db' })
    expect(await searchAt('/learn/intervals?root=H')).toEqual(INTERVALS_DEFAULTS)
  })

  it('respell a tension chord’s root by the chord, and fall back from an unknown chord', async () => {
    expect(await searchAt('/learn/tensions?chord=m7&root=Db')).toEqual({ chord: 'm7', root: 'C#' })
    expect(await searchAt('/learn/tensions?chord=maj7&root=C%23')).toEqual({
      chord: 'maj7',
      root: 'Db',
    })
    expect(await searchAt('/learn/tensions?chord=n9')).toEqual(TENSIONS_DEFAULTS)
  })

  it('keep a lesson filter’s level and category, and drop what no lesson has', async () => {
    expect(await searchAt('/learn?level=2&category=scales')).toEqual({
      level: 2,
      category: 'scales',
    })
    expect(await searchAt('/learn?level=9&category=cooking')).toEqual(LEARN_DEFAULTS)
  })
})
