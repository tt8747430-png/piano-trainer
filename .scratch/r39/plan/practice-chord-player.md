# R39-10 · Chord player, redesigned

Premium here means a chord sheet that reads like a lead sheet and plays like Musicca's chord player: sections of bars,
each chord tapped to change it, the keys showing what sounds, nothing on screen that is not the song.

## The rulings as they stand

- **One way to each act: three duplicates gone** (owner, 2026-11-28: "check whether we dont have duplicate actions"). Why: one way to each action (ui-and-mockups, Actions), every act listed on both sizes: (1) the section's sheet held Loop this section, the same loop the bar's Loop sets (it loops the section picked), so the sheet keeps Section ⇕ and Duplicate section; (2) the phone's ☰ held Repeats, opening the very Playback options the transport's ▾ opens, so ☰ keeps the sheet's places (Chords, Style, Key, Tempo, Audio, Chart, MIDI); (3) the laptop's metronome button cycled Count-in · On · Off while Playback options set the Count-in too, so the button is the click alone, on or off (crossed while off, as the phone's Metronome switch), and the Count-in has one home, Playback options, on both sizes. Kept as distinct: Undo in the band (the sheet's history) and in a toast (that one act); Save as my chord sheet… (the library) and Save to my progressions (Practice's).
- **Genos: Follow first, the panel under it** (the loop, 2026-11-28). Why: controls never jump between modes (ui-and-mockups, Layout: nothing traps a click), measured: the laptop's Genos panel drew its card above Follow a MIDI arranger, so switching it on pushed the switch 80 down and left the pointer on Start/Stop, a second click away from starting the arranger. Follow leads now and the card appears under it; the switch stands at 152 before and after (board and app).
- **The chart's first head level with the panel's title** (the loop, 2026-11-28). Why: shared edges across columns (scan-first 1; edge-lines, alignment), measured: the chart's scroller stood 22 under the band, so Verse read at 96–115 beside G major chords at 86–106, 9.5 low, where the code's own note says the two stand level. Its top is 10 now: the section's head row is 74 to 118, the panel head's fold button's row, and the two titles share a line (board and app); folded, Verse sits on the rail's first place.
- **Tab reaches a key in sight, and a toast shows its focus** (the loop, 2026-11-28). Why: keyboard only, focus visible (testing, What to drive by hand), measured by a Tab walk at 402 and 1710: the keys' one Tab stop was the range's first key, F2, 20 off the phone's left edge while the keys stood scrolled to the chord, and the toast took focus with no ring (the primitive's `outline-none` beat the app's one outline). Tab into the keys now lands on the lowest key fully shown (G2 on the phone), and the toast wears the app's ring, 3 of `ring` 2 out. The kit's `PianoKeyboard` and `Toaster`, so every piano and toast in the app.
- **The rail, one stop on the keyboard** (the loop, 2026-11-28). Why: keyboard only, Tab order (testing, What to drive by hand) and WAI-ARIA's Tabs pattern: the rail's tab list made each of its five places a Tab stop, so reaching the chart took five more presses. It is one stop now, the chosen place (else the first); ↑ ↓ move between the places, Home and End to the ends, Enter or Space opens one. The kit's `Rail`, so the Player's and the editor's rails too.
- **A band's popover stays under the band on a short screen** (the loop, 2026-11-28). Why: port from the board's code (POPOVER: at its trigger, 72 down, no taller than 760 nor the room below less 16) and every width holds (craft-details, 5), measured at 1024×768: the app's Style popover, taller than the room below, was moved by the positioner to 4, over the band and its own pill, with the toast on it. The band's popovers never leave the band's foot now (`collisionAvoidance` side none): 72 to 752, scrolled within; and every panel popover stops 16 above the foot as the board's (Base UI's 5 and 11 of its cap), 760 at most.
- **Share on someone's sheet, Copy link alone** (the loop, 2026-11-28). Why: every state drawn (CLAUDE.md, Complete): the app's Share on a sheet opened from someone's link drops People with the link (its access is its owner's) and keeps Copy link; the boards always drew the choice. Both draw the state, a States entry (From someone’s link) opening it. The strings the app had kept from earlier designs and read nowhere (the arranger's states, the settings' explanations, a shared sheet's view-only and live lines, Hear, Export, Transport) are deleted in en and ru.
- **Share offline, said over Copy link** (the loop, 2026-11-28). Why: every state drawn (CLAUDE.md, Complete: offline) and errors shown beside the action that failed (craft-details, Errors): the app's Share, offline, says “You’re offline. Connect to share.” over Copy link (the kit's `Problem`, 14 in crimson, 8 above the button); the boards had no offline state. Both boards draw it, a States entry (Offline) opening it.
- **A footnote stays a footnote** (the loop, 2026-11-28). Why: port from the board's code (a section's Genos tag and the phone's state at 13/600), measured: the app drew both at 16, though their classes say `text-footnote`; `cn` (tailwind-merge's tables) did not know the theme's text sizes, read `text-footnote` as a colour and dropped it beside `text-muted-foreground`. The theme's sizes (footnote, subhead, place, name) and corners (tile, thumb, mark, keys) are registered in `shared/lib/cn.ts` now, so every screen that joins a size and a colour draws the size its class names.
- **The laptop's toast 28 over the keys** (the loop, 2026-11-28). Why: one placement per thing (the kit's TOAST: every laptop toast 28 up; the app's `toast-foot` adds the keys docked at the foot), measured: the board's toast stood 296 from the foot, 126 over the 170 keys, a height left from R76's floating dock; the app's stands 198, 28 over the keys. The board takes 170 + 28.
- **The chart's bars 8 apart at every width** (the loop, 2026-11-28). Why: gaps on the 4/8 scale (seven-questions 2, spacing-audit), measured: the laptop chart's bars stood 6 apart, across and down, on the board (CHART59's 6) and in the app (`lg:gap-1.5`), where the phone's are 8. Both are 8 now: at 1710 each bar 294.5 wide, 302.5 apart across and 84 down.
- **A tablet's keys a phone's size, more of them** (the loop, 2026-11-28). Why: every width holds (craft-details, 5) and one piano, one size (the feedback log's "one keyboard"), measured: at 744 the phone's F2 to A4 stretched across the window, 17 white keys 44 wide each, where a phone's are 26 and a laptop's 36. From 600 wide (the chart's four-bar width, one constant `WIDER_THAN_PHONE` now) the keys take the laptop's C2 to C7 at the phone's 26, the chord kept in sight; under 600 nothing changes.
- **☰'s card lifts as the board's** (the loop, 2026-11-28). Why: port from the board's code (FMENU: a 1px ring of ink at 6%, 0 18px 48px -12px at 38%), measured: the app's ☰ wrote that shadow by hand, but the popover's own `layer-shadow` won in the CSS order, so the card drew a dialog's 1px sand ring and short shade. It is a token now, `elevation-menu` (in the theme's `--shade`, so it follows by Night), and it takes its place over the primitive's.
- **A key hint, the smallest mark** (the loop, 2026-11-28). Why: one scale of corners (DESIGN.md, Shapes), measured: the Search palette's ↑ ↓ ↵ Esc stood 6 round on the boards, a corner the scale lacks, and 12 in the app, where the kit's `Kbd` took `rounded-md` (the control's 12), a circle on a 24 square. A key hint is one of the smallest marks, 4 (`mark`), on every board that draws one and in the app's `Kbd`.
- **A bar 8 round** (the loop, 2026-11-28). Why: one scale of corners (DESIGN.md, Shapes: a tile 8), measured: the board's bars and the + after them were 6 round, a corner the scale does not have; the app's are 8 (`rounded-tile`). The board takes 8.
- **The phone's state in its colour** (the loop, 2026-11-28). Why: port from the board's code (the name's state on a phone: Draft in honey ink `#7A5418`, Live after an 8 grass dot 8 before its word, Not saved and Saved in soft ink), measured: the app drew every state in soft ink alone. It takes the board's (`honey-ink`, `learned`); the board's dot was a one-off #3F7A4A and is the kit's grass #44684A, the app's `learned`.
- **The Genos panel's title names the Main that plays** (the loop, 2026-11-28). Why: one value on every face (the app's `playingMain` and `playing`): the board's title read "Genos · playing Main A" whatever was lit, even with no Main lit (the standing ruling: none at rest). It reads the Main the arranger plays (Genos · playing Main C), Genos · playing with none, Genos · stopped while stopped.
- **The chart ends 24 under its last part** (the loop, 2026-11-28). Why: no control reserves space it does not use (ui-and-mockups, Layout), measured: scrolled to its end, the phone board's chart stood Add section 330 over the Genos, its foot padded 242 by R76's sum (the keys and the floating Controls dock, both under the chart in R77, never over it); the app's ends 24 under Add section (`pb-6`) and the Genos row stands in the flow under it. The board's foot is the app's 24, and R76's layout values (the places, sizes, zones and tray of Edit layout, 55 in all) go from its code.
- **A menu's hairline, the kit's one** (the loop, 2026-11-28). Why: a value comes from the layer below, never patched in (edge-lines, laws: the design system as layers, 1: a `.replace()` on a helper's output is drift): the name menu's three hairlines were the ☰ hairline (4 over and under) rewritten to 6 by `.replace()`, and ROWMENU wrote the same 6/12 hairline inline twice; `r41_kit.MENUSEP` is the one, as the app's `DropdownMenuSeparator` (`mx-3 my-1.5`). No visible change.
- **The band a finger's size on a touch screen** (the loop, 2026-11-28). Why: 44 on touch (craft-details, Hit area), measured by the harness at 1024×768 touch (a tablet on its side takes the laptop's band): every round button and pill of the band stood 40, Playback options' ▾ 24 by 40. On a coarse pointer each reaches 44 by a `::before` 2 out (the next stands 8 off, so no two reaches cross) and the ▾ is 44 wide, its reach growing only up and down; a mouse sees the board's 40 unchanged. The harness's dialog check no longer counts a toast (Base UI's non-modal dialog) as a sheet without its backdrop, nor a passing toast as a layer over the chart.
- **Playing: Stop's square, Play answering at once, the chord in full** (the loop, 2026-11-28). Why: port from the board's code (the Chord player's `hdPlayD`, a square while playing, `hdPlayTip` Stop; CP_KEYS' HANDC, the hands' full paint while a chord sounds) and feedback within 100ms (ux-principles, Feedback), measured: the app named the button Stop and drew Pause's two bars; a count-in left it reading Play for 2.5 s after the press (the engine set its state before telling anyone, so the first window, a bar away, was what told the screen); and the keys kept the sounding chord's wash while the voicing's own keys went down sky blue an octave off, two pictures of one chord. Stop is the board's square (Play starts again from the chord chosen, never mid-beat), Play turns to Stop in 80 ms, and the keys show the sounding chord in full where they show it waiting (`LiveKeyboard`'s `sound`), the count-in keeping it a wash.
- **The chord shown stays in sight** (the loop, 2026-11-28). Why: nothing cut at any width (craft-details, 5), measured at 1024: the laptop's keys, C2 to C7, are wider than the 596 the rail leaves, and opened centred on their range, so the chord at rest (G2 in the left hand, B2 D3 G3 in the right) stood at the edge with its G out of view. The keys keep the chord shown in sight (`inView`), whether it waits or sounds; from 1710 the whole range shows and nothing moves.
- **The band's Undo takes back an edit, and rests without one** (the loop, 2026-11-28). Why: a control that does nothing says so (scan-first 4) and the board does what the app does: the app's band Undo is the sheet's own history (`hand.canUndo`), resting at half strength on a sheet just opened or started; the board's was ink on every saved sheet and its click only reset a layout. The board keeps each edit's chart before it (a section's or chord's change, a Genos mark), Undo takes back the last one, and opening or starting a sheet clears the history. No toast: the chart itself shows what came back.
- **The keys show the chord picked while stopped** (the loop, 2026-11-28). Why: port from the board's code (CP_KEYS' `slot`: the chord sounding while it plays, else the one picked, else the first; "each a wash while it waits and full while it sounds") and Musicca's chord player, where a chord tapped shows its keys: the app's keys stayed bare until Play, C3 and C4 alone, so a tap that picked a chord showed nothing of it. They show the picked chord (else the first) in its hands' wash, the left hand's lilac ringed, the right hand's brick, each named; while it plays, the chord sounding in full.
- **The sheet in hand deleted reads Not saved** (the loop, 2026-11-28). Why: a state named truly (R38: a loss named as one; one value on every face): with the open sheet deleted from the library, the app's name reads Not saved, the chart kept in hand, and Undo makes it Saved again; the board kept Live. The board does the same now.
- **A sheet at its trigger 760 at most** (the loop, 2026-11-28). Why: port from the board's code (POPOVER: no taller than 760 nor the room below it less 16), measured: the app's library at the name stood 744 tall on the 904 laptop, capped at the screen less 160, where the board's stands 760. The kit's anchored sheet takes the board's cap, every sheet opened at its trigger with it (on a 1024×768 screen it ends 21 above the foot).
- **A laptop's form 480, a name alone too** (the loop, 2026-11-28). Why: port from the board's code (LAPSHEET: 440 inside 20 a side on every board, so 480), measured: the app's Save as my chord sheet… and Rename chord sheet stood 440 with a 398 field where the board's stand 480 with a 440 field, at 615; the kit's `MakeSheet` drew a name-only form 440 and a form of several parts 480, a split no board makes. Every form is 480 on a laptop now (New song, folders, Import, every New and Rename in the app).
- **Rename over the library; the row menu's icons the app's for now** (the loop, 2026-11-28). Why: the board does what the app does (owner-way, Port from the board's code): the app's Rename chord sheet rises over the library and returns to it; the board closed the library and drew the form over the chart. It stands over the library now, dimmed under its scrim. Decided, not changed: the app's row menus draw an icon beside each act in all 27 menus of the app, where the kit's ROWMENU draws words alone on every board; it is one app-wide shape, so the Chord player keeps the app's, and the kit question goes to the round that takes every area's menus.
- **The phone's library a page with ←** (the loop, 2026-11-28). Why: port from the board's code (FSHEET: a phone's page from ☰ or the name's menu is the whole screen with ← and the title, never a drawer with Done), measured: the app's phone library rose as a tall sheet with a grabber and Done over the chart; it is the kit's `PhonePage` under 1024, the popover at the name from 1024. A page rising closes the toast left from below (`PhonePage` takes `useClearsToast`, as `Sheet` and ☰ do): "Opened I – V – vi…" had lain over its progressions.
- **My chord sheets empty, said** (the loop, 2026-11-28). Why: every state drawn (CLAUDE.md, Complete; scan-first 8): with its last sheet deleted the board's My chord sheets stood as a bare head; it says the app's line, None saved yet. Save the sheet in hand from its name, 16 in soft ink at the rows' 4 inset.
- **All chord sheets, the library on the board; Delete with Undo** (the loop, 2026-11-28). Why: every row opens something true (owner-way, Port from the board's code) and a loss that can be undone happens at once with Undo (CLAUDE.md, R38): the board's All chord sheets linked to the Progressions board, which holds no chord sheets, while the app opens its library (`LibrarySheet`): My chord sheets, each row's ··· (Rename, Duplicate, Delete), Songs, Progressions by style. The board draws it now, a page with ← on a phone and a 320 popover at the name (64, 60) on a laptop, its two-line rows 56 apart as the app's; the ··· menu stands at its button (the kit's ANCHOR finds a popover's frame). The app's Delete asked "Delete …? The chord sheet is gone for good." though the sheet can be put back: it is deleted at once, "“Blues in F” deleted · Undo", in its place again on Undo; the empty line names the name's menu, where the ⋯ menu it named is gone.
- **A level, the app's slider on the board** (the loop, 2026-11-28). Why: one shape per thing, board and app (the kit's `Slider`: a 4 track in the line's sand, ink to the value, a white 28 thumb on `elevation-thumb`): the board's Volume levels were the browser's own range, a thick bar and an ink thumb, nothing the app draws. They take the app's look, still native ranges that drag and key (`data-level`, styled once by index.py).
- **R76's Edit layout gone from the code too** (the loop, 2026-11-28). Why: no legacy (CLAUDE.md, Final code only): R77 replaced the learner's Edit layout with one place per panel, yet the app kept its 48 strings (Edit layout, Reset layout, the places, sizes and moves, Resize the keys) in en and ru, used nowhere, and the boards kept the keys' resize grip behind a state nothing sets. Both are deleted; nothing on screen changes.
- **Share at the name; a menu 4 under its button** (the loop, 2026-11-28). Why: a sheet from a menu stands at the button that opened the menu (Sheet's `justPressed`; the board's ANCHOR), measured: the board's laptop Share stood fixed at 640, 160; the app's, opened right after Save as my chord sheet… (Share on a sheet not yet saved saves it first), stood at 5, 60 over the rail, because it took its place from the closing form's Save. Both stand at the name now, 64, 60, as its menu; a sheet opened from a press in a closing dialog stands at that dialog's opener. The app's menus stand 4 under their button, as the kit's ANCHOR on every board (the app's were 6).
- **Share, the board's form; signed out drawn** (the loop, 2026-11-28). Why: no explanation line under a control (ui-and-mockups, Words) and every state drawn (CLAUDE.md, Complete): the app's Share opened on a line (Everyone with the link sees each change…) over a segmented control with no visible head, Copy link in a footer, where the board draws People with the link as a 15/600 head over View only · Can edit and Copy link 24 under it; the board had no signed-out state, which the app shows (Sharing needs an account, Sign in). The app takes the board's form and drops the line (en and ru); the board draws Signed out in its States box, Sign in opening the sign-in board.
- **Volume in place, in Audio** (the loop, 2026-11-28). Why: one head per page and every row opens something true (ui-and-mockups, Actions): the app's Volume › opened a sub-page inside the panel that stacked a second Back under the panel's head and said Volume twice, on the phone's page and in the laptop's rail; the board's Volume row opened nothing. Audio now holds the levels under one Volume head between the parts' card and Voicing: Master first, then each part that is on, its name and % over the slider, 16 apart, 24 between the sections. The kit's slider box holds its 28 thumb (it was the 4 track, the thumb spilling 12 over the row above and below), as the board's.
- **A stepper's value without side padding; 16 on a phone's page** (the loop, 2026-11-28). Why: port from the board's code (the kit's `STEPPER`: the value's min-width alone, no padding; PHROWS sets a phone page's 15 at 16), measured: the app's Repeats stepper on ☰'s Playback options stood 166 wide at 15 where the board's is 162 at 16. The kit's Stepper drops its value's 4 a side (every stepper, as the board's), and the Chord player's Repeats reads 16 on a phone's page, 15 in the band's popover.
- **A sheet's pickers at the board's widths, the chevrons at their end** (the loop, 2026-11-28). Why: port from the board's code (`POP59`: min-width 72, 120, 136, `justify-content: space-between`), measured: the app's chord sheet set its Root picker at its words' width (60), Quality at 112 and Bass note at 128, each with its ⌃⌄ beside the words, so the three ran ragged down the card; they are 72, 120 and 136 with the chevrons at their far end, as the board, and the section sheet's Section picker takes the same end.
- **The chosen one marked by Lucide's check** (the loop, 2026-11-28). Why: one icon set (craft-details, Icons; the app draws `Check` at 20 in the Styles list and the name menu): the board marked the chosen style and the sheet in hand with a text ✓ at 15, a glyph of the font beside Lucide's icons. Both boards draw Lucide's check at 20 now, leading in the Styles list's 20 column and trailing in the name menu.
- **☰'s glyphs at 24** (the loop, 2026-11-28). Why: port from the board's code (FROW's FICONS, drawn at 24; a place's icon is 24, DESIGN.md), measured: the app's phone menu drew its row glyphs at 22, so every word stood at 82 where the board's stand at 84; they are 24 now, the → that opens a page staying 22.
- **The rail's Search opens the app's palette** (the loop, 2026-11-28). Why: every row opens something true and the board does what the app does (owner-way, Port from the board's code): the app's rail Search opens the app-wide search palette (AppLayers' board, `widgets/search-palette`), where the board only toasted "Search: type a chord, a style or an act". The board draws the palette at rest, measured as the app's: 640×488 at 96, the field, Suggestions (Continue, Chords, Metronome), the keys under a hairline.
- **Shortcuts on a laptop, the boards' card, in the app** (the loop, 2026-11-28). Why: port from the board's code (KEYSCARD_F, CPKEYS): the app's Shortcuts hung from the bar as the phone's sheet, its keys in caps, where every laptop board (Player, editor, Chord player) draws Flat's card centred 120 from the top, a 64 head with Close over a hairline, the groups in two columns of 40 rows, the keys in soft ink at the row's end. The app draws that card from the laptop width up (the Search palette's pattern: a dialog when wide, the sheet otherwise), three columns past eight rows (840); measured, 640×284 at 120 on both. A phone keeps its sheet.
- **Shortcuts, the siblings' card; Space plays, never the pedal** (the loop, 2026-11-28). Why: one shape per thing (the Player's and the editor's rail open KEYSCARD_F) and every row opens something true: the board's Shortcuts only toasted "Space plays · L loops · K the keys", naming L and K, which the Chord player does not bind. It opens the Shortcuts card with the keys the app holds, in its groups: Chord player (Play or stop Space, Undo ⌘ Z, Redo ⇧ ⌘ Z), Piano keys (Play the keys A – ’, An octave down, up Z X), Anywhere (Show the shortcuts ?). The app listed Space twice, Play or stop and Hold the pedal, and both ran: the Chord player's keys give Space to Play, as the Player's (`spacePedal={false}`), the pedal being a MIDI keyboard's.
- **The phone's Genos row at most 560, centred** (the loop, 2026-11-28). Why: every width holds, nothing stranded (craft-details, 5): at 744 (an iPad upright) the phone's Genos row ran the window's width with Main A–D capped at 320, leaving 230 of bare card between D and ⌃. Wider than a phone the row keeps the laptop dock's 560 (GDOCK77), centred over the keys, Main A–D sharing what the dot, Play, ⌃ and — leave; at 402 it is unchanged, 16 in from each edge.
- **The Genos card at the board's 12; Try again a quiet pill** (the loop, 2026-11-28). Why: port from the board's code (GENOS76's card, ARLINE77), measured: the app's Genos card stood 8 from its top to the status row where the board's is 12 all round, and its Try again was a 44 button at 16/700 where the board draws a 36 pill on the fill at 14/600 (its reach still 44), the line beside it at 14 on 1.35. Both are the board's now, the status row at the same 169 in the rail's panel.
- **No Main lit at rest, on the board too** (the loop, 2026-11-28). Why: the standing ruling (the Genos lamps 44 and 10 round: "no Main is lit until one is set or pressed") held in the app while the board's arranger started on Main A, lit in the panel, the docked strip and the minimized pill (Genos · Main A). The board starts with none: every Main lamp at rest, the pill reading Genos alone and named "Genos: show its controls", as the app's `pill` and `pillLabel`.
- **A toast in two lines at most** (the loop, 2026-11-28). Why: a toast is one sentence of about eight words (ux-writing, Microcopy is short), and nothing it says may cover the chart: opening a sheet named by its 40 numerals ran "Opened I – V – vi…" to four lines over the chart's last row. The kit's toast (the app's `Toaster`, the board's `TOAST`) holds its words to two lines, the rest ending in …; its Undo keeps its place.
- **A long chart keeps Add section whole** (the loop, 2026-11-28). Why: nothing cut at any length (testing, Real content: a folder of many songs, the longest title): measured with a sheet of 40 chords, the chart's scroller, a flex column, squeezed Add section's card (its corners clipped by `overflow-hidden`) to 0 tall, so the chart ended on a hairline and a new section could not be added. The chart's parts keep their height and the chart scrolls, as the board's, whose Add section stands 24 over the Genos strip at the scroll's end.
- **A section's Genos marks, the board's heads; laptop sheets 12 apart, at their trigger** (the loop, 2026-11-28). Why: port from the board's code (`CP_TAG`, `_SECTG`; POPOVER's 12 and BSHEET's 16), measured: the app's Genos marks sheet held each choice in a grey group under the uppercase MAIN, EACH TIME THROUGH with an ⓘ, Ending before Into the next section and the passes named 1st time; it is the board's now, a 15/600 head over the segmented control 8 apart, the groups 24 apart, Intro, Main, 1st time (and each pass), Into the next section, then Ending, the ⓘ gone. The chord's and the section's sheets kept a phone sheet's 16 between their card and what follows inside a laptop's popover, where the board's is 12; and a laptop's sheet popover opened at its trigger's left and 8 under it whatever side of the screen, where the board's `ANCHOR` takes the trigger's nearer edge (its left on the screen's left half, its right on the right) and 4 under. Both are the board's now; the board's Genos popover, fixed at 640, 160, opens at its chip, 4 under the chip's face as the app's. One `SheetSection` gives the chord sheet's Suggested chords and every Genos head their shape.
- **A phone's toast 12 over the foot** (the loop, 2026-11-28). Why: what floats keeps one gap over what stands at the foot (DESIGN.md, the floating gap; the run bar's "12 over the keys"): the board's toast stood at 256 whatever stood under it (110 over the keys, 30 over the Genos row), and the app's reserved 76 for a tab bar the full screen does not show. It stands 12 over the keys, or over the Genos row when it shows; a full screen's foot is the home indicator's (`data-full-screen` takes `--nav-bar` to the safe area, as a place's screen that the tab bar steps away from).
- **A laptop's toast centres on the chart** (the loop, 2026-11-28). Why: what floats is centred on the page's one focus (ui-and-mockups, Layout): the board's laptop toast centred on the window and the app's on the app's 248 sidebar, which the full-screen Chord player does not have (its centre at 1024 stood 90 left of the chart's). It centres on what the rail leaves: beside the rail's 76, or the rail and its open panel's 428; the kit's `TOAST` takes `left`, the app's toaster reads the screen's `data-toast-over`.
- **Loop this section a switch row of 48** (the loop, 2026-11-28). Why: port from the board's code (`CP_SEC`, GROUP's toggle row), measured: the section sheet's Loop this section stood 56 in the app, where the board's switch row is 48, as every switch row of the kit; only the row that holds a 44 picker (Section) is 56.
- **A sheet's acts as wide as their words** (the loop, 2026-11-28). Why: nothing cut at any width (testing, the 393 check): the chord sheet's Duplicate and Play from here split the row evenly, so at 393 the app cut Play from here to "Play from he…" while Duplicate kept 20 it did not need, and on the board's 402 phone the words ran past their button. Each act starts at its words' width and the two share the rest (`flex: 1 1 auto`), the board's `QBTN` and the app's `SheetAct`.
- **Repeats' − and + rest at their bounds** (the loop, 2026-11-28). Why: a control that does nothing says so (scan-first 4): the board's − stayed ink at Until Stop and its + at 8 times, where the app's stepper rests each at half strength; the board's Playback options (band popover and phone page) take the kit's `STEPPER` bounds.
- **A phone's settings pages at a finger's size** (the loop, 2026-11-28). Why: a phone is not a small laptop: type and targets no smaller (craft-details, Phone; the board's PHROWS, which draws every page ☰ opens at 16 with a 16 inset where the rail's panel is 15 and 12): measured, the app's Style, Chart and Audio pages kept the panel's 15 heads and the Styles' 15 rows 12 in. On a phone the heads and rows are 16 and 16 in; from 1024 the panel's 15 and 12.
- **MIDI's words at the board's sizes** (the loop, 2026-11-28). Why: port from the board's code (`MIDI77`, GROUP's value row; PHROWS on a phone's page), measured: the app set Not connected at 15 beside its 16 Keyboard and the how-to-connect line at 15 on the phone's page, where the board sets the value at 16 always and the line at 15 in the band's popover, 16 on a phone (a phone's type no smaller than a laptop's); the row's end inset is the board's 12. `MidiBody` takes them.
- **The Genos lamps 44 and 10 round** (the loop, 2026-11-28). Why: measured against the app, the board's lamps were 40 tall and 9 round: under the 44 a finger needs on the phone (craft-details, Hit area) and 9 off DESIGN.md's corner scale. They are the app's 44, its 10 (`rounded-thumb`), on both boards. The lamps while stopped stay the app's: no Main is lit until one is set or pressed, the section's Variation deciding what the band plays.
- **The segmented track concentric; a panel's head at the font's leading** (the loop, 2026-11-28). Why: port from the board's code (SEGC; `_PHEAD`), measured: the app's segmented track was 10 round round its 10-round segments, where the board's is 12 (the segment's 10 plus its 2 inset, craft-details' concentric corners), and the Chord player's panel heads (Voicing, Written as, the Styles' families) stood 23 tall at 1.5 leading where the board's are 19, the font's own, so every control under them sat 4 low, the Styles list 4 more for each family down. The kit's `Segmented` takes the 12 everywhere in the app; the panel's head its leading.
- **A new sheet's state and its Play, the app's** (the loop, 2026-11-28). Why: one value on every face, and a control that does nothing says so (scan-first 4): the app's new sheet reads Not saved beside its name and rests Play at half strength while it holds no chord; the board's phone showed no state and both bands kept Play in full. Both draw it now, the transports taking the key that rests Play.
- **Four bars a row from 600 wide** (the loop, 2026-11-28). Why: every width holds (craft-details, 5): the chart kept the phone's two bars a row up to 1023, so at 744 each bar stretched to 353, wider than a laptop's at 1710, while the 518 chart of a 1024 laptop holds four. The row takes four bars once the window is 600 wide (each at least a 1024 laptop's 125): an iPad upright, a phone on its side, a laptop. Under 600 it stays the board's two.
- **Create closes the form, no hairline foot** (the loop, 2026-11-28). Why: port from the board's code (NEWNAME, and New song's SONGFORM): Save as my chord sheet… drew its Save in a footer under a hairline, 16 + 1 + 16 below the field, where the board draws it the form's last part, 16 under the field, 50 tall and round, held at the foot with the paper's 6 round it while a long form scrolls. The kit's `NewSheet` takes it, so every New form in the app (New song, New course, Record…) is the board's.
- **A phone sheet clears the toast, board and app** (the loop, 2026-11-28). Why: nothing covers a sheet's title or its way out (testing, What to look for): opening Save as my chord sheet… right after a sheet was opened left "Opened I – V – vi…" over the rising sheet, on its title and Cancel. A bottom sheet on a phone, and the Chord player's ☰, now close any toast as they open (the kit's `useClearsToast`, in `Sheet` and `PhoneMenu`: the toast had covered ☰'s Import chart…); a laptop's anchored card leaves it, standing apart from it. The phone board draws the same: a toast raised before a sheet rose steps aside, one raised from the sheet shows.
- **The phone header wider than a phone** (the loop, 2026-11-28). Why: every width holds (craft-details, 5) and every element is placed beside what it belongs with (ui-and-mockups, Actions): the phone header spread ←, the transport, the keys and ☰ evenly, as the board at 402, so at 744 and 852 the keys stood alone mid-bar. From 440 the transport follows ← 24 apart and the keys stand beside ☰ at the end, 24 apart; at a phone's width it stays the board's even spread.
- **A panel's title level with the chart** (the loop, 2026-11-28). Why: the lines (edge-lines, shared edges) found the app's rail panel title 2 above the chart's first section (84 against 86): the kit's head sets its 17 title at the font's own leading, as the board's `_PHEAD` and the app's `PanelPopover`; the rail's head took 1.375. One leading for a panel's title, in the Player's and the editor's panels too.
- **The band's Style, the families' list** (the loop, 2026-11-28). Why: "Styles by family" holds for every face of Style (one implementation): the band's Style popover still drew the wheel the ruling removed; it is the Styles panel's list now, capped at 760 and scrolled, a choice closing it as the app's.
- **A band's popover at its trigger, 8 under the band, measured** (the loop, 2026-11-28). Why: the earlier ruling (popovers from their trigger) held only by eye: measured, the board's five stood 4 to 13 right of their pills and the app's 4 into the band (its 8 counted from the 40 pill, not the 64 band). Both now: x the trigger's left, y 72.
- **The Genos pill one label** (the loop, 2026-11-28). Why: a label is read as one phrase (ux-writing, Fit): the minimized pill's "Genos · Main A" split into two flex items around its binding, the dot tight to Genos and 8 before Main A; it is one label now, as the app's (`chordPlayer.arranger.pill`).
- **The docked Genos says Start/Stop** (the loop, 2026-11-28). Why: port from the board's code (GDOCK77): docked over a laptop's keys the compact row is the Genos's own word, Start/Stop at 88, Main A–D sharing the rest of its 560 and ⌃ alone to the panel; the app drew the phone's ▶ glyph (a second Play beside the band's), Main capped at 320 and a — the board has no place for there. The phone keeps the glyph and —, its 341 holding Main A–D only so. Start/Stop's lamp is 88 with 6 in, in the full panel's head too.
- **A new sheet is saved from its name** (the loop, 2026-11-28). Why: every row opens something and the board must do what the app does (owner-way, Port from the board's code): the app's name menu, on a sheet not yet saved, leads with that sheet checked and ends on Save as my chord sheet… after a hairline, opening the kit's New form (Name, Save); the board had no way to keep a new sheet. Both draw it now: a bottom sheet on a phone, a centred form on a laptop (ui-and-mockups: a laptop centres only a form), "Saved {name}" in the toast, the sheet then in the list, checked.
- **One value per setting on every face; a play-along counts in** (the loop, 2026-11-28). Why: the same value says the same on every face (consistency): the phone's ☰ read Repeats × 3 while its Playback options page read Until Stop; both read the sheet's Repeats now. A new sheet counts in one bar (iReal Pro and Band-in-a-Box count a play-along in), as the board draws Count-in. A toast stands over the keys and the Genos row, never on them; the grip is the kit's `GRIP`, 18 with light dots, in the app's `DragHandle` too.
- **New sheet, at once, with Undo** (the loop, 2026-11-28). Why: a loss that can be undone happens at once with Undo in its toast (CLAUDE.md); the app asked "Start a new chord sheet? Your changes to this one are lost." though it already keeps the sheet it replaces. New sheet now says "Started a new chord sheet · Undo", Undo putting back the sheet in hand and the sheet that was open. A new sheet reads Not saved under its name (Draft, Live, Not saved, Saved: the app's four states).
- **Genos and Shortcuts, two glyphs** (the loop, 2026-11-28). Why: one icon, one meaning (ux-principles): the rail drew the Genos and Shortcuts as the same computer keyboard; the Genos, an arranger, wears Lucide's keyboard-music, Shortcuts the keyboard. The rail's words are 12, 600 on the place shown and 500 elsewhere, as the editor's.
- **A section's sheet: only what its head cannot hold** (the loop, 2026-11-28). Why: one way to each act (ui-and-mockups, Actions) and every row opens something: the board's section name opened the Genos marks, which their own chip opens, so a section could not be renamed, looped or duplicated; the app's sheet repeated the head's Repeat, Variation and Delete. A section's name opens its sheet, anchored under it on a laptop (380) and rising on a phone: one white card, Section ⇕ (Intro, Verse, Pre-chorus, Chorus, Bridge, Solo, Outro) and Loop this section, then Duplicate section on the quiet fill, as the chord's sheet. How often it plays, its variation and Delete stay on the head.
- **A picker wears the up-down chevrons** (the loop, 2026-11-28). Why: one icon, one meaning (ux-principles): the kit's select, the Progression and Chord finder boards and the app's Select mark a pop-up button with chevrons up and down (Apple HIG, Pop-up buttons), a single chevron down being a menu's or a pill's; the chord's sheet's Chord and Bass note pickers take them. The name menu is 280 wide on both.
- **One word for a keyboard not there; popovers from their trigger** (the loop, 2026-11-28). Why: ux-writing, Harmonize (one term per state: Settings, ☰ and the Player say Not connected; the MIDI page said None) and seven-questions 7 (a popover grows from its trigger): the band's Key, Tempo, Style, Playback options and MIDI popovers start at their trigger's left edge, 8 under the band, capped at 760 and scrolled (the kit's `POPOVER`), never flipped beside the band.
- **Styles by family, the feel where it differs** (the loop, 2026-11-28). Why: scan-first 2 (thirty-six rows in one card are a wall; group by what the learner hunts by) and 5 (emphasis is the difference: a feel on every row says nothing): the board drew six styles that are not the app's; it draws the app's catalogue, each family (Pop, Rock, Ballad, Worship and gospel, Hymn, Hip hop, Disco, Funk, Reggae, Latin, Jazz, Blues, Classical, then Piano patterns) a 15/600 head over its white card, 24 apart; a row's feel (swing, 3/4) only where the style departs from straight 4/4; a piano pattern's shelf in its place. The same in the rail's Styles panel and ☰'s Style page.
- **Tempo, the Metronome's face; every ☰ row a page** (the loop, 2026-11-28). Why: one implementation (the Metronome's tempo is the app's one tempo control, `TempoSteps`, the board's `TEMPO`), and craft-details' Inputs (a stepper for a value set often and precisely): a wheel hid all but five tempos and the app had no wheel to port it to, so the earlier "Key, Tempo and Repeats keep the app's wheel pickers" gives way. Tempo is the tempo's word and BPM over its figures at 40, −10 −1 and +1 +10 beside them, the slider between 40 and 240 under it, in the band's popover and on the phone's page. ☰'s Key, Tempo and Repeats (Playback options) open pages with ← back to ☰ as its other rows (R74), no longer sheets with Done.
- **Chart's two settings one shape; the phone's pages as the boards'** (the loop, 2026-11-28). Why: every row opens something (owner-way, the area in hand) and similarity: Time signature was a row with its value that opened nothing on the board; it is a sentence-case head over the five meters, as Written as and the app's. In the app, ☰'s pages take THINGPAGE's bare Back (a 44 with the 24 chevron, no glass: the page is the layer), MIDI's page reads Keyboard with its state and, while none is connected, how to connect one (Plug in a keyboard by USB or pair it by Bluetooth, then press a key.), then Follow; and a switch is on in the boards' grass-deep (#44684A, every board's TOGGLE), the app's lighter sage kept for Night.
- **A section's Genos tag never empty** (the loop, 2026-11-28). Why: scan-first 4 (every control says what it does): a section with nothing set for the Genos drew an empty chip on the board; it reads Genos in soft ink, as the app's, ink once a mark is set (Intro I · Main A, Main B · Fill in). The chip is 30 high, 12 in, 8 round, on both.
- **The Genos lamps' names in sentence case; the panel no strip of its own** (the loop, 2026-11-27). Why: one shape for a head across the area (the section sheet's ruling: no caption in capitals); Main, Intro and Ending/rit. are 12/600 soft over their lamps. In the rail's Genos panel the strip is in its place: it shows no Compact or Minimize, and its title (Pop 1 · stopped) keeps one line, cut with an ellipsis, as the board's head.
- **Key, the twelve keys in sight** (the loop, 2026-11-27). Why: CLAUDE.md, a key or root is one of `shared/ui/pickers`; a wheel hides eleven of twelve and a semitone stepper made the learner count ("G major → G major"). The band's Key pill names the key in full (A major); its popover, and the phone's Key page, is the kit's root grid, two tracks of six, in the sheet's own mode; a key taken moves the sheet there the short way (−5 to +6).
- **Playback options one card, the metronome's three modes, Randomize kept** (the loop, 2026-11-27). Why: one shape per kind of panel (similarity: Audio's and Chart's white card of rows); Flat's Playback options holds the metronome on a phone, whose header has no metronome button; the owner asked for Musicca's features, Randomize chords among them. Playback options is one white card: Repeats with its stepper at the row's end, Count-in under its name, and on a phone Metronome as a switch. The band's metronome presses through Count-in, On (a click on every beat while the sheet plays, the bar's first accented) and Off, each press said in a toast. Randomize chords stands after Import chart… in the name menu and ☰. The band gives way to the phone's header under 64rem, where it would overflow; the chord's sheet hangs under its chord on a laptop.
- **Ported now, and the loop on the Chord player alone** (owner, 2026-11-27: "now you work only on the chords player: implement the new design in the app and continue in loop only on the chords player"). The R77 port table below is built in its order, one item a commit, without waiting for the Player's band (tasks 157–159): the band's parts are built for the Chord player as shared kit parts the Player will take.
- **The section's sheet and Share, the same heads** (the loop, 2026-11-27). Why: similarity (one shape per kind of sheet) and ui-and-mockups, Words (no explanation under a control): Intro, Main per pass (Main, 1st time; Main, 2nd time, as a repeat is said), Into the next section and Ending are each a 15/600 head over the kit's segmented control, 24 apart; Share's People with the link the same; the grey groups, the MAIN caption and "None sends nothing" are gone.
- **The Genos lamps and MIDI, the app's own signs** (the loop, 2026-11-27). Why: crimson means wrong or a loss (seven-questions 4, DESIGN.md), so the chosen section (Main A) is no longer a red-filled lamp; chosen is the rail's chosen wash with an ink ring, the next a honey-deep ring, as the app marks what is on. The paragraph under Follow a MIDI arranger was an explanation under a control (ui-and-mockups, Words); it is gone, the panel's head already saying who plays. Follow's row is the white card as the rest. MIDI is complete where it opens, as the Player's MIDI keyboard popover (R74): Keyboard with its value and, with none, how to connect one, then Follow a MIDI arranger; the row that linked away to Settings is gone.
- **Audio, Chart and Style in the Player's page shape** (the loop, 2026-11-27). Why: one shape for one kind of page (similarity; the Player's and the editor's Audio page, `AUDPANEL`): the Chord player's Audio and Chart drew a grey group with an uppercase PLAYING caption; they are the kit's white card, then a sentence-case head over its segmented control (Voicing, Written as), 24 apart, the same in the laptop panel. Style on a phone was a wheel sheet with Done while the laptop lists the styles as checked rows; ☰'s Style opens that list as a page with ← (R74: every page a ☰ row opens is a page). Key, Tempo and Repeats keep the app's wheel pickers *(Tempo superseded 2026-11-28: the Metronome's face; every ☰ row a page)*.
- **Audio, the Player's word; the chart its own glyph** (the loop, 2026-11-27). Why: one word per thing (ux-writing, Harmonize): the Player and the editor call their sound panel Audio, the Chord player called it Sound; it is Audio on the rail, in ☰ and on its page. The Chart panel wore the editor's Layout table; it wears a page of text (Lucide file-text), the chart being how the chords are written.
- **One icon, one meaning** (the loop, 2026-11-27). Why: layers is the Player's Versions; the Chord player wore it for Style and both progressions acts. Style is Lucide's drum on the rail and in ☰, Save to my progressions list-plus, Open in Progressions list-music (ux-principles, One thing, one icon).
- **Export, the Player's shape** (the loop, one shape per thing, 2026-11-27). Why: the Player and the editor export through one Export row whose formats open beside it (a submenu on a laptop, a page with ← on a phone); the Chord player listed Export MIDI and Export chart as two rows of their own. Its Export row now holds MIDI and Chart (.txt); its file acts read Share…, Export ›, Import chart… on both sizes. Share… keeps its own word: it opens live sharing with its options, not a copied link.
- **The band under 1280** (the loop, every width, 2026-11-27). Why: at 1024 (a small laptop, an iPad on its side) the Player's band overflowed by about 70 and the Chord player's by about 30; every act stays, so what gives way is what can say less: Version history folds to its clock (its time in its tip), the song's or sheet's name shrinks first to 120 and truncates. Under 768 the phone's header takes over. A bar's last control names itself flush with the screen's edge, never centred past it (HIG, help tags). Built as a container query on the band (`BANDNARROW`, `r41_kit.py`; `r71_tips.py`).
- **The Chord player in the Player's model** (owner, 2026-11-27: "now begin with the refactoring of the chords
  player the same way you did with the laptop and mobile layout and such things"). Canvas R77 (`r58_chordplayer.py`,
  `lm77`, `ph77`). This supersedes R76's "The layout is the learner's" below for its Edit layout, the floating
  Controls dock, the gear and the Chords column: one place for each panel, as the Player's and the editor's; the Genos
  keeps its Full, Compact and Minimized. Sources: the Player's and the editor's boards (`player/r74_versions.py`,
  `r44_editor.py`); Flat's score page (its dark band, the rail of panels, the keyboard docked at the foot); Apple HIG,
  Toolbars and Sidebars.
  - **Laptop:** the full screen, the app's sidebar gone. The band, 64, dark: ✕ (back to Practice); the sheet's name
    with Live or Draft under it, a menu of the recent sheets, New sheet, All chord sheets, then Share…, Import chart…,
    Export MIDI, Export chart, Save to my progressions, Open in Progressions, and Save and Discard draft when there is
    one; the transport as the Player's (Go to start, Play with Playback options under ▾: Repeats and Count-in, the
    metronome pressed through Count-in, On and Off, Loop for the section); the sheet's Key, Tempo and Style as the
    band's pills, each opening its popover under it; MIDI (the keyboard, Follow a MIDI arranger); Undo and the keys
    at the band's end. Under it a rail, 76: Chords (the key's chords, tapped or dragged into a bar), Styles (the
    styles as rows, the chosen one checked, its feel beside it), Genos (the arranger's panel in full: who plays and
    whether it plays, the connection under it with Try again, Main A–D and Break, Intro I–III, Ending/rit. I–III;
    Follow a MIDI arranger under it), Audio (Piano, Bass, Drums, Volume; Voicing), Chart (Time signature, Written
    as); Search and Shortcuts at its foot. A panel, 352, opens beside the rail, « closes it. The chart takes the
    rest, its name in the band; the keys dock under it, the band's keys button showing or hiding them. While
    following and another panel is open, the Genos docks over the keys in its compact row (Start/Stop, Main A–D, ⌃ to
    its panel).
  - **Phone:** Flat's phone header: ←, the transport capsule (Go to start, Play, Loop, Playback options), the keys,
    ☰. The chart keeps its name over it (the name's menu: the sheets). ☰ drops the sheet's places as rows (Chords,
    Style, Key, Tempo, Repeats, Audio, Chart, MIDI), then Share…, Export MIDI, Export chart, Import chart…, then Save
    to my progressions and Open in Progressions; each place a page with ← back to ☰. The Genos sits compact over the
    keys, Start/Stop as its glyph (Main A–D hold 44 each only so), Full and Minimize at its end.
- **The layout is the learner's** *(Edit layout, the dock, the gear and the Chords column superseded 2026-11-27 by R77, above.)* (owner, 2026-11-18: "i want more user customizable ui like draggable resizable,
  hidible, minimizable toolbars dragging to the left and putting it there or draggind to the top … genos controls on
  phone or on laptop are bad designed as on phone it occupies too much space and is not hidable, resizable,
  minimizable, draggable … the layout should be saved and resetable in the app setitngs for teh individual page or for
  the whole app … it correctly opens the last opened or saved scores and teh settinsg should be refactored"). Canvas
  R76 (`r58_chordplayer.py`). Sources: Apple HIG, Toolbars (let people customize a toolbar); iPadOS's Customize
  Toolbar; Logic Pro's Customize Control Bar; Photoshop's and Dorico's workspaces (kept per window, reset from one
  place); WCAG 2.2, 2.5.7 Dragging movements (every drag has a single-tap way).
  - The chart is the page and never moves. Four panels around it: **Keys** (Top or Bottom; Small, Medium, Large),
    **Controls** (Style · Key · Tempo · Repeats · Play; Floating or at the Top; Full or Play only), **Genos** (Top,
    Floating, Bottom, and on a laptop Left or Right; Full, Compact, Minimized) and, on a laptop, the key's **Chords**
    (Left or Right; Narrow or Wide). Any panel but the chart can be hidden.
  - **Edit layout**, from ··· or the gear's Layout: each panel is outlined with its tag (a grip and its name); the grip
    drags it, or a tap on it lights the places it may go as honey zones and a tap there puts it; the tag's menu sets
    Place, Size and Hide. Hidden panels wait in a tray under the bar (+ Keys). The bar holds Reset and Done.
  - **The Genos never takes the phone:** Compact by default (Start/Stop and Main A–D in one row), Full one tap away,
    Minimized to a pill ("Genos · Main A") from its own head at any time, edit or not. On a laptop it defaults to the
    right column.
  - **Saved and reset:** every change is saved at once for the page; the gear's Reset layout puts it back with Undo;
    Settings › General › Layout › Page layouts lists each page changed with Reset, and Reset every page, with Undo.
  - **The last sheet opens:** the Chord player opens on the sheet last open; its name is a menu of the recent sheets
    (the open one checked), New sheet and All chord sheets.
  - **Export** (owner, 2026-11-21: "make me export"): ··· holds Export MIDI (the band once through, a track a part)
    and Export chart (the chart as text), after Share…; Import chart… before them reads such a chart back
    (owner, 2026-11-21: "and import"). A song or progression put in hand keeps its name, so the last
    sheet reopens by its name (owner, 2026-11-21: "that it opens in the last opened").
  - **Settings by how often wanted:** Sound (Piano, Bass, Drums, Volume), Playing (Count-in, Voicing), Chart (Time
    signature, Written as), MIDI (Connect a piano, Follow a MIDI arranger, Arranger), Layout (Edit layout, Reset
    layout, Every page's layout). ··· is the kit's menu at its button (Save and Discard draft when there is one,
    Share…, Edit layout, Save to my progressions, Open in Progressions), no longer a sheet.
- Next after the Chords page (owner, 2026-11-13: "after that continue with the chords player and make all of its
  features … add to instructions to continue with the chords player after you finish with the chords page"), with
  Musicca's chord player beside it (screenshots: sections of bars with beat ticks, + after the last bar, Add section,
  Randomize chords; Play, 100, Pop 1, Settings, File; a chord's sheet: Chord root and quality, Bass note, Duration
  − 4 beats +, Suggested chords, Delete and Done). Every feature it has, and:
  - **Start from any chord:** tap a bar and play from it.
  - **Count-in** before the song.
  - **Duplicate a chord.**
  - **A chord's timing is the learner's:** "if I set timing to these chords I want them to be so and not
    automatically changed when I change a chord": reordering or changing a chord never retimes the others. A bar
    whose beats no longer add up is kept as it is, marked with a ! that says its timing is wrong and opens that
    chord's Duration; nothing else moves.
  - **Easier timing:** Duration as Musicca's − n beats + in the chord's sheet, and the bar's beat ticks.
  - **Easier adding:** + after the last bar of each section opens the chord's sheet on the next suggested chord.
  - **Auto-scroll:** the sheet follows the chord playing.
  - **Bugs:** the chord sheet is not saved (it must be, as a saved store); drag and drop breaks (port
    memory-palaces' fix, read in that repo); reordering changes other chords' timings (fixed by the rule above).
  - **Drag across sections** (owner, 2026-11-13: "and also dragggin into other sections should be possible"): a
    chord dragged out of its section drops into any other, between any two chords or at a section's end, by finger,
    mouse and keyboard; it keeps its own length, and neither section retimes (a bar that no longer adds up takes its !).
    An empty section still takes a drop.
  - **Play leads; the Genos gets only its sections; with no Genos the app's band plays them** (owner, 2026-11-27:
    "the chords are only for the display and the timing, the mode with the aranger should work the same as with no,
    the only difference should be that on the right timing it sends to the genos what styles to play or what intro
    or what ending and so on, or the count in and such things … the chords are not sent to the genos … the chords
    that i actually play are being detected automatically by the genos"; then "can you imitate the styles when no
    genos is connected and let me play even if no genos is connected, and the status no connection is like in this
    midi menu that we have"). This replaces "the Genos leads" below. Play (and the panel's Start/Stop) works in
    every mode, as without an arranger: count-in, the lit sheet, its tempo. A connected Genos gets MIDI Start on
    the first chord, the app's clock, each bar's Section Control as it begins, Stop at Stop; never a chord or a
    note; the band is silent. With none connected the app's band imitates the panel: Main A–D its variations 1–4,
    Fill-in, Break, Ending (struck and held, the run ends) and Intro I–III (the sheet's last 2, 4, 8 bars played in),
    each pressed section taken at the next bar. The panel's head says who plays (Genos, or the style's name) and
    whether it plays; under it the connection as the MIDI keyboard's popover says it ("No Genos found. The app's
    band plays the style's sections." with Try again). Sources: Yamaha Genos Reference Manual, MIDI › System (Clock,
    Start/Stop); the Genos Data List's Section Control.
  - *(Superseded 2026-11-27, above.)* **Follow a MIDI arranger (Yamaha Genos): the Genos leads** (owner, 2026-11-13: "I dont want my chords to be
    played. just to sync the timing", then "when I start on the genos it should sync with genos and understand that
    it started and our app automatically starts"): the app sends nothing and plays no chords. It listens on the
    Genos's USB TO HOST: MIDI Start (FA) starts the Chord player from its first bar (Continue, FB, from where it
    stopped), Stop (FC) stops it, and its MIDI clock (F8, 24 a beat) sets the tempo and moves the beat, so the sheet
    follows the Genos's style while the learner plays the chords on its keys. Where the Genos sends Yamaha's Section
    control (F0 43 7E 00 ss 7F F7) as its Main A to D change, the sheet moves to the section of that letter. The
    Genos must send clock and start/stop (its MIDI transmit settings, to confirm in the Genos manual). Web MIDI runs
    in Chrome and Edge on a Mac or PC, never in Safari on a Mac or any iPhone browser (MDN, caniuse): there the row
    says so and names Chrome or Edge. Built as "Follow a MIDI arranger" in the Chord player's settings, beside
    Connect a piano, with a mark in the bar while it waits for Start. Not testable here without the instrument; a
    fake MIDI port drives it in the browser checks.
  - **The sheet sets the Genos's sections** (owner, 2026-11-13: "I want to be able though to set the transitions for
    the sections automatically like from the verse to chorus and also while playing two times the verse I want to be
    able to set that the Yamaha plays what types like a b c or d and when I dont set then it plays normally. and also
    the endings and the intro"): this replaces "the app sends nothing" for sections only; it still never sends chords
    or notes. Each section of the sheet carries, in its own sheet, an **Intro** (I–III or none, before the first
    section), its **Main** per pass (Main A–D, set apart for each repeat: the verse's 1st time A, 2nd time B), a
    **Fill-in into the next section** (on its last bar: Fill in, Break or none), and the last section an **Ending**
    (I–III or none). Each is sent on the Genos's MIDI clock at the bar line it falls on, as Yamaha's Section Control
    message (F0 43 7E 00 ss 7F F7; ss as the Genos Data List gives it: Intro I–III, Main A–D 08–0B, Fill in, Break,
    Ending I–III; to be checked against the Data List before it ships). Anything left unset sends nothing, so the
    Genos plays as its own panel says. Sending SysEx needs Web MIDI's SysEx permission, asked for when the learner
    turns Follow a MIDI arranger on. Shown on the sheet as a small tag on the section's head ("Main B · Fill in"),
    on the canvas first.
  - **The Genos's style controls, from the Chord player** (owner, 2026-11-13, the Owner's Manual's "Operating
    Style Playback", pp. 63–65: "the chords player should support these controls also … and if you need something
    else search in the user manual and other resources"): with Follow a MIDI arranger on, the Chord player's bar
    gets an arranger strip, laid out as the Genos's panel and named as it is: **Start/Stop**; **ACMP** (on: rhythm
    and auto accompaniment; off: rhythm alone); **Sync Start** (standby until a key, or a left-hand chord with ACMP
    on; pressed while playing it stops and waits again); **Sync Stop** (the style plays while the chord section is
    held; needs ACMP, and not with Full Keyboard fingering); **Intro I–III**; **Main A–D**, the chosen one marked,
    pressed again for its fill-in; **Auto Fill-in**; **Break** (one bar, back to the Main); **Ending I–III**,
    pressed again for rit.; **Fade in/out**; **OTS Link**. Each lamp as the panel's: on (chosen), flashing (next),
    available, off (no data). The sheet's own sections (above) still set Intro, Main per pass, Fill-in or Break and
    Ending, now Intro I–III and Ending I–III as the Genos has them; a press on the strip overrides the sheet until
    the next section. Every message (Start, Stop, Section Control, ACMP, Sync Start, Sync Stop, Fade, OTS Link) is
    taken from the Genos Data List and the Reference Manual before it is built, each cited with its page; a control
    the Genos does not take over MIDI is drawn as its panel lamp only, following what the Genos reports, or left
    out, and the report says which. Still never chords or notes. On the canvas first.
    Found so far (PSR Tutorial forum, 2022, quoting the Data List's Section Control): F0 43 7E 00 ss dd F7, ss 00–02
    Intro I–III (03 the fourth, which the Genos lacks), 08–0B Main A–D, 10–13 Fill-in A–D, 18 Break, 20–22 Ending I–III;
    dd 7F on, 00 off. Start and Stop: MIDI Start (FA) and Stop (FC), which the Genos takes only with its clock set to
    External, so the app sends Section Control and listens for Start and Stop; Yamaha's style start/stop SysEx and
    ACMP, Sync Start, Sync Stop, Fade and OTS Link are still to be found in the Genos Data List (MIDI Data Format)
    before the strip's buttons for them are built.
  - **Every change kept as a draft** (owner, 2026-11-13: "all the changes I do to the sheet should be automatically
    saved, either as draft and then I can save and change the current chords from the draft"): each edit is saved
    at once, on the device, as the sheet's draft; the sheet's saved chords stay as they were until Save, which makes
    the draft the current chords (Discard draft goes back to them, with Undo). A sheet with a draft says so beside
    its name and opens on the draft; nothing is lost on leaving, reloading or going offline. A shared sheet sends
    only what is saved to the open links.
  - **Shared live** (owner, 2026-11-13: "when I share the chords sheet it is online and automatically syncs with the
    other links that are opened"): Share makes the sheet an online sheet with a link; every open copy (the owner's
    and each link's) shows each change as it is made, through Supabase Realtime on the sheet's row (Postgres
    changes, or a broadcast channel per sheet), the last edit winning bar by bar. Sharing asks for an account (it
    reaches other people, ADR 0116: the server must answer); the sheet stays saved on the device too and catches up
    when back online. Who may edit through the link (view only, or edit) is a choice in Share, view only by default.
    **The chord playing is live too** (owner, 2026-11-14: "I also mean live updates meaning the chords being played
    online. like while playing the chords that are being played are also online with what chords is currently
    played"): every open copy lights the chord, its beat and the keys of whichever copy is playing; its own Play takes
    over while it plays. The sheet's name carries a Live mark (a grass dot, honey while another copy plays).
    **The selection follows the chord playing** (owner, 2026-11-14: "the chord from where it began didn't get
    deselected"): Play lets go of the chord it started from; while a chord sounds its ring is the only one; on Stop
    the selection stays on the last chord played, where Play goes on from (Musicca's).
    **Follow without an arranger plays the sheet** (owner, 2026-11-14: "the chords played is not shown while the
    follow a midi arranger is enabled but not connected to the midi and the buttons play are not working"): the Genos
    leads only while it is connected; with Follow on and none there, Play plays the sheet as usual and lights it, and
    the strip says why ("Genos · Not connected. The sheet plays by itself"), its panel buttons dimmed and Start/Stop
    gone until one is connected.
  - **Saved, synced and migrated** (owner, 2026-11-13: "I want to be able to save the like this as chord sheets
    and sync to my account and also the older ones should be able to migrate to this new structure effortlessly"):
    a sheet of bars is saved as text in the `chord_sheets` store, synced to the account like every saved store; a
    sheet written before bars (no `|`) is laid into bars as it is read, a bar per meter's beats, a chord that crossed
    a bar line kept whole in its bar (which takes the !). This overrides "no migration" for chord sheets only: the
    store's version stays, nothing is lost.
  - **The beats shown** (owner, 2026-11-13: "I want also to see the beats in the chords player"): each bar shows its
    beats as Musicca's ticks, and while playing the beat sounding is lit, the count-in's too.

- **Musicca's chart and dialog, tap to select, the dock over the keys** (owner, 2026-11-14, Musicca's chord player
  beside it: "make the ui of the chords like the musicca does"; "one tap on the chord selects it and plays from there
  when I play and double click opens this chord settings"; "the currently played chord should be selected like this
  when playing"; "the drag so change the timing like the musicca does also should be supported"; "the floating bar …
  doesnt stand above the content like pinned above the keyboard but sits under the chords sheet"; "improve the genos
  actions bar … better ui"). Canvas v173, `r58_chordplayer.py` (R59). Each chord a white box as wide as its beats
  (two bars a row on a phone, four on a laptop), its beats ticked along its foot, its name large with its extension
  raised (Cm⁷, B♭sus2, F⁷/A); a + box ends each section; no paper card, no bar lines. A section's head is Musicca's:
  its name (opening its sheet), × n, Variation n, delete (Undo), grip; its Genos tag under it while following. One tap
  selects a chord (ringed); Play starts from it; a double tap opens its sheet. The chord sounding wears the same ring
  on its honey wash, its beat's tick in ink. The selected chord's right edge carries Musicca's handle: dragged, it
  sets the chord's length in beats, nothing else retimed. The chord's sheet is Musicca's dialog: Chord (root ⌄,
  quality ⌄), Bass note ⌄, Duration − n beats +, Suggested chords four across, then Delete · Duplicate · Play from
  here. The keys are pinned at the foot; the dock floats just above them, over the chart, on a phone and a laptop
  alike; the Genos strip floats over the dock as a card showing every control at once: its state and Start/Stop,
  Main A–D and Break, Intro I–III and Ending/rit. I–III (two rows on a phone, one on a laptop), only what the Genos
  takes over MIDI.

## Today

`src/pages/chord-player`, strings `practice.ts` `chordPlayer`. A bar with four icons and ···; New chord sheet ▾,
Pop 1 ▾, Tempo 100 − +, Key C major ›; one Verse with Repeat ×1, bars 1–4, "0 bars" and a + tile; Add section and
Randomize chords; a floating Play and loop button over the keys.

## Will build (canvas row 10)

Phone: Back, the sheet's title ▾ (Chord sheets), Undo, gear, ··· (Redo, New, Chord sheets…, Save as my chord sheet…,
Randomize chords, Open in Progressions, Practise in the Player, Share link). Style ▾ (a sheet by family, each style
with a one-bar Listen) · Key ▾ (root grid, Major · Minor) · Tempo − 96 BPM +. Sections: grip, name ▾, n bars, Repeat
− × n +, ···; bars four to a row, numbered, a bar holding one or two chords by their length; + adds a chord; + Add
section. A chord opens a sheet: its name and length, In the key (C Dm Em F G Am Bdim with numerals), Root, Chord
(maj m 7 maj7 m7 sus4 sus2 dim add9 6), Length − n beats +, Bass note, Delete chord (Undo in its toast), Done. Above
the keys: Play/Stop, Loop, the place now (Chorus · bar 3 · C/E). The keys show the chord, left hand violet, right hand
orange. Settings page: Instruments, Chord names, Count-in ›, All piano settings ›.
Laptop: the sheet left, Style, Key, Tempo, Instruments and Chord names right; the key's chords under the sheet to drag
into a bar; a chord opens in a popover.

## Reference: Musicca's chord player page (2026-11-11)

The owner's saved copy of musicca.com/chord-player (a MiroMiro export: the page as HTML with Tailwind, a JSX element, an
HTML element, and Elementor and Bricks files), read for its text and controls; one state, no menus opened, no phone
layout. The export stays out of the repo.

| Area      | Musicca                                                                                                                                                | Our canvas (row 10)                                         | Take                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Style     | 22 styles in families, numbered: Pop 1–5, Rock 1–2, Melodic 1–4, Hip hop 1–2, Disco 1–2, Reggae 1–2, Jazz 1–4, Blues 1–2, Classical 1–2                | Style ▾, a sheet by family with a one-bar Listen            | already ours; the families match                                                                                       |
| Variation | each section picks Variation 1–4, "to create contrast between different song sections such as verse, chorus, and bridge"                               | a section has a name and Repeat                             | **Variation per section**                                                                                              |
| Speed     | ×1 beside the tempo                                                                                                                                    | Tempo − 96 BPM +                                            | no: one tempo control                                                                                                  |
| Settings  | instruments, count-in, time signature, transpose, volume                                                                                               | Instruments, Chord names, Count-in ›, All piano settings ›  | **Time signature** in Settings; transpose is the Key picker; volume is each instrument's level                         |
| File      | New · Save · Share · Download MP3 (signed in)                                                                                                          | ··· New, Chord sheets…, Save as my chord sheet…, Share link | **Download as audio** in ···                                                                                           |
| A chord   | a box with a tick per beat; drag its right edge to change its length; double-click for the advanced editor                                             | a chord opens a sheet with Length − n beats +               | **beat ticks in the chord** and, on a laptop, **its right edge drags its length**                                      |
| Typing    | click a chord and type it: root A–G, # or b, m dim aug sus2 sus4 6 7 maj7, then 9 11 13, / for the bass; Ctrl/Cmd + N adds a chord; Backspace deletes  | the chord sheet only                                        | **type a chord on a laptop**, read by the app's chord-symbol parser; ⌘N adds, Backspace deletes (Undo in its toast)    |
| Order     | drag to reorder; drag away to delete; the keyboard's space bar picks up, arrows move, space drops, Escape cancels                                      | sections move by their grip                                 | **chords drag too**, with the keyboard way for accessibility                                                           |
| Ideas     | Randomize chords; common progressions by genre (Pop, Rock, Jazz, Blues, the 12-bar blues) as text to start from; a table of songs built on four chords | Randomize chords in ···                                     | **Start from a progression** points to the Progressions library; no song table (the library holds the learner's songs) |

Proposed for the canvas: Variation 1–4 per section; Time signature in Settings; Download as audio in ···; beat ticks in
each chord with its right edge dragging its length on a laptop; typing a chord on a laptop; chords that drag, by finger,
mouse and keyboard.

## History

- 2026-11-08: drawn (canvas v8); waiting for the owner.
- 2026-11-11: Musicca's chord player page read from the owner's export and compared above; six proposals, not drawn yet.

Sources: Musicca's chord player (sections, bars, chord picker, instruments); Chordify's chord grid; Band-in-a-Box's
lead sheet (bars four to a row, chords split by beats); `practice.ts` `chordPlayer`.

### Canvas 171 (2026-11-13): the board redrawn to the rulings

`.scratch/r39/canvas/r58_chordplayer.py`, over r41_practice's ChordPlayer board. The chart: each bar's chords sized
by their beats over a row of beat ticks (the sounding beat in ink while playing); the chorus's 4th bar holds F 4 and
G7 2, so it is marked ! (44 target, "Bar 4 holds 6 beats, not 4", opening its chord); each section's head a grip, its
letter, name and × n, and, with Follow a MIDI arranger on, its Genos tag ("Intro I · Main A, Main B · Fill in"),
which opens the section's sheet: Intro (the first section), Main for each time through, Into the next section
(None · Fill in · Break), Ending (the last); "None sends nothing: the Genos plays as its panel says." A chord opens
Musicca's sheet titled "Bar 4 · F": Root, Chord, Bass note, Duration − n beats +, Suggested chords, Play from here,
Duplicate, Delete chord. Every edit marks the sheet's name Draft; ··· holds Save and Discard draft over Share (View
only · Can edit, Copy link). Settings add Follow a MIDI arranger and Arranger · Genos · USB. Over the keys, the
Genos's strip as its panel names it: Style (Start/Stop, ACMP, Sync Start, Sync Stop), Intro I II III, Main A B C D,
Auto Fill, Break, Ending/rit. I II III, Fade, OTS Link; a lamp red when on, pale red when next, white when off.

## Port to the app, R77 (ported 2026-11-27 and 28, every item; the build clean)

All eleven items are in the app (commits a26a59fd … 959920b2), measured against the board at 402 and 1710; ADR 0052 says what was built.

The board is the source, value for value (`r58_chordplayer.py`: `BAND77`, `RAIL77`, `_PANEL`, `GDOCK77`, `PHHDR77`,
`PHNAV77`, `PHPAGES77`, `NAMEMENU77L`, `NAMEMENU77P`, `POPS77L`, `_SHL`), with the kit helpers it calls
(`r41_kit.py`: `HDRTRANSPORT`, `HDRKEYSBTN`, `PHTRANSPORT`, `PHKEYSBTN`, `_RAILBTN`, `FROWS`, `FSHEET`, `POPOVER`).

| # | Board (R77) | App today | Port |
| - | ----------- | --------- | ---- |
| 1 | The full screen: no sidebar, the band 64 dark on a laptop; Flat's phone header (←, the transport capsule, the keys, ☰) | `pages/chord-player/ui/ChordPlayerPage.tsx` in the shell with its sidebar; a glass bar of Back, Undo, gear and ··· | the route leaves `shellRoute` as the Player's does; the band and the phone header from the Player's band once it is in the app (one implementation) |
| 2 | The name with Live or Draft under it, its menu: recent sheets, New sheet, All chord sheets; Share…, Import chart…, Export MIDI, Export chart; Save to my progressions, Open in Progressions; Save and Discard draft | `SheetsMenu.tsx` (the sheets), the ··· menu (the file acts) | one menu under the name; the ··· goes |
| 3 | The transport: Go to start, Play with Playback options (Repeats, Count-in) under ▾, the metronome, Loop for the section | the floating dock's Play, Repeats in the dock, Count-in in Settings, Loop in the section's sheet | the band's transport, the Player's own; the dock goes |
| 4 | Key, Tempo and Style as the band's pills, each a popover under it (the wheels) | the dock's Key, Tempo, Style | pills in the band; the dock goes |
| 5 | MIDI in the band: MIDI keyboard, Follow a MIDI arranger | Settings' MIDI rows | the band's MIDI popover, the Player's; Settings keeps a link row only |
| 6 | The rail, 76: Chords, Styles, Genos, Audio, Chart; Search and Shortcuts at its foot; a panel 352 beside it, « closes it | `KeyChords.tsx` in a side column, `StyleSheet.tsx`, `ArrangerStrip.tsx` floating, `ChordPlayerSettings.tsx` | the editor's rail and tabpanel; Sound (Piano, Bass, Drums, Volume; Voicing) and Chart (Time signature, Written as) take what the gear held, which goes |
| 7 | The Genos panel in full in the rail, docked compact over the keys while another panel is open (Start/Stop, Main A–D, ⌃) | `ArrangerStrip.tsx` Full · Compact · Minimized, placed by Edit layout | the strip's sizes kept; its place is the rail's or the dock over the keys |
| 8 | The keys docked under the chart, the band's keys button showing or hiding them | the keys in Edit layout's places and sizes | docked, shown or hidden; Edit layout goes |
| 9 | Edit layout, the floating dock, the gear and the Chords column gone | `use-chord-layout.ts`, `use-layout-edit.ts`, `LayoutZones.tsx`, `PanelTag.tsx`, `KeysGrab.tsx`, Settings › Page layouts | deleted, with the saved layout's store version bumped and the old save kept (ADR 0038) |
| 10 | ☰ on a phone: Chords, Style, Key, Tempo, Repeats, Audio, Chart, MIDI as rows, each a page with ←; then Share…, Export › (MIDI, Chart (.txt)), Import chart…; Save to my progressions, Open in Progressions | the dock and the gear's sheets | the Player's ☰ and its pages, one implementation |
| 11 | A chord's dialog on a laptop hangs under its chord (`ANCHOR`), above it where the screen ends first | `ChordDialog.tsx` centred | anchored to the chord as the board's `chordPos` |

## Port to the app, from canvas 171 (every item built: checked in the code 2026-11-28)

| # | Board | App today | Port |
| - | ----- | --------- | ---- |
| 1 | A bar holds its own chords; an edit never retimes another; a bar that does not add up is kept and marked ! | `shared/lib/arrangement/chord-sheet.ts`: a section is one run of chords laid across the bar lines; `resizeChord` takes beats from the next chord, `moveChord` leaves the lengths in place, `removeChord` and `moveChordAcross` hand beats to a neighbour | a section is bars of chords (`bars: { chords }[]`); resize, move, remove, duplicate and drag across sections touch only the chord moved; `playOrder` plays each bar as long as its chords; the text form writes bars with `|`; older text is read into bars, the store's version kept (done) |
| 2 | Beat ticks under each bar, the sounding beat lit; the ! on a bar that does not add up | `SheetSection.tsx`, `ChordTile.tsx` | ticks and the ! from the bar's beats |
| 3 | Musicca's chord sheet: Root, Chord, Bass note, Duration, Suggested chords, Play from here, Duplicate, Delete chord | `ChordDialog.tsx` | rebuilt to the board |
| 4 | The draft: Draft beside the name, Save and Discard draft in ··· | `use-chord-sheet.ts` saves each edit | a draft per sheet in the saved store |
| 5 | Each section's Genos tag and its sheet | none | the section's Intro, Main per pass, into the next, Ending in the sheet's text and store |
| 6 | Follow a MIDI arranger and the Genos strip | none | Web MIDI: Start, Stop, clock in; Section Control out |
| 7 | Share, view only or can edit, live | `share` exists for folders | the sheet's online row and Realtime |


### Ported (loop, 2026-11-14)

- 1 bars of chords (done); 2 the chart, ticks and ! (done): the chart on its paper as canvas 171 draws it; a
  section's head opens its own sheet (Section, Repeat, Loop this section, Variation, Duplicate section, Delete
  section at once with Undo), which the board leaves undrawn: decided so its settings keep one home, the old ⋯ and
  inline pickers gone.
- The bar and the dock (done): Back · Chord player · Undo · gear · ⋯ (Redo, New, Save as my chord sheet…, Share
  link, Chord sheets, Randomize chords, Open in Progressions, Practise in the Player); the dock Style · Key · Tempo
  · Repeats · Play. Decided, one home each: the dock's Key opens the transpose stepper (Settings' Transpose row
  gone); its Repeats is how many times the sheet plays, Until Stop or 1 to 8 (Settings' "Repeat the sheet" gone).
  The head card, the button row and the floating Loop are gone (Loop is in the section's sheet).
- 5 the section's Genos marks (done): a section carries Intro I–III (the first), its Main for each time
  through (A–D or None), Fill in or Break into the next, Ending I–III (the last), saved in the sheet's text as
  head words (`verse x2 i1 mAB fill e2`, `-` for a time left unset), so older sheets read with none. With
  Follow on, the head's tag ("Intro I · Main A, Main B · Fill in", or "Genos" when nothing is set) opens
  "Verse on the Genos": Intro, Main each time through ("1st time", "2nd time": the musician's words, where the
  board wrote Pass 1), Ending, Into the next section. The board's line "None sends nothing…" is the ⓘ beside
  "Main, each time through" (no explanation line under a control). Five letters (None A B C D) keep the
  segmented control in one row; five words still go three over two.
- 6 Follow a MIDI arranger (done): Settings has Follow a MIDI arranger (ⓘ) and an Arranger row naming the port
  (Genos · USB), or Not connected, MIDI not allowed, Needs Chrome or Edge; one preference, `chordPlayer.follow`.
  Turning it on asks for Web MIDI with SysEx. The Genos leads: its Start (FA) plays the sheet from bar 1 in
  silence, its clock (F8, 24 a beat) moves the lit bar and beat, Stop (FC) stops, Continue (FB) goes on; the
  dock's Tempo shows the clock's tempo while it plays, and Play is the Genos's Start/Stop (Yamaha's Rhythm Start
  F0 43 60 7A F7 and Stop F0 43 60 7D F7). The sheet's marks go out as Section Control (F0 43 7E 00 ss 7F F7):
  the first Main and the Intro while the Genos waits for Start, so its panel holds them; each later one as the
  bar before it begins, taken at the next bar line: the next time through's Main, a Fill-in into the Main it
  leads to, a Break, or the last section's Ending; a Main already playing is never sent again (it would play its
  Fill-in). With an Intro and a Genos that reports its section changes, the sheet waits for the first Main.
  The strip over the dock, as the panel names it: Start/Stop, Intro I II III, Main A B C D (pressed again, its
  Fill-in) and Break, Ending/rit. I II III, each lamp red when on. Left out, as no MIDI message for them was found
  in Yamaha's data (the brief's condition): ACMP, Sync Start, Sync Stop, Auto Fill, Fade and OTS Link. Decided:
  the strip floats in the dock's column as a card, since the app's dock floats over the keys where the board's
  sits in the page.
- 8 the laptop's columns (done): from 1024 wide the sheet's column holds the chart, the Genos strip and the dock
  (sticky at its foot, no longer floating beside the page, which had squeezed it to 800px); the 420px side
  column holds "C major chords · Drag one into a bar." (I to vii and V7, 56 tall, serif 20; drag into a bar, or
  tap to add after the last chord) and the Style list, the Style sheet's body. The phone keeps the floating dock.
- 7 Share live (done, canvas v175): `shared_chord_sheets` (migration `20261114100000`, applied; its access test
  `supabase/tests/chord-sheets-access.sql` reports every rule as expected): the owner's row under their policy, the
  link read and written by `read_shared_chord_sheet` and `write_shared_chord_sheet` (anyone with the link; writing
  only while Can edit), each write a new revision pinging the public Realtime topic `chord-sheet:<id>`, which carries
  only the revision so a forged ping only makes a copy read again. The app: `shared/api/chord-share` (port, Supabase,
  fake), `features/share-chord-sheet` (Share sheet as CP_SHARE draws it, share, open a link, save online merged bar by
  bar with `mergeSheets`, a save made offline sent when back), `widgets/chord-player/model/use-online-sheet.ts` (the
  line: changes taken in, the draft rebased on them; the chord playing sent and shown). The sheet in hand is named
  (Save as my chord sheet) before it is shared; a view-only link keeps its draft on the device (Save hidden; Save as
  my chord sheet keeps it). The old Share link that carried the sheet's text in the URL (`?share=`) is gone; a link
  is `?link=<id>`. Checked against the project with two browsers on one link: the second lit C, F, G beat by beat as
  the first played and went dark when it stopped; a change saved on the server appeared in the open copy without a
  reload. Kept on the project for later live checks (owner, 2026-11-14: "without the test user deleted, save for
  you"): the test user `00000000-0000-0000-0000-00000000e2e1` (live-check@rls.test, no password, no sign-in) and its
  sheet "Live check", link `7f3c2a10-1b2c-4d5e-8f90-a1b2c3d4e5f6`, Can edit; run
  `.claude/skills/owner-way/scripts/live-check.mjs` and `live-edit-check.mjs` against a dev server on the project.
- The keys show the chord (loop, 2026-11-14; the brief's "The keys show the chord, left hand violet, right hand
  orange", never built): while the sheet plays, or follows the Genos, the sounding chord lights on the keys, its
  root or slash bass in the left hand (G2 to F♯3) and its tones in the octave just above in the right, each key
  named: a chord spans an octave, so both hands stay in view on the smallest phone. The section's head keeps its
  name and × n whole beside a long Genos tag, the tag shrinking instead.
- Musicca's chart and dialog, from canvas 173 (done): each chord a box as wide as its beats (two bars a row on a
  phone, four on a laptop), its ticks, its extension raised (`ChordName`, also on the key's chords beside the
  chart); a tap selects, Play starts there; a double tap opens the dialog (Chord root and quality, Bass note,
  Duration, Suggested chords four across, Delete · Duplicate · Play from here); the selected box's right edge
  drags its length; the sounding chord wears the ring on its honey wash. The section's head: name pill (its
  sheet), × n, Variation n and delete in place, grip last. The paper card, the sticky dock and the floating
  actions are gone: the dock and the Genos card float over the keys on every size (`--nav-bar` + `--docked` +
  12), the Genos card with every control in view (two rows on a phone, one on a laptop).
- The Genos strip hides or moves (owner, 2026-11-14: "give me possibility also to hide the genos controls with hide
  button or move them to the side"): its head carries Hide (⌄; folded, it keeps its state line and Start/Stop, ⌃
  shows it again) and, on a laptop, Move to the side (it stands at the top of the side column, Back over the dock
  returns it). The place is saved (`chordPlayer.arranger`: card, folded, side). Auto-scroll built: the chord
  sounding is kept in sight, clear of the bar, the keys and what floats over them, checked at 402, 393 and 1710.
