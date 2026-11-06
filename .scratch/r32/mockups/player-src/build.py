# Builds player.html: the R31 mockup's head and helpers (frames, icons, the score), then R32's screens.
import pathlib

here = pathlib.Path(__file__).parent
r30 = (here / '../../../r30/mockups/player.html').read_text().splitlines()
head = '\n'.join(r30[:186]).replace('<title>The Player, Round 31</title>', '<title>The Player, Round 32</title>')
helpers = '\n'.join(r30[220:292])
body = (here / 'body.html').read_text()
screens = (here / 'screens.js').read_text()
(here / '../player.html').write_text(f"{head}\n{body}\n<script>\n{helpers}\n{screens}\n</script>\n")
