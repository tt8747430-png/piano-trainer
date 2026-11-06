# Builds ui.html: R33's head and helpers, R34's keyboard styles and helpers (the slim keys, the Player's bar), then the
# UI round's styles, body and screens, then the feedback boxes under every screen.
import pathlib

here = pathlib.Path(__file__).parent
r33 = (here / '../../../r33/mockups/piano.html').read_text().splitlines()
style_end = next(i for i, l in enumerate(r33) if l.startswith('</style>'))
head = '\n'.join(r33[:style_end]).replace('<title>The Piano, Round 33</title>', '<title>UI Sketches, Round 34</title>')
start = next(i for i, l in enumerate(r33) if l.startswith('// ——— icons'))
mine = next(i for i, l in enumerate(r33) if l.startswith('const finderBar'))
helpers = '\n'.join(r33[start:mine])
fb = next(i for i, l in enumerate(r33) if l.startswith('// ——— theme and feedback'))
end = max(i for i, l in enumerate(r33) if l.startswith('</script>'))
tail = '\n'.join(r33[fb:end]).replace('r33-piano-feedback', 'r34-ui-feedback')
kb = (here / 'screens.js').read_text().splitlines()
kb_helpers = '\n'.join(kb[: next(i for i, l in enumerate(kb) if l.startswith("document.getElementById"))])
css = (here / 'keyboard.css').read_text() + '\n' + (here / 'ui.css').read_text()
body = (here / 'ui-body.html').read_text()
screens = (here / 'ui-screens.js').read_text()
(here / '../ui.html').write_text(
    f"{head}\n{css}\n</style>\n{body}\n<script>\n{helpers}\n{kb_helpers}\n{screens}\n{tail}\n</script>\n"
)
