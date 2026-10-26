/**
 * How the Diagrams view shows the chords (ADR 0101, Chordify's "Diagram view mode"): the chord
 * sounding and the next (`animated`), or the song's chord summary at once, the one sounding marked
 * (`summary`).
 */
export type DiagramsMode = 'animated' | 'summary'
