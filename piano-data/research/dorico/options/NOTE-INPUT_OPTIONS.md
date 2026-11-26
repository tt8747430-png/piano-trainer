# Dorico Note Input Options: defaults

Note Input Options (editor behaviour).

Source: factory defaults stored in a project saved by Dorico 4.0.5 (file format 1.1096), decoded from `score.dtn`.
`in Dorico 6` = the option path also appears in the Dorico 6.2 binary (✓), or is not referenced by that name (–).

**52 settings in 13 groups.**

## Groups

[noteInputPitchMode](#noteinputpitchmode) · [filterBehaviour](#filterbehaviour) · [caretGridOptions](#caretgridoptions) · [chordInputOptions](#chordinputoptions) · [chordDiagramInputOptions](#chorddiagraminputoptions) · [noteInputSpellingOptions](#noteinputspellingoptions) · [multiCaretOptions](#multicaretoptions) · [explodeOptions](#explodeoptions) · [reduceOptions](#reduceoptions) · [musicalManipulationOptions](#musicalmanipulationoptions) · [figuredBassInputOptions](#figuredbassinputoptions) · [insertInputOptions](#insertinputoptions) · [atonalSpellingsOptions](#atonalspellingsoptions)

## noteInputPitchMode

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `noteInputPitchMode` | `kWrittenPitch` | enum | – |

## filterBehaviour

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `filterBehaviour` | `kSelect` | enum | – |

## caretGridOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `caretGridVisible` | `true` | bool | ✓ |
| `caretGridResolution` | `1/2` | fraction = 0.5 | ✓ |

## chordInputOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `omissionsConsiderationInputPreference` | `kIgnoreInExtendedChords` | enum | ✓ |
| `ignoreInversions` | `false` | bool | ✓ |
| `suspendedSecondInputPreference` | `kPreferSimple` | enum | ✓ |
| `addedNinthInputPreference` | `kPreferCompound` | enum | ✓ |
| `addedEleventhInputPreference` | `kPreferCompound` | enum | ✓ |
| `omissionOrAdditionInputPreference` | `kPreferOmissions` | enum | ✓ |
| `diminishedMajorSeventhInputPreference` | `kPreferMinMaj7Flat5` | enum | ✓ |
| `preferFlat6OverFlat13InChordsWithoutSeventh` | `false` | bool | ✓ |
| `considerAlteredBassNoteAsPartOfChordDescription` | `false` | bool | ✓ |
| `suspensionOrAdditionPreferenceForNinth` | `kPreferSuspensions` | enum | ✓ |
| `augmentedChordWithSeventhPreference` | `kPreferAugmentedQuality` | enum | ✓ |
| `preferInversionsForSimpleChords` | `false` | bool | ✓ |
| `chordInputSpellingPreference` | `kAllowAllRoots` | enum | ✓ |
| `enforceCleanIntervallicRelationshipBetweenRootAndAlteredBass` | `true` | bool | ✓ |
| `ignoreInversionsInPolychords` | `true` | bool | ✓ |
| `chordSymbolMIDIInputNavigationBehaviour` | `kNextBeat` | enum | ✓ |
| `allowModalChordsToBeInputViaMIDI` | `true` | bool | ✓ |
| `allowChordsToBeInputViaMIDI` | `true` | bool | ✓ |

## chordDiagramInputOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `highestStartingFretToAllowForChordShapes` | `11` | int | ✓ |
| `rootNoteApproach` | `kMustBeLowestNoteOfChord` | enum | ✓ |
| `requireAlteredBassOrNaturalRootToBeLowestNoteOfChord` | `true` | bool | – |
| `dontAllowRootToBeLowestNoteOfChord` | `false` | bool | – |
| `omitRootNoteEntirelyFromChord` | `false` | bool | ✓ |
| `allowChordsBeyond7thToOmit5th` | `true` | bool | ✓ |
| `omit9thFrom11thAnd13thChords` | `true` | bool | ✓ |

## noteInputSpellingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `midiNoteInputRootSpellingPreference` | `kDisallowBSharpAndESharpAndAllDoubles` | enum | ✓ |
| `allowNotesToBeRespeltRetrospectively` | `true` | bool | ✓ |

## multiCaretOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `distributeChords` | `true` | bool | ✓ |

## explodeOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `duplicateNotes` | `true` | bool | ✓ |
| `chordAllocation` | `kAllocateDuplicateBottomNote` | enum | ✓ |

## reduceOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `individualVoices` | `false` | bool | ✓ |

## musicalManipulationOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `allowClippingIfContentWraps` | `true` | bool | ✓ |
| `allowRhythmicRescaling` | `true` | bool | ✓ |
| `inversionIntervalQualityDefault` | `kChromatic` | enum | ✓ |
| `defaultBehaviourForChromaticInversions` | `kRetainOutermostPitches` | enum | ✓ |
| `defaultBehaviourForDiatonicInversions` | `kPivotAboutRoot` | enum | ✓ |
| `forceDestinationSpellingsWhenTransformingScale` | `false` | bool | ✓ |
| `alwaysApplyRelativePitchOffsetsWhenTransformingScale` | `false` | bool | ✓ |
| `mapEnharmonicEquivalents` | `false` | bool | ✓ |

## figuredBassInputOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `useUserOverrides` | `false` | bool | ✓ |
| `diminishedIntervalsInputBehaviour` | `kAdjustDiminishedIntervalsFromNextLowestFigure` | enum | ✓ |
| `treat742AsDominantSeventhOnTonicPedal` | `false` | bool | ✓ |
| `treat64WithAugmentedFourthAsThirdInversionDominantSeventh` | `false` | bool | ✓ |

## insertInputOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `insertWithinCurrentBarBehaviour` | `kChangeAndShowTimeSignature` | enum | – |

## atonalSpellingsOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `disallowRemoteSpellings` | `true` | bool | ✓ |
| `preferredAccidentalType` | `kBoth` | enum | ✓ |
| `chordsPreference` | `kAllowExceptionsPreferringToAvoidRemoteSpellings` | enum | ✓ |
| `alwaysFavourSingleOverMultipleAccidentals` | `false` | bool | ✓ |
