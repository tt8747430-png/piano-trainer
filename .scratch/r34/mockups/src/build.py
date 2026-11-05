# Builds keyboard.html: R33's piano mockup's head (tokens, frames, the keys' styles) and helpers (icons, frames, the
# score, the keys), then R34's styles, body and screens, then the feedback boxes under every screen.
import pathlib

here = pathlib.Path(__file__).parent
r33 = (here / '../../../r33/mockups/piano.html').read_text().splitlines()
style_end = next(i for i, l in enumerate(r33) if l.startswith('</style>'))
head = '\n'.join(r33[:style_end]).replace('<title>The Piano, Round 33</title>', '<title>The Keyboard, Round 34</title>')
start = next(i for i, l in enumerate(r33) if l.startswith('// ——— icons'))
mine = next(i for i, l in enumerate(r33) if l.startswith('const finderBar'))
helpers = '\n'.join(r33[start:mine])
fb = next(i for i, l in enumerate(r33) if l.startswith('// ——— theme and feedback'))
end = max(i for i, l in enumerate(r33) if l.startswith('</script>'))
tail = '\n'.join(r33[fb:end]).replace('r33-piano-feedback', 'r34-keyboard-feedback')
css = (here / 'keyboard.css').read_text()
body = (here / 'body.html').read_text()
screens = (here / 'screens.js').read_text()
(here / '../keyboard.html').write_text(f"{head}\n{css}\n</style>\n{body}\n<script>\n{helpers}\n{screens}\n{tail}\n</script>\n")
