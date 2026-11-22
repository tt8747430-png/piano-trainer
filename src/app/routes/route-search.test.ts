// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { testRouter } from '@/app/testing/test-context'
import { keyParam, note } from '@/shared/lib/music'
import {
  CHORDS_DEFAULTS,
  INTERVALS_DEFAULTS,
  PROGRESSIONS_DEFAULTS,
  SCALES_DEFAULTS,
} from './explorer-search'
import { CHROMATIC_DEFAULTS, EDIT_DEFAULTS, PLAYER_DEFAULTS, WALK_DEFAULTS } from './player-search'
import { CHORD_FINDER_DEFAULTS } from './tool-search'
import { FOLDER_DEFAULTS, SONGS_HOME_DEFAULTS } from './songs-search'

/** What a route reads from a URL, however it was typed, kept or edited. */
async function searchAt(url: string) {
  const router = testRouter(url)
  await router.load()
  return router.state.matches.at(-1)?.search
}

describe('search params', () => {
  it('fill every default for an empty URL', async () => {
    expect(await searchAt('/songs')).toEqual(SONGS_HOME_DEFAULTS)
    expect(await searchAt('/practice/chords')).toEqual(CHORDS_DEFAULTS)
    expect(await searchAt('/practice/scales')).toEqual(SCALES_DEFAULTS)
    expect(await searchAt('/play/bz5')).toEqual(PLAYER_DEFAULTS)
    expect(await searchAt('/play/walk')).toEqual(WALK_DEFAULTS)
    expect(await searchAt('/play/chromatic')).toEqual(CHROMATIC_DEFAULTS)
    expect(await searchAt('/practice/intervals')).toEqual(INTERVALS_DEFAULTS)
    expect(await searchAt('/practice/progressions/line')).toEqual(PROGRESSIONS_DEFAULTS)
    expect(await searchAt('/edit/bz5')).toEqual(EDIT_DEFAULTS)
    expect(await searchAt('/practice/chord-finder')).toEqual(CHORD_FINDER_DEFAULTS)
  })

  it('read the Chord finder’s keys lowest first, each once, and its key', async () => {
    expect(await searchAt('/practice/chord-finder?keys=67-60-64-60&key=D')).toEqual({
      keys: '60-64-67',
      key: 'D',
    })
    expect(await searchAt('/practice/chord-finder?keys=x-500&key=H')).toEqual(CHORD_FINDER_DEFAULTS)
  })

  it('open the score editor’s takes, or press its Record as it opens, only when the URL says so', async () => {
    expect(await searchAt('/edit/bz5?takes=true')).toEqual({ ...EDIT_DEFAULTS, takes: true })
    expect(await searchAt('/edit/bz5?record=true')).toEqual({ ...EDIT_DEFAULTS, record: true })
    expect(await searchAt('/edit/bz5?takes=yes&record=1')).toEqual(EDIT_DEFAULTS)
  })

  it('play a piece’s version only where the URL names one, and nothing a walk plays (R29 B8)', async () => {
    expect(PLAYER_DEFAULTS).toMatchObject({ version: 'original' })
    for (const version of ['simple', 'easy'] as const)
      expect(await searchAt(`/play/bz5?version=${version}`)).toEqual({
        ...PLAYER_DEFAULTS,
        version,
      })
    for (const stale of ['yes', '1', 'true'])
      expect(await searchAt(`/play/bz5?version=${stale}`)).toEqual(PLAYER_DEFAULTS)
    expect(WALK_DEFAULTS).not.toHaveProperty('version')
    expect(CHROMATIC_DEFAULTS).not.toHaveProperty('version')
  })

  it('carry the bar between the Player and the score editor, a bar as printed (ADR 0115)', async () => {
    expect(await searchAt('/edit/bz5?bar=4')).toEqual({ ...EDIT_DEFAULTS, bar: 4 })
    expect(await searchAt('/play/bz5?bar=3')).toEqual({ ...PLAYER_DEFAULTS, bar: 3 })
    for (const bar of ['0', '-2', '2.5', 'x']) {
      expect(await searchAt(`/edit/bz5?bar=${bar}`)).toEqual(EDIT_DEFAULTS)
      expect(await searchAt(`/play/bz5?bar=${bar}`)).toEqual(PLAYER_DEFAULTS)
    }
  })

  it('keep what is valid', async () => {
    expect(
      await searchAt(
        '/practice/chords?root=Bb&triad=min&size=7&seventh=major&voicing=drop2&inversion=2&hands=both&step=chords:sev',
      ),
    ).toEqual({
      root: 'Bb',
      triad: 'min',
      size: 7,
      seventh: 'major',
      colour: '',
      voicing: 'drop2',
      inversion: 2,
      hands: 'both',
      step: 'chords:sev',
    })
    // A voicing the chord cannot take is read as close: a triad has no drop 2.
    expect(await searchAt('/practice/chords?size=5&voicing=drop2')).toMatchObject({
      voicing: 'close',
    })
    // From five notes a chord is in root position or has its right hand from the 7th (ADR 0046).
    expect(await searchAt('/practice/chords?size=9&inversion=3')).toMatchObject({ inversion: 3 })
    expect(await searchAt('/practice/chords?size=9&inversion=2')).toMatchObject({ inversion: 0 })
    // The chord's colour notes round-trip as a symbol writes them (A33).
    expect(await searchAt('/practice/chords?size=13&seventh=minor&colour=b9,%2311')).toMatchObject({
      size: 13,
      colour: 'b9,#11',
    })
    expect(await searchAt('/practice/chords?triad=min&size=5&colour=9')).toMatchObject({
      triad: 'min',
      colour: '9',
    })
    // A key, from Harmony's or Progressions' chords: the colour notes follow the chord's degree.
    expect(await searchAt('/practice/chords?root=D&triad=min&size=7&key=C')).toMatchObject({
      root: 'D',
      key: 'C',
    })
    expect(await searchAt('/practice/chords?key=H')).toMatchObject({ key: undefined })
    expect(
      await searchAt(
        '/play/bz5?transpose=2&tempo=96&hands=lh&mode=wait&speedTraining=true&swing=light&loop=2-3&pattern=chart&rh=t1&lh=o&chordSize=ninths&version=easy',
      ),
    ).toEqual({
      transpose: 2,
      tempo: 96,
      hands: 'lh',
      mode: 'wait',
      speedTraining: true,
      swing: 'light',
      loop: '2-3',
      pattern: 'chart',
      rh: 't1',
      lh: 'o',
      chordSize: 'ninths',
      version: 'easy',
    })
    expect(await searchAt('/songs?q=душа&key=Em&stage=advanced&favourites=true')).toEqual({
      ...SONGS_HOME_DEFAULTS,
      q: 'душа',
      stage: 'advanced',
      key: 'Em',
      favourites: true,
    })
    expect(await searchAt('/songs/folders/hymns?q=душа')).toEqual({ ...FOLDER_DEFAULTS, q: 'душа' })
    expect(await searchAt('/songs/folders/hymns?edit=true')).toEqual({
      ...FOLDER_DEFAULTS,
      edit: true,
    })
    expect(await searchAt('/practice/scales?root=Eb&kind=harmonic&chords=4')).toMatchObject({
      root: 'Eb',
      kind: 'harmonic',
      chords: 4,
    })
    expect(await searchAt('/check?of=scale:blues')).toEqual({ of: 'scale:blues' })
  })

  it('drop a Reading notes range end that is off the piano or no MIDI key', async () => {
    for (const end of ['Cb-1', 'B#9', 'C-1', 'C9']) {
      expect(
        await searchAt(`/practice/trainer/reading-notes?level=custom&from=${end}&to=${end}`),
      ).toMatchObject({ from: undefined, to: undefined })
    }
    expect(
      await searchAt('/practice/trainer/reading-notes?level=custom&from=A0&to=C8'),
    ).toMatchObject({ from: 'A0', to: 'C8' })
  })

  it('drop anything stale or hand-edited back to its default, without clamping', async () => {
    expect(
      await searchAt(
        '/play/bz5?transpose=9&tempo=999&mode=dance&pattern=waltz&rh=zz&chordSize=elevenths',
      ),
    ).toEqual(PLAYER_DEFAULTS)
    expect(await searchAt('/play/bz5?mode=step&loop=6-3&swing=yes&tempo=5')).toEqual(
      PLAYER_DEFAULTS,
    )
    expect(await searchAt('/play/bz5?loop=x&speedTraining=1')).toEqual(PLAYER_DEFAULTS)
    expect(
      await searchAt(
        '/practice/chords?triad=maj13&size=6&seventh=7&colour=x&inversion=7&step=scale:major',
      ),
    ).toEqual(CHORDS_DEFAULTS)
    expect(await searchAt('/practice/chords?quality=m7')).toMatchObject(CHORDS_DEFAULTS)
    expect(await searchAt('/practice/chords?size=5&inversion=3')).toMatchObject({ inversion: 0 })
    expect(await searchAt('/practice/scales?kind=ionian&tempo=5&step=chords:tri')).toEqual(
      SCALES_DEFAULTS,
    )
    expect(await searchAt('/songs?view=public&kind=bands&cat=jazz&shelf=best')).toEqual(
      SONGS_HOME_DEFAULTS,
    )
  })

  it('ignore an old link’s fingers: the playing hand’s stand under the keys', async () => {
    expect(await searchAt('/practice/scales?fingers=rh')).toMatchObject(SCALES_DEFAULTS)
    expect(await searchAt('/practice/scales?view=rh')).toMatchObject(SCALES_DEFAULTS)
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

  it('fit a chord’s parts to one another', async () => {
    expect(await searchAt('/practice/chords?triad=sus2&size=13&colour=b9')).toMatchObject({
      size: 7,
      colour: '',
    })
    expect(await searchAt('/practice/chords?size=7&colour=6,b5,%2311')).toMatchObject({
      colour: 'b5',
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

  it('read the chromatic walk’s chords in the table’s order, its root as written', async () => {
    expect(
      await searchAt('/play/chromatic?chords=n9.m9.xx&root=Ab&direction=both&pattern=pop8'),
    ).toMatchObject({ chords: 'm9.n9', root: 'Ab', direction: 'both', pattern: 'pop8' })
    expect(await searchAt('/play/chromatic?chords=xx&root=H&direction=sideways')).toEqual(
      CHROMATIC_DEFAULTS,
    )
    expect(await searchAt('/play/chromatic?chords=')).toEqual(CHROMATIC_DEFAULTS)
  })

  it('keep a root and a key as written, a key no signature writes respelled', async () => {
    expect(await searchAt('/practice/chords?root=A%23')).toMatchObject({ root: 'A#' })
    expect(await searchAt('/practice/chords?root=Db&triad=min')).toMatchObject({ root: 'Db' })
    // The Player keeps how far it moves a song, and the two Transpose switches when off (R29 T).
    expect(await searchAt('/play/bz5?transpose=-1&tkey=false&tchords=false')).toMatchObject({
      transpose: -1,
      tkey: false,
      tchords: false,
    })
    expect(await searchAt('/practice/progressions/line?key=Dbm')).toMatchObject({ key: 'C#m' })
    expect(await searchAt('/practice/progressions/line?key=C%23')).toMatchObject({ key: 'C#' })
  })

  it('keep an interval’s root as written', async () => {
    expect(await searchAt('/practice/intervals?root=C%23')).toEqual({
      ...INTERVALS_DEFAULTS,
      root: 'C#',
    })
    expect(await searchAt('/practice/intervals?root=H')).toEqual(INTERVALS_DEFAULTS)
  })

  it('keep a scale run’s hand octaves and a loop’s rest, within their reach', async () => {
    expect(await searchAt('/play/exercise/scale?rhOctave=5&lhOctave=2&rest=3')).toMatchObject({
      rhOctave: 5,
      lhOctave: 2,
      rest: 3,
    })
    const out = await searchAt('/play/exercise/scale?rhOctave=9&rest=13')
    expect(out).not.toHaveProperty('rhOctave', 9)
    expect(out).not.toHaveProperty('rest', 13)
  })

  it('keep how an interval plays and which, upwards and a fifth unless a known one is asked', async () => {
    expect(await searchAt('/practice/intervals?way=together&iv=M3')).toMatchObject({
      way: 'together',
      iv: 'M3',
    })
    expect(await searchAt('/practice/intervals?way=sideways&iv=X9')).toMatchObject({
      way: 'up',
      iv: 'P5',
    })
  })

  it('keep a number typed as a search, which the router reads as a number', async () => {
    expect(await searchAt('/songs?q=1999')).toMatchObject({ q: '1999' })
  })

  it('write a progression’s numerals one way, and take the default for a line that cannot be read', async () => {
    expect(
      await searchAt('/practice/progressions/line?p=ii7%20V7%20IMaj7&key=Am&size=sevenths'),
    ).toEqual({
      ...PROGRESSIONS_DEFAULTS,
      p: 'ii7-V7-Imaj7',
      key: 'Am',
      size: 'sevenths',
    })
    expect(await searchAt('/practice/progressions/line?p=Q')).toEqual(PROGRESSIONS_DEFAULTS)
  })

  it('open a minor key with no line on the default progression’s minor line', async () => {
    expect(await searchAt('/practice/progressions/line?key=F%23m')).toMatchObject({
      key: 'F#m',
      p: 'i-VI-III-VII',
    })
    expect(await searchAt('/practice/progressions/line?key=F%23m&p=I-V-vi-IV')).toMatchObject({
      p: 'I-V-vi-IV',
    })
    expect(await searchAt('/practice/progressions/line?key=F%23m&p=Q')).toMatchObject({
      p: 'i-VI-III-VII',
    })
  })

  it('leave out of the URL only the line its key opens on', async () => {
    const F_SHARP_MINOR = keyParam({ tonic: note('F', 1), minor: true })
    const router = testRouter('/practice/progressions/line')
    await router.load()
    await router.navigate({
      to: '/practice/progressions/line',
      search: { ...PROGRESSIONS_DEFAULTS, key: F_SHARP_MINOR, p: 'I-V-vi-IV' },
    })
    expect(router.state.location.search).toMatchObject({ key: 'F#m', p: 'I-V-vi-IV' })
    expect(router.state.location.searchStr).toContain('p=')
    await router.navigate({
      to: '/practice/progressions/line',
      search: { ...PROGRESSIONS_DEFAULTS, key: F_SHARP_MINOR, p: 'i-VI-III-VII' },
    })
    expect(router.state.location.searchStr).not.toContain('p=')
  })

  it('read a library’s search, sort, place and level, each invalid one its default (R30-4)', async () => {
    expect(
      await searchAt('/practice/progressions?q=blues&sort=name&place=jazz&stage=beginner'),
    ).toEqual({ q: 'blues', sort: 'name', place: 'jazz', stage: 'beginner', mode: 'any' })
    expect(
      await searchAt('/practice/exercises?sort=key&place=a%20b&stage=expert&mode=lydian'),
    ).toEqual({
      q: '',
      sort: 'group',
      place: 'all',
      stage: 'any',
      mode: 'any',
      book: 'technique',
    })
  })

  it('read a progression’s key, its chord size where asked and what leads into each chord', async () => {
    expect(
      await searchAt('/practice/progressions/jazz-cadence?key=Am&size=ninths&lead=ii-v'),
    ).toEqual({ key: 'Am', size: 'ninths', lead: 'ii-v' })
    expect(await searchAt('/practice/progressions/jazz-cadence?size=huge&lead=x')).toEqual({
      key: 'C',
    })
  })
})
