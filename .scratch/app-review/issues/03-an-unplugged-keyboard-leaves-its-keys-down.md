# 03. An unplugged keyboard leaves its keys down

Status: done
Severity: P1
Tier: 2
Rule: ADR 0009 (the keyboard is an instrument: a key is down while a hand holds it); CODE_STYLE §1 (a key goes down while a hand holds it)
Where: `src/shared/api/midi/web-midi.ts:31-35`

## What is wrong

A key held on a MIDI keyboard when its cable is pulled never gets its note-off: the adapter re-hooks the inputs left
and reports the status, but says nothing about the notes the gone keyboard was holding. `useHeldKeys` keeps those keys
down on every screen, and the Chord finder keeps naming them in the chord, until the page is reloaded.

## The test that shows it

```ts
it('lets go of the keys still held on a keyboard unplugged, and only those', async () => {
  const piano = new FakeInput('a', 'Piano')
  const pads = new FakeInput('b', 'Pads')
  const access = new FakeAccess(piano, pads)
  const midi = withAccess(access)
  const heard: NoteEvent[] = []
  midi.onNote((event) => heard.push(event))
  await midi.connect()
  piano.send([0x90, 60, 90])
  piano.send([0x90, 64, 90])
  piano.send([0x80, 64, 0])
  pads.send([0x90, 67, 90])
  heard.length = 0
  access.unplug(piano)
  expect(heard).toEqual([{ midi: 60, on: false, velocity: 0 }])
})
```

## The fix

The adapter keeps the notes each input holds (by the input's id, from its own note events); when the inputs change,
every input no longer there lets go of its notes with a note-off each.

## Comments
