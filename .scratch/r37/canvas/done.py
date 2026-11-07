import sys
proj = sys.argv[1]
for f in ['R3Laptop', 'R3Phone']:
    p = f'{proj}/{f}.dc.html'; t = open(p).read()
    a = "engine.setState({ playing: false, start: true, bar: 1, beat: 1, verse: 0 }); return;"
    assert t.count(a) == 1, f
    t = t.replace(a, "engine.setState({ playing: false, start: true, bar: 1, beat: 1, verse: 0, open: 'done' }); return;")
    open(p, 'w').write(t)
