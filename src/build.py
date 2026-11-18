import os
os.chdir('/home/claude/vl')
d=''.join(open(f).read()+'\n' for f in ['data_split.js','data_hp_vrf.js','data_extra.js','data_inled.js','data_beh.js','data_out.js','data_parts.js','data_models.js','data_guide.js','data_tree.js','data_inst.js','data_ref.js','data_verify.js'])
a=open('app.js').read(); _t='setTheme(LS.get("vl_theme","auto"));\nrenderAll();\n})();'; assert a.rstrip().endswith(_t), 'tail'; a=a.rstrip()[:-len(_t)]+open('bc.js').read()+'\n'+open('scan.js').read()+'\n'+open('tools.js').read()+'\n'+_t+'\n'; sh=open('shell.html').read()
h=sh.replace('/*DATA*/',d).replace('/*APP*/',a)
open('/home/claude/vlavologio_offline.html','w').write(h)
h2=h.replace('</head>','<link rel="manifest" href="manifest.json">\n</head>',1).replace('</body>','<script>if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").catch(function(){});}</script>\n</body>',1)
open('/home/claude/pwa/index.html','w').write(h2)
import re
s=open('/home/claude/pwa/sw.js').read(); s=re.sub(r'vl-v\d+','vl-v39',s); open('/home/claude/pwa/sw.js','w').write(s)
print(len(h))
