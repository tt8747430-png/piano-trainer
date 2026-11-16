/**
 * chord-detection.ts
 *
 * Self-contained TypeScript port of the chord dictionary and the chord
 * recognition / suggestion logic of Piano Companion for macOS
 * (Songtive, com.songtive.pianocompanion.lite.osx, v1.6.1028).
 *
 * Ported statically from the decompiled assembly PianoCompanion.Engine.OSX.dll
 * (namespace PianoCompanion.Engine.Services) and PianoCompanion.dll
 * (namespace PianoCompanion.Helper). Each section names the C# source it mirrors.
 *
 * Only erasable TypeScript syntax is used, so it runs directly with
 * `node chord-detection.test.mjs` (Node >= 22.6 with type stripping; Node 24 strips by default).
 *
 * Exports:
 *   CHORDS                      the full built-in chord list (GenerateChords + Alts expansion)
 *   chordSymbol(def, style)     ChordSymbols.Symbol
 *   isAlias(def)                ChordSymbols.IsAlias
 *   difficulty(def)             ChordNamer.Difficulty
 *   findChordByFormulaPart()    the reverse lookup the macOS UI actually calls (ChordService.findChordByFormulaPart)
 *   nameChord()                 ChordNamer.Name (shared engine namer; ranked candidate labels)
 *   suggestNextChords()         ChordSuccessors.Ranked / After
 *   buildVoicing(), assignFingering()   ChordVoicer.Build and FingeringScorer.Assign
 */

// ---------------------------------------------------------------------------
// Pitch / spelling primitives  (Songtive.Services.Semitone, NoteService)
// ---------------------------------------------------------------------------

/** Natural pitch class of letters C D E F G A B (NoteService.staffNotes). */
export const STAFF_NOTES = [0, 2, 4, 5, 7, 9, 11] as const;
export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

export interface Spelled {
  /** letter index 0..6 = C..B */
  letter: number;
  /** accidental offset in semitones (-2..2 for roots and chord tones) */
  acc: number;
}

/** A position on the staff: letter index including octave (pos 9 = D of next octave) + accidental offset. */
export interface Degree {
  pos: number;
  acc: number;
}

export const pc = (n: number): number => ((n % 12) + 12) % 12;
export const spelledPc = (s: Spelled): number => pc(STAFF_NOTES[s.letter] + s.acc);

/** Accidental glyphs used by NoteService (FLAT "♭", SHARP "♯", DOUBLEFLAT "♭♭", DOUBLESHARP "x"). */
export function accidentalText(acc: number): string {
  switch (acc) {
    case 0: return '';
    case 1: return '♯';
    case 2: return 'x';
    case 3: return '♯x';
    case 4: return 'xx';
    case -1: return '♭';
    case -2: return '♭♭';
    case -3: return '♭♭♭';
    case -4: return '♭♭♭♭';
    default: throw new Error('Invalid accidental ' + acc);
  }
}

/** English note name (Notation.English, academic spelling). */
export const noteName = (s: Spelled): string => LETTERS[s.letter] + accidentalText(s.acc);

const S = (letter: number, acc = 0): Spelled => ({ letter, acc });

/** Semitone.Values: the 21 root spellings the dictionary is expanded over (order matters for ties). */
export const SEMITONE_VALUES: Spelled[] = [
  S(0, -1), S(0), S(0, 1), S(1, -1), S(1), S(1, 1), S(2, -1), S(2), S(2, 1), S(3, -1),
  S(3), S(3, 1), S(4, -1), S(4), S(4, 1), S(5, -1), S(5), S(5, 1), S(6, -1), S(6), S(6, 1),
];
/** Semitone.NotesWithSharpsFlats: 17 spellings used by ChordNamer. */
export const NOTES_WITH_SHARPS_FLATS: Spelled[] = [
  S(0), S(0, 1), S(1, -1), S(1), S(1, 1), S(2, -1), S(2), S(3), S(3, 1), S(4, -1),
  S(4), S(4, 1), S(5, -1), S(5), S(5, 1), S(6, -1), S(6),
];
/** Semitone.NotesWithSharps / NotesWithFlats (index = pitch class). */
export const NOTES_WITH_SHARPS: Spelled[] = [S(0), S(0, 1), S(1), S(1, 1), S(2), S(3), S(3, 1), S(4), S(4, 1), S(5), S(5, 1), S(6)];
export const NOTES_WITH_FLATS: Spelled[] = [S(0), S(1, -1), S(1), S(2, -1), S(2), S(3), S(4, -1), S(4), S(5, -1), S(5), S(6, -1), S(6)];

/** Semitone.ParseNote(n, Sharp): naturals stay natural, black keys become sharps. */
export function parseNoteSharp(n: number): Spelled {
  return NOTES_WITH_SHARPS[pc(n)];
}

// ---------------------------------------------------------------------------
// Chord dictionary  (ChordService.GenerateChords / AddChord / GenerateDegrees)
// ---------------------------------------------------------------------------

export type ChordGroupName =
  | 'principal' | 'relativeminor' | 'common_chords' | 'triads' | 'sevenths' | 'ninths'
  | 'elevenths' | 'thirteenths' | 'secondary_dominant' | 'secondary_leading_tone' | 'parallel_mode' | 'other';

export interface ChordDef {
  id: number;
  /** Chord.getShortName() – internal short symbol, e.g. "m⁻9" */
  shortName: string;
  /** Chord.ButtonName – label used on buttons (defaults to shortName) */
  buttonName: string;
  /** English long name, e.g. "Minor 7th ⁻5, ø" */
  name: string;
  group: ChordGroupName;
  /** semitones above the root, in the order the app stores them (not always sorted for altered variants) */
  formula: number[];
  /** accidentals by formula index (Chord.accidentals) */
  accidentals: { index: number; acc: number }[];
  /** chord degrees (Chord.degrees): pos = 0-based letter distance from the root incl. octave */
  degrees: Degree[];
  /** Chord.MaxInversions = formula.length - 1 */
  maxInversions: number;
  /** id of the base chord for Alts-generated variants (id / 100), else null */
  variantOf: number | null;
  /** ids 1..9 are scale-function chords (I, IV, V, V7, VIm, IIm, III, III7, VII°7) with a circle-of-fifths root adjustment */
  rootAdjustment: number | null;
}

const ACC = { Default: 0, Sharp: 1, Flat: -1, DoubleFlat: -2, DoubleSharp: 2 } as const;

/** NoteService.transformIndexToNote: letter index for a pitch class spelled with the given accidental, or -1. */
function transformIndexToNote(index: number, acc: number): number {
  return STAFF_NOTES.indexOf((index - acc) as never);
}

/** ChordService.toNoteOnStaffIndex(c, formula, i, ignoreTransformation: true) for an untransposed chord. */
function degreeFor(formula: number[], accidentals: { index: number; acc: number }[], i: number): Degree {
  let num = formula[i];
  let oct = 0;
  if (num > 11) { oct = Math.floor(num / 12); num %= 12; }
  const nat = STAFF_NOTES.indexOf(num as never);
  if (nat > -1) return { pos: oct * 7 + nat, acc: 0 };
  const a = accidentals.find((x) => x.index === i)?.acc ?? 0;
  const letter = a === 0 ? -1 : transformIndexToNote(num, a);
  if (letter > -1) return { pos: oct * 7 + letter, acc: a };
  // The app falls back to the key signature of the transposed chord; every built-in chord sets an explicit accidental.
  throw new Error('No spelling for interval ' + formula[i]);
}

function generateDegrees(def: ChordDef, staticDegrees: boolean): void {
  if (staticDegrees) return;
  def.degrees = def.formula.map((_, i) => degreeFor(def.formula, def.accidentals, i));
}

/** Alts flags (ChordService.Alts). */
const B5 = 1, S5 = 2, SUS2 = 4, SUS4 = 8, N7 = 16, B9 = 32, S9 = 64;

interface BaseRow {
  id: number; mods: number; shortName: string; buttonName?: string | null; name: string; group: ChordGroupName;
  formula?: number[]; accidentals?: [number, number][]; degrees?: [number, number][]; rootAdjustment?: number | null;
}

/** Transcribed verbatim from ChordService.GenerateChords(), in insertion order. accidentals: [formulaIndex, offset]. */
const BASE_ROWS: BaseRow[] = [
  { id: 1, mods: 0, shortName: 'I', name: 'Tonic', group: 'principal', formula: [0, 4, 7] },
  { id: 2, mods: 0, shortName: 'IV', name: 'Sub-Dominant', group: 'principal', formula: [0, 4, 7], rootAdjustment: -1 },
  { id: 3, mods: 0, shortName: 'V', name: 'Dominant', group: 'principal', formula: [0, 4, 7], rootAdjustment: 1 },
  { id: 4, mods: 0, shortName: 'V7', name: 'Dominant 7th', group: 'principal', formula: [0, 4, 7, 10], accidentals: [[3, -1]], rootAdjustment: 1 },
  { id: 5, mods: 0, shortName: 'VIm', name: 'Tonic', group: 'relativeminor', formula: [0, 3, 7], accidentals: [[1, -1]], rootAdjustment: 0 },
  { id: 6, mods: 0, shortName: 'IIm', name: 'Sub-Dominant', group: 'relativeminor', formula: [0, 3, 7], accidentals: [[1, -1]], rootAdjustment: -1 },
  { id: 7, mods: 0, shortName: 'III', name: 'Mediant', group: 'relativeminor', formula: [0, 3, 7], accidentals: [[1, -1]], rootAdjustment: 1 },
  { id: 8, mods: 0, shortName: 'III7', name: 'Mediant 7th', group: 'relativeminor', formula: [0, 3, 7, 10], accidentals: [[1, -1], [3, -1]], rootAdjustment: 1 },
  { id: 9, mods: 0, shortName: 'VII°7', name: 'Leading tone 7th', group: 'common_chords', formula: [0, 3, 6, 10], accidentals: [[1, -1], [2, -1], [3, -1]], rootAdjustment: 5 },
  { id: 10, mods: 0, shortName: 'M', name: 'Major', group: 'common_chords', degrees: [[0, 0], [2, 0], [4, 0]] },
  { id: 11, mods: 0, shortName: 'm', name: 'Minor', group: 'common_chords', degrees: [[0, 0], [2, -1], [4, 0]] },
  { id: 12, mods: 0, shortName: '°', name: 'Diminished', group: 'common_chords', formula: [0, 3, 6], accidentals: [[1, -1], [2, -1]] },
  { id: 13, mods: 0, shortName: '⁺', buttonName: '+', name: 'Augmented', group: 'common_chords', formula: [0, 4, 8], accidentals: [[2, 1]] },
  { id: 14, mods: 0, shortName: 'sus2', name: 'Suspended 2nd', group: 'common_chords', formula: [0, 2, 7] },
  { id: 15, mods: 0, shortName: 'sus4', name: 'Suspended 4th', group: 'common_chords', formula: [0, 5, 7] },
  { id: 16, mods: 0, shortName: '⁻5', name: 'Flat Fifth', group: 'common_chords', formula: [0, 4, 6], accidentals: [[2, -1]] },
  { id: 100, mods: 0, shortName: '5', name: 'Fifth', group: 'common_chords', formula: [0, 7] },
  { id: 17, mods: 0, shortName: '6', name: 'Sixth', group: 'common_chords', formula: [0, 4, 7, 9] },
  { id: 18, mods: 0, shortName: 'm6', name: 'Minor 6th', group: 'common_chords', formula: [0, 3, 7, 9], accidentals: [[1, -1]] },
  { id: 19, mods: B5 | S5 | SUS2 | SUS4, shortName: '7', name: 'Seventh', group: 'common_chords', formula: [0, 4, 7, 10], accidentals: [[3, -1]] },
  { id: 20, mods: B5 | S5, shortName: 'm7', name: 'Minor 7th', group: 'common_chords', formula: [0, 3, 7, 10], accidentals: [[1, -1], [3, -1]] },
  { id: 21, mods: 0, shortName: '°7', name: 'Diminished 7th', group: 'common_chords', degrees: [[0, 0], [2, -1], [4, -1], [6, -2]] },
  { id: 22, mods: B5 | S5 | SUS2 | SUS4, shortName: 'M7', name: 'Major 7th', group: 'common_chords', formula: [0, 4, 7, 11] },
  { id: 23, mods: B5 | S5, shortName: 'm,M7', name: 'Minor, Major 7th', group: 'common_chords', formula: [0, 3, 7, 11], accidentals: [[1, -1]] },
  { id: 24, mods: 0, shortName: '7/6', name: 'Seven-Six', group: 'common_chords', formula: [0, 4, 7, 9, 10], accidentals: [[4, -1]] },
  { id: 104, mods: 0, shortName: 'add9', name: 'Added 9th', group: 'common_chords', formula: [0, 4, 7, 14] },
  { id: 105, mods: 0, shortName: 'madd9', name: 'Minor Added 9th', group: 'common_chords', formula: [0, 3, 7, 14], accidentals: [[1, -1]] },
  { id: 25, mods: B5 | S5 | SUS4 | N7, shortName: '9', name: 'Ninth', group: 'ninths', formula: [0, 4, 7, 10, 14], accidentals: [[3, -1]] },
  { id: 101, mods: 0, shortName: 'M9', name: 'Major Ninth', group: 'ninths', formula: [0, 4, 7, 11, 14] },
  { id: 26, mods: B5 | S5 | N7, shortName: 'm9', name: 'Minor Ninth', group: 'ninths', formula: [0, 3, 7, 10, 14], accidentals: [[1, -1], [3, -1]] },
  { id: 27, mods: B5 | S5 | SUS4 | N7, shortName: '⁻9', name: 'Flat Ninth', group: 'ninths', formula: [0, 4, 7, 10, 13], accidentals: [[3, -1], [4, -1]] },
  { id: 28, mods: B5 | S5 | N7, shortName: 'm⁻9', name: 'Minor, Flat 9th', group: 'ninths', formula: [0, 3, 7, 10, 13], accidentals: [[1, -1], [3, -1], [4, -1]] },
  { id: 29, mods: B5 | S5 | SUS4 | N7, shortName: '9⁺', name: 'Augmented Ninth', group: 'ninths', formula: [0, 4, 7, 10, 15], accidentals: [[3, -1], [4, 1]] },
  { id: 30, mods: 0, shortName: '9/6', name: 'Nine-Six', group: 'ninths', formula: [0, 4, 7, 9, 14] },
  { id: 31, mods: 0, shortName: 'm9/6', name: 'Minor Nine-Six', group: 'ninths', formula: [0, 3, 7, 9, 14], accidentals: [[1, -1]] },
  { id: 106, mods: 0, shortName: 'add11', name: 'Added 11th', group: 'common_chords', formula: [0, 4, 7, 17] },
  { id: 107, mods: 0, shortName: 'madd11', name: 'Minor Added 11th', group: 'common_chords', formula: [0, 3, 7, 17], accidentals: [[1, -1]] },
  { id: 32, mods: B5 | S5 | N7 | B9 | S9, shortName: '11', name: 'Eleventh', group: 'elevenths', formula: [0, 4, 7, 10, 14, 17], accidentals: [[3, -1]] },
  { id: 102, mods: 0, shortName: 'M11', name: 'Major 11th', group: 'elevenths', formula: [0, 4, 7, 11, 14, 17] },
  { id: 33, mods: B5 | S5 | N7 | B9, shortName: 'm11', name: 'Minor Eleventh', group: 'elevenths', formula: [0, 3, 7, 10, 14, 17], accidentals: [[1, -1], [3, -1]] },
  { id: 34, mods: S5 | N7 | B9 | S9, shortName: '11⁺', name: 'Augmented 11th', group: 'elevenths', formula: [0, 4, 7, 10, 14, 18], accidentals: [[3, -1], [5, 1]] },
  { id: 35, mods: S5 | N7 | B9, shortName: 'm11⁺', name: 'Minor Augm. 11th', group: 'elevenths', formula: [0, 3, 7, 10, 14, 18], accidentals: [[1, -1], [3, -1], [5, 1]] },
  { id: 110, mods: 0, shortName: '11sus', name: '11th Suspended, 9sus4', group: 'elevenths', formula: [0, 7, 10, 14, 17], accidentals: [[2, -1]] },
  { id: 108, mods: 0, shortName: 'add13', name: 'Added 13th', group: 'common_chords', formula: [0, 4, 7, 21] },
  { id: 109, mods: 0, shortName: 'madd13', name: 'Minor Added 13th', group: 'common_chords', formula: [0, 3, 7, 21], accidentals: [[1, -1]] },
  { id: 36, mods: B5 | S5 | N7 | B9 | S9, shortName: '13', name: 'Thirteenth', group: 'thirteenths', formula: [0, 4, 7, 10, 14, 17, 21], accidentals: [[3, -1]] },
  { id: 103, mods: 0, shortName: 'M13', name: 'Major 13th', group: 'thirteenths', formula: [0, 4, 7, 11, 14, 17, 21] },
  { id: 37, mods: B5 | S5 | N7 | B9, shortName: 'm13', name: 'Minor Thirteenth', group: 'thirteenths', formula: [0, 3, 7, 10, 14, 17, 21], accidentals: [[1, -1], [3, -1]] },
  { id: 38, mods: S5 | N7 | B9 | S9, shortName: '13#11', name: '13th Augm. 11th', group: 'thirteenths', formula: [0, 4, 7, 10, 14, 18, 21], accidentals: [[3, -1], [5, 1]] },
  { id: 39, mods: B5 | N7 | B9, shortName: 'm13#11', name: 'Min. 13th Augm. 11th', group: 'thirteenths', formula: [0, 3, 7, 10, 14, 18, 21], accidentals: [[1, -1], [3, -1], [5, 1]] },
  { id: 111, mods: 0, shortName: '11sus#13', name: '11th Suspended, Sharp 13th', group: 'thirteenths', formula: [0, 7, 10, 14, 17, 22], accidentals: [[2, -1], [5, 1]] },
];

function cloneDef(d: ChordDef): ChordDef {
  return {
    ...d,
    formula: [...d.formula],
    accidentals: d.accidentals.map((a) => ({ ...a })),
    degrees: d.degrees.map((g) => ({ ...g })),
  };
}

function buildChords(): ChordDef[] {
  const out: ChordDef[] = [];
  for (const r of BASE_ROWS) {
    let formula: number[];
    let accidentals: { index: number; acc: number }[];
    let degrees: Degree[] = [];
    const staticDegrees = !!r.degrees;
    if (r.degrees) {
      // Chord ctor with degrees: formula = NoteToSemitone(pos, acc); accidentals = non-default degrees
      degrees = r.degrees.map(([pos, acc]) => ({ pos, acc }));
      formula = degrees.map((g) => Math.floor(g.pos / 7) * 12 + STAFF_NOTES[g.pos % 7] + g.acc);
      accidentals = degrees.map((g, i) => ({ index: i, acc: g.acc })).filter((a) => a.acc !== 0);
    } else {
      formula = [...(r.formula as number[])];
      accidentals = (r.accidentals ?? []).map(([index, acc]) => ({ index, acc }));
    }
    const def: ChordDef = {
      id: r.id, shortName: r.shortName, buttonName: r.buttonName ?? r.shortName, name: r.name, group: r.group,
      formula, accidentals, degrees, maxInversions: formula.length - 1, variantOf: null,
      rootAdjustment: r.rootAdjustment ?? null,
    };
    generateDegrees(def, staticDegrees);
    out.push(def);
    if (!r.mods) continue;
    let next = def.id * 100;
    const variant = (mutate: (c: ChordDef) => void, nameSuffix: string, shortSuffix: string): void => {
      const c = cloneDef(def);
      c.id = next++;
      c.variantOf = def.id;
      mutate(c);
      c.name = def.name + nameSuffix;
      c.shortName = def.shortName + shortSuffix;
      c.buttonName = c.shortName;
      generateDegrees(c, false);
      out.push(c);
    };
    if (r.mods & SUS2) variant((c) => { c.formula[1] = 2; }, ' sus2', 'sus2');
    if (r.mods & SUS4) variant((c) => { c.formula[1] = 5; }, ' sus4', 'sus4');
    if (r.mods & B5) variant((c) => { c.formula[2]--; c.accidentals.push({ index: 2, acc: ACC.Flat }); }, ' ⁻5' + (def.id === 20 ? ', ø' : ''), '⁻5');
    if (r.mods & S5) variant((c) => { c.formula[2]++; c.accidentals.push({ index: 2, acc: ACC.Sharp }); }, ' ⁺5', '⁺5');
    if (r.mods & N7) variant((c) => {
      c.formula[3] = 10;
      const k = c.accidentals.findIndex((a) => a.index === 3);
      if (k >= 0) c.accidentals.splice(k, 1);
      c.accidentals.push({ index: 3, acc: ACC.Flat });
    }, ' 7', '7');
    if (r.mods & B9) variant((c) => { c.formula[4]--; c.accidentals.push({ index: 4, acc: ACC.Flat }); }, ' ⁻9', '⁻9');
    if (r.mods & S9) variant((c) => { c.formula[4]++; c.accidentals.push({ index: 4, acc: ACC.Sharp }); }, ' ⁺9', '⁺9');
  }
  return out;
}

/** Every chord the app creates, ids 1..9 included (ChordService.Chords order). */
export const CHORDS: ChordDef[] = buildChords();
const BY_ID = new Map(CHORDS.map((c) => [c.id, c]));
export const chordById = (id: number): ChordDef | undefined => BY_ID.get(id);

// ---------------------------------------------------------------------------
// Chord symbols  (ChordSymbols)
// ---------------------------------------------------------------------------

export type ChordSymbolStyle = 'International' | 'Jazz' | 'French' | 'Asian' | 'Brazilian';
const STYLE_INDEX: Record<ChordSymbolStyle, number> = { International: 0, Jazz: 1, French: 2, Asian: 3, Brazilian: 4 };

interface SymRow { f: number[]; core: string[]; tensions: string[] }
const R = (f: number[], intl: string, jazz?: string | null, french?: string | null, asian?: string | null, brazilian?: string | null, ...tensions: string[]): SymRow => ({
  f, core: [intl, jazz ?? intl, french ?? intl, asian ?? intl, brazilian ?? intl], tensions,
});

/** ChordSymbols.Table – verbatim. */
export const SYMBOL_TABLE: Record<number, SymRow> = {
  10: R([0, 4, 7], ''),
  11: R([0, 3, 7], 'm', '−'),
  12: R([0, 3, 6], 'dim', '°', null, null, '°'),
  13: R([0, 4, 8], '+', '+', '5+', 'aug', '5+'),
  14: R([0, 2, 7], 'sus2'),
  15: R([0, 5, 7], 'sus4'),
  16: R([0, 4, 6], '', null, null, null, null, '♭5'),
  100: R([0, 7], '5'),
  17: R([0, 4, 7, 9], '6'),
  18: R([0, 3, 7, 9], 'm6', '−6'),
  19: R([0, 4, 7, 10], '7'),
  20: R([0, 3, 7, 10], 'm7', '−7'),
  21: R([0, 3, 6, 9], 'dim7', '°7', null, null, '°7'),
  22: R([0, 4, 7, 11], 'maj7', 'Δ7', '7M', 'M7', '7M'),
  23: R([0, 3, 7, 11], 'm(maj7)', '−Δ7', 'm7M', 'mM7', 'm7M'),
  24: R([0, 4, 7, 9, 10], '7(13)'),
  104: R([0, 4, 7, 14], 'add9', null, null, null, '(9)'),
  105: R([0, 3, 7, 14], 'm(add9)', '−(add9)', null, 'madd9', 'm(9)'),
  25: R([0, 4, 7, 10, 14], '9', null, null, null, '7(9)'),
  101: R([0, 4, 7, 11, 14], 'maj9', 'Δ9', '7M(9)', 'M9', '7M(9)'),
  26: R([0, 3, 7, 10, 14], 'm9', '−9', null, null, 'm7(9)'),
  27: R([0, 4, 7, 10, 13], '7', null, null, null, null, '♭9'),
  28: R([0, 3, 7, 10, 13], 'm7', '−7', null, null, null, '♭9'),
  29: R([0, 4, 7, 10, 15], '7', null, null, null, null, '♯9'),
  30: R([0, 4, 7, 9, 14], '6/9', null, null, '6(9)', '6(9)'),
  31: R([0, 3, 7, 9, 14], 'm6/9', '−6/9', null, 'm6(9)', 'm6(9)'),
  106: R([0, 4, 7, 17], 'add11', null, null, null, '(11)'),
  107: R([0, 3, 7, 17], 'm(add11)', '−(add11)', null, 'madd11', 'm(11)'),
  32: R([0, 4, 7, 10, 14, 17], '11', null, null, null, '7(9,11)'),
  102: R([0, 4, 7, 11, 14, 17], 'maj11', 'Δ11', '7M(11)', 'M11', '7M(9,11)'),
  33: R([0, 3, 7, 10, 14, 17], 'm11', '−11', null, null, 'm7(9,11)'),
  34: R([0, 4, 7, 10, 14, 18], '9', null, null, null, '7(9)', '♯11'),
  35: R([0, 3, 7, 10, 14, 18], 'm9', '−9', null, null, 'm7(9)', '♯11'),
  110: R([0, 7, 10, 14, 17], '9sus4'),
  108: R([0, 4, 7, 21], 'add13', null, null, null, '(13)'),
  109: R([0, 3, 7, 21], 'm(add13)', '−(add13)', null, 'madd13', 'm(13)'),
  36: R([0, 4, 7, 10, 14, 17, 21], '13', null, null, null, '7(9,13)'),
  103: R([0, 4, 7, 11, 14, 17, 21], 'maj13', 'Δ13', '7M(13)', 'M13', '7M(9,13)'),
  37: R([0, 3, 7, 10, 14, 17, 21], 'm13', '−13', null, null, 'm7(9,13)'),
  38: R([0, 4, 7, 10, 14, 18, 21], '13', null, null, null, '7(9,13)', '♯11'),
  39: R([0, 3, 7, 10, 14, 18, 21], 'm13', '−13', null, null, 'm7(9,13)', '♯11'),
  111: R([0, 7, 10, 14, 17, 22], '9sus4'),
};
const BASE_ALIASES = new Set([110, 111]);

const pcSet = (formula: number[], root = 0): Set<number> => new Set(formula.map((v) => pc(v - root)));

/** ChordSymbols.Alteration: null = same set (alias), "?" = not a single recognised alteration. */
function alteration(baseFormula: number[], alt: Set<number>): string | null {
  const base = new Set(baseFormula.map(pc));
  const missing = [...base].filter((p) => !alt.has(p));
  const extra = [...alt].filter((p) => !base.has(p));
  if (missing.length === 0 && extra.length === 0) return null;
  if (missing.length === 1 && missing[0] === 7 && extra.length === 0 && alt.has(6)) return '♭5';
  if (missing.length === 1 && extra.length === 1) {
    const m = missing[0], e = extra[0];
    if (m === 7 && e === 6) return '♭5';
    if (m === 7 && e === 8) return '♯5';
    if (m === 4 && e === 2) return 'sus2';
    if (m === 4 && e === 5) return 'sus4';
    if (m === 2 && e === 1) return '♭9';
    if (m === 2 && e === 3) return '♯9';
  }
  return '?';
}

const digitsOf = (t: string): number => parseInt(t.replace(/\D/g, '') || '0', 10);
function tensionOrder(t: string): number {
  const k = t.startsWith('♭') ? 0 : t.startsWith('♯') ? 2 : 1;
  return digitsOf(t) * 10 + k;
}
const isDigit = (ch: string | undefined): boolean => ch !== undefined && ch >= '0' && ch <= '9';

function stableSortBy<T>(arr: T[], key: (x: T) => number): T[] {
  return arr.map((x, i) => [x, i] as const).sort((a, b) => key(a[0]) - key(b[0]) || a[1] - b[1]).map((p) => p[0]);
}

function render(core: string, tensionList: string[], style: ChordSymbolStyle): string {
  const list = stableSortBy([...tensionList], tensionOrder);
  if (style === 'Jazz' && core.startsWith('−') && core.length > 1 && isDigit(core[1])) {
    const k = list.indexOf('♭5');
    if (k >= 0) { list.splice(k, 1); core = 'ø' + core.substring(1); }
  }
  if (list.length === 0) return core;
  const text = list.join(',');
  if (core.length === 0) return '(' + text + ')';
  if (core.endsWith(')')) {
    const open = core.lastIndexOf('(');
    const source = core.substring(open + 1, core.length - 1).split(',').filter((t) => t.length > 0);
    if (source.some((t) => !isDigit(t[0]) && t[0] !== '♭' && t[0] !== '♯')) {
      return core.substring(0, core.length - 1) + ',' + text + ')';
    }
    const altered = new Set(list.map(digitsOf));
    const values = stableSortBy(source.filter((t) => !isDigit(t[0]) || !altered.has(digitsOf(t))).concat(list), tensionOrder);
    return core.substring(0, open) + '(' + values.join(',') + ')';
  }
  const parenStyle = style === 'French' || style === 'Asian' || style === 'Brazilian';
  const endsDigit = isDigit(core[core.length - 1]) && !core.endsWith('sus2') && !core.endsWith('sus4');
  if (!parenStyle && list.length === 1 && endsDigit) return core + list[0];
  return core + '(' + text + ')';
}

function ninthToSeventh(core: string): string {
  if (core.endsWith('7M(9)')) return core.substring(0, core.length - 3);
  if (core.endsWith('9') && !core.endsWith('6/9')) return core.substring(0, core.length - 1) + '7';
  return core;
}
function withSus(core: string, sus: string): string {
  const k = core.indexOf('(');
  return k >= 0 ? core.substring(0, k) + sus + core.substring(k) : core + sus;
}

/** ChordSymbols.Plain: strip markup, ⁻ → ♭, ⁺ → ♯. */
export const plainSymbol = (s: string): string => (s ? s.replace(/<[^>]*>/g, '').replace(/⁻/g, '♭').replace(/⁺/g, '♯') : '');

/** ChordSymbols.Symbol(chordId, formula, rootValue, fallback, style). formula is relative to the root (root 0). */
export function chordSymbol(def: ChordDef, style: ChordSymbolStyle = 'International'): string {
  const row = SYMBOL_TABLE[def.id];
  const si = STYLE_INDEX[style];
  if (row) return render(row.core[si], row.tensions, style);
  const base = SYMBOL_TABLE[Math.floor(def.id / 100)];
  if (def.id >= 1000 && base) {
    const text = alteration(base.f, pcSet(def.formula));
    if (text === '?') return plainSymbol(def.shortName);
    let core = base.core[si];
    const list = [...base.tensions];
    if (text === 'sus2' || text === 'sus4') core = withSus(core, text);
    else if (text === '♭9' || text === '♯9') { core = ninthToSeventh(core); list.push(text); }
    else if (text !== null) list.push(text);
    return render(core, list, style);
  }
  return plainSymbol(def.shortName);
}

/** ChordSymbols.IsAlias: 110, 111, and every Alts variant whose pitch-class set equals its base chord. */
export function isAlias(def: ChordDef): boolean {
  if (BASE_ALIASES.has(def.id)) return true;
  if (def.id < 1000) return false;
  const base = SYMBOL_TABLE[Math.floor(def.id / 100)];
  if (!base) return false;
  return alteration(base.f, pcSet(def.formula)) === null;
}

/** ChordSymbols.Gap: a space between root and symbol only in two cases. */
export function gap(root: string, symbol: string): string {
  if (!root || !symbol) return '';
  const c = root[root.length - 1];
  if (isDigit(c) && isDigit(symbol[0])) return ' ';
  const letters = [...root].filter((ch) => /\p{L}/u.test(ch)).length;
  if (letters >= 2 && /\p{Ll}/u.test(c) && ['add', 'sus', 'dim', 'aug'].some((w) => symbol.startsWith(w))) return ' ';
  return '';
}

/** ChordSymbols.WithBass: "6/9" becomes "6(9)" before a slash bass. */
export function withBass(name: string, bass: string | null | undefined): string {
  if (!bass) return name ?? '';
  return (name.includes('6/9') ? name.replace('6/9', '6(9)') : name) + '/' + bass;
}

/** ChordNamer.Difficulty – fixed table, else 4 + distinct pitch classes (+2 for Alts variants). */
export function difficulty(def: ChordDef): number {
  const table: Record<number, number> = {
    10: 0, 11: 1, 100: 1, 19: 2, 20: 3, 22: 3, 15: 3, 14: 4, 12: 4, 17: 4,
    13: 5, 18: 5, 104: 5, 2000: 5, 21: 5, 1901: 5, 105: 6, 25: 6, 101: 6, 26: 6, 23: 7, 30: 7,
  };
  if (def.id in table) return table[def.id];
  return 4 + pcSet(def.formula).size + (def.id >= 1000 ? 2 : 0);
}

/** Chord ids the dictionary screens and the reverse lookup iterate (Id > 9 and not an alias). */
export const DICTIONARY_CHORDS: ChordDef[] = CHORDS.filter((c) => c.id > 9 && !isAlias(c));

// ---------------------------------------------------------------------------
// Scale spelling helpers  (ScaleService.FormatScale for the Major scale, GetMajorAccidentals)
// ---------------------------------------------------------------------------

const MAJOR_STEPS = [2, 2, 1, 2, 2, 2, 1];

/** FormatScale(Major, root): seven spelled degrees + octave. */
export function majorScale(root: Spelled): Spelled[] {
  const out: Spelled[] = [root];
  for (let i = 1; i < 7; i++) {
    const prev = out[i - 1];
    const letter = (root.letter + i) % 7;
    // GetAccidentalForNote: num = natural.Value - prev.Value (pitch classes); d = interval - num; wrap to [-3, 3]
    let d = MAJOR_STEPS[i - 1] - (pc(STAFF_NOTES[letter]) - spelledPc(prev));
    if (d > 3) d -= 12;
    if (d < -3) d += 12;
    out.push({ letter, acc: d });
  }
  out.push(root);
  return out;
}

/** ScaleService.GetMajorAccidentals: number of sharps or flats in the major key on this spelling. */
export function majorAccidentals(root: Spelled): number {
  const sc = majorScale(root);
  let sharps = 0, flats = 0;
  for (const s of sc) { if (s.acc > 0) sharps += s.acc; else if (s.acc < 0) flats += -s.acc; }
  if (root.acc !== 0) { sharps--; flats--; }
  if (sharps === 0 && flats === 0) return 0;
  if (sharps > 0) return sharps;
  return flats > 0 ? flats : 0;
}

// ---------------------------------------------------------------------------
// Transposition and inversion  (ChordService.formateChord / inversionTransform)
// ---------------------------------------------------------------------------

export interface FormattedChord {
  def: ChordDef;
  root: Spelled;
  inversion: number;
  /** absolute semitones after transposition and inversion, normalised so the lowest note is in 0..11 */
  formula: number[];
  degrees: Degree[];
}

export function formatChord(def: ChordDef, root: Spelled, inversion: number): FormattedChord {
  if (inversion > def.maxInversions) throw new Error('inversion_is_not_supported');
  const r = spelledPc(root);
  const f = def.formula.map((x) => r + x);
  const deg = def.degrees.map((g) => ({ ...g }));
  for (let i = 0; i < inversion; i++) {
    const moved = f[0] + 12;
    f.shift();
    let idx = f.findIndex((v) => v >= moved);
    if (idx < 0) idx = f.length;
    f.splice(idx, 0, moved);
    const d0 = deg.shift() as Degree;
    deg.splice(idx, 0, { pos: d0.pos, acc: d0.acc });
  }
  const off = Math.floor(Math.min(...f) / 12) * 12;
  return { def, root, inversion, formula: f.map((v) => v - off), degrees: deg };
}

/** Chord.IsMajor / IsMinor / IsDiminished / IsAugmented via degrees (letter 2 = third, letter 4 = fifth). */
const hasDegree = (degs: Degree[], pos: number, acc: number | null): boolean =>
  degs.some((d) => d.pos === pos && (acc === null || d.acc === acc));
export const chordQuality = (degs: Degree[]) => ({
  major: hasDegree(degs, 2, 0) && hasDegree(degs, 4, 0),
  minor: hasDegree(degs, 2, -1) && hasDegree(degs, 4, 0),
  diminished: hasDegree(degs, 2, -1) && hasDegree(degs, 4, -1),
  augmented: hasDegree(degs, 2, 0) && hasDegree(degs, 4, 1),
});
const isCommon = (degs: Degree[]): boolean => {
  const q = chordQuality(degs);
  return q.major || q.minor || q.diminished || q.augmented;
};

/** ChordService.ToNotesOnStaff + NoteService.GetNoteName: spelled chord tones in formula order. */
export function chordToneSpellings(def: ChordDef, root: Spelled, inversion = 0): Spelled[] {
  const major = majorScale(root);
  // NotesOnStaff keeps letters; only the letter and accidental matter for names.
  const degs = formatChord(def, root, inversion).degrees;
  return degs.map((d) => {
    const m = major[d.pos % 7];
    return { letter: m.letter, acc: m.acc + d.acc };
  });
}

// ---------------------------------------------------------------------------
// 1) Reverse lookup used by the macOS UI  (ChordService.findChordByFormulaPart)
// ---------------------------------------------------------------------------

export type ChordsFilterMode = 'All' | 'Major' | 'Minor' | 'Diminished' | 'Augmented' | 'Sevenths' | 'Ninths' | 'Elevenths' | 'Thirteenths';

export interface ReverseLookupOptions {
  /** Settings.IsStrictSearch: candidate must have exactly as many notes as were played (after de-duplication). */
  isStrict?: boolean;
  /** true only when ChordsPro is owned and Settings.ReverseModeWithoutInversions is off. */
  includeInversions?: boolean;
  /** ChordTypeSegmentedControl filter. */
  mode?: ChordsFilterMode;
}

export interface ReverseLookupResult {
  chord: FormattedChord;
  /** ChordService.GetPopularityScore (lower is better) */
  score: number;
  /** root name + space + English long name (+ " (n)" for inversions), as GeneralItemController shows by default */
  fullName: string;
  /** compact symbol label, e.g. "C♯m7" or "E/G♯" (ChordNamer.NameWithInversion) */
  symbol: string;
}

/** ChordService.SimplifyFormula: drop duplicated pitch classes at the outer edges, then move into the first octave. */
export function simplifyFormula(formula: number[]): number[] {
  if (formula.length === 0) return formula;
  let list = [...formula];
  for (;;) {
    const counts = new Map<number, number>();
    for (const t of list) counts.set(t % 12, (counts.get(t % 12) ?? 0) + 1);
    const dup = [...counts].filter(([, n]) => n > 1).map(([k]) => k);
    if (dup.length === 0) break;
    const lo = Math.min(...list), hi = Math.max(...list);
    const loDup = dup.includes(lo % 12), hiDup = dup.includes(hi % 12);
    const without = (v: number) => { const c = [...list]; c.splice(c.indexOf(v), 1); return c; };
    if (loDup && hiDup) {
      const a = without(lo), b = without(hi);
      list = Math.abs(Math.min(...a) - Math.max(...a)) < Math.abs(Math.min(...b) - Math.max(...b)) ? a : b;
    } else if (loDup) list = without(lo);
    else if (hiDup) list = without(hi);
    else break;
  }
  const off = Math.floor(Math.min(...list) / 12) * 12;
  return list.map((t) => t - off);
}

let ALL_READY: FormattedChord[] | null = null;
/** ChordService.prepareAllChords(): every dictionary chord × inversions 0..6 × 21 root spellings (chord-major order). */
export function allChordsReady(): FormattedChord[] {
  if (ALL_READY) return ALL_READY;
  const list: FormattedChord[] = [];
  for (const def of DICTIONARY_CHORDS) {
    for (let inv = 0; inv < 7; inv++) {
      if (def.maxInversions < inv) continue;
      for (const root of SEMITONE_VALUES) list.push(formatChord(def, root, inv));
    }
  }
  return (ALL_READY = list);
}

function passesMode(c: FormattedChord, mode: ChordsFilterMode): boolean {
  const d = c.degrees;
  switch (mode) {
    case 'All': return true;
    case 'Major': return hasDegree(d, 2, 0) && hasDegree(d, 4, 0);
    case 'Minor': return hasDegree(d, 2, -1) && hasDegree(d, 4, 0);
    case 'Diminished': return hasDegree(d, 2, -1) && hasDegree(d, 4, -1);
    case 'Augmented': return hasDegree(d, 2, 0) && hasDegree(d, 4, 1);
    // findChordByFormulaPart requires a natural (major) 7th/9th/11th/13th degree here (AccidentalType.Default)
    case 'Sevenths': return hasDegree(d, 6, 0);
    case 'Ninths': return hasDegree(d, 8, 0);
    case 'Elevenths': return hasDegree(d, 10, 0);
    case 'Thirteenths': return hasDegree(d, 12, 0);
  }
}

function popularityScore(c: FormattedChord, fp: number[]): number {
  const base: Record<number, number> = { 10: 10, 11: 20, 12: 30, 13: 40, 19: 50, 22: 60, 20: 70 };
  let n = base[c.def.id] ?? 1000;
  if (c.inversion > 0) n += 10;
  if (n < 100 && fp[0] === spelledPc(c.root)) n -= 15;
  if (fp.length === c.formula.length) n -= 50;
  n += majorAccidentals(c.root);
  return n + fp.length * 20;
}

/** Long English name as GeneralItemController/ChordServiceHelper.FullName shows it: "C♯ Minor 7th (1)". */
export function fullName(c: FormattedChord): string {
  return noteName(c.root) + ' ' + c.def.name + (c.inversion > 0 ? ' (' + c.inversion + ')' : '');
}

/** ChordNamer.NameWithInversion: symbol label with slash bass for inversions. */
export function symbolLabel(c: FormattedChord, style: ChordSymbolStyle = 'International'): string {
  const rootName = noteName(c.root);
  const sym = chordSymbol(c.def, style);
  let label = rootName + gap(rootName, sym) + sym;
  if (c.inversion > 0) {
    const bassPc = pc(Math.min(...c.formula));
    const tones = chordToneSpellings(c.def, c.root, 0);
    const hit = tones.find((t) => spelledPc(t) === bassPc);
    if (hit) label = withBass(label, noteName(hit));
    else if (bassPc !== spelledPc(c.root)) label = withBass(label, foreignNoteName(bassPc, keyFifths(c.def, c.root)));
  }
  return label;
}

/**
 * The reverse chord lookup the macOS "By keys" chord screen performs.
 * `notes` are key indexes as PianoKeyboard.SelectedNotes stores them (0 = C4 / MIDI 60) or MIDI numbers
 * (the app subtracts floor(min/12)*12 from MIDI input first; simplifyFormula does the same).
 * Matching is by exact semitone position inside the candidate's close voicing, not by pitch class:
 * every played (de-duplicated) note must occur in the chord's formula for that root and inversion.
 */
export function findChordByFormulaPart(notes: number[], opts: ReverseLookupOptions = {}): ReverseLookupResult[] {
  const { isStrict = false, includeInversions = false, mode = 'All' } = opts;
  const arr = simplifyFormula(notes);
  if (arr.length === 0) return [];
  const hits: FormattedChord[] = [];
  for (const c of allChordsReady()) {
    if (!includeInversions && c.inversion > 0) continue;
    if (isStrict && c.formula.length !== arr.length) continue;
    if (!passesMode(c, mode)) continue;
    if (arr.every((v) => c.formula.includes(v))) hits.push(c);
  }
  const fp = [...arr].sort((a, b) => a - b);
  const scored = hits.map((c, i) => ({ c, i, s: popularityScore(c, fp) }));
  scored.sort((a, b) => a.s - b.s || a.i - b.i); // LINQ OrderBy is stable
  return scored.map(({ c, s }) => ({ chord: c, score: s, fullName: fullName(c), symbol: symbolLabel(c) }));
}

// ---------------------------------------------------------------------------
// 2) ChordNamer (shared engine namer; present in the macOS build, used for labels, not for the key search)
// ---------------------------------------------------------------------------

export type ChordNamerLevel = 'Beginner' | 'Basic' | 'Comfortable' | 'Advanced';
export type ChordNameKind = 'Root' | 'Inversion' | 'Omitted' | 'ForeignBass';
const KIND_ORDER: Record<ChordNameKind, number> = { Root: 0, Inversion: 1, Omitted: 2, ForeignBass: 3 };

interface Profile { difficultyCap: number; difficultyWeight: number; foreignBassPenalty: number }
export function profileFor(level: ChordNamerLevel): Profile {
  switch (level) {
    case 'Beginner': return { difficultyCap: 4, difficultyWeight: 1, foreignBassPenalty: 8 };
    case 'Basic': return { difficultyCap: 6, difficultyWeight: 1, foreignBassPenalty: 6 };
    case 'Comfortable': return { difficultyCap: Number.MAX_VALUE, difficultyWeight: 1, foreignBassPenalty: 6 };
    case 'Advanced': return { difficultyCap: Number.MAX_VALUE, difficultyWeight: 0.5, foreignBassPenalty: 4 };
  }
}
/** ChordNamer.LevelFromSkillKey (onboarding skill answers). */
export function levelFromSkillKey(key: string | null | undefined): ChordNamerLevel {
  switch ((key ?? '').trim().toLowerCase()) {
    case 'just_starting': return 'Beginner';
    case 'know_a_few': return 'Basic';
    case 'comfortable': case 'comfortable_reading': return 'Comfortable';
    case 'advanced': return 'Advanced';
    default: return 'Basic';
  }
}

export const NAMER = {
  DefaultMaxCandidates: 3, InversionPenalty: 3, OmitPenalty: 3, ForeignBassPenalty: 6, SpellingWeight: 0.01,
  AboveLevelPenalty: 100, MaxUpperStructureDifficulty: 7, MaxScoreGap: 7, PrecacheDifficulty: 6,
} as const;

const LETTER_FIFTHS: Record<number, number> = { 5: -1, 0: 0, 7: 1, 2: 2, 9: 3, 4: 4, 11: 5 };
function isMinorType(def: ChordDef): boolean {
  const s = pcSet(def.formula);
  return s.has(3) && !s.has(4);
}
/** ChordNamer.KeyFifths: position of the chord's key on the circle of fifths (minor-type chords use the relative major). */
export function keyFifths(def: ChordDef, root: Spelled): number {
  let n = LETTER_FIFTHS[STAFF_NOTES[root.letter]] ?? 0;
  if (root.acc === 1) n += 7; else if (root.acc === -1) n -= 7;
  return isMinorType(def) ? n - 3 : n;
}
/** ChordNamer.ForeignNoteName: non-chord bass named with flats in flat keys, sharps otherwise. */
export function foreignNoteName(p: number, kf: number): string {
  return noteName((kf < 0 ? NOTES_WITH_FLATS : NOTES_WITH_SHARPS)[pc(p)]);
}
/** ChordNamer.DegreeNumber: interval in semitones → chord-degree number for "(no5)" style labels. */
export function degreeNumber(interval: number): number {
  const m: Record<number, number> = { 0: 1, 1: 2, 2: 2, 3: 3, 4: 3, 5: 4, 6: 5, 7: 5, 8: 5, 9: 6, 10: 7, 11: 7, 13: 9, 14: 9, 15: 9, 17: 11, 18: 11, 20: 13, 21: 13, 22: 13 };
  return m[interval] ?? interval;
}

interface Entry { def: ChordDef; root: Spelled; rootPc: number; mask: number; toneCount: number; intervalByPc: Map<number, number>; difficulty: number; keyAccidentals: number }
const bitCount = (v: number): number => { let n = 0; while (v) { v &= v - 1; n++; } return n; };

let ENTRIES: Entry[] | null = null;
/** ChordNamer.Entries(): one entry per (chord, root pitch class) with the spelling that has the fewest key accidentals. */
function entries(): Entry[] {
  if (ENTRIES) return ENTRIES;
  const list: Entry[] = [];
  for (const def of DICTIONARY_CHORDS) {
    if (def.formula.length < 2) continue;
    const diff = difficulty(def);
    const byPc = new Map<number, Entry>();
    for (const root of NOTES_WITH_SHARPS_FLATS) {
      const rp = spelledPc(root);
      const kf = keyFifths(def, root);
      const ka = Math.abs(kf);
      const prev = byPc.get(rp);
      if (prev) {
        if (prev.keyAccidentals < ka) continue;
        if (prev.keyAccidentals === ka && isMinorType(def) !== kf < 0) continue;
      }
      const ibp = new Map<number, number>();
      let mask = 0;
      for (const iv of def.formula) {
        const p = pc(rp + iv);
        mask |= 1 << p;
        if (!ibp.has(p)) ibp.set(p, iv);
      }
      byPc.set(rp, { def, root, rootPc: rp, mask, toneCount: bitCount(mask), intervalByPc: ibp, difficulty: diff, keyAccidentals: ka });
    }
    list.push(...byPc.values());
  }
  // group by (RootPc, Mask), keep the easiest (then lowest id); LINQ GroupBy keeps first-seen key order
  const groups = new Map<string, Entry[]>();
  for (const e of list) {
    const k = e.rootPc + '|' + e.mask;
    const g = groups.get(k);
    if (g) g.push(e); else groups.set(k, [e]);
  }
  ENTRIES = [...groups.values()].map((g) => [...g].sort((a, b) => a.difficulty - b.difficulty || a.def.id - b.def.id)[0]);
  return ENTRIES;
}

function isOmittable(e: Entry, interval: number, playedMask: number): boolean {
  if (interval === 7) {
    for (const [p, iv] of e.intervalByPc) if ((iv === 3 || iv === 4) && (playedMask & (1 << p)) !== 0) return true;
    return false;
  }
  const values = [...e.intervalByPc.values()];
  if (interval === 14 && (values.includes(17) || values.includes(18) || values.includes(21))) return true;
  if (interval === 17 && values.includes(21)) return true;
  return false;
}
const maxOmitted = (e: Entry): number => (e.toneCount < 6 ? 1 : 2);

interface Pending { e: Entry; kind: ChordNameKind; bassPc: number; omitted: number[]; score: number; levelShift: number }
const finalScore = (p: Pending) => p.score + 0.01 * p.e.keyAccidentals;
const rawScore = (p: Pending) => p.score - p.levelShift + 0.01 * p.e.keyAccidentals;

function match(e: Entry, mask: number, bassPc: number, prof: Profile): Pending | null {
  const bassBit = 1 << bassPc;
  const bassInChord = (e.mask & bassBit) !== 0;
  const num2 = e.difficulty * prof.difficultyWeight + (e.difficulty > prof.difficultyCap ? 100 : 0);
  const shift = num2 - e.difficulty;
  if (mask === e.mask) {
    const isRoot = bassPc === e.rootPc;
    return { e, kind: isRoot ? 'Root' : 'Inversion', bassPc, omitted: [], score: num2 + (isRoot ? 0 : 3), levelShift: shift };
  }
  if ((mask & ~e.mask) === 0) {
    if ((mask & (1 << e.rootPc)) === 0) return null;
    const missing = e.mask & ~mask;
    const omitted: number[] = [];
    for (let i = 0; i < 12; i++) {
      if ((missing & (1 << i)) === 0) continue;
      const iv = e.intervalByPc.get(i) as number;
      if (!isOmittable(e, iv, mask)) return null;
      omitted.push(iv);
    }
    if (omitted.length > maxOmitted(e)) return null;
    omitted.sort((a, b) => a - b);
    return { e, kind: 'Omitted', bassPc, omitted, score: num2 + 3 * omitted.length + (bassPc === e.rootPc ? 0 : 3), levelShift: shift };
  }
  if (!bassInChord && e.toneCount >= 3 && e.difficulty <= 7 && (mask & ~bassBit) === e.mask) {
    return { e, kind: 'ForeignBass', bassPc, omitted: [], score: num2 + prof.foreignBassPenalty, levelShift: shift + prof.foreignBassPenalty - 6 };
  }
  return null;
}

export interface ChordNameCandidate {
  chordId: number;
  root: string;
  kind: ChordNameKind;
  bassPitchClass: number;
  bassName: string | null;
  /** 0 = root position, n = chord tone n (by interval order) in the bass, -1 = foreign bass */
  inversion: number;
  omittedIntervals: number[];
  score: number;
  rawScore: number;
  label: string;
}

/** ChordNamer.Label */
export function namerLabel(def: ChordDef, root: Spelled, omitted: number[] | null, bassName: string | null, style: ChordSymbolStyle = 'International'): string {
  const r = noteName(root);
  const sym = chordSymbol(def, style);
  let t = r + gap(r, sym) + sym;
  if (omitted && omitted.length > 0) {
    const no = 'no' + omitted.map(degreeNumber).join(',');
    t = t.endsWith(')') ? t.substring(0, t.length - 1) + ',' + no + ')' : t + '(' + no + ')';
  }
  if (bassName) t = withBass(t, bassName);
  return t;
}

function inversionIndex(def: ChordDef, root: Spelled, bassPc: number): number {
  const r = spelledPc(root);
  const pcs = [...new Set(def.formula.map((f) => pc(r + f)))];
  const sorted = stableSortBy(pcs, (p) => pc(p - r));
  const k = sorted.indexOf(pc(bassPc));
  return k >= 0 ? k : 0;
}

function build(p: Pending, style: ChordSymbolStyle): ChordNameCandidate {
  const e = p.e;
  let bassName: string | null = null;
  let inversion = 0;
  if (p.bassPc !== e.rootPc) {
    if ((e.mask & (1 << p.bassPc)) !== 0) {
      inversion = inversionIndex(e.def, e.root, p.bassPc);
      const tone = chordToneSpellings(e.def, e.root, 0).find((t) => spelledPc(t) === p.bassPc);
      bassName = tone ? noteName(tone) : foreignNoteName(p.bassPc, keyFifths(e.def, e.root));
    } else {
      inversion = -1;
      bassName = foreignNoteName(p.bassPc, keyFifths(e.def, e.root));
    }
  }
  return {
    chordId: e.def.id, root: noteName(e.root), kind: p.kind, bassPitchClass: p.bassPc, bassName, inversion,
    omittedIntervals: p.omitted, score: finalScore(p), rawScore: rawScore(p),
    label: namerLabel(e.def, e.root, p.omitted, bassName, style),
  };
}

/** ChordNamer.Name(notes, maxCandidates = 3, level = Comfortable). notes: MIDI numbers or any absolute semitones. */
export function nameChord(notes: number[], maxCandidates = 3, level: ChordNamerLevel = 'Comfortable', style: ChordSymbolStyle = 'International'): ChordNameCandidate[] {
  if (!notes || maxCandidates <= 0) return [];
  let mask = 0, low = Number.MAX_SAFE_INTEGER;
  for (const n of notes) if (n >= 0) { mask |= 1 << pc(n); if (n < low) low = n; }
  if (low === Number.MAX_SAFE_INTEGER || bitCount(mask) < 2) return [];
  const bassPc = pc(low);
  const prof = profileFor(level);
  const pend: Pending[] = [];
  for (const e of entries()) { const p = match(e, mask, bassPc, prof); if (p) pend.push(p); }
  if (pend.length === 0) return [];
  const minRaw = Math.min(...pend.map(rawScore));
  const kept = pend.map((p, i) => ({ p, i })).filter(({ p }) => rawScore(p) <= minRaw + 7)
    .sort((a, b) => finalScore(a.p) - finalScore(b.p) || KIND_ORDER[a.p.kind] - KIND_ORDER[b.p.kind] || a.i - b.i)
    .map(({ p }) => p);
  const out: ChordNameCandidate[] = [];
  const seen = new Set<string>();
  let last: Pending | null = null;
  for (const p of kept) {
    if (out.length >= maxCandidates && last && (finalScore(p) > finalScore(last) || (finalScore(p) === finalScore(last) && KIND_ORDER[p.kind] > KIND_ORDER[last.kind]))) break;
    const c = build(p, style);
    if (!seen.has(c.label)) { seen.add(c.label); out.push(c); last = p; }
  }
  return out.map((c, i) => ({ c, i }))
    .sort((a, b) => a.c.score - b.c.score || KIND_ORDER[a.c.kind] - KIND_ORDER[b.c.kind] || (a.c.label < b.c.label ? -1 : a.c.label > b.c.label ? 1 : 0) || a.i - b.i)
    .slice(0, maxCandidates).map(({ c }) => c);
}

// ---------------------------------------------------------------------------
// 3) "What comes next" suggester  (ChordSuccessors)
// ---------------------------------------------------------------------------

/** ChordSuccessors.Function: diatonic degree → {next degree: weight}. */
export const FUNCTION_WEIGHTS: Record<number, Record<number, number>> = {
  1: { 4: 0.9, 5: 0.9, 6: 0.7, 2: 0.7, 3: 0.4, 7: 0.3 },
  2: { 5: 1.0, 7: 0.6, 1: 0.3, 3: 0.3, 4: 0.3, 6: 0.3 },
  3: { 6: 0.9, 4: 0.7, 2: 0.4, 1: 0.3, 5: 0.3 },
  4: { 5: 1.0, 1: 0.8, 2: 0.6, 7: 0.4, 6: 0.3, 3: 0.2 },
  5: { 1: 1.0, 6: 0.7, 4: 0.4, 3: 0.2, 2: 0.2 },
  6: { 2: 0.9, 4: 0.8, 5: 0.7, 3: 0.4, 1: 0.3 },
  7: { 1: 1.0, 3: 0.6, 6: 0.3 },
};
/** Iteration order of Function entries (C# Dictionary insertion order). */
const FUNCTION_ORDER: Record<number, number[]> = {
  1: [4, 5, 6, 2, 3, 7], 2: [5, 7, 1, 3, 4, 6], 3: [6, 4, 2, 1, 5], 4: [5, 1, 2, 7, 6, 3], 5: [1, 6, 4, 3, 2], 6: [2, 4, 5, 3, 1], 7: [1, 3, 6],
};
/** ChordSuccessors.RootMotion: bonus by root interval (semitones up) from the current chord. */
export const ROOT_MOTION: Record<number, number> = { 5: 0.35, 2: 0.2, 9: 0.2, 10: 0.15, 3: 0.1, 4: 0.08, 8: 0.06, 7: 0.05, 1: 0.04, 11: 0.04, 6: 0.02, 0: -0.5 };
export const COMMON_TONE_BONUS = 0.05;
export const SEVENTH_PENALTY = 0.12;

const MAJOR_TEMPLATE = { letters: [0, 1, 2, 3, 4, 5, 6], steps: [2, 2, 1, 2, 2, 2, 1] };
const NATURAL_MINOR_TEMPLATE = { letters: [0, 1, 2, 3, 4, 5, 6], steps: [2, 1, 2, 2, 1, 2, 2] };

function spellScale(root: Spelled, tpl: { letters: number[]; steps: number[] }): Spelled[] {
  const out: Spelled[] = [root];
  for (let i = 1; i < tpl.letters.length; i++) {
    const letter = (root.letter + tpl.letters[i]) % 7;
    let d = tpl.steps[i - 1] - (STAFF_NOTES[letter] - spelledPc(out[i - 1]));
    if (d > 3) d -= 12;
    if (d < -3) d += 12;
    out.push({ letter, acc: d });
  }
  return out;
}
const sameSpelling = (a: Spelled, b: Spelled) => a.letter === b.letter && a.acc === b.acc;
const inValues = (s: Spelled) => SEMITONE_VALUES.some((v) => sameSpelling(v, s));

export interface SuggestChord { def: ChordDef; root: Spelled; pcs: number[]; label: string }

/** Diatonic triads (maj/min/dim/aug) and diatonic 4-note "common" sevenths per degree, like ScaleService.GenerateChordList(Triads|Sevenths) group CommonChords. */
function diatonicChords(scale: Spelled[]): Map<number, SuggestChord[]> {
  const scalePcs = new Set(scale.map(spelledPc));
  const res = new Map<number, SuggestChord[]>();
  for (const [n, sevenths] of [[3, false], [4, true]] as const) {
    // SupportedChords(scale, n): AllChordsReady order (chord-major, inversion 0, 21 roots), all pcs in scale
    const found: { c: SuggestChord; degree: number }[] = [];
    for (const def of DICTIONARY_CHORDS) {
      if (def.formula.length !== n) continue;
      for (const root of SEMITONE_VALUES) {
        const fc = formatChord(def, root, 0);
        if (!fc.formula.every((v) => scalePcs.has(pc(v)))) continue;
        if (sevenths ? !(hasDegree(fc.degrees, 6, null) && isCommon(fc.degrees)) : !isCommon(fc.degrees)) continue;
        const idx = scale.findIndex((s) => sameSpelling(s, root));
        if (idx < 0) continue;
        const r = noteName(root);
        const sym = chordSymbol(def);
        found.push({ c: { def, root, pcs: [...new Set(fc.formula.map(pc))].sort((a, b) => a - b), label: r + gap(r, sym) + sym }, degree: idx + 1 });
      }
    }
    // GenerateChordList orders by RelativeChord.Number (stable)
    for (const { c, degree } of stableSortBy(found, (x) => x.degree)) {
      if (!res.has(degree)) res.set(degree, []);
      (res.get(degree) as SuggestChord[]).push(c);
    }
  }
  return res;
}

const setEq = (a: number[], b: number[]) => a.length === b.length && a.every((x) => b.includes(x));

export interface Suggestion { chord: SuggestChord; score: number }

/**
 * ChordSuccessors.Ranked(chord, limit): scores every diatonic chord that can follow the given chord in
 * all 24 major / natural-minor keys where the chord is diatonic, sums the scores per (root, pitch-class set),
 * then puts the best chord for each distinct root first.
 * chordId + root identify the current chord (e.g. 10 + {letter:0,acc:0} = C major).
 */
export function suggestNextChords(chordId: number, root: Spelled, limit = 12): Suggestion[] {
  const def = chordById(chordId);
  if (!def) return [];
  const src = formatChord(def, root, 0);
  let res = rankFrom(spelledPc(root), [...new Set(src.formula.map(pc))].sort((a, b) => a - b), limit);
  if (res.length === 0) {
    // TriadReductionOf: fall back to the dim / minor / major triad on the same root
    const rel = new Set(def.formula.map(pc));
    const id = rel.has(3) && rel.has(6) ? 12 : rel.has(3) ? 11 : 10;
    const t = formatChord(chordById(id) as ChordDef, root, 0);
    res = rankFrom(spelledPc(root), [...new Set(t.formula.map(pc))].sort((a, b) => a - b), limit);
  }
  return res;
}

function rankFrom(srcRoot: number, srcPcs: number[], limit: number): Suggestion[] {
  const totals = new Map<string, number>();
  const byKey = new Map<string, SuggestChord>();
  for (let i = 0; i < 12; i++) {
    for (const minor of [false, true]) {
      const tonic = parseNoteSharp(i);
      const scale = spellScale(tonic, minor ? NATURAL_MINOR_TEMPLATE : MAJOR_TEMPLATE);
      if (!scale.every(inValues)) {
        // chords on double-sharp roots do not exist in the dictionary; those degrees are simply missing
      }
      const dia = diatonicChords(scale);
      if (dia.size === 0) continue;
      let k = 0;
      for (let d = 1; d <= 7; d++) { if ((dia.get(d) ?? []).some((c) => setEq(c.pcs, srcPcs))) { k = d; break; } }
      if (k === 0) continue;
      for (const target of FUNCTION_ORDER[k]) {
        const w = FUNCTION_WEIGHTS[k][target];
        for (const c of dia.get(target) ?? []) {
          if (setEq(c.pcs, srcPcs)) continue;
          const motion = pc(spelledPc(c.root) - srcRoot);
          const common = c.pcs.filter((p) => srcPcs.includes(p)).length;
          const s = w + (ROOT_MOTION[motion] ?? 0) + common * COMMON_TONE_BONUS - (c.pcs.length >= 4 ? SEVENTH_PENALTY : 0);
          const key = spelledPc(c.root) + '|' + c.pcs.join(',');
          totals.set(key, (totals.get(key) ?? 0) + s);
          if (!byKey.has(key)) byKey.set(key, c);
        }
      }
    }
  }
  const ordered = [...totals].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([key, score]) => ({ chord: byKey.get(key) as SuggestChord, score }));
  const seenRoot = new Set<number>();
  const primary: Suggestion[] = [];
  for (const s of ordered) { const r = spelledPc(s.chord.root); if (!seenRoot.has(r)) { seenRoot.add(r); primary.push(s); } }
  const rest = ordered.filter((s) => !primary.includes(s));
  return primary.concat(rest).slice(0, limit);
}

// ---------------------------------------------------------------------------
// 4) Voicing and fingering  (PianoCompanion.Helper.ChordVoicer / FingeringScorer)
// ---------------------------------------------------------------------------

export const VOICER = { MaxNotes: 5, MaxSpan: 14 } as const;

/** ChordVoicer.Importance: how essential an interval is when notes must be dropped. */
export function importance(interval: number): number {
  switch (((interval % 24) + 24) % 24) {
    case 0: return 100;
    case 3: case 4: case 10: case 11: return 95;
    case 6: case 8: case 13: case 15: case 18: return 80;
    case 9: case 21: return 70;
    case 2: case 14: return 60;
    case 5: case 17: return 40;
    case 7: case 19: return 20;
    default: return 50;
  }
}

interface Tagged { value: number; orig: number; pos: number; shift: number }

export interface Voicing { semitones: number[]; keptPostInvIndices: number[]; root: number; formulaShifts: number[]; span: number }

/** ChordVoicer.Build(rootFormula, inversion, rootSemitone): fold extensions down an octave, drop least important tones until ≤5 notes and ≤14 semitones. */
export function buildVoicing(rootFormula: number[], inversion: number, rootSemitone: number): Voicing | null {
  if (!rootFormula || rootFormula.length === 0) return null;
  // ApplyInversion
  let list: Tagged[] = rootFormula.map((v, i) => ({ value: v, orig: i, pos: -1, shift: 0 }));
  for (let j = 0; j < inversion && list.length > 0; j++) {
    const t = list.shift() as Tagged;
    const nv = t.value + 12;
    let k = 0;
    while (k < list.length && list[k].value < nv) k++;
    list.splice(k, 0, { value: nv, orig: t.orig, pos: -1, shift: 0 });
  }
  const mn = Math.min(...list.map((t) => t.value));
  const o = Math.floor(mn / 12) * 12;
  if (o !== 0) list = list.map((t) => ({ ...t, value: t.value - o }));
  // FoldExtensions
  list = list.map((t, i) => ({ ...t, pos: i }));
  const low = Math.min(...list.map((t) => t.value));
  for (let j = 0; j < list.length; j++) {
    const t = list[j];
    if (rootFormula[t.orig] < 12) continue;
    const down = t.value - 12;
    if (down <= low) continue;
    if (!list.some((x) => x.value === down)) list[j] = { value: down, orig: t.orig, pos: t.pos, shift: -12 };
  }
  list = stableSortBy(list, (t) => t.value);
  const drops = new Set<number>();
  for (;;) {
    const remaining = rootFormula.length - drops.size;
    if (remaining === 0) return null;
    const live = list.filter((t) => !drops.has(t.orig)).map((t) => t.value);
    const span = Math.max(...live) - Math.min(...live);
    if (remaining <= VOICER.MaxNotes && span <= VOICER.MaxSpan) break;
    // PickVictim: lowest importance (< 95); ties → the one whose removal shrinks the span most
    let victim = -1, bestImp = Number.MAX_SAFE_INTEGER, bestGain = Number.MIN_SAFE_INTEGER;
    for (let i = 0; i < rootFormula.length; i++) {
      if (drops.has(i)) continue;
      const imp = importance(rootFormula[i]);
      if (imp >= 95) continue;
      const others = list.filter((t) => t.orig !== i && !drops.has(t.orig)).map((t) => t.value);
      const s2 = others.length ? Math.max(...others) - Math.min(...others) : 0;
      const gain = span - s2;
      if (imp < bestImp || (imp === bestImp && gain > bestGain)) { bestImp = imp; bestGain = gain; victim = i; }
    }
    if (victim < 0) return null;
    drops.add(victim);
  }
  const kept: number[] = [], semis: number[] = [];
  const shifts = new Array<number>(list.length).fill(0);
  for (const t of list) {
    shifts[t.pos] = t.shift;
    if (!drops.has(t.orig)) { kept.push(t.pos); semis.push(t.value + rootSemitone); }
  }
  if (semis.length < 2) return null;
  return { semitones: semis, keptPostInvIndices: kept, root: rootSemitone, formulaShifts: shifts, span: semis[semis.length - 1] - semis[0] };
}

const RH: (number[][] | null)[] = [null, null,
  [[1, 5], [1, 4], [2, 5]],
  [[1, 2, 5], [1, 3, 5], [2, 3, 5], [1, 2, 4], [1, 3, 4]],
  [[1, 2, 3, 5], [1, 2, 4, 5], [1, 3, 4, 5], [1, 2, 3, 4]],
  [[1, 2, 3, 4, 5]]];
const LH: (number[][] | null)[] = [null, null,
  [[5, 1], [4, 1], [5, 2]],
  [[5, 2, 1], [5, 3, 1], [5, 3, 2], [4, 2, 1], [4, 3, 1]],
  [[5, 3, 2, 1], [5, 4, 2, 1], [5, 4, 3, 1], [4, 3, 2, 1]],
  [[5, 4, 3, 2, 1]]];
/** FingeringScorer.IdealSpan: finger pair (lo*10+hi) → comfortable semitone range. */
export const IDEAL_SPAN: Record<number, [number, number]> = { 12: [1, 3], 23: [1, 3], 34: [1, 2], 45: [1, 3], 13: [2, 5], 24: [2, 5], 35: [2, 5], 14: [3, 7], 25: [3, 7], 15: [5, 12] };
const isBlack = (s: number) => [1, 3, 6, 8, 10].includes(pc(s));

function fingeringScore(f: number[], notes: number[]): number {
  let n = 0;
  const len = notes.length;
  for (let i = 0; i < len - 1; i++) {
    const lo = Math.min(f[i], f[i + 1]), hi = Math.max(f[i], f[i + 1]);
    const d = notes[i + 1] - notes[i];
    const ideal = IDEAL_SPAN[lo * 10 + hi];
    if (ideal) { const miss = d < ideal[0] ? ideal[0] - d : d > ideal[1] ? d - ideal[1] : 0; n += miss * miss; }
  }
  const span = notes[len - 1] - notes[0];
  if (span > 12) n += (span - 12) * 3;
  for (let j = 0; j < len; j++) if (isBlack(notes[j])) n += f[j] === 1 ? 8 : f[j] === 5 ? 3 : -1;
  for (let k = 0; k < len - 1; k++) if (notes[k + 1] - notes[k] === 1 && Math.abs(f[k + 1] - f[k]) !== 1) n += 4;
  for (let l = 0; l < len - 1; l++) {
    const lo = Math.min(f[l], f[l + 1]), hi = Math.max(f[l], f[l + 1]);
    if (((lo === 3 && hi === 4) || (lo === 4 && hi === 5)) && notes[l + 1] - notes[l] >= 4) n += 3;
  }
  return n;
}

/** FingeringScorer.Assign: best right-hand and left-hand finger numbers (1 = thumb) for a voicing, lowest score wins, first candidate on ties. */
export function assignFingering(v: Voicing | null): { rh: number[]; lh: number[]; score: number } | null {
  if (!v) return null;
  const n = v.semitones.length;
  if (v.span > 14 || n < 2 || n >= RH.length || !RH[n] || !LH[n]) return null;
  const pick = (cands: number[][]) => {
    let best: number[] | null = null, bs = Number.MAX_SAFE_INTEGER;
    for (const c of cands) { const s = fingeringScore(c, v.semitones); if (s < bs) { bs = s; best = c; } }
    return { best, bs };
  };
  const r = pick(RH[n] as number[][]), l = pick(LH[n] as number[][]);
  if (!r.best || !l.best) return null;
  return { rh: r.best, lh: l.best, score: r.bs + l.bs };
}
