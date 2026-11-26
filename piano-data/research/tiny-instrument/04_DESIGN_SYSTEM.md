# DesignSystem bundle, colours, fonts, effects, shaders

## 1. Colour tokens (exact, `DesignSystem_DesignSystem.bundle/Contents/Resources/Assets.car`, `assetutil --info`)
sRGB components rounded to 3 decimals → hex. Light / dark (NSAppearanceNameDarkAqua).

### Semantic
| Token | Light | Dark |
|---|---|---|
| brand | #9517D4 (0.584,0.090,0.831) | #E04BC8 (0.878,0.294,0.784) |
| brandForeground | #FFFFFF | #141616 |
| surfaceBase | #FBF9F2 | #0F0F11 |
| surfaceElevated | #FFFFFF | #000000 |
| surfaceSunken | #F1EEE4 | #1A1A1D |
| borderSubtle | #DCD8CB | #2A2A2E |
| textPrimary | #141414 | #F5F3EC |
| textSecondary | #3A372F | #A0A0A8 |
| textTertiary | #6B675E | #808087 |
| success | #1F9A6B | #4CD4A0 |
| warning | #D68A12 | #F2B04A |
| error | #C4292E | #EF5B60 |

### Mode ramps (base, 50, 300, 700, 900; dark mode swaps 50↔900 and 300↔700)
| Mode | base | 50 | 300 | 700 | 900 |
|---|---|---|---|---|---|
| learn (green) | #34C759 | #D5F7E0 | #74E08D | #1E8B3C | #0F441C |
| listen (magenta, ear training) | #D1009B | #FDE8F8 | #EE80D8 | #8A006A | #280020 |
| practice (pink-red) | #FF375F | #FFDCE4 | #FF85A0 | #A60020 | #430011 |
| playback (blue) | #007AFF | #E5F2FF | #66B2FF | #0055CC | #001836 |
| compose (amber) | #F5B800 | #FFF3CC | #FFD966 | #A17A00 | #3D2D00 |

Base colours have no dark variant. Raw float values: `data/` is not duplicated; see assetutil output reproduced above (69 colour entries).

The warm off-white surfaces (#FBF9F2 / #F1EEE4) with a near-black dark mode, and one hue per mode, are the visual identity. App `Assets.car` adds `SplashBackground` (#FFE8FF light / #180016 dark) and the Tahoe app icon gradient (#741FAC → #8D26D3).

## 2. Other DesignSystem tokens (names exact; numeric values live in code and were not decompiled)
- `Spacing`, `Radius`, `ControlSizing`, `Elevation` (flat, raised, floating) + `ElevationModifier`, `AdaptiveLayout {horizontal, vertical: compact/regular/unspecified}`, `AspectClass` tall/square/wide, `PlayDockMetrics.KeyboardBounds {minHeight, maxHeight}`, `KeyboardLayout`, `KeyboardWindow {low, high}`.
- Accessibility: `AppTextSize` system/defaultSize/large/xLarge/xxLarge/largest; `AccessibilityToggle` system/on/off for reduce motion, differentiate without colour, reduce transparency, bold text, increase contrast (app-level overrides of system settings); `WCAGLevel`, `RGB` (contrast checking).
- `NarrationSpeed` verySlow/slow/normal/fast/veryFast.
- `ListItem*` components (app): card size standard/compact, state normal/dimmed, indicator chevron/none, subtitle plain/music/none, leading badge(symbol, tint, isCustomAsset, overlay).

## 3. Keyboard themes and key effects
- `KeyboardTheme` (12): classic, midnight, spaceGray, starlight, roseGold, pacificBlue, alpineGreen, cosmicOrange, blush, citrus, indigo, rainbow (paid pack "Keyboard Themes" $1.99). `KeyboardPalette {naturalFill, sharpFill, labelColor, activeLabelColor, border, pressedAccent, highlight?, highlightAccent?, leftHandTint?, rightHandTint?, fingeringBackground?, degreeStripTint?, pitchClassHue?}`.
- `KeyboardBorderStyle` glow/sweep/rainbow/shimmer; `KeyEffectStyle` stardust/flash/sparkle/splash/fluid; `KeyEffectColorSource` pitch/accent/white; `KeyboardHighlightStyle` tint/strip/dot; note-name position settings for keyboard and staff.
- `ChordLabSurface {panelFill, panelBorder, onPanelText, controlNeutral, accent, onAccentText}`.

## 4. Metal shaders (exact, `default.metallib`, 18 functions)
fluid_vs, fluid_advect, fluid_divergence, fluid_curl, fluid_vorticity, fluid_pressure, fluid_gradient, fluid_clear, fluid_splat, fluid_display (a stable-fluids smoke simulation for the "fluid" key effect: uniforms uVelocity, uSource, uTarget, uCurl, uPressure, uDivergence, dissipation, texelSize, radius), strandsField, strandsGlass (uStrandCount, uWaviness, uRefraction, uDispersion), stemWobble, Ripple, tapRipple (SwiftUI layer effects: amplitude, frequency, decay, speed, origin), ariaBorder, ariaBorderChroma, ariaBorderWobble (AI-assistant animated border; `AriaBorderMode` idle/thinking/talking/relaxing/fullLibrary/snake/celebration). Swift-side `KeyFluidMath`, `FluidSplatMath`, `StaffFluidMath`.

## 5. Notation fonts and engraving
- Fonts (all SIL OFL 1.1, read from name tables): **Bravura** 1.392 (Steinberg, OTF, in `Assets.car` data asset) + `BravuraMetadata` (SMuFL JSON, 733,542 B); **Sebastian** 1.350 (Florian Kretlow & Ben Byram-Wigfield) + `SebastianMetadata` (280,439 B); **Noto Music** 2.003 (`NotoMusic-Regular.ttf`, also duplicated as a data asset). Setting `engravingFont` = bravura / sebastian.
- `BravuraGlyphID` (59 glyphs used): clefs G/F, noteheads, flags 8th/16th up/down, 5 accidentals, rests whole→16th, time-sig digits 0–9 + common, brace, accents/staccato/tenuto/staccatissimo/marcato above/below, fermata above/below, dynamics p m f r s z n, breath comma, trill, turn, mordent, segno, coda, pedal Ped/up, augmentation dot.
- `StaffFigure` (DesignSystem): elements note(midi, value, tiedToNext, octaveShift)/rest, tuplet brackets, beam groups, time signature, pickup beats, accidentals (sharp/flat/natural/double, courtesy), expression (dynamics, hairpins cresc/dim, slurs, articulations staccato/accent/tenuto/marcato/fermata, ornaments trill/turn/mordent/grace), octave brackets, repeat structure (repeats, endings, nav marks segno/coda/D.C. al Fine/D.S. al Coda/To Coda/Fine), pedal spans (marks/bracket). `StaffEngraver`, `StaffBeamGeometry`, `StaffSlurGeometry`, `OrnamentRealizer.SubNote` (plays ornaments), `NoteValue {base whole…sixteenth, dots, tuplet}`.

## 6. Icons
`AppIcon` custom symbols (28): introduction, notes, keyboard, rhythm, intervals, scales, chords, keys, progressions, trebleClef, notesAm, melodies, compositions, chordLab, midi, midiCable, modes, lesson, playExplore, chapter, rootNote, scaleType, warmups, easterEggs, songLibrary, instrument, codeloopLogo, fallingNotes. App catalog: 729 vector glyphs (custom SF-style symbols such as `instrument.*` 25 instruments, `music.progression.iv.symbols`, `notation.chord.symbols`, `notes.falling.fill.symbols`), 435 images. Third-party icon credit: "Music Glyphs Icons — wishforge.games, CC Attribution" (svgrepo). Not exported (proprietary/attribution-bound art).

## 7. Motion (names exact; timings not decompiled)
CelebrationOverlay (card offset/scale/opacity, staged reveal, badge bounce, sparkle), SummaryXPBreakdownRow (bar fill, count-up, check), splash animation (`splashAnimationEnabled`), Vortex particle bursts, note animation (`noteAnimationEnabled`), particle/shader toggles (`particleEffectsEnabled`, `shaderEffectsEnabled`), haptics (`useHaptics`). All respect a Reduce Motion override.
