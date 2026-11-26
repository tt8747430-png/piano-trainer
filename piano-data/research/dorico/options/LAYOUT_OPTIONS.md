# Dorico Layout Options: defaults per layout type

Layout options control page format, staff size, margins, vertical spacing, casting off, bar numbers, staff labels, condensing and multi-rests. Each **layout** (full score, part, custom) has its own copy.
**Units.** Page geometry is in **points** (1 pt = 1/72 in = 0.3528 mm):
- `pageWidth` × `pageHeight` 594 × 841 = A4. The Brass Band template uses 841 × 1189 = A3.
- Margins of 42 pt ≈ 14.8 mm.
- `defaultSpaceSize` 4.96 pt = **1.75 mm**, the height of one staff space. A 5-line staff is 4 spaces tall, about 7 mm (rastral size).

Other distances are in **staff spaces** unless the name says otherwise.

Source: Dorico 4.0.5 project defaults, decoded from `score.dtn`. Values that differ between layout types are **bold**.

**214 settings × 3 layout types.**

## (general)

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `transpositionType` | **`kScoreInC`** | **`kScoreInC`** | **`kTransposingScore`** | – |
| `playerAcquisitionPolicy` | **`1,1`** | **`0,0`** | **`0,0`** | – |
| `flowAcquisitionPolicy` | **`1,1`** | **`0,0`** | **`1,1`** | – |
| `defaultSpaceSize` | `4.96` | `4.96` | `4.96` | – |
| `showBarRestsInEmptyBars` | `true` | `true` | `true` | – |
| `usesCustomPlayerOrder` | `false` | `false` | `false` | – |
| `customPlayerOrder` | `` | `` | `` | – |
| `pagePairSetEntityID` | **`pageset.fullscore`** | **`pageset.fullscore`** | **`pageset.part`** | – |
| `drawRehearsalMarksBelowBottomStave` | `false` | `false` | `false` | – |
| `hideEmptyStavesPolicy` | `kNever` | `kNever` | `kNever` | – |
| `allowPartialHidingOfGrandStaveInstruments` | `false` | `false` | `false` | – |
| `alwaysVisiblePlayers` | `` | `` | `` | – |
| `flowBreakBehaviour` | **`kStartNewPageForFlows`** | **`kStartNewPageForFlows`** | **`kNoFlowBreaks`** | – |
| `flowHeadingBehaviour` | `kAlwaysInsertHeadings` | `kAlwaysInsertHeadings` | `kAlwaysInsertHeadings` | – |
| `firstPageBehaviour` | `kUseFirstPageForFirstFlowOnly` | `kUseFirstPageForFirstFlowOnly` | `kUseFirstPageForFirstFlowOnly` | – |
| `showMultiRests` | **`false`** | **`false`** | **`true`** | – |
| `flowFirstSystemIndent` | **`0`** | **`0`** | **`6`** | – |
| `showFingeringsInLayout` | `true` | `true` | `true` | – |
| `showSystemDividers` | `false` | `false` | `false` | – |
| `timeSignatureType` | `kNormal` | `kNormal` | `kNormal` | – |
| `timeSignatureGlyphStyle` | `kNormal` | `kNormal` | `kNormal` | – |
| `showMultiRestBarNumberRanges` | `false` | `false` | `false` | – |
| `collapseBarRepeats` | `false` | `false` | `false` | – |
| `barConsolidationBehaviour` | **`kNeverConsolidate`** | **`kNeverConsolidate`** | **`kConsolidateEmptyBarsIntoMultiRests`** | – |
| `layoutInstrumentVisibilityPresetID` | `-1` | `-1` | `-1` | – |
| `showNumberedBarRegions` | `false` | `false` | `false` | – |

## verticalStaveGapOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `staveToStaveGap` | `6` | `6` | `6` | ✓ |
| `staveGroupToStaveGap` | `8` | `8` | `8` | ✓ |
| `staveToStaveGroupGap` | `8` | `8` | `8` | ✓ |
| `staveGroupToStaveGroupGap` | `8` | `8` | `8` | ✓ |
| `bracedStaveToBracedStaveGap` | `6` | `6` | `6` | ✓ |
| `ossiaStaveToStaveGap` | `4` | `4` | `4` | ✓ |
| `interSystemGap` | `10` | `10` | `10` | ✓ |
| `minimumInterStaveGap` | `4` | `4` | `4` | ✓ |
| `minimumInterSystemGap` | `8` | `8` | `8` | ✓ |
| `minimumGapBetweenContentOnAdjacentStaves` | `1` | `1` | `1` | ✓ |
| `minimumGapBetweenContentOnAdjacentSystems` | `2` | `2` | `2` | ✓ |
| `staveScaleForGalleyView` | `125` | `125` | `125` | ✓ |
| `useVerticalGapFineTuning` | `true` | `true` | `true` | ✓ |
| `annotationStaveToStaveGap` | `6` | `6` | `6` | ✓ |
| `notationStaveToTabGap` | `6` | `6` | `6` | ✓ |

## pageSizeAndMarginOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `pageWidth` | `594` | `594` | `594` | ✓ |
| `pageHeight` | `841` | `841` | `841` | ✓ |
| `defaultMusicFrameTopPadding` | `40` | `40` | `40` | ✓ |
| `defaultMusicFrameBottomPadding` | `30` | `30` | `30` | ✓ |
| `margins.type` | `kIdentical` | `kIdentical` | `kIdentical` | – |
| `margins.margins.outer` | `42` | `42` | `42` | – |
| `margins.margins.inner` | `42` | `42` | `42` | – |
| `margins.margins.top` | `42` | `42` | `42` | – |
| `margins.margins.bottom` | `42` | `42` | `42` | – |
| `flowHeadingMargins.headingTopMargin` | `42.52` | `42.52` | `42.52` | ✓ |
| `flowHeadingMargins.headingBottomMargin` | `34.02` | `34.02` | `34.02` | ✓ |

## verticalJustificationOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `justificationThreshold` | `60` | `60` | `60` | ✓ |
| `staveGapJustificationThreshold` | `80` | `80` | `80` | ✓ |
| `ignoreStaveGapJustificationThresholdForFrameWithSingleSystem` | `true` | `true` | `true` | ✓ |

## noteSpacingJustificationOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `finalSystemJustificationThreshold` | `50` | `50` | `50` | ✓ |
| `useFinalSystemJustificationThreshold` | `true` | `true` | `true` | ✓ |
| `considerMinimumDistanceViolations` | `true` | `true` | `true` | ✓ |

## noteSpacingOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `crotchetSize` | `4` | `4` | `4` | ✓ |
| `floorSize` | `8/5` | `8/5` | `8/5` | ✓ |
| `graceNoteSpacingScale` | `70` | `70` | `70` | ✓ |
| `useCustomRatio` | `false` | `false` | `false` | ✓ |
| `customRatio` | `1.414210` | `1.414210` | `1.414210` | ✓ |
| `performOpticalAdjustmentForCrossedBeams` | **`false`** | **`false`** | **`true`** | ✓ |
| `cueNoteSpacingScale` | `70` | `70` | `70` | ✓ |
| `generateSpacingRodsForLyrics` | `true` | `true` | `true` | ✓ |

## castingOffOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `splitOpenBars` | `false` | `false` | `false` | ✓ |
| `fixNumberOfSystems` | `false` | `false` | `false` | ✓ |
| `fixNumberOfBarsPerSystem` | `false` | `false` | `false` | ✓ |
| `scaleFixedNumberOfSystemsByFrameHeight` | `true` | `true` | `true` | ✓ |
| `numberOfSystemsPerFrame` | `10` | `10` | `10` | ✓ |
| `numberOfBarsPerSystem` | `4` | `4` | `4` | ✓ |

## pageNumberOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `appearance` | `kNumber` | `kNumber` | `kNumber` | ✓ |
| `visibility` | `kAlwaysShown` | `kAlwaysShown` | `kAlwaysShown` | ✓ |
| `firstPageNumber` | `1` | `1` | `1` | ✓ |

## playerInstrumentTransitionOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `shouldInsertTransitions` | `true` | `true` | `true` | ✓ |
| `useFullInstrumentNameInChangeLabels` | `false` | `false` | `false` | ✓ |
| `instrumentChangeLabelType` | `kTo` | `kTo` | `kTo` | ✓ |
| `customChangeLabelTextBefore` | `` | `` | `` | ✓ |
| `customChangeLabelTextAfter` | `` | `` | `` | ✓ |
| `showWarningLabels` | `true` | `true` | `true` | ✓ |
| `showInstrumentChangeLabelAtStartOfFlows` | **`false`** | **`false`** | **`true`** | ✓ |
| `showAtChangeLabelsAfterCues` | `false` | `false` | `false` | ✓ |

## staffLabelLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `staffLabelsOnFirstSystem` | **`kFull`** | **`kFull`** | **`kNone`** | ✓ |
| `staffLabelsOnSubsequentSystems` | **`kAbbreviated`** | **`kAbbreviated`** | **`kNone`** | ✓ |
| `showTranspositionInStaffLabels` | `true` | `true` | `true` | ✓ |
| `showTranspositionInAbbreviatedStaffLabels` | `true` | `true` | `true` | ✓ |
| `staffLabelsFullTranspositionAppearance` | `kAfter` | `kAfter` | `kAfter` | ✓ |
| `staffLabelsShortTranspositionAppearance` | `kBefore` | `kBefore` | `kBefore` | – |
| `minimumWidthForStaffLabels` | `0` | `0` | `0` | ✓ |
| `separatorForTranspositionsBefore` | ` ` | ` ` | ` ` | ✓ |
| `playersToShowPlayerName` | `` | `` | `` | ✓ |
| `separateTranspositionWithNewLine` | `false` | `false` | `false` | ✓ |
| `showTranspositionInParentheses` | `false` | `false` | `false` | ✓ |
| `showInstrumentNumberBeforeTransposition` | `false` | `false` | `false` | ✓ |
| `showPlayerGroupLabels` | `false` | `false` | `false` | – |

## barNumberLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `barNumberFrequency` | `kEverySystem` | `kEverySystem` | `kEverySystem` | ✓ |
| `barNumberInterval` | `10` | `10` | `10` | ✓ |
| `barNumberPlacement` | `kAbove` | `kAbove` | `kAbove` | ✓ |
| `playersToShowBarNumbers` | `` | `` | `` | ✓ |
| `showAboveTopStaff` | `true` | `true` | `true` | ✓ |
| `showBelowBottomStaff` | `false` | `false` | `false` | ✓ |
| `barNumberDistanceFromStaff` | `2` | `2` | `2` | ✓ |
| `minimumDistanceFromOtherObjects` | `3/4` | `3/4` | `3/4` | ✓ |
| `barNumberEnclosureType` | `kNone` | `kNone` | `kNone` | ✓ |
| `barNumberHorizonalPosition` | `kCenteredOnBarline` | `kCenteredOnBarline` | `kCenteredOnBarline` | ✓ |
| `alignBarNumbersOnSameSystem` | `false` | `false` | `false` | ✓ |
| `hideBarNumbersWhenCoincidentWithRehearsalMarks` | `true` | `true` | `true` | – |
| `showBarNumbersWhenCoincidentWithRehearsalMarks` | `false` | `false` | `false` | ✓ |
| `barNumberAtStartOfSystemAfterPreamble` | `false` | `false` | `false` | ✓ |
| `hideFirstBarNumberWhenShownEveryBar` | `true` | `true` | `true` | – |
| `showFirstBarNumberWhenShownEveryBar` | `false` | `false` | `false` | ✓ |
| `hideBarNumbersWhenCoincidentWithOutsideStaveTimeSignature` | `true` | `true` | `true` | – |
| `showBarNumbersWhenCoincidentWithOutsideStaveTimeSignature` | `false` | `false` | `false` | ✓ |
| `barNumbersParagraphStyle` | **`paragraph.barnumbers.score`** | **`paragraph.barnumbers.score`** | **`paragraph.barnumbers.part`** | ✓ |
| `showBarNumberAtStartOfSystemForBarSplitOverBreak` | `true` | `true` | `true` | ✓ |
| `showBarNumberAtStartOfCoda` | `false` | `false` | `false` | ✓ |
| `repeatedBarNumberRepresentation` | `kShowAllRepetitions` | `kShowAllRepetitions` | `kShowAllRepetitions` | ✓ |
| `repeatedBarNumberPrefix` | ` (` | ` (` | ` (` | ✓ |
| `repeatedBarNumberSuffix` | `)` | `)` | `)` | ✓ |

## systemObjectVisibility

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `showAboveWoodwinds` | `false` | `false` | `false` | – |
| `showAboveBrass` | `false` | `false` | `false` | – |
| `showAbovePitchedPercussion` | `false` | `false` | `false` | – |
| `showAboveUnpitchedPercussion` | `false` | `false` | `false` | – |
| `showAboveGamelanPercussion` | `false` | `false` | `false` | – |
| `showAboveFrettedInstruments` | `false` | `false` | `false` | – |
| `showAboveKeyboards` | `false` | `false` | `false` | – |
| `showAboveSingers` | `false` | `false` | `false` | – |
| `showAboveStrings` | `false` | `false` | `false` | – |
| `showAboveElectronics` | `false` | `false` | `false` | – |
| `showAboveOrffInstruments` | `false` | `false` | `false` | – |
| `showRepeatEndingLinesBelowBottomStave` | `false` | `false` | `false` | – |
| `showAboveSoloist` | `false` | `false` | `false` | – |

## chordSymbolLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `showChordSymbolsAboveTopStaffOfSystem` | `false` | `false` | `false` | ✓ |

## chordDiagramLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `showFingering` | `false` | `false` | `false` | ✓ |
| `fingerNumberPosition` | `kInsideDot` | `kInsideDot` | `kInsideDot` | ✓ |

## cueLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `showCues` | **`false`** | **`false`** | **`true`** | ✓ |
| `showOctaveLine` | `true` | `true` | `true` | ✓ |

## percussionLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `playersUsingGridPresentation` | `` | `` | `` | ✓ |
| `playersUsingIndividualInstrumentsPresentation` | `` | `` | `` | ✓ |

## systemDividerLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `showSystemDividers` | `false` | `false` | `false` | – |
| `approach` | `kNone` | `kNone` | `kNone` | ✓ |
| `type` | `kDefault` | `kDefault` | `kDefault` | ✓ |
| `minimumPlayersInFlow` | `4` | `4` | `4` | ✓ |

## staffLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `showPreambleForOssiaStaves` | `true` | `true` | `true` | ✓ |
| `showStaffLabelBeforeOssia` | `false` | `false` | `false` | ✓ |
| `useCustomStaffLabelBeforeOssia` | `false` | `false` | `false` | ✓ |
| `customStaffLabelBeforeOssia` | `` | `` | `` | ✓ |
| `useCustomBracketsForStaffLabelBeforeOssia` | `false` | `false` | `false` | ✓ |
| `customOpenBracketForStaffLabelBeforeOssia` | `(` | `(` | `(` | ✓ |
| `customCloseBracketForStaffLabelBeforeOssia` | `)` | `)` | `)` | ✓ |
| `showOssiaStaves` | `true` | `true` | `true` | ✓ |
| `showExtraStavesAcrossEntireSystem` | `false` | `false` | `false` | ✓ |
| `positionSystemObjectsAndBarNumbersOutsideOssias` | `false` | `false` | `false` | ✓ |

## markerLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `showMarkers` | **`true`** | **`true`** | **`false`** | ✓ |
| `verticalPosition` | `kAboveTopStaff` | `kAboveTopStaff` | `kAboveTopStaff` | ✓ |
| `markerStaffAboveFamily` | `kStrings` | `kStrings` | `kStrings` | ✓ |
| `timecodeFrequency` | `kEverySystem` | `kEverySystem` | `kEverySystem` | ✓ |
| `showTimecodeAtStartOfSystem` | `false` | `false` | `false` | ✓ |
| `timecodeAtStartOfSystemSystemRelativePosition` | `kBelow` | `kBelow` | `kBelow` | ✓ |
| `timecodeAtStartOfSystemHorizontalOffset` | `0` | `0` | `0` | ✓ |
| `timecodeAtStartOfSystemVerticalOffset` | `1/2` | `1/2` | `1/2` | ✓ |
| `showTimecodeOnFirstSystem` | `true` | `true` | `true` | ✓ |

## divisiLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `showGroupNames` | **`true`** | **`true`** | **`false`** | ✓ |
| `showSectionNumbers` | **`true`** | **`true`** | **`false`** | – |
| `showSectionNamesOnInitialSystemOfDivisi` | **`true`** | **`true`** | **`false`** | ✓ |
| `showSectionNamesOnSubsequentSystemsOfDivisi` | **`true`** | **`true`** | **`false`** | ✓ |
| `showDivisiLabels` | `true` | `true` | `true` | ✓ |
| `divisiStaveGapType` | `kStave` | `kStave` | `kStave` | ✓ |

## repeatMarkerLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `drawRepeatMarkerJumpsAndFineBelowStave` | `false` | `false` | `false` | – |
| `wordWrapJumpQualificationsByDefault` | `false` | `false` | `false` | – |
| `staveRelativePositioning` | `kAlwaysAbove` | `kAlwaysAbove` | `kAlwaysAbove` | – |

## tacetLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `showTacets` | `true` | `true` | `true` | – |
| `tacetString` | `Tacet` | `Tacet` | `Tacet` | – |
| `marginAboveTacet` | `14.17` | `14.17` | `14.17` | – |
| `marginBelowTacet` | `0` | `0` | `0` | – |

## textTokenLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `suppressPageNumberAboveFlowHeadings` | `true` | `true` | `true` | – |
| `suppressFlowPageNumberAboveFlowHeadings` | `true` | `true` | `true` | – |
| `suppressFlowTitleAboveFlowHeadings` | `true` | `true` | `true` | – |

## frettedInstrumentLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `playersUsingTabPresentation` | `` | `` | `` | ✓ |
| `playersUsingNotationAndTabPresentation` | `` | `` | `` | ✓ |
| `playersShowingRhythmsOnTab` | `` | `` | `` | ✓ |
| `useFrettedInstrumentTranspositionForNotation` | `false` | `false` | `false` | – |
| `playersUsingFrettedInstrumentTranspositionForNotation` | `` | `` | `` | ✓ |
| `playersUsingFrettedInstrumentTranspositionForChordSymbols` | `` | `` | `` | ✓ |

## condensingLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `enableCondensing` | `false` | `false` | `false` | ✓ |
| `groupsToExcludeFromCondensing` | `` | `` | `` | ✓ |
| `userDefinedCondensableGroups` | `` | `` | `` | ✓ |
| `sectionPlayerPolicy` | `kDoNotCondense` | `kDoNotCondense` | `kDoNotCondense` | ✓ |
| `excludeViolinsWhenCondensingAdjacentSectionPlayers` | `false` | `false` | `false` | ✓ |

## harpPedalLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `showHarpPedalSettings` | **`false`** | **`false`** | **`true`** | ✓ |
| `harpPedalSettingsAppearance` | `kNoteNames` | `kNoteNames` | `kNoteNames` | ✓ |

## bracketingLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `bracketPlacingApproach` | `kOrchestral` | `kOrchestral` | `kOrchestral` | ✓ |
| `useSubBrackets` | `true` | `true` | `true` | ✓ |
| `useBracesForSubBrackets` | `false` | `false` | `false` | ✓ |
| `showBracketForSingleStaff` | `false` | `false` | `false` | ✓ |
| `drawBraceOnSingleStave` | `true` | `true` | `true` | ✓ |
| `drawSubBracketOnSingleStave` | `true` | `true` | `true` | ✓ |

## chordsUsedFrameLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `showChordsUsedFrameAtStart` | `false` | `false` | `false` | ✓ |
| `frettedInstrumentTuningToShow` | `frettedinstrumentdata.standard-guitar-tuning-6-strings-22-frets` | `frettedinstrumentdata.standard-guitar-tuning-6-strings-22-frets` | `frettedinstrumentdata.standard-guitar-tuning-6-strings-22-frets` | ✓ |
| `maxNumberOfDiagramsPerRow` | `8` | `8` | `8` | ✓ |
| `sizeRatio` | `1.300000` | `1.300000` | `1.300000` | ✓ |
| `horizontalSpacingBetweenDiagrams` | `35` | `35` | `35` | ✓ |
| `verticalSpacingBetweenDiagrams` | `30` | `30` | `30` | ✓ |
| `spaceAboveDiagrams` | `10` | `10` | `10` | ✓ |
| `spaceBelowDiagrams` | `60` | `60` | `60` | ✓ |
| `showFingeringsInChordsUsedDiagrams` | `false` | `false` | `false` | ✓ |
| `chordSymbolsVisibility` | `kShowAboveOriginalChordSymbol` | `kShowAboveOriginalChordSymbol` | `kShowAboveOriginalChordSymbol` | ✓ |

## manuscriptStaffLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `fillFinalFrameWithManuscriptStaves` | `false` | `false` | `false` | – |
| `numStaveLinesInManuscriptStaves` | `5` | `5` | `5` | ✓ |
| `mirrorStavesInLayout` | `true` | `true` | `true` | ✓ |
| `showPreamble` | `true` | `true` | `true` | ✓ |

## figuredBassLayoutOptions

| Option | FullScore | CustomScore | Part | in D6 |
|---|---|---|---|---|
| `playersToShowFiguredBass` | `` | `` | `` | ✓ |
| `staveRelativePosition` | `kBelow` | `kBelow` | `kBelow` | ✓ |
