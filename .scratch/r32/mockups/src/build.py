# Assembles settings.html: songs2.html's head, frames and feedback store around this round's body and screens.
# Run from the repo's .scratch directory: python3 r32/mockups/src/build.py
s = open('r30/mockups/songs2.html').read().split('\n')
end_style = [i for i, l in enumerate(s) if l.strip() == '</style>'][0]
head = '\n'.join(s[:end_style + 1]).replace('<title>Songs, Round 31</title>', '<title>Settings, Round 32</title>')
p0 = [i for i, l in enumerate(s) if l.startswith('const P = {')][0]
p1 = [i for i, l in enumerate(s) if l.startswith('const SONGS = [')][0]
helpers = '\n'.join(s[p0:p1])
extra = '\n'.join(l for l in s if l.startswith('const status2') or l.startswith('const app ='))
st = [i for i, l in enumerate(s) if l.startswith('// ——— strips')][0]
tail = '\n'.join(s[st:]).replace('r31-songs-feedback', 'r32-settings-feedback')
body = open('r32/mockups/src/body.html').read()
js = open('r32/mockups/src/screens.js').read()
open('r32/mockups/settings.html', 'w').write(
    head + '\n' + body + '\n<script>\n' + helpers + '\n' + extra + '\n' + js + '\n' + tail + '\n'
)
