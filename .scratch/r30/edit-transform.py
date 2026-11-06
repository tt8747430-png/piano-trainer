# Turns `modes={<EditToggle editing={…} onDone={…} onEdit={…} />}` (or `edit=`) into `edit={{ editing: …, … }}`.
import re, sys
def props(body):
    out=[]; i=0
    while i < len(body):
        m=re.match(r'\s*(\w+)(=)?', body[i:])
        if not m or not m.group(1): break
        name=m.group(1); i+=m.end()
        if not m.group(2):
            out.append((name,'true')); continue
        if body[i]=='{':
            d=0; j=i
            while True:
                if body[j]=='{': d+=1
                elif body[j]=='}':
                    d-=1
                    if d==0: break
                j+=1
            out.append((name, body[i+1:j].strip())); i=j+1
        else:
            m2=re.match(r'"[^"]*"', body[i:]); out.append((name, m2.group(0))); i+=m2.end()
    return out
for p in sys.argv[1:]:
    s=open(p).read()
    pat=re.compile(r'(modes|edit)=\{\s*<EditToggle\b(.*?)/>\s*\}', re.S)
    def rep(m):
        ps=props(m.group(2))
        inner=', '.join(f'{k}: {v}' for k,v in ps)
        return 'edit={{ '+inner+' }}'
    s2=pat.sub(rep,s)
    if s2!=s:
        s2=re.sub(r"import \{ EditToggle \} from '@/widgets/mode-switch'\n","",s2)
        open(p,'w').write(s2); print('changed',p)
