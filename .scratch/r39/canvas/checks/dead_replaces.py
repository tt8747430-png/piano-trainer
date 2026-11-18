"""Find .replace() patches that never match: a patch on a helper's output whose search text has gone away silently
drops a ruled value (the laptop take's roll stood at 340x120 for rounds). Builds a copy of the canvas in a scratch
folder with every .replace(a, b) call wrapped, runs r41.py and index.py there, and prints each call whose a was never
found. It names suspects only: remove one, rebuild, and `diff -rq practice/project <copy made before>` is the proof.
Usage: python3 checks/dead_replaces.py <scratch dir>"""
import ast, glob, os, shutil, subprocess, sys
C = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R = os.path.join(sys.argv[1], 'rc'); shutil.rmtree(R, ignore_errors=True); os.makedirs(R)
for f in os.listdir(C):
    s, d = os.path.join(C, f), os.path.join(R, f)
    if f.endswith('.py'): shutil.copy(s, d)
    elif f in ('practice', 'checks'): shutil.copytree(s, d)
    else: os.symlink(s, d)
LOG = os.path.join(R, 'rchk.txt')
HDR = ("import builtins, atexit\nif not hasattr(builtins, '_RCHK'):\n def _RCHK(o, loc, a, b, *r):\n"
       "  if isinstance(o, str) and isinstance(a, str): (builtins._MISS if a not in o else builtins._HIT).add(loc)\n"
       "  return o.replace(a, b, *r)\n builtins._RCHK = _RCHK; builtins._MISS = set(); builtins._HIT = set()\n"
       f" atexit.register(lambda: open({LOG!r}, 'a').write(repr((sorted(builtins._MISS), sorted(builtins._HIT))) + '\\n'))\n")
for f in glob.glob(R + '/*.py'):
    name = os.path.basename(f)
    tree = ast.parse(open(f).read().replace(C, R))
    class T(ast.NodeTransformer):
        def visit_Call(self, n):
            self.generic_visit(n)
            if isinstance(n.func, ast.Attribute) and n.func.attr == 'replace' and len(n.args) >= 2 and not n.keywords:
                return ast.Call(ast.Name('_RCHK', ast.Load()), [n.func.value, ast.Constant(f'{name}:{n.lineno}')] + n.args, [])
            return n
    open(f, 'w').write(HDR + ast.unparse(ast.fix_missing_locations(T().visit(tree))))
for s in ('r41.py', 'index.py'): subprocess.run([sys.executable, s], cwd=R, capture_output=True)
M, H = set(), set()
for l in open(LOG):
    m, h = ast.literal_eval(l); M |= set(m); H |= set(h)
print('\n'.join(sorted(M - H)) or 'every replace matches')
