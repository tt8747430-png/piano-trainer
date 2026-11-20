# The canvas's inventory (owner, 2026-11-17: "first make an index of all the pages, all the popups and all the
# components and check all of them"): every board by area, every layer each board opens (sheets, popovers, menus,
# dialogs), and every kit component with the generators that call it. Run from canvas/: python3 checks/inventory.py
# Writes ../plan/inventory.md and checks/inventory.json (the list the checks walk).
import re, os, json, glob
C = '/home/user/piano-trainer/.scratch/r39/canvas/'
P = C + 'practice/project/'
idx = open(C + 'index.py').read()
# areas: every canvas page of index.py with its title, then the boards named on it
areas = []
for m in re.finditer(r"\('(\w+)', '([^']+)', \[", idx):
    areas.append((m.group(1), m.group(2), m.start()))
pairs = re.findall(r"\('([A-Z]\w+)', '([A-Z]\w+)', '([^']+)'\)", idx)
phones1 = re.findall(r"\('([A-Z]\w+)', '([^']+)'\)", idx)
boards = sorted(os.path.basename(f)[:-8] for f in glob.glob(P + '*.dc.html'))

def layers(name):
    h = open(P + name + '.dc.html').read()
    out = []
    for role, label in re.findall(r'role="(dialog|alertdialog|menu)"[^>]*?aria-label="([^"]*)"', h):
        out.append((role, label))
    for label, role in re.findall(r'aria-label="([^"]*)"[^>]*?role="(dialog|alertdialog|menu)"', h):
        out.append((role, label))
    seen, res = set(), []
    for r, l in out:
        k = (r, l)
        if k in seen or l in ('States',):
            continue
        seen.add(k); res.append(k)
    return res

kind = {'dialog': 'sheet or dialog', 'alertdialog': 'question', 'menu': 'menu'}
inv = {'boards': {}, 'components': {}}
for b in boards:
    inv['boards'][b] = [{'role': r, 'label': l} for r, l in layers(b)]
# components: the kit's helpers and constants a board is built from
kits = ['calm_kit.py', 'r41_kit.py', 'r41_lib.py', 'keyface.py', 'calm_parts.py', 'folds.py', 'states_tool.py']
gens = [g for g in sorted(glob.glob(C + '*.py')) if os.path.basename(g) not in kits + ['index.py']]
for k in kits:
    if not os.path.exists(C + k):
        continue
    src = open(C + k).read()
    for name in re.findall(r'^(?:def ([A-Z][A-Z0-9_]+)\(|([A-Z][A-Z0-9_]+) = lambda)', src, re.M):
        n = name[0] or name[1]
        users = [os.path.basename(g) for g in gens if re.search(r'\b' + n + r'\(', open(g).read())]
        inv['components'][n] = {'kit': k, 'users': users}
json.dump(inv, open(C + 'checks/inventory.json', 'w'), indent=1)

L = ['# The canvas inventory', '', 'Every board, every layer it opens and every kit component, built by `checks/inventory.py` from the',
     'boards themselves; run it after a rebuild. A layer is named by its `aria-label` (`{{x}}` is a name set by state).', '']
named = set()
L.append('## Pages, by area')
for i, (key, title, pos) in enumerate(areas):
    end = areas[i + 1][2] if i + 1 < len(areas) else len(idx)
    seg = idx[pos:end]
    # an area names its boards directly or through a list defined above (SONGS, PLAYER, …)
    names = re.findall(r"'([A-Z]\w+)'", seg)
    for lst in re.findall(r'\b([A-Z_]{4,})\b', seg):
        m = re.search(r'^' + lst + r' = \[(.*?)\]\n', idx, re.S | re.M)
        if m:
            names += re.findall(r"'([A-Z]\w+)'", m.group(1))
    names = [n for n in dict.fromkeys(names) if n in inv['boards']]
    if not names:
        continue
    L += ['', f'### {title}', '', '| Board | Layers it opens |', '| --- | --- |']
    for n in names:
        named.add(n)
        ly = inv['boards'][n]
        L.append(f'| {n} | ' + ('; '.join(f'{kind[x["role"]]}: {x["label"]}' for x in ly) or '—') + ' |')
rest = [b for b in boards if b not in named]
if rest:
    L += ['', '### On no canvas page', '', ', '.join(rest) + ': boards only the published canvas holds, kept by index.py as they are (the owner\'s own)']
nl = sum(len(v) for v in inv['boards'].values())
L += ['', f'{len(boards)} boards, {nl} layers.', '', '## Components', '', '| Component | Kit | Used by |', '| --- | --- | --- |']
for n, v in sorted(inv['components'].items()):
    L.append(f'| `{n}` | {v["kit"]} | {", ".join(v["users"]) or "the kit alone"} |')
open(C + '../plan/inventory.md', 'w').write('\n'.join(L) + '\n')
print(len(boards), 'boards,', nl, 'layers,', len(inv['components']), 'components; unplaced:', len(rest))
