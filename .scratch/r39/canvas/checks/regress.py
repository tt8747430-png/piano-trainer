# After every rebuild, before a publish: each board against the last commit. A board that lost more than 15% of its
# size, gained more than 50%, or changed its <title> is printed as REVERTED? and is never published until its generator
# is found and fixed (2026-11-17: a stale generator rewrote Chords with its old design and it went out).
# Run: python3 checks/regress.py [commit]
import subprocess, sys, re, glob, os
ref = sys.argv[1] if len(sys.argv) > 1 else 'HEAD'
bad = 0
for f in sorted(glob.glob('practice/project/*.dc.html')):
    try:
        old = subprocess.run(['git', 'show', f'{ref}:./{f}'], capture_output=True, text=True, check=True).stdout
    except subprocess.CalledProcessError:
        continue
    new = open(f).read()
    t = lambda s: (re.search(r'<title>([^<]*)', s) or [None, ''])[1]
    r = len(new) / max(1, len(old))
    if r < 0.85 or r > 1.5 or t(old) != t(new):
        bad += 1
        print(f'REVERTED? {os.path.basename(f)}: {len(old)} -> {len(new)} bytes, title {t(old)!r} -> {t(new)!r}')
print(f'{bad} boards to check' if bad else 'no board reverted')
