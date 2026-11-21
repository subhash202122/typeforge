/* TypeForge - symbols.js
   Special keys trainer (name to key recall drill with mastery tracking).
   Loaded as a classic script (see index.html for the order). */

var Sy = { mode: "name", weakOnly: false, cur: null, i: 0, n: 20, first: true, wrong: 0, hits: 0, miss: {}, newm: [], fin: false };
function symInfo(c) {
  var si = SH.indexOf(c), b = si >= 0 ? BS[si] : c, f = F[b];
  return { base: b, shift: si >= 0, finger: FN[f], left: f < 4 };
}
function symCombo(c) {
  var o = symInfo(c);
  return (o.shift ? (o.left ? "Right" : "Left") + " Shift + " : "") + o.base + " key (" + o.finger + ")";
}
function symIdx(c) {
  for (var k = 0; k < SY.length; k++) if (SY[k][0] === c) return k;
  return -1;
}
function symMark(c) {
  var a = $("#kb2").querySelectorAll(".nx");
  Array.prototype.forEach.call(a, function(e2) {
    e2.classList.remove("nx");
  });
  if (c) {
    var o = symInfo(c), e = keyEl(o.base, $("#kb2"));
    if (e) e.classList.add("nx");
    if (o.shift) {
      var sh = keyEl(o.left ? "shiftR" : "shiftL", $("#kb2"));
      if (sh) sh.classList.add("nx");
    }
  }
}
function symW(c) {
  var r = store.sy[c] || [0, 0], w = 1 + (r[0] ? r[1] / r[0] * 4 : 3);
  return store.sm[c] ? w * 0.25 : w;
}
function symPick() {
  var pool = SY.map(function(x2) {
    return x2[0];
  });
  if (Sy.weakOnly) {
    var wk = pool.filter(function(c) {
      var r = store.sy[c];
      return r && r[1] > 0 && !store.sm[c];
    });
    if (wk.length > 2) pool = wk;
  }
  var t = 0, ws = pool.map(function(c) {
    var w = c === Sy.cur ? 0 : symW(c);
    t += w;
    return w;
  }), x = Math.random() * t;
  for (var i = 0; i < pool.length; i++) {
    x -= ws[i];
    if (x <= 0) return pool[i];
  }
  return pool[0];
}
function symChart() {
  var h = "";
  GR.forEach(function(g) {
    h += "<h3>" + g[0] + '</h3><div class="sg">';
    g[1].split("").forEach(function(c) {
      var ix = symIdx(c);
      h += '<button class="sc" data-i="' + ix + '"><b>' + esc(c) + "</b><span>" + SY[ix][1] + "</span><small>" + symCombo(c) + "</small>" + (store.sm[c] ? '<i class="ck">\u2713</i>' : "") + "</button>";
    });
    h += "</div>";
  });
  $("#schart").innerHTML = h;
  $("#schart").onclick = function(e) {
    var b = e.target.closest("button");
    if (!b) return;
    var k = +b.dataset.i;
    symMark(SY[k][0]);
    $("#sfb").textContent = SY[k][0] + "  =  " + symCombo(SY[k][0]) + ".  " + SY[k][2];
  };
}
function symRender() {
  var e = SY[symIdx(Sy.cur)];
  $("#sq").innerHTML = Sy.mode === "name" ? '<div class="sbig">' + e[1] + '</div><div class="hint">' + esc(e[2]) + "</div>" : '<div class="sbig mono">' + esc(e[0]) + '</div><div class="hint">Ye kaunsi key hai? Dabao.</div>';
  symMark(Sy.wrong >= 2 ? Sy.cur : null);
  $("#ss1").textContent = Sy.i + "/" + Sy.n;
  $("#ss2").textContent = (Sy.i ? Math.round(Sy.hits / Sy.i * 100) : 0) + "%";
  $("#ss3").textContent = Object.keys(store.sm).length + "/" + SY.length;
}
function symStart() {
  Sy.i = 0;
  Sy.hits = 0;
  Sy.miss = {};
  Sy.newm = [];
  Sy.fin = false;
  Sy.cur = null;
  Sy.cur = symPick();
  Sy.first = true;
  Sy.wrong = 0;
  $("#sres").className = "res";
  $("#sfb").textContent = "Naam ya symbol dikhega, sahi key dabao. 2 galti pe keyboard pe jagah dikhegi. Esc dabao toh naya round.";
  symChart();
  symRender();
}
function symEnd() {
  Sy.fin = true;
  dayMark("s");
  var acc = Math.round(Sy.hits / Sy.n * 100), m = Object.keys(store.sm).length, wk = Object.keys(Sy.miss).sort(function(a, b) {
    return Sy.miss[b] - Sy.miss[a];
  }).slice(0, 4).map(function(c) {
    return c + "  " + symCombo(c);
  });
  $("#sres").innerHTML = "<h2>" + acc + "% first-try accuracy</h2><p>" + (Sy.newm.length ? "Naye mastered \u2713: <b>" + esc(Sy.newm.join(" ")) + "</b><br>" : "") + "Total mastered: " + m + "/" + SY.length + (m === SY.length ? "  \u2713 All special characters done!" : "") + "</p>" + (wk.length ? "<p>Yaad rakhna: <b>" + esc(wk.join("   |   ")) + "</b></p>" : "") + '<button class="go" id="sagain">Next round</button>';
  $("#ss1").textContent = Sy.n + "/" + Sy.n;
  $("#ss2").textContent = acc + "%";
  $("#ss3").textContent = m + "/" + SY.length;
  $("#sres").className = "res show";
  $("#sagain").onclick = symStart;
  $("#sq").innerHTML = '<div class="sbig">Round complete</div>';
  symMark(null);
  side();
  symChart();
}
function symKey(e) {
  if (e.key === "Escape") {
    e.preventDefault();
    symStart();
    return;
  }
  if (Sy.fin || e.key.length !== 1) return;
  e.preventDefault();
  var c = Sy.cur, r = store.sy[c] = store.sy[c] || [0, 0];
  if (e.key === c) {
    if (Sy.first) {
      r[0]++;
      Sy.hits++;
      store.ss[c] = (store.ss[c] || 0) + 1;
      if (store.ss[c] >= 3 && !store.sm[c]) {
        store.sm[c] = 1;
        Sy.newm.push(c);
        symChart();
        side();
      }
    }
    Sy.i++;
    beep(660);
    save();
    $("#sfb").textContent = "\u2713 " + c + "  =  " + symCombo(c);
    if (Sy.i >= Sy.n) {
      symEnd();
      return;
    }
    Sy.cur = symPick();
    Sy.first = true;
    Sy.wrong = 0;
    symRender();
  } else {
    if (Sy.first) {
      r[0]++;
      r[1]++;
      store.ss[c] = 0;
      if (store.sm[c]) {
        delete store.sm[c];
        symChart();
        side();
      }
      Sy.first = false;
      Sy.miss[c] = (Sy.miss[c] || 0) + 1;
    }
    Sy.wrong++;
    beep(180);
    var k = symIdx(e.key);
    $("#sfb").textContent = "Galat: tumne " + e.key + (k >= 0 ? " (" + SY[k][1] + ")" : "") + " dabaya." + (Sy.wrong >= 2 ? "  Sahi: " + symCombo(c) : "");
    save();
    symRender();
  }
}
