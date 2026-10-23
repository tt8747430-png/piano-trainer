# The Player and the score editor: UI audit (2026-10-23)

Audited with Playwright (Chromium) at 393×852 (iPhone 14 Pro upright), 852×393 (on its side) and 1280×800 (a
laptop), on an own song (`/play/my-1`, `/edit/my-1`) and a built-in one (`/play/lightly-row`,
`/edit/lightly-row`): both screens, the bars, the transport, View, Setup, Song, Takes, Insert, the tempo and hands
pop-ups. Measured against Apple's HIG (toolbars, menus, sheets, 44pt targets), Material 3 (top app bar, standard
icon buttons) and the touch notation and practice apps (forScore, Newzik, MuseScore, Flat, Soundslice, Dorico for
iPad, Flowkey, Simply Piano). Decisions: [ADR 0085](../adr/0085-player-and-editor-menus-alike.md).

## Findings and fixes

1. **On a phone on its side the transport covered the bar and the keys' rail.** _Player, 852×393._ The upright
   pill is 226px tall; the sheet between the bar and the keys is 179px, so the pill, centred on the sheet, lay 16px
   over the Setup button and 15px over the keys' rail. A control over another control is a mis-tap waiting to
   happen. **Fixed:** on a phone on its side the transport has a column of its own at the screen's right edge, the
   screen's full height (bar, sheet and keys beside it), as the camera and forScore keep their side controls.
2. **The two bars looked and behaved differently.** _Both bars._ The Player's buttons were outlined circles, the
   editor's plain icons; the Player named only View on a laptop, the editor named View and Song; the Setup's sliders
   never said "Setup". **Fixed:** one look: the bar's buttons are the app's round outlined buttons on both screens
   (as in every other screen bar), the menus that open a sheet or pop-up (View, Setup / Song) are named from a
   laptop's width, the toggles and status (Loop, Record, MIDI) stay icons with tooltips. Undo and Redo stay plain,
   a notation app's edit pair, whose disabled state reads clearly only without a ring.
3. **The MIDI keyboard was in a different place on each screen, and dead on Safari in the editor.** _Player bar vs
   the editor's Song sheet._ The editor's Song sheet ended in a "MIDI keyboard" section whose button hides itself
   without Web MIDI, so on iPhone and Mac Safari (the owner's devices) it showed a heading and a line of text with
   nothing to press. **Fixed:** the MIDI button sits in the editor's bar where the Player has it (View · MIDI · Song),
   hidden without Web MIDI on both; the Song sheet is the song alone.
4. **The View menus had different orders and headings.** _Player View: Staves · Show · Layout (Layout a field
   label); editor View: Layout · Show · a side choice._ Two menus doing one job should read alike (HIG: consistent
   menus). **Fixed:** both start with Layout, then the groups, each under the same heading (`MenuSection`); Layout
   is a group like the others.
5. **Chord positions sat in the Setup though it only labels the sheet.** _Player Setup, "How it plays" tiles._ It
   writes each chord's position beside its name over the staff: something shown, not played, so a learner looking
   for it in View (with Chord names, Finger numbers, Note names) could not find it (ADR 0064 already gave the View
   everything the sheet shows). **Fixed:** a switch in View's Show, under Chord names, with a line saying what it
   writes.
6. **Three things were called "Melody".** _View (the tune's own staff), Setup (hear the tune), Takes (hear the tune
   while recording)._ **Fixed:** View's is "Melody staff" (the editor's Song sheet already said so); the Setup's tiles
   now stand under a visible "How it plays" heading, so Melody, Metronome, Count-in and Swing read as sounds; the
   Takes' Metronome and Melody switches each say in a line what they do.
7. **"Keyboard" in one View, "Keys" in the other** for the same switch. **Fixed:** "Keys" (Клавиши) on both.
8. **The palette's side was offered where it has no side.** _Editor View, phone upright and tablet._ "Tools beside
   the music: Left · Right" changed nothing while the palette sits at the foot. **Fixed:** offered only where the
   palette stands beside the sheet (a laptop, a phone on its side).
9. **Targets under 44px.** _Editor:_ the palette's fold and side buttons (36×36) and a section's heading on the sheet
   (35px tall). **Fixed:** 44px (the fold buttons stay 36px tall on a phone on its side, where the palette's tabs are,
   but 44px wide).

## Checked and kept

- **Transport.** ‹ Play › with the tempo at its start and the hands at its end, as Flowkey's; the tempo button says
  the speed (100%) or Wait, so Wait mode and Listen are found where the speed is; its pop-up groups them as
  "Waits for your notes" and "Listen and play along", with speed training under the slider. The hands' pop-up shows
  each choice with its picture. Clear as is.
- **Loop.** The bar's Loop button loops the bar at the cursor (R), and a range is chosen on the sheet with Shift or a
  held finger; a finished Wait pass offers "Loop bars n–m". Discoverable enough with its tooltip and shortcut.
- **Sheets.** Setup, Song, Takes and Insert share the sheet: title left, Close right, a grab handle, scrolling inside
  on a phone in both orientations. Pop-ups (View, tempo, hands, MIDI) fit and scroll on a phone on its side.
- **Insert** stays a sheet over the score: it is modal and closes on a choice, as MuseScore's palettes do on a phone.
- **States.** A song deleted in another tab, music that cannot be engraved and Wait mode's finished pass each say
  so (covered by tests); the takes' sheet says why Record waits (no MIDI keyboard, nothing played, no room).

## Open questions for the owner

1. **The Player's default layout on a phone held upright.** Across (Panorama) shows about one bar at 393px and leaves
   the middle of the screen empty; the editor starts in Down (Scroll). Should the Player start in Down on a phone
   held upright, as forScore and Newzik do, keeping Across for the laptop and a phone on its side?
2. **The editor's title on a phone with Web MIDI.** With the MIDI button in the bar (Chrome on Android; never on
   Safari), the title truncates to a letter or two at 393px. Hide it there as the Player does under 360px, or move
   it to the caret's line?
3. **The chord keypad's keys are 32px tall** so its three rows fit the palette; raising them to 44px makes the palette
   taller. Keep it dense, or let the chord palette grow?
