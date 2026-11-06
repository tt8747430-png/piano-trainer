# Piano Forte (mathisto/piano): the code behind its UI, to port

Source: https://github.com/mathisto/piano, MIT, © 2026 Matt Kelly, read 2026-11-06 (commit of 2026-11-05). Paths are
under its `src/`. Quoted code keeps its licence: a port keeps the copyright line in the file's header comment.

## 1. Timing judgement (`judge.ts`, `marks.ts`, `style.css` 2205–2224)

- Windows in real ms (song time × rate): perfect ±45, great ±80, good ±125. Past good, a right key up to a beat late
  (capped at 0.5 s) still counts as `late`.
- Ease scales the windows, early and late separately: easy 1.3, standard 1, strict 0.75; paced reading [1.2, 2];
  calibration 3 (±375 ms).
- Weights: perfect 1, great 0.8, good 0.5, late 0.25, miss 0. Accuracy is `weightSum / (judged + extra)`. A wrong key
  is an extra miss, unless it is a pending or missed note's pitch within the grace, which makes it early or late.
- Wait mode takes a note up to 0.6 s of song time early. Notes within 30 ms are one chord.
- Holds: release tolerance is `max(floor×rate, share×duration)`, lenient 0.35 s / 30 %, strict 0.12 s / 15 %. The
  sustain pedal excuses an early release.
- Glyphs (Word And Shape Rule): perfect has no glyph, only a flash that fades to played ink; great ●; good ◂ or ▸ (the
  side it missed on); late ▹ outlined; miss × crimson. A held note that is too short gets a crimson outline, one that
  is too long a dashed grey outline. A marks line reads like "Bar 3, beat 2, right hand. E was 140 ms late."

```ts
// judge.ts
const WIN = { perfect: 45, great: 80, good: 125 }
export const WEIGHT: Record<Grade, number> = { perfect: 1, great: 0.8, good: 0.5, late: 0.25, miss: 0 }
const LATE_CAP = 0.5
const WAIT_EARLY = 0.6
  private win() {
    const e = this.cfg.ease ?? 1
    const [ea, la] = typeof e === 'number' ? [e, e] : e
    const s = (WIN.good * this.cfg.rate) / 1000
    return { early: s * ea, late: s * la, grace: Math.min(this.cfg.beat ?? 0, LATE_CAP * this.cfg.rate), ea, la }
  }
  press(p: number, t: number, vel = 0): Ev[] {
    const w = this.win()
    let best = -1, bestD = Infinity
    for (let i = this.first; i < this.notes.length; i++) {
      const n = this.notes[i]
      if (n.t > t + (this.cfg.wait ? WAIT_EARLY : w.early)) break
      if (this.st[i] !== PENDING || n.p !== p) continue
      if (this.cfg.wait) { best = i; break }
      const d = t - n.t
      const rank = d > w.late ? 1 + d : Math.abs(d) // inside the window beats any late hit
      if (d >= -w.early && d <= w.late + w.grace && rank < bestD) { best = i; bestD = rank }
    }
    if (best < 0) return this.stray(p, t)
    const off = ((t - this.notes[best].t) / this.cfg.rate) * 1000
    const a = Math.abs(off) / (off < 0 ? w.ea : w.la)
    const grade: Grade = a <= WIN.perfect ? 'perfect' : a <= WIN.great ? 'great' : a <= WIN.good + 1e-6 ? 'good' : 'late'
```

```css
/* style.css: the judgement glyphs as clipped chips */
.jg[data-g='great'] { color: var(--great); clip-path: circle(50%); background: radial-gradient(circle, transparent 34%, currentColor 38%); }
.jg[data-g='good'] { color: var(--good); clip-path: polygon(50% 6%, 96% 92%, 4% 92%); }
.jg[data-g='late'] { color: var(--late); clip-path: polygon(14% 4%, 94% 50%, 14% 96%); }
.jg[data-g='miss'] { color: var(--bad); clip-path: polygon(14% 0,50% 36%,86% 0,100% 14%,64% 50%,100% 86%,86% 100%,50% 64%,14% 100%,0 86%,36% 50%,0 14%); }
```

**Ours:** `widgets/sheet-music/ui/NoteVerdicts.tsx` colours noteheads only. Early and late share the honey ink with no
glyph, which fails our Second Cue Rule. The port is a glyph layer beside each judged head, plus grace windows in
`features/practice/practice-machine.ts`.

## 2. Latency calibration (`app/calibration.ts`, `game.ts`)

The test is 16 middle Cs at 80 bpm, with the click on and the HUD hidden, judged at ease 3 with no offset. It needs at
least 8 hits. The result is the median offset rounded to 5 ms, saved as `settings.offset`. Every key time afterwards
is `t − offset/1000 × rate`. With fewer than 8 hits it says "Only N of 16 notes landed close enough".

```ts
const ok = offs.length >= 8
const med = ok ? Math.round(median(offs) / 5) * 5 : 0
```

Velocity calibration (`touch.ts`): 10 notes each soft, medium and hard. Each band's mean must be at least 12 above the
band below, and the edges sit halfway between the means. The defaults are soft 45 and hard 86.

## 3. Help that fades

- Note names on falling notes hide once a pitch is known: `n ≥ 12`, clean ≥ 0.85 and response time ≤ 3000 ms. These
  are moving averages with α 0.3, so one miss brings the name back.
- Praise goes quiet after 8 clean notes in a row; any slip resets the count.
- Evenness marks go faint (0.35) after 3 even runs, and every 4th run shows no marks at all, as a test.
- Memorise hides bars in stages: full → every 4th → every 2nd → barlines only → none. Two clean passes move a stage up,
  more than 3 slips one down, and a peek blocks the step up.

```ts
// quiet.ts
const NEED = 12
export function knownPitches(stats: Stats): Set<number> {
  const out = new Set<number>()
  for (const [k, s] of Object.entries(stats)) {
    const [size, , p] = k.split(':')
    if (size === '1' && s.n >= NEED && s.clean >= 0.85 && s.rt <= 3000) out.add(Number(p))
  }
  return out
}
// memory.ts
export const hidden = (stage: number, bar: number) => (stage >= 3 ? true : stage === 2 ? bar % 2 === 1 : stage === 1 ? bar % 4 === 3 : false)
// coach.ts
const FADE_AFTER = 3, TEST_EVERY = 4
export function marksFor(s: Seen | undefined, always: boolean): Marks {
  if (always) return 'full'
  if (((s?.runs ?? 0) + 1) % TEST_EVERY === 0) return 'none'
  return (s?.even ?? 0) >= FADE_AFTER ? 'faint' : 'full'
}
```

## 4. Ghost of the last run and Compare (`take.ts`, `app/take-ui.ts`)

- A take stores `ts, mode, rate, wait, acc, clean, n` and parallel arrays per key struck: pitch, velocity, down time,
  held time, and the written note index (−1 for a wrong key), plus the missed notes and the pedal. The last 3 takes
  per piece are kept, capped at 4000 keys.
- The ghost is a dim dot (r 3, ink at 0.5) at each key's pitch and time, behind the heads. An on-time key hides under
  its note.
- Compare draws two thin columns per bar, accuracy last time and now. A change of 15 points or more gets the good or
  bad colour. A timing strip shows ±150 ms. "Hear last time" replays the take.

```ts
function stats({ notes, bars }, k: Take) {
  const n = bars.length + 1
  const right = new Array(n).fill(0), bad = new Array(n).fill(0), off = new Array(n).fill(0)
  const add = (bar: number, ok: boolean, ms = 0) => { for (const x of [bar, n - 1]) { if (ok) (right[x]++, (off[x] += ms)); else bad[x]++ } }
  k.i.forEach((i, j) => (i >= 0 ? add(notes[i].bar, true, (k.t[j] - notes[i].t * 1000) / k.rate) : add(barAt(bars, k.t[j] / 1000), false)))
  for (const i of k.miss) add(notes[i].bar, false)
  const at = (x: number) => ({ acc: right[x] + bad[x] ? right[x] / (right[x] + bad[x]) : null, off: right[x] && !k.wait ? off[x] / right[x] : null })
  return { bars: bars.map((_, x) => at(x)), all: at(n - 1) }
}
```

**Ours:** we already record takes (`features/record-take`), so the port is the per-bar `stats` and a Compare view.

## 5. Covers from the first bars (`incipit.ts`, `cover.ts`, `cover-draw.ts`)

The first 3 bars are kept and 1–2 shown. A single staff is drawn ×1.45. A dense bar is laid wider (×1.3–3) and cut at
the edge rather than squeezed. The crop slides towards ledger notes. Paper is `#fbf8f1` with ink `#161513` in both
themes. With no score, the cover is a blank staff with the key and metre. Covers are drawn one at a time in a queue
and memoised.

```ts
export function cropOf(lines: number[], heads: number[], body: { w: number; h: number }, scale: number) {
  const h = body.h / scale
  const [top, bot] = [lines[0], lines[lines.length - 1]]
  let y = (top + bot) / 2 - h / 2
  if (heads.length) {
    const a = Math.min(...heads) - 6, b = Math.max(...heads) + 6
    y = b - a > h ? (a + b) / 2 - h / 2 : Math.min(Math.max(y, b - h), a)
  }
  y = Math.min(Math.max(y, bot + 2 - h), top - 2)
  return { y, h, w: body.w / scale, staff: lines.length >= 10 ? 'grand' : 'solo' }
}
```

**Ours:** Verovio can engrave the first bars of any `Score` (`shared/ui/score`), so the cover is a Verovio render of a
bar range at a small scale, cached by piece id and version. It replaces the key letter in `pages/piece/ui/SongCover.tsx`.

## 6. Today plan (`plan.ts`, `next.ts`, `pace.ts`)

```ts
const PLANS: Record<PlanMin, [string, number][]> = {
  5: [['warm', 2], ['read', 3]],
  10: [['warm', 2], ['read', 2], ['piece', 6]],
  20: [['warm', 4], ['theory|read', 3], ['sight', 4], ['piece', 6], ['again|fix|review', 3]],
  30: [['warm', 3], ['scale', 3], ['read', 5], ['sight', 4], ['piece', 10], ['fix', 2], ['again|theory|path|review', 3]],
  45: [['warm', 5], ['scale', 5], ['read', 5], ['theory|path|run', 3], ['sight', 5], ['piece', 15], ['fix', 3], ['again|review', 4]],
}
```

The one lamp (`nextUp`), first that applies: the fix after an unclean run (3 offers at most), the guide, the plan's
next row, the row with most due, "back" (two sessions under 70 %), "change" (five without gain), the lagging strand,
the path, the piece. It never returns nothing.

Row grammar: a ring or a tick, a cover, the title (18 px, 650) over "reason · about N min", a mastery meter and a verb
(Start, Practise, Continue, Loop, Review, Read through). Only the lamp row's button is filled. Done rows sink to the end.

Pace: in a loop, 3 clean passes add 5 % tempo and 2 messy passes take off 10 %, with a floor of 25 % and steps of 5 %.
After a run, one suggestion: lose the wait, climb the tempo (50 → 75 → 100 %), or loop the worst bars at 70 % or less.

## 7. Mastery meters (`drill.ts`, `ui.ts`)

- Per card: `min(1, n/12) × clean × min(1, goal/rt)`, averaged over the stage. **Solid** means every card has
  n ≥ 12, clean ≥ 0.85 and rt ≤ goal. **Fluent** is the same against half the goal (1.5 s for single notes).
- Leitner boxes of 1, 2, 4, 8 and 16 days.
- The meter is a 10 px pill: Ink-2 while learning, Ink once solid, with a fluent fill over it. It is
  `role="meter"` with an aria-valuetext of "Solid, N% fluent". Mastery is ink, never a judgement colour (Neutral
  Progress Rule).

## 8. On-screen keys (`osk.ts`)

White keys have a 44 px floor, with 8–29 white keys by width. A black key is 0.62 of a white key's width and height.
Pointer capture handles multi-touch and gliding with `pointermove`. A virtual press is the same MIDI message at
velocity 0.75. The keys show only where a question waits, and by default only without a MIDI input.

```ts
export const whitesFor = (width: number) => Math.min(29, Math.max(8, Math.floor(width / 44)))
```

There is no keyboard range set by pressing in this repo.

## 9. Tokens

Control height 40 px (44 on `pointer: coarse`). Radii 6, 10, 14 and pill. The lamp is `light-dark(#f5b316, #ffc83d)`
and means only "play this, now". Right hand is solid `#c94a22`; left hand is a 30 % fill of `#0e7c77` with a 2 px edge.
Ease `cubic-bezier(0.16,1,0.3,1)`.
