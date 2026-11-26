// Run: node chord-detection.test.mjs   (Node >= 22.6; Node 24 strips TypeScript types by default)
// Expected values below were derived by hand from the decompiled C# (see CHORD_DETECTION.md), not from the port itself.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CHORDS, DICTIONARY_CHORDS, chordById, chordSymbol, isAlias, difficulty, findChordByFormulaPart,
  nameChord, suggestNextChords, buildVoicing, assignFingering, majorAccidentals, simplifyFormula,
} from './chord-detection.ts';

const C = { letter: 0, acc: 0 };

test('dictionary size and Alts expansion ids', () => {
  assert.equal(CHORDS.filter((c) => c.variantOf === null).length, 51); // 51 AddChord calls
  for (const id of [1900, 1901, 1902, 1903, 2000, 2001, 2200, 2203, 2300, 2301, 2500, 2503, 3204, 3600, 3604])
    assert.ok(chordById(id), 'missing ' + id);
  assert.equal(chordById(2000).name, 'Minor 7th ⁻5, ø');
  assert.deepEqual(chordById(2000).formula, [0, 3, 6, 10]);
  assert.deepEqual(chordById(1901).formula, [0, 5, 7, 10]);
  assert.deepEqual(chordById(21).formula, [0, 3, 6, 9]);
});

test('aliases are excluded from the dictionary', () => {
  assert.ok(isAlias(chordById(110)) && isAlias(chordById(111)));
  assert.ok(isAlias(chordById(2503))); // "9 7" = same notes as 9
  assert.ok(!isAlias(chordById(2000)));
  assert.ok(DICTIONARY_CHORDS.every((c) => c.id > 9 && !isAlias(c)));
});

test('chord symbols in the five styles', () => {
  assert.equal(chordSymbol(chordById(10)), '');
  assert.equal(chordSymbol(chordById(2000)), 'm7♭5');
  assert.equal(chordSymbol(chordById(2000), 'Jazz'), 'ø7');
  assert.equal(chordSymbol(chordById(22), 'Jazz'), 'Δ7');
  assert.equal(chordSymbol(chordById(22), 'French'), '7M');
  assert.equal(chordSymbol(chordById(16)), '(♭5)');
  assert.equal(chordSymbol(chordById(1902)), '7♭5');
  assert.equal(chordSymbol(chordById(2701)), '7(♭5,♭9)');
  assert.equal(chordSymbol(chordById(1901)), '7sus4');
  assert.equal(chordSymbol(chordById(13), 'Asian'), 'aug');
});

test('difficulty table', () => {
  assert.equal(difficulty(chordById(10)), 0);
  assert.equal(difficulty(chordById(2000)), 5);
  assert.equal(difficulty(chordById(36)), 11); // 4 + 7 pitch classes
  assert.equal(difficulty(chordById(3203)), 12); // 4 + 6 + 2 (variant)
});

test('major key accidentals per spelling', () => {
  assert.equal(majorAccidentals({ letter: 1, acc: -1 }), 5); // D♭
  assert.equal(majorAccidentals({ letter: 0, acc: 1 }), 7); // C♯
  assert.equal(majorAccidentals({ letter: 6, acc: 1 }), 12); // B♯
  assert.equal(majorAccidentals({ letter: 2, acc: 0 }), 4); // E
});

test('SimplifyFormula drops octave doublings at the edges', () => {
  // both edges are doubled C: drop the one that leaves the narrower span ([0,4,7] span 7 < [4,7,12] span 8)
  assert.deepEqual(simplifyFormula([0, 4, 7, 12]), [0, 4, 7]);
  assert.deepEqual(simplifyFormula([48, 60, 64, 67]), [0, 4, 7]); // low doubled C dropped, then moved to octave 0
  assert.deepEqual(simplifyFormula([60, 64, 67]), [0, 4, 7]);
});

test('macOS reverse lookup (findChordByFormulaPart) ranking', () => {
  const r = findChordByFormulaPart([0, 4, 7]);
  assert.equal(r[0].fullName, 'C Major');
  assert.equal(r[0].score, 5); // 10 - 15 - 50 + 0 + 60
  assert.equal(r[1].fullName, 'B♯ Major'); // enharmonic spelling, 12 sharps
  assert.equal(r[1].score, 17);
  assert.equal(r[2].fullName, 'C Seventh'); // 50 - 15 + 60
  // inversions only when ChordsPro is owned and "exclude inversions" is off
  const inv = findChordByFormulaPart([4, 7, 12], { includeInversions: true });
  assert.equal(inv[0].fullName, 'C Major (1)');
  assert.equal(inv[0].symbol, 'C/E');
  assert.equal(inv[0].score, 30);
  const strict = findChordByFormulaPart([0, 4, 7], { isStrict: true });
  assert.ok(strict.every((x) => x.chord.formula.length === 3));
});

test('ChordNamer candidates', () => {
  assert.deepEqual(nameChord([60, 64, 67]).map((c) => c.label), ['C']);
  assert.deepEqual(nameChord([64, 67, 72]).map((c) => c.label), ['C/E']);
  assert.deepEqual(nameChord([60, 64, 67, 70]).map((c) => c.label), ['C7']);
  assert.deepEqual(nameChord([57, 60, 64, 67]).map((c) => c.label), ['Am7', 'C/A', 'C6/A']);
  assert.deepEqual(nameChord([60, 64, 70]).map((c) => c.label), ['C7(no5)']);
  assert.deepEqual(nameChord([60]), []);
});

test('chord suggester (ChordSuccessors) after C major', () => {
  const s = suggestNextChords(10, C, 12);
  assert.equal(s[0].chord.label, 'F');
  assert.ok(Math.abs(s[0].score - 5.0) < 1e-9);
  const roots = s.slice(0, 5).map((x) => x.chord.root.letter + ':' + x.chord.root.acc);
  assert.equal(new Set(roots).size, roots.length); // distinct roots first
  console.log('  suggestions after C:', s.map((x) => `${x.chord.label} ${x.score.toFixed(2)}`).join(', '));
});

test('voicing and fingering', () => {
  const v = buildVoicing([0, 4, 7], 0, 60);
  assert.deepEqual(v.semitones, [60, 64, 67]);
  assert.deepEqual(assignFingering(v), { rh: [1, 3, 5], lh: [5, 2, 1], score: 0 });
  const v13 = buildVoicing([0, 4, 7, 10, 14, 17, 21], 0, 0);
  assert.deepEqual(v13.semitones, [0, 2, 4, 9, 10]);
});
