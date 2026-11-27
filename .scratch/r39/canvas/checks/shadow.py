# Every generator runs in one namespace (r41.py execs them in order), so a later file that assigns a name the kit
# already holds replaces it for every kit helper called after it: the panel's « drew a course's library glyph on the
# Chord player for that reason (2026-11-27). This lists each kit name a later generator assigns again; the build is
# clean only when it prints nothing.
import re, sys
D = '/home/user/piano-trainer/.scratch/r39/canvas/'
order = [m.group(1) for m in re.finditer(r"exec\(open\('[^']*canvas/([^']+\.py)'", open(D + 'r41.py').read())]
names = lambda f: set(re.findall(r'^([A-Za-z_][A-Za-z0-9_]*)\s*=(?!=)', open(D + f).read(), re.M))
kit = names('r41_kit.py') | names('calm_kit.py')
bad = [(f, n) for f in order if f != 'r41_kit.py' for n in sorted(names(f) & kit)]
for f, n in bad:
    print(f'{f} assigns the kit\'s {n}')
sys.exit(1 if bad else 0)
