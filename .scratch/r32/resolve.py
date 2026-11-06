# Resolves the merge of the Settings round: R32-A's side of each hunk, with the Settings round's
# names for the computer keyboard and the collapse setting kept.
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
HUNK = re.compile(r'<<<<<<< HEAD\n(.*?)=======\n(.*?)>>>>>>> [^\n]*\n', re.S)


def resolve(path, take='ours', subs=()):
    p = ROOT / path
    text = p.read_text()
    text = HUNK.sub(lambda m: m.group(1) if take == 'ours' else m.group(2), text)
    for old, new in subs:
        text = text.replace(old, new)
    assert '<<<<<<<' not in text and '>>>>>>>' not in text, path
    p.write_text(text)


KEEP_THEIRS_NAMES = [
    ("label: 'Hide automatically',", "label: 'Collapse keyboard',"),
    ("typing: 'Play with the computer keyboard',", "typing: 'Play with computer keyboard',"),
]
for path, subs in [
    ('src/shared/i18n/locales/en/common.ts', KEEP_THEIRS_NAMES),
    ('src/pages/settings/ui/SettingsPage.test.tsx', [
        ("/^Play with the computer keyboard/", "/^Play with computer keyboard/"),
        ("// Hide automatically: the two saved folds", "// Collapse keyboard: the two saved folds"),
        ("{ name: 'Hide automatically' }", "{ name: 'Collapse keyboard' }"),
    ]),
    ('src/pages/settings/ui/OnScreenPianoPage.test.tsx', [
        ("{ name: 'Computer keys' }", "{ name: 'Computer keyboard' }"),
        ("/Play with the computer keyboard/", "/Play with computer keyboard/"),
    ]),
]:
    resolve(path, 'ours', subs)

for path in sys.argv[1:]:
    resolve(path, 'ours')

resolve('src/shared/i18n/locales/ru/common.ts', 'ours', [
    ("label: 'Скрывать автоматически',", "label: 'Сворачивать клавиатуру',"),
])
resolve('src/shared/i18n/locales/en/settings.ts', 'theirs', [
    ("piano: { look: 'Appearance', place: 'Position', play: 'Playing', pedals: 'Pedals' },",
     "piano: { look: 'Keys', place: 'Placement', play: 'While you play' },"),
])
resolve('src/shared/i18n/locales/ru/settings.ts', 'theirs', [
    ("piano: { look: 'Оформление', place: 'Расположение', play: 'Игра', pedals: 'Педали' },",
     "piano: { look: 'Клавиши', place: 'Размещение', play: 'Во время игры' },"),
])
