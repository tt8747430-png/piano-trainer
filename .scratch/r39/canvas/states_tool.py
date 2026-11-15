# The States box (owner, 2026-11-15: "all the states should be properly made like the chords page does in this
# box outside of the phone frame"): one canvas tool for every board. A board's states never sit inside its
# screen: each in-screen "Canvas: show a state" strip, and each "CANVAS · …" button, is lifted out of the
# screen, and its choices become the rows of the dashed States button beside the frame, as the Chords board
# draws it. Run after every generator, before index.py's link check. Chords keeps its own (its list is
# written in its script); every other board's list is read from what its strips held.
import os, re

OUT = '/home/user/piano-trainer/.scratch/r39/canvas/practice/project/'
INK = '#332921'


def _close(h, i, tag):
    """The index just past the element opened at h[i] (a <tag …>), counting nested tags of its kind."""
    depth, k = 0, i
    pat = re.compile(r'<(/?)%s\b' % tag)
    while True:
        m = pat.search(h, k)
        if not m:
            raise ValueError('unclosed <%s>' % tag)
        depth += -1 if m.group(1) else 1
        k = h.index('>', m.end()) + 1
        if depth == 0:
            return k


def _lift(h):
    """Takes every canvas-only control out of the screen; returns the page and what they offered."""
    lists, buttons = [], []
    while True:
        m = re.search(r'<div aria-label="Canvas: show a [a-z]+"', h)
        if not m:
            break
        end = _close(h, m.start(), 'div')
        lists += [n for n in re.findall(r'<sc-for list="\{\{(\w+)\}\}"', h[m.start():end]) if n not in lists]
        h = h[:m.start()] + h[end:]
    while True:
        m = re.search(r'<button type="button" onClick="\{\{(\w+)\}\}"[^>]*>CANVAS · ([^<]+)</button>', h)
        if not m:
            break
        buttons.append((m.group(2)[0].upper() + m.group(2)[1:], m.group(1)))
        s, e = m.start(), m.end()
        # a wrapper that held the button alone goes with it
        w = h.rfind('<div', 0, s)
        if w >= 0 and re.fullmatch(r'<div style="display: flex; justify-content: center">', h[w:s]) and h[e:e + 6] == '</div>':
            s, e = w, e + 6
        h = h[:s] + h[e:]
    return h, lists, buttons


def _tool(night, laptop):
    line, ink, card, text, ring = (('#7D7368', '#BBB3A8', '#2B2621', '#EDE7DF', '#453E38') if night
                                   else ('#8A8178', '#685E56', '#FEFDFB', INK, '#DAD1C8'))
    left, top = ('24px', '24px') if laptop else ('2px', '0px')
    return ('<div data-canvas-tool style="position: absolute; left: %s; top: %s; z-index: 300; font-family: ui-monospace, Menlo, monospace">' % (left, top)
            + '<button type="button" aria-label="Canvas tool: show a state" aria-expanded="{{statesOpen}}" onClick="{{toggleStates}}" '
              'style="height: 22px; padding: 0 8px; border: 1px dashed %s; border-radius: 11px; background: #FFF8; color: %s; font: inherit; font-size: 11px">States</button>' % (line, ink)
            + '<sc-if value="{{statesOpen}}" hint-placeholder-val="{{false}}"><div role="menu" aria-label="States" style="position: absolute; left: 0; top: 26px; width: 290px; '
              'padding: 4px; border-radius: 12px; background: %s; box-shadow: 0 0 0 1px %s, 0 14px 28px -8px rgba(51,41,33,.3); display: flex; flex-direction: column">' % (card, ring)
            + '<sc-for list="{{stateList}}" as="o" hint-placeholder-count="5"><button type="button" role="menuitemradio" aria-checked="{{o.on}}" onClick="{{o.pick}}" '
              'style="min-height: 40px; padding: 0 12px; border: 0; border-radius: 8px; background: transparent; color: %s; font: inherit; font-size: 12px; font-weight: {{o.fw}}; '
              'text-align: left; display: flex; align-items: center; justify-content: space-between; gap: 8px"><span>{{o.l}}</span><span>{{o.mark}}</span></button></sc-for></div></sc-if></div>' % text)


def _script(lists, buttons, playing=False):
    """Wraps the board's renderVals: the strips' choices, then the canvas buttons, under As designed."""
    return ('\n{ const R = Component.prototype.renderVals; Component.prototype.renderVals = function () {\n'
            '  const v = R.call(this), st = this.state || {}, set = (o) => this.setState(o);\n'
            '  const close = (f) => () => { f && f(); set({ statesOpen: false }); };\n'
            '  const rows = [].concat(' + ', '.join('(v.%s || []).map((p) => ({ l: p.l, on: p.bg === "%s", pick: p.pick }))' % (n, INK) for n in lists)
            + (', ' if lists and buttons else '')
            + ', '.join('[{ l: %r, on: false, pick: v.%s }]' % (l, a) for l, a in buttons)
            + ((', ' if lists or buttons else '') + '[{ l: "Playing", on: !!v.playing, pick: v.togglePlay }]' if playing else '') + ');\n'
            '  const none = !rows.some((r) => r.on);\n'
            '  const list = [{ l: "As designed", on: none, pick: () => rows.filter((r) => r.on).forEach((r) => r.pick()) }].concat(rows);\n'
            '  return Object.assign({}, v, { statesOpen: !!st.statesOpen, toggleStates: () => set({ statesOpen: !st.statesOpen }),\n'
            '    stateList: list.map((r) => ({ l: r.l, on: r.on ? "true" : "false", fw: r.on ? 700 : 450, mark: r.on ? "✓" : "", pick: close(r.pick) })) });\n'
            '}; }\n')


def run():
    done = []
    for f in sorted(os.listdir(OUT)):
        if not f.endswith('.dc.html'):
            continue
        p = OUT + f
        h = open(p).read()
        if 'data-canvas-tool' in h:
            continue
        h, lists, buttons = _lift(h)
        # a page that plays (its floating bar's Play) shows Playing in its States box too
        playing = 'onClick="{{togglePlay}}"' in h and 'playing:' in h
        if not lists and not buttons and not playing:
            continue
        stem = f[:-8]
        root = re.compile(r'<div style="[^"]*position: relative[^"]*">').search(h, h.index('</helmet>'))
        assert root, f
        h = h[:root.end()] + _tool('Night' in stem, 'Laptop' in stem) + h[root.end():]
        k = h.rindex('</script>')
        h = h[:k] + _script(lists, buttons, playing) + h[k:]
        open(p, 'w').write(h)
        done.append(stem)
    print('states tool on', len(done), 'boards:', ' '.join(done))


if __name__ == '__main__':
    run()
