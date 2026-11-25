// ===== Μικρός κωδικοποιητής QR (byte mode, διόρθωση L, εκδόσεις 1–10) =====
var QR = (function(){
  var ECC = [0,7,10,15,20,26,18,20,24,30,18], NB = [0,1,1,1,1,1,2,2,2,2,4];  // επίπεδο L
  function rawMods(v){ var r = (16*v+128)*v+64; if(v>=2){ var n = Math.floor(v/7)+2; r -= (25*n-10)*n-55; if(v>=7) r -= 36; } return r; }
  function dataCw(v){ return Math.floor(rawMods(v)/8) - ECC[v]*NB[v]; }
  function mul(x, y){ var z = 0; for(var i=7;i>=0;i--){ z = (z<<1) ^ ((z>>>7)*0x11D); z ^= ((y>>>i)&1)*x; } return z & 255; }
  function rsDiv(d){ var r = []; for(var i=0;i<d-1;i++) r.push(0); r.push(1); var root = 1; for(var i2=0;i2<d;i2++){ for(var j=0;j<r.length;j++){ r[j] = mul(r[j], root); if(j+1<r.length) r[j] ^= r[j+1]; } root = mul(root, 2); } return r; }
  function rsRem(data, div){ var r = div.map(function(){ return 0; }); data.forEach(function(b){ var f = b ^ r.shift(); r.push(0); div.forEach(function(c,i){ r[i] ^= mul(c, f); }); }); return r; }
  function utf8(s){ var u = unescape(encodeURIComponent(s)), a = []; for(var i=0;i<u.length;i++) a.push(u.charCodeAt(i)); return a; }
  function encode(text){
    var bytes = utf8(text), v = 1;
    for(; v<=10; v++){ var cap = dataCw(v)*8, need = 4 + (v<10?8:16) + bytes.length*8; if(need <= cap) break; }
    if(v>10) throw new Error("too long");
    var bits = [], put = function(val, n){ for(var i=n-1;i>=0;i--) bits.push((val>>>i)&1); };
    put(4,4); put(bytes.length, v<10?8:16); bytes.forEach(function(b){ put(b,8); });
    var cap2 = dataCw(v)*8; put(0, Math.min(4, cap2-bits.length)); put(0, (8 - bits.length%8)%8);
    for(var pad=0xEC; bits.length<cap2; pad ^= 0xEC^0x11) put(pad,8);
    var data = []; for(var i=0;i<bits.length;i+=8){ var b = 0; for(var j=0;j<8;j++) b = (b<<1)|bits[i+j]; data.push(b); }
    // μπλοκ + ECC + ανάμιξη
    var nb = NB[v], ec = ECC[v], raw = Math.floor(rawMods(v)/8), nShort = nb - raw%nb, sLen = Math.floor(raw/nb), div = rsDiv(ec), blocks = [], k = 0;
    for(var bi=0; bi<nb; bi++){ var dat = data.slice(k, k + sLen - ec + (bi<nShort?0:1)); k += dat.length; var e = rsRem(dat, div); if(bi<nShort) dat.push(0); blocks.push(dat.concat(e)); }
    var cw = []; for(var ii=0; ii<blocks[0].length; ii++) blocks.forEach(function(bl, jj){ if(ii!==sLen-ec || jj>=nShort) cw.push(bl[ii]); });
    // πίνακας
    var size = v*4+17, M = [], F = [];
    for(var y=0;y<size;y++){ M.push([]); F.push([]); for(var x=0;x<size;x++){ M[y].push(false); F[y].push(false); } }
    var setF = function(x, y, d){ M[y][x] = d; F[y][x] = true; };
    for(var t=0;t<size;t++){ setF(6, t, t%2===0); setF(t, 6, t%2===0); }
    var finder = function(cx, cy){ for(var dy=-4;dy<=4;dy++) for(var dx=-4;dx<=4;dx++){ var d = Math.max(Math.abs(dx), Math.abs(dy)), xx = cx+dx, yy = cy+dy; if(xx>=0 && xx<size && yy>=0 && yy<size) setF(xx, yy, d!==2 && d!==4); } };
    finder(3,3); finder(size-4,3); finder(3,size-4);
    if(v>1){ var na = Math.floor(v/7)+2, step = Math.ceil((v*4+4)/(na*2-2))*2, pos = [6]; for(var a=0, p=size-7; a<na-1; a++, p-=step) pos.splice(1,0,p);
      for(var ai=0; ai<na; ai++) for(var aj=0; aj<na; aj++){ if((ai===0&&aj===0)||(ai===0&&aj===na-1)||(ai===na-1&&aj===0)) continue;
        for(var dy2=-2;dy2<=2;dy2++) for(var dx2=-2;dx2<=2;dx2++) setF(pos[ai]+dx2, pos[aj]+dy2, Math.max(Math.abs(dx2),Math.abs(dy2))!==1); } }
    var fmt = function(mask){ var d = (1<<3)|mask, r = d; for(var q=0;q<10;q++) r = (r<<1) ^ ((r>>>9)*0x537); var bb = ((d<<10)|r) ^ 0x5412, g = function(i){ return ((bb>>>i)&1)!==0; };
      for(var i=0;i<=5;i++) setF(8, i, g(i)); setF(8,7,g(6)); setF(8,8,g(7)); setF(7,8,g(8)); for(var i2=9;i2<15;i2++) setF(14-i2, 8, g(i2));
      for(var i3=0;i3<8;i3++) setF(size-1-i3, 8, g(i3)); for(var i4=8;i4<15;i4++) setF(8, size-15+i4, g(i4)); setF(8, size-8, true); };
    fmt(0);
    if(v>=7){ var rv = v; for(var q2=0;q2<12;q2++) rv = (rv<<1) ^ ((rv>>>11)*0x1F25); var vb = (v<<12)|rv; for(var i5=0;i5<18;i5++){ var bit = ((vb>>>i5)&1)!==0, A = size-11+i5%3, B = Math.floor(i5/3); setF(A, B, bit); setF(B, A, bit); } }
    var bi2 = 0;
    for(var right=size-1; right>=1; right-=2){ if(right===6) right = 5;
      for(var vert=0; vert<size; vert++) for(var jx=0; jx<2; jx++){ var X = right-jx, up = ((right+1)&2)===0, Y = up ? size-1-vert : vert;
        if(!F[Y][X] && bi2 < cw.length*8){ M[Y][X] = ((cw[bi2>>>3] >>> (7-(bi2&7))) & 1)!==0; bi2++; } } }
    for(var yy2=0; yy2<size; yy2++) for(var xx2=0; xx2<size; xx2++) if(!F[yy2][xx2] && (xx2+yy2)%2===0) M[yy2][xx2] = !M[yy2][xx2];
    fmt(0);
    return M;
  }
  function svg(text, px){
    var M = encode(text), n = M.length, q = 4, d = "";
    for(var y=0;y<n;y++) for(var x=0;x<n;x++) if(M[y][x]) d += "M"+(x+q)+","+(y+q)+"h1v1h-1z";
    var s = n+q*2; return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+s+' '+s+'" width="'+(px||200)+'" height="'+(px||200)+'" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="'+d+'" fill="#000"/></svg>';
  }
  return {encode:encode, svg:svg};
})();
