# Dorico default keyboard shortcuts by context (macOS)

From Dorico's bundled shortcut mapper (`Resources/shortcutmapper/content/generated/dorico_1.0_mac.json`). Names are Dorico's own.
Context = where the shortcut works. **Global** works everywhere; **Step input** applies while the note-input caret is active.
The complete ID-level list, including the newer Dorico 6 commands, is in `COMMANDS.md`.

## Engrave mode (16)

| Keys | Action | Parameter |
|---|---|---|
| `⌥←` | Nudge | `Direction=Left&Amount=kALittle` |
| `⌥← (numpad)` | Nudge | `Direction=Left&Amount=kALittle` |
| `⌥↑` | Nudge | `Direction=Up&Amount=kALittle` |
| `⌥↑ (numpad)` | Nudge | `Direction=Up&Amount=kALittle` |
| `⌥→` | Nudge | `Direction=Right&Amount=kALittle` |
| `⌥→ (numpad)` | Nudge | `Direction=Right&Amount=kALittle` |
| `⌥↓` | Nudge | `Direction=Down&Amount=kALittle` |
| `⌥↓ (numpad)` | Nudge | `Direction=Down&Amount=kALittle` |
| `⌥⌘←` | Nudge | `Direction=Left&Amount=kALot` |
| `⌥⌘← (numpad)` | Nudge | `Direction=Left&Amount=kALot` |
| `⌥⌘↑` | Nudge | `Direction=Up&Amount=kALot` |
| `⌥⌘↑ (numpad)` | Nudge | `Direction=Up&Amount=kALot` |
| `⌥⌘→` | Nudge | `Direction=Right&Amount=kALot` |
| `⌥⌘→ (numpad)` | Nudge | `Direction=Right&Amount=kALot` |
| `⌥⌘↓` | Nudge | `Direction=Down&Amount=kALot` |
| `⌥⌘↓ (numpad)` | Nudge | `Direction=Down&Amount=kALot` |

## Global (92)

| Keys | Action | Parameter |
|---|---|---|
| `⌘⇧W` | Close Project |  |
| `⌘W` | Close Tab |  |
| `⌘C` | Copy |  |
| `⌥⌘F` | Create Frame Break |  |
| `⌥⌘S` | Create System Break |  |
| `N` | Cross to Staff Above |  |
| `M` | Cross to Staff Below |  |
| `⌘X` | Cut |  |
| `Backspace` | Delete |  |
| `Delete` | Delete |  |
| `⌘⇧E` | Engraving Options... |  |
| `Escape` | Escape |  |
| `⇧↓` | EventEdit.NavigateDownExtend |  |
| `⇧↓ (numpad)` | EventEdit.NavigateDownExtend |  |
| `⌘⇧↓` | EventEdit.NavigateDownExtendBottom |  |
| `⌘⇧↓ (numpad)` | EventEdit.NavigateDownExtendBottom |  |
| `⇧↑` | EventEdit.NavigateUpExtend |  |
| `⇧↑ (numpad)` | EventEdit.NavigateUpExtend |  |
| `⌘⇧↑` | EventEdit.NavigateUpExtendTop |  |
| `⌘⇧↑ (numpad)` | EventEdit.NavigateUpExtendTop |  |
| `Numpad Plus` | Fast-forward |  |
| `⌘⇧L` | Layout Options... |  |
| `F3` | Mixer Window |  |
| `Page Down` | Move View Down |  |
| `Home` | Move View Left |  |
| `End` | Move View Right |  |
| `Page Up` | Move View Up |  |
| `⌘End` | Move View to End |  |
| `⌘Home` | Move View to Start |  |
| `↓` | Navigate Down |  |
| `↓ (numpad)` | Navigate Down |  |
| `↑` | Navigate Up |  |
| `↑ (numpad)` | Navigate Up |  |
| `Tab` | Navigate to the Next Fragment |  |
| `⌘N` | New |  |
| `⌘T` | New Tab |  |
| `⌘⇧T` | New Window |  |
| `⌥Right Bracket` | Next Layout |  |
| `⌃Tab` | Next Tab |  |
| `⌘⇧N` | Notation Options... |  |
| `⌘O` | Open... |  |
| `⌘⇧O` | Open... | `FilterID=MusicXMLImportFilter` |
| `⌘V` | Paste |  |
| `⌘⇧V` | Paste Special... |  |
| `⌘Comma` | Preferences... |  |
| `⌥Left Bracket` | Previous Layout |  |
| `⌃⇧Tab` | Previous Tab |  |
| `⌘Q` | Quit |  |
| `⌘Y` | Redo |  |
| `Numpad Minus` | Rewind |  |
| `⌥⌘⇧R` | Run Last Script |  |
| `⌘S` | Save |  |
| `⌘⇧S` | Save As... |  |
| `⌘A` | Select All |  |
| `←` | Select Left |  |
| `← (numpad)` | Select Left |  |
| `⌘D` | Select None |  |
| `→` | Select Right |  |
| `→ (numpad)` | Select Right |  |
| `⌥Enter` | Set Focus | `Value=kBottomPane` |
| `⌥Numpad Eight` | Set Focus | `Value=kBottomPane` |
| `⌥Numpad Nine` | Set Focus | `Value=kRightPane` |
| `⌥Numpad Seven` | Set Focus | `Value=kLeftPane` |
| `⌥Numpad Zero` | Set Focus | `Value=kScoreView` |
| `⌘Numpad Eight` | Show Bottom Panel |  |
| `⌘Numpad Seven` | Show Left Panel |  |
| `⌘Numpad Nine` | Show Right Panel |  |
| `⌘Numpad Six` | Show Toolbar |  |
| `Numpad Enter` | Start or Stop Playback |  |
| `P` | Start or Stop Playback | `PlayFromLocation=kSelection` |
| `Space` | Start or Stop Playback |  |
| `⇧Space` | Start or Stop Playback | `PlayFromLocation=kLastStartPosition` |
| `⌥⇧Space` | Start or Stop Playback | `PlayFromLocation=kStartOfFlow` |
| `Numpad Zero` | Stop Playback |  |
| `⌘Numpad Five` | Switch Mode | `WindowMode=kPrintMode` |
| `⌘Numpad Four` | Switch Mode | `WindowMode=kPlayMode` |
| `⌘Numpad One` | Switch Mode | `WindowMode=kSetupMode` |
| `⌘Numpad Three` | Switch Mode | `WindowMode=kEngraveMode` |
| `⌘Numpad Two` | Switch Mode | `WindowMode=kWriteMode` |
| `⌘P` | Switch Mode | `WindowMode=kPrintMode` |
| `H` | Toggle between Hand and Marquee Tool |  |
| `F2` | Transport Window |  |
| `⌘Z` | Undo |  |
| `⌘⌃F` | View.FullScreen |  |
| `⌥⌘Numpad Zero` | Whole Page |  |
| `⌘Numpad Zero` | Window.HideAllPanels |  |
| `⌥⌘Numpad One` | Window.SwitchLayoutAspectType | `LayoutAspectType=kPageViewAspect` |
| `⌥⌘Numpad Two` | Window.SwitchLayoutAspectType | `LayoutAspectType=kGalleyViewAspect` |
| `Z` | Zoom In |  |
| `⌘Numpad Equal` | Zoom In |  |
| `X` | Zoom Out |  |
| `⌘Numpad Minus` | Zoom Out |  |

## Play mode (7)

| Keys | Action | Parameter |
|---|---|---|
| `⌘Left Bracket` | Navigate Backwards |  |
| `⌘Right Bracket` | Navigate Forwards |  |
| `D` | Set Tool | `ToolName=kDraw` |
| `E` | Set Tool | `ToolName=kErase` |
| `S` | Set Tool | `ToolName=kObjectSelection` |
| `Z` | Zoom In |  |
| `X` | Zoom Out |  |

## Setup mode (16)

| Keys | Action | Parameter |
|---|---|---|
| `⇧I` | Add Instrument to Player... |  |
| `Backspace` | Delete Player/Instrument/Flow/Layout |  |
| `Delete` | Delete Player/Instrument/Flow/Layout |  |
| `Insert` | Insert Player/Instrument/Flow/Layout |  |
| `⌥←` | Move Flow Left |  |
| `⌥→` | Move Flow Right |  |
| `⌥⌘→` | Move Flow to End |  |
| `⌥⌘←` | Move Flow to Start |  |
| `⌥↓` | Move Player Down |  |
| `⌥↑` | Move Player Up |  |
| `⌥⌘↓` | Move Player to Right |  |
| `⌥⌘↑` | Move Player to Top |  |
| `⇧F` | New Flow |  |
| `⇧L` | New Layout | `Type=kCustomScoreLayout` |
| `⌥⇧P` | New Section Player... |  |
| `⇧P` | New Solo Player... |  |

## Step input (44)

| Keys | Action | Parameter |
|---|---|---|
| `Space` | Advance Caret |  |
| `Numpad Slash` | Create Grace Note |  |
| `⇧V` | Create Voice |  |
| `Backspace` | Delete Left |  |
| `Delete` | Delete Right |  |
| `Colon` | End Tuplet Input |  |
| `A` | Input Pitch | `Pitch=A` |
| `B` | Input Pitch | `Pitch=B` |
| `C` | Input Pitch | `Pitch=C` |
| `D` | Input Pitch | `Pitch=D` |
| `E` | Input Pitch | `Pitch=E` |
| `F` | Input Pitch | `Pitch=F` |
| `G` | Input Pitch | `Pitch=G` |
| `⌃A` | Input Pitch | `Pitch=A&Down=true` |
| `⌃B` | Input Pitch | `Pitch=B&Down=true` |
| `⌃C` | Input Pitch | `Pitch=C&Down=true` |
| `⌃D` | Input Pitch | `Pitch=D&Down=true` |
| `⌃E` | Input Pitch | `Pitch=E&Down=true` |
| `⌃F` | Input Pitch | `Pitch=F&Down=true` |
| `⌃G` | Input Pitch | `Pitch=G&Down=true` |
| `⌥⇧A` | Input Pitch | `Pitch=A&Up=true` |
| `⌥⇧B` | Input Pitch | `Pitch=B&Up=true` |
| `⌥⇧C` | Input Pitch | `Pitch=C&Up=true` |
| `⌥⇧D` | Input Pitch | `Pitch=D&Up=true` |
| `⌥⇧E` | Input Pitch | `Pitch=E&Up=true` |
| `⌥⇧F` | Input Pitch | `Pitch=F&Up=true` |
| `⌥⇧G` | Input Pitch | `Pitch=G&Up=true` |
| `L` | Lock Note Durations |  |
| `⌘←` | Move Caret Left by Bar |  |
| `⌘← (numpad)` | Move Caret Left by Bar |  |
| `⌘→` | Move Caret Right by Bar |  |
| `⌘→ (numpad)` | Move Caret Right by Bar |  |
| `↓` | Move Down |  |
| `↓ (numpad)` | Move Down |  |
| `←` | Move Left |  |
| `← (numpad)` | Move Left |  |
| `→` | Move Right |  |
| `→ (numpad)` | Move Right |  |
| `↑` | Move Up |  |
| `↑ (numpad)` | Move Up |  |
| `V` | Next Voice |  |
| `Semicolon` | Start Tuplet Input |  |
| `⇧S` | Stop Slur |  |
| `⌥Numpad Slash` | Toggle Grace Note Slash |  |

## Write mode (89)

| Keys | Action | Parameter |
|---|---|---|
| `Q` | Chord Input |  |
| `⇧B` | Create Bar or Barline |  |
| `⇧C` | Create Clef |  |
| `⇧D` | Create Dynamic |  |
| `⇧H` | Create Hold or Pause |  |
| `⇧K` | Create Key Signature |  |
| `⇧L` | Create Lyrics |  |
| `⇧O` | Create Ornament |  |
| `⇧P` | Create Playing Technique |  |
| `⇧A` | Create Rehearsal Mark |  |
| `⇧T` | Create Tempo |  |
| `⇧X` | Create Text |  |
| `⇧M` | Create Time Signature |  |
| `⌥Left Bracket` | Decrease Rhythmic Grid Resolution |  |
| `Numpad Period` | Dotted Notes |  |
| `⌘⇧←` | EventEdit.NavigateLeftExtendBar |  |
| `⌘⇧← (numpad)` | EventEdit.NavigateLeftExtendBar |  |
| `⌘⇧→` | EventEdit.NavigateRightExtendBar |  |
| `⌘⇧→ (numpad)` | EventEdit.NavigateRightExtendBar |  |
| `⇧←` | Extend Selection Left |  |
| `⇧← (numpad)` | Extend Selection Left |  |
| `⇧→` | Extend Selection Right |  |
| `⇧→ (numpad)` | Extend Selection Right |  |
| `O` | Force Note Durations |  |
| `⌥Right Bracket` | Increase Rhythmic Grid Resolution |  |
| `⌥⇧→` | Lengthen Duration | `UseRhythmicGridValue=true` |
| `⌥⇧→ (numpad)` | Lengthen Duration | `UseRhythmicGridValue=true` |
| `⌥←` | Move | `Direction=Left` |
| `⌥← (numpad)` | Move | `Direction=Left` |
| `⌥→` | Move | `Direction=Right` |
| `⌥→ (numpad)` | Move | `Direction=Right` |
| `I` | Note input mode |  |
| `Insert` | Note input mode |  |
| `⌥Numpad Period` | NoteInput.CycleNumDots |  |
| `U` | NoteInput.Scissor |  |
| `⌥↑` | Pitch | `Direction=Up` |
| `⌥↑ (numpad)` | Pitch | `Direction=Up` |
| `⌥↓` | Pitch | `Direction=Down` |
| `⌥↓ (numpad)` | Pitch | `Direction=Down` |
| `⌥⇧↑` | Pitch | `Direction=Up&Chromatic=true` |
| `⌥⇧↑ (numpad)` | Pitch | `Direction=Up&Chromatic=true` |
| `⌥⇧↓` | Pitch | `Direction=Down&Chromatic=true` |
| `⌥⇧↓ (numpad)` | Pitch | `Direction=Down&Chromatic=true` |
| `⌥⌘↑` | Pitch | `Direction=Up&Octave=true` |
| `⌥⌘↑ (numpad)` | Pitch | `Direction=Up&Octave=true` |
| `⌥⌘↓` | Pitch | `Direction=Down&Octave=true` |
| `⌥⌘↓ (numpad)` | Pitch | `Direction=Down&Octave=true` |
| `R` | Repeat Item |  |
| `⌥Numpad Equal` | Respell Using Note Name Above |  |
| `⌥Numpad Minus` | Respell Using Note Name Below |  |
| `Comma` | Rests |  |
| `⌘←` | Select Left by Bar |  |
| `⌘← (numpad)` | Select Left by Bar |  |
| `⌘→` | Select Right by Bar |  |
| `⌘→ (numpad)` | Select Right by Bar |  |
| `Numpad Equal` | Set Accidental | `Type=kSharp` |
| `Numpad Minus` | Set Accidental | `Type=kFlat` |
| `Numpad Zero` | Set Accidental | `Type=kNatural` |
| `Backslash` | Set Articulation | `Value=kTenuto` |
| `Double Quote` | Set Articulation | `Value=kUnstress` |
| `Left Brace` | Set Articulation | `Value=kStress` |
| `Left Bracket` | Set Articulation | `Value=kAccent` |
| `Right Brace` | Set Articulation | `Value=kStaccatissimo` |
| `Right Bracket` | Set Articulation | `Value=kStaccato` |
| `Single Quote` | Set Articulation | `Value=kMarcato` |
| `Vertical Bar` | Set Articulation | `Value=kStaccatoTenuto` |
| `Numpad Eight` | Set Note Duration | `LogDuration=kSemibreve` |
| `Numpad Five` | Set Note Duration | `LogDuration=kQuaver` |
| `Numpad Four` | Set Note Duration | `LogDuration=kSemiQuaver` |
| `Numpad Nine` | Set Note Duration | `LogDuration=kBreve` |
| `Numpad One` | Set Note Duration | `LogDuration=k128Note` |
| `Numpad Seven` | Set Note Duration | `LogDuration=kMinim` |
| `Numpad Six` | Set Note Duration | `LogDuration=kCrotchet` |
| `Numpad Three` | Set Note Duration | `LogDuration=kDemiSemiQuaver` |
| `Numpad Two` | Set Note Duration | `LogDuration=kHemiDemiSemiQuaver` |
| `⌥⇧←` | Shorten Duration | `UseRhythmicGridValue=true` |
| `⌥⇧← (numpad)` | Shorten Duration | `UseRhythmicGridValue=true` |
| `Lessthan` | Start Hairpin | `Type=kGradualDynamicUp&GradualDynamicType=kCrescOrDim` |
| `Morethan` | Start Hairpin | `Type=kGradualDynamicDown&GradualDynamicType=kCrescOrDim` |
| `⌥Lessthan` | Start Hairpin | `Type=kGradualDynamicUp&GradualDynamicType=kMessaDiVoce` |
| `⌥Morethan` | Start Hairpin | `Type=kGradualDynamicDown&GradualDynamicType=kMessaDiVoce` |
| `Enter` | Start Note Input | `Set=true` |
| `Numpad Enter` | Start Note Input | `Set=true` |
| `Numpad Enter` | Start Note Input | `Set=true` |
| `⇧N` | Start Note Input | `Set=true` |
| `S` | Start Slur |  |
| `Question Mark` | Stop Hairpin |  |
| `Escape` | Stop Note Input |  |
| `T` | Tie |  |
