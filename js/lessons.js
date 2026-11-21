/* TypeForge - lessons.js
   Text generators for lessons, practice drills, speed tests and the ladder.
   Loaded as a classic script (see index.html for the order). */

function ident() {
  var V = ["get", "set", "is", "has", "on", "handle", "fetch", "update"], o = [];
  for (var i = 0; i < 14; i++) {
    var a = rnd(D), b = rnd(D), v = rnd(V), m = i % 7;
    o.push(m === 0 ? v + cap(a) + cap(b) : m === 1 ? a + "_" + b : m === 2 ? cap(a) + cap(b) : m === 3 ? a + "-" + b : m === 4 ? (a + "_" + b).toUpperCase() : m === 5 ? "_" + a + cap(b) : v + "_" + a);
  }
  return o.join(" ");
}
function bankText(b) {
  if (b === "id") return ident();
  var a = BANK[b], o = [];
  for (var i = 0; i < (b === "vim" ? 6 : 4); i++) o.push(rnd(a));
  return o.join("\n") + "\n";
}
function ladderText(i) {
  var sh = D.filter(function(x) {
    return x.length <= 5;
  }), lg = D.filter(function(x) {
    return x.length >= 5;
  });
  if (i < 6) return pick(sh, 28);
  if (i < 12) return pick(D, 30);
  if (i < 15) return pick(SEN, 4);
  if (i < 18) return pick(BANK.js.concat(BANK.node, BANK.react), 6);
  return pick(lg, 30);
}
function words(n, f) {
  var p = f ? D.filter(f) : D;
  if (p.length < 6) return null;
  var o = [];
  for (var i = 0; i < n; i++) o.push(rnd(p));
  return o;
}
function rstr(set, n, bias) {
  var o = [];
  for (var i = 0; i < n; i++) {
    var L = 2 + Math.floor(Math.random() * 4), w = "";
    for (var j = 0; j < L; j++) w += rnd(bias && Math.random() < 0.6 ? bias : set);
    o.push(w);
  }
  return o;
}
function lessonText(i) {
  var L = LESS[i], t = L.t || "l", lr = "", nm = "";
  for (var j = 0; j <= i; j++) {
    if (!LESS[j].t) lr += LESS[j].k;
    if (LESS[j].t === "num") nm += LESS[j].k;
  }
  var all = "abcdefghijklmnopqrstuvwxyz";
  if (t === "code") return pick(CODE, 3);
  if (t === "sen") return pick(SEN, 3);
  if (t === "bank") return bankText(L.b);
  if (t === "enter") return [1, 2, 3, 4].map(function() {
    return pick(D, 4);
  }).join("\n") + "\n";
  if (t === "caps") return words(10).map(function(w2) {
    return w2.toUpperCase();
  }).join(" ");
  if (t === "br") {
    var pr = ["()", "[]", "{}", "<>"], ob = [];
    for (var a1 = 0; a1 < 14; a1++) {
      var q = rnd(pr);
      ob.push(q[0] + rnd(D) + q[1]);
    }
    return ob.join(" ");
  }
  if (t === "op") {
    var os = ["+", "-", "*", "/", "%", "==", "!=", "&&", "||", "=>", "<=", ">=", "++", "**"], oo = [];
    for (var a2 = 0; a2 < 10; a2++) oo.push(rnd("xyzabn") + " " + rnd(os) + " " + Math.floor(Math.random() * 90) + ";");
    return oo.join(" ");
  }
  if (t === "qt") return pick(QT, 14);
  if (t === "mix") return rstr(all + "0123456789ABCDEFGH", 14).join(" ");
  if (t === "ml") return [1, 2, 3].map(function() {
    return rnd(MLC);
  }).join("\n") + "\n";
  if (t === "term") return [1, 2, 3, 4].map(function() {
    return rnd(TERM);
  }).join("\n") + "\n";
  if (t === "np") {
    var npk = "";
    LESS.forEach(function(x, j2) {
      if (x.t === "np" && j2 <= i) npk += x.k;
    });
    var no = [];
    if (L.mix) {
      for (var a3 = 0; a3 < 6; a3++) no.push("" + (100 + Math.floor(Math.random() * 900)) + "." + ("0" + Math.floor(Math.random() * 100)).slice(-2));
      return no.join("\n") + "\n";
    }
    for (var a4 = 0; a4 < 16; a4++) {
      var ns = "", nn = 2 + Math.floor(Math.random() * 4);
      for (var a5 = 0; a5 < nn; a5++) ns += rnd(Math.random() < 0.6 ? L.k : npk);
      no.push(ns);
    }
    return no.join(" ");
  }
  if (t === "cap") return (words(14) || []).map(cap).join(" ");
  if (t === "num") {
    var o = [];
    for (var a = 0; a < 16; a++) {
      var s = "", n = 2 + Math.floor(Math.random() * 4);
      for (var b = 0; b < n; b++) s += rnd(Math.random() < 0.6 ? L.k : nm);
      o.push(s);
    }
    return o.join(" ");
  }
  if (t === "sym") {
    var sy = `!@#$%^&*()-_=+[]{};:'",.<>/?`, o = [];
    for (var c = 0; c < 8; c++) {
      var s = "";
      for (var d = 0; d < 4; d++) s += rnd(sy);
      o.push(s, rnd(D));
    }
    return o.join(" ");
  }
  var nk = L.k, w = words(14, function(x) {
    return x.split("").every(function(c2) {
      return lr.indexOf(c2) >= 0;
    }) && x.split("").some(function(c2) {
      return nk.indexOf(c2) >= 0;
    });
  });
  return rstr(nk, 5, nk).concat(w || rstr(lr, 14, nk)).join(" ");
}
function practiceText() {
  if (pk.indexOf("parah") === 0) {
    var hi = +pk.slice(5);
    return { t: PARAH[hi], m: "Hinglish paragraph " + (hi + 1) + " of 5: " + PHT[hi] + ". Paanchon mein har key kam se kam 10 baar aati hai." };
  }
  if (pk.indexOf("parae") === 0) {
    var ei = +pk.slice(5);
    return { t: PARAE[ei], m: "English paragraph " + (ei + 1) + " of 5: " + PET[ei] + ". Paanchon mein har key kam se kam 10 baar aati hai." };
  }
  if (pk.indexOf("para") === 0) {
    var pi = +pk.slice(4);
    return { t: PARA[pi], m: "Paragraph " + (pi + 1) + " of 5: " + PT[pi] + ". Paanchon paragraphs mein har key kam se kam 10 baar aati hai." };
  }
  if (pk === "pairs") {
    var bs = Object.keys(store.bg).filter(function(b) {
      return store.bg[b][0] >= 3;
    }).sort(function(a, b) {
      return store.bg[b][1] - store.bg[a][1];
    }).slice(0, 8);
    if (bs.length < 3) return { t: pick(D, 30), m: "Abhi data kam hai. Kuch lessons ya tests karo, phir ye tumhari sabse slow key pairs pe drill banayega." };
    var o = [];
    for (var r = 0; r < 2; r++) bs.forEach(function(b) {
      var w2 = D.filter(function(x) {
        return x.indexOf(b) >= 0;
      });
      o.push(b + " " + b);
      o.push(w2.length ? rnd(w2) : b + rnd(D));
      if (w2.length) o.push(rnd(w2));
    });
    return { t: o.join(" "), m: "Slowest pairs: " + bs.join("  ") };
  }
  if (pk.indexOf("b:") === 0) return { t: bankText(pk.slice(2)) };
  if (pk.indexOf("ch") === 0) {
    var ci = +pk.slice(2), pt = [];
    ORD.filter(function(i2) {
      return LESS[i2].ch === ci;
    }).sort(function() {
      return Math.random() - 0.5;
    }).slice(0, 4).forEach(function(i2) {
      pt.push(lessonText(i2).split(" ").slice(0, 9).join(" ").replace(/\n+$/, ""));
    });
    return { t: pt.join(" "), m: "Chapter review: " + CH[ci], np: ci === 6 };
  }
  if (pk === "weak") {
    var ks = Object.keys(store.k).filter(function(c) {
      return store.k[c][0] >= 5 && store.k[c][1] > 0 && /\S/.test(c);
    }).sort(function(a, b) {
      return store.k[b][1] / store.k[b][0] - store.k[a][1] / store.k[a][0];
    }).slice(0, 6).join("");
    if (!ks) return { t: pick(D, 30), m: "No weak keys recorded yet. Do a few lessons or tests first; this drill then targets your hardest keys." };
    var w = words(16, function(x) {
      return x.split("").some(function(c) {
        return ks.indexOf(c) >= 0;
      });
    });
    return { t: rstr(ks, 6, ks).concat(w || []).join(" "), m: "Targeting your weakest keys: " + ks.split("").join(" ") };
  }
  if (pk === "words") return { t: pick(D, 30) };
  if (pk === "sent") return { t: pick(SEN, 3) };
  if (pk === "code") return { t: pick(CODE, 4) };
  if (pk === "num") {
    var o = [];
    for (var i = 0; i < 18; i++) {
      var n = 2 + Math.floor(Math.random() * 5), s = "";
      for (var j = 0; j < n; j++) s += Math.floor(Math.random() * 10);
      if (Math.random() < 0.2) s += "." + Math.floor(Math.random() * 100);
      o.push(s);
    }
    return { t: o.join(" ") };
  }
  if (pk === "sym") {
    var sy = `!@#$%^&*()-_=+[]{};:'",.<>/?`, o = [];
    for (var i = 0; i < 14; i++) {
      var s = "";
      for (var j = 0; j < 4; j++) s += rnd(sy);
      o.push(s);
    }
    return { t: o.join(" ") };
  }
  var ct = $("#ct").value.replace(/\r/g, "").replace(/\t/g, "  ").replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/[^\x20-\x7e\n]/g, "").replace(/ +\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim().slice(0, 900);
  return { t: ct || "Paste your own text or code above, then press the start button.", m: ct.indexOf("\n") >= 0 ? "Lines preserved: Enter aur indentation ke spaces bhi type karne hain." : "" };
}
function testText() {
  var w = words(30);
  if (punct) w = w.map(function(x, i) {
    if (i % 7 === 0) x = cap(x);
    if (i % 7 === 6) x += rnd([".", ",", "?", "!", ";"]);
    return x;
  });
  return w.join(" ") + " ";
}
