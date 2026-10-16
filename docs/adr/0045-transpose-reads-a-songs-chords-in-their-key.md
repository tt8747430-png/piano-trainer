# ADR 0045 — Transpose reads a song's chords in their key, then plays them in any key

- **Status:** superseded by ADR 0052 · **Date:** 2026-10-14 · **Amends:** ADR 0044 (Practice's tools)

## Context

Gorshkov's lesson 3 («Мышление ступенями») teaches an accompanist's daily job: a song's chords are read in its
key as degrees, so the song can be played in any key a singer needs. Its sheet gives the order: find the key (the
signature, the melody's last note, the first and last chords), name each chord by its degree, play the degrees in
the new key. The app had both halves apart and neither whole: Progressions turns numerals into chords in any key
and reads typed chords as numerals, but only in the key already chosen, never finding it, and a slash chord's bass
is lost on the way. The Chord finder names the keys that hold one chord. piano.org's Chord Progression Analyzer
("type a progression and read its key, each chord's numeral and function") is the model; musicca.com and
musictheory.net have no tool for it (`.scratch/things-and-tools/research.md`).

## Decision

- **Transpose is a tool** (`/practice/transpose`, «Транспонирование»), the fifth of Practice's Tools. It takes a
  line of chords as typed (spaces, commas or bar lines between them) and gives their key, each chord's numeral in
  it, and the chords in any key, played as a row.
- **The key is found as the lesson finds it, from chords alone** (`keysOfChords`, the kernel's): every key is
  scored by the chords all of whose notes are its own (a minor key's raised 6th and 7th included, as `chordInKey`
  reads it), twice; its tonic chord first, once; its tonic chord last, twice; and each chord out of the key that is
  the next chord's dominant (`V7/iv`), once. Ties go to the key nearest C on the circle, then major. The learner
  may read the chords in another of the keys found.
- **A chord out of the key is named, not refused** (`readInKey`): an applied dominant by the chord it leads to
  (`V/iv`, read as the Progressions page reads it), any other by its root's degree (`I` in D minor, `♭VII`), marked
  out of the key.
- **Transposing keeps letters and basses** (`transposeChord`: the interval between tonics, the bass with it), into
  a tonic chosen in the read key's mode. Its numerals open Progressions in the key played, to practise them in the
  Player; a slash chord's bass stays behind there, as numerals write none.
- **A lesson can open it on chords** (`opens: 'transpose'`): «Мышление ступенями» opens it on «Ромашковые поля».

## Consequences

- Practice's Tools read Chord finder · Passing chords · Reharmonise · Transpose · Free play; Search finds it as a
  page, and reads a line of chords typed into it as Transpose on them, with the key they are in.
- The URL holds `chords` as typed, the read `key` where the learner chose one, and the tonic played `to` where it
  differs from the read key's.
