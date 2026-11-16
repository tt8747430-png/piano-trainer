// Extract enum entry names + VALUES global per $init_global function
const fs=require('fs');const files=process.argv.slice(2);const res={};
for(const f of files){const txt=fs.readFileSync(f,'utf8');const parts=txt.split(/^\/\/ ===== /m).slice(1);
 for(const p of parts){const head=p.split('\n')[0];if(!/\$init_global/.test(head))continue;
  const cls=head.replace(/^_kfun:com\.mathieurouthier\./,'').replace(/\.\$init_global.*$/,'');
  const names=[];const re=/(?:\+ 8\) = |\[2\] = )S"([A-Za-z0-9_]+)";\s*\n\s*(?:\*\(undefined[0-9]* \*\)\(\w+ \+ (?:0x10|3)\) = |\w+\[3\] = )(0x[0-9a-f]+|\d+);/g;let m;
  while((m=re.exec(p))){names.push({name:m[1],ord:Number(BigInt(m[2])&0xffffffffn)})}
  const g=[...p.matchAll(/puRam0+(9b[0-9a-f]+) = /g)].map(x=>'0x'+x[1]);
  if(names.length)res[cls]={globals:g,entries:names.sort((a,b)=>a.ord-b.ord).map(x=>x.name)}}}
fs.writeFileSync(process.env.S+'/enums.json',JSON.stringify(res,null,1));
for(const k in res)console.log(k,res[k].globals.join(','),'::',res[k].entries.join(' '));
