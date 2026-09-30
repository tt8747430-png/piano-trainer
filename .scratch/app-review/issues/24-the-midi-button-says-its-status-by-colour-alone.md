# 24. The MIDI button says its status by colour alone

Status: done
Severity: P3
Tier: 2
Rule: CODE_STYLE §5 (colour is never the only cue); §10 (one short line)
Where: `src/features/connect-midi/ui/MidiButton.tsx`, locales

## What is wrong

A dot's colour was the only sign a keyboard is connected (the dot is hidden from assistive tech, the name read the same either way), and "no keyboard" was two sentences naming USB only.

## The test that shows it

`MidiButton.test.tsx`: "says in its name when a keyboard is connected, not by the dot’s colour alone".

## The fix

The name becomes "MIDI keyboard, connected" ("MIDI-клавиатура подключена"); "No MIDI keyboard found." ("MIDI-клавиатура не найдена.").

## Comments
