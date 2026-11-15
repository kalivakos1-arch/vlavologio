// ===== Barcode decoder (pure JS, works on iPhone & Android) =====
// Code128, Code39, EAN-13/UPC-A, ITF (Interleaved 2 of 5). Tables cross-checked with ReportLab.
var BC = (function(){
  var P128 = "212222,222122,222221,121223,121322,131222,122213,122312,132212,221213,221312,231212,112232,122132,122231,113222,123122,123221,223211,221132,221231,213212,223112,312131,311222,321122,321221,312212,322112,322211,212123,212321,232121,111323,131123,131321,112313,132113,132311,211313,231113,231311,112133,112331,132131,113123,113321,133121,313121,211331,231131,213113,213311,213131,311123,311321,331121,312113,312311,332111,314111,221411,431111,111224,111422,121124,121421,141122,141221,112214,112412,122114,122411,142112,142211,241211,221114,413111,241112,134111,111242,121142,121241,114212,124112,124211,411212,421112,421211,212141,214121,412121,111143,111341,131141,114113,114311,411113,411311,113141,114131,311141,411131,211412,211214,211232".split(",").map(function(p){ return p.split("").map(Number); });
  var STOP = [2,3,3,1,1,1,2];
  var C39 = {"000110100":"0","100100001":"1","001100001":"2","101100000":"3","000110001":"4","100110000":"5","001110000":"6","000100101":"7","100100100":"8","001100100":"9","100001001":"A","001001001":"B","101001000":"C","000011001":"D","100011000":"E","001011000":"F","000001101":"G","100001100":"H","001001100":"I","000011100":"J","100000011":"K","001000011":"L","101000010":"M","000010011":"N","100010010":"O","001010010":"P","000000111":"Q","100000110":"R","001000110":"S","000010110":"T","110000001":"U","011000001":"V","111000000":"W","010010001":"X","110010000":"Y","011010000":"Z","010000101":"-","110000100":".","011000100":" ","010010100":"*","010101000":"$","010100010":"/","010001010":"+","000101010":"%"};
  var EL = [[3,2,1,1],[2,2,2,1],[2,1,2,2],[1,4,1,1],[1,1,3,2],[1,2,3,1],[1,1,1,4],[1,3,1,2],[1,2,1,3],[3,1,1,2]];
  var EG = EL.map(function(p){ return p.slice().reverse(); });
  var EPAR = ["LLLLLL","LLGLGG","LLGGLG","LLGGGL","LGLLGG","LGGLLG","LGGGLL","LGLGLG","LGLGGL","LGGLGL"];
  var ITF = ["00110","10001","01001","11000","00101","10100","01100","00011","10010","01010"];

  // line of gray values -> run lengths; bar[i] true for dark runs
  function runs(g, mode){
    var n0 = g.length, i; if(n0 < 40) return null;
    var n = mode ? n0*2-1 : n0, s = new Float32Array(n);
    if(mode){
      // upsample x2 (linear) then unsharp mask – recovers thin bars on blurry camera frames
      var up = new Float32Array(n); for(i=0;i<n0;i++){ up[2*i]=g[i]; if(i<n0-1) up[2*i+1]=(g[i]+g[i+1])/2; }
      var bl = new Float32Array(n), R = 4;
      for(i=0;i<n;i++){ var t=0, c=0; for(var q=Math.max(0,i-R);q<=Math.min(n-1,i+R);q++){ t+=up[q]; c++; } bl[i]=t/c; }
      for(i=0;i<n;i++) s[i] = up[i] + 1.5*(up[i]-bl[i]);
    } else { s[0]=g[0]; s[n-1]=g[n-1]; for(i=1;i<n-1;i++) s[i] = (g[i-1]+2*g[i]+g[i+1])/4; }
    var half = Math.max(8, (n/24)|0), pre = new Float64Array(n+1);
    for(i=0;i<n;i++) pre[i+1] = pre[i]+s[i];
    var bs = Math.max(4, half>>1), nb = Math.ceil(n/bs), bmn = new Float32Array(nb), bmx = new Float32Array(nb), b, j;
    for(b=0;b<nb;b++){ var mn=255, mx=0; for(j=b*bs;j<Math.min(n,(b+1)*bs);j++){ if(s[j]<mn) mn=s[j]; if(s[j]>mx) mx=s[j]; } bmn[b]=mn; bmx[b]=mx; }
    var w = [], bar = [], cur = null, len = 0;
    for(i=0;i<n;i++){
      var a = Math.max(0,i-half), e = Math.min(n,i+half+1), mean = (pre[e]-pre[a])/(e-a);
      var b0 = (a/bs)|0, b1 = Math.min(nb-1,((e-1)/bs)|0), lo=255, hi=0;
      for(b=b0;b<=b1;b++){ if(bmn[b]<lo) lo=bmn[b]; if(bmx[b]>hi) hi=bmx[b]; }
      var d = (hi-lo) >= 30 && s[i] < (lo+hi)/2;
      if(d===cur) len++; else { if(cur!==null){ w.push(len); bar.push(cur); } cur=d; len=1; }
    }
    w.push(len); bar.push(cur);
    return {w:w, bar:bar};
  }
  function err(w, i, p, u){ var e=0; for(var k=0;k<p.length;k++) e += Math.abs(w[i+k]/u - p[k]); return e; }
  function sum(w, i, k){ var t=0; for(var j=0;j<k;j++) t+=w[i+j]; return t; }

  function c128(w, bar){
    var n = w.length;
    for(var i=1;i+12<n;i++){
      if(!bar[i]) continue;
      var u = sum(w,i,6)/11, st = -1, be = 1.6;
      for(var v=103;v<=105;v++){ var e = err(w,i,P128[v],u); if(e<be){ be=e; st=v; } }
      if(st<0 || w[i-1] < 4*u) continue;
      var vals = [st], j = i+6, ok = false;
      while(j+6 < n){
        var uu = sum(w,j,6)/11;
        if(Math.abs(uu-u)/u > 0.4) break;
        var es = j+7<=n ? err(w,j,STOP,sum(w,j,7)/13) : 99, bv = -1, bd = 2.2;
        for(var q=0;q<106;q++){ var e2 = err(w,j,P128[q],uu); if(e2<bd){ bd=e2; bv=q; } }
        if(es < 1.6 && es <= bd+0.3 && vals.length>=3){ ok = true; break; }
        if(bv<0) break;
        vals.push(bv); j += 6; u = (u*3+uu)/4;
      }
      if(!ok) continue;
      var cs = vals[0]; for(var k=1;k<vals.length-1;k++) cs += k*vals[k];
      if(cs % 103 !== vals[vals.length-1]) continue;
      var t = c128text(vals.slice(0,-1)); if(t && t.length>=3) return t;
    }
    return null;
  }
  function c128text(v){
    var set = v[0]===103?"A":v[0]===104?"B":"C", out = "", shift = false;
    for(var k=1;k<v.length;k++){
      var x = v[k], cur = shift ? (set==="A"?"B":"A") : set; shift = false;
      if(cur==="C"){ if(x<100) out += (x<10?"0":"")+x; else if(x===100) set="B"; else if(x===101) set="A"; continue; }
      if(x<96){ if(cur==="B" || x<64) out += String.fromCharCode(x+32); continue; }
      if(x===98) shift = true; else if(x===99) set = "C";
      else if(x===100 && cur==="A") set = "B"; else if(x===101 && cur==="B") set = "A";
    }
    return out;
  }
  function c39(w, bar){
    var n = w.length;
    for(var i=1;i+9<n;i++){
      if(!bar[i]) continue;
      var out = "", j = i, started = false, nw = 0;
      while(j+9 <= n){
        var seg = w.slice(j,j+9), srt = seg.slice().sort(function(a,b){return b-a;}), thr = (srt[2]+srt[3])/2;
        if(srt[2] < srt[3]*1.4) break;
        var key = seg.map(function(x){ return x>thr?"1":"0"; }).join(""), ch = C39[key];
        if(!ch) break;
        if(!started){ if(ch!=="*" || w[j-1] < srt[8]*5) break; started = true; nw = srt[8]; }
        else if(ch==="*"){ return out.length>=3 ? out : null; }
        else out += ch;
        j += 10;
      }
    }
    return null;
  }
  function ean(w, bar){
    var n = w.length;
    for(var i=1;i+59<n;i++){
      if(!bar[i]) continue;
      var u = sum(w,i,3)/3; if(err(w,i,[1,1,1],u)>1.0 || w[i-1] < 5*u) continue;
      var j = i+3, digs = [], par = "", bad = false, d, k;
      for(k=0;k<6;k++){
        var uu = sum(w,j,4)/7, bl=-1, bg=-1, el=1.4, eg=1.4;
        for(d=0;d<10;d++){ var a=err(w,j,EL[d],uu), b=err(w,j,EG[d],uu); if(a<el){el=a;bl=d;} if(b<eg){eg=b;bg=d;} }
        if(bl<0 && bg<0){ bad=true; break; }
        if(bl>=0 && (bg<0 || el<=eg)){ digs.push(bl); par+="L"; } else { digs.push(bg); par+="G"; }
        j += 4;
      }
      if(bad) continue;
      if(err(w,j,[1,1,1,1,1],sum(w,j,5)/5) > 1.6) continue;
      j += 5;
      for(k=0;k<6;k++){
        var u3 = sum(w,j,4)/7, br=-1, er=1.4;
        for(d=0;d<10;d++){ var c=err(w,j,EL[d],u3); if(c<er){er=c;br=d;} }
        if(br<0){ bad=true; break; } digs.push(br); j += 4;
      }
      if(bad) continue;
      var f = EPAR.indexOf(par); if(f<0) continue;
      var all = [f].concat(digs), cs = 0;
      for(k=0;k<12;k++) cs += all[k]*(k%2?3:1);
      if((10 - cs%10)%10 !== all[12]) continue;
      return all.join("");
    }
    return null;
  }
  function itf(w, bar){
    var n = w.length;
    for(var i=1;i+14<n;i++){
      if(!bar[i]) continue;
      var u = sum(w,i,4)/4; if(err(w,i,[1,1,1,1],u)>1.0 || w[i-1] < 5*u) continue;
      var j = i+4, out = "";
      while(j+10 <= n){
        var b5 = [w[j],w[j+2],w[j+4],w[j+6],w[j+8]], s5 = [w[j+1],w[j+3],w[j+5],w[j+7],w[j+9]];
        var d1 = itfd(b5), d2 = itfd(s5);
        if(d1<0 || d2<0) break;
        out += d1+""+d2; j += 10;
      }
      if(out.length>=6 && j+3<=n && w[j] > w[j+1]*1.3) return out;
    }
    return null;
  }
  function itfd(a){
    var s = a.slice().sort(function(x,y){return y-x;}); if(s[1] < s[2]*1.4) return -1;
    var thr = (s[1]+s[2])/2, k = a.map(function(x){ return x>thr?"1":"0"; }).join("");
    return ITF.indexOf(k);
  }
  function decodeRuns(r){
    if(!r || r.w.length < 20) return null;
    var res = c128(r.w, r.bar);
    if(res) return {t:res, f:"code128", strong:true};
    res = ean(r.w, r.bar); if(res) return {t:res, f:"ean13", strong:true};
    res = c39(r.w, r.bar); if(res) return {t:res, f:"code39", strong:false};
    res = itf(r.w, r.bar); if(res) return {t:res, f:"itf", strong:false};
    return null;
  }
  function decodeLine(g){
    for(var m=0;m<2;m++){
      var r = runs(g, m); if(!r) return null;
      var x = decodeRuns(r); if(x) return x;
      r.w.reverse(); r.bar.reverse();
      x = decodeRuns(r); if(x) return x;
    }
    return null;
  }
  // gray: Uint8Array w*h. Scans rows (and columns if cols) in the band [y0,y1] fractions
  function decodeGray(gray, W, H, opt){
    opt = opt||{}; var rows = opt.rows||24, y0 = opt.y0==null?0.2:opt.y0, y1 = opt.y1==null?0.8:opt.y1, hits = {};
    function take(x){ if(!x) return null; var k=x.f+":"+x.t; hits[k]=(hits[k]||0)+1; if(x.strong || hits[k]>=2) return x; return null; }
    var line = new Uint8Array(Math.max(W,H)), i, k, y, x, res;
    for(i=0;i<rows;i++){
      y = Math.round(H*(y0 + (y1-y0)*(i+0.5)/rows));
      for(k=0;k<W;k++) line[k] = gray[y*W+k];
      res = take(decodeLine(line.subarray(0,W))); if(res) return res;
    }
    if(opt.cols){
      for(i=0;i<rows;i++){
        x = Math.round(W*(y0 + (y1-y0)*(i+0.5)/rows));
        for(k=0;k<H;k++) line[k] = gray[k*W+x];
        res = take(decodeLine(line.subarray(0,H))); if(res) return res;
      }
    }
    return null;
  }
  function grayOf(img){ var d = img.data, n = img.width*img.height, g = new Uint8Array(n); for(var i=0,p=0;i<n;i++,p+=4) g[i] = (d[p]*77+d[p+1]*150+d[p+2]*29)>>8; return g; }
  return {decodeGray:decodeGray, grayOf:grayOf, decodeLine:decodeLine, _runs:runs, _dr:decodeRuns};
})();
if(typeof module!=="undefined") module.exports = BC;

