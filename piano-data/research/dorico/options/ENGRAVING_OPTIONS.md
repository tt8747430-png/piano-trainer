# Dorico Engraving Options: defaults

Engraving Options (project-wide). Distances are in **staff spaces** unless the name says otherwise; fractions are exact.

Source: factory defaults stored in a project saved by Dorico 4.0.5 (file format 1.1096), decoded from `score.dtn`.
`in Dorico 6` = the option path also appears in the Dorico 6.2 binary (✓), or is not referenced by that name (–).

**1414 settings in 55 groups.**

## Groups

[rhythmDotPositionOptions](#rhythmdotpositionoptions) · [dynamicsOptions](#dynamicsoptions) · [bracketingOptions](#bracketingoptions) · [ledgerLineOptions](#ledgerlineoptions) · [tieOptions](#tieoptions) · [timeSignatureOptions](#timesignatureoptions) · [ottavaLineOptions](#ottavalineoptions) · [tupletOptions](#tupletoptions) · [staveOptions](#staveoptions) · [noteOptions](#noteoptions) · [articulationOptions](#articulationoptions) · [spacingGapOptions](#spacinggapoptions) · [clefOptions](#clefoptions) · [stemOptions](#stemoptions) · [slurOptions](#sluroptions) · [accidentalStackerCalcOptions](#accidentalstackercalcoptions) · [staffLabelOptions](#stafflabeloptions) · [keySignatureOptions](#keysignatureoptions) · [glissandoLineOptions](#glissandolineoptions) · [guitarBendEngravingOptions](#guitarbendengravingoptions) · [guitarTechniquesEngravingOptions](#guitartechniquesengravingoptions) · [tempoOptions](#tempooptions) · [rehearsalMarkOptions](#rehearsalmarkoptions) · [languageOptions](#languageoptions) · [lyricOptions](#lyricoptions) · [barlineOptions](#barlineoptions) · [beamEngravingOptions](#beamengravingoptions) · [ornamentAndTrillOptions](#ornamentandtrilloptions) · [barNumberEngravingOptions](#barnumberengravingoptions) · [instrumentChangeEngravingOptions](#instrumentchangeengravingoptions) · [textOptions](#textoptions) · [holdAndPauseOptions](#holdandpauseoptions) · [multiRestOptions](#multirestoptions) · [barRepeatOptions](#barrepeatoptions) · [playingTechniqueOptions](#playingtechniqueoptions) · [arpeggioOptions](#arpeggiooptions) · [pedalLineOptions](#pedallineoptions) · [chordSymbolEngravingOptions](#chordsymbolengravingoptions) · [chordDiagramEngravingOptions](#chorddiagramengravingoptions) · [repeatEndingLineEngravingOptions](#repeatendinglineengravingoptions) · [cueEngravingOptions](#cueengravingoptions) · [fingeringEngravingOptions](#fingeringengravingoptions) · [percussionLegendEngravingOptions](#percussionlegendengravingoptions) · [systemDividerEngravingOptions](#systemdividerengravingoptions) · [markerEngravingOptions](#markerengravingoptions) · [divisiEngravingOptions](#divisiengravingoptions) · [slashRegionEngravingOptions](#slashregionengravingoptions) · [repeatMarkerEngravingOptions](#repeatmarkerengravingoptions) · [jazzArticulationEngravingOptions](#jazzarticulationengravingoptions) · [tacetEngravingOptions](#tacetengravingoptions) · [harpPedalEngravingOptions](#harppedalengravingoptions) · [condensingEngravingOptions](#condensingengravingoptions) · [stringIndicatorEngravingOptions](#stringindicatorengravingoptions) · [horizontalLineEngravingOptions](#horizontallineengravingoptions) · [figuredBassEngravingOptions](#figuredbassengravingoptions)

## rhythmDotPositionOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `minimumVoiceColumnGap` | `7/10` | fraction = 0.7 | ✓ |
| `noteDotGap` | `1/2` | fraction = 0.5 | ✓ |
| `dotDotGap` | `1/4` | fraction = 0.25 | ✓ |
| `noteNoteGap` | `1/16` | fraction = 0.0625 | ✓ |
| `alteredUnisonGap` | `1/2` | fraction = 0.5 | ✓ |
| `minimumGapAfterDots` | `0` | int | ✓ |
| `rhythmDotCoalescingBehaviour` | `kAllowCoalescing` | enum | – |
| `rhythmDotConsolidation` | `kMatchingNoteDuration` | enum | ✓ |
| `separateUnisonRhythmDots` | `false` | bool | – |
| `unisonRhythmDotConsolidation` | `kUnisonsOnLinesAndInSpaces` | enum | ✓ |
| `tablatureRhythmDotsPosition` | `kOutsideStave` | enum | ✓ |

## dynamicsOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `rinforzandoAndSforzandoHaveZ` | `true` | bool | ✓ |
| `abbreviateSubito` | `true` | bool | ✓ |
| `subitoUsesSPrefixForForte` | `false` | bool | ✓ |
| `subitoDisplaysOnRightOfDynamic` | `kRight` | enum | ✓ |
| `nienteAppearance` | `kCircleOnHairpin` | enum | ✓ |
| `abbreviatePossibile` | `false` | bool | ✓ |
| `gradualDynamicAppearance` | `kHairpin` | enum | ✓ |
| `hairpinLineAppearance` | `kSolid` | enum | ✓ |
| `hairpinDotDiameter` | `1/4` | fraction = 0.25 | ✓ |
| `hairpinDotGap` | `1/3` | fraction = 0.333333 | ✓ |
| `hairpinDashLength` | `5/8` | fraction = 0.625 | ✓ |
| `hairpinDashGap` | `1/3` | fraction = 0.333333 | ✓ |
| `crescContinuationLineAppearance` | `kDotted` | enum | ✓ |
| `crescContinuationLineDotDiameter` | `1/5` | fraction = 0.2 | ✓ |
| `crescContinuationLineDotGap` | `1/4` | fraction = 0.25 | ✓ |
| `crescContinuationLineDashLength` | `1/3` | fraction = 0.333333 | ✓ |
| `crescContinuationLineDashGap` | `1/2` | fraction = 0.5 | ✓ |
| `crescContinuationLinePenWidth` | `1/6` | fraction = 0.166667 | ✓ |
| `hyphenatedCrescContinuationLineAppearance` | `kDashed` | enum | ✓ |
| `hyphenatedCrescContinuationLineDotDiameter` | `1/5` | fraction = 0.2 | ✓ |
| `hyphenatedCrescContinuationLineDotGap` | `3` | int | ✓ |
| `hyphenatedCrescContinuationLineDashLength` | `1/2` | fraction = 0.5 | ✓ |
| `hyphenatedCrescContinuationLineDashGap` | `3` | int | ✓ |
| `hyphenatedCrescContinuationLinePenWidth` | `1/6` | fraction = 0.166667 | ✓ |
| `diminuendoTextStyle` | `kDiminuendo` | enum | ✓ |
| `abbreviateUnhyphenatedDynamics` | `true` | bool | ✓ |
| `continueHairpinsThroughChangesOfDynamic` | `false` | bool | ✓ |
| `combinedDynamicsAlwaysUseSeparator` | `false` | bool | ✓ |
| `combinedDynamicsSeparator` | `kHyphen` | enum | ✓ |
| `hairpinPenWidth` | `1/6` | fraction = 0.166667 | ✓ |
| `maximumHairpinOpenEndAperture` | `3/2` | fraction = 1.5 | ✓ |
| `minimumHairpinOpenEndAperture` | `1` | int | ✓ |
| `openEndApertureForHairpinsOverSystemBreaks` | `1` | int | ✓ |
| `closedEndApertureForHairpinsOverSystemBreaks` | `1/3` | fraction = 0.333333 | ✓ |
| `gapBetweenHairpinAndChangeOfDynamic` | `1/2` | fraction = 0.5 | ✓ |
| `gapBetweenAdjacentHairpins` | `1` | int | ✓ |
| `gapBetweenChangesOfDynamic` | `1/8` | fraction = 0.125 | ✓ |
| `gapBetweenMessaDiVoceHairpins` | `1/3` | fraction = 0.333333 | ✓ |
| `minimumDistanceBelowStaveForTextBasedDynamics` | `3` | int | ✓ |
| `minimumDistanceAboveStaveForTextBasedDynamics` | `5/2` | fraction = 2.5 | ✓ |
| `minimumDistanceBelowStaveForHairpins` | `5/2` | fraction = 2.5 | ✓ |
| `minimumDistanceAboveStaveForHairpins` | `3` | int | ✓ |
| `additionalLeewayForInterStaveDynamics` | `0` | int | – |
| `minimumGapAboveOrBelowOtherObjects` | `3/4` | fraction = 0.75 | ✓ |
| `minimumVerticalGapBetweenRowsOfCoincidentDynamics` | `3/4` | fraction = 0.75 | ✓ |
| `gapAfterMidBarDynamicsBeforeBeat` | `1/2` | fraction = 0.5 | ✓ |
| `gapAfterEndOfBarDynamicsBeforeBeat` | `1/2` | fraction = 0.5 | ✓ |
| `gapBetweenHairpinAndBarline` | `3/4` | fraction = 0.75 | ✓ |
| `gapBetweenDynamicAndEndOfSystem` | `3/4` | fraction = 0.75 | ✓ |
| `minimumDistanceAfterBarlineToContinueHairpinBeyondBarline` | `2` | int | ✓ |
| `alwaysCompleteHairpinsBeforeEndOfBar` | `false` | bool | ✓ |
| `gapBetweenNienteTextAndHairpin` | `1/4` | fraction = 0.25 | ✓ |
| `amountToShortenHairpinsEndingInNiente` | `2/3` | fraction = 0.666667 | ✓ |
| `textBasedDynamicHorizontalAlignment` | `kAlignOpticalCentreWithNotehead` | enum | ✓ |
| `verticalGapBetweenHairpinsAndText` | `1/2` | fraction = 0.5 | ✓ |
| `horizontalOffsetForHairpinText` | `1/2` | fraction = 0.5 | ✓ |
| `minimumApertureDeltaForContinuationHairpins` | `3/8` | fraction = 0.375 | ✓ |
| `restartContinuationHairpinsAtSystemBreaks` | `false` | bool | ✓ |
| `minimumLegalLengthForHairpins` | `3` | int | ✓ |
| `preferToMoveEndOfFirstOfAbuttingHairpins` | `false` | bool | ✓ |
| `gapBetweenTextAndContinuationLine` | `2/5` | fraction = 0.4 | ✓ |
| `lyricsRelativePosition` | `kOutside` | enum | ✓ |
| `dynamicErasurePadding` | `1/8` | fraction = 0.125 | ✓ |
| `flaredEndWidth` | `1/2` | fraction = 0.5 | ✓ |
| `flaredEndHeight` | `3/4` | fraction = 0.75 | ✓ |
| `hairpinTextAtStartPosition` | `kAboveOrBelow` | enum | ✓ |
| `minimumLegalLengthForMessaDiVoceSegments` | `9/4` | fraction = 2.25 | ✓ |
| `evenlyDistributeMessaDiVoceSegmentsEndingAtBarline` | `kDistributeEvenlyIfIntersectsOnlyOneChordAcrossAllInstruments` | enum | ✓ |
| `messaDiVoceSegmentLengthThresholdForEvenDistribution` | `8` | int | ✓ |

## bracketingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `bracketPlacingApproach` | `kOrchestral` | enum | – |
| `useSubBrackets` | `true` | bool | – |
| `useBracesForSubBrackets` | `false` | bool | – |
| `bracketWidth` | `1/2` | fraction = 0.5 | ✓ |
| `bracketEndType` | `kWing` | enum | ✓ |
| `subBracketWidth` | `1` | int | ✓ |
| `subBracketLineThickness` | `1/8` | fraction = 0.125 | ✓ |
| `bracketDistanceFromSystemicBarline` | `1/2` | fraction = 0.5 | ✓ |
| `bracedSubBracketDistanceFromBracket` | `3/8` | fraction = 0.375 | ✓ |
| `showBracketForSingleStaff` | `false` | bool | – |
| `subBracketMeetsSystemicBarline` | `true` | bool | ✓ |
| `bracketAdditionalProtrusionBeyondStaff` | `1/4` | fraction = 0.25 | ✓ |
| `braceDistanceFromSystemicBarline` | `9/20` | fraction = 0.45 | ✓ |
| `drawBraceOnSingleStave` | `true` | bool | – |
| `subSubBracketWidth` | `2/3` | fraction = 0.666667 | ✓ |
| `subSubBracketLineThickness` | `1/8` | fraction = 0.125 | ✓ |
| `subSubBracketAppearance` | `kReachSubBracket` | enum | ✓ |
| `drawSubBracketOnSingleStave` | `true` | bool | – |
| `maxHeightForSmallBrace` | `8` | int | ✓ |
| `maxHeightForRegularBrace` | `16` | int | ✓ |
| `maxHeightForLargeBrace` | `24` | int | ✓ |
| `maxHeightForLargerBrace` | `32` | int | ✓ |
| `useFlatBraceBeyondMaxHeightForLargerBrace` | `true` | bool | ✓ |

## ledgerLineOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `ledgerLineProtrusionForNotes` | `2/5` | fraction = 0.4 | ✓ |
| `ledgerLineProtrusionWhenRightOfAccidental` | `1/6` | fraction = 0.166667 | ✓ |
| `ledgerLineInnerProtrusionInRunOfShortBeamedNotes` | `1/5` | fraction = 0.2 | ✓ |
| `ledgerLineProtrusionForRests` | `1/4` | fraction = 0.25 | ✓ |
| `ledgerLineThickness` | `1/6` | fraction = 0.166667 | ✓ |
| `shortenLedgerLinesForAccidentals` | `true` | bool | ✓ |
| `shortenLedgerLinesInRunsOfShortBeamedNotes` | `true` | bool | ✓ |

## tieOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `directionForTiesBetweenOpposingStems` | `kAlwaysUp` | enum | ✓ |
| `horizontalPositionInChords` | `kBetweenNoteheads` | enum | ✓ |
| `horizontalPositionOnSingleNotes` | `kAboveOrBelowNoteheads` | enum | ✓ |
| `horizontalPositionInUnisons` | `kAboveOrBelowNoteheads` | enum | ✓ |
| `outsideNoteheadPositioningBehaviour` | `kEitherEndCanGoAboveOrBelow` | enum | ✓ |
| `preferTiesOfUniformLengthInChords` | `false` | bool | ✓ |
| `tieRhythmDotAvoidanceBehaviour` | `kNonCollidingTiesBeforeRhythmDots` | enum | ✓ |
| `gapBeforeAndAfterTiesBetweenNoteheads` | `1/4` | fraction = 0.25 | ✓ |
| `gapBeforeAndAfterTiesOutsideNoteheads` | `1/6` | fraction = 0.166667 | ✓ |
| `minimumGapForTiesFromOutsideNoteheadBlockedByStem` | `1/3` | fraction = 0.333333 | ✓ |
| `gapBeforeAccidentals` | `1/4` | fraction = 0.25 | ✓ |
| `gapAfterNoteFlags` | `1/5` | fraction = 0.2 | ✓ |
| `permissibleBisectionWithTopOfFlat` | `7/8` | fraction = 0.875 | ✓ |
| `permissibleBisectionWithTopOrBottomOfNatural` | `2/3` | fraction = 0.666667 | ✓ |
| `horizontalOffsetForTiesAboveOrBelowNoteheads` | `0` | int | ✓ |
| `horizontalOffsetForCoincidentTiesAboveOrBelowNoteheads` | `1/8` | fraction = 0.125 | ✓ |
| `verticalOffsetForTiesAboveOrBelowNoteheads` | `1/4` | fraction = 0.25 | ✓ |
| `outerTiesAlwaysGoToEdgeOfNoteheadsForSingleNotes` | `false` | bool | ✓ |
| `outerTiesAlwaysGoToEdgeOfNoteheadsForChords` | `false` | bool | ✓ |
| `verticalOffsetForTiesBetweenNoteheadsOnStaveLine` | `1/4` | fraction = 0.25 | ✓ |
| `verticalOffsetForTiesBetweenNoteheadsInSpace` | `0` | int | ✓ |
| `verticalOffsetForTiesOutsideNoteheadEdgeOnStaveLine` | `4/5` | fraction = 0.8 | ✓ |
| `verticalOffsetForTiesOutsideNoteheadEdgeInSpace` | `4/5` | fraction = 0.8 | ✓ |
| `verticalOffsetForTiesBetweenNotesBeforeRhythmDotsInSpace` | `1/4` | fraction = 0.25 | ✓ |
| `verticalOffsetForTiesBetweenNotesBeforeRhythmDotsOnStaveLine` | `3/4` | fraction = 0.75 | ✓ |
| `verticalOffsetForTiesOutsideNoteheadEdgeBeforeRhythmDotsInSpace` | `0` | int | ✓ |
| `verticalOffsetForTiesOutsideNoteheadEdgeBeforeRhythmDotsOnStaveLine` | `1/3` | fraction = 0.333333 | ✓ |
| `verticalOffsetForTiesOnBackNotes` | `1/4` | fraction = 0.25 | ✓ |
| `idealMinimumDistanceForAdjacentTiesInSameDirection` | `1` | int | ✓ |
| `idealMinimumDistanceForAdjacentTiesInSameDirectionInSeconds` | `3/4` | fraction = 0.75 | ✓ |
| `idealMinimumDistanceForAdjacentTiesInOpposingDirections` | `1/2` | fraction = 0.5 | ✓ |
| `minimumGapBetweenTiesSharingStavePosition` | `1/2` | fraction = 0.5 | ✓ |
| `maxNumberOfSpacesBeyondNoteheadEndOfChordForTies` | `1` | int | ✓ |
| `maxNumberOfSpacesBeyondStemEndOfChordForTies` | `2` | int | ✓ |
| `tieThickness` | `1/4` | fraction = 0.25 | ✓ |
| `tieEndThickness` | `1/8` | fraction = 0.125 | ✓ |
| `maxTieShoulderOffsetForShortTies` | `3/5` | fraction = 0.6 | ✓ |
| `minTieShoulderOffsetForLongTies` | `1/10` | fraction = 0.1 | ✓ |
| `minTieHeightForShortTies` | `1/2` | fraction = 0.5 | ✓ |
| `maxTieHeightForLongTies` | `2` | int | ✓ |
| `adjustTieCurvatureToAvoidStaveLines` | `true` | bool | ✓ |
| `preferToOffsetTiesThanIncreaseCurvature` | `true` | bool | ✓ |
| `minimumGapBetweenTieMidPointAndStaveLine` | `1/4` | fraction = 0.25 | ✓ |
| `maxPercentageOfTieHeightWhenReducingToAvoidStaveLines` | `60` | int | ✓ |
| `createSubGroupsForNotesAFourthOrMoreApart` | `false` | bool | ✓ |
| `dashLengthForDashedTies` | `1/2` | fraction = 0.5 | ✓ |
| `gapLengthForDashedTies` | `1/3` | fraction = 0.333333 | ✓ |
| `dotDiameterForDottedTies` | `1/4` | fraction = 0.25 | ✓ |
| `gapLengthForDottedTies` | `1/3` | fraction = 0.333333 | ✓ |
| `minimumLengthForTies` | `3/2` | fraction = 1.5 | ✓ |
| `minimumLengthForTiesOnGraceNotes` | `4/5` | fraction = 0.8 | ✓ |
| `gapForTiesContinuingOverSystemBreaks` | `1/2` | fraction = 0.5 | ✓ |
| `editorialTieStrokeLength` | `3/4` | fraction = 0.75 | ✓ |
| `editorialTieStrokeLineWidth` | `1/8` | fraction = 0.125 | ✓ |
| `offsetFromStaveLineWhenUnderDuress` | `1/8` | fraction = 0.125 | ✓ |
| `minimumLengthForLVTies` | `3/2` | fraction = 1.5 | ✓ |
| `minimumLengthForLVTiesOnGraceNotes` | `4/5` | fraction = 0.8 | ✓ |
| `minimumLengthForCueInTies` | `3/2` | fraction = 1.5 | ✓ |
| `minimumLengthForCueInTiesOnGraceNotes` | `4/5` | fraction = 0.8 | ✓ |
| `minimumLengthForCueOutTies` | `3/2` | fraction = 1.5 | ✓ |
| `minimumLengthForCueOutTiesOnGraceNotes` | `4/5` | fraction = 0.8 | ✓ |
| `horizontalOverlapAllowedForDiamondSlashes` | `1/6` | fraction = 0.166667 | ✓ |
| `additionalHorizontalOffsetForTieEndPointsOutsideSlashes` | `1/6` | fraction = 0.166667 | ✓ |
| `additionalHorizontalOffsetForTieEndPointsOutsideXShapedSlashes` | `1` | int | ✓ |
| `gapBeforeIntraStaveFingerings` | `1/6` | fraction = 0.166667 | ✓ |
| `gapBeforeAndAfterNoteheadParenthesesAndBrackets` | `1/10` | fraction = 0.1 | ✓ |
| `dashedTiesOnTab` | `false` | bool | ✓ |
| `showSingleTieOnTab` | `false` | bool | ✓ |

## timeSignatureOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `openTimeSignatureAppearance` | `kEmpty` | enum | ✓ |
| `timeSignatureNumeratorAppearance` | `kNumber` | enum | ✓ |
| `timeSignatureDenominatorAppearance` | `kNumber` | enum | ✓ |
| `timeSignatureInterchangeableSeparator` | `kParentheses` | enum | ✓ |
| `timeSignatureDrawDenominatorAsBeatLength` | `true` | bool | ✓ |
| `timeSignatureDrawClosingParenthesis` | `false` | bool | ✓ |
| `gapBetweenInterchangeableTimeSigAndSeparator` | `1/4` | fraction = 0.25 | ✓ |
| `gapBetweenInterchangeableTimeSigs` | `1/4` | fraction = 0.25 | ✓ |
| `gapBetweenTimeSigAndBracket` | `-1/10` | fraction = -0.1 | ✓ |
| `gapBetweenTimeSigAndParentheses` | `1/10` | fraction = 0.1 | ✓ |
| `gapBetweenAlternatingTimeSigAndSeparator` | `1/4` | fraction = 0.25 | ✓ |
| `scaleFactorOfLargeTimeSignatureForOneStave` | `5/4` | fraction = 1.25 | ✓ |
| `scaleFactorOfLargeTimeSignatureForTwoOrMoreStaves` | `4` | int | ✓ |
| `scaleFactorOfLargeTimeSignatureForFourOrMoreStaves` | `10` | int | ✓ |
| `scaleFactorOfAboveStaveTimeSignature` | `2` | int | ✓ |
| `gapBetweenOutsideStaveTimeSignatureAndStave` | `1/2` | fraction = 0.5 | ✓ |
| `gapBetweenOutsideStaveTimeSignatureAndOtherObjects` | `1/4` | fraction = 0.25 | ✓ |
| `leftAlignMidSystemOutsideStaveTimeSignature` | `false` | bool | ✓ |
| `moveRehearsalMarkAndTempoToTheRightOfOutsideStaveTimeSignature` | `true` | bool | – |
| `scaleFactorOfNoteDenominatorOfOutsideStaveTimeSignature` | `1/2` | fraction = 0.5 | ✓ |
| `largeTimeSignatureVerticalAlignment` | `kCentre` | enum | ✓ |
| `largeTimeSignatureTreatPercussionsAndKeysAsSingleBracket` | `false` | bool | ✓ |
| `gapBetweenNumeratorAndDenominatorForNormalTimeSignatures` | `0` | int | ✓ |
| `gapBetweenNumeratorAndDenominatorForLargeTimeSignatures` | `0` | int | ✓ |
| `gapBetweenNumeratorAndDenominatorForAboveStaveTimeSignatures` | `0` | int | ✓ |
| `timeSignatureBackgroundErasure` | `false` | bool | ✓ |
| `timeSignatureBackgroundErasureWidth` | `1/4` | fraction = 0.25 | ✓ |

## ottavaLineOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `ottavaLineAppearance` | `kDashed` | enum | ✓ |
| `ottavaLineExtensionLineThickness` | `1/12` | fraction = 0.0833333 | ✓ |
| `optimalDashLengthForOttavaLines` | `3/4` | fraction = 0.75 | ✓ |
| `optimalDashGapLengthForOttavaLines` | `3/4` | fraction = 0.75 | ✓ |
| `optimalDotDiameterForOttavaLines` | `1/6` | fraction = 0.166667 | ✓ |
| `optimalGapBetweenDotsForOttavaLines` | `1/3` | fraction = 0.333333 | ✓ |
| `ottavaLineExtensionLineProtrusionAtRHS` | `2/3` | fraction = 0.666667 | ✓ |
| `ottavaLineHookLength` | `1` | int | ✓ |
| `ottavaLineLHSAlignment` | `kStartWithLeftmostNotehead` | enum | ✓ |
| `horizontalAlignmentWithNoteheads` | `kCentre` | enum | – |
| `noteRelativeHorizontalAlignment` | `kCentre` | enum | ✓ |
| `ottavaLineLabelType` | `kNumberWithTextSuffix` | enum | ✓ |
| `singleOctaveOttavaBassaAppearance` | `kPrefer8ba` | enum | ✓ |
| `ottavaBassaAppearance` | `kIncludeBassa` | enum | ✓ |
| `ottavaLineLabelTypeForContinuation` | `kNumberOnly` | enum | ✓ |
| `singleOctaveOttavaBassaAppearanceForContinuation` | `kPrefer8ba` | enum | ✓ |
| `ottavaBassaAppearanceForContinuation` | `kOmitBassa` | enum | ✓ |
| `alignmentOfExtensionLineForLinesRaisingPitch` | `kTop` | enum | ✓ |
| `alignmentOfExtensionLineForLinesLoweringPitch` | `kBottom` | enum | ✓ |
| `showContinuationLabelInParentheses` | `true` | bool | ✓ |
| `spaceBetweenLabelAndExtensionLine` | `1/8` | fraction = 0.125 | ✓ |
| `tuckExtensionAboveOrBelowLabelWherePossible` | `true` | bool | ✓ |
| `minimumLengthForOttavaExtensionLine` | `1` | int | ✓ |
| `minimumDistanceBetweenOttavaLineRHSAndNextChord` | `1/8` | fraction = 0.125 | ✓ |
| `horizontalOffsetForStartOfLine` | `0` | int | ✓ |
| `ottavaLineVerticalGapInside` | `1/4` | fraction = 0.25 | ✓ |

## tupletOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `tupletBracketLineWidth` | `1/8` | fraction = 0.125 | ✓ |
| `tupletHookLength` | `3/4` | fraction = 0.75 | ✓ |
| `tupletEndPosition` | `kEndAtHypotheticalLastDivision` | enum | ✓ |
| `tupletGapAfterEndPosition` | `1/2` | fraction = 0.5 | ✓ |
| `tupletBracketVisibilityRule` | `kAutomatic` | enum | ✓ |
| `tupletBracketCanBeAngled` | `true` | bool | – |
| `tupletBracketForceHorizontal` | `false` | bool | ✓ |
| `tupletBracketMaximumAngle` | `7/4` | fraction = 1.75 | ✓ |
| `tupletTextContent` | `kNumber` | enum | ✓ |
| `tupletTextPosition` | `kAtVisualCentre` | enum | ✓ |
| `tupletTextWeight` | `kBold` | enum | ✓ |
| `tupletOuterTextPadding` | `1/2` | fraction = 0.5 | ✓ |
| `ratioFontScale` | `1` | int | ✓ |
| `noteFontScale` | `1/2` | fraction = 0.5 | ✓ |
| `tupletVerticalGapInside` | `1/4` | fraction = 0.25 | ✓ |
| `tupletsAlwaysAboveForVocal` | `true` | bool | – |
| `hideSuccessiveIdenticalTuplets` | `false` | bool | ✓ |
| `numberOfVisibleSuccessiveTuplet` | `3` | int | ✓ |
| `successiveIdenticalTupletHidingPolicy` | `kHideOnlySuccessive` | enum | ✓ |
| `tupletBracketLeftDelta` | `1/4` | fraction = 0.25 | ✓ |
| `tupletBracketRightDelta` | `1/4` | fraction = 0.25 | ✓ |

## staveOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `staveLineThickness` | `1/8` | fraction = 0.125 | ✓ |
| `ossiaScaleFactor` | `2/3` | fraction = 0.666667 | ✓ |
| `midBarOssiaStartStaveLinePadding` | `1` | int | ✓ |
| `midBarOssiaEndStaveLinePadding` | `0` | int | ✓ |
| `tabStaveLineSeparationScaleFactor` | `3/2` | fraction = 1.5 | ✓ |

## noteOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `graceNoteVisualScale` | `3/5` | fraction = 0.6 | ✓ |
| `graceNoteMinimumDistanceFromMainClump` | `1/2` | fraction = 0.5 | ✓ |
| `graceNoteSlashWidth` | `1/6` | fraction = 0.166667 | ✓ |
| `graceNoteDefaultSlashLength` | `2` | int | ✓ |
| `graceNoteDefaultSlashInsetFromStemTip` | `1` | int | ✓ |
| `graceNoteDefaultSlashOffsetToRight` | `1/2` | fraction = 0.5 | ✓ |
| `graceNoteSlashMinimumProtrusionFromBeam` | `1` | int | ✓ |
| `defaultNoteheadSet` | `noteheadset.large` | text | ✓ |
| `defaultRestSet` | `restset.default` | text | ✓ |
| `offsetNoteShapesForMinorKeysWhenUsingScaleDegreeNoteheadType` | `true` | bool | ✓ |
| `preferredAppearanceForBreveNotehead` | `kSquare` | enum | ✓ |
| `gapInsideParenthesisedNoteheads` | `0` | int | ✓ |
| `gapInsideParenthesisedNoteheadsOnTabStaves` | `1/12` | fraction = 0.0833333 | ✓ |
| `additionalGapBetweenParenthesisExtremityAndAlienNoteheadMiddle` | `1/8` | fraction = 0.125 | ✓ |
| `additionalGapBetweenStemAndParenthesis` | `1/8` | fraction = 0.125 | ✓ |
| `additionalGapBetweenRhythmDotAndParenthesisMiddle` | `-1/12` | fraction = -0.0833333 | ✓ |
| `additionalGapBetweenRhythmDotAndParenthesisExtremity` | `1/6` | fraction = 0.166667 | ✓ |
| `parenthesisVerticalExtremityLength` | `1/4` | fraction = 0.25 | ✓ |
| `additionalGapBetweenNoteFlagAndParenthesis` | `1/8` | fraction = 0.125 | ✓ |
| `additionalGapBetweenLedgerLineAndParenthesisMiddle` | `-1/16` | fraction = -0.0625 | ✓ |
| `additionalGapBetweenLedgerLineAndParenthesisExtremity` | `1/8` | fraction = 0.125 | ✓ |
| `additionalGapBetweenNeighbouringParenthesisAndOther` | `1/8` | fraction = 0.125 | ✓ |
| `additionalGapBetweenNeighbouringParenthesisAndOtherAtExtremity` | `0` | int | ✓ |
| `minimumGapOnFarSideOfParenthesis` | `1/15` | fraction = 0.0666667 | ✓ |
| `minimumGapAboveAndBelowParenthesis` | `1/8` | fraction = 0.125 | ✓ |
| `minimumGapAboveAndBelowNeighbouringParenthesisAndOther` | `0` | int | ✓ |
| `gapInsideBracketedNoteheads` | `0` | int | ✓ |
| `additionalGapBetweenBracketExtremityAndAlienNoteheadMiddle` | `1/8` | fraction = 0.125 | ✓ |
| `additionalGapBetweenStemAndBracket` | `1/8` | fraction = 0.125 | ✓ |
| `additionalGapBetweenRhythmDotAndBracketMiddle` | `-1/12` | fraction = -0.0833333 | ✓ |
| `additionalGapBetweenRhythmDotAndBracketExtremity` | `1/12` | fraction = 0.0833333 | ✓ |
| `bracketVerticalExtremityLength` | `1/8` | fraction = 0.125 | ✓ |
| `additionalGapBetweenNoteFlagAndBracket` | `1/8` | fraction = 0.125 | ✓ |
| `additionalGapBetweenLedgerLineAndBracketMiddle` | `-1/16` | fraction = -0.0625 | ✓ |
| `additionalGapBetweenLedgerLineAndBracketExtremity` | `1/8` | fraction = 0.125 | ✓ |
| `additionalGapBetweenNeighbouringBracketAndOther` | `1/8` | fraction = 0.125 | ✓ |
| `additionalGapBetweenNeighbouringBracketAndParenthesisAtExtremity` | `-1/6` | fraction = -0.166667 | ✓ |
| `minimumGapOnFarSideOfBracket` | `1/15` | fraction = 0.0666667 | ✓ |
| `minimumGapAboveAndBelowBracket` | `1/8` | fraction = 0.125 | ✓ |
| `minimumGapAboveAndBelowNeighbouringBracketAndOther` | `0` | int | ✓ |
| `additionalGapInsideParenthesisedNoteheadsOnLedgerLines` | `1/5` | fraction = 0.2 | – |
| `additionalGapBetweenParenthesisAndNeighbouringNotehead` | `1/8` | fraction = 0.125 | – |
| `additionalGapBetweenRhythmDotAndParenthesis` | `0` | int | – |
| `largestIntervalToJoinNotesWithSingleParenthesis` | `8` | int | ✓ |
| `joinNeighbouringNotesWithSingleParenthesisOnTabStave` | `true` | bool | ✓ |
| `useCompositesForParenthesesSpanningSingleStavePosition` | `true` | bool | ✓ |
| `useCompositesForParenthesesSpanningSingleStavePositionOnTabStaves` | `false` | bool | ✓ |
| `parenthesisMinimumDistanceFromStaveLines` | `1/12` | fraction = 0.0833333 | ✓ |
| `bracketMinimumDistanceFromStaveLines` | `1/7` | fraction = 0.142857 | ✓ |
| `protrusionBeyondTopOrBottomOfNoteheadForDrawnParentheses` | `1/4` | fraction = 0.25 | ✓ |
| `parenthesisCurveMiddleThickness` | `1/7` | fraction = 0.142857 | ✓ |
| `parenthesisCurveEndThickness` | `1/25` | fraction = 0.04 | ✓ |
| `parenthesisCurveMiddleThicknessOnTabStave` | `1/6` | fraction = 0.166667 | ✓ |
| `parenthesisCurveEndThicknessOnTabStave` | `1/8` | fraction = 0.125 | ✓ |
| `parenthesisCurveHorizontalExtentForSecond` | `1/3` | fraction = 0.333333 | ✓ |
| `parenthesisCurveHorizontalExtentForOctave` | `1/2` | fraction = 0.5 | ✓ |
| `parenthesisCurveMaximumHorizontalExtent` | `3/5` | fraction = 0.6 | ✓ |
| `protrusionBeyondTopOrBottomOfNoteheadForDrawnBrackets` | `1/8` | fraction = 0.125 | ✓ |
| `bracketThickness` | `1/10` | fraction = 0.1 | ✓ |
| `bracketHookLength` | `1/3` | fraction = 0.333333 | ✓ |
| `stemmedRhythmicSlashAppearance` | `kOversized` | enum | ✓ |
| `stemlessRhythmicSlashAppearance` | `kOversized` | enum | ✓ |
| `hideRhythmDotsOnSlashesInRegularCompoundTime` | `false` | bool | ✓ |
| `tablatureLozengeAppearance` | `kNone` | enum | ✓ |
| `tablatureLozengeThickness` | `1/5` | fraction = 0.2 | ✓ |
| `preferCirclesForSingleNoteLozenges` | `false` | bool | ✓ |
| `eraseBackgroundAroundTablatureFretNumbers` | `true` | bool | ✓ |
| `tiedToNoteheadAppearanceOnTab` | `kHideButParenthesiseAtStartOfBar` | enum | ✓ |
| `tablatureGraceNoteVisualScale` | `4/5` | fraction = 0.8 | ✓ |
| `gapBetweenNoteheadsOnSplitStems` | `1/8` | fraction = 0.125 | ✓ |
| `minimumGapBetweenNoteheadsOnSplitStems` | `1/4` | fraction = 0.25 | ✓ |
| `additionalGapForParenthesesOnSplitStems` | `1/10` | fraction = 0.1 | ✓ |

## articulationOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `gapBetweenNoteheadAndArticulation` | `1/2` | fraction = 0.5 | ✓ |
| `gapBetweenStemAndArticulation` | `1/2` | fraction = 0.5 | ✓ |
| `gapBetweenArticulations` | `1/4` | fraction = 0.25 | ✓ |
| `centreStemSideStaccatoOnNotehead` | `false` | bool | – |
| `stemSideStaccatoHorizontalPosition` | `kCentreOnStem` | enum | ✓ |
| `staccatissimoDesign` | `kNormal` | enum | ✓ |
| `marcatoAlwaysAbove` | `true` | bool | ✓ |
| `accentAlwaysAbove` | `false` | bool | ✓ |
| `stressAlwaysAbove` | `true` | bool | ✓ |
| `durationAlwaysAbove` | `false` | bool | ✓ |
| `largeGlyphsAllowedInsideStave` | `false` | bool | – |
| `articulationDurationTieChainPosition` | `kTieChainEnd` | enum | ✓ |
| `articulationForceTieChainPosition` | `kTieChainStart` | enum | ✓ |
| `articulationStressTieChainPosition` | `kTieChainStart` | enum | ✓ |
| `articulationTenutoTieChainPosition` | `kTieChainStart` | enum | ✓ |
| `stressAlwaysInsideSlurEndPoints` | `false` | bool | ✓ |
| `forceAlwaysInsideSlurEndPoints` | `false` | bool | ✓ |
| `durationAlwaysInsideSlurEndPoints` | `true` | bool | ✓ |
| `staccatoAllowedInStaff` | `true` | bool | ✓ |
| `tenutoAllowedInStaff` | `true` | bool | ✓ |
| `staccatissimoAllowedInStaff` | `false` | bool | ✓ |
| `accentAllowedInStaff` | `true` | bool | ✓ |
| `marcatoAllowedInStaff` | `false` | bool | ✓ |
| `stressAllowedInStaff` | `false` | bool | ✓ |
| `unstressAllowedInStaff` | `false` | bool | ✓ |

## spacingGapOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `gapBeforeBarline` | `1/2` | fraction = 0.5 | ✓ |
| `idealGapAfterBarline` | `3/2` | fraction = 1.5 | ✓ |
| `minimumGapAfterBarline` | `3/4` | fraction = 0.75 | ✓ |
| `gapAfterBarlineAndInitialAttachment` | `1/2` | fraction = 0.5 | ✓ |
| `gapAfterInitialClef` | `1` | int | ✓ |
| `gapAfterClefChange` | `1/2` | fraction = 0.5 | ✓ |
| `gapAfterKeySignature` | `1` | int | ✓ |
| `gapAfterTimeSignature` | `1/2` | fraction = 0.5 | ✓ |
| `gapAfterCancellationNaturals` | `1` | int | ✓ |
| `gapAfterEndRepeatBarline` | `1/2` | fraction = 0.5 | ✓ |
| `gapAfterArpeggioLine` | `1/2` | fraction = 0.5 | ✓ |
| `extraGapAtEndOfLeftBoundingShapeExtension` | `1/2` | fraction = 0.5 | ✓ |
| `minimumDistanceBetweenSpacingColumns` | `1/4` | fraction = 0.25 | ✓ |
| `gapAfterCueClefChange` | `1/2` | fraction = 0.5 | ✓ |
| `gapAfterVerticalLine` | `1/2` | fraction = 0.5 | ✓ |
| `gapAfterBarlineAndBeforeTimeSignature` | `1/4` | fraction = 0.25 | ✓ |

## clefOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `clefChangeScale` | `2/3` | fraction = 0.666667 | ✓ |
| `showTabClefAfterFirstSystem` | `true` | bool | ✓ |

## stemOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `defaultStemLength` | `7/2` | fraction = 3.5 | ✓ |
| `shortStemLength` | `11/4` | fraction = 2.75 | ✓ |
| `minimumStemLengthForFlaggedNote` | `7/2` | fraction = 3.5 | ✓ |
| `minimumStemletLengthForBeamedRest` | `1/2` | fraction = 0.5 | ✓ |
| `gapBetweenOutsideOfRestAndStemlet` | `1/4` | fraction = 0.25 | ✓ |
| `beamSwapThreshold` | `5/2` | fraction = 2.5 | ✓ |
| `automaticBeamCentring` | `false` | bool | ✓ |
| `minimumStemLengthForAutomaticCentreBeam` | `5/2` | fraction = 2.5 | ✓ |
| `defaultContextualStemDirection` | `kDown` | enum | ✓ |
| `defaultFlagSet` | `flagset.default` | text | ✓ |
| `rhythmDotAvoidanceApproach` | `kOffsetRhythmDots` | enum | ✓ |
| `minimumDistanceBetweenTopOfTremoloAndTopOfQuaverFlag_StemUp` | `17/10` | fraction = 1.7 | – |
| `minimumDistanceBetweenTopOfTremoloAndTopOfSemiquaverFlag_StemUp` | `2` | int | – |
| `minimumDistanceBetweenTopOfTremoloAndTopOfDemisemiquaverFlag_StemUp` | `21/10` | fraction = 2.1 | – |
| `minimumDistanceBetweenBottomOfTremoloAndBottomOfQuaverFlag_StemDown` | `6/5` | fraction = 1.2 | – |
| `minimumDistanceBetweenBottomOfTremoloAndBottomOfSemiquaverFlag_StemDown` | `8/5` | fraction = 1.6 | – |
| `minimumDistanceBetweenBottomOfTremoloAndBottomOfDemisemiquaverFlag_StemDown` | `19/10` | fraction = 1.9 | – |
| `minimumDistanceBetweenOutsideOfTremoloAndInsideOfInnerBeam` | `1/4` | fraction = 0.25 | ✓ |
| `minimumDistanceBetweenOutsideOfTremoloAndTipOfBareStem` | `1/4` | fraction = 0.25 | ✓ |
| `minimumDistanceBetweenInsideOfTremoloAndOutermostNotehead` | `17/20` | fraction = 0.85 | ✓ |
| `stemThickness` | `3/25` | fraction = 0.12 | ✓ |
| `allowContextualStemDirections` | `true` | bool | ✓ |
| `shortStemLengthForQuaver` | `3` | int | ✓ |
| `attemptToShortenBeamedStemsSlightly` | `false` | bool | ✓ |
| `startStemShorteningPosition` | `-2` | int | ✓ |
| `stopStemShorteningPosition` | `3` | int | ✓ |
| `shortStemLengthForSemiquaverOrShorter` | `5/2` | fraction = 2.5 | ✓ |
| `tablatureStemEndpoint` | `kOutsideOfStave` | enum | ✓ |
| `gapBetweenOutsideOfFretNumberAndTabStem` | `1/8` | fraction = 0.125 | ✓ |
| `gapBetweenOutsideOfStaveAndTabStem` | `1/2` | fraction = 0.5 | ✓ |
| `minimumDistanceBetweenOutsideOfStaveAndEndOfTabStem` | `3` | int | ✓ |
| `defaultDirectionForStemsOnTabStaves` | `kUp` | enum | ✓ |
| `alignStemsWithEdgesOfFretNumbersForLozengesOnTabStaves` | `true` | bool | ✓ |
| `showStemForGraceNoteForTabWithRhythms` | `true` | bool | ✓ |
| `stemBackgroundErasure` | `false` | bool | ✓ |
| `stemBackgroundErasureWidth` | `1/5` | fraction = 0.2 | ✓ |
| `defaultDistanceBetweenHotSpotOfStemlessRestAndOutsideOfBeamAtStartOrEnd` | `3/2` | fraction = 1.5 | ✓ |
| `minimumDistanceBetweenEdgeOfStemlessRestAndInsideOfBeamAtStartOrEnd` | `1` | int | ✓ |
| `considerNotesOnMiddleLineForBeamedGroupStemDirection` | `false` | bool | ✓ |
| `considerUpAndDownStemCountWhenCalculatingBeamedGroupStemDirection` | `true` | bool | ✓ |

## slurOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `slurEndNoteheadSideVOffsetNoteheadInSpace` | `1/2` | fraction = 0.5 | ✓ |
| `slurEndNoteheadSideVOffsetNoteheadOnLine` | `1/4` | fraction = 0.25 | ✓ |
| `slurEndNoteheadSideHOffset` | `0` | int | ✓ |
| `slurEndExtraVOffsetFromTiedNotehead` | `1/4` | fraction = 0.25 | ✓ |
| `slurEndUnbeamedStemSideHOffset` | `1/2` | fraction = 0.5 | ✓ |
| `slurEndUnbeamedStemSideVOffset` | `5/4` | fraction = 1.25 | ✓ |
| `slurEndUnbeamedStemSideWithFlagHOffset` | `3/4` | fraction = 0.75 | ✓ |
| `slurEndUnbeamedStemSideWithFlagVOffset` | `1` | int | ✓ |
| `slurEndBeamedStemSideHOffset` | `0` | int | ✓ |
| `slurEndBeamedStemSideVOffset` | `1/2` | fraction = 0.5 | ✓ |
| `slurEndStaveLineMinDistance` | `1/4` | fraction = 0.25 | ✓ |
| `shortSlurHeight` | `3/4` | fraction = 0.75 | ✓ |
| `longSlurHeight` | `3` | int | ✓ |
| `shortSlurThresholdForHeight` | `3` | int | ✓ |
| `longSlurThresholdForHeight` | `40` | int | ✓ |
| `shortSlurShoulder` | `1/3` | fraction = 0.333333 | ✓ |
| `longSlurShoulder` | `1/3` | fraction = 0.333333 | ✓ |
| `shortSlurThresholdForShoulder` | `7` | int | ✓ |
| `longSlurThresholdForShoulder` | `32` | int | ✓ |
| `slurEndThickness` | `1/12` | fraction = 0.0833333 | ✓ |
| `slurMiddleThickness` | `1/5` | fraction = 0.2 | ✓ |
| `dashedSlurDashLength` | `1/2` | fraction = 0.5 | ✓ |
| `dashedSlurGapLength` | `1/3` | fraction = 0.333333 | ✓ |
| `dottedSlurGapLength` | `1/3` | fraction = 0.333333 | ✓ |
| `dottedSlurDotDiameter` | `1/4` | fraction = 0.25 | ✓ |
| `editorialSlurStrokeLength` | `3/4` | fraction = 0.75 | ✓ |
| `editorialSlurStrokeLineWidth` | `1/8` | fraction = 0.125 | ✓ |
| `slurToSlurVerticalGap` | `1/4` | fraction = 0.25 | ✓ |
| `slurToSlurHorizontalGap` | `1/4` | fraction = 0.25 | ✓ |
| `slurRouterMaximumEndPointDistance` | `4` | int | ✓ |
| `slurRouterMaximumHeightIncrease` | `4` | int | ✓ |
| `slurRouterHeightVsEndPoint` | `50` | int | ✓ |
| `slurRouterMaximumAngle` | `35` | int | ✓ |
| `slurRouterMaximumAngleCrossStave` | `50` | int | ✓ |
| `slurRouterSymmetricEndPointDistance` | `false` | bool | ✓ |
| `slurRouterSymmetricShoulder` | `false` | bool | ✓ |
| `slurRouterINTERNALHeightWeight` | `0.600000` | float | ✓ |
| `slurRouterINTERNALEndPointWeight` | `1.000000` | float | ✓ |
| `slurRouterINTERNALAngleWeight` | `0.200000` | float | ✓ |
| `slurVerticalGapInside` | `1/2` | fraction = 0.5 | ✓ |
| `slurCanCrossFlatAccidentalStem` | `true` | bool | ✓ |
| `flatAccidentalStemMaximumProtrusion` | `3/4` | fraction = 0.75 | ✓ |
| `slurCanCrossNaturalAccidentalStem` | `false` | bool | ✓ |
| `naturalAccidentalStemMaximumProtrusion` | `1/2` | fraction = 0.5 | ✓ |
| `enableCollisonAvoidanceForCrossStaveSlur` | `true` | bool | ✓ |
| `gapForSlursContinuingOverSystemBreaks` | `1/2` | fraction = 0.5 | ✓ |
| `slurCurvature` | `kCurvedSlur` | enum | ✓ |
| `flatSlurEndThickness` | `1/12` | fraction = 0.0833333 | ✓ |
| `flatSlurMiddleThickness` | `1/6` | fraction = 0.166667 | ✓ |
| `longFlatSlurHeight` | `3/2` | fraction = 1.5 | ✓ |
| `shortFlatSlurHeight` | `1/2` | fraction = 0.5 | ✓ |
| `flatSlurShoulder` | `1/10` | fraction = 0.1 | ✓ |
| `slursAlwaysAbove` | `false` | bool | ✓ |
| `slurStartTieChainPosition` | `kTieChainStart` | enum | ✓ |
| `slurEndTieChainPosition` | `kTieChainEnd` | enum | ✓ |
| `treatBeamEndAsUnbeamedStem` | `true` | bool | ✓ |
| `interpolateVPositionAtSystemBreak` | `true` | bool | ✓ |
| `minimumVGapToStaveLineAtSystemBreak` | `1/2` | fraction = 0.5 | ✓ |
| `findCrossStaveSlursCrossingPoint` | `true` | bool | ✓ |
| `positionMixedStemSlurEndPointsNearNotehead` | `true` | bool | ✓ |
| `avoidArticulationAtMixedStemSlurEndPoints` | `false` | bool | ✓ |
| `specialGraceNoteSlurOptions.vOffsetAtRightHandEndNoteOnStaveLineSingleVoice` | `0` | int | – |
| `specialGraceNoteSlurOptions.vOffsetAtRightHandEndNoteInSpaceSingleVoice` | `1/2` | fraction = 0.5 | – |
| `specialGraceNoteSlurOptions.hOffsetAtRightHandEndNoteSingleVoice` | `1/4` | fraction = 0.25 | – |
| `specialGraceNoteSlurOptions.hOffsetAtLeftHandEndMultiVoice` | `1/4` | fraction = 0.25 | – |
| `specialGraceNoteSlurOptions.hOffsetAtRightHandEndMultiVoice` | `1/4` | fraction = 0.25 | – |
| `specialGraceNoteSlurOptions.vOffsetAtLeftHandEndMultiVoice` | `3/2` | fraction = 1.5 | – |
| `specialGraceNoteSlurOptions.vOffsetAtRightHandEndMultiVoice` | `3/2` | fraction = 1.5 | – |
| `specialGraceNoteSlurOptions.slurEndTieChainPosition` | `kTieChainStart` | enum | – |

## accidentalStackerCalcOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `alignOuterAccidentalsInWidelySpacedChords` | `true` | bool | ✓ |
| `accidentalsReflectDirectionOfAdjacentNotes` | `true` | bool | ✓ |
| `accidentalsFollowNoteheadsInTwoVoiceChordsAndSeconds` | `true` | bool | ✓ |
| `useDiagonalArrangementForDenseChords` | `true` | bool | ✓ |
| `shouldIntersperseColumnsWhenUsingDiagonalArrangement` | `true` | bool | ✓ |
| `allowAccidentalsToTuckAmongstLedgerLines` | `false` | bool | ✓ |
| `interStackPadding` | `1/6` | fraction = 0.166667 | ✓ |
| `interStackPaddingForOverlappingStacks` | `1/8` | fraction = 0.125 | ✓ |
| `opticallyAdjustDistanceBetweenAccidentalColumns` | `true` | bool | ✓ |
| `stackOverlapPercentage` | `60` | int | ✓ |
| `backNoteOverlapPercentage` | `60` | int | ✓ |
| `additionalGapToApplyToAdjacentStacksWithAbuttingStraightEdges` | `1/8` | fraction = 0.125 | ✓ |
| `marginAtRightOfAccidentalGroupForNatural` | `1/4` | fraction = 0.25 | ✓ |
| `marginAtRightOfAccidentalGroupForFlats` | `1/4` | fraction = 0.25 | ✓ |
| `marginAtRightOfAccidentalGroupForSharp` | `1/4` | fraction = 0.25 | ✓ |
| `marginAtRightOfAccidentalGroupForAllOtherAccidentals` | `1/4` | fraction = 0.25 | ✓ |
| `marginAtLeftOfAccidentalGroup` | `1/8` | fraction = 0.125 | ✓ |
| `minimumGapBetweenAccidentalsInSameStack` | `1/5` | fraction = 0.2 | ✓ |
| `minimumGapBetweenAccidentalAndNoteheadInSameStack` | `1/10` | fraction = 0.1 | ✓ |
| `preferFixedMeasurementsToImproveCommonAccidentals` | `false` | bool | ✓ |
| `gapAroundParenthesisedAccidentals` | `1/6` | fraction = 0.166667 | ✓ |
| `gapAroundBulbousSideOfParenthesisedFlats` | `0` | int | ✓ |
| `preventMeasurementOfAccidentalsUsingComposites` | `false` | bool | ✓ |
| `marginAtRightOfAccidentalGroupForUnshortenedLedgerLines` | `1/2` | fraction = 0.5 | ✓ |
| `marginAtRightOfAccidentalGroupWithRightmostFlatForUnshortenedLedgerLines` | `1/8` | fraction = 0.125 | ✓ |
| `marginAtRightOfAccidentalGroupForBackNotes` | `1/8` | fraction = 0.125 | ✓ |
| `marginAtRightOfAccidentalGroupWithRightmostFlatForUnshortenedLedgerLinesOnLine` | `2/3` | fraction = 0.666667 | ✓ |

## staffLabelOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `staffLabelRightPadding` | `3` | int | ✓ |
| `staffGroupLabelRightPadding` | `3` | int | ✓ |
| `ossiaStaffLabelRightPadding` | `3` | int | ✓ |
| `bracedOssiaStaffLabelRightPadding` | `4` | int | ✓ |
| `soloPlayerInstrumentSuffixType` | `kArabic` | enum | ✓ |
| `sectionPlayerInstrumentSuffixType` | `kRoman` | enum | ✓ |
| `vocalStaffLabelsCapitalised` | `false` | bool | ✓ |
| `groupSingleStaveInstrumentLabels` | `false` | bool | ✓ |
| `considerInstrumentTranspositionWhenNumbering` | `true` | bool | ✓ |
| `showVoiceAllocationOnCondensedStaves` | `true` | bool | ✓ |
| `listCondensedPlayersVertically` | `false` | bool | ✓ |
| `sectionPlayerUnisLabel` | `unis.` | text | ✓ |
| `useDivisiGroupNamesForCondensedStaves` | `false` | bool | ✓ |
| `alignGroupLabelsWithFirstStaffInGroup` | `false` | bool | ✓ |
| `groupSingleStaveInstrumentLabelsForSectionPlayers` | `false` | bool | ✓ |
| `showBracketForPlayerGroupLabels` | `true` | bool | ✓ |
| `playerGroupBracketPenThickness` | `1/8` | fraction = 0.125 | ✓ |
| `playerGroupBracketHookLength` | `5/4` | fraction = 1.25 | ✓ |
| `horizontalGapBetweenPlayerGroupAndStaffLabels` | `1/8` | fraction = 0.125 | ✓ |
| `horizontalGapBetweenPlayerGroupBracketsAndLabels` | `3/4` | fraction = 0.75 | ✓ |
| `positionPlayerGroupLabelsOnBrackets` | `true` | bool | ✓ |
| `playerGroupLabelsErasureExtentsWhenOnBracket` | `1/2` | fraction = 0.5 | ✓ |

## keySignatureOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `horizontalGapBetweenAccidentalsInKeySignatures` | `1/4` | fraction = 0.25 | ✓ |
| `horizontalGapBetweenCancellationNaturalsInKeySignatures` | `2/5` | fraction = 0.4 | ✓ |
| `keySignatureCancellationBehaviour` | `kContemporary` | enum | ✓ |
| `keySignatureBackgroundErasure` | `false` | bool | ✓ |
| `keySignatureBackgroundErasureWidth` | `1/4` | fraction = 0.25 | ✓ |

## glissandoLineOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `glissandoLineType` | `kFlatLine` | enum | ✓ |
| `glissandoLineText` | `kGliss` | enum | ✓ |
| `flatGlissandoLineThickness` | `1/9` | fraction = 0.111111 | ✓ |
| `horizontalGapBeforeAndAfterNotes` | `1/3` | fraction = 0.333333 | ✓ |
| `verticalOffsetFromCentreOfNoteInSpace` | `1/10` | fraction = 0.1 | ✓ |
| `verticalOffsetFromCentreOfNoteOnStaveLine` | `1/4` | fraction = 0.25 | ✓ |
| `verticalOffsetFromCentreOfNoteOnLedgerLine` | `1/3` | fraction = 0.333333 | ✓ |
| `forcedVerticalSpanOfGlissLinesBetweenNotesAtSameStavePosition` | `2/5` | fraction = 0.4 | ✓ |
| `forcedVerticalSpanOfGlissLinesBetweenNotesAtSameStavePositionOnStaveLine` | `1` | int | ✓ |
| `additionalVerticalSpanForGlissLinesBetweenNotesAtAdjacentStavePositions` | `1/3` | fraction = 0.333333 | ✓ |
| `horizontalGapAfterRhythmDots` | `1/4` | fraction = 0.25 | ✓ |
| `horizontalGapBeforeAccidentals` | `1/6` | fraction = 0.166667 | ✓ |
| `horizontalGapBeforeAndAfterOtherNoteheads` | `1/8` | fraction = 0.125 | ✓ |
| `horizontalGapAtEndOfSystem` | `1/2` | fraction = 0.5 | ✓ |
| `horizontalGapAtStartOfSystem` | `1/2` | fraction = 0.5 | ✓ |
| `gapBetweenLineAndText` | `1/2` | fraction = 0.5 | ✓ |
| `minimumSpaceToLeaveEitherSideOfText` | `1/4` | fraction = 0.25 | ✓ |
| `minimumHorizontalSpanForGlissandoLines` | `3` | int | ✓ |
| `minimumHorizontalSpanForGlissandoLinesFromGraceNotes` | `2` | int | ✓ |
| `horizontalGapBeforeAndAfterIntraStaveFingerings` | `0` | int | ✓ |
| `glissandoLinesAvoidNoteFlags` | `true` | bool | ✓ |
| `horizontalGapBeforeAndAfterNoteFlags` | `1/4` | fraction = 0.25 | ✓ |
| `horizontalGapBeforeAndAfterNoteheadParentheses` | `1/4` | fraction = 0.25 | ✓ |

## guitarBendEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `lineThickness` | `1/8` | fraction = 0.125 | ✓ |
| `minimumHorizontalSpanForBend` | `3` | int | ✓ |
| `minimumHorizontalSpanForPreBend` | `2` | int | ✓ |
| `minimumHorizontalSpanForBendFromGraceNote` | `2` | int | ✓ |
| `verticalOffsetFromCentreOfNoteInSpace` | `0` | int | – |
| `horizontalOffsetFromCentreOfNoteInSpace` | `0` | int | ✓ |
| `verticalOffsetFromCentreOfNoteOnStaveLine` | `0` | int | – |
| `horizontalOffsetFromCentreOfNoteOnStaveLine` | `0` | int | ✓ |
| `verticalOffsetFromCentreOfNoteOnLedgerLine` | `0` | int | – |
| `horizontalOffsetFromCentreOfNoteOnLedgerLine` | `0` | int | ✓ |
| `verticalGapFromNoteheadInSpace` | `1/4` | fraction = 0.25 | ✓ |
| `verticalGapFromNoteheadOnLine` | `1/4` | fraction = 0.25 | ✓ |
| `verticalGapBetweenLineEndAndBeam` | `1/4` | fraction = 0.25 | ✓ |
| `bendHeight` | `3/2` | fraction = 1.5 | ✓ |
| `preBendHeight` | `3/4` | fraction = 0.75 | ✓ |
| `bendToBendHorizontalGap` | `1/4` | fraction = 0.25 | ✓ |
| `vibratoBarBendProtrusionBelowTab` | `3/4` | fraction = 0.75 | ✓ |
| `bendProtrusionAboveTab` | `7/2` | fraction = 3.5 | ✓ |
| `verticalOffsetAtStartNoteheadOnTab` | `1/2` | fraction = 0.5 | ✓ |
| `horizontalGapAtStartNoteheadOnTab` | `1/4` | fraction = 0.25 | ✓ |
| `verticalGapAtEndNoteheadOnTab` | `3/4` | fraction = 0.75 | ✓ |
| `horizontalOffsetAtEndNoteheadOnTab` | `0` | int | ✓ |
| `gapBeforeEndOfSystemOnTab` | `1` | int | ✓ |
| `horizontalGapAtHoldLineEndOnTab` | `1` | int | ✓ |
| `showWholeToneIntervalWithTextOnTab` | `true` | bool | ✓ |
| `showHalfToneIntervalWithFractionGlyphOnTab` | `true` | bool | ✓ |
| `gapBeetwenArrowHeadAndIntervalOnTab` | `1/2` | fraction = 0.5 | ✓ |
| `minimumHorizontalSpanForBendOnTab` | `3` | int | ✓ |
| `visibilityOfReleaseEndNote` | `kParenthesise` | enum | ✓ |
| `dashedHoldLinesOnTab` | `false` | bool | ✓ |
| `vibratoBarBendRangeOutsideTab` | `3` | int | ✓ |
| `bendRangeOutsideTab` | `3` | int | ✓ |
| `placeBendOutsideNoteheadObstructions` | `true` | bool | ✓ |
| `drawPreBendRestrikesAsHoldLine` | `false` | bool | ✓ |
| `postBendHorizontalOffsetFromCentreOfNoteInSpace` | `1/2` | fraction = 0.5 | ✓ |
| `postBendVerticalGapFromNoteheadInSpace` | `0` | int | ✓ |
| `postBendHorizontalOffsetFromCentreOfNoteOnStaveLine` | `1/2` | fraction = 0.5 | ✓ |
| `postBendVerticalGapFromNoteheadOnLine` | `1/2` | fraction = 0.5 | ✓ |
| `postBendProtrusionAboveNotationStave` | `1` | int | ✓ |
| `postBendHorizontalExtent` | `2` | int | ✓ |
| `postBendMinimumHeight` | `2` | int | ✓ |
| `postBendShowMicrotoneIntervalAsQuarter` | `true` | bool | ✓ |

## guitarTechniquesEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `guitarTapAppearance` | `kLetterT` | enum | ✓ |
| `amalgamateAndCentreOverSlurredNoteRuns` | `true` | bool | ✓ |
| `guitarTechniqueVisibility` | `kNotationStaveOnly` | enum | ✓ |
| `guitarTechniquePositionOnTabStave` | `kInside` | enum | ✓ |
| `placementOnNotationStave` | `kAboveStave` | enum | ✓ |
| `placementOnTabStave` | `kAboveStave` | enum | ✓ |
| `scoopHorizontalOffsetFromNotehead` | `1` | int | ✓ |
| `scoopVerticalOffsetFromNotehead` | `1` | int | ✓ |
| `dipMinimumVerticalDistanceFromStave` | `1` | int | ✓ |
| `dipMinimumVerticalDistanceFromStaveProfile` | `1` | int | ✓ |
| `dipVerticalPositionOfText` | `2` | int | ✓ |
| `guitarTechniqueMinimumVerticalDistanceFromStave` | `1` | int | ✓ |
| `guitarTechniqueMinimumVerticalDistanceFromStaveProfile` | `1` | int | ✓ |
| `scoopVisibility` | `kNotationStaveOnly` | enum | ✓ |
| `dipVisibility` | `kNotationStaveOnly` | enum | ✓ |

## tempoOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `gradualTempoChangeContinuationLineAppearance` | `kDotted` | enum | ✓ |
| `hyphenatedGradualChangeTempoLineAppearance` | `kDashed` | enum | ✓ |
| `gradualContinuationLineDotDiameter` | `1/4` | fraction = 0.25 | ✓ |
| `gradualContinuationLineDotGap` | `1/3` | fraction = 0.333333 | ✓ |
| `gradualContinuationLineDashLength` | `1/3` | fraction = 0.333333 | ✓ |
| `gradualContinuationLineDashGap` | `1/2` | fraction = 0.5 | ✓ |
| `gradualContinuationLinePenWidth` | `1/6` | fraction = 0.166667 | ✓ |
| `gradualHyphenationLineDotDiameter` | `1/5` | fraction = 0.2 | ✓ |
| `gradualHyphenationLineDotGap` | `3` | int | ✓ |
| `gradualHyphenationLineDashLength` | `1/2` | fraction = 0.5 | ✓ |
| `gradualHyphenationLineDashGap` | `3` | int | ✓ |
| `gradualHyphenationLinePenWidth` | `1/6` | fraction = 0.166667 | ✓ |
| `tempoDecimalPlaces` | `0` | int | ✓ |
| `approximateAppearance` | `kC` | enum | ✓ |
| `includeEqualsInApproximateTempo` | `true` | bool | ✓ |
| `minimumDistanceFromStave` | `3` | int | ✓ |
| `positioningWithRehearsalMarks` | `kOffsetToRight` | enum | ✓ |
| `gapBetweenRehearsalMarkAndTempoChange` | `2/3` | fraction = 0.666667 | ✓ |
| `gradualTempoAppearance` | `kTextWithLine` | enum | ✓ |
| `abbreviateUnhyphenatedTempoChanges` | `true` | bool | ✓ |
| `gapBetweenTempoAndBarline` | `3/4` | fraction = 0.75 | ✓ |
| `minimumDistanceAfterBarlineToContinueTempoBeyondBarline` | `4` | int | ✓ |
| `alwaysCompleteTempoChangesBeforeEndOfBar` | `false` | bool | ✓ |
| `gapBetweenNeighbouringTempoMarks` | `1/4` | fraction = 0.25 | ✓ |
| `minimumGapAboveOrBelowOtherObjects` | `3/4` | fraction = 0.75 | ✓ |
| `gapBetweenTextAndContinuationLine` | `2/5` | fraction = 0.4 | ✓ |
| `alignWithTimeSignatureIfNeedsToMoveVertically` | `true` | bool | ✓ |
| `useCustomTempoRangeSeparator` | `false` | bool | ✓ |
| `tempoRangeSeparator` | ` - ` | text | ✓ |
| `useArrowsOnTempoEquations` | `false` | bool | ✓ |
| `metronomeMarkOrderRelativeToTempoWords` | `kAfter` | enum | ✓ |

## rehearsalMarkOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `enclosureType` | `kRectangle` | enum | – |
| `defaultSequenceType` | `kLetters` | enum | ✓ |
| `rehearsalMarkCustomPrefix` | `` | text | ✓ |
| `rehearsalMarkCustomSuffix` | `` | text | ✓ |
| `minimumWidthForRectangularMarks` | `4` | int | ✓ |
| `minimumHeightForRectangularMarks` | `4` | int | ✓ |
| `minimumDiameterForCircularMarks` | `4` | int | ✓ |
| `minimumHorizontalPaddingAroundRectangularMarks` | `3/4` | fraction = 0.75 | ✓ |
| `minimumTopPaddingAroundRectangularMarks` | `1/2` | fraction = 0.5 | ✓ |
| `minimumBottomPaddingAroundRectangularMarks` | `1/8` | fraction = 0.125 | ✓ |
| `minimumPaddingAroundCircularMarks` | `1/4` | fraction = 0.25 | ✓ |
| `minimumDistanceFromStave` | `3` | int | ✓ |
| `rehearsalMarkBaseAlignment` | `kBottomOfText` | enum | ✓ |
| `rehearsalMarkEnclosurePenWidth` | `1/8` | fraction = 0.125 | ✓ |
| `sequenceTypeForAlphabetics` | `kAA_BB_CC` | enum | ✓ |
| `horizontalAlignment` | `kCentre` | enum | – |
| `noteRelativeHorizontalAlignment` | `kCentre` | enum | ✓ |
| `minimumGapAboveOrBelowOtherObjects` | `3/4` | fraction = 0.75 | ✓ |
| `minimumGapBetweenOtherObjects` | `3/4` | fraction = 0.75 | ✓ |
| `alignRehearsalMarksAtStartOfSystemWithSystemicBarline` | `false` | bool | ✓ |
| `gapForRehearsalMarksAlignedWithSystemicBarline` | `1/2` | fraction = 0.5 | ✓ |
| `roundRectCornerRadius` | `1/2` | fraction = 0.5 | ✓ |

## languageOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `instrumentNamesLanguage` | `kEnglish` | enum | ✓ |
| `tempoObjectsLanguage` | `kItalian` | enum | ✓ |
| `dateTimeLanguage` | `kEnglish` | enum | ✓ |
| `useAccidentalSymbolsInInstrumentNames` | `false` | bool | ✓ |
| `useEnglishNoteNamesInGermanInstrumentNames` | `true` | bool | ✓ |
| `useLowerCaseNoteNamesInInstrumentNames` | `false` | bool | ✓ |
| `useAlternativeNoteNameForCInFrench` | `false` | bool | ✓ |
| `resetInstrumentNamesWhenChangingLanguage` | `true` | bool | ✓ |

## lyricOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `idealDistanceFromStave` | `3/2` | fraction = 1.5 | ✓ |
| `distanceBetweenLyricLines` | `1` | int | ✓ |
| `extenderLineMinimumWidth` | `1` | int | ✓ |
| `extenderLineThickness` | `1/16` | fraction = 0.0625 | ✓ |
| `extenderLineGapAtStart` | `1/8` | fraction = 0.125 | ✓ |
| `extenderLineGapAtEndOfSystem` | `1` | int | ✓ |
| `minimumSpaceForHyphen` | `1` | int | ✓ |
| `gapBetweenHyphens` | `15/2` | fraction = 7.5 | ✓ |
| `gapBetweenLyricAndHyphen` | `2` | int | ✓ |
| `hyphenGapCompressibility` | `1/5` | fraction = 0.2 | ✓ |
| `showVerseNumbers` | `false` | bool | ✓ |
| `appendFullStopToVerseNumbers` | `true` | bool | ✓ |
| `distanceBetweenLyricAndVerseNumber` | `3/2` | fraction = 1.5 | ✓ |
| `adjustableLyricExtentPercentage` | `7/10` | fraction = 0.7 | ✓ |
| `minimumGapBetweenLyrics` | `1` | int | ✓ |
| `paddingBeforeLyrics` | `1/2` | fraction = 0.5 | ✓ |
| `showElisionSlursForEastAsianLyrics` | `true` | bool | ✓ |
| `repeatVerseNumbersOnEverySystem` | `false` | bool | ✓ |
| `lyricHyphen` | `-` | text | ✓ |
| `showLyricHyphenAtStartOfSystem` | `true` | bool | ✓ |

## barlineOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `thinBarlineThickness` | `1/5` | fraction = 0.2 | ✓ |
| `thickBarlineThickness` | `1/2` | fraction = 0.5 | ✓ |
| `doubleBarlineGap` | `1/2` | fraction = 0.5 | ✓ |
| `finalOrRepeatBarlineGap` | `1/2` | fraction = 0.5 | ✓ |
| `thickThickRepeatBarlineGap` | `2/5` | fraction = 0.4 | ✓ |
| `gapBetweenOutermostLineAndRepeatDots` | `1/2` | fraction = 0.5 | ✓ |
| `repeatBarlineDotBehaviour` | `kShowEitherSideOfMiddleStaveLine` | enum | ✓ |
| `coincidentStartAndEndRepeatBarlineBehaviour` | `kThinThickThin` | enum | ✓ |
| `dashedBarlineDashLength` | `2/3` | fraction = 0.666667 | ✓ |
| `dashedBarlineGapLength` | `2/3` | fraction = 0.666667 | ✓ |
| `showDoubleBarlinesAtChangesOfKeySignature` | `true` | bool | ✓ |
| `breakBarlinesOnVocalStaves` | `true` | bool | ✓ |
| `joinCoincidentBarlinesOfStavesInDifferentTimeSignatures` | `false` | bool | ✓ |
| `drawSingleBarlinesBetweenStaves` | `false` | bool | ✓ |
| `startRepeatAtStartOfNewSystemShowsDoubleBarlineOnPreviousSystem` | `false` | bool | ✓ |
| `showDoubleBarlineBeforeMidSystemGap` | `false` | bool | ✓ |
| `barlineLengthForSingleLineInstruments` | `1` | int | ✓ |
| `maxNumberOfStaveLinesForSingleLineBarlineLength` | `2` | int | ✓ |
| `barlinesOnPercussionGridsAlwaysProtrude` | `true` | bool | ✓ |
| `showWingsOnRepeatBarlines` | `false` | bool | ✓ |
| `additionalThickBarlineProtrusionForWings` | `1/4` | fraction = 0.25 | ✓ |
| `ossiaBarlineBehaviour` | `kAtStartAndEnd` | enum | ✓ |
| `ossiaBarlineJoinType` | `kSolid` | enum | ✓ |
| `ossiaBarlineJoinDashLength` | `1/2` | fraction = 0.5 | ✓ |
| `ossiaBarlineJoinDashGap` | `1/3` | fraction = 0.333333 | ✓ |
| `showBarlinesForStartRepeatAtStartOfSystem` | `true` | bool | ✓ |
| `joinOssiaWithSystemicBarlineInSingleInstrumentSystems` | `false` | bool | ✓ |

## beamEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `allowBeamWidening` | `false` | bool | ✓ |
| `snapEndpointsOutsideStave` | `false` | bool | ✓ |
| `allowBetweenStavesBeamsIntoTheStave` | `false` | bool | ✓ |
| `forceBeamsFlatWithAnyRepeatedNotes` | `false` | bool | ✓ |
| `forceBeamsFlatWithAnyRepeatedPatterns` | `true` | bool | ✓ |
| `useShallowBeamsWhenAllNotesOnLedgerLines` | `true` | bool | ✓ |
| `useShallowBeamsForAllTwoNoteGraceNoteBeams` | `false` | bool | ✓ |
| `forceAngledBeamsOutsideTheStaveToHaveMinimumHalfSpaceSlope` | `false` | bool | ✓ |
| `graceNoteBeamSnappingBehaviour` | `kNormalSnapping` | enum | ✓ |
| `narrowSpacingThreshold` | `3` | int | ✓ |
| `desiredShallowBeamSlope_2nd` | `1/4` | fraction = 0.25 | – |
| `desiredShallowBeamSlope_GreaterThan2nd` | `1/2` | fraction = 0.5 | – |
| `desiredBeamSlope_2nd` | `1/4` | fraction = 0.25 | – |
| `desiredBeamSlope_3rd` | `3/4` | fraction = 0.75 | – |
| `desiredBeamSlope_4th` | `1` | int | – |
| `desiredBeamSlope_5th` | `5/4` | fraction = 1.25 | – |
| `desiredBeamSlope_6th` | `3/2` | fraction = 1.5 | – |
| `desiredBeamSlope_7th` | `3/2` | fraction = 1.5 | – |
| `desiredBeamSlope_8ve` | `3/2` | fraction = 1.5 | – |
| `desiredBeamSlope_GreaterThan8ve` | `3/2` | fraction = 1.5 | – |
| `maximumDesiredSlopeForBeamsWithTwoNotesOrFewer` | `1` | int | ✓ |
| `gapForBeamsContinuingOverSystemBreaks` | `1/2` | fraction = 0.5 | ✓ |
| `tremoloBeamInsetForBeamedNotes` | `1` | int | ✓ |
| `tremoloBeamInsetForCrotchetsAndUnbeamedMinims` | `1` | int | ✓ |
| `tremoloBeamInsetForCrotchetsAndUnbeamedMinims_Centred` | `3/2` | fraction = 1.5 | – |
| `tremoloBeamInsetForSemibreves` | `1` | int | ✓ |
| `maximumLengthOfTremoloBeamsForUnbeamedNotes` | `12` | int | ✓ |
| `drawTremolosBetweenNotesAnOctaveOrMoreApart` | `true` | bool | ✓ |
| `drawTremolosBetweenNotesForSemibreves` | `false` | bool | ✓ |
| `minimTremoloAppearance` | `kNoLinesJoinStems` | enum | ✓ |
| `centreTremolosBetweenInsideOfSemibrevesRatherThanNotionalStems` | `true` | bool | ✓ |
| `preventFlatQuaverBeamsFromSnappingToSpacesWithinTheStave` | `false` | bool | ✓ |
| `innerNoteOfConcaveBeamMustBeInsideBothOuterNotes` | `false` | bool | ✓ |
| `positionOfInnerNoteOfConcaveBeamMustBeStrictlyLessThanOuterNote` | `true` | bool | ✓ |
| `forceBeamsFlatOnPercussionStaves_SingleLine` | `true` | bool | – |
| `forceBeamsFlatOnPercussionStaves_FiveLine` | `true` | bool | – |
| `forceBeamsFlatOnPercussionStaves_Grid` | `false` | bool | – |
| `beamThickness` | `1/2` | fraction = 0.5 | ✓ |
| `basicGapBetweenBeamLines` | `1/4` | fraction = 0.25 | ✓ |
| `partialBeamLength` | `29/24` | fraction = 1.20833 | ✓ |
| `allowMixedDirectionsForSubgroupsWithOpposingOuterStems` | `false` | bool | ✓ |
| `preserveIdealQuarterSpaceSlantForBeamsPositionedOutsideTheStave` | `true` | bool | ✓ |
| `preserveIdealQuarterSpaceSlantForAllDemiSemiQuavers` | `true` | bool | ✓ |

## ornamentAndTrillOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `verticalGapToStaveLine` | `1` | int | ✓ |
| `verticalGapToOtherObjects` | `3/4` | fraction = 0.75 | ✓ |
| `verticalGapToAccidental` | `1/4` | fraction = 0.25 | ✓ |
| `innerHorizontalGap` | `1/4` | fraction = 0.25 | ✓ |
| `trillMarkPosition` | `kStartWithLeftmostNotehead` | enum | ✓ |
| `gapAfterWigglyLine` | `1/4` | fraction = 0.25 | ✓ |
| `trillHasWigglyLine` | `true` | bool | – |
| `trillExtensionLineVisibility` | `kVisibleOnTiedNotes` | enum | ✓ |
| `trillWigglyLineExtraGapPosition` | `kStart` | enum | ✓ |
| `trillAccidentalPosition` | `kAbove` | enum | ✓ |
| `accidentalScale` | `2/3` | fraction = 0.666667 | ✓ |
| `gapBetweenGlyphAndWigglyLine` | `1/8` | fraction = 0.125 | ✓ |
| `trillStopLineWidth` | `1/8` | fraction = 0.125 | ✓ |
| `trillStopLineLength` | `1` | int | ✓ |
| `trillIntervalAppearance` | `kAccidental` | enum | ✓ |
| `trillHollywoodHalfStepAppearance` | `kHTWithDots` | enum | ✓ |
| `trillHollywoodWholeStepAppearance` | `kWTWithDots` | enum | ✓ |
| `allowShiftingAuxiliaryNote` | `true` | bool | ✓ |
| `shiftingAuxiliaryNoteThreshold` | `kSemiQuaver` | enum | ✓ |
| `restateTrillAccidentalAfterSystemBreak` | `true` | bool | ✓ |
| `trillAuxiliaryNoteIsParenthesized` | `true` | bool | ✓ |
| `trillAuxiliaryNoteScaleFactor` | `2/3` | fraction = 0.666667 | ✓ |
| `trillAuxiliaryNoteGapBeforeAxuliaryNote` | `3/4` | fraction = 0.75 | ✓ |
| `trillAuxiliaryNoteGapBeetwenLeftParenthesisAndAccidental` | `1/4` | fraction = 0.25 | ✓ |
| `trillAuxiliaryNoteGapBeetwenLeftParenthesisAndSharpAccidental` | `1/8` | fraction = 0.125 | ✓ |
| `trillAuxiliaryNoteGapBeetwenLeftParenthesisAndNotehead` | `0` | int | ✓ |
| `trillAuxiliaryNoteGapBeetwenAccidentalAndNotehead` | `1/4` | fraction = 0.25 | ✓ |
| `trillAuxiliaryNoteGapBeetwenNoteheadAndRightParenthesis` | `0` | int | ✓ |
| `showTrillContinuationMark` | `kShow` | enum | ✓ |
| `hideConsecutiveHollywoodIntervals` | `false` | bool | – |

## barNumberEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `barNumberSubordinateSequenceTextCase` | `kLowerCase` | enum | ✓ |
| `minimumWidthForRectangularEnclosures` | `2` | int | ✓ |
| `minimumHeightForRectangularEnclosures` | `2` | int | ✓ |
| `minimumDiameterForCircularEnclosures` | `2` | int | ✓ |
| `minimumHorizontalPaddingAroundRectangularEnclosures` | `1/2` | fraction = 0.5 | ✓ |
| `minimumTopPaddingAroundRectangularEnclosures` | `1/8` | fraction = 0.125 | ✓ |
| `minimumBottomPaddingAroundRectangularEnclosures` | `1/8` | fraction = 0.125 | ✓ |
| `minimumPaddingAroundCircularEnclosures` | `1/6` | fraction = 0.166667 | ✓ |
| `barNumberEnclosurePenWidth` | `1/8` | fraction = 0.125 | ✓ |
| `countRepeatStructures` | `false` | bool | ✓ |
| `gapAboveTrebleGClef` | `2` | int | ✓ |
| `gapBelowTrebleGClef` | `3/2` | fraction = 1.5 | ✓ |
| `gapBelowTrebleGClef8Below` | `5/2` | fraction = 2.5 | ✓ |
| `gapAboveTenorCClef` | `3/2` | fraction = 1.5 | ✓ |

## instrumentChangeEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `idealDistanceFromStave` | `5/2` | fraction = 2.5 | ✓ |
| `paddingBelowInstrumentChangeLabel` | `1/2` | fraction = 0.5 | ✓ |

## textOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `defaultDistanceFromStave` | `5/2` | fraction = 2.5 | ✓ |
| `avoidCollisions` | `true` | bool | ✓ |
| `textErasurePadding` | `1/4` | fraction = 0.25 | ✓ |
| `textBorderThickness` | `1/8` | fraction = 0.125 | ✓ |
| `minimumPadding` | `1/2` | fraction = 0.5 | ✓ |

## holdAndPauseOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `fermataVerticalGap` | `1/4` | fraction = 0.25 | ✓ |
| `fermataVerticalGapOnBarline` | `1/2` | fraction = 0.5 | ✓ |
| `curlewVerticalGap` | `1/4` | fraction = 0.25 | ✓ |
| `breathMarkVerticalGap` | `1/4` | fraction = 0.25 | ✓ |
| `breathMarkHorizontalGap` | `1/4` | fraction = 0.25 | ✓ |
| `caesureHorizontalGap` | `1/4` | fraction = 0.25 | ✓ |
| `fermataMaximumSignsPerStave` | `kOnePerEachVoice` | enum | ✓ |
| `breathMarkVerticalPosition` | `kHalfwayBetweenNoteheadAndNextNotehead` | enum | ✓ |

## multiRestOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `hBarDistanceFromBarlines` | `3` | int | ✓ |
| `hBarEndCapLength` | `2` | int | ✓ |
| `hBarEndCapThickness` | `1/5` | fraction = 0.2 | ✓ |
| `hBarBodyHeight` | `1` | int | ✓ |
| `barCountDistanceFromStave` | `1/2` | fraction = 0.5 | ✓ |
| `showOldStyleMultiRests` | `false` | bool | ✓ |
| `maximumBarCountForOldStyleMultiRests` | `9` | int | ✓ |
| `multiRestBarWidth` | `12` | int | ✓ |
| `maxMultiRestBarWidth` | `24` | int | ✓ |
| `maxMultiRestBarWidthBarCountThreshold` | `10` | int | ✓ |
| `showTacetAlFine` | `true` | bool | ✓ |
| `alwaysShowBarRestForSingleBar` | `true` | bool | ✓ |
| `showOneAboveSingleBarRest` | `true` | bool | ✓ |
| `minimumSpaceForMultiRestOrTacet` | `4` | int | ✓ |
| `minimumSpaceForTacetAlFine` | `8` | int | ✓ |
| `multiRestSpacingScaleOnOverfullSystems` | `0.700000` | float | ✓ |
| `barNumberRangeDistanceFromStave` | `2` | int | ✓ |
| `useCustomSeparatorForBarNumberRanges` | `false` | bool | ✓ |
| `customSeparatorForBarNumberRanges` | ` - ` | text | ✓ |
| `tacetAlFineBarCountThreshold` | `4` | int | ✓ |
| `useFixedWidthHBar` | `false` | bool | ✓ |
| `fixedWidthHBarWidth` | `4` | int | ✓ |
| `showMultiRestBarCountsBetweenGrandStaves` | `true` | bool | ✓ |
| `tacetBarCountThreshold` | `16` | int | ✓ |
| `usePlainTextFontForBarCount` | `false` | bool | ✓ |
| `barCountPlacement` | `kAbove` | enum | ✓ |
| `considerWidthToRightOfBarlineAtStartOfMultiRest` | `true` | bool | ✓ |
| `considerWidthToLeftOfBarlineAtEndOfMultiRest` | `true` | bool | ✓ |

## barRepeatOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `allowThreeBarRepeats` | `false` | bool | ✓ |
| `distanceOfNumberFromTopOfStaffOrSymbol` | `1/2` | fraction = 0.5 | ✓ |
| `playedCountAppearance` | `kWithParentheses` | enum | ✓ |
| `playedCountAppearanceForLastBarInRegion` | `kNone` | enum | ✓ |
| `showPlayedCountEveryNBars` | `4` | int | ✓ |
| `widthOfCollapsedBarRepeatBar` | `10` | int | ✓ |
| `showNumberingOnlyCountEveryNBars` | `1` | int | ✓ |
| `numberingOnlyCountAppearance` | `kWithoutParentheses` | enum | ✓ |
| `distanceOfNumberedBarsFromStaff` | `1/2` | fraction = 0.5 | ✓ |
| `distanceOfNumberedBarsFromOtherObstructions` | `1/2` | fraction = 0.5 | ✓ |
| `appearanceOfNumberingRangeInFirstBar` | `kShowRangeInParentheses` | enum | ✓ |
| `minimumNumberOfBarsToShowRange` | `4` | int | ✓ |
| `horizontalGapToLeaveAroundNumberedBars` | `3/4` | fraction = 0.75 | ✓ |
| `staveRelativePositionForNumberedBarRegions` | `kAbove` | enum | ✓ |
| `alignNumberedBarRegionsOnEachSystem` | `false` | bool | ✓ |
| `numberAtLastBarOfRegionAppearance` | `kNone` | enum | ✓ |
| `numberAtEndsOfSystemsAppearance` | `kNone` | enum | ✓ |
| `numberAtFirstBarOfRegionAppearance` | `kWithoutParentheses` | enum | ✓ |

## playingTechniqueOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `glyphVerticalGap` | `1/4` | fraction = 0.25 | ✓ |
| `textVerticalGap` | `1/2` | fraction = 0.5 | ✓ |
| `lineEndHorizontalGap` | `0` | int | – |
| `textLineHorizontalGap` | `0` | int | – |
| `glyphLineHorizontalGap` | `0` | int | – |
| `concatenateTextAtSamePosition` | `true` | bool | ✓ |
| `textContinuationType` | `kNothing` | enum | – |
| `glyphContinuationType` | `kNothing` | enum | – |
| `continuationLineAppearance` | `` | text | – |
| `continuationLineEndAppearance` | `` | text | – |
| `continuationLineWidth` | `0` | int | – |
| `dashedContinuationLineDashLength` | `0` | int | – |
| `dashedContinuationLineGapLength` | `0` | int | – |
| `dottedContinuationLineDotDiameter` | `0` | int | – |
| `dottedContinuationLineGapLength` | `0` | int | – |
| `playingTechniqueErasurePadding` | `1/8` | fraction = 0.125 | ✓ |
| `textHorizontalOffset` | `0` | int | ✓ |
| `textHorizontalGap` | `1/4` | fraction = 0.25 | ✓ |
| `glyphHorizontalGap` | `1/4` | fraction = 0.25 | ✓ |
| `lineEndHorizontalGapBeforeBarline` | `1/4` | fraction = 0.25 | ✓ |
| `lineEndHorizontalGapBeforeClump` | `1/4` | fraction = 0.25 | ✓ |
| `parenthesiseTextContinuation` | `true` | bool | ✓ |
| `scaleGlyphsOnGraceNotes` | `true` | bool | ✓ |
| `showPlayingTechniqueAtStartOfSubsequentSystems` | `true` | bool | ✓ |

## arpeggioOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `gapOnLeft` | `1/4` | fraction = 0.25 | ✓ |
| `gapOnRight` | `0` | int | – |
| `nonArpeggioLineWidth` | `1/8` | fraction = 0.125 | ✓ |
| `nonArpeggioHookLength` | `1/2` | fraction = 0.5 | ✓ |
| `outwardProtrusionFromNoteInSpace` | `1` | int | ✓ |
| `outwardProtrusionFromNoteOnLine` | `1/2` | fraction = 0.5 | ✓ |
| `nonArpeggioOutwardProtrusionFromNoteInSpace` | `0` | int | ✓ |
| `nonArpeggioOutwardProtrusionFromNoteOnLine` | `1/2` | fraction = 0.5 | ✓ |
| `lineEndForArpeggioUp` | `kNothing` | enum | ✓ |
| `lineEndForArpeggioDown` | `kArrow` | enum | ✓ |
| `showArpeggiosOnSlashVoices` | `false` | bool | ✓ |
| `slurArpeggioMinimumLength` | `2` | int | ✓ |
| `slurArpeggioSingleStaveHeight` | `3/4` | fraction = 0.75 | ✓ |
| `slurArpeggioCrossStaveHeight` | `1` | int | ✓ |
| `slurArpeggioSingleStaveShoulder` | `3/10` | fraction = 0.3 | ✓ |
| `slurArpeggioCrossStaveShoulder` | `1/5` | fraction = 0.2 | ✓ |
| `slurArpeggioEndThickness` | `1/8` | fraction = 0.125 | ✓ |
| `slurArpeggioMiddleThickness` | `1/4` | fraction = 0.25 | ✓ |
| `slurArpeggioOutwardProtrusionOnLine` | `1/4` | fraction = 0.25 | ✓ |

## pedalLineOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `gapBetweenSignAndLine` | `1/4` | fraction = 0.25 | ✓ |
| `gapAfterEndBeforeNote` | `1/4` | fraction = 0.25 | ✓ |
| `gapAtSytemEndWhenContinues` | `1/4` | fraction = 0.25 | ✓ |
| `height` | `3/2` | fraction = 1.5 | ✓ |
| `hookLength` | `3/4` | fraction = 0.75 | ✓ |
| `verticalGap` | `1/2` | fraction = 0.5 | ✓ |
| `extraVerticalGapBetweenPedalLines` | `1/2` | fraction = 0.5 | ✓ |
| `sustainPedalSignAppearance` | `kPedDotGlyph` | enum | ✓ |
| `sostenutoPedalSignAppearance` | `kSostDotGlyph` | enum | ✓ |
| `unaCordaPedalSignAppearance` | `kFullText` | enum | ✓ |
| `retakeWidth` | `3/4` | fraction = 0.75 | ✓ |
| `sustainContinuationType` | `kLine` | enum | ✓ |
| `sostenutoContinuationType` | `kLine` | enum | ✓ |
| `unacordaContinuationType` | `kSignAtEnd` | enum | ✓ |
| `continuationLineWidth` | `1/8` | fraction = 0.125 | ✓ |
| `dashedContinuationLineDashLength` | `1/2` | fraction = 0.5 | ✓ |
| `dashedContinuationLineGapLength` | `1/2` | fraction = 0.5 | ✓ |
| `showContinuationSignInParentheses` | `true` | bool | – |
| `startsBeforeGraceNotes` | `true` | bool | ✓ |
| `endsBeforeGraceNotes` | `true` | bool | ✓ |
| `notchesStartBeforeGraceNotes` | `true` | bool | ✓ |
| `extraOffsetForStartOfLineWithOrnateP` | `1` | int | ✓ |
| `letterCaseForUnaCordaTreCorde` | `kLowerCase` | enum | ✓ |
| `noteheadCentredRetakes` | `false` | bool | ✓ |

## chordSymbolEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `chordSymbolStyle` | `kStandard` | enum | ✓ |
| `preferenceForNoteB` | `kUseBAndBb` | enum | ✓ |
| `rootAndBassNoteAccidentalType` | `kUseAccidentalSymbols` | enum | ✓ |
| `solfeggioPreferenceForNoteC` | `kDo` | enum | ✓ |
| `solfeggioPreferenceForNoteD` | `kReWithoutAcuteAccent` | enum | ✓ |
| `solfeggioPreferenceForNoteG` | `kSo` | enum | ✓ |
| `solfeggioPreferenceForNoteB` | `kTi` | enum | ✓ |
| `rootAndBassNoteAccidentalPosition` | `kBaseline` | enum | ✓ |
| `nashvilleNoteNameAccidentalPosition` | `kBeforeNoteName` | enum | ✓ |
| `nashvilleNoteNameAccidentalAppearance` | `kSharpOrFlat` | enum | ✓ |
| `majorQualityAppearance` | `kNull` | enum | ✓ |
| `minorQualityAppearance` | `kLowerCaseM` | enum | ✓ |
| `majorAndMinorQualityPosition` | `kBaseline` | enum | ✓ |
| `majorSeventhIntervalAppearance` | `kLowerCaseMaj7` | enum | ✓ |
| `majorSeventhPosition` | `kBaseline` | enum | ✓ |
| `show7InMajorSeventhChords` | `true` | bool | ✓ |
| `majorSeventhIntervalAppearanceInMinorOrAugmentedChords` | `kLowerCaseMaj7` | enum | ✓ |
| `majorSeventhPositionInMinorAndAugmentedChords` | `kBaseline` | enum | ✓ |
| `show7InMinorAndAugmentedChordsWithMajorSeventh` | `true` | bool | ✓ |
| `majorSeventhRepresentationWithOtherExtension` | `kImpliedByOtherExtension` | enum | – |
| `majorSeventhRepresentationWithOtherExtensionForMinorAndAugChords` | `kImpliedByOtherExtension` | enum | ✓ |
| `parenthesiseMajorSeventhInMinorAndAugmentedChords` | `true` | bool | ✓ |
| `majorSeventhRepresentationWithOtherExtensionForOtherChords` | `kImpliedByOtherExtension` | enum | ✓ |
| `diminishedSeventhQualityAppearance` | `kLowerCaseDim7` | enum | ✓ |
| `diminishedTriadQualityAppearance` | `kMinorFlatFive` | enum | ✓ |
| `diminishedTextPosition` | `kBaseline` | enum | ✓ |
| `diminishedCirclePosition` | `kSuperscript` | enum | ✓ |
| `halfDiminishedChordAppearance` | `kMinorSevenFlat5` | enum | ✓ |
| `halfDiminishedSlashedOPosition` | `kSuperscript` | enum | ✓ |
| `intervalPosition` | `kBaseline` | enum | ✓ |
| `showIntervalSuperscriptWhenUsingSubscriptPosition` | `false` | bool | ✓ |
| `sixSlashNineAppearance` | `k6Add9` | text | ✓ |
| `openFifthAppearance` | `kOmit3` | enum | ✓ |
| `capitaliseSusAndAugText` | `false` | bool | ✓ |
| `susPosition` | `kBaseline` | enum | ✓ |
| `sus4Appearance` | `kSus4` | enum | ✓ |
| `sus2Appearance` | `kSus2` | enum | ✓ |
| `augPosition` | `kBaseline` | enum | ✓ |
| `augmentedQualityAppearance` | `kAug` | enum | ✓ |
| `positionAugmentedQualityAfterInterval` | `false` | bool | ✓ |
| `positionForAlterations` | `kSuperscript` | enum | ✓ |
| `parenthesiseAlterations` | `kAlways` | enum | ✓ |
| `capitaliseTextBasedAlterations` | `false` | bool | ✓ |
| `omissionText` | `kOmit` | enum | ✓ |
| `alterationAccidentalStyle` | `kSharpAndFlat` | enum | ✓ |
| `alterationArrangement` | `kStacked` | enum | ✓ |
| `alterationAccidentalPosition` | `kBeforeNoteName` | enum | ✓ |
| `includeAddForAdditions` | `kAlwaysIncludeAddPrefix` | enum | ✓ |
| `relativePositionsForChordWithAlteredBassNote` | `kLinear` | enum | ✓ |
| `useJapaneseAlteredBassNoteStyle` | `false` | bool | ✓ |
| `relativePositionsInPolychord` | `kAsFraction` | enum | ✓ |
| `compoundChordSeparatorLineWidth` | `1/10` | fraction = 0.1 | ✓ |
| `compoundChordSeparatorGap` | `1/5` | fraction = 0.2 | ✓ |
| `alterationSeparationBehaviour` | `kSeparateWithSpace` | enum | ✓ |
| `alteredChordSymbolAppearance` | `kAltDot` | enum | ✓ |
| `showAltForAlteredChords` | `kWithFourAlterations` | enum | ✓ |
| `positionForAlteredChordAlt` | `kBaseline` | enum | ✓ |
| `showAltForAlteredChordsInParentheses` | `false` | bool | ✓ |
| `transposedChordSpellingPreference` | `kAllowAllRoots` | enum | ✓ |
| `enforceCleanIntervallicRelationshipBetweenRootAndAlteredBass` | `true` | bool | ✓ |
| `chordSymbolRootOnlyAppearance` | `kBass` | enum | ✓ |
| `chordSymbolPedalOnlyAppearance` | `kPedDot` | enum | ✓ |
| `idealDistanceAboveStaff` | `3/2` | fraction = 1.5 | – |
| `minimumGapBetweenChordSymbols` | `1/2` | fraction = 0.5 | ✓ |
| `positionChordSymbolsBetweenStavesOfGrandStaveInstruments` | `false` | bool | – |
| `verticalOffsetForSuperscriptComponents` | `5/8` | fraction = 0.625 | ✓ |
| `scaleFactorForSuperscriptAndSubscriptComponents` | `65` | int | ✓ |
| `scaleFactorForStackedAlterations` | `65` | int | ✓ |
| `gapBetweenStackedAlterations` | `1/4` | fraction = 0.25 | ✓ |
| `horizontalGapBetweenAlterations` | `1/2` | fraction = 0.5 | ✓ |
| `horizontalGapEitherSideOfAlterationsOutsideParentheses` | `1/6` | fraction = 0.166667 | ✓ |
| `horizontalGapEitherSideOfAlterationsInsideParentheses` | `1/8` | fraction = 0.125 | ✓ |
| `horizontalGapBeforeAlterationSeparator` | `1/16` | fraction = 0.0625 | ✓ |
| `horizontalGapFollowingAlterationSeparator` | `1/2` | fraction = 0.5 | ✓ |
| `minimumVerticalDistanceBetweenChordSymbolsAndOtherObstructions` | `3/4` | fraction = 0.75 | ✓ |
| `verticallyAlignChordSymbolsOnSystem` | `true` | bool | ✓ |
| `chordSymbolHorizontalAlignment` | `kCentre` | enum | – |
| `chordSymbolNoteRelativeHorizontalAlignment` | `kLeft` | enum | ✓ |
| `chordSymbolHorizontalOffset` | `0` | int | ✓ |
| `defaultPlacementForChordSymbolsOnSingleStaveInstruments` | `kAbove` | enum | ✓ |
| `automaticallyCurtailRepeatedChordSymbolsWithChangingBassNote` | `true` | bool | ✓ |
| `automaticallyCurtailRepeatedChordSymbolsThresholdUnit` | `kBars` | enum | ✓ |
| `automaticallyCurtailRepeatedChordSymbolsThresholdValue` | `1` | int | ✓ |
| `explicitlyRestateRootFollowingHiddenChangeOfHarmony` | `true` | bool | ✓ |
| `modalChordSymbolTextCase` | `kTitleCaseModeLowerCaseScale` | enum | ✓ |
| `showDotAfterChordSymbolMode` | `true` | bool | ✓ |
| `chordSymbolModeTextPosition` | `kSuperscript` | enum | ✓ |
| `gapBetweenRootAndMode` | `1/4` | fraction = 0.25 | ✓ |
| `capoChordSymbolVisibility` | `kShowRealPitchOnly` | enum | ✓ |
| `capoChordSymbolAppearance` | `kItalicizeCapoChordSymbol` | enum | ✓ |
| `verticalGapBelowCapoChordSymbol` | `1` | int | ✓ |
| `erasurePadding` | `1/8` | fraction = 0.125 | ✓ |
| `chordSymbolParenthesisXOffset` | `1/8` | fraction = 0.125 | ✓ |
| `chordSymbolParenthesisVerticalHeightPercentage` | `115` | int | ✓ |
| `suppressParenthesesAroundAlterationsInParenthesisedChordSymbolsBehaviour` | `kSuppressInFinalGroupIfChordParenthesised` | enum | ✓ |
| `allowParenthesesAroundAlterationsInParenthesisedChordIfSeparatedByAlteredBassNote` | `true` | bool | ✓ |

## chordDiagramEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `offsetBelowChordSymbol` | `1` | int | ✓ |
| `defaultNumberOfFrets` | `5` | int | ✓ |
| `defaultFretSpacing` | `3/5` | fraction = 0.6 | ✓ |
| `defaultStringSpacing` | `1/2` | fraction = 0.5 | ✓ |
| `stringLengthBeyondFinalFret` | `0` | int | ✓ |
| `highestStartingFretToStillShowNut` | `2` | int | ✓ |
| `scaleFactorRelativeToChordSymbol` | `1.000000` | float | ✓ |
| `chordDiagramOrientation` | `kVertical` | enum | ✓ |
| `chordDiagramLineThickness` | `1/12` | fraction = 0.0833333 | ✓ |
| `nutThickness` | `1/4` | fraction = 0.25 | ✓ |
| `filledDotRadius` | `1/4` | fraction = 0.25 | ✓ |
| `emptyCircleRadius` | `1/4` | fraction = 0.25 | ✓ |
| `sizeOfX` | `1/2` | fraction = 0.5 | ✓ |
| `startingFretNumberFontSize` | `0` | int | – |
| `startingFretNumberXOffset` | `1/2` | fraction = 0.5 | ✓ |
| `startingFretNumberYOffset` | `0` | int | ✓ |
| `topCharacterYOffset` | `0` | int | ✓ |
| `showTieAcrossBarredNotes` | `true` | bool | ✓ |
| `tieOffsetFromFret` | `0` | int | ✓ |
| `tieThickness` | `1/5` | fraction = 0.2 | ✓ |
| `startingFretNumberOnLeftOrRight` | `kRight` | enum | ✓ |
| `startingFretNumberNumeralType` | `kArabic` | enum | ✓ |
| `startingFretNumberVerticalAlignment` | `kCentred` | enum | ✓ |
| `startingFretNumberPrefix` | `fr. ` | text | ✓ |
| `startingFretNumberSuffix` | `` | text | ✓ |

## repeatEndingLineEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `endOfLineAppearance` | `kOpenFullLength` | enum | ✓ |
| `alwaysCloseEndOfLineAtEndOfFlow` | `false` | bool | ✓ |
| `useDashesToElideConsecutiveTimesPlayed` | `true` | bool | ✓ |
| `separatorStringBetweenTimesPlayed` | `.` | text | ✓ |
| `terminatorStringAfterTimesPlayed` | `.` | text | ✓ |
| `hookLength` | `5/2` | fraction = 2.5 | ✓ |
| `separationBetweenSegmentsAtSingleBarlines` | `1/2` | fraction = 0.5 | ✓ |
| `minimumDistanceAboveStave` | `3/2` | fraction = 1.5 | ✓ |
| `gapBetweenHookAndText` | `1/2` | fraction = 0.5 | ✓ |
| `gapBetweenTextAndEndOfLineForShortOpenLines` | `3` | int | ✓ |
| `gapBetweenBottomOfLineAndTopOfText` | `3/4` | fraction = 0.75 | ✓ |
| `lineThickness` | `1/5` | fraction = 0.2 | ✓ |
| `minimumGapBetweenLineAndOtherObject` | `3/4` | fraction = 0.75 | ✓ |

## cueEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `showArticulations` | `true` | bool | ✓ |
| `showSlurs` | `true` | bool | ✓ |
| `showLyrics` | `true` | bool | ✓ |
| `showDynamics` | `false` | bool | ✓ |
| `showTechniques` | `true` | bool | ✓ |
| `showOrnaments` | `true` | bool | ✓ |
| `showText` | `false` | bool | ✓ |
| `showPlayAtEnd` | `false` | bool | ✓ |
| `showFermatas` | `false` | bool | ✓ |
| `gapBetweenCueLabelAndStave` | `1` | int | ✓ |
| `gapBetweenCueLabelAndOtherObjects` | `1/2` | fraction = 0.5 | ✓ |
| `shortenedInstrumentName` | `true` | bool | ✓ |
| `includeTransposition` | `false` | bool | ✓ |
| `cueVisualScale` | `3/4` | fraction = 0.75 | ✓ |
| `cueLabelIsAlwaysAbove` | `false` | bool | ✓ |
| `cueUnpitchedNotesPositionOnStave` | `0` | int | ✓ |
| `cueRhythmicCueStavePositionDistance` | `2` | int | ✓ |
| `showOctaveTransposition` | `true` | bool | ✓ |
| `defaultCueClefValue` | `kSourceStaveClef` | enum | ✓ |

## fingeringEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `fingeringSubstitutionAppearance` | `kLine` | enum | ✓ |
| `fingeringSubstitutionLineMinimumLength` | `1/2` | fraction = 0.5 | ✓ |
| `fingeringSubstitutionLineThickness` | `1/12` | fraction = 0.0833333 | ✓ |
| `gapEitherSideOfSubstitutionLine` | `1/8` | fraction = 0.125 | ✓ |
| `gapEitherSideOfDeferredSubstitutionLine` | `1/4` | fraction = 0.25 | ✓ |
| `minimumDistanceBetweenStaveAndFingerings` | `1` | int | ✓ |
| `minimumDistanceBetweenOtherObjectsAndFingerings` | `1/2` | fraction = 0.5 | ✓ |
| `horizontalGapBetweenCoincidentFingerings` | `1/8` | fraction = 0.125 | ✓ |
| `verticalGapBetweenCoincidentFingerings` | `1/8` | fraction = 0.125 | ✓ |
| `additionalVerticalGapBetweenFingeringAndSubstitutionLineInAdjacentRows` | `1/4` | fraction = 0.25 | ✓ |
| `minimumVerticalDistanceBetweenFingeringRows` | `4/5` | fraction = 0.8 | ✓ |
| `symbolsToUseForAlternativeFingerings` | `kParentheses` | enum | – |
| `symbolsToUseForEditorialFingerings` | `kBrackets` | enum | ✓ |
| `showBracketForMultipleNotesPlayedWithSingleFinger` | `true` | bool | ✓ |
| `scaleFingeringsOnGraceNotes` | `true` | bool | ✓ |
| `fingeringAdoptVoiceDirections` | `false` | bool | ✓ |
| `cautionaryFingeringAppearance` | `kParenthesised` | enum | ✓ |
| `brassFingeringSeparator` | `kNone` | enum | ✓ |
| `gapEitherSideOfBrassPistonValveSeparators` | `1/3` | fraction = 0.333333 | ✓ |
| `brassFingeringArrangement` | `kVertical` | enum | ✓ |
| `tromboneSlidePositionStyle` | `kArabic` | enum | ✓ |
| `alignSimpleFingeringsWithNotesWithHorizontalOffsets` | `true` | bool | ✓ |
| `fingeringColumnDistanceThreshold` | `5/4` | fraction = 1.25 | ✓ |
| `gapAroundSubstitutionSlurs` | `0` | int | – |
| `verticalOffsetForSubstitutionSlurs` | `1/8` | fraction = 0.125 | ✓ |
| `horizontalGapBeforeOrAfterAlternativeOrEditorialFingerings` | `1/4` | fraction = 0.25 | ✓ |
| `horizontalGapInsideParenthesesOrBrackets` | `1/12` | fraction = 0.0833333 | ✓ |
| `minimumHorizontalSeparationBetweenAdjacentFingeringRows` | `1/8` | fraction = 0.125 | ✓ |
| `minimumHorizontalSepatationBetweenOtherObjectsAndFingerings` | `1/8` | fraction = 0.125 | ✓ |
| `gapBeforeSharedFingeringBracket` | `1/4` | fraction = 0.25 | ✓ |
| `alignmentOfFingeringSequenceOnSingleNote` | `kCentre` | enum | ✓ |
| `fingeringShiftLineLength` | `9/5` | fraction = 1.8 | ✓ |
| `fingeringShiftLineAngle` | `15` | int | ✓ |
| `fingeringShiftLineThickness` | `1/6` | fraction = 0.166667 | ✓ |
| `alwaysCentreFingeringShiftIndications` | `true` | bool | ✓ |
| `maximumDistanceBetweenFingeringShiftAndFollowingNote` | `8` | int | ✓ |
| `usePlainTextFontForFingerings` | `false` | bool | ✓ |
| `horizontalGapBetweenFingeringsSeparatedBySubstitutionSlur` | `1/6` | fraction = 0.166667 | ✓ |
| `cautionaryFingeringAppearanceForNotesThatHaveBeenOffset` | `kOmit` | enum | ✓ |
| `gapBetweenHornBranchAndFingering` | `1/5` | fraction = 0.2 | ✓ |
| `hornBranchSeparator` | `kNone` | enum | ✓ |
| `showAltoForEFlatBranch` | `false` | bool | ✓ |
| `textForAltoBranchOnTripleHorn` | `al.` | text | ✓ |
| `slurRelativePosition` | `kInside` | enum | ✓ |
| `circularEnclosureThickness` | `1/10` | fraction = 0.1 | ✓ |
| `circularEnclosureGap` | `1/6` | fraction = 0.166667 | ✓ |
| `circularEnclosureAdditionalStaveDistanceMargin` | `1/2` | fraction = 0.5 | ✓ |
| `underlineThickness` | `1/12` | fraction = 0.0833333 | ✓ |
| `underlineOffset` | `1/18` | fraction = 0.0555556 | ✓ |
| `underlineMinimumLength` | `3/4` | fraction = 0.75 | ✓ |
| `alternativeFingeringPlacement` | `kRight` | enum | ✓ |
| `verticalGapBetweenFingeringAndAlternative` | `1/4` | fraction = 0.25 | ✓ |
| `alternativeFingeringAppearance` | `kParentheses` | enum | ✓ |
| `positionPluckedFingeringsOnNoteheadSideWhenNoConflictingVoicesActive` | `true` | bool | ✓ |
| `alwaysPositionThumbFingeringsBelowTheStaveWhenNoConflictingVoicesActive` | `false` | bool | ✓ |
| `crossStaveChordFingeringBehaviour` | `kPositionOnHomeStave` | enum | ✓ |
| `enableRightHandFingeringForPluckedInstruments` | `true` | bool | ✓ |
| `thumbIndicator` | `kP` | enum | ✓ |
| `pinkyIndicator` | `kE` | enum | ✓ |
| `defaultDistanceFromIntraStaveNotehead` | `1/6` | fraction = 0.166667 | ✓ |
| `minimumDistanceFromOtherIntraStaveObstructions` | `1/8` | fraction = 0.125 | ✓ |
| `intraStaveFingeringIntervalThresholdForAlignment` | `6` | int | ✓ |
| `minimumVerticalGapBetweenAdjacentIntraStaveFingerings` | `1/7` | fraction = 0.142857 | ✓ |
| `defaultHorizontalGapBetweenAdjacentIntraStaveFingeringsIfNoKerningData` | `1/12` | fraction = 0.0833333 | ✓ |
| `horizontalIntraStaveFingeringAlignmentThreshold` | `3/4` | fraction = 0.75 | ✓ |
| `verticalIntraStaveFingeringOffsetFromOutermostStaveLine` | `1/4` | fraction = 0.25 | ✓ |
| `intraStaveFingeringCollisionAvoidanceArrangement` | `kOffsetVertically` | enum | ✓ |
| `verticalOffsetForIntraStaveFingeringsInSpaces` | `-1/7` | fraction = -0.142857 | ✓ |
| `scalePercentageForIntraStaveFingerings` | `95` | int | ✓ |
| `scalePercentageForIntraStavePluckedFingerings` | `85` | int | ✓ |
| `eraseBackgroundBehindIntraStaveFingerings` | `true` | bool | ✓ |
| `intraStaveFingeringErasedBackgroundHorizontalPadding` | `1/16` | fraction = 0.0625 | ✓ |
| `intraStaveFingeringErasedBackgroundVerticalPadding` | `0` | int | ✓ |
| `intraStaveFingeringCautionaryAppearance` | `kOmit` | enum | ✓ |
| `gapBetweenPluckedFingeringAndArpeggioLineOrStave` | `1/3` | fraction = 0.333333 | ✓ |
| `forceArpeggioLineFingeringsOutsideStave` | `true` | bool | ✓ |
| `scalePercentageForArpeggioLineFingerings` | `100` | int | ✓ |
| `gapBetweenArpeggioLineFingeringAndOtherItems` | `1/5` | fraction = 0.2 | ✓ |
| `relativePositionOfPluckedFingeringToBracketIfAtBottomOfChord` | `kBelow` | enum | ✓ |
| `verticalGapBetweenBracketAndPluckedFingering` | `1/4` | fraction = 0.25 | ✓ |
| `horizontalGapBetweenBracketAndPluckedFingering` | `1/4` | fraction = 0.25 | ✓ |
| `pluckedFingeringBracketHorizontalLength` | `1/2` | fraction = 0.5 | ✓ |
| `pluckedFingeringBracketPenThickness` | `1/12` | fraction = 0.0833333 | ✓ |
| `pluckedFingeringBracketDistanceFromStaveLines` | `1/4` | fraction = 0.25 | ✓ |
| `pluckedFingeringBracketDistanceFromNeighbouringBracket` | `1/4` | fraction = 0.25 | ✓ |
| `intraStaveFingeringExtremeVerticalOverlapThresholdPercentage` | `70` | int | ✓ |
| `fingeringSlideJoinBehaviour` | `kJoinFingeringsWherePossible` | enum | ✓ |
| `maximumDistanceBetweenFingeringsToJoinWithSingleLine` | `10` | int | ✓ |
| `fingeringSlideJoiningLineThickness` | `1/12` | fraction = 0.0833333 | ✓ |
| `fingeringSlideApproachingLineThickness` | `1/6` | fraction = 0.166667 | ✓ |
| `fingeringSlideGapBeforeOrAfterObstruction` | `1/8` | fraction = 0.125 | ✓ |
| `fingeringSlideLengthApproachingDestination` | `1` | int | ✓ |
| `fingeringSlideMinimumVerticalDelta` | `1/3` | fraction = 0.333333 | ✓ |
| `fingeringSlideAngleApproachingDestination` | `15` | int | ✓ |
| `fingeringSlideMinimumDistanceFromStaveLines` | `1/4` | fraction = 0.25 | ✓ |
| `preferredMaximumAngleForFingeringSlides` | `30` | int | ✓ |
| `allowFingeringSlidesToBisectNoteFlags` | `true` | bool | ✓ |

## percussionLegendEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `percussionLegendDistanceFromStaff` | `1` | int | – |
| `paddingBelowPercussionLegend` | `1/2` | fraction = 0.5 | – |
| `minimumGapBetweenPercussionLegends` | `1` | int | – |

## systemDividerEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `type` | `kDefault` | enum | – |
| `minStavesInSystem` | `0` | int | – |
| `drawOnLeft` | `true` | bool | ✓ |
| `leftInset` | `0` | int | ✓ |
| `drawOnRight` | `false` | bool | ✓ |
| `rightInset` | `0` | int | ✓ |

## markerEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `enclosureRectangleLineWidth` | `1/6` | fraction = 0.166667 | ✓ |
| `enclosureRectanglePadding` | `1/2` | fraction = 0.5 | ✓ |
| `contentOrder` | `kTextAboveTimecode` | enum | ✓ |
| `gapBetweenMarkerAndStave` | `2` | int | ✓ |
| `gapBetweenMarkerAndOtherObjects` | `1/2` | fraction = 0.5 | ✓ |
| `showTimecode` | `true` | bool | ✓ |

## divisiEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `showDivideArrowsOnVocalStaves` | `true` | bool | ✓ |
| `gapBetweenDivisiLabelsAndStave` | `1/2` | fraction = 0.5 | ✓ |
| `gapBetweenDivisiLabelsAndOtherObjects` | `1/2` | fraction = 0.5 | ✓ |

## slashRegionEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `distanceOfNumberFromStave` | `1/2` | fraction = 0.5 | ✓ |
| `placementRelativeToStave` | `kBelow` | enum | ✓ |
| `playedCountAppearance` | `kWithParentheses` | enum | ✓ |
| `showPlayedCountEveryNBars` | `4` | int | ✓ |
| `showPlayedCountOnFirstBarOfAbuttingSlashRegion` | `false` | bool | ✓ |

## repeatMarkerEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `useJapaneseSymbols` | `false` | bool | ✓ |
| `distanceFromStave` | `3/2` | fraction = 1.5 | ✓ |
| `verticalDistanceFromOtherItems` | `1/2` | fraction = 0.5 | ✓ |
| `textAbbreviation` | `kAbbreviateWithDots` | enum | ✓ |
| `symbolBehaviourWithToCodaJumpMarker` | `kSymbolToRightOfText` | enum | ✓ |
| `symbolBehaviourWithCodaSectionMarker` | `kSymbolToLeftOfText` | enum | ✓ |
| `textCaseForSectionMarkers` | `kTitleCase` | enum | ✓ |
| `textCaseForJumpMarkers` | `kTitleCase` | enum | ✓ |
| `verticalGapAboveCodaSymbol` | `1/4` | fraction = 0.25 | ✓ |
| `multipleSegnoBehaviour` | `kShowMultipleSymbols` | enum | ✓ |
| `multipleCodaBehaviour` | `kShowNumberAndSingleSymbol` | enum | ✓ |
| `musicTextScalePercentage` | `100` | int | – |
| `musicTextScalePercentageForCoda` | `100` | int | ✓ |
| `musicTextScalePercentageForSegno` | `100` | int | ✓ |
| `baselineShiftForCodaToLeftOrRightOfText` | `0` | int | ✓ |
| `segnoAppearanceBehaviourInJumpMarkers` | `kShowOnlyAsText` | enum | ✓ |
| `showCodaAsSymbolInJumpMarkerQualification` | `false` | bool | ✓ |
| `toCodaLanguage` | `kEnglish` | enum | ✓ |
| `distanceBetweenLinesOfTextWhenWrapped` | `2/3` | fraction = 0.666667 | ✓ |
| `lhsIndentForLeftAlignedMarkersAtBarline` | `0` | int | ✓ |
| `rhsIndentForRightAlignedMarkersAtBarline` | `0` | int | ✓ |
| `minimumDistanceBetweenCoincidentRepeatMarkers` | `1` | int | ✓ |
| `codaPositionAtStartOfSystem` | `kFollowingPreamble` | enum | ✓ |
| `distanceAboveStaveForCodaOverPreamble` | `2` | int | ✓ |
| `systemGapSizeForSectionRepeatMarkers` | `6` | int | ✓ |
| `repeatCountLocation` | `kEndOfRegion` | enum | ✓ |
| `repeatCountAppearance` | `kPlayNTimes` | enum | ✓ |
| `repeatCountDistanceFromStave` | `1` | int | ✓ |
| `showPlayTwoTimesByDefault` | `false` | bool | ✓ |
| `customRepeatCountPrefix` | `x` | text | ✓ |
| `customRepeatCountSuffix` | `` | text | ✓ |
| `repeatCountHorizontalOffsetFromBarline` | `1/2` | fraction = 0.5 | ✓ |

## jazzArticulationEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `lineStyleForLifts` | `kWavy` | enum | ✓ |
| `lineStyleForSmoothPlops` | `kWavy` | enum | ✓ |
| `lineStyleForSmoothFalls` | `kWavy` | enum | ✓ |
| `lineStyleForSmoothDoits` | `kWavy` | enum | ✓ |
| `durationForBentFalls` | `kMedium` | enum | ✓ |
| `durationForBentDoits` | `kMedium` | enum | ✓ |
| `gapToRightOfInwardArticulations` | `1/6` | fraction = 0.166667 | ✓ |
| `gapToLeftOfOutwardArticulations` | `1/6` | fraction = 0.166667 | ✓ |
| `lineIntervalSpan` | `5` | int | ✓ |
| `horizontalLineSpan` | `2` | int | ✓ |
| `lineThickness` | `1/7` | fraction = 0.142857 | ✓ |
| `dashLength` | `3/7` | fraction = 0.428571 | ✓ |
| `gapLength` | `1/5` | fraction = 0.2 | ✓ |
| `alignArticulationsHorizontally` | `kWithinThreshold` | enum | ✓ |
| `thresholdForHorizontalAlignment` | `3/5` | fraction = 0.6 | ✓ |
| `verticalOffsetForArticulationsOnStaveLines` | `3/8` | fraction = 0.375 | ✓ |
| `minimumGapAroundArticulations` | `1/6` | fraction = 0.166667 | ✓ |
| `alwaysPositionOutwardArticulationsToRightOfRhythmDots` | `false` | bool | ✓ |
| `lineFarsideStaveLineAvoidanceGap` | `1/4` | fraction = 0.25 | ✓ |
| `spacingMarginAroundJazzArticulations` | `1/8` | fraction = 0.125 | ✓ |

## tacetEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `useBorder` | `true` | bool | ✓ |
| `tacetPadding` | `1/2` | fraction = 0.5 | ✓ |
| `tacetBorderThickness` | `1/8` | fraction = 0.125 | ✓ |

## harpPedalEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `diagramLineWidth` | `1/6` | fraction = 0.166667 | ✓ |
| `diagramPedalBoxWidth` | `1/2` | fraction = 0.5 | ✓ |
| `diagramPedalBoxHeight` | `7/4` | fraction = 1.75 | ✓ |
| `diagramGapBetweenPedals` | `3/4` | fraction = 0.75 | ✓ |
| `diagramVerticalGapForTopBottomBox` | `1/4` | fraction = 0.25 | ✓ |
| `harpLeftPedalsOrderForTwoLineNoteNames` | `kDCB` | enum | ✓ |
| `gapBeetwenStaveLineAndHarpPedal` | `1` | int | ✓ |
| `gapBeetwenObjectAndHarpPedal` | `1/2` | fraction = 0.5 | ✓ |
| `allowPartialChanges` | `true` | bool | ✓ |
| `maximumPedalsInPartialChange` | `3` | int | ✓ |
| `showBorder` | `true` | bool | ✓ |
| `erasurePadding` | `1/4` | fraction = 0.25 | ✓ |
| `borderThickness` | `1/8` | fraction = 0.125 | ✓ |
| `centerBetweenStaves` | `true` | bool | ✓ |
| `horizontalGapBetweenHarpPedals` | `1` | int | ✓ |
| `alwaysShowPartialPedallingInTwoLines` | `true` | bool | ✓ |
| `thresholdForShowingPartialPedallingInTwoLines` | `4` | int | ✓ |
| `eraseBackground` | `true` | bool | ✓ |

## condensingEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `gapBetweenCondensingLabelsAndStave` | `1/2` | fraction = 0.5 | – |
| `gapBetweenCondensingLabelsAndOtherObjects` | `1/2` | fraction = 0.5 | – |
| `showFullStopBetweenPlayerNumbersInLabels` | `true` | bool | – |
| `separatorBetweenPlayerNumbersInLabels` | `kPeriod` | enum | ✓ |
| `showFullStopAfterLastPlayerNumberInLabels` | `true` | bool | ✓ |
| `labelToIndicationString` | `a ` | text | ✓ |
| `horizontalOffsetForLabel` | `-2` | int | ✓ |
| `eraseBackground` | `true` | bool | ✓ |
| `erasurePadding` | `1/8` | fraction = 0.125 | ✓ |
| `showFullStopAfterSinglePlayerNumberInLabels` | `true` | bool | ✓ |
| `showToIndicationWhenCoincidingWithPlayerNumbers` | `true` | bool | ✓ |

## stringIndicatorEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `indicatorScaleFactorPercentageInsideStave` | `66` | int | ✓ |
| `minimumGapBetweenNoteheadAndIndicator` | `1/5` | fraction = 0.2 | ✓ |
| `minimumGapBetweenOtherObjectsAndIndicator` | `1/6` | fraction = 0.166667 | ✓ |
| `minimumVerticalGapBetweenIndicators` | `1/8` | fraction = 0.125 | ✓ |
| `scaleIndicatorsOnGraceNotes` | `true` | bool | ✓ |
| `eraseBackgroundInsideIndicators` | `true` | bool | ✓ |
| `erasureOffsetFromPerimeter` | `1/20` | fraction = 0.05 | ✓ |
| `stringIndicatorPositionDeltaThresholdForAlignment` | `1` | int | ✓ |
| `arrangeIndicatorsForSamePitchHorizontally` | `true` | bool | ✓ |
| `gapBetweenObjectsOffsetHorizontallySharingSameStavePosition` | `1/8` | fraction = 0.125 | ✓ |
| `showOpenStringsAsZeroFingerings` | `true` | bool | – |
| `stringIndicatorIntervalThresholdForAlignment` | `8` | int | ✓ |
| `defaultNoteheadRelativePosition` | `kOnLeftIfNoFingeringsOtherwiseRight` | enum | ✓ |
| `allocateUnisonStringIndicesToBothSidesOfNotehead` | `true` | bool | ✓ |
| `openStringAppearance` | `kShowZeroAsFingering` | enum | ✓ |

## horizontalLineEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `verticalGapBetweenHorizontalLineAndStaveLine` | `1` | int | ✓ |
| `verticalGapBetweenHorizontalLineAndObject` | `1/2` | fraction = 0.5 | ✓ |
| `horizontalGapAtStartForInsideStaffHorizontalLine` | `1/2` | fraction = 0.5 | ✓ |
| `horizontalGapAtEndForInsideStaffHorizontalLine` | `1/2` | fraction = 0.5 | ✓ |
| `horizontalGapAtStartForOutsideStaffHorizontalLine` | `1/2` | fraction = 0.5 | ✓ |
| `horizontalGapAtEndForOutsideStaffHorizontalLine` | `1/2` | fraction = 0.5 | ✓ |
| `gapBetweenBarlineAttachedHorizontalLines` | `1/2` | fraction = 0.5 | ✓ |
| `horizontalGapBeforeEndOfSystem` | `1/2` | fraction = 0.5 | ✓ |

## figuredBassEngravingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `appearanceFor53` | `kShowNothing` | enum | ✓ |
| `alteredThirdAppearance` | `kShowAlterationOnlyWithNumberInSuspensions` | enum | ✓ |
| `appearanceFor63` | `kShow6Only` | enum | ✓ |
| `appearanceFor753` | `kShow7Only` | enum | ✓ |
| `appearanceFor653` | `kShow65Only` | enum | ✓ |
| `firstInversionDominant7thAppearance` | `kShowAsFigures` | enum | ✓ |
| `appearanceFor643` | `kShow43Only` | enum | ✓ |
| `appearanceFor642` | `kShow42Only` | enum | ✓ |
| `thirdInversionDominant7thAppearance` | `kShowAsFigures` | enum | ✓ |
| `suspension43Appearance` | `kShowAllNumbers` | enum | ✓ |
| `suspension76Appearance` | `kShowAllNumbers` | enum | ✓ |
| `diminishedIntervalPitchConfirmation` | `kConfirmIfDiminishedFromNextLowestFigure` | enum | ✓ |
| `naturallyDiminishedIntervalAccidentalOrFigureSuppression` | `kSuppressNone` | enum | ✓ |
| `accidentalOrSlashPreference` | `kOnlyUseAccidentals` | enum | ✓ |
| `accidentalRelativity` | `kAbsolute` | enum | ✓ |
| `accidentalPositionRelativeToNumber` | `kBefore` | enum | ✓ |
| `gapBetweenAccidentalAndNumber` | `1/6` | fraction = 0.166667 | ✓ |
| `gapBetweenFiguresAndLines` | `1/3` | fraction = 0.333333 | ✓ |
| `gapBetweenFiguresAndLinesInNonDeferredSuspensionResolutions` | `1/6` | fraction = 0.166667 | ✓ |
| `holdLineThickness` | `1/10` | fraction = 0.1 | ✓ |
| `suspensionLineThickness` | `1/10` | fraction = 0.1 | ✓ |
| `cautionaryAlterationsBehaviour` | `kDoNotShow` | enum | ✓ |
| `revisedBassNoteBehaviour` | `kReviseFigures` | enum | ✓ |
| `staveRelativePosition` | `kBelow` | enum | – |
| `verticalGapBetweenRowsOfFigures` | `1/4` | fraction = 0.25 | ✓ |
| `gapBetweenSuspensionAndResolution` | `3/4` | fraction = 0.75 | ✓ |
| `gapBetweenSuspensionAndResolutionJoinedByLine` | `5/4` | fraction = 1.25 | ✓ |
| `additionalGapToLeaveForParenthesisOnOneSideOfLineBetweenSuspensionAndResolution` | `1/8` | fraction = 0.125 | ✓ |
| `perSystemAlignmentWhenBelowStave` | `kAlignTopFigures` | enum | ✓ |
| `perSystemAlignmentWhenAboveStave` | `kAlignBottomFigures` | enum | ✓ |
| `raisedFifthSlashType` | `kStraightVerticalLine` | enum | ✓ |
| `raisedSixthSlashType` | `kAngledLineThroughBottom` | enum | ✓ |
| `usePlainTextFontForFiguredBass` | `false` | bool | ✓ |
| `minimumDistanceFromStave` | `3/4` | fraction = 0.75 | ✓ |
| `minimumDistanceFromOtherObjects` | `3/4` | fraction = 0.75 | ✓ |
| `lineBetweenSuspensionAndResolutionBehaviour` | `kNeverDrawLine` | enum | ✓ |
| `continueHoldsAfterResolutions` | `false` | bool | ✓ |
| `centreFiguresOnNoteheads` | `true` | bool | ✓ |
| `scaleFactorPercentage` | `100` | int | ✓ |
| `accidentalScaleFactorPercentage` | `100` | int | ✓ |
| `minimumViableLengthForLines` | `1` | int | ✓ |
| `minimumViableLengthForSuspensionLineWithNonDeferredResolution` | `1/2` | fraction = 0.5 | ✓ |
| `assumedHeightForRowContainingOnlyLines` | `3/4` | fraction = 0.75 | ✓ |
| `allowHoldLinesToCrossAccidentalsAndResolutionFiguresInOtherRows` | `false` | bool | ✓ |
| `gapToLeaveBeforeLinesEndingAtBarlines` | `1/2` | fraction = 0.5 | ✓ |
| `gapToLeaveBeforeLinesEndingAtEndOfSystem` | `1/2` | fraction = 0.5 | ✓ |
| `gapToLeaveBeforeLineWithNoVisibleFigures` | `1` | int | ✓ |
| `horizontalPaddingAroundComposites` | `1/16` | fraction = 0.0625 | ✓ |
| `horizontalPaddingAroundLines` | `1/10` | fraction = 0.1 | ✓ |
| `showSingleHoldLineWherePossible` | `false` | bool | ✓ |
| `singleHoldLineVerticalPosition` | `kMiddle` | enum | ✓ |
| `showSignPostsForInvisibleFiguresOnRests` | `true` | bool | ✓ |
| `showSignPostsForOrphanedFiguresWithNoBassNote` | `true` | bool | ✓ |
| `useNeueBachAusgabeAccidentalPositioning` | `false` | bool | ✓ |
| `horizontalGapBetweenAccidentalsUsingNeueBachAusgabePositioning` | `1/12` | fraction = 0.0833333 | ✓ |
| `verticalGapBetweenAccidentalsUsingNeueBachAusgabePositioning` | `1/12` | fraction = 0.0833333 | ✓ |
| `verticalOverlapThrehsoldForAccidentalsUsingNeueBachAusgabePositioningToMoveVertically` | `1/4` | fraction = 0.25 | ✓ |
| `verticalOverlapThrehsoldForFourAccidentalsUsingNeueBachAusgabePositioningToMoveVertically` | `1/6` | fraction = 0.166667 | ✓ |
| `neueBachAusgabeAnchoringBehaviour` | `kAnchorFigureClosestToStaveWhenBeyondThreshold` | enum | ✓ |
| `neueBachAusgabeAnchoringOffsetThreshold` | `1/3` | fraction = 0.333333 | ✓ |
| `neueBachAusgabeAnchoringOffsetThresholdForFourAccidentals` | `1/2` | fraction = 0.5 | ✓ |
| `parenthesisCurveMiddleThickness` | `1/10` | fraction = 0.1 | ✓ |
| `parenthesisCurveEndThickness` | `3/40` | fraction = 0.075 | ✓ |
| `parenthesisCurveHorizontalExtentForHeightOfSpace` | `1/4` | fraction = 0.25 | ✓ |
| `parenthesisCurveHorizontalExtentForHeightOfFourSpaces` | `1/2` | fraction = 0.5 | ✓ |
| `parenthesisCurveMaximumHorizontalExtent` | `3/5` | fraction = 0.6 | ✓ |
| `gapOutsideParenthesesAndBrackets` | `1/12` | fraction = 0.0833333 | ✓ |
| `gapInsideParentheses` | `1/8` | fraction = 0.125 | ✓ |
| `verticalProtrusionOfParenthesesBeyondGlyphBounds` | `1/25` | fraction = 0.04 | ✓ |
| `bracketPenWidth` | `1/16` | fraction = 0.0625 | ✓ |
| `bracketHookLength` | `1/5` | fraction = 0.2 | ✓ |
| `gapInsideBrackets` | `1/6` | fraction = 0.166667 | ✓ |
| `verticalProtrusionOfBracketsBeyondGlyphBounds` | `1/10` | fraction = 0.1 | ✓ |
| `bracketStyle` | `kBrackets` | enum | ✓ |
| `reviseOctaveAs1` | `false` | bool | ✓ |
| `endHoldLinesAtPreviousNotehead` | `false` | bool | ✓ |
| `showCautionaryAccidentalsForContradictoryPitchClassesInSameChord` | `true` | bool | ✓ |
| `showCautionaryAccidentalsForContradictoryPitchClassesInPreviousChord` | `true` | bool | ✓ |
| `parenthesiseCautionaryAccidentals` | `false` | bool | ✓ |
| `minimumVerticalGapAboveAndBelowParenthesesOrBrackets` | `1/12` | fraction = 0.0833333 | ✓ |
| `minimumVerticalGapBetweenRowsOnceParenthesesInjected` | `1/12` | fraction = 0.0833333 | ✓ |
| `gapInsideParenthesesForLines` | `1/6` | fraction = 0.166667 | ✓ |
| `gapInsideParenthesesForNonDeferredSuspensionLines` | `1/8` | fraction = 0.125 | ✓ |
| `gapInsideBracketsForLines` | `1/4` | fraction = 0.25 | ✓ |
| `gapInsideBracketsForNonDeferredSuspensionLines` | `1/6` | fraction = 0.166667 | ✓ |
| `verticalProtrusionForParenthesesAroundSingleLine` | `1/3` | fraction = 0.333333 | ✓ |
| `verticalProtrusionForBracketsAroundSingleLine` | `1/3` | fraction = 0.333333 | ✓ |
| `verticalProtrusionForParenthesesAroundMultipleLines` | `2/5` | fraction = 0.4 | ✓ |
| `verticalProtrusionForBracketsAroundMultipleLines` | `2/5` | fraction = 0.4 | ✓ |
| `parenthesisForLineCurveHorizontalExtentForHeightOfSpace` | `1/7` | fraction = 0.142857 | ✓ |
| `parenthesisForLineCurveHorizontalExtentForHeightOfFourSpaces` | `2/5` | fraction = 0.4 | ✓ |
| `allowLinesToTuckInsideParenthesesIndividually` | `false` | bool | ✓ |
| `hookLengthForBracketsAroundLines` | `1/3` | fraction = 0.333333 | ✓ |
| `hookLengthForBracketsAroundNonDeferredSuspensionLines` | `1/5` | fraction = 0.2 | ✓ |
| `bracketStyleAroundLines` | `kBrackets` | enum | ✓ |
| `tastoSoloAppearance` | `kTastoSoloLowerCase` | enum | ✓ |
