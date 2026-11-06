# R32: the pedals' names and accessible labels, and the rail's, in professional wording.
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
CHANGES = {
    'en': [
        ("""    sustain: { name: 'Sustain', label: 'Sustain pedal: hold it, or tap to keep it down' },
    sostenuto: { name: 'Sost.', label: 'Sostenuto pedal: holds the notes down as it is pressed' },
    soft: { name: 'Soft', label: 'Soft pedal: hold it to play quieter' },""",
         """    sustain: { name: 'Sustain', label: 'Sustain pedal — hold, or tap to latch' },
    sostenuto: { name: 'Sost.', label: 'Sostenuto pedal — sustains only the notes held as it is pressed' },
    soft: { name: 'Soft', label: 'Soft pedal (una corda) — softens the tone while held' },"""),
        ("  // The pedals at the end of the keys' strip (R31-P): each one's name under it, and what it is for.",
         "  // The pedals on their lyre beneath the keys (R32): each one's name under it, and what it does."),
        ("    chord: 'Chord played',", "    chord: 'Chord held',"),
        ("    fold: 'Hide the keys',", "    fold: 'Hide keyboard',"),
    ],
    'ru': [
        ("""    sustain: { name: 'Правая', label: 'Правая педаль: удерживайте или нажмите, чтобы закрепить' },
    sostenuto: { name: 'Средняя', label: 'Средняя педаль: держит звуки, нажатые вместе с ней' },
    soft: { name: 'Левая', label: 'Левая педаль: держите, чтобы играть тише' },""",
         """    sustain: { name: 'Правая', label: 'Правая педаль — удерживайте или коснитесь, чтобы зафиксировать' },
    sostenuto: { name: 'Средняя', label: 'Средняя педаль — продлевает только звуки, взятые вместе с ней' },
    soft: { name: 'Левая', label: 'Левая педаль (una corda) — смягчает звук, пока нажата' },"""),
    ],
}
for lang, pairs in CHANGES.items():
    path = ROOT / f'src/shared/i18n/locales/{lang}/common.ts'
    text = path.read_text()
    for old, new in pairs:
        assert old in text, (lang, old[:40])
        text = text.replace(old, new)
    path.write_text(text)
