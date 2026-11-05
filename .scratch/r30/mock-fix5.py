p='.scratch/r30/mockups/songs.html'
s=open(p).read()
def sub(a,b,cnt=1):
    global s
    if a not in s: raise SystemExit('missing: '+a[:90])
    s=s.replace(a,b,cnt)
# 1 gap under bar in phone edit
sub("""const songEdit = phone(`${songBar(true)}<div class="scroll pad" style="gap:14px"><div class="field editing\"""","""const songEdit = phone(`${songBar(true)}<div class="scroll pad" style="gap:14px;padding-top:8px"><div class="field editing\"""")
# 2 keys fixed colours
sub(".kbd i { background: var(--card) } .kbd b { position: absolute; top: 0; width: 7px; height: 22px; background: var(--ink) }",".kbd i { background: #fbf9f6 } .kbd b { position: absolute; top: 0; width: 7px; height: 22px; background: #2a231d }")
sub(".kbd u { position: absolute; bottom: 4px; width: 5px; height: 5px; border-radius: 9px; background: var(--ink) }",".kbd u { position: absolute; bottom: 4px; width: 5px; height: 5px; border-radius: 9px; background: #2a231d }")
# 3 archive in laptop bars
ARCH="<span style=\"position:relative;display:inline-flex\">${rb('archive')}<span style=\"position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;border-radius:99px;background:var(--ink);color:var(--paper);font:600 12px var(--sans);display:grid;place-items:center\">3</span></span>"
s=s.replace("<div class=\"tools\">${rb('select')}${rb('more')}</div></div>\n  <div class=\"lib\">${tree()}","<div class=\"tools\">${rb('select')}"+ARCH+"${rb('more')}</div></div>\n  <div class=\"lib\">${tree()}")
s=s.replace("<span class=\"seg\" style=\"margin-left:18px\"><span class=\"on\">My songs</span><span>Explore</span></span><div class=\"tools\">${rb('select')}${rb('more')}</div></div>\n  <div class=\"pad\"","<span class=\"seg\" style=\"margin-left:18px\"><span class=\"on\">My songs</span><span>Explore</span></span><div class=\"tools\">${rb('select')}"+ARCH+"${rb('more')}</div></div>\n  <div class=\"pad\"")
# 4 no New group link on Groups page
sub("""<div class="row" style="border:0;padding:12px 4px;color:var(--sky-ink);font-weight:500">${ic('plus', 18)}New group</div></div>`);""","""</div>`);""")
sub("'Your groups and the ones you belong to; New group under them (as in the + sheet and the share sheet); ⓘ says what a group sees.'","'Your groups and the ones you belong to; ⓘ says what a group sees. A group is made from Songs\\' + (New group) or while sharing a folder.'")
# 5 bar buttons stay in Edit
sub("""<div class="tools">${edit ? '' : rb('select') + rb('gear')}</div></div>`;""","""<div class="tools">${rb('select') + rb('gear')}</div></div>`;""")
sub("""<div class="tools">${edit ? '' :""","""<div class="tools">${""")
sub("While editing, Done stands in the pencil's place, so the control never moves between modes.","While editing, Done stands in the pencil's place, so the control never moves between modes, and the bar's other buttons stay.")
sub("""<span class="rb on" style="width:auto;padding:0 16px;font-weight:600;margin-left:6px">Done</span></div></div><div style="display:flex;gap:40px;padding:8px 40px">""","""<span class="rb on" style="width:auto;padding:0 16px;font-weight:600;margin-left:6px">Done</span></div><div class="tools"><span class="rb on" style="width:auto;padding:0 14px;gap:6px;display:flex;font-weight:600;font-size:14px">${ic('check', 18)}Learned</span>${rb('gear')}</div></div><div style="display:flex;gap:40px;padding:8px 40px">""")
# 6 2.1 phone: drop All songs block
sub("""<div class="h2">All songs <a>Show all 96</a></div><div class="group" style="margin-bottom:120px">${SONGS.slice(0, 2).map(songRow).join('')}</div></div>""","""<div style="height:140px"></div></div>""")
sub("Shared with me (Groups beside its heading), All songs. New folder is the +\\'s alone.'","Shared with me (Groups beside its heading); All songs follows on scrolling. New folder is the +\\'s alone.'")
# 7 1.3 uses the song's laptop page (defined later): move fig 1.3 render after songMac exists
sub("""  fig('1.3', 'Laptop, beside the title', 'The same on a laptop: the song\\'s bar, the pencil after the title, Learned and ⚙ at the right.', mac(`<div class="bar">${rb('back')}<div class="t lg">Amazing Grace<span class="rb sm edit-pen">${ic('pen', 19)}</span></div><div class="tools"><span class="rb on" style="width:auto;padding:0 14px;gap:6px;display:flex;font-weight:600;font-size:14px">${ic('check', 18)}Learned</span>${rb('gear')}</div></div><div class="pad" style="color:var(--ink-soft)">…the song\\'s page</div>`)),
""","")
sub("""document.getElementById('s4').innerHTML = [""","""document.getElementById('s1').insertAdjacentHTML('beforeend', fig('1.3', 'Laptop, beside the title', 'The song\\'s page on a laptop: the pencil after the title, Learned and ⚙ at the right (4.3 in full).', songMac));
document.getElementById('s4').innerHTML = [""")
# 8 credits same line
s=s.replace("Words: John Newton · Music: Traditional, tune New Britain</div><p","John Newton · tune New Britain</div><p")
# 9 2.4 whole continue cards
sub("""<div class="h2">Continue</div><div class="cards" style="overflow:hidden">${SONGS.concat(""","""<div class="h2">Continue <a>Show all</a></div><div style="display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:10px">${SONGS.concat(""")
s=s.replace("""]]).slice(0, 9).map(([n, , k], i) => `<div class="scard" style="width:160px">""","""]]).slice(0, 8).map(([n, , k], i) => `<div class="scard" style="width:auto">""")
open(p,'w').write(s)
print('applied')
