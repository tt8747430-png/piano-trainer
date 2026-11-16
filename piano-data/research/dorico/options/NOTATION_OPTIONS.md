# Dorico Notation Options: defaults

Notation Options (per flow): beaming, rests, accidental duration rules, condensing, etc.

Source: factory defaults stored in a project saved by Dorico 4.0.5 (file format 1.1096), decoded from `score.dtn`.
`in Dorico 6` = the option path also appears in the Dorico 6.2 binary (✓), or is not referenced by that name (–).

**122 settings in 21 groups.**

## Groups

[customPlayerOrder](#customplayerorder) · [omitBarRestsFromSecondaryVoices](#omitbarrestsfromsecondaryvoices) · [omitBarRestsBeneathCues](#omitbarrestsbeneathcues) · [noteGroupingOptions](#notegroupingoptions) · [restGroupingOptions](#restgroupingoptions) · [accidentalStateCalcOptions](#accidentalstatecalcoptions) · [beamingOptions](#beamingoptions) · [noteStemSideCalcOptions](#notestemsidecalcoptions) · [voiceOrderingOptions](#voiceorderingoptions) · [restStavePositionerOptions](#reststavepositioneroptions) · [dotNotationOptions](#dotnotationoptions) · [syncopationDetectorOptions](#syncopationdetectoroptions) · [partTranspositionOptions](#parttranspositionoptions) · [barlineOptions](#barlineoptions) · [percussionOptions](#percussionoptions) · [rhythmSlashNotationOptions](#rhythmslashnotationoptions) · [condensingOptions](#condensingoptions) · [frettedInstrumentStringAssignmentOptions](#frettedinstrumentstringassignmentoptions) · [clefNotationOptions](#clefnotationoptions) · [keySignatureNotationOptions](#keysignaturenotationoptions) · [barNumberNotationOptions](#barnumbernotationoptions)

## customPlayerOrder

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `customPlayerOrder` | `` | text | – |

## omitBarRestsFromSecondaryVoices

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `omitBarRestsFromSecondaryVoices` | `true` | bool | – |

## omitBarRestsBeneathCues

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `omitBarRestsBeneathCues` | `false` | bool | – |

## noteGroupingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `splitLongNotesOnBeatsEndingInMiddleOfBeatAtHalfBar` | `true` | bool | ✓ |
| `splitLongNotesOnBeatsFollowedByRestInMiddleOfBeatIntoSeparateBeats` | `true` | bool | ✓ |
| `splitLongMultiplesOfBeatAtStartOfBarAtHalfBar` | `false` | bool | ✓ |
| `splitLongMultiplesOfBeatAfterStartOfBarAtHalfBar` | `true` | bool | ✓ |
| `splitNoteStartingInMiddleOfBeatAndCrossingHalfBarAtFirstBeatBoundaryToo` | `true` | bool | ✓ |
| `allowSingleNotesInMiddleOfBeatEndingAtBeatBoundaryWithoutCrossingHalfBar` | `false` | bool | – |
| `allowSubDivisionsOfCompoundBeatsToBeNotatedWithDotsIfBeatIsFull` | `true` | bool | ✓ |
| `allowSingleNoteToFillEntireIrregularBar` | `false` | bool | ✓ |
| `breakNotesAcrossAllBeatsInIrregularBar` | `false` | bool | ✓ |

## restGroupingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `allowDottedRestsAtEndOfSimpleBeats` | `false` | bool | ✓ |
| `consolidateRestsAtStartOfCompoundBeat` | `true` | bool | ✓ |
| `consolidateRestsInMiddleOfCompoundBeat` | `false` | bool | ✓ |
| `allowHalfBarRestsEvenIfDotOptionsForbidThem` | `true` | bool | ✓ |
| `allowDottedRestsEqualToLengthOfCompoundBeat` | `true` | bool | ✓ |
| `splitRestsAtAllBeatBoundariesInIrregularTimeSignatures` | `true` | bool | ✓ |
| `barRestAppearanceInLongBars` | `kSemibreve` | enum | ✓ |

## accidentalStateCalcOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `durationBehaviour` | `kCommonPractice` | enum | ✓ |
| `commonOptions.restateAccidentalsForEachPlayer` | `true` | bool | – |
| `commonOptions.useArchaicCancellationsForDoubles` | `false` | bool | – |
| `commonOptions.restateKeysignatureAccidentalsForTrills` | `false` | bool | – |
| `cautionaryOptions.showCautionariesForNotesInSameBarAtDifferentOctaves` | `kShow` | enum | – |
| `cautionaryOptions.showCautionariesForNotesInNextBarAtSameOctave` | `kShow` | enum | – |
| `cautionaryOptions.showCautionariesForNotesInNextBarAtDifferentOctaves` | `kShow` | enum | – |
| `cautionaryOptions.showCautionaryForFirstOccurrenceOfNoteInNextBar` | `kHide` | enum | – |
| `cautionaryOptions.showCautionariesAtTiesOnSystemBreaks` | `kShow` | enum | – |
| `cautionaryOptions.showCautionariesForDimAndAugIntervals` | `kHide` | enum | – |
| `cautionaryOptions.showCautionariesFollowingKeySigChangeInSameBar` | `kHide` | enum | – |
| `cautionaryOptions.showCautionariesFollowingKeySigChangeInNextBar` | `kHide` | enum | – |
| `cautionaryOptions.showCautionariesForPitchesPreviouslyModifiedByGraceNotes` | `kHide` | enum | – |
| `cautionaryOptions.showCautionariesForPitchesOnlyPreviouslySeenInCues` | `kShow` | enum | – |
| `cautionaryOptions.showCautionariesForPitchesOnlyPreviouslySeenInTrills` | `kShow` | enum | – |
| `cautionaryOptions.suppressCautionariesAfterEnharmonicEquivalents` | `false` | bool | – |
| `cautionaryOptions.suppressCautionariesFollowingKeySigCancellations` | `true` | bool | – |
| `cautionaryOptions.suppressCautionariesAlreadyStatedInBar` | `true` | bool | – |
| `secondVienneseSchoolOptions.accidentalPersistWithinBar` | `false` | bool | – |
| `secondVienneseSchoolOptions.suppressOnImmediateRepetitions` | `false` | bool | – |
| `secondVienneseSchoolOptions.suppressOnRepetitionsWithinABeamGroup` | `false` | bool | – |
| `secondVienneseSchoolOptions.showCancellationOnRepetitionOfNoteName` | `false` | bool | – |
| `modernistOptions.accidentalPersistWithinBar` | `false` | bool | – |
| `modernistOptions.suppressOnImmediateRepetitions` | `false` | bool | – |
| `modernistOptions.suppressOnRepetitionsWithinABeamGroup` | `false` | bool | – |
| `modernistOptions.showCancellationOnRepetitionOfNoteName` | `false` | bool | – |
| `modernistCautionaryOptions.showCautionariesForNotesInSameBarAtDifferentOctaves` | `kHide` | enum | – |
| `modernistCautionaryOptions.showCautionariesForNotesInNextBarAtSameOctave` | `kHide` | enum | – |
| `modernistCautionaryOptions.showCautionariesForNotesInNextBarAtDifferentOctaves` | `kHide` | enum | – |

## beamingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `alwaysJoinSecondaryGroupsWithQuaverBeam` | `false` | bool | ✓ |
| `allowHalfBarsToBeamTogether` | `true` | bool | ✓ |
| `allowHalfBarsToBeamTogetherIncludingRests` | `false` | bool | ✓ |
| `halfOrQuarterBarBeamsMustFillEntireSection` | `false` | bool | ✓ |
| `splitHalfBarBeamsAtQuarterBarsInLongTimeSignatures` | `true` | bool | ✓ |
| `allowBeamsToCrossBeatsInSimpleNonHalfBarTimeSig_CrotchetUnit` | `true` | bool | – |
| `allowBeamsToCrossBeatsInSimpleNonHalfBarTimeSig_QuaverUnit` | `true` | bool | – |
| `allowBeamsToCrossBeatsInSimpleNonHalfBarTimeSig_SemiQuaverUnitOrShorter` | `true` | bool | – |
| `beamsAcrossBeatsInSimpleNonHalfBarTimeSigsMustFillBar` | `false` | bool | ✓ |
| `breakQuaverBeamWhenTupletStartsOrEndsWithQuaver` | `true` | bool | ✓ |
| `beamedRestsBehaviour` | `kAllowRestsInBeamsWithoutStemlets` | enum | – |
| `splitSecondaryBeamGroupsAutomatically` | `true` | bool | ✓ |
| `restBeamingOptions.restPrimaryBeamBehaviour` | `kAllowRestsInMiddleOfBeamWithoutStemlets` | enum | – |
| `restBeamingOptions.restSecondaryBeamBehaviour` | `kBreakAllSecondaryBeamsAtRestsIfDurationDiffers` | enum | – |

## noteStemSideCalcOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `useSplitStemsForDiatonicPitchDuplicates` | `true` | bool | ✓ |
| `stemSideAllocationBehaviour` | `kOnlyAllocateDoublyAlteredUnisonsToLeft` | enum | ✓ |

## voiceOrderingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `alwaysPutStemlessDurationsToTheLeftOfStemmedDurations` | `false` | bool | ✓ |
| `shouldPositionOverlappingVoicesBackToBack` | `false` | bool | ✓ |
| `unisonDotAgainstNonDotPositioningRule` | `kIgnoreDot` | enum | ✓ |
| `allowBlackNotesAndMinimUnisonsToShareNotehead` | `false` | bool | ✓ |
| `allowDottedAndUndottedUnisonsToShareNotehead` | `false` | bool | ✓ |

## restStavePositionerOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `longRestPositioningBehaviour` | `kMoveAwayFromMiddleOfStave` | enum | ✓ |
| `strictContrapuntalMode` | `false` | bool | ✓ |
| `alignRestBottomsOnOneLineStaves` | `false` | bool | ✓ |
| `alwaysMoveRestsAwayFromNotesSoundingLater` | `false` | bool | ✓ |
| `restrictImpactOfPositioningWithinTheBar` | `false` | bool | ✓ |
| `lowerBarRestInMultipleVoicesPositioningBehaviour` | `kHangFromBottomLine` | enum | ✓ |

## dotNotationOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `allowUpToNDotsInSimpleBeat` | `2` | int | ✓ |
| `allowUpToNDotsInCompoundBeat` | `2` | int | ✓ |

## syncopationDetectorOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `matchShortLongShort` | `true` | bool | ✓ |
| `matchShortDottedLong` | `true` | bool | ✓ |
| `allowRestsForOneOfShortPair` | `true` | bool | ✓ |
| `allowPatternsToCrossHalfBar` | `true` | bool | ✓ |
| `patternsCrossingHalfBarMustFillEntireBar` | `true` | bool | ✓ |

## partTranspositionOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `preferEnharmonicEquivalentWithFewerAccidentals` | `true` | bool | ✓ |
| `preferSimplerAccidentals` | `true` | bool | ✓ |

## barlineOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `defaultBarlineType` | `kNormal` | enum | ✓ |
| `finalBarlineType` | `kFinal` | enum | ✓ |
| `drawSingleBarlinesBetweenStaves` | `false` | bool | ✓ |
| `showSingleSystemicBarlineAtEndOfSystem` | `false` | bool | ✓ |
| `showSingleSystemicBarlineAtEndOfFlow` | `false` | bool | ✓ |
| `showSystemicBarlineForSingleStaffSystems` | `false` | bool | ✓ |
| `showSystemicBarlineForSingleStaffSystemsOnFirstSystem` | `false` | bool | ✓ |

## percussionOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `overlappingNoteBehaviour` | `kTie` | enum | ✓ |
| `drumKitVoicingType` | `kFollowKit` | enum | ✓ |
| `padOpposingKitVoicesWithRestsAtStartAndEnd` | `false` | bool | ✓ |

## rhythmSlashNotationOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `numSpacesFromMiddleOfStaveToOffsetSlashesInOpposingVoiceDirections` | `1` | int | ✓ |
| `numSpacesBetweenSlashesInSameVoiceDirection` | `1` | int | ✓ |
| `numSpacesFromMiddleOfStaveToOffsetSlashesWhenOpposingNonSlashedVoicesPresent` | `1` | int | ✓ |
| `maximumDurationForAutomaticRhythmSlashes` | `kCrotchet` | enum | ✓ |
| `behaviourInCompoundTimeSignatures` | `kReflectBeatGroups` | enum | ✓ |
| `behaviourInIrregularTimeSignatures` | `kReflectBeatGroups` | enum | ✓ |
| `maximumDurationAppliesToCompoundTimeSignatures` | `true` | bool | ✓ |
| `maximumDurationAppliesToIrregularTimeSignatures` | `true` | bool | ✓ |
| `beatLengthForOpenTimeSignatures` | `steamVariantList:list: {int: 8}, {int: 0}` | text | ✓ |

## condensingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `phraseMaxPitchCrossCount` | `1` | int | ✓ |
| `allowAnyNumberOfPitchCrosses` | `false` | bool | ✓ |
| `preventPlayingTechniqueAmalgamation` | `false` | bool | ✓ |
| `preventStemAmalgamation` | `false` | bool | ✓ |
| `allowStemAmalgamation` | `true` | bool | – |
| `silentPlayerPolicy` | `kInclude` | enum | ✓ |
| `allowTrueUnisons` | `true` | bool | ✓ |
| `allowMidSharedStemUnisons` | `true` | bool | ✓ |
| `slurAmalgamationPolicy` | `kAlways` | enum | ✓ |
| `hideRestsForSilentPlayers` | `false` | bool | ✓ |
| `hideRestsForSilentPlayersOnlyForRangesThatAdjoinABarline` | `false` | bool | ✓ |
| `minimumLengthToHideRestsForSilentPlayers` | `2` | int | ✓ |
| `mirrorAccidentalPropertiesFromNormalStaves` | `false` | bool | ✓ |

## frettedInstrumentStringAssignmentOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `openStringAssignmentPreference` | `kAlwaysAllowOpenStrings` | enum | ✓ |
| `ignoreReservedStringIndicesIfUnassignable` | `true` | bool | ✓ |

## clefNotationOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `respectOctaveTransposition` | `false` | bool | ✓ |
| `showClefInPreambleAfterFirstSystem` | `true` | bool | ✓ |

## keySignatureNotationOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `showKeySignatureInPreambleAfterFirstSystem` | `true` | bool | ✓ |

## barNumberNotationOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `useGlobalDivisionsMapForBarNumbers` | `false` | bool | – |
