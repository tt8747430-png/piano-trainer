# Document format

## 1. File types (Info.plist, exact)

| UTI | Description | Extension / MIME | Role |
|---|---|---|---|
| `com.mathieurouthier.SuggesterPro.document` | Suggester 2 document | `.suggx`, `application/x.com.mathieurouthier.suggesterpro.document` | Editor (exported). Opens in place (`LSSupportsOpeningDocumentsInPlace`). Handoff type `com.mathieurouthier.Suggester2.example-document`. |
| `com.mathieurouthier.suggester.chordprogression` | Suggester Document (Suggester 1) | `.sugg`, `.ChordProgression` | Imported. Old binary format is refused: "This document is in a old format that is no longer supported. You can however upgrade the document to a more recent format by opening it with Suggester 1. It will be possible to import it after that." |
| `com.mathieurouthier.music2.chord` | Chord | — | Pasteboard / drag item |
| `com.mathieurouthier.music2.scale` | Scale | — | Pasteboard / drag item |
| `com.mathieurouthier.music2.songitem` | Song Item | — | Pasteboard / drag item |
| `com.mathieurouthier.music2.songitemlist` | Song Item List | MIME `application/x.com.mathieurouthier.music.songitemlist` | Pasteboard / drag item |

The engine also defines (shared with ChordPadX, not registered by this app): `com.mathieurouthier.chordpadx.document.v2` (`.cpadx`), `application/x.com.mathieurouthier.suggester.document` (Suggester 1 JSON), guitar chord sheet MIME types.

## 2. Encoding

The document body is JSON written by kotlinx.serialization (exact: `MRSuggesterProDocument fromJson:error:` / `fromJsonString:error:` selectors in the main binary; JSON lexer classes `StringJsonLexer`, `JsonToStringWriter` in the engine). Versioned serialisers (exact class names): `SuggesterProDocumentV1`, `V2`, `V3`, `V4`. The current writer is V4.

No sample document is bundled. The demo song is generated in code (title "An Interesting Idea", `Demo Song Title`; navigation title `[Demo Document Navigation Title]`).

## 3. Structure (field names exact; nesting inferred from the serialiser classes and `toString` templates)

```text
SuggesterProDocumentV4
  version            Int
  song               Song
  looping            Boolean
  instrumentSound    Instrument            (Piano, ElectricPiano, …)
  metronomeSound     (metronome entry)
  synthEffects       SynthEffects { active, reverbAmount, delayAmount, delayFeedback, delayDuration }
  defaultArpeggiation Arpeggiation { mode, stepLength, monophonic, holdLastStep }
  defaultHumanization Humanization { timing, velocity, random }
  (title / tuning are document-model properties: Title, Tuning)

V1 = song, looping, instrumentSound, metronomeSound
V2 = V1 + defaultArpeggiation
V3 = V2 + defaultHumanization
V4 = version + V3 + synthEffects

Song
  tempo          Tempo (Int BPM)
  timeSignature  TimeSignature { numerator, denominator }
  songItems      [SongItem]

SongItem          { id: ID(value), one of: chordEvent | scaleMarker | sectionMarker | textMarker }
  ChordEvent      { chord, duration: Duration?, fineDuration: FineDuration?, arpeggiationOverride: Arpeggiation? }
  ScaleMarker     { scale }                         -- a key change; the first one is the song key
  SectionMarker   { title, playCount, isCollapsed, colorCode }   (SongSection)
  TextMarker      { text }

Chord (ChordSerializer.ChordV2)
  note               NoteEx      (spelled root, e.g. "Eb")
  chordType          ChordType?  (one of the 64 names)
  customChordFormula ChordFormula? { intervals, omittable }   -- either chordType or customChordFormula is required:
                                  "chord must have either chordType or customChordFormula"
  octaveShift        Int
  inversion          Inversion(value)
  voicing            Voicing     (ClosedVoicing{signature, bassPosition} | OpenVoicing{signature})
  altBass            NoteEx?     (slash bass)
  role               ChordRole?
  guitarChordShape   GuitarChordShape? { positions, associatedChordEx, customName, autoBarre }
  rootless           Boolean

Scale            { noteEx, type: ScaleType?, customFormula: ScaleFormula? { formula, title } }
FineDuration     { integer, numerator, denominator }
```

Suggester 1 JSON (`SuggesterDocumentV1–V3`, imported): `song`, `triggerSet`, `instrument`, `arpeggiateChords` / `arpeggiation`, `midiTriggerModeEnabled`, `version`. Editor state of v1 documents: `selectedScaleMarker`, `loop`, `instrumentMute`, `instrumentVolume`, `metronomeMute`, `metronomeVolume`.

Model properties that trigger UI refresh (exact `SuggesterProDocumentModel.Property`): Title, Song, DefaultArpeggiation, DefaultHumanization, Instrument, Tuning, SelectedScaleMarker, InstrumentSound, InstrumentVolume, MetronomeSound, MetronomeVolume, SynthEffects, Looping.

Undo: `UndoStack(State{canUndo, canRedo, undoCommandTitle, redoCommandTitle})` bridged to `NSUndoManager` (`UndoStackBridgeViewModifier`).
