# Libraries and components the researched apps use, against ours

Source: the owner, 2026-11-20: "check what libraries and components that already exist we can use", "checks also
the research folder what they use", "not only the claude ai by all the music apps researched". Read:
`piano-data/research/README.md`, `_shared/piano-theory-and-libraries/open-source/LIBRARIES.md`, and each app's
README and resources, sound and components files (chordio, chordlab, dorico, flat, garageband, metronaut,
piano-companion, scale-runner, suggester-2, tiny-instrument; claude-ai earlier).

## What each app takes from a library

| App | Platform | From libraries | Built itself |
| --- | --- | --- | --- |
| Flat | Electron, Vue | i18next, Radix menus, Sentry, LAME | its WASM score player, the piano |
| Metronaut | iPad | GUIDO engine (MPL-2.0), Antescofo, Lottie | layout, metronome |
| Piano Companion | .NET macOS | Manufaktura staff renderer, NAudio MIDI, GeneralUser GS | keyboard (PNG keys), circle of fifths |
| Chordio | iOS | MIKMIDI, Ableton Link, a GPL score engine | Wait mode, quizzes, drum styles |
| Suggester 2 | Kotlin + SwiftUI | kotlinx, Ableton Link | `PianoView`, CapsulePicker, FloatingToolbar, Toaster |
| Tiny Instrument | iOS | AudioKit sampler | lessons, gamification, the keys |
| Scale Runner | Flutter | flutter_midi_command, audioplayers, supabase | the game, the keys |
| ChordLab | JUCE | Verovio, sfizz | chord detection, FSRS |
| GarageBand, Dorico | native | (rules and data only) | |
| claude.ai | web | Base UI, Tailwind, Zustand, framer-motion, react-query, zod | |

Every app takes its engraving from a library and draws its own piano. None takes a piano keyboard, a circle of
fifths or a tempo control from a library.

## Against Piano Trainer

| Need | Ours | The research's candidate | Decision |
| --- | --- | --- | --- |
| Engraving | `verovio` | GUIDO, Manufaktura, OSMD, abcjs | keep Verovio: the one web engine that is the apps' own (ChordLab) |
| Menus, dialogs, popovers, toasts | `@base-ui/react` (shadcn) | Radix (Flat), Base UI (claude.ai) | keep; claude.ai's timings ported (f1546388) |
| Hand-built ARIA parts | meters, a listbox, radio groups, toolbars | Base UI Meter, Toolbar, Radio, NumberField | the three meters are the kit's `ProgressBar` on Base UI's Meter now; the rest go area by area |
| Piano sound, drums, bass | own sampler, sample sets in `public/` | `smplr`, GeneralUser GS, FluidR3 drum WAVs (MIT), Greg Sullivan e-pianos (CC BY 3.0) | keep our sampler; the sets are a content choice, kept |
| Transport and metronome | own look-ahead scheduler (`shared/api/audio/lookahead.ts`) | `tone` | keep: one clock for the Player, Metronome and runs |
| Music theory | the kernel `shared/lib/music` | `tonal` | keep: the kernel imports no package (`CLAUDE.md`) |
| Chord naming | the kernel | ChordLab's and GarageBand's rules, Piano Companion's port, Chordio's cost table | ported in loop round 61 (chord detection) |
| MIDI | own Web MIDI port | `webmidi` | keep: the port has its fake for tests |
| Spaced repetition | none | `ts-fsrs` | not adopted: no feature asks for it (YAGNI) |
| Motion | `motion`, `tw-animate-css` | Lottie (Metronaut) | keep; no celebration animations (DESIGN.md) |
| Notation fonts | Bravura in Verovio, Noto Music | Leland, Petaluma, Sebastian (OFL) | keep one engraving font |

Not usable on the web: GUIDO/libmusicxml, Antescofo, Manufaktura, NAudio, AudioKit, MIKMIDI, Ableton Link, Lottie on
iOS, the Kotlin and Flutter packages, FluidSynth, Core ML. Never used: Metronaut's FluidR3 SF2 ("DO NOT
REDISTRIBUTE"), Chordio's GPL score engine, any sound with no licence in its file.
