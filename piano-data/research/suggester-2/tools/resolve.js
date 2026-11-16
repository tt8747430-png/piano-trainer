// Replace ___unnamed_N / UNK_xxx / DAT_xxx refs in Ghidra C with string literals
const fs=require('fs');const [,,cfile,out]=process.argv;const S=process.env.S;
const strs=JSON.parse(fs.readFileSync(S+'/mrms_strings.json'));const byAddr=new Map();for(const x of strs)byAddr.set(parseInt(x.addr,16),x.s);
const un=new Map();for(const l of fs.readFileSync(S+'/unnamed.tsv','utf8').split('\n')){const [n,a]=l.split('\t');if(n)un.set(n,parseInt(a,16))}
let c=fs.readFileSync(cfile,'utf8');
c=c.replace(/&?(___unnamed_\d+)/g,(m,n)=>{const a=un.get(n);if(a!==undefined&&byAddr.has(a))return 'S'+JSON.stringify(byAddr.get(a));return m});
c=c.replace(/&?(?:UNK|DAT)_00([0-9a-f]{6})/g,(m,h)=>{const a=parseInt(h,16);for(const d of [0,-1,-2,-3]){if(byAddr.has(a+d))return 'S'+JSON.stringify(byAddr.get(a+d))}return m});
fs.writeFileSync(out,c);
