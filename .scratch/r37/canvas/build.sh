set -e
P=../ideal-canvas/project
cp R3Laptop.bak $P/R3Laptop.dc.html; cp R3Phone.bak $P/R3Phone.dc.html
python3 views2.py $P; python3 words.py $P; python3 kb.py $P; python3 panels.py $P; python3 loop.py $P; python3 settings.py $P; python3 score.py $P; python3 keys.py $P
sed -i "s/\['song', 'The song’s'\]/['song', 'Song range']/" $P/R3Laptop.dc.html $P/R3Phone.dc.html
for f in R3Laptop R3Phone; do python3 -c "
import re
t=open('$P/$f.dc.html').read()
open('$f.mjs','w').write(re.search(r'<script type=\"text/x-dc\"[^>]*>(.*?)</script>',t,re.S).group(1))"; node --check $f.mjs; done
echo built
