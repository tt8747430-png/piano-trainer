"""Night: a board again in the app's dark roles (src/styles/tokens.css, html[data-theme='dark']). One map, used by
the Chords page (canvas 95) and the Player (canvas 122)."""
import re
NIGHT_VARS = [('--key-white: #fefdfb', '--key-white: #d4d0cb'), ('--key-black: #332c28', '--key-black: #171310'),
              ('--key-bed: #cbc2b9', '--key-bed: #787069'), ('--key-felt: #7c302c', '--key-felt: #5a2422'),
              ('--primary: #edc684', '--primary: #d4b176'), ('62%, #fefdfb)', '62%, #d4d0cb)')]
NIGHT = {'#F7F3EE': '#191512', '#FEFDFB': '#24201C', '#EEE9E2': '#2E2924', '#EDE6DC': '#2E2924', '#F3ECE1': '#2E2924',
         '#DAD1C8': '#453E38', '#332921': '#EDE9E1', '#685E56': '#BBB3A8', '#8A8178': '#7D7368', '#F6E3BC': '#3E3420',
         '#FBF1DD': '#352D1E', '#B07A2A': '#E0B26F', '#7A5418': '#E3C383', '#5E3F10': '#E3C383', '#EDC684': '#D4B176',
         '#F2C987': '#D4B176', '#356890': '#89B7DE', '#332C28': '#171310', '#CBC2B9': '#787069', '#7C302C': '#5A2422',
         '#FFFFFF': '#EDE9E1', '#B3261E': '#F2867C',
         # the Player's own greys: staff lines, hairlines, the sheet, the second ink
         '#CFC6BB': '#5A524A', '#E9E2D8': '#3A332D', '#EFE9E1': '#2E2924', '#DDD5CA': '#453E38', '#A39A90': '#857B70',
         '#4A433C': '#D2CBC1', '#BDB3A7': '#5F574F', '#D9D1C6': '#453E38', '#E4DDD3': '#3A332D', '#E7E0D6': '#3A332D',
         '#F2EDE6': '#2E2924', '#F3EEE7': '#24201C', '#ECE6DE': '#3A332D', '#9A9086': '#8A8178', '#2A1F18': '#14110E'}
def night(h):
    for a, b in NIGHT_VARS: h = h.replace(a, b)
    h = re.sub(r'#[0-9A-Fa-f]{6}\b', lambda m: NIGHT.get(m.group(0).upper(), m.group(0)), h)
    h = re.sub(r'rgba\((?:51, ?41, ?33|26, ?22, ?18), ?([\d.]+)\)', lambda m: 'rgba(10,7,5,%s)' % min(0.9, round(float(m.group(1)) * 3, 2)), h)
    h = h.replace('rgba(254,253,251,.86)', 'rgba(36,32,28,.86)').replace('rgba(246,243,238,0)', 'rgba(25,21,18,0)').replace('rgba(247, 243, 238, 0)', 'rgba(25,21,18,0)').replace('rgba(255, 255, 255, 0.92)', 'rgba(36,32,28,.92)')
    # ink on honey stays dark, as primary-foreground does by night
    h = re.sub(r'(style="[^"]*background: #D4B176[^"]*")', lambda m: m.group(1).replace('color: #EDE9E1', 'color: #191512'), h)
    # honey Play keeps its dark ink; the switch knob is the light thumb; a chosen segment is raised, a step lighter
    h = h.replace('rgba(237,198,132,.82)', 'rgba(212,177,118,.92)').replace('inset 0 1px 0 rgba(255,255,255,.55)', 'inset 0 1px 0 rgba(255,255,255,.25)')
    h = re.sub(r'<div role="group" aria-label="Play".*?</button></div>', lambda m: m.group(0).replace('color: #EDE9E1', 'color: #191512'), h, flags=re.S)
    h = h.replace('background: #24201C; box-shadow: 0 2px 4px', 'background: #EDE9E1; box-shadow: 0 2px 4px')
    h = h.replace("'#24201C' : 'transparent'", "'#453E38' : 'transparent'")
    # the engraved score (Verovio's color="black") in the night's ink
    h = h.replace('color="black"', 'color="#EDE9E1"')
    return h.replace('<html', '<html data-theme="dark"', 1).replace('<x-dc', '<x-dc data-night', 1)
