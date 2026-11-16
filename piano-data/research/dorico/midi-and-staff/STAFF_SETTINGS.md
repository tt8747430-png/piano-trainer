# Dorico 6 staff settings: every staff-related setting, by scope

Values are **Dorico 6.2.31 defaults**, decoded from a project saved by Dorico 6.2.31 on this Mac (file format 1.1452). Distances are in staff spaces, page geometry in points.
Dorico has **no single "staff settings" page**. Staff behaviour is split across five scopes, and an editor needs all five:

| Scope | Where in Dorico | What it controls |
|---|---|---|
| 1. Instrument definition | Library › Instruments (and Setup › change instrument) | number of staves, lines, brace, clefs per staff, transposition, range |
| 2. Layout Options (per layout) | Setup › Layout Options ⌘⇧L › Page Setup / Staves and Systems / Vertical Spacing / Players | staff size (space size), staff labels, hide empty staves, vertical gaps, brackets, system indent, transposing vs concert |
| 3. Engraving Options (project) | Engrave › Engraving Options ⌘⇧E › Staves, Brackets and Braces, Clefs, Staff Labels… | line thickness, ledger lines, bracket/brace drawing, clef-change size, staff-label gaps |
| 4. Notation Options (per flow) | Write › Notation Options ⌘⇧N | clef/key repeated in each system's preamble, condensing rules, transposition spelling |
| 5. Per-staff / per-item (Write & Engrave) | Properties panel, staff context menu, Engrave › Staff Spacing | extra staves, ossia, staff size for one staff, staff visibility, cross-staff notes, manual staff spacing |

## 1. Instrument definition: piano, from the Dorico 6 project

```
instrument.keyboard.piano
  numStaves 2
  staveDefinition: numStaveLines 5 · barlineSpan 1 · useBrace true · isVocalStave false · defaultContextualStemDirectionIsUp false
  clefs: staff 1 clef.treble · staff 2 clef.bass
  standardRange A0-C8 · advancedRange A0-C8
```
Other staff-related instrument fields (from `instruments.xml`, 624 instruments): `numStaves` 1–3 (organ 3), `numStaveLines` (1 for unpitched percussion, 5 normal, 6 for tab), `useBrace`, `barlineSpan`, `bracketSpan`, `clefs.idForTransposingLayouts` / `idForNonTransposingLayouts`, `pitchedInstrumentData.transposition`, `isVocalStave`. All of them are in `../library-data/instruments.json`.

## 2. Layout Options: staff-related (132)

The two layouts of the Dorico 6 piano project (full score A3 at 4.535 pt space; part A4 at 4.96 pt). **Bold** = differs.

| Option | Full score | Part |
|---|---|---|
| `transpositionType` | **`kScoreInC`** | **`kTransposingScore`** |
| `defaultSpaceSize` | **`4.53543`** | **`4.96`** |
| `drawRehearsalMarksBelowBottomStave` | `false` | `false` |
| `hideEmptyStavesPolicy` | `kNever` | `kNever` |
| `allowPartialHidingOfGrandStaveInstruments` | `false` | `false` |
| `flowFirstSystemIndent` | **`0`** | **`6`** |
| `showSystemDividers` | `false` | `false` |
| `timeSignatureType` | `kNormal` | `kNormal` |
| `timeSignatureGlyphStyle` | `kNormal` | `kNormal` |
| `userDefinedLargeTimeSignatures` | `steamVariantList:list: ` | `steamVariantList:list: ` |
| `largeTimeSignatureBehaviour` | `kAutomatic` | `kAutomatic` |
| `verticalStaveGapOptions.staveToStaveGap` | `6` | `6` |
| `verticalStaveGapOptions.staveGroupToStaveGap` | `8` | `8` |
| `verticalStaveGapOptions.staveToStaveGroupGap` | `8` | `8` |
| `verticalStaveGapOptions.staveGroupToStaveGroupGap` | `8` | `8` |
| `verticalStaveGapOptions.bracedStaveToBracedStaveGap` | `6` | `6` |
| `verticalStaveGapOptions.bracedStaveToUnbracedStaveGap` | `6` | `6` |
| `verticalStaveGapOptions.ossiaStaveToStaveGap` | `4` | `4` |
| `verticalStaveGapOptions.interSystemGap` | `10` | `10` |
| `verticalStaveGapOptions.minimumInterStaveGap` | `4` | `4` |
| `verticalStaveGapOptions.minimumInterSystemGap` | `8` | `8` |
| `verticalStaveGapOptions.minimumGapBetweenContentOnAdjacentStaves` | `1` | `1` |
| `verticalStaveGapOptions.minimumGapBetweenContentOnAdjacentSystems` | `2` | `2` |
| `verticalStaveGapOptions.staveScaleForGalleyView` | `125` | `125` |
| `verticalStaveGapOptions.useVerticalGapFineTuning` | `true` | `true` |
| `verticalStaveGapOptions.annotationStaveToStaveGap` | `6` | `6` |
| `verticalStaveGapOptions.notationStaveToTabGap` | `6` | `6` |
| `verticalStaveGapOptions.verticalViewInterSystemGap` | `14` | `14` |
| `verticalStaveGapOptions.useGlobalSpaceSizeForGapCalculation` | `false` | `false` |
| `verticalJustificationOptions.staveGapJustificationThreshold` | `80` | `80` |
| `verticalJustificationOptions.ignoreStaveGapJustificationThresholdForFrameWithSingleSystem` | `true` | `true` |
| `playerInstrumentTransitionOptions.useFullInstrumentNameInChangeLabels` | `false` | `false` |
| `playerInstrumentTransitionOptions.instrumentChangeLabelType` | `kTo` | `kTo` |
| `playerInstrumentTransitionOptions.customChangeLabelTextBefore` | `` | `` |
| `playerInstrumentTransitionOptions.customChangeLabelTextAfter` | `` | `` |
| `playerInstrumentTransitionOptions.showWarningLabels` | **`false`** | **`true`** |
| `playerInstrumentTransitionOptions.showInstrumentChangeLabelAtStartOfFlows` | **`false`** | **`true`** |
| `playerInstrumentTransitionOptions.showAtChangeLabelsAfterCues` | `true` | `true` |
| `playerInstrumentTransitionOptions.useUnsnappedPositionsForWarningLabels` | `true` | `true` |
| `playerInstrumentTransitionOptions.useUnsnappedPositionsForChangeLabels` | `false` | `false` |
| `playerInstrumentTransitionOptions.labelHideType` | `kWarning` | `kWarning` |
| `playerInstrumentTransitionOptions.showTranspositionOnlyInLabelWhenInstrumentsMatch` | `false` | `false` |
| `staffLabelLayoutOptions.staffLabelsOnFirstSystem` | **`kFull`** | **`kNone`** |
| `staffLabelLayoutOptions.staffLabelsOnSubsequentSystems` | **`kAbbreviated`** | **`kNone`** |
| `staffLabelLayoutOptions.showTranspositionInStaffLabels` | `true` | `true` |
| `staffLabelLayoutOptions.showTranspositionInAbbreviatedStaffLabels` | `true` | `true` |
| `staffLabelLayoutOptions.staffLabelsFullTranspositionAppearance` | `kAfter` | `kAfter` |
| `staffLabelLayoutOptions.staffLabelsShortTranspositionAppearance` | `kBefore` | `kBefore` |
| `staffLabelLayoutOptions.minimumWidthForStaffLabels` | `0` | `0` |
| `staffLabelLayoutOptions.separatorForTranspositionsBefore` | ` ` | ` ` |
| `staffLabelLayoutOptions.playersToShowPlayerName` | `` | `` |
| `staffLabelLayoutOptions.separateTranspositionWithNewLine` | `false` | `false` |
| `staffLabelLayoutOptions.showTranspositionInParentheses` | `false` | `false` |
| `staffLabelLayoutOptions.showInstrumentNumberBeforeTransposition` | `false` | `false` |
| `staffLabelLayoutOptions.showPlayerGroupLabels` | **`true`** | **`false`** |
| `staffLabelLayoutOptions.playerGroupLabelVisibility` | **`kWhenStaffLabelsVisible`** | **`kNever`** |
| `staffLabelLayoutOptions.showPlayerNamesOnFirstSystemOnly` | `false` | `false` |
| `staffLabelLayoutOptions.showStaffLabelsForFirstFlowOnly` | `false` | `false` |
| `staffLabelLayoutOptions.useFlowFirstSystemIndentWhenStaffLabelsShown` | `false` | `false` |
| `staffLabelLayoutOptions.staffLabelShowsFirstSoundingInstrumentOnSystem` | `true` | `true` |
| `staffLabelLayoutOptions.considerStaffLabelWidthWhenDeterminingSystemWidth` | `true` | `true` |
| `barNumberLayoutOptions.showAboveTopStaff` | `true` | `true` |
| `barNumberLayoutOptions.showBelowBottomStaff` | `false` | `false` |
| `barNumberLayoutOptions.barNumberDistanceFromStaff` | `2` | `2` |
| `barNumberLayoutOptions.barNumberAtStartOfSystemAfterPreamble` | `false` | `false` |
| `barNumberLayoutOptions.hideBarNumbersWhenCoincidentWithOutsideStaveTimeSignature` | `true` | `true` |
| `barNumberLayoutOptions.showBarNumbersWhenCoincidentWithOutsideStaveTimeSignature` | `false` | `false` |
| `barNumberLayoutOptions.addBarNumbersToStaveProfile` | `true` | `true` |
| `barNumberLayoutOptions.showBarNumbersAcrossSystemOnCutawayStaves` | `false` | `false` |
| `barNumberLayoutOptions.centreBarNumberOnSystemicBarline` | `false` | `false` |
| `systemObjectVisibility.showRepeatEndingLinesBelowBottomStave` | `false` | `false` |
| `systemObjectVisibility.showTimeSignaturesAbovePlayers` | `` | `` |
| `chordSymbolLayoutOptions.showChordSymbolsAboveTopStaffOfSystem` | `false` | `false` |
| `chordSymbolLayoutOptions.positionChordSymbolsBetweenStavesOfGrandStaveInstruments` | `false` | `false` |
| `percussionLayoutOptions.showPercussionLegendsOnFiveLineStaves` | `true` | `true` |
| `systemDividerLayoutOptions.showSystemDividers` | `false` | `false` |
| `systemDividerLayoutOptions.approach` | `kNone` | `kNone` |
| `systemDividerLayoutOptions.type` | `kDefault` | `kDefault` |
| `systemDividerLayoutOptions.minimumPlayersInFlow` | `4` | `4` |
| `systemDividerLayoutOptions.minimumStavesInSystem` | `4` | `4` |
| `staffLayoutOptions.showPreambleForOssiaStaves` | `true` | `true` |
| `staffLayoutOptions.showStaffLabelBeforeOssia` | `false` | `false` |
| `staffLayoutOptions.useCustomStaffLabelBeforeOssia` | `false` | `false` |
| `staffLayoutOptions.customStaffLabelBeforeOssia` | `` | `` |
| `staffLayoutOptions.useCustomBracketsForStaffLabelBeforeOssia` | `false` | `false` |
| `staffLayoutOptions.customOpenBracketForStaffLabelBeforeOssia` | `(` | `(` |
| `staffLayoutOptions.customCloseBracketForStaffLabelBeforeOssia` | `)` | `)` |
| `staffLayoutOptions.showOssiaStaves` | `true` | `true` |
| `staffLayoutOptions.showExtraStavesAcrossEntireSystem` | `false` | `false` |
| `staffLayoutOptions.positionSystemObjectsAndBarNumbersOutsideOssias` | `false` | `false` |
| `staffLayoutOptions.showSystemObjectsAndBarNumbersOnCutawayStaves` | `false` | `false` |
| `markerLayoutOptions.markerStaffAboveFamily` | `kStrings` | `kStrings` |
| `divisiLayoutOptions.showDivisiLabels` | `true` | `true` |
| `divisiLayoutOptions.snapDivisiUnisonLabels` | `true` | `true` |
| `divisiLayoutOptions.divisiStaveGapType` | `kStave` | `kStave` |
| `repeatMarkerLayoutOptions.drawRepeatMarkerJumpsAndFineBelowStave` | `false` | `false` |
| `repeatMarkerLayoutOptions.staveRelativePositioning` | `kAlwaysAbove` | `kAlwaysAbove` |
| `frettedInstrumentLayoutOptions.useFrettedInstrumentTranspositionForNotation` | `false` | `false` |
| `frettedInstrumentLayoutOptions.playersUsingFrettedInstrumentTranspositionForNotation` | `` | `` |
| `frettedInstrumentLayoutOptions.playersUsingFrettedInstrumentTranspositionForChordSymbols` | `` | `` |
| `condensingLayoutOptions.enableCondensing` | `false` | `false` |
| `condensingLayoutOptions.groupsToExcludeFromCondensing` | `` | `` |
| `condensingLayoutOptions.userDefinedCondensableGroups` | `` | `` |
| `condensingLayoutOptions.sectionPlayerPolicy` | `kDoNotCondense` | `kDoNotCondense` |
| `condensingLayoutOptions.excludeViolinsWhenCondensingAdjacentSectionPlayers` | `false` | `false` |
| `condensingLayoutOptions.allowInstrumentChangesOnCondensedStaves` | `true` | `true` |
| `bracketingLayoutOptions.bracketPlacingApproach` | `kOrchestral` | `kOrchestral` |
| `bracketingLayoutOptions.useSubBrackets` | `true` | `true` |
| `bracketingLayoutOptions.useBracesForSubBrackets` | `false` | `false` |
| `bracketingLayoutOptions.showBracketForSingleStaff` | `false` | `false` |
| `bracketingLayoutOptions.drawBraceOnSingleStave` | `true` | `true` |
| `bracketingLayoutOptions.drawSubBracketOnSingleStave` | `true` | `true` |
| `bracketingLayoutOptions.barlineJoinsFollowBrackets` | `true` | `true` |
| `bracketingLayoutOptions.useSingleSubBracketForViolins1And2` | `true` | `true` |
| `bracketingLayoutOptions.drawSubBracketIfSecondaryGroupMatchesPrimaryGroup` | `true` | `true` |
| `bracketingLayoutOptions.subBracketingApproachForViolins1And2` | `kJoinWithSingleSubBracket` | `kJoinWithSingleSubBracket` |
| `bracketingLayoutOptions.drawSubBracketOnSingleStaveDivisi` | `false` | `false` |
| `manuscriptStaffLayoutOptions.fillFinalFrameWithManuscriptStaves` | `false` | `false` |
| `manuscriptStaffLayoutOptions.manuscriptStaveFillType` | `kNone` | `kNone` |
| `manuscriptStaffLayoutOptions.numStaveLinesInManuscriptStaves` | `5` | `5` |
| `manuscriptStaffLayoutOptions.mirrorStavesInLayout` | `true` | `true` |
| `manuscriptStaffLayoutOptions.showPreamble` | `true` | `true` |
| `figuredBassLayoutOptions.staveRelativePosition` | `kBelow` | `kBelow` |
| `cutawayLayoutOptions.cutawayGrandStaffInstrumentStavesIndividually` | `false` | `false` |
| `barlineLayoutOptions.cautionaryClefAndSignaturesAtEndRepeatBarline` | `kHide` | `kHide` |
| `barlineLayoutOptions.cautionaryClefAndSignaturesAtRepeatJump` | `kHide` | `kHide` |
| `barlineLayoutOptions.restorativeClefAndSignaturesAfterEndRepeatBarline` | `kHide` | `kHide` |
| `barlineLayoutOptions.restorativeClefAndSignaturesAfterRepeatJump` | `kHide` | `kHide` |
| `barlineLayoutOptions.parenthesiseCautionaryClefAndSignaturesAtEndRepeatBarline` | `false` | `false` |
| `barlineLayoutOptions.parenthesiseCautionaryClefAndSignaturesAtRepeatJump` | `false` | `false` |
| `barlineLayoutOptions.parenthesiseRestorativeClefAndSignaturesAfterEndRepeatBarline` | `false` | `false` |
| `barlineLayoutOptions.parenthesiseRestorativeClefAndSignaturesAfterRepeatJump` | `false` | `false` |

## 3. Engraving Options: staff-related (393 in 52 groups)

### dynamicsOptions

| Option | Default |
|---|---|
| `minimumDistanceBelowStaveForTextBasedDynamics` | `3` |
| `minimumDistanceAboveStaveForTextBasedDynamics` | `5/2` |
| `minimumDistanceBelowStaveForHairpins` | `5/2` |
| `minimumDistanceAboveStaveForHairpins` | `3` |
| `additionalLeewayForInterStaveDynamics` | `0` |

### bracketingOptions

| Option | Default |
|---|---|
| `bracketPlacingApproach` | `kOrchestral` |
| `useSubBrackets` | `true` |
| `useBracesForSubBrackets` | `false` |
| `bracketWidth` | `1/2` |
| `bracketEndType` | `kWing` |
| `subBracketWidth` | `1` |
| `subBracketLineThickness` | `1/8` |
| `bracketDistanceFromSystemicBarline` | `1/2` |
| `bracedSubBracketDistanceFromBracket` | `3/8` |
| `showBracketForSingleStaff` | `false` |
| `subBracketMeetsSystemicBarline` | `true` |
| `bracketAdditionalProtrusionBeyondStaff` | `1/4` |
| `braceDistanceFromSystemicBarline` | `9/20` |
| `drawBraceOnSingleStave` | `true` |
| `subSubBracketWidth` | `2/3` |
| `subSubBracketLineThickness` | `1/8` |
| `subSubBracketAppearance` | `kReachSubBracket` |
| `drawSubBracketOnSingleStave` | `true` |
| `maxHeightForSmallBrace` | `8` |
| `maxHeightForRegularBrace` | `16` |
| `maxHeightForLargeBrace` | `24` |
| `maxHeightForLargerBrace` | `32` |
| `useFlatBraceBeyondMaxHeightForLargerBrace` | `true` |

### ledgerLineOptions

| Option | Default |
|---|---|
| `ledgerLineProtrusionForNotes` | `2/5` |
| `ledgerLineProtrusionWhenRightOfAccidental` | `1/6` |
| `ledgerLineInnerProtrusionInRunOfShortBeamedNotes` | `1/5` |
| `ledgerLineProtrusionForRests` | `1/4` |
| `ledgerLineThickness` | `1/6` |
| `shortenLedgerLinesForAccidentals` | `true` |
| `shortenLedgerLinesInRunsOfShortBeamedNotes` | `true` |

### tieOptions

| Option | Default |
|---|---|
| `verticalOffsetForTiesBetweenNoteheadsOnStaveLine` | `1/4` |
| `verticalOffsetForTiesOutsideNoteheadEdgeOnStaveLine` | `4/5` |
| `verticalOffsetForTiesBetweenNotesBeforeRhythmDotsOnStaveLine` | `3/4` |
| `verticalOffsetForTiesOutsideNoteheadEdgeBeforeRhythmDotsOnStaveLine` | `1/3` |
| `minimumGapBetweenTiesSharingStavePosition` | `1/2` |
| `adjustTieCurvatureToAvoidStaveLines` | `true` |
| `minimumGapBetweenTieMidPointAndStaveLine` | `1/4` |
| `maxPercentageOfTieHeightWhenReducingToAvoidStaveLines` | `60` |
| `offsetFromStaveLineWhenUnderDuress` | `1/8` |
| `gapBeforeIntraStaveFingerings` | `1/6` |
| `gapBeforeAndAfterNoteheadParenthesesAndBrackets` | `1/10` |

### timeSignatureOptions

| Option | Default |
|---|---|
| `openTimeSignatureAppearance` | `kEmpty` |
| `timeSignatureNumeratorAppearance` | `kNumber` |
| `timeSignatureDenominatorAppearance` | `kNumber` |
| `timeSignatureInterchangeableSeparator` | `kParentheses` |
| `timeSignatureDrawDenominatorAsBeatLength` | `true` |
| `timeSignatureDrawClosingParenthesis` | `false` |
| `gapBetweenInterchangeableTimeSigAndSeparator` | `1/4` |
| `gapBetweenInterchangeableTimeSigs` | `1/4` |
| `gapBetweenTimeSigAndBracket` | `-1/10` |
| `gapBetweenTimeSigAndParentheses` | `1/10` |
| `gapBetweenAlternatingTimeSigAndSeparator` | `1/4` |
| `scaleFactorOfLargeTimeSignatureForOneStave` | `5/4` |
| `scaleFactorOfLargeTimeSignatureForTwoOrMoreStaves` | `4` |
| `scaleFactorOfLargeTimeSignatureForFourOrMoreStaves` | `10` |
| `scaleFactorOfAboveStaveTimeSignature` | `2` |
| `gapBetweenOutsideStaveTimeSignatureAndStave` | `1/2` |
| `gapBetweenOutsideStaveTimeSignatureAndOtherObjects` | `1/4` |
| `leftAlignMidSystemOutsideStaveTimeSignature` | `false` |
| `moveRehearsalMarkAndTempoToTheRightOfOutsideStaveTimeSignature` | `true` |
| `scaleFactorOfNoteDenominatorOfOutsideStaveTimeSignature` | `1/2` |
| `largeTimeSignatureVerticalAlignment` | `kCentre` |
| `largeTimeSignatureTreatPercussionsAndKeysAsSingleBracket` | `false` |
| `gapBetweenNumeratorAndDenominatorForNormalTimeSignatures` | `0` |
| `gapBetweenNumeratorAndDenominatorForLargeTimeSignatures` | `0` |
| `gapBetweenNumeratorAndDenominatorForAboveStaveTimeSignatures` | `0` |
| `timeSignatureBackgroundErasure` | `false` |
| `timeSignatureBackgroundErasureWidth` | `1/4` |
| `combineAggregateTimeSignaturesWithCommonDenominators` | `false` |
| `outsideStaveTimeSignaturePositionType` | `kLeftOfTempoAndRehearsalMarks` |

### ottavaLineOptions

| Option | Default |
|---|---|
| `ottavaLineLabelType` | `kNumberWithTextSuffix` |
| `ottavaLineLabelTypeForContinuation` | `kNumberOnly` |
| `showContinuationLabelInParentheses` | `true` |
| `spaceBetweenLabelAndExtensionLine` | `1/8` |
| `tuckExtensionAboveOrBelowLabelWherePossible` | `true` |

### tupletOptions

| Option | Default |
|---|---|
| `tupletBracketLineWidth` | `1/8` |
| `tupletBracketVisibilityRule` | `kAutomatic` |
| `tupletBracketCanBeAngled` | `true` |
| `tupletBracketForceHorizontal` | `false` |
| `tupletBracketMaximumAngle` | `7/4` |
| `drawTupletBracketOutsideText` | `false` |
| `tupletBracketGapFromText` | `1/4` |
| `tupletBracketLeftDelta` | `1/4` |
| `tupletBracketRightDelta` | `1/4` |

### staveOptions

| Option | Default |
|---|---|
| `staveLineThickness` | `1/8` |
| `ossiaScaleFactor` | `2/3` |
| `midBarOssiaStartStaveLinePadding` | `1` |
| `midBarOssiaEndStaveLinePadding` | `0` |
| `tabStaveLineSeparationScaleFactor` | `3/2` |

### noteOptions

| Option | Default |
|---|---|
| `gapInsideParenthesisedNoteheadsOnTabStaves` | `1/12` |
| `additionalGapBetweenLedgerLineAndParenthesisMiddle` | `-1/16` |
| `additionalGapBetweenLedgerLineAndParenthesisExtremity` | `1/8` |
| `gapInsideBracketedNoteheads` | `0` |
| `additionalGapBetweenBracketExtremityAndAlienNoteheadMiddle` | `1/8` |
| `additionalGapBetweenStemAndBracket` | `1/8` |
| `additionalGapBetweenRhythmDotAndBracketMiddle` | `-1/12` |
| `additionalGapBetweenRhythmDotAndBracketExtremity` | `1/12` |
| `bracketVerticalExtremityLength` | `1/8` |
| `additionalGapBetweenNoteFlagAndBracket` | `1/8` |
| `additionalGapBetweenLedgerLineAndBracketMiddle` | `-1/16` |
| `additionalGapBetweenLedgerLineAndBracketExtremity` | `1/8` |
| `additionalGapBetweenNeighbouringBracketAndOther` | `1/8` |
| `additionalGapBetweenNeighbouringBracketAndParenthesisAtExtremity` | `-1/6` |
| `minimumGapOnFarSideOfBracket` | `1/15` |
| `minimumGapAboveAndBelowBracket` | `1/8` |
| `minimumGapAboveAndBelowNeighbouringBracketAndOther` | `0` |
| `additionalGapInsideParenthesisedNoteheadsOnLedgerLines` | `1/5` |
| `joinNeighbouringNotesWithSingleParenthesisOnTabStave` | `true` |
| `useCompositesForParenthesesSpanningSingleStavePosition` | `true` |
| `useCompositesForParenthesesSpanningSingleStavePositionOnTabStaves` | `false` |
| `parenthesisMinimumDistanceFromStaveLines` | `1/12` |
| `bracketMinimumDistanceFromStaveLines` | `1/7` |
| `parenthesisCurveMiddleThicknessOnTabStave` | `1/6` |
| `parenthesisCurveEndThicknessOnTabStave` | `1/8` |
| `protrusionBeyondTopOrBottomOfNoteheadForDrawnBrackets` | `1/8` |
| `bracketThickness` | `1/10` |
| `bracketHookLength` | `1/3` |
| `bracketThicknessOnTabStave` | `1/6` |
| `bracketHookLengthOnTabStave` | `1/2` |
| `hideLedgerLinesInSlashRegions` | `true` |

### articulationOptions

| Option | Default |
|---|---|
| `largeGlyphsAllowedInsideStave` | `false` |
| `staccatoAllowedInStaff` | `true` |
| `tenutoAllowedInStaff` | `true` |
| `staccatissimoAllowedInStaff` | `false` |
| `accentAllowedInStaff` | `true` |
| `marcatoAllowedInStaff` | `false` |
| `stressAllowedInStaff` | `false` |
| `unstressAllowedInStaff` | `false` |
| `staccatissimoAllowedOnNextStaffLine` | `true` |

### spacingGapOptions

| Option | Default |
|---|---|
| `gapAfterInitialClef` | `1` |
| `gapAfterClefChange` | `1/2` |
| `gapAfterKeySignature` | `1` |
| `gapAfterTimeSignature` | `1/2` |
| `gapAfterLeftParenthesisForClef` | `1/4` |
| `gapAfterLeftParenthesisForKeySignature` | `1/4` |
| `gapAfterLeftParenthesisForTimeSignature` | `1/4` |
| `gapBeforeRightParenthesisAfterClef` | `1/4` |
| `gapBeforeRightParenthesisAfterKeySignature` | `1/4` |
| `gapBeforeRightParenthesisAfterTimeSignature` | `1/4` |
| `gapAfterCueClefChange` | `1/2` |
| `gapAfterBarlineAndBeforeTimeSignature` | `1/4` |

### clefOptions

| Option | Default |
|---|---|
| `clefChangeScale` | `2/3` |
| `showTabClefAfterFirstSystem` | `true` |

### stemOptions

| Option | Default |
|---|---|
| `gapBetweenOutsideOfStaveAndTabStem` | `1/2` |
| `minimumDistanceBetweenOutsideOfStaveAndEndOfTabStem` | `3` |
| `defaultDirectionForStemsOnTabStaves` | `kUp` |
| `alignStemsWithEdgesOfFretNumbersForLozengesOnTabStaves` | `true` |
| `alignStemsWthEdgesOfSlashNoteheadsOnTabStaves` | `true` |

### slurOptions

| Option | Default |
|---|---|
| `slurEndStaveLineMinDistance` | `1/4` |
| `slurRouterMaximumAngleCrossStave` | `50` |
| `enableCollisonAvoidanceForCrossStaveSlur` | `true` |
| `minimumVGapToStaveLineAtSystemBreak` | `1/2` |
| `findCrossStaveSlursCrossingPoint` | `true` |
| `specialGraceNoteSlurOptions.vOffsetAtRightHandEndNoteOnStaveLineSingleVoice` | `0` |

### accidentalStackerCalcOptions

| Option | Default |
|---|---|
| `allowAccidentalsToTuckAmongstLedgerLines` | `false` |
| `marginAtRightOfAccidentalGroupForUnshortenedLedgerLines` | `1/2` |
| `marginAtRightOfAccidentalGroupWithRightmostFlatForUnshortenedLedgerLines` | `1/8` |
| `marginAtRightOfAccidentalGroupWithRightmostFlatForUnshortenedLedgerLinesOnLine` | `2/3` |
| `applyAdditionalSpaceAroundSharpsNearUnshortenedLedgerLines` | `true` |

### staffLabelOptions

| Option | Default |
|---|---|
| `staffLabelRightPadding` | `3` |
| `unbracketedStaffLabelRightPadding` | `2` |
| `staffGroupLabelRightPadding` | `3` |
| `unbracketedStaffGroupLabelRightPadding` | `2` |
| `ossiaStaffLabelRightPadding` | `3` |
| `bracedOssiaStaffLabelRightPadding` | `4` |
| `soloPlayerInstrumentSuffixType` | `kArabic` |
| `sectionPlayerInstrumentSuffixType` | `kRoman` |
| `vocalStaffLabelsCapitalised` | `false` |
| `groupSingleStaveInstrumentLabels` | `false` |
| `considerInstrumentTranspositionWhenNumbering` | `true` |
| `showVoiceAllocationOnCondensedStaves` | `true` |
| `listCondensedPlayersVertically` | `false` |
| `sectionPlayerUnisLabel` | `unis.` |
| `useDivisiGroupNamesForCondensedStaves` | `false` |
| `alignGroupLabelsWithFirstStaffInGroup` | `false` |
| `groupSingleStaveInstrumentLabelsForSectionPlayers` | `false` |
| `showBracketForPlayerGroupLabels` | `true` |
| `playerGroupBracketPenThickness` | `1/8` |
| `playerGroupBracketHookLength` | `5/4` |
| `horizontalGapBetweenPlayerGroupAndStaffLabels` | `1/8` |
| `horizontalGapBetweenPlayerGroupAndSystemicBarline` | `5/2` |
| `horizontalGapBetweenPlayerGroupBracketsAndLabels` | `3/4` |
| `positionPlayerGroupLabelsOnBrackets` | `true` |
| `playerGroupLabelsErasureExtentsWhenOnBracket` | `1/2` |
| `addPeriodAfterShortName` | `false` |
| `rightPaddingBetweenNormalAndInnerLabels` | `1` |
| `smartenQuotesInStaffLabels` | `true` |
| `scaleStaffLabelsWithStaveScalePercentageForLayout` | `false` |

### keySignatureOptions

| Option | Default |
|---|---|
| `horizontalGapBetweenAccidentalsInKeySignatures` | `1/4` |
| `horizontalGapBetweenCancellationNaturalsInKeySignatures` | `2/5` |
| `keySignatureCancellationBehaviour` | `kContemporary` |
| `keySignatureBackgroundErasure` | `false` |
| `keySignatureBackgroundErasureWidth` | `1/4` |

### glissandoLineOptions

| Option | Default |
|---|---|
| `verticalOffsetFromCentreOfNoteOnStaveLine` | `1/4` |
| `verticalOffsetFromCentreOfNoteOnLedgerLine` | `1/3` |
| `forcedVerticalSpanOfGlissLinesBetweenNotesAtSameStavePosition` | `2/5` |
| `forcedVerticalSpanOfGlissLinesBetweenNotesAtSameStavePositionOnStaveLine` | `1` |
| `additionalVerticalSpanForGlissLinesBetweenNotesAtAdjacentStavePositions` | `1/3` |
| `horizontalGapBeforeAndAfterIntraStaveFingerings` | `0` |

### guitarBendEngravingOptions

| Option | Default |
|---|---|
| `useSlursToDisplayBendsOnNotationStaves` | `false` |
| `useBracketsAndBUBDToDisplayBendsOnTabStaves` | `false` |
| `verticalOffsetFromCentreOfNoteOnStaveLine` | `0` |
| `horizontalOffsetFromCentreOfNoteOnStaveLine` | `0` |
| `verticalOffsetFromCentreOfNoteOnLedgerLine` | `0` |
| `horizontalOffsetFromCentreOfNoteOnLedgerLine` | `0` |
| `restrikeLineVerticalDistanceFromTabStave` | `3` |
| `postBendHorizontalOffsetFromCentreOfNoteOnStaveLine` | `1/2` |
| `postBendProtrusionAboveNotationStave` | `1` |

### guitarTechniquesEngravingOptions

| Option | Default |
|---|---|
| `guitarTechniquePositionOnTabStave` | `kInside` |
| `placementOnNotationStave` | `kAboveStave` |
| `placementOnTabStave` | `kAboveStave` |
| `curvedScoopVerticalOffsetFromNotationStave` | `1` |
| `curvedScoopVerticalOffsetFromTabStave` | `1` |
| `dipMinimumVerticalDistanceFromStave` | `1` |
| `dipMinimumVerticalDistanceFromStaveProfile` | `1` |
| `guitarTechniqueMinimumVerticalDistanceFromStave` | `1` |
| `guitarTechniqueMinimumVerticalDistanceFromStaveProfile` | `1` |

### tempoOptions

| Option | Default |
|---|---|
| `minimumDistanceFromStave` | `3` |
| `alignWithTimeSignatureIfNeedsToMoveVertically` | `true` |

### rehearsalMarkOptions

| Option | Default |
|---|---|
| `minimumDistanceFromStave` | `3` |
| `alignRehearsalMarksAtStartOfSystemWithSystemicBarline` | `false` |
| `gapForRehearsalMarksAlignedWithSystemicBarline` | `1/2` |

### lyricOptions

| Option | Default |
|---|---|
| `idealDistanceFromStave` | `3/2` |

### barlineOptions

| Option | Default |
|---|---|
| `showDoubleBarlinesAtChangesOfKeySignature` | `true` |
| `breakBarlinesOnVocalStaves` | `true` |
| `joinCoincidentBarlinesOfStavesInDifferentTimeSignatures` | `false` |
| `drawSingleBarlinesBetweenStaves` | `false` |
| `maxNumberOfStaveLinesForSingleLineBarlineLength` | `2` |
| `ossiaBarlineBehaviour` | `kAtStartAndEnd` |
| `ossiaBarlineJoinType` | `kSolid` |
| `ossiaBarlineJoinDashLength` | `1/2` |
| `ossiaBarlineJoinDashGap` | `1/3` |
| `joinOssiaWithSystemicBarlineInSingleInstrumentSystems` | `false` |
| `breakBarlinesOnVocalStavesAtEndOfSystem` | `true` |
| `drawTickBottomBarlineOnBottomStaffOnly` | `false` |
| `drawTickBarlineCrossingOuterStaffLine` | `true` |

### beamEngravingOptions

| Option | Default |
|---|---|
| `snapEndpointsOutsideStave` | `false` |
| `allowBetweenStavesBeamsIntoTheStave` | `false` |
| `useShallowBeamsWhenAllNotesOnLedgerLines` | `true` |
| `forceAngledBeamsOutsideTheStaveToHaveMinimumHalfSpaceSlope` | `false` |
| `preventFlatQuaverBeamsFromSnappingToSpacesWithinTheStave` | `false` |
| `forceBeamsFlatOnPercussionStaves_SingleLine` | `true` |
| `forceBeamsFlatOnPercussionStaves_FiveLine` | `true` |
| `forceBeamsFlatOnPercussionStaves_Grid` | `false` |
| `preserveIdealQuarterSpaceSlantForBeamsPositionedOutsideTheStave` | `true` |
| `ignoreBeamLinesOutsideTheStaveWhenSnappingWithinStaveCentredBeams` | `true` |

### ornamentAndTrillOptions

| Option | Default |
|---|---|
| `verticalGapToStaveLine` | `1` |

### barNumberEngravingOptions

| Option | Default |
|---|---|
| `gapAboveTrebleGClef` | `2` |
| `gapBelowTrebleGClef` | `3/2` |
| `gapBelowTrebleGClef8Below` | `5/2` |
| `gapAboveTenorCClef` | `3/2` |
| `gapAboveTrebleGClef8Above` | `3` |

### instrumentChangeEngravingOptions

| Option | Default |
|---|---|
| `idealDistanceFromStave` | `3/2` |
| `paddingBelowInstrumentChangeLabel` | `1/2` |

### textOptions

| Option | Default |
|---|---|
| `defaultDistanceFromStave` | `5/2` |

### holdAndPauseOptions

| Option | Default |
|---|---|
| `fermataMaximumSignsPerStave` | `kOnePerEachVoice` |

### multiRestOptions

| Option | Default |
|---|---|
| `barCountDistanceFromStave` | `1/2` |
| `barNumberRangeDistanceFromStave` | `1` |
| `showMultiRestBarCountsBetweenGrandStaves` | `true` |
| `useBarNumberRangeDistanceFromStave` | `true` |

### barRepeatOptions

| Option | Default |
|---|---|
| `distanceOfNumberFromTopOfStaffOrSymbol` | `1/2` |
| `distanceOfNumberedBarsFromStaff` | `1/2` |
| `staveRelativePositionForNumberedBarRegions` | `kAbove` |

### arpeggioOptions

| Option | Default |
|---|---|
| `slurArpeggioSingleStaveHeight` | `3/4` |
| `slurArpeggioCrossStaveHeight` | `1` |
| `slurArpeggioSingleStaveShoulder` | `3/10` |
| `slurArpeggioCrossStaveShoulder` | `1/5` |

### chordSymbolEngravingOptions

| Option | Default |
|---|---|
| `idealDistanceAboveStaff` | `3/2` |
| `positionChordSymbolsBetweenStavesOfGrandStaveInstruments` | `false` |
| `defaultPlacementForChordSymbolsOnSingleStaveInstruments` | `kAbove` |

### repeatEndingLineEngravingOptions

| Option | Default |
|---|---|
| `minimumDistanceAboveStave` | `3/2` |

### cueEngravingOptions

| Option | Default |
|---|---|
| `gapBetweenCueLabelAndStave` | `1` |
| `gapBetweenCueLabelAndOtherObjects` | `1/2` |
| `includeTransposition` | `false` |
| `cueLabelIsAlwaysAbove` | `false` |
| `cueUnpitchedNotesPositionOnStave` | `0` |
| `cueRhythmicCueStavePositionDistance` | `2` |
| `showOctaveTransposition` | `true` |
| `defaultCueClefValue` | `kSourceStaveClef` |
| `startCueClefBeforeBarlineIfCoincidentWithStartOfBar` | `true` |

### fingeringEngravingOptions

| Option | Default |
|---|---|
| `minimumDistanceBetweenStaveAndFingerings` | `1` |
| `showBracketForMultipleNotesPlayedWithSingleFinger` | `true` |
| `horizontalGapInsideParenthesesOrBrackets` | `1/12` |
| `gapBeforeSharedFingeringBracket` | `1/4` |
| `circularEnclosureAdditionalStaveDistanceMargin` | `1/2` |
| `alwaysPositionThumbFingeringsBelowTheStaveWhenNoConflictingVoicesActive` | `false` |
| `crossStaveChordFingeringBehaviour` | `kPositionOnHomeStave` |
| `defaultDistanceFromIntraStaveNotehead` | `1/6` |
| `minimumDistanceFromOtherIntraStaveObstructions` | `1/8` |
| `intraStaveFingeringIntervalThresholdForAlignment` | `6` |
| `minimumVerticalGapBetweenAdjacentIntraStaveFingerings` | `1/7` |
| `defaultHorizontalGapBetweenAdjacentIntraStaveFingeringsIfNoKerningData` | `1/12` |
| `horizontalIntraStaveFingeringAlignmentThreshold` | `3/4` |
| `verticalIntraStaveFingeringOffsetFromOutermostStaveLine` | `1/4` |
| `intraStaveFingeringCollisionAvoidanceArrangement` | `kOffsetVertically` |
| `verticalOffsetForIntraStaveFingeringsInSpaces` | `-1/7` |
| `scalePercentageForIntraStaveFingerings` | `95` |
| `scalePercentageForIntraStavePluckedFingerings` | `85` |
| `eraseBackgroundBehindIntraStaveFingerings` | `true` |
| `intraStaveFingeringErasedBackgroundHorizontalPadding` | `1/16` |
| `intraStaveFingeringErasedBackgroundVerticalPadding` | `0` |
| `intraStaveFingeringCautionaryAppearance` | `kOmit` |
| `gapBetweenPluckedFingeringAndArpeggioLineOrStave` | `1/3` |
| `forceArpeggioLineFingeringsOutsideStave` | `true` |
| `relativePositionOfPluckedFingeringToBracketIfAtBottomOfChord` | `kBelow` |
| `verticalGapBetweenBracketAndPluckedFingering` | `1/4` |
| `horizontalGapBetweenBracketAndPluckedFingering` | `1/4` |
| `pluckedFingeringBracketHorizontalLength` | `1/2` |
| `pluckedFingeringBracketPenThickness` | `1/12` |
| `pluckedFingeringBracketDistanceFromStaveLines` | `1/4` |
| `pluckedFingeringBracketDistanceFromNeighbouringBracket` | `1/4` |
| `intraStaveFingeringExtremeVerticalOverlapThresholdPercentage` | `70` |
| `fingeringSlideMinimumDistanceFromStaveLines` | `1/4` |

### percussionLegendEngravingOptions

| Option | Default |
|---|---|
| `percussionLegendDistanceFromStaff` | `1` |

### systemDividerEngravingOptions

| Option | Default |
|---|---|
| `type` | `kDefault` |
| `minStavesInSystem` | `0` |
| `drawOnLeft` | `true` |
| `leftInset` | `0` |
| `drawOnRight` | `false` |
| `rightInset` | `0` |

### markerEngravingOptions

| Option | Default |
|---|---|
| `gapBetweenMarkerAndStave` | `2` |

### divisiEngravingOptions

| Option | Default |
|---|---|
| `showDivideArrowsOnVocalStaves` | `true` |
| `gapBetweenDivisiLabelsAndStave` | `1/2` |
| `gapBetweenDivisiLabelsAndOtherObjects` | `1/2` |
| `horizontalOffsetForLabel` | `0` |

### slashRegionEngravingOptions

| Option | Default |
|---|---|
| `distanceOfNumberFromStave` | `1/2` |
| `placementRelativeToStave` | `kBelow` |
| `showRhythmicSlashesOnTablatureWhenNotationStaveShown` | `true` |

### repeatMarkerEngravingOptions

| Option | Default |
|---|---|
| `distanceFromStave` | `3/2` |
| `lhsIndentForLeftAlignedMarkersAtBarline` | `0` |
| `rhsIndentForRightAlignedMarkersAtBarline` | `0` |
| `distanceAboveStaveForCodaOverPreamble` | `2` |
| `repeatCountDistanceFromStave` | `1` |

### jazzArticulationEngravingOptions

| Option | Default |
|---|---|
| `verticalOffsetForArticulationsOnStaveLines` | `3/8` |
| `lineFarsideStaveLineAvoidanceGap` | `1/4` |

### harpPedalEngravingOptions

| Option | Default |
|---|---|
| `gapBeetwenStaveLineAndHarpPedal` | `1` |
| `centerBetweenStaves` | `true` |

### condensingEngravingOptions

| Option | Default |
|---|---|
| `gapBetweenCondensingLabelsAndStave` | `1/2` |
| `gapBetweenCondensingLabelsAndOtherObjects` | `1/2` |
| `showFullStopBetweenPlayerNumbersInLabels` | `true` |
| `separatorBetweenPlayerNumbersInLabels` | `kPeriod` |
| `showFullStopAfterLastPlayerNumberInLabels` | `true` |
| `labelToIndicationString` | `a ` |
| `horizontalOffsetForLabel` | `-2` |
| `eraseBackground` | `true` |
| `erasurePadding` | `1/8` |
| `showFullStopAfterSinglePlayerNumberInLabels` | `true` |
| `showToIndicationWhenCoincidingWithPlayerNumbers` | `true` |
| `useRangesForConsecutivePlayerNumbers` | `false` |

### stringIndicatorEngravingOptions

| Option | Default |
|---|---|
| `indicatorScaleFactorPercentageInsideStave` | `66` |
| `gapBetweenObjectsOffsetHorizontallySharingSameStavePosition` | `1/8` |

### horizontalLineEngravingOptions

| Option | Default |
|---|---|
| `verticalGapBetweenHorizontalLineAndStaveLine` | `1` |
| `horizontalGapAtStartForInsideStaffHorizontalLine` | `1/2` |
| `horizontalGapAtEndForInsideStaffHorizontalLine` | `1/2` |
| `horizontalGapAtStartForOutsideStaffHorizontalLine` | `1/2` |
| `horizontalGapAtEndForOutsideStaffHorizontalLine` | `1/2` |

### figuredBassEngravingOptions

| Option | Default |
|---|---|
| `staveRelativePosition` | `kBelow` |
| `perSystemAlignmentWhenBelowStave` | `kAlignTopFigures` |
| `perSystemAlignmentWhenAboveStave` | `kAlignBottomFigures` |
| `minimumDistanceFromStave` | `3/4` |
| `gapOutsideParenthesesAndBrackets` | `1/12` |
| `bracketPenWidth` | `1/16` |
| `bracketHookLength` | `1/5` |
| `gapInsideBrackets` | `1/6` |
| `verticalProtrusionOfBracketsBeyondGlyphBounds` | `1/10` |
| `bracketStyle` | `kBrackets` |
| `minimumVerticalGapAboveAndBelowParenthesesOrBrackets` | `1/12` |
| `gapInsideBracketsForLines` | `1/4` |
| `gapInsideBracketsForNonDeferredSuspensionLines` | `1/6` |
| `verticalProtrusionForBracketsAroundSingleLine` | `1/3` |
| `verticalProtrusionForBracketsAroundMultipleLines` | `2/5` |
| `hookLengthForBracketsAroundLines` | `1/3` |
| `hookLengthForBracketsAroundNonDeferredSuspensionLines` | `1/5` |
| `bracketStyleAroundLines` | `kBrackets` |

### cutawayEngravingOptions

| Option | Default |
|---|---|
| `cutawayStartStaveLineProtrusion` | `1` |
| `cutawayEndStaveLineProtrusion` | `0` |
| `cutawaySystemStartPreambleType` | `kFullyCutaway` |
| `restateClefForAllCutawayEndsInSystem` | `false` |

### harmonicsEngravingOptions

| Option | Default |
|---|---|
| `showNaturalHarmonicsLineAboveTabStave` | `false` |
| `showPinchHarmonicsLineAboveTabStave` | `false` |
| `harmonicLineVerticalDistanceFromTabStave` | `1/4` |
| `artificialHarmonicsAppearanceOnNotationStave` | `kShowStoppedAndTouchedNotes` |
| `artificialHarmonicsAppearanceOnTabStave` | `kShowTouchedNoteOnStave` |
| `pinchHarmonicsAppearanceOnNotationStave` | `kShowStoppedAndSoundingNotes` |
| `pinchHarmonicsAppearanceOnTabStave` | `kTouchedFretNumberOnly` |
| `naturalHarmonicsAppearanceOnNotationStave` | `kShowSoundingNote` |
| `naturalHarmonicsAppearanceOnTabStave` | `kTouchedFretNumberOnly` |

### coordinationLineEngravingOptions

| Option | Default |
|---|---|
| `centreAlignOnTimeSignatures` | `true` |

## 4. Notation Options: staff-related (47)

| Option | Default |
|---|---|
| `restGroupingOptions.splitRestsAtAllBeatBoundariesInIrregularTimeSignatures` | `true` |
| `accidentalStateCalcOptions.commonOptions.restateKeysignatureAccidentalsForTrills` | `false` |
| `beamingOptions.splitHalfBarBeamsAtQuarterBarsInLongTimeSignatures` | `true` |
| `restStavePositionerOptions.longRestPositioningBehaviour` | `kMoveAwayFromMiddleOfStave` |
| `restStavePositionerOptions.strictContrapuntalMode` | `false` |
| `restStavePositionerOptions.alignRestBottomsOnOneLineStaves` | `false` |
| `restStavePositionerOptions.alwaysMoveRestsAwayFromNotesSoundingLater` | `false` |
| `restStavePositionerOptions.restrictImpactOfPositioningWithinTheBar` | `false` |
| `restStavePositionerOptions.lowerBarRestInMultipleVoicesPositioningBehaviour` | `kHangFromBottomLine` |
| `restStavePositionerOptions.alignRestsWithinBarOrBeat` | `kBars` |
| `partTranspositionOptions.preferEnharmonicEquivalentWithFewerAccidentals` | `true` |
| `partTranspositionOptions.preferSimplerAccidentals` | `true` |
| `barlineOptions.drawSingleBarlinesBetweenStaves` | `false` |
| `barlineOptions.showSingleSystemicBarlineAtEndOfSystem` | `false` |
| `barlineOptions.showSingleSystemicBarlineAtEndOfFlow` | `false` |
| `barlineOptions.showSystemicBarlineForSingleStaffSystems` | `false` |
| `barlineOptions.showSystemicBarlineForSingleStaffSystemsOnFirstSystem` | `false` |
| `barlineOptions.drawDoubleSystemicBarlineAtStartOfSystem` | `false` |
| `barlineOptions.drawDoubleSystemicBarlineAtStartOfFlow` | `false` |
| `rhythmSlashNotationOptions.numSpacesFromMiddleOfStaveToOffsetSlashesInOpposingVoiceDirections` | `1` |
| `rhythmSlashNotationOptions.numSpacesFromMiddleOfStaveToOffsetSlashesWhenOpposingNonSlashedVoicesPresent` | `1` |
| `rhythmSlashNotationOptions.behaviourInCompoundTimeSignatures` | `kReflectBeatGroups` |
| `rhythmSlashNotationOptions.behaviourInIrregularTimeSignatures` | `kReflectBeatGroups` |
| `rhythmSlashNotationOptions.maximumDurationAppliesToCompoundTimeSignatures` | `true` |
| `rhythmSlashNotationOptions.maximumDurationAppliesToIrregularTimeSignatures` | `true` |
| `rhythmSlashNotationOptions.beatLengthForOpenTimeSignatures` | `steamVariantList:list: {int: 8}, {int: 0}` |
| `condensingOptions.phraseMaxPitchCrossCount` | `1` |
| `condensingOptions.allowAnyNumberOfPitchCrosses` | `false` |
| `condensingOptions.preventPlayingTechniqueAmalgamation` | `false` |
| `condensingOptions.preventStemAmalgamation` | `false` |
| `condensingOptions.allowStemAmalgamation` | `true` |
| `condensingOptions.silentPlayerPolicy` | `kInclude` |
| `condensingOptions.allowTrueUnisons` | `true` |
| `condensingOptions.allowMidSharedStemUnisons` | `true` |
| `condensingOptions.slurAmalgamationPolicy` | `kAlways` |
| `condensingOptions.hideRestsForSilentPlayers` | `false` |
| `condensingOptions.hideRestsForSilentPlayersOnlyForRangesThatAdjoinABarline` | `false` |
| `condensingOptions.minimumLengthToHideRestsForSilentPlayers` | `2` |
| `condensingOptions.mirrorAccidentalPropertiesFromNormalStaves` | `false` |
| `condensingOptions.requireTrillIntervalCompatibility` | `kNone` |
| `condensingOptions.preventHorizontalLineAmalgamation` | `false` |
| `clefNotationOptions.respectOctaveTransposition` | `false` |
| `clefNotationOptions.showClefInPreambleAfterFirstSystem` | `true` |
| `keySignatureNotationOptions.showKeySignatureInPreambleAfterFirstSystem` | `true` |
| `keySignatureNotationOptions.defaultCautionaryKeySignatureVisibilityAtEndOfSystem` | `kShow` |
| `timeSignatureNotationOptions.defaultCautionaryTimeSignatureVisibilityAtEndOfSystem` | `kShow` |
| `repeatNotationOptions.trackClefAndKeySignaturesAcrossRepeatStructures` | `true` |

## 5. Per-staff commands (66): what you can do to one staff or system

| Command | Name |
|---|---|
| `Edit.AddDivisi` | Add Divisi |
| `Edit.AddOssiaAbove` | Add Ossia Above |
| `Edit.AddOssiaBelow` | Add Ossia Below |
| `Edit.AddStaffAbove` | Add Staff Above |
| `Edit.AddStaffBelow` | Add Staff Below |
| `Edit.ChangeStaffTextToSystemText` | Change Staff Text To System Text |
| `Edit.ClefAfterBarline` | Clef After Barline |
| `Edit.ClefAfterGraceNotes` | Clef After Grace Notes |
| `Edit.ClefInConcertLayouts` | Clef In Concert Layouts |
| `Edit.ClefInTransposingLayouts` | Clef In Transposing Layouts |
| `Edit.ClefResetPosition` | Clef Reset Position |
| `Edit.CreateSystemBreak` | Stop Slur |
| `Edit.CrossStaffAbove` | Cross to Staff Above |
| `Edit.CrossStaffBelow` | Cross to Staff Below |
| `Edit.CrossStaffReset` | Cross Staff Reset |
| `Edit.DeleteInitialExplicitClefs` | Delete Initial Explicit Clefs |
| `Edit.DeleteTonalitySystem` | Delete Tonality System |
| `Edit.DuplicateTonalitySystem` | Duplicate Tonality System |
| `Edit.EditTonalitySystem` | Edit Tonality System |
| `Edit.ExportTonalitySystem` | Export Tonality System |
| `Edit.ImportTonalitySystem` | Import Tonality System |
| `Edit.ManualStaffVisibility` | Manual Staff Visibility |
| `Edit.NewTonalitySystem` | New Tonality System |
| `Edit.RemoveStaff` | Remove Staff |
| `Edit.SelectToEndOfSystem` | Select To End Of System |
| `Edit.SelectToStartOfSystem` | Select To Start Of System |
| `Edit.SetStaffSpacingEditMode` | Set Staff Spacing Edit Mode |
| `Edit.ShowAccidentalInBrackets` | Show Accidental In Brackets |
| `Edit.ToggleRoundBracketsForNotehead` | Toggle Round Brackets For Notehead |
| `Edit.ToggleSquareBracketsForNotehead` | Toggle Square Brackets For Notehead |
| `Engrave.CompleteEditStaffSpacingMeasurement` | Complete Edit Staff Spacing Measurement |
| `Engrave.CopyStaffSpacingBetweenFrames` | Copy Staff Spacing Between Frames |
| `Engrave.CreateBrace` | Create Brace |
| `Engrave.CreateBracket` | Create Bracket |
| `Engrave.CreateBracketAndBarlineChange` | Create Bracket And Barline Change |
| `Engrave.CreateBracketAndBarlineReset` | Create Bracket And Barline Reset |
| `Engrave.CreateSubBracket` | Create Sub Bracket |
| `Engrave.CreateSubSubBracket` | Create Sub Sub Bracket |
| `Engrave.EditStaffSpacingMeasurement` | Edit Staff Spacing Measurement |
| `EventEdit.CopyToStaveAbove` | Copy To Stave Above |
| `EventEdit.CopyToStaveBelow` | Copy To Stave Below |
| `EventEdit.EditExistingClef` | Edit Existing Clef |
| `EventEdit.MoveToStaveAbove` | Move To Stave Above |
| `EventEdit.MoveToStaveBelow` | Move To Stave Below |
| `EventEdit.NavigateDownNextStave` | Navigate Down Next Stave |
| `EventEdit.NavigateStaveDown` | Navigate Stave Down |
| `EventEdit.NavigateStaveUp` | Navigate Stave Up |
| `EventEdit.NavigateUpNextStave` | Navigate Up Next Stave |
| `EventEdit.SwapStaves` | Swap Staves |
| `Filter.Clefs` | Clefs |
| `Filter.LyricsAboveStaff` | Lyrics Above Staff |
| `Filter.LyricsBelowStaff` | Lyrics Below Staff |
| `Filter.SystemBreaks` | System Breaks |
| `NoteInput.CreateClef` | Create Clef |
| `NoteInput.CreateSystemText` | Create System Text |
| `NoteInput.CreateSystemText?ParagraphStyleID=paragraph.defaulttext` | Create System Text (ParagraphStyleID=paragraph.defaulttext) |
| `Page.LockSystem` | Lock System |
| `Page.MakeIntoSystem` | Make Into System |
| `Page.MoveBarsToNextSystem` | Move Bars To Next System |
| `Page.MoveBarsToPreviousSystem` | Rests |
| `Project.Layouts.ClefAndTranspositionOverrides` | Layouts › Clef And Transposition Overrides |
| `Project.Layouts.ClefAndTranspositionOverridesSetOverrides` | Layouts › Clef And Transposition Overrides Set Overrides |
| `View.ShowSystemTrack` | Show System Track |
| `View.ToggleShowDivisiUnisonInGrey` | Toggle Show Divisi Unison In Grey |
| `View.ToggleShowStaveLinesInCutaways` | Toggle Show Stave Lines In Cutaways |
| `Window.ShowEngraveModePanel?SpecialEditModeType=kStaffSpacing` | Show Engrave Mode Panel (SpecialEditModeType=kStaffSpacing) |
