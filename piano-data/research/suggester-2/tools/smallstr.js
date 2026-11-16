// Decode Swift small-string immediates (arm64) from `otool -tV` output on stdin.
const rl=require('readline').createInterface({input:process.stdin});
const regs={};let hist=[];let fn='';const out=[];
function imm(s){s=s.trim();const neg=s.startsWith("-");const v=BigInt(neg?s.slice(1):s);return neg?BigInt.asUintN(64,-v):v}
rl.on('line',l=>{
 if(/^[^\s0-9].*:$/.test(l)){fn=l.slice(0,-1);hist=[];return}
 const m=l.match(/^\s*[0-9a-f]+\s+(\w+(?:\.\w+)?)\s+(.*)$/);if(!m)return;const op=m[1],a=m[2].split(/,\s*/);
 const r=a[0];
 if((op=='mov'||op=='movz')&&/^#/.test(a[1]||'')&&/^x\d+$/.test(r)){let v=imm(a[1].slice(1));if(a[2]&&/lsl/.test(a[2]))v<<=BigInt(a[2].match(/#(\d+)/)[1]);regs[r]=BigInt.asUintN(64,v);}
 else if(op=='movk'&&/^x\d+$/.test(r)){const v=imm(a[1].slice(1));const sh=a[2]?BigInt(a[2].match(/#(\d+)/)[1]):0n;const cur=regs[r]??0n;regs[r]=(cur&~(0xffffn<<sh))|(v<<sh);}
 else if(/^x\d+$/.test(r)&&!/^(str|stp|cmp|cbz|cbnz|tbz|tbnz|b|bl|ret)/.test(op)){delete regs[r];hist=hist.filter(h=>h.r!=r);return}
 else return;
 const v=regs[r];hist.push({r,v});if(hist.length>12)hist.shift();
 const top=Number(v>>56n);
 if(top>=0xe1&&top<=0xef){const n=top&0xf;let first=null;
   for(let i=hist.length-2;i>=0;i--){if(hist[i].r!=r&&(Number(hist[i].v>>56n)<0xe0)){first=hist[i];break}}
   if(!first)return;let bytes=[];for(let i=0;i<8;i++)bytes.push(Number((regs[first.r]??first.v)>>BigInt(8*i)&0xffn));for(let i=0;i<7;i++)bytes.push(Number(v>>BigInt(8*i)&0xffn));
   const s=Buffer.from(bytes.slice(0,n)).toString('utf8');if(/^[\x20-\x7e -￿]+$/.test(s)&&!s.includes('�'))out.push(fn+'\t'+s)}
});
rl.on('close',()=>{console.log(out.join('\n'))});
