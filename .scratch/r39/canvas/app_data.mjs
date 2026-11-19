// The app's own content for the boards, read from its source through Vite (aliases and TypeScript as the
// app builds them), written to data/*.json: run `node app_data.mjs` from the repo root after the content
// changes (with the dev server's two placeholder values set); the generators read the JSON at build, so a board holds what the app holds.
import { createServer } from 'vite'
import { writeFileSync } from 'node:fs'
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const load = (p) => vite.ssrLoadModule(p)
const pat = await load('/src/entities/pattern/index.ts')
const bookE = await load('/src/entities/book/index.ts')
const course = await load('/src/entities/course/index.ts')
const { music } = await load('/src/shared/i18n/locales/en/music.ts')
const figs = await load('/src/entities/pattern/content/figures.ts')
const { patternSample } = await load('/src/widgets/pattern-music/model/pattern-sample.ts')
const STAGES = ['beginner', 'intermediate', 'advanced', 'professional']
const book = pat.patternBook([])
const parts = [...bookE.METHOD_BOOK_IDS, 'styles']
const partName = (p) => (bookE.isMethodBookId(p) ? bookE.METHOD_BOOK_NAMES[p].en : music.patternPart[p])
const rows = []
for (const g of pat.PATTERN_GROUPS) {
  const part = pat.partOfShelf(g)
  if (part === 'yours') continue
  const stage = bookE.isMethodBookId(part) ? course.courseById(part)?.stage : undefined
  for (const id of pat.patternsIn(g)) {
    const p = book.get(id)
    if (!p) continue
    // the row's picture: the notes PatternTile draws, its bar over C
    const notes = patternSample(p, book).sounds.flatMap((n) => (n.kind === 'note' && (n.part === 'rh' || n.part === 'lh') ? [[n.at, n.duration, n.midi, n.part]] : []))
    rows.push({ id, part, name: p.name.en, idea: p.idea.en, level: stage ? `Level ${STAGES.indexOf(stage) + 1}` : '', stage: stage ? stage[0].toUpperCase() + stage.slice(1) : '',
      hands: `LH: ${figs.LEFT_FIGURES[p.lh].name.en} · RH: ${figs.RIGHT_FIGURES[p.rh].name.en}`, lh: p.lh, rh: p.rh, notes })
  }
}
const out = parts.map((p) => ({ part: p, name: partName(p), rows: rows.filter((r) => r.part === p) })).filter((s) => s.rows.length)
writeFileSync('.scratch/r39/canvas/data/accompaniment.json', JSON.stringify(out, null, 1))
console.log(out.map((s) => `${s.name} ${s.rows.length}`).join(' · '))
// the exercise shelves (Finger technique, Jazz vocabulary): each source's exercises, as useExerciseLibrary lists them
const ex = await load('/src/entities/exercise/index.ts')
const { practice } = await load('/src/shared/i18n/locales/en/practice.ts')
const exShelves = {}
for (const shelf of ['technique', 'jazz'])
  exShelves[shelf] = ex.SHELF_GROUPS[shelf].map((g) => ({ group: g, name: practice.exercises.groups[g], paint: ex.GROUP_PAINT[g] ?? 'sand',
    rows: ex.exercisesOnShelf(shelf).filter((e) => e.group === g).map((e) => ({ id: e.id, name: e.name.en, line: (e.focus ?? e.trains).en,
      stage: e.stage[0].toUpperCase() + e.stage.slice(1), mark: e.mark ?? '' })) }))
writeFileSync('.scratch/r39/canvas/data/exercises.json', JSON.stringify(exShelves, null, 1))
console.log(Object.entries(exShelves).map(([k, v]) => `${k}: ` + v.map((g) => `${g.name} ${g.rows.length}`).join(', ')).join(' · '))
await vite.close()
