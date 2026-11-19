# The board against the app, by their texts (2026-11-19): every visible text's own box, size, weight and colour on the
# board and on the app's route, aligned at the first text both show, and only what differs printed. Cheaper than a
# screenshot: look at one only where this prints a difference. Needs the dev server on 5191 and RT (the canvas runtime).
#   RT=$RT python3 checks/port/tdiff.py /practice/metronome Metronome 402 874
import json,subprocess,sys,os
route,board,w,h=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4])
SP=os.path.dirname(os.path.abspath(__file__))
js=open(f'{SP}/text-measure.js').read()
app=subprocess.run(['node',f'{SP}/app-eval.mjs',route,f'{SP}/text-measure.js',str(w),str(h)],capture_output=True,text=True).stdout.strip().splitlines()[-1]
bw,bh=(450,920) if w<900 else (1760,1050)
env=dict(os.environ)
out=subprocess.run(['node','checks/run.mjs',board,str(bw),str(bh),json.dumps([{'eval':js}]),'/tmp/tdiff-board'],cwd=os.path.join(SP,'..','..'),capture_output=True,text=True,env=env).stdout.strip().splitlines()
bd=next((l for l in reversed(out) if l.startswith('[')),'[]')
A={r[0]:r for r in json.loads(app)}; B={r[0]:r for r in json.loads(bd)}
common=[k for k in B if k in A]
if not common: print('no common text'); sys.exit()
anchor=common[0]; dx=A[anchor][1]-B[anchor][1]; dy=A[anchor][2]-B[anchor][2]
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
