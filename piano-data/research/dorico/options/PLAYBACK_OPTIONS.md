# Dorico Playback Options: defaults

Playback Options (timing, swing, dynamics curve, click/count-in).

Source: factory defaults stored in a project saved by Dorico 4.0.5 (file format 1.1096), decoded from `score.dtn`.
`in Dorico 6` = the option path also appears in the Dorico 6.2 binary (✓), or is not referenced by that name (–).

**63 settings in 18 groups.**

## Groups

[controllerDiscretisationInterval](#controllerdiscretisationinterval) · [pitchBendDiscretisationInterval](#pitchbenddiscretisationinterval) · [gapBetweenFlowsSeconds](#gapbetweenflowsseconds) · [preRollBeforeFlowSeconds](#prerollbeforeflowseconds) · [playBackSlashedVoices](#playbackslashedvoices) · [pitchOfA4InHertz](#pitchofa4inhertz) · [dynamicsOptions](#dynamicsoptions) · [timingOptions](#timingoptions) · [graceNotePlaybackOptions](#gracenoteplaybackoptions) · [tremoloPlaybackOptions](#tremoloplaybackoptions) · [arpeggioPlaybackOptions](#arpeggioplaybackoptions) · [pedalLinePlaybackOptions](#pedallineplaybackoptions) · [chordPlaybackOptions](#chordplaybackoptions) · [repeatsPlaybackOptions](#repeatsplaybackoptions) · [timeDisplayPlaybackOptions](#timedisplayplaybackoptions) · [playModeTrackVisibilityPlaybackOptions](#playmodetrackvisibilityplaybackoptions) · [clickAndCountInOptions](#clickandcountinoptions) · [trillPlaybackOptions](#trillplaybackoptions)

## controllerDiscretisationInterval

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `controllerDiscretisationInterval` | `1/16` | fraction = 0.0625 | – |

## pitchBendDiscretisationInterval

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `pitchBendDiscretisationInterval` | `1/32` | fraction = 0.03125 | – |

## gapBetweenFlowsSeconds

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `gapBetweenFlowsSeconds` | `5.000000` | float | – |

## preRollBeforeFlowSeconds

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `preRollBeforeFlowSeconds` | `0.000000` | float | – |

## playBackSlashedVoices

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `playBackSlashedVoices` | `false` | bool | – |

## pitchOfA4InHertz

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `pitchOfA4InHertz` | `440.000000` | float | – |

## dynamicsOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `dynamicHumanisePercent` | `50` | int | ✓ |
| `primaryBeatStressDelta` | `0.300000` | float | ✓ |
| `beatStressDelta` | `0.200000` | float | ✓ |
| `accentDynamicDelta` | `0.500000` | float | ✓ |
| `marcatoDynamicDelta` | `0.800000` | float | ✓ |
| `ghostNoteDynamicDelta` | `2.500000` | float | ✓ |
| `dynamicCurveParams` | `0.500000,2.500000,2.500000` | text | ✓ |

## timingOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `timingHumanisePercent` | `30` | int | ✓ |
| `noteDurationPercent` | `95` | int | ✓ |
| `staccatoDurationPercent` | `50` | int | ✓ |
| `staccatissimoDurationPercent` | `25` | int | ✓ |
| `tenutoDurationPercent` | `98` | int | ✓ |
| `legatoDurationPercent` | `105` | int | ✓ |
| `marcatoDurationPercent` | `95` | int | ✓ |
| `numTicksBeforeForSwitches` | `10` | int | ✓ |
| `defaultRhythmicFeel` | `rhythmicfeel.straight` | text | ✓ |

## graceNotePlaybackOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `noteLengthAt120BPM` | `1/6` | fraction = 0.166667 | ✓ |
| `thresholdForShortAppoggiatura` | `kSemiQuaver` | enum | ✓ |
| `playAppoggiaturas` | `true` | bool | ✓ |

## tremoloPlaybackOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `unmeasuredStrokesThreshold` | `3` | int | ✓ |
| `unmeasuredNoteLengthAt120BPM` | `1/5` | fraction = 0.2 | ✓ |

## arpeggioPlaybackOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `arpeggioOffsetAt120BPM` | `1/10` | fraction = 0.1 | ✓ |
| `slurArpeggioOffsetAt120BPM` | `1/12` | fraction = 0.0833333 | ✓ |
| `playbackPosition` | `kStartsOnBeat` | enum | ✓ |
| `maximumOffset` | `3/4` | fraction = 0.75 | ✓ |
| `minimumOffset` | `1/2` | fraction = 0.5 | ✓ |

## pedalLinePlaybackOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `depressionLengthAt120BPM` | `1/4` | fraction = 0.25 | ✓ |
| `retakeLengthAt120BPM` | `1/2` | fraction = 0.5 | ✓ |
| `releaseLengthAt120BPM` | `1/2` | fraction = 0.5 | ✓ |
| `sustainDepressedAfterNote` | `true` | bool | ✓ |

## chordPlaybackOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `playChords` | `false` | bool | ✓ |

## repeatsPlaybackOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `playRepeats` | `true` | bool | ✓ |
| `playRepeatsAfterDS` | `false` | bool | ✓ |

## timeDisplayPlaybackOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `projectFrameRate` | `k25` | text | ✓ |
| `showTimecode` | `false` | bool | ✓ |
| `useDropFormat` | `false` | bool | – |

## playModeTrackVisibilityPlaybackOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `showTimeTrack` | `true` | bool | ✓ |
| `showChordTrack` | `true` | bool | ✓ |
| `showVideoTrack` | `false` | bool | ✓ |
| `showMarkerTrack` | `false` | bool | ✓ |

## clickAndCountInOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `enableClick` | `false` | bool | – |
| `numBarsCountIn` | `1` | int | – |
| `stressOptions.useBeatSubdivisionsForRegularTimeSigs` | `false` | bool | – |
| `stressOptions.useBeatSubdivisionsForCompoundTimeSigs` | `true` | bool | – |
| `renderOptions.primaryBeatPitch` | `83` | int | – |
| `renderOptions.subsequentBeatPitch` | `79` | int | – |
| `renderOptions.beatSubdivisionPitch` | `71` | int | – |
| `renderOptions.primaryBeatVelocity` | `64` | int | – |
| `renderOptions.subsequentBeatVelocity` | `56` | int | – |
| `renderOptions.beatSubdivisionVelocity` | `48` | int | – |
| `renderOptions.doricoBeepSound` | `kClickSound` | enum | – |

## trillPlaybackOptions

| Option | Default | Type | in Dorico 6 |
|---|---|---|---|
| `trillPlaybackMode` | `kSampledAndGenerated` | enum | ✓ |
| `playbackSpeedSlow` | `8` | int | ✓ |
| `playbackSpeedNormal` | `12` | int | ✓ |
| `playbackSpeedFast` | `16` | int | ✓ |
| `startPlaybackOnUpperNote` | `false` | bool | ✓ |
| `playAcceleratingTrill` | `false` | bool | – |
