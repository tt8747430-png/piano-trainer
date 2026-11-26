# Flat 26.11.0 (desktop): reverse-engineered reference

Read statically from Flat's Electron bundle (`/Applications/Flat.app`, `app.asar`, 2,347 renderer chunks). Nothing from the app was run.
Every claim cites its source chunk and is marked exact (read from code or strings) or inferred.

| File | Contents |
|---|---|
| `FLAT_UI_SHELL_AND_MOTION.md` | Editor panel system: 64px icon rail ↔ 416px panel; rail order Notation, Instruments, Layout, Audio, Assistant, then Search and Shortcuts. **Hide vs disable rule** (hide = never applies here; disable = not at this cursor, with "Title: reason" tooltip). Every animation with duration and easing (tokens 150/200/300 ms, `cubic-bezier(.2,0,0,1)`; sheets and dialogs `cubic-bezier(.32,.72,0,1)`). Library window layout. Breakpoints 768 / 1024 / 1366 |
| `FLAT_SETTINGS_TOOLS_FLOWS.md` | Settings by scope (device file / synced with the account / per score); MIDI and Live MIDI; every notation-sidebar tool with its shortcut (179 shortcuts); app flows (welcome, new-score wizard, import incl. 8-step PDF/photo OMR, export, sharing, comments, versions, offline, upgrade); **onboarding** (tours, tips cadence, feature intros, review and upgrade prompts and their triggers) |
| `FLAT_PLAYER_AND_PIANO.md` | Audio engine (native on desktop, WASM worklet on the web; 205 downloadable instruments); transport, metronome, speed, loop, swing; mixer; **playing and hiding specific parts** (display solo/eye vs mixer mute/solo); on-screen piano (C0–B8, 6 naming styles), fretboard and drum pads; MIDI in/out |
| `FLAT_LIBRARIES.md` | **Public song library** (Part A): explore filters, search, score page, comments, reporting, profiles, publish form, privacy levels and sharing roles, "Make a copy" (fork). **My library** (Part B): virtual collections, table, every action, bulk select, drag & drop with Undo, sort and filters, search, empty states, offline SQLite and sync. Data model and API paths (Part C) |

The desktop app opens community pages (explore, public score pages, profiles, publish) on flat.io in the browser. Part A is therefore reconstructed from the English strings bundled with the app, and the placement of those pieces on the page is inferred.
