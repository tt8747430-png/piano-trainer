import json,subprocess,sys,os
route,board,w,h=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4])
SP=os.path.dirname(os.path.abspath(__file__))
js=open(f'{SP}/text-measure.js').read()
app=subprocess.run(['node',f'{SP}/app-eval.mjs',route,f'{SP}/text-measure.js',str(w),str(h)],capture_output=True,text=True).stdout.strip().splitlines()[-1]
bw,bh=(450,920) if w<900 else (1760,1050)
env=dict(os.environ)
out=subprocess.run(['node','checks/run.mjs',board,str(bw),str(bh),json.dumps([{'eval':js}]),f'{SP}/tdb'],cwd='/home/user/piano-trainer/.scratch/r39/canvas',capture_output=True,text=True,env=env).stdout.strip().splitlines()
bd=next((l for l in reversed(out) if l.startswith('[')),'[]')
A={r[0]:r for r in json.loads(app)}; B={r[0]:r for r in json.loads(bd)}
common=[k for k in B if k in A]
if not common: print('no common text'); sys.exit()
from collections import Counter
longs=[k for k in common if len(k.split('#')[0])>=4] or common
dx,dy=Counter((A[k][1]-B[k][1],A[k][2]-B[k][2]) for k in longs).most_common(1)[0][0]
anchor=next(k for k in common if (A[k][1]-B[k][1],A[k][2]-B[k][2])==(dx,dy))
print(f'anchor "{anchor}" offset {dx},{dy}; common {len(common)}, board only {len([k for k in B if k not in A])}, app only {len([k for k in A if k not in B])}')
for k in B:
    if k not in A: print('BOARD ONLY:',k, B[k][1:5]); continue
    a,b=A[k],B[k]; d=[]
    if abs(a[1]-dx-b[1])>3 or abs(a[2]-dy-b[2])>3: d.append(f'pos {a[1]-dx},{a[2]-dy} vs {b[1]},{b[2]}')
    if a[5]!=b[5] or a[6]!=b[6]: d.append(f'font {a[5]}/{a[6]} vs {b[5]}/{b[6]}')
    if a[7]!=b[7]: d.append(f'color {a[7]} vs {b[7]}')
    if d: print('DIFF',k,'|','; '.join(d))
for k in A:
    if k not in B: print('APP ONLY:',k,A[k][1:5])
