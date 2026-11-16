# Dorico object model: API classes

Generated from the API definitions bundled with Dorico 6.2 (`Resources/lua/ldt/ee/steam.zip` → `api.zip`, 65 files). Dorico's internal engine is called **steam**, and these classes expose its document model to scripts. Names, fields and signatures are exact. Descriptions are Steinberg's own, where given.

## Index

[AccidentalType](#accidentaltype) · [BarDivisionData](#bardivisiondata) · [BarDivisionElement](#bardivisionelement) · [BarDivisionEvent](#bardivisionevent) · [BarDivisionTable](#bardivisiontable) · [BarRestEvent](#barrestevent) · [CaretLocation](#caretlocation) · [ClefCollectionEntity](#clefcollectionentity) · [ClefEvent](#clefevent) · [ClefLibrary](#cleflibrary) · [Dynamic](#dynamic) · [DynamicGroupElement](#dynamicgroupelement) · [DynamicGroupEvent](#dynamicgroupevent) · [DynamicIntensity](#dynamicintensity) · [DynamicTable](#dynamictable) · [Ensemble](#ensemble) · [EnsembleCollectionEntity](#ensemblecollectionentity) · [EnsembleLibrary](#ensemblelibrary) · [Event](#event) · [EventBlock](#eventblock) · [EventBlockInstance](#eventblockinstance) · [EventStream](#eventstream) · [EventStreamType](#eventstreamtype) · [Flow](#flow) · [FlowElements](#flowelements) · [FlowInstrument](#flowinstrument) · [ImmediateChangeDynamic](#immediatechangedynamic) · [Instrument](#instrument) · [InstrumentCollectionEntity](#instrumentcollectionentity) · [InstrumentLibrary](#instrumentlibrary) · [Interval](#interval) · [IntervalDegree](#intervaldegree) · [IntervalType](#intervaltype) · [LayoutTransposition](#layouttransposition) · [LogDuration](#logduration) · [MIDIPitch](#midipitch) · [MIDIPitchWithSpelling](#midipitchwithspelling) · [NotatedLength](#notatedlength) · [NoteEvent](#noteevent) · [NoteName](#notename) · [NoteheadDuration](#noteheadduration) · [OssiaType](#ossiatype) · [OttavaLineCollectionEntity](#ottavalinecollectionentity) · [OttavaLineEvent](#ottavalineevent) · [OttavaLineLibrary](#ottavalinelibrary) · [Pitch](#pitch) · [PitchWithSpelling](#pitchwithspelling) · [Player](#player) · [RestEvent](#restevent) · [RhythmicLength](#rhythmiclength) · [Score](#score) · [ScoreElement](#scoreelement) · [ScoreElementTable](#scoreelementtable) · [ScoreLibraries](#scorelibraries) · [ScoreSubElement](#scoresubelement) · [ScoringEngine](#scoringengine) · [ScriptHost](#scripthost) · [StepTimeInput](#steptimeinput) · [TextEvent](#textevent) · [TonalityDivisionElement](#tonalitydivisionelement) · [TonalityDivisionEvent](#tonalitydivisionevent) · [TupletDefinition](#tupletdefinition) · [TupletEvent](#tupletevent) · [VoiceDirection](#voicedirection) · [global](#global)

## AccidentalType

Represents an accidental type on a note.

**Fields / values**

- `kTripleFlat`
- `kDoubleFlat`
- `kFlat`
- `kNatural`
- `kSharp`
- `kDoubleSharp`
- `kTripleSharp`
- `kMicrotonal`
- `kIllegalAccidental`


## BarDivisionData

This is the generalisation of a time signature. It may represent a single time signature or a compound of several. .

**Functions**

- `createForSingleTimeSignature(int numerator, int denominator)` → `BarDivisionData`: Construct for a single time signature eg bd=BarDivisionElement.createFromSingleTimeSig(4,4).


## BarDivisionElement

Represents a BarDivision Element, typically a time signature structure .


## BarDivisionEvent

Represents a BarDivisionEvent in the Event Stream.


## BarDivisionTable

Table of all the BarDivision elements in the Flow.

**Functions**

- `createBarDivisionElement(BarDivisionData barDivisionData)` → `BarDivisionElement`: Creates a new BarDivisionElement. This is not yet bound to a BarDivisionElement.


## BarRestEvent

Represents a Bar Rest Event in the Event Stream.


## CaretLocation

Represents the position of the caret for step time input operations.

**Fields / values**

- `position`
- `flowInstrument`
- `instrumentStaveIndex`
- `voiceNumber`

**Functions**

- `advance(RhythmicLength amount)` → `nil`: Advances the caret.


## ClefCollectionEntity

Represents a clef entity within the Clef library.

**Fields / values**

- `id`


## ClefEvent

Represents a ClefEvent in the Event Stream.

**Fields / values**

- `transposingClefEntity`
- `nonTransposingClefEntity`


## ClefLibrary

Holds all the Clef presets.

**Fields / values**

- `items`

**Functions**

- `find(String entityID)` → `ClefCollectionEntity`: Finds a clef item by ID (may return nil).


## Dynamic

A ScoreSubElement that forms part of a DynamicGroupElement.


## DynamicGroupElement

Represents a DynamicGroupElement in the Flow.

**Functions**

- `createImmediateChange(RhythmicLength position, DynamicIntensity intensity)` → `DynamicGroupElement`: Adds an ImmediateChangeDynamic to the DynamicGroupElement at the given position.
- `createEvent(RhythmicLength position, EventStream stream)` → `DynamicGroupEvent`: Creates an Event that references this Element.


## DynamicGroupEvent

Represents a DynamicGroupEvent in the Event Stream.


## DynamicIntensity

Represents a dynamic intensity, such as "p" or "ff".

**Fields / values**

- `kP`
- `kF`

**Functions**

- `DynamicIntensity()` → `DynamicIntensity`: Default constructor.
- `create(FundamentalType type, int intensity)` → `DynamicIntensity`: Construct a DynamicIntensity, eg d=DynamicIntensity.create(FundamentalType.kF,2) .


## DynamicTable

Table of all the Dynamics in the Flow.

**Functions**

- `createDynamicGroup()` → `DynamicGroupElement`: Creates a new DynamicGroupElement which is initially empty, and not bound to a DynamicGroupEvent.


## Ensemble

Represents a group of Players which may appear in multiple Flows .

**Fields / values**

- `players`


## EnsembleCollectionEntity

Represents a ensemble entity within the Ensemble library.

**Fields / values**

- `id`


## EnsembleLibrary

Holds all the Ensemble presets.

**Fields / values**

- `items`

**Functions**

- `find(String entityID)` → `EnsembleCollectionEntity`: Finds a ensemble item by ID (may return nil).


## Event

Represents an Event in the Event Stream.

**Fields / values**

- `id`
- `position`
- `endPosition`
- `duration`


## EventBlock

Holds a sequence of Events. An EventStream contains a sequences of EventBlockInstance objects, each of which references an EventBlock.

**Fields / values**

- `id`
- `events`


## EventBlockInstance

Represents the instance of an EventBlock in a stream.  One EventBlock may appear more than once, and in different streams .

**Fields / values**

- `id`
- `position`
- `events`
- `block`


## EventStream

Logical wrapper around an Event Stream in a Flow.

**Fields / values**

- `id`
- `type`
- `events`
- `blockInstances`
- `ossiaType`
- `voiceDirection`

**Functions**

- `findBlockInstanceAtPoint(RhythmicLength position)` → `EventBlockInstance`: Returns the EventBlockInstance that is active at the given point, or nil if none.
- `addBlockInstance(RhythmicLength position, EventBlock block)` → `nil`: Adds a new instance of the given EventBlock at a particular position. This will overwrite any other blocks currently at that location.
- `removeBlockInstance(EventBlockInstance blockInstance, bool fillGap)` → `nil`: Removes the EventBlockInstance from the stream. Optionally it will fill up the remaining gap (recommended to set this to true) .
- `splitStream(RhythmicLength position)` → `nil`: Splits the stream at the given position.
- `deleteEventsInRange(RhythmicLength start, RhythmicLength end)` → `nil`: Splits the stream at the given position.
- `copyRange(RhythmicLength sourceStart, RhythmicLength sourceEnd, EventStream destination, RhythmicLength destPosition, int numCopies)` → `nil`: Copies a range of events to the given destination.
- `moveRange(RhythmicLength sourceStart, RhythmicLength sourceEnd, EventStream destination, RhythmicLength destPosition, int numCopies)` → `nil`: Moves a range of events to the given destination.
- `copyRangeLinked(RhythmicLength sourceStart, RhythmicLength sourceEnd, EventStream destination, RhythmicLength destPosition, int numCopies)` → `nil`: Creates linked copies of the given range.
- `joinBlocks(EventBlockInstance block1, EventBlockInstance block2)` → `nil`: Joins the two blocks together.
- `createNote(RhythmicLength position, RhythmicLength duration, MIDIPitchWithSpelling pitch)` → `NoteEvent`: Create a note event in the stream.
- `createRest(RhythmicLength position, RhythmicLength duration)` → `RestEvent`: Create a rest event in the stream.
- `createBarRest(RhythmicLength position)` → `BarRestEvent`: Create a rest event in the stream.
- `createTuplet(RhythmicLength position, TupletDefinition tupletDef)` → `TupletEvent`: Create a tuplet event in the stream.
- `createBarDivision(RhythmicLength position, BarDivisionElement barDivisionElement)` → `BarDivisionEvent`: Create a bar division event in the stream.
- `createTonalityDivision(RhythmicLength position, TonalityDivisionElement tonalityDivisionElement)` → `TonalityDivisionEvent`: Create a tonality division event in the stream.
- `createDynamicGroup(RhythmicLength position, DynamicGroupElement dynamicGroupElement)` → `DynamicGroupEvent`: Create a dynamic group in the stream.
- `createText(RhythmicLength position, String text)` → `TextEvent`: Create a text event in the stream.
- `createClef(RhythmicLength position, ClefCollectionEntity entityForAllLayouts)` → `ClefEvent`: Create a clef event in the stream.
- `createTransposingClef(RhythmicLength position, ClefCollectionEntity entityForTransposingLayouts, ClefCollectionEntity entityForNonTransposingLayouts)` → `ClefEvent`: Create a transposing clef event in the stream.
- `createOttavaLine(RhythmicLength position, RhythmicLength duration, OttavaLineCollectionEntity ottavaLineDefinition)` → `OttavaLineEvent`: Create an ottava line event in the stream.
- `delete(Event eventToDelete)` → `bool`: Delete an event.
- `dump()` → `string`: Dumps an event stream to a string, for diagnostic purposes.


## EventStreamType

Enumerates the types of event streams.

**Fields / values**

- `kGlobalTimebaseStream`
- `kInstrumentStaveStream`
- `kVoiceStream`
- `kPlayerStream`


## Flow

The Flow is a complete section of music for a number of instruments.  .

**Fields / values**

- `id`
- `instruments`
- `allStreams`
- `timebaseStreams`
- `voiceStreams`
- `staveStreams`
- `playerStreams`
- `elementTables`


## FlowElements

Holds the element tables for a flow.

**Fields / values**

- `barDivisions`
- `dynamics`
- `tonalityDivisions`


## FlowInstrument

Logical wrapper around an Instrument as it appears in a specific Flow.

**Fields / values**

- `id`
- `name`
- `streams`


## ImmediateChangeDynamic

A dynamic change which occurs immediately which is absolute with respect to the current prevailing dynamic, for example "forte" .


## Instrument

Logical wrapper around an Instrument in the score, which may be used in multiple Flows .

**Fields / values**

- `id`
- `name`


## InstrumentCollectionEntity

Represents a instrument entity within the Instrument library.

**Fields / values**

- `id`


## InstrumentLibrary

Holds all the Instrument presets.

**Fields / values**

- `items`

**Functions**

- `find(String entityID)` → `InstrumentCollectionEntity`: Finds a instrument item by ID (may return nil).


## Interval

This represents a Western interval, expressed as a one-based degree and a type. For example, an upward minor second is {IntervalDegree(2), kMinor}; a downward augmented compound fifth is {IntervalDegree(-12), kAugmented}. .

**Fields / values**

- `degree`
- `type`
- `isValid`
- `chromaticDelta`

**Functions**

- `Interval(IntervalDegree degree, IntervalType IntervalType)` → `Interval`: Construct from degree and interval type.


## IntervalDegree

This represents a Western interval degree, constructed with a one-based integer. For example, a unison would be 1, a second 2, a downward third -3, and so on. Compound degrees are allowed too, so a compound fifth would, for example, be 12. .

**Fields / values**

- `numDiatonicSteps`
- `numDiatonicStepsWithinOctave`
- `numOctaves`
- `isPerfectInSimplestForm`

**Functions**

- `IntervalDegree(int oneBasedDegree)` → `IntervalDegree`: Construct from one-based number of diatonic steps.
- `enforceSimpleInterval()` → `void`: Makes compound intervals simple. I.e. intervals that are larger than an octave are made smaller.


## IntervalType

Represents the quality of an interval.

**Fields / values**

- `kTripleDiminished`
- `kDoubleDiminished`
- `kDiminished`
- `kMinor`
- `kMajorOrPerfect`
- `kAugmented`
- `kDoubleAugmented`


## LayoutTransposition

Describes the transposition type of a layout, i.e. transposing vs. score in C.

**Fields / values**

- `kScoreInC`
- `kTransposingScore`


## LogDuration

Represents a durational unit as an enumeration of the lengths of different notehead types (without dots) \todo Add synonyms, eg kQuarterNote .

**Fields / values**

- `k256Note`
- `k128Note`
- `kHemiDemiSemiQuaver`
- `kDemiSemiQuaver`
- `kSemiQuaver`
- `kQuaver`
- `kCrotchet`
- `kMinim`
- `kSemibreve`
- `kBreve`


## MIDIPitch

Represents a MIDI-like note pitch.  Supports basic mathematical operations .

**Fields / values**

- `numerator`

**Functions**

- `MIDIPitch()` → `MIDIPitch`: Default constructor.
- `MIDIPitch(int midiPitch)` → `MIDIPitch`: Construct from MIDI pitch.
- `MIDIPitch(int numerator, int denominator)` → `MIDIPitch`: Construct from fractional pitch.


## MIDIPitchWithSpelling

This represents a MIDI-like pitch as well as a NoteName. It is used to specify a note's pitch as it is represented on the stave. This is an unambiguous representation for pitches in 12EDO temperaments or multiples thereof, but you'll need to defer to the current tempermaent definition and accidental system to obtain the precise meaning of pitches in other temperaments. .

**Fields / values**

- `pitch`
- `noteName`
- `accidentalType`
- `octave`
- `multitonalFraction`

**Functions**

- `MIDIPitchWithSpelling(MIDIPitch MIDIPitch, NoteName NoteName)` → `MIDIPitchWithSpelling`: Construct from pitch and note.
- `MiddleC()` → `MIDIPitchWithSpelling`: Returns constant for middle C.
- `fromString(string string)` → `MIDIPitchWithSpelling`: Constructs MIDIPitchWithSpelling from a string .


## NotatedLength

This represents duration in terms of a number of multiples of a NoteLengthUnit \sa NoteheadDuration .

**Fields / values**

- `unit`
- `number`

**Functions**

- `NotatedLength()` → `NotatedLength`: Default constructor.
- `NotatedLength(LogDuration LogDuration, int multiple)` → `NotatedLength`: Construct from a multiple of LogDuration values.
- `toRational()` → `RhythmicLength`: Converts to a RhythmicLength.


## NoteEvent

Represents an Note Event in the Event Stream.

**Fields / values**

- `pitchWithSpelling`


## NoteName

This represents the name of a note in a diatonic scale - C to B .

**Fields / values**

- `kNoteC`
- `kNoteD`
- `kNoteE`
- `kNoteF`
- `kNoteG`
- `kNoteA`
- `kNoteB`
- `type`

**Functions**

- `NoteName(typename NoteName::Type noteType)` → `NoteName`: Construct from a note type, eg n=NoteName(NoteName.kNoteC) .
- `fromString(string noteString)` → `NoteName`: Construct from a string, eg n=NoteName.fromString("E").


## NoteheadDuration

This represents the notated length of a single note or rest, including dots.

**Fields / values**

- `unit`
- `numDots`

**Functions**

- `NoteheadDuration(LogDuration LogDuration, int numDots)` → `NoteheadDuration`: Construct from duration and number of dots.
- `toRational()` → `RhythmicLength`: Converts to a RhythmicLength.
- `toNotatedLength()` → `NotatedLength`: Converts to a NotatedLength.


## OssiaType

Specifies whether or not an EventStream represents an Ossia stave.

**Fields / values**

- `kNone`
- `kAbove`
- `kBelow`


## OttavaLineCollectionEntity

Represents a OttavaLine entity within the OttavaLine library.

**Fields / values**

- `id`


## OttavaLineEvent

Represents an OttavaLineEvent in the Event Stream.

**Fields / values**

- `ottavaLineDefinitionID`


## OttavaLineLibrary

Holds all the OttavaLine presets.

**Fields / values**

- `items`

**Functions**

- `find(String entityID)` → `OttavaLineCollectionEntity`: Finds a ottavaLine item by ID (may return nil).


## Pitch

Represents a MIDI-like note pitch.  Supports basic mathematical operations .

**Fields / values**

- `numerator`

**Functions**

- `Pitch()` → `Pitch`: Default constructor.
- `Pitch(int midiPitch)` → `Pitch`: Construct from MIDI pitch.
- `Pitch(int numerator, int denominator)` → `Pitch`: Construct from fractional pitch.


## PitchWithSpelling

This represents a MIDI-like pitch as well as a NoteName. It is used to specify unambiguously a note's pitch as it is represented on the stave .

**Fields / values**

- `pitch`
- `noteName`
- `accidentalType`
- `octave`
- `multitonalFraction`

**Functions**

- `PitchWithSpelling(Pitch Pitch, NoteName NoteName)` → `PitchWithSpelling`: Construct from pitch and note.
- `MiddleC()` → `PitchWithSpelling`: Returns constant for middle C.
- `fromString(string string)` → `PitchWithSpelling`: Constructs PitchWithSpelling from a string .


## Player

Represents a player which may appear in multiple Flows .

**Fields / values**

- `instruments`


## RestEvent

Represents an Rest Event in the Event Stream.


## RhythmicLength

Rational number type used to express rhythmic positions exactly in terms of the number of crotchets (quarter notes). Note that this isn't in terms of beats, as that will differ for compound time signatures. .

**Fields / values**

- `numerator`
- `denominator`

**Functions**

- `RhythmicLength()` → `RhythmicLength`: Default constructor.
- `RhythmicLength(int numCrotchets)` → `RhythmicLength`: Construct from number of crotchets (quarter notes).
- `RhythmicLength(int numerator, int denominator)` → `RhythmicLength`: Construct from fractional number of crotchets (quarter notes).


## Score

Provides access to the Score .

**Fields / values**

- `flowIDs`
- `flows`
- `ensembles`
- `players`
- `instruments`
- `stepTimeInput`
- `libraries`

**Functions**

- `Score()` → `Score`: Default constructor.
- `addEnsemble(EnsembleCollectionEntity ensembleEntity, table flowsToIncludeIn)` → `Ensemble`: Creates players, instruments and stave streams for the given EnsembleCollectionEntity .
- `addPlayerToEnsemble(Ensemble ensemble, table flowsToIncludeIn, InstrumentCollectionEntity instrumentEntity, bool soloPlayer, int playerNumber)` → `Player`: Adds a new player to an existing ensemble and creates the required streams in the given flows .


## ScoreElement

Represents a ScoreElement in the Flow - part of a ScoreElementTable.

**Fields / values**

- `id`
- `events`
- `properties`


## ScoreElementTable

Represents a table of ScoreElement objects in the Flow.

**Fields / values**

- `elements`


## ScoreLibraries

Provides access to the library collections for entities that are styled or have presets.

**Fields / values**

- `clefs`
- `ottavaLines`
- `ensembles`
- `instruments`


## ScoreSubElement

Represents a SubScoreElement - part of a ScoreElement .

**Fields / values**

- `id`
- `properties`


## ScoringEngine

Provides access to the Scoring engine .

**Fields / values**

- `libraries`


## ScriptHost

Object that gives access to the application's functionality via the scripting engine.

**Fields / values**

- `currentScore`
- `engine`

**Functions**

- `ScriptHost()` → `ScriptHost`: Default constructor.
- `exportMusicXML(Score Score, string filename)` → `bool`: Exports the current score as MusicXML.
- `createNewScore()` → `Score`: Creates and returns a new empty Score.
- `importMusicXML(string filename)` → `Score`: Imports a MusicXML file and returns a new score, or nil if file can't be loaded.


## StepTimeInput

Provides stave-oriented note input functionality.

**Fields / values**

- `caret`

**Functions**

- `fromText(String textString)` → `nil`: Create events from the text shorthand format.


## TextEvent

Represents a TextEvent in the Event Stream.

**Fields / values**

- `text`


## TonalityDivisionElement

Represents a TonalityDivisionElement  in the Flow.


## TonalityDivisionEvent

Represents a TonalityDivisionEvent in the Event Stream.

**Fields / values**

- `tonalityDivisionElementID`


## TupletDefinition

A very simple definition for a tuplet's core credentials. .

**Fields / values**

- `left`
- `right`
- `duration`
- `notatedDuration`
- `unit`

**Functions**

- `TupletDefinition()` → `TupletDefinition`: Default constructor.
- `TupletDefinition(int left, int right, NoteheadDuration unit)` → `TupletDefinition`: Construct from ratio and notehead duration.


## TupletEvent

Represents a Tuplet Event in the Event Stream.

**Fields / values**

- `tupletDef`


## VoiceDirection

Specifies whether a voice stream prefers an up or down stem direction.

**Fields / values**

- `kPreferStemsUp`
- `kPreferStemsDown`
- `kForceStemsUp`
- `kForceStemsDown`


## global

**Fields / values**

- `@field[parent = #global] MIDIPitch#MIDIPitch MIDIPitch`
- `@field[parent = #global] NoteName#NoteName NoteName`
- `@field[parent = #global] AccidentalType#AccidentalType AccidentalType`
- `@field[parent = #global] MIDIPitchWithSpelling#MIDIPitchWithSpelling MIDIPitchWithSpelling`
- `@field[parent = #global] IntervalType#IntervalType IntervalType`
- `@field[parent = #global] IntervalDegree#IntervalDegree IntervalDegree`
- `@field[parent = #global] Interval#Interval Interval`
- `@field[parent = #global] RhythmicLength#RhythmicLength RhythmicLength`
- `@field[parent = #global] LogDuration#LogDuration LogDuration`
- `@field[parent = #global] NoteheadDuration#NoteheadDuration NoteheadDuration`
- `@field[parent = #global] NotatedLength#NotatedLength NotatedLength`
- `@field[parent = #global] LayoutTransposition#LayoutTransposition LayoutTransposition`
- `@field[parent = #global] TupletDefinition#TupletDefinition TupletDefinition`
- `@field[parent = #global] DynamicIntensity#DynamicIntensity DynamicIntensity`
- `@field[parent = #global] BarDivisionData#BarDivisionData BarDivisionData`
- `@field[parent = #global] EventStreamType#EventStreamType EventStreamType`
- `@field[parent = #global] ScriptHost#ScriptHost ScriptHost`
- `@field[parent = #global] ScoringEngine#ScoringEngine ScoringEngine`
- `@field[parent = #global] Score#Score Score`
- `@field[parent = #global] ScoreLibraries#ScoreLibraries ScoreLibraries`
- `@field[parent = #global] ClefLibrary#ClefLibrary ClefLibrary`
- `@field[parent = #global] ClefCollectionEntity#ClefCollectionEntity ClefCollectionEntity`
- `@field[parent = #global] OttavaLineLibrary#OttavaLineLibrary OttavaLineLibrary`
- `@field[parent = #global] OttavaLineCollectionEntity#OttavaLineCollectionEntity OttavaLineCollectionEntity`
- `@field[parent = #global] EnsembleLibrary#EnsembleLibrary EnsembleLibrary`
- `@field[parent = #global] EnsembleCollectionEntity#EnsembleCollectionEntity EnsembleCollectionEntity`
- `@field[parent = #global] InstrumentLibrary#InstrumentLibrary InstrumentLibrary`
- `@field[parent = #global] InstrumentCollectionEntity#InstrumentCollectionEntity InstrumentCollectionEntity`
- `@field[parent = #global] Ensemble#Ensemble Ensemble`
- `@field[parent = #global] Player#Player Player`
- `@field[parent = #global] Flow#Flow Flow`
- `@field[parent = #global] FlowElements#FlowElements FlowElements`
- `@field[parent = #global] Instrument#Instrument Instrument`
- `@field[parent = #global] FlowInstrument#FlowInstrument FlowInstrument`
- `@field[parent = #global] OssiaType#OssiaType OssiaType`
- `@field[parent = #global] VoiceDirection#VoiceDirection VoiceDirection`
- `@field[parent = #global] EventStream#EventStream EventStream`
- `@field[parent = #global] EventBlockInstance#EventBlockInstance EventBlockInstance`
- `@field[parent = #global] EventBlock#EventBlock EventBlock`
- `@field[parent = #global] Event#Event Event`
- `@field[parent = #global] NoteEvent#NoteEvent NoteEvent`
- `@field[parent = #global] RestEvent#RestEvent RestEvent`
- `@field[parent = #global] BarRestEvent#BarRestEvent BarRestEvent`
- `@field[parent = #global] TupletEvent#TupletEvent TupletEvent`
- `@field[parent = #global] BarDivisionEvent#BarDivisionEvent BarDivisionEvent`
- `@field[parent = #global] TonalityDivisionEvent#TonalityDivisionEvent TonalityDivisionEvent`
- `@field[parent = #global] DynamicGroupEvent#DynamicGroupEvent DynamicGroupEvent`
- `@field[parent = #global] TextEvent#TextEvent TextEvent`
- `@field[parent = #global] ClefEvent#ClefEvent ClefEvent`
- `@field[parent = #global] OttavaLineEvent#OttavaLineEvent OttavaLineEvent`
- `@field[parent = #global] ScoreElementTable#ScoreElementTable ScoreElementTable`
- `@field[parent = #global] BarDivisionTable#BarDivisionTable BarDivisionTable`
- `@field[parent = #global] DynamicTable#DynamicTable DynamicTable`
- `@field[parent = #global] ScoreElement#ScoreElement ScoreElement`
- `@field[parent = #global] ScoreSubElement#ScoreSubElement ScoreSubElement`
- `@field[parent = #global] BarDivisionElement#BarDivisionElement BarDivisionElement`
- `@field[parent = #global] DynamicGroupElement#DynamicGroupElement DynamicGroupElement`
- `@field[parent = #global] Dynamic#Dynamic Dynamic`
- `@field[parent = #global] ImmediateChangeDynamic#ImmediateChangeDynamic ImmediateChangeDynamic`
- `@field[parent = #global] TonalityDivisionElement#TonalityDivisionElement TonalityDivisionElement`
- `@field[parent = #global] CaretLocation#CaretLocation CaretLocation`
- `@field[parent = #global] StepTimeInput#StepTimeInput StepTimeInput`

