import { createMemoryHistory } from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'
import { testContext } from '@/app/testing/test-context'
import { createAppRouter } from '../router'
import {
  CHORDS_DEFAULTS,
  INTERVALS_DEFAULTS,
  PROGRESSIONS_DEFAULTS,
  SCALES_DEFAULTS,
  TENSIONS_DEFAULTS,
} from './explorer-search'
import { CHROMATIC_DEFAULTS, EDIT_DEFAULTS, PLAYER_DEFAULTS, WALK_DEFAULTS } from './player-search'
import { PRACTICE_DEFAULTS } from './practice-search'
import { SONGS_DEFAULTS } from './songs-search'

/** What a route reads from a URL, however it was typed, kept or edited. */
async function searchAt(url: string) {
  const router = createAppRouter({
    history: createMemoryHistory({ initialEntries: [url] }),
    ...testContext(),
  })
  await router.load()
  return router.state.matches.at(-1)?.search
}

describe('search params', () => {
  it('fill every default for an empty URL', async () => {
    expect(await searchAt('/songs')).toEqual(SONGS_DEFAULTS)
    expect(await searchAt('/practice/chords')).toEqual(CHORDS_DEFAULTS)
    expect(await searchAt('/practice/scales')).toEqual(SCALES_DEFAULTS)
    expect(await searchAt('/play/bz5')).toEqual(PLAYER_DEFAULTS)
    expect(await searchAt('/play/walk')).toEqual(WALK_DEFAULTS)
    expect(await searchAt('/play/chromatic')).toEqual(CHROMATIC_DEFAULTS)
    expect(await searchAt('/practice/intervals')).toEqual(INTERVALS_DEFAULTS)
    expect(await searchAt('/practice/tensions')).toEqual(TENSIONS_DEFAULTS)
    expect(await searchAt('/practice')).toEqual(PRACTICE_DEFAULTS)
    expect(await searchAt('/practice/progressions')).toEqual(PROGRESSIONS_DEFAULTS)
    expect(await searchAt('/edit/bz5')).toEqual(EDIT_DEFAULTS)
  })

  it('open the score editor’s takes only when the URL says so', async () => {
    expect(await searchAt('/edit/bz5?record=true')).toEqual({ record: true })
    expect(await searchAt('/edit/bz5?record=yes')).toEqual({ record: false })
  })

  it('keep what is valid', async () => {
    expect(
      await searchAt(
        '/practice/chords?root=Bb&triad=min&size=9&seventh=major&inversion=2&hands=both&step=chords:sev',
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
    expect(await searchAt('/practice/chords?size=13&alter=b9s11')).toMatchObject({
      size: 13,
      alter: 'b9s11',
    })
    expect(await searchAt('/practice/chords?triad=min&added=add9')).toMatchObject({
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
    expect(await searchAt('/songs?q=душа&collection=hymns')).toEqual({
      q: 'душа',
      collection: 'hymns',
    })
    expect(await searchAt('/practice/scales?root=Eb&kind=harmonic&chords=4')).toMatchObject({
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
        '/practice/chords?triad=maj13&size=6&seventh=7&added=6&alter=x&inversion=7&step=scale:major',
      ),
    ).toEqual(CHORDS_DEFAULTS)
    expect(await searchAt('/practice/chords?quality=m7')).toMatchObject(CHORDS_DEFAULTS)
    expect(await searchAt('/practice/chords?inversion=3')).toMatchObject({ inversion: 0 })
    expect(
      await searchAt('/practice/scales?kind=ionian&tempo=10&chords=9&step=chords:tri'),
    ).toEqual(SCALES_DEFAULTS)
    expect(await searchAt('/songs?collection=psalms')).toEqual(SONGS_DEFAULTS)
    expect(await searchAt('/songs?collection=studies')).toEqual(SONGS_DEFAULTS)
  })

  it('read the Scales fingers, none by default, and ignore an old link’s view', async () => {
    expect(SCALES_DEFAULTS.fingers).toBe('none')
    expect(await searchAt('/practice/scales?fingers=rh')).toMatchObject({ fingers: 'rh' })
    expect(await searchAt('/practice/scales?fingers=x')).toMatchObject({ fingers: 'none' })
    expect(await searchAt('/practice/scales?view=rh')).toMatchObject({ fingers: 'none' })
  })

  it('read the Scales start and a chosen fingering, dropping one the run cannot take or takes itself', async () => {
    expect(await searchAt('/practice/scales?start=3&fingering=scale')).toMatchObject({
      start: 3,
      fingering: 'scale',
    })
    expect(await searchAt('/practice/scales?start=9')).toMatchObject({ start: 1 })
    expect(await searchAt('/practice/scales?fingering=scale')).toMatchObject({
      fingering: undefined,
    })
    expect(await searchAt('/practice/scales?kind=blues&start=3&fingering=scale')).toMatchObject({
      fingering: undefined,
    })
  })

  it('read the Chords view’s size, inversion and walk, an inversion kept within the size', async () => {
    expect(
      await searchAt('/practice/scales?show=chords&chords=6&inversion=2&arpeggio=true'),
    ).toMatchObject({ chords: 6, inversion: 2, arpeggio: true })
    expect(await searchAt('/practice/scales?chords=3&inversion=3')).toMatchObject({ inversion: 0 })
    expect(await searchAt('/practice/scales?kind=blues&chords=6')).toMatchObject({ chords: 3 })
  })

  it('fit a chord’s parts to one another', async () => {
    expect(await searchAt('/practice/chords?triad=sus2&size=13&alter=b9')).toMatchObject({
      size: 7,
      alter: '',
    })
    expect(await searchAt('/practice/chords?size=7&added=six&alter=b5s11')).toMatchObject({
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

  it('read a scale’s Key view only where the scale is a key’s, and Chords only with seven notes', async () => {
    expect(await searchAt('/practice/scales?show=key')).toMatchObject({ show: 'key' })
    expect(await searchAt('/practice/scales?kind=harmonic&show=key')).toMatchObject({ show: 'key' })
    expect(await searchAt('/practice/scales?kind=dorian&show=key')).toMatchObject({ show: 'scale' })
    expect(await searchAt('/practice/scales?kind=dorian&show=chords')).toMatchObject({
      show: 'chords',
    })
    expect(await searchAt('/practice/scales?kind=pent&show=chords')).toMatchObject({
      show: 'scale',
    })
  })

  it('read Practice’s topic, an unknown one as the first', async () => {
    expect(await searchAt('/practice?topic=technique')).toEqual({ topic: 'technique' })
    expect(await searchAt('/practice?topic=cooking')).toEqual(PRACTICE_DEFAULTS)
  })

  it('spell a root the way its explorer names it', async () => {
    expect(await searchAt('/practice/chords?root=A%23')).toMatchObject({ root: 'Bb' })
    expect(await searchAt('/practice/chords?root=Db&triad=min')).toMatchObject({ root: 'C#' })
    expect(await searchAt('/play/bz5?key=B♭')).toMatchObject({ key: 'Bb' })
  })

  it('read the Scales view, falling back to the scale view where a scale has no chords', async () => {
    expect(SCALES_DEFAULTS).toMatchObject({ show: 'scale', keysPlay: 'chords' })
    expect(await searchAt('/practice/scales?show=chords&keysPlay=notes')).toMatchObject({
      show: 'chords',
      keysPlay: 'notes',
    })
    expect(await searchAt('/practice/scales?kind=blues&show=chords')).toMatchObject({
      show: 'scale',
    })
    expect(await searchAt('/practice/scales?show=x&keysPlay=x')).toMatchObject({
      show: 'scale',
      keysPlay: 'chords',
    })
  })

  it('respell an interval’s root as the reference spells it', async () => {
    expect(await searchAt('/practice/intervals?root=C%23')).toEqual({ root: 'Db' })
    expect(await searchAt('/practice/intervals?root=H')).toEqual(INTERVALS_DEFAULTS)
  })

  it('respell a tension chord’s root by the chord, and fall back from an unknown chord', async () => {
    expect(await searchAt('/practice/tensions?chord=m7&root=Db')).toEqual({
      chord: 'm7',
      root: 'C#',
    })
    expect(await searchAt('/practice/tensions?chord=maj7&root=C%23')).toEqual({
      chord: 'maj7',
      root: 'Db',
    })
    expect(await searchAt('/practice/tensions?chord=n9')).toEqual(TENSIONS_DEFAULTS)
  })

  it('keep a number typed as a search, which the router reads as a number', async () => {
    expect(await searchAt('/songs?q=1999')).toMatchObject({ q: '1999' })
  })

  it('write a progression’s numerals one way, and take the default for a line that cannot be read', async () => {
    expect(
      await searchAt('/practice/progressions?p=ii7%20V7%20IMaj7&key=Am&size=sevenths'),
    ).toEqual({
      p: 'ii7-V7-IMaj7',
      key: 'Am',
      size: 'sevenths',
    })
    expect(await searchAt('/practice/progressions?p=Q')).toEqual(PROGRESSIONS_DEFAULTS)
  })
})
