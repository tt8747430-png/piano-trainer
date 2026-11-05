# Builds piano.html: the R32 Player mockup's head (tokens, frames' styles) and helpers (icons, frames, the score),
# then R33's styles, body and screens, then the R32 feedback boxes under every screen.
import pathlib

here = pathlib.Path(__file__).parent
r32 = (here / '../../../r32/mockups/player.html').read_text().splitlines()
style_end = next(i for i, l in enumerate(r32) if l.startswith('</style>'))
head = '\n'.join(r32[:style_end]).replace('<title>The Player, Round 32</title>', '<title>The Piano, Round 33</title>')
start = next(i for i, l in enumerate(r32) if l.startswith('// ——— icons'))
mine = next(i for i, l in enumerate(r32) if l.startswith('// R32 screens'))
helpers = '\n'.join(r32[start:mine])
fb = next(i for i, l in enumerate(r32) if l.startswith('// ——— theme and feedback'))
end = max(i for i, l in enumerate(r32) if l.startswith('</script>'))
tail = '\n'.join(r32[fb:end]).replace('r32-player-feedback', 'r33-piano-feedback')
css = (here / 'piano.css').read_text()
body = (here / 'body.html').read_text()
screens = (here / 'screens.js').read_text()
(here / '../piano.html').write_text(f"{head}\n{css}\n</style>\n{body}\n<script>\n{helpers}\n{screens}\n{tail}\n</script>\n")
