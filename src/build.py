import os
VER='vl-v86'
R=os.path.dirname(os.path.abspath(__file__)); SITE=os.path.join(R,'..','site'); os.chdir(R)
d=''.join(open(f).read()+'\n' for f in ['data_split.js','data_hp_vrf.js','data_extra.js','data_inled.js','data_beh.js','data_out.js','data_parts.js','data_models.js','data_guide.js','data_tree.js','data_inst.js','data_ref.js','data_pipe.js','data_units.js','data_verify.js','data_rules.js'])
a=open('app.js').read(); _t='setTheme(LS.get("vl_theme","auto"));\nrenderAll();\n})();'; assert a.rstrip().endswith(_t), 'tail'; a=a.rstrip()[:-len(_t)]+open('bc.js').read()+'\n'+open('scan.js').read()+'\n'+open('tools.js').read()+'\n'+open('pipe.js').read()+'\n'+open('menu.js').read()+'\n'+_t+'\n'; sh=open('shell.html').read()
h=sh.replace('/*DATA*/',d).replace('/*APP*/',a).replace('<meta charset="utf-8">','<meta charset="utf-8">\n<meta name="vl-ver" content="'+VER+'">',1)
open(os.path.join(R,'..','..','vlavologio_offline.html'),'w').write(h)
h2=h.replace('</head>','<link rel="manifest" href="manifest.json">\n</head>',1).replace('</body>','<script>if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").catch(function(){});}</script>\n</body>',1)
open(os.path.join(SITE,'index.html'),'w').write(h2)
import re
s=open(os.path.join(SITE,'sw.js')).read(); s=re.sub(r'vl-v\d+',VER,s); open(os.path.join(SITE,'sw.js'),'w').write(s)
print(len(h))
