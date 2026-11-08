"""Brings the R37 Player canvas (The ideal Player) into the one canvas, in the calm colours.

Reads the Player's two base pages from the scratchpad copy, swaps the 3D pictures' blob ids for the copies held by
the one canvas, maps the Player's orange accent to the calm honey, links Close to the song's page, and writes the
base pages (PlayerApp, PlayerDesk) and one board per state."""
import re, sys, pathlib
SRC = pathlib.Path(sys.argv[1]); OUT = pathlib.Path(sys.argv[2]); BLOBMAP = pathlib.Path(sys.argv[3])
bm = {}
for line in BLOBMAP.read_text().split('\n'):
    if line.strip():
        s, d = line.split(); bm[s] = d
COLOURS = [
    ('background: #E8762F; color: #FFFFFF', 'background: #EDC684; color: #332921'),
    ('#E8762F', '#B07A2A'), ('#e8762f', '#B07A2A'), ('232,118,47', '176,122,42'), ('232, 118, 47', '176, 122, 42'),
    ('#FDF1E8', '#FBF1DD'), ('#FBE4D4', '#F6E3BC'), ('#1A1612', '#332921'), ('#6B6259', '#685E56'),
]
def port(text, base, back):
    text = re.sub(r'_blob/([0-9a-f]{32})', lambda m: '_blob/' + bm[m.group(1)], text)
    for a, b in COLOURS: text = text.replace(a, b)
    # Close goes back to the song's page.
    text = re.sub(r'<button type="button" aria-label="Close" style="position: absolute;(.*?)</button>',
                  lambda m: f'<a href="{back}" aria-label="Close" style="text-decoration: none; box-sizing: border-box; position: absolute;{m.group(1)}</a>',
                  text, count=1, flags=re.S)
    text = text.replace('R3Phone', 'PlayerApp').replace('R3Laptop', 'PlayerDesk')
    return text
apps = {'PlayerApp': ('R3Phone', 'Song.dc.html'), 'PlayerDesk': ('R3Laptop', 'SongLaptop.dc.html')}
for name, (src, back) in apps.items():
    t = port((SRC / f'{src}.dc.html').read_text(), name, back)
    left = [c for c in ('#E8762F', 'R3Phone', 'R3Laptop') if c in t]
    assert not left, left
    assert 'href="' + back + '"' in t, name
    (OUT / f'{name}.dc.html').write_text(t)
WRAP = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&amp;family=Instrument+Serif&amp;display=swap">
<style>
body{{margin:0}}
</style>
</helmet>
<dc-import name="{app}" {attrs} hint-size="{w}px,{h}px"></dc-import>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{
renderVals() {{
return {{}};
}}
}}
</script>
</body>
</html>
'''
BOARDS = {
    'Player': ('PlayerApp', 'view="sheet"', 'The Player, phone'),
    'PlayerPractice': ('PlayerApp', 'view="sheet" open="pace"', 'The Player, phone, Practice'),
    'PlayerLoop': ('PlayerApp', 'view="sheet" loop="true" loopa="5" loopb="8" open="pace"', 'The Player, phone, loop'),
    'PlayerHands': ('PlayerApp', 'view="sheet" open="hands"', 'The Player, phone, Hands'),
    'PlayerKeyboard': ('PlayerApp', 'view="sheet" open="keys"', 'The Player, phone, Keyboard'),
    'PlayerSettings': ('PlayerApp', 'view="sheet" open="settings"', 'The Player, phone, song settings'),
    'PlayerDone': ('PlayerApp', 'view="sheet" open="done"', 'The Player, phone, Played through'),
    'PlayerDiagrams': ('PlayerApp', 'view="diagrams"', 'The Player, phone, Diagrams'),
    'PlayerLaptop': ('PlayerDesk', 'view="sheet"', 'The Player, laptop'),
    'PlayerLaptopLoop': ('PlayerDesk', 'view="sheet" loop="true" loopa="5" loopb="8" open="pace"', 'The Player, laptop, loop'),
    'PlayerLaptopKeyboard': ('PlayerDesk', 'view="sheet" open="keys"', 'The Player, laptop, Keyboard'),
}
for name, (app, attrs, title) in BOARDS.items():
    w, h = (450, 920) if app == 'PlayerApp' else (2143, 1299)
    (OUT / f'{name}.dc.html').write_text(WRAP.format(title=title, app=app, attrs=attrs, w=w, h=h))
print('ok', len(BOARDS) + 2)
