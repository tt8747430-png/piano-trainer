# ADR 0004 — Audio and MIDI sit behind ports

- **Status:** accepted · **Date:** 2026-09-24

## Context

The legacy app called `AudioContext` and `navigator.requestMIDIAccess` wherever it needed them. Neither exists in
tests, Web MIDI does not exist on Safari or iOS, and browsers start audio suspended until a user gesture.

## Decision

`shared/api/audio` defines the `AudioOutput` port and `shared/api/midi` the `MidiInput` port.
`app/composition-root.ts` builds the WebAudio and Web MIDI adapters in `createServices()`, with `midi: null` where
Web MIDI is missing. Components and hooks reach them only through `useServices()`. Tests pass `FakeAudio` and
`FakeMidi`, which record calls.

## Consequences

- Practice and quiz logic is tested without a browser audio stack.
- Scheduling is pure (`shared/lib/schedule` turns ticks into seconds); the adapter only plays.
- A missing capability is a `null` the interface reads, not an exception.
