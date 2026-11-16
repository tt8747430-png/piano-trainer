# Components, layout and motion

Piano Companion 1.6.1028 (Mac). Source: decompiled `PianoCompanion.dll`, `Manufaktura.OSX.dll`, `Manufaktura.Controls.dll`, bundle resources. Colours in machine form: `data/colors.json`.

Legend: **exact** = read in code or measured from a file (cited). **inferred** = deduced.

Coordinates: AppKit views are bottom-left origin unless the class overrides `IsFlipped => true` (noted per view).

---

## 1. Piano keyboards

The app has two keyboard engines.

| Engine | Classes | Used in | Range |
|---|---|---|---|
| A. Image-button keyboard | `PianoKeyboard` (NSScrollView) + `PianoKey` (NSButton); subclasses `PianoKeyboardLarge`, `PianoKeyboardFilter`, `PianoKeyboardSmall` | Chord/scale details, Chord Suggester, reverse lookup (Chords/Scales), progression cells | 4 octaves, 48 keys, MIDI 60–107 (C4–B7) |
| B. Full piano | `PianoRollView` = `PianoOverviewView` + `PianoPlayView` + `PianoPlayKey`; `PianoViewController` | Piano tab | 88 keys, A0 (MIDI 21) – C8 (108), 52 white |

All **exact**.

### 1.1 Key images (`Resources/Keys/*.png`) **exact** (`sips`)

| File | Size px | Role |
|---|---|---|
| white_key.png / _pressed / _root | 20×60 | normal-size white |
| black_key.png / _pressed / _root | 10×40 | normal-size black |
| white_key_large.png / _pressed / _root | 40×120 | large white |
| black_key_large.png / _pressed / _root | 20×80 | large black |

Ratios: black/white width = 0.5; black/white height = 2/3. Images are stretched with `NSImageScale.AxesIndependently`. **exact** (`PianoKey` ctor, `PianoPlayKey` ctor)

Sampled pixel colours (centre column) — **inferred** by pixel sampling:

| State | White key | Black key |
|---|---|---|
| normal | #EBECEF body, darker top edge, #BBBFC5 bottom | #111111 body, gradient #262626 → #040404 |
| pressed | #2AAE76 (green) | #28B36F |
| root | #C93D3A (red) | #D53A36 |
| outline | #171717 | #010101 / #171717 |

### 1.2 Engine A layout (`PianoKeyboard.LoadView`) **exact**

- Loop of 4 octaves. Whites appended left to right; `x += key.Frame.Width`.
- Black keys are placed relative to the right edge of the white key just added: `x_black = x_afterWhite − 1.5·W + bw·offset`, where W = white width, bw = black width.
- Offsets per black key: C♯ 0.33, D♯ 0.65, F♯ 0.33, G♯ 0.51, A♯ 0.66.
- Resulting black-key centres (W = 2·bw, as the images give): C♯ 0.915 W, D♯ 2.075 W, F♯ 3.915 W, G♯ 5.005 W, A♯ 6.08 W from the octave's left edge (boundaries at 1, 2, 4, 5, 6 W). So C♯/F♯ lean left, D♯/A♯ lean right, G♯ is centred. (Derived arithmetic from exact constants.)
- Black keys sit at the top: `y = _y + (whiteHeight − blackHeight)`.
- Key list is reordered so index = semitone: key index i ↔ MIDI 60 + i.

Modes (`PianoKey.ConfigureKey`, enum `PianoMode {Small, Normal, Large}`):

| Mode | Images | Key size | Extras | Used by |
|---|---|---|---|---|
| Small | normal set | white 10×30, black 5×20 | no bezel, layer border black 0.5 px; no scroller, scroll wheel ignored | `PianoKeyboardSmall` (progression cells; pool of 100 pre-generated in `AppDelegate`) |
| Normal | normal set | 20×60 / 10×40 | – | – |
| Large | large set | 40×120 / 20×80 | horizontal scroller | `PianoKeyboardLarge` (clickable, plays keys, momentary), `PianoKeyboardFilter` (clickable, toggle keys, plays keys) |

Key states (`PianoKey.SetState`): root → `*_root` image; selected → `*_pressed`; else normal. Alternate (mouse-down) image is always `*_pressed`. **exact**

Highlighting (`ShowFormula`): every formula note is drawn pressed; if a root is given, keys with `(12 + note) % 12 == root` use the root image. After drawing, the view scrolls so the lowest note is visible: lowest < 3 → scroll to 0; else scroll to the white key one or two keys below the lowest note. **exact**

Click behaviour: mouse-down plays `NoteOn(60+i, velocity 120)` when `PlayKeys`; mouse-up sends `NoteOff`; in toggle mode (Filter) clicking adds/removes the key from `SelectedNotes` and fires `KeyPressed`. MIDI input (`HandleMidiKey`) folds held notes to the lowest octave: `offset = min/12*12`. **exact**

### 1.3 Note and finger markers (engine A) **exact** `AddCircleForNote`, `AddCircleForFinger`

| Marker | Size | Position (y from bottom) | Fill | Text |
|---|---|---|---|---|
| Note label circle | Ø 36 (frame 35×35) | white key: y 4; black key: y 44 (`(white?40:80) − 36`) | pitch-class colour (§4.1) | HelveticaNeue-Medium 14 pt (10 pt if label > 2 chars); black text on D♯ and E, white otherwise; white border 1.5 px; corner radius 18 |
| Finger, left hand | Ø 18 | no label: white 85 / black 68; with label: white 97 / black 100 | finger colour (§4.2), circle | finger digit, HelveticaNeue-Medium 12, white; white border 1.5 |
| Finger, right hand | 18×18 square | no label: white 5 / black 43; with label: white 42 / black 81 | finger colour, square (no radius) | same |

Labels on chord details = chord note names (`ChordService.indexesToCommaSeparatedNoteList`). Fingering strings are parsed digit by digit, keeping 1–5 (`ParseFingering`). Marker x is centred on the key (`ceil(midX) − d/2`). Marker scale factor is 1 in all modes.

### 1.4 Engine B: full piano (`PianoPlayView`, `IsFlipped = true`) **exact**

| Constant | Value |
|---|---|
| A0 | MIDI 21 (key id 0) |
| White keys | 52 |
| Black/white width ratio | 0.39130434 (= 9/23) |
| Black/white height ratio | 0.5862069 (= 17/29) |
| Keys on screen (zoom ladder) | 7, 10, 12, 14, 21; start index 1 → 10 (`PianoRollView.PianoSize`) |
| White key width | `floor(boundsWidth / keysOnScreen · backingScale) / backingScale` |
| Horizontal padding | `max(0, (width − 52·W)/2)` |
| Black key x | `pad + j·W − bw·shift − scroll`; shift C♯ 2/3, D♯ 1/3, F♯ 2/3, G♯ 1/2, A♯ 1/3 (`GetBlackKeyShift`) |
| Black key height | `0.5862069 · viewHeight`, top aligned |
| Images | large set only (white_key_large, black_key_large + _pressed). No root image. |

White-key id mapping (`PianoKeyIndex.GetWhiteNoteId`): ids 0, 2 for A0, B0; then octave pattern +1,+3,+5,+6,+8,+10,+12 relative to 2 + 12·octave. Black ids analogously (`GetBlackNoteId`). **exact**

Note badges (`NoteBadge`, only when `ShowNotes`): circle diameter = `W·0.8` (0.6 in dual mode); font = system Medium `max(6, d·0.42)`; text = sharp name + octave (e.g. "C4", octave = (id+21)/12 − 1); fill = pitch-class colour; border black 1 px; text black on D♯/E, white otherwise. Centre y: white keys `bh + (h − bh)/2`; black keys `bh · 0.6`. **exact**

Interaction: mouse down/drag presses the key under the pointer (black keys hit-tested first), glissando by dragging; velocity 120; mouse up releases. **exact**

Overview strip (`PianoOverviewView`, height 50, `PianoRollView.OverviewHeight`): a non-interactive `PianoPlayView` showing all 52 keys, no badges, plus `CaretView`: grey veil rgba(0.5,0.5,0.5,0.3) left and right of a red (1,0,0) stroked rectangle that marks the visible window. Initial caret x 150, width 70; width = keyWidth · keysOnScreen. Drag/click moves the caret and scrolls the main piano proportionally (`SetPianoFramePosition`). Hidden in dual mode. **exact**

Octave scroll: `offset = min(contentWidth − width, W · (7·(octave−1) + 2))`. Default view shows key 20 (`ShowKey(20)`). **exact**

Piano tab layout (`PianoViewController.UpdateLayout`): toolbar 38 px at top; single mode: one roll fills the rest; dual mode: two rolls, each half height, first on top using FirstOctave, second below using SecondOctave. **exact**

Piano toolbar (`PianoToolbarView`): black background; height 38; icon 18; button 34×34 at y 2; spacing 6; right edge padding 8; buttons laid out right to left. Order: Minus, Plus, "Instrument" text menu, Settings gear (white), Record (red #FF3B30) or Stop-recording, then conditional "Load", Play/Stop, "Clear", "Save" (text 13 pt white). **exact** (`Rebuild`, `LayoutButtons`). Note: Plus calls `PianoSize.Next()` (more keys = smaller keys); Minus calls `Previous()`. **exact** `PianoViewController` lines ~385–390.

---

## 2. Staff

| Item | Value | Certainty |
|---|---|---|
| Engine | Manufaktura.Controls (open-source notation library) via `NSStaffView` | **exact** |
| Music font | Bravura (`Resources/Font/Bravura.otf`), metadata `bravura_metadata.json` embedded in Manufaktura.OSX, lazy proxy loading | **exact** `StaffView` ctor |
| Font sizes (Manufaktura.OSX.Settings defaults) | MusicFont 27.5, GraceNoteFont 22, StaffFont 30.5, LyricsFont 11, DirectionFont 11, TimeSignatureFont 14.5 (then replaced by the Bravura profile's own sizes via `SetFontFromName`) | **exact** |
| Panel height | 120 (`StaffPanel.Height`) | **exact** |
| Both clefs mode | two staves 170 wide each, gap 15, centred: x = (width − 340)/2 | **exact** `StaffPanel.Layout` |
| Single mode | one staff fills panel width | **exact** |
| Score | one staff, treble or bass clef, key C major (accidentals written per note) | **exact** `Score.CreateOneStaffScore(..., MajorScale.C)` |
| Chord | whole notes stacked (`MakeChord`), then a regular barline; octave = `Octave ?? PreviewOctave ?? 4` | **exact** |
| Scale | quarter notes, `AlwaysShowAccidentals = true`, barline; current step note coloured red | **exact** |
| Stems | down if MIDI > 71 (treble) or > 50 (bass), else up | **exact** `StemDirection` |
| Light mode | black symbols on white | **exact** |
| Dark mode | symbols (235,235,235) on black | **exact** `Color.DarkModeDrawingColor` |
| Fit | scale = min(width/(systemWidth+10), height/(2·|centre−maxY|+10), height/(2·|centre−minY|+10)); centred vertically on the middle staff line | **exact** `RenderCalculations` |
| `StaffContent/core.css` | only `body { margin: 0px; }` (legacy web-view staff) | **exact** |
| Pooling | `ObjectPool<StaffView>` | **exact** |

---

## 3. Circle of fifths (`CircleOfFifhtsView`, `IsFlipped = true`)

Geometry in units of the view radius r = min(w,h)/2. **exact** static fields; derived values computed.

| Ring | Inner → outer radius | Content |
|---|---|---|
| Centre | 0 → R0 = 0.30 | white disc; key-signature count at radius 0.225 ("1♯"…"5♯", "6♯/6♭", "5♭"…"1♭", empty for C) |
| Inner numerals | R0 0.30 → R1 0.41 | Roman numeral of the minor-ring chord in the selected key (TimesNewRomanPSMT, size ×0.45) |
| Minor keys | R1 0.41 → R2 0.594 | relative minor names, lower-case |
| Major keys | R2 0.594 → R3 0.870 | major key names |
| Outer numerals | R3 0.870 → R4 0.98 | Roman numeral of the major-ring chord |

NumbersHeight = 0.11; R2 = R1 + (R4 − R0 − 0.22)·2/5; R3 = R2 + (R4 − R0 − 0.22)·3/5.

- 12 sectors of 30°, each drawn from 255° to 285° then the context rotates 30°. **exact**
- Sector colours (when that degree forms a triad in the selected key): major → #FFAFAF, minor → #AFE4AF, diminished → #AFDFFF (C/F/G pitch colours at alpha 80/255 over white); otherwise white. **exact** (mix computed).
- Selected sector: fill (255,153,0), stroke black, width 0.01 r. Normal stroke black alpha 96/255, width 0.005 r. Black circles at R0 and R2, width 0.01 r. **exact**
- Labels: Arial (system font for names), size fitted into 0.25 r × 0.15 r via `Image.MeasureText`; numerals reduced by 55 %, key-signature text by 50 %. Text black. **exact**
- Static wheel is rendered once into a bitmap at backing scale (`CreateBitmap`), labels drawn on top each frame. **exact**
- Hit test: distance² ≥ R3² → drag mode (rotate wheel, `top` index changes); R2–R3 → select major key; R1–R2 → select minor key; < R1 ignored. Segment index = `(atan2·6/π + 12.5) mod 12`. Fires `Selected` with root, isMajor, and the diatonic chord. **exact**
- Keys come from `ScaleService.BuildCircleOfFifths(Major / NaturalMinor, PreferableAccidental)`. **exact**

---

## 4. Colours

### 4.1 Pitch-class colours **exact** `ColorExtensions`

| pc | Note | RGB | Hex |
|---|---|---|---|
| 0 | C | 255,0,0 | #FF0000 |
| 1 | C♯ | 255,102,0 | #FF6600 |
| 2 | D | 255,153,0 | #FF9900 |
| 3 | D♯ | 255,204,0 | #FFCC00 |
| 4 | E | 255,255,0 | #FFFF00 |
| 5 | F | 0,170,0 | #00AA00 |
| 6 | F♯ | 0,119,119 | #007777 |
| 7 | G | 0,153,255 | #0099FF |
| 8 | G♯ | 102,0,204 | #6600CC |
| 9 | A | 102,0,153 | #660099 |
| 10 | A♯ | 153,0,136 | #990088 |
| 11 | B | 204,0,170 | #CC00AA |

Scale-position order (`ScalePositionToCGColor`): C, D, E, F, G, A, B, C♯, D♯, F♯, G♯, A♯ — used for the border of progression cells by relative-chord degree.

### 4.2 Finger colours **exact** `PianoKeyboard`

| Finger | RGB | Hex |
|---|---|---|
| 1 | 246,110,82 | #F66E52 |
| 2 | 78,125,134 | #4E7D86 |
| 3 | 77,177,143 | #4DB18F |
| 4 | 177,26,255 | #B11AFF |
| 5 (and any other) | 187,158,129 | #BB9E81 |

### 4.3 Other UI colours **exact**

| Use | Value | Source |
|---|---|---|
| Metronome active beat | (239,108,0) #EF6C00 | MetronomeViewController.Accent |
| Metronome cross dots | SystemTeal; idle SystemGray; default active SystemOrange | MetronomeViewController, BeatDotsView |
| Record | (255,59,48) #FF3B30 | PianoToolbarView |
| Payment accent / active dot | (253,187,43) #FDBB2B | PaymentModalController |
| Payment card border | (220,220,220) | " |
| Payment idle dot | (200,200,200) | " |
| Payment scrim | black 40 % (alpha 102) | " |
| Payment highlight text | (255,162,26) | " |
| Payment secondary text | (128,128,128) | " |
| Songbook chord text | light (176,122,0) #B07A00; dark (253,187,43) | SongbookSheetView |
| Songbook highlight pill | (253,187,43) α 0.28 | " |
| Chord lane chips | (253,187,43) α 0.24, radius 6 | ChordLaneView |
| App rater panel | (243,152,18) | AppRaterPanel |
| Current-scale chevron | (129,129,167) | CurrentScaleView |
| Selected progression cell | (170,170,170) α 170/255 | TrackItemCellController |
| Relative-scale border | 100 % match → F green; else D orange | RelativeScaleItemController |
| Icon tints | sort toggled (21,133,255); screenshot toggled (255,226,81); thumbs (63,173,74); Facebook (59,89,152); Twitter (27,178,233); upgrade/unlock (255,182,0) | Elements |

System colours are used for most chrome (code counts: ControlText 51, White 30, Black 18, SecondaryLabel 14, …; nibs: controlTextColor, controlBackgroundColor, controlColor, labelColor, textBackgroundColor, separatorColor, headerTextColor, gridColor, selectedTextColor, headerColor, _sourceListBackgroundColor). **exact**

### 4.4 Asset catalog **exact** (`assetutil --info` on a scratch copy)

`Assets.car` holds only `AppIcon` (16, 32, 64, 128, 256, 512, 1024 px across @1x/@2x) and two packed atlases (`ZZZZPackedAsset-1.0.0-gamut0` 166×132 @1x, `ZZZZPackedAsset-2.0.0-gamut0` 102×68 @2x). There are no named colours and no other named images. Icons in the UI are vector paths drawn in code (`Elements.cs`, ~250 `icon_*` routines; names match Font Awesome 3 glyph names plus custom ones: `icon_piano`, `icon_piano2`, `icon_circle_of_fifths`, `icon_chords_dictionary`, `icon_scales_dictionary`, `icon_reverse_chord_lookup`, `icon_reverse_scale_lookup`, `icon_chord_progression`, `icon_user_library`, `icon_songbook`, `icon_quiz`, `icon_note`, …). Font Awesome origin is **inferred** from the names.

---

## 5. Fonts

| Font | Where | Size | Certainty |
|---|---|---|---|
| Bravura (bundled OTF) | staff | Manufaktura profile | **exact** |
| AvenirNextCondensed-DemiBold | chord names (`GetAttributedChordString` default), current scale name (18), chord-section headers (12), songbook chords (15 on screen; `ChordDrawSize` in PDF) | as listed | **exact** |
| TimesNewRomanPSMT | Roman numerals (circle of fifths, ScaleChordItem) | 15 | **exact** |
| HelveticaNeue-Medium | keyboard note/finger markers | 14 / 10 / 12 | **exact** |
| Arial | circle-of-fifths measuring default; `Image.MeasureText`/`DrawText` default | fitted | **exact** |
| System font | everything else; most common sizes 14, 11, 12, 13; bold 16, 13, 11; metronome BPM 56 bold, title 16 semibold | | **exact** |

Chord-symbol typography (`StringHelper.GetAttributedChordString`): root at full size in the chord font; the quality tail at 2/3 size, raised by 1/3 of the font size (superscript); ♯/♭ characters switched to the system font so they render; kerning −1 by default (−0.5 for note lists). `ParseSuperScriptedText` superscripts the text between `<` and `>`. **exact**

---

## 6. Other sizes and spacings **exact**

| Component | Values |
|---|---|
| CurrentScaleView | 1 px bottom border (ControlText); name at x 15; notes centred, min 5 px after name; chevron 30×30 at right − 40 |
| Metronome screen | side margin 24; BPM label 66 high (56 pt bold); tempo mark 20 high; beat dots 26 high; cross dots 18; ± buttons 36×26; slider x 72, height 22; quick-BPM row 26; rows: title 150×18, stepper 19×27, value 60×18, popups 190×26; preset save 130×26, delete 34×26; play 40 high |
| BeatDotsView | dot diameter = max(6, min(h, slot·0.68)); non-first dots ×0.78; first dot ×0.85 when not accented; accent ring inset −3, line 2 |
| Piano settings sheet | see SETTINGS.md §3 |
| LoadingOverlay | 150×150 container centred |
| Progression cell keyboard | Small mode keys 10×30 / 5×20 |

---

## 7. Animations and timing

The app uses almost no Core Animation. All values **exact**.

| What | Duration / curve | Source |
|---|---|---|
| Detail panel updates | `NSAnimationContext.Duration = 0` (animation explicitly disabled) | ChordsDetailsViewController ~217, ScalesDetailsViewController ~409 |
| Payment carousel auto-advance | every 4.5 s, wraps | PaymentModalController.ScheduleCarouselAutoRotate(4.5) |
| Payment carousel slide | 12 steps × 0.02 s = 0.24 s; ease-in-out quadratic: t<0.5 → 2t², else 1 − (−2t+2)²/2 | PaymentModalController.GoToCarouselPage |
| Songbook auto-scroll | NSTimer at 1/60 s, common run-loop mode, stopwatch-driven | SongbookAutoScroller |
| Search debounce | 0.5 s (typing/filter changes), 1.0 s (other triggers) via `PerformSelector(UpdateData:, delay)` with cancel | ChordsViewController / ScalesViewController.StartThrottledSearch |
| Generic throttle | 300 ms default | PianoCompanion.Engine.Throttle |
| Note-recorder playback tick | 10 ms timer | NoteRecorder |
| TimeNotePlayer tick | 50 ms | Songtive TimeNotePlayer |
| Metronome visuals | beat callback at each beat; cross-rhythm dots dispatched at `(i·beats/cross − beatIndex)·beatSeconds` within the beat; 3 beats scheduled ahead | MetronomeAudioEngine |
| Key press feedback | instant image swap (no animation) | PianoKey / PianoPlayKey |
| Disabled controls | alpha 0.4 | PianoSettingsModalController |
| Lite teaser fade (locked items) | companion chords: item 0 α 1, item 1 α 0.5, items ≥ 2 α 0.25, max 3 shown; scale chords: α 1, then −0.45 each (1, 0.55, 0.10, 0) and only 3 chords shown | CompanionChordsPanel, ScaleChordsCollectionPanel (when the Pro flag is false) |
