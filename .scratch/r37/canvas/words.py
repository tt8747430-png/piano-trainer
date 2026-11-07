import re, sys
for f in ['R3Laptop','R3Phone']:
    p=sys.argv[1]+'/'+f+'.dc.html'; t=open(p).read()
    t=t.replace('<span style="flex: 1; display: flex; flex-direction: column"><span style="font-weight: 600">{{i.name}}</span><span style="font-size: 13px; color: #6B6259">{{i.line}}</span></span>','<span style="flex: 1; font-weight: 600">{{i.name}}</span>')
    t=t.replace(", line: 'The music waits for the right notes.'","").replace(", line: 'The music follows your tempo.'","")
    t=t.replace('>At your own pace<','>Practice<').replace('>Listen and play along<','>Playback<').replace('>Which hands do you play?<','>Hands<').replace('<span>Hear the other hand</span>','<span>Other hand</span>')
    t=t.replace("stepBack: pick({ bar: Math.max(1, bar - 1) }), stepOn: pick({ bar: Math.min(16, bar + 1) }),","stepBack: pick({ start: false, bar: Math.max(1, bar - 1), beat: 1 }), stepOn: pick({ start: false, bar: Math.min(16, bar + 1), beat: 1 }),")
    open(p,'w').write(t)
