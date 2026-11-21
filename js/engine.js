/* TypeForge - engine.js
   The typing engine: painting text, stats, keystrokes, ghost caret, results and key timing.
   Loaded as a classic script (see index.html for the order). */

function paceWPM() {
  var h = store.hist.slice(-5);
  if (!h.length) return 20;
  var a = h.reduce(function(x, y) {
    return x + y.w;
  }, 0) / h.length;
  return Math.max(15, Math.round(a * 1.05 + 1));
}
function gh() {
  return store.o.p ? paceWPM() : 0;
}
function paint() {
  var h = "", gx = C && C.ghost && start ? Math.floor((Date.now() - start) / 12e3 * C.ghost) : -1;
  for (var i = 0; i < text.length; i++) {
    var c = text[i], k = (i < pos ? typed[i] === 1 ? "ok" : "bad" : i === pos ? "cur" : "") + (i === gx ? " gh" : "");
    h += "<span" + (k ? ' class="' + k + '"' : "") + ">" + (c === "\n" ? "\u21B5\n" : c === " " && typed[i] === 2 ? "&middot;" : esc(c)) + "</span>";
  }
  var b = $("#box");
  b.innerHTML = h;
  var cu = b.querySelector(".cur");
  if (cu) {
    var t = cu.offsetTop - b.offsetTop - 44;
    b.scrollTop = t > 0 ? t : 0;
  }
  Array.prototype.forEach.call(document.querySelectorAll("#kb .nx"), function(e2) {
    e2.classList.remove("nx");
  });
  var n = text[pos], hint = "";
  if (n === "\n") {
    var en = keyEl("Enter");
    if (en) en.classList.add("nx");
    hint = "Next: Enter  |  right pinky";
  } else if (n !== void 0) {
    var si = SH.indexOf(n), up = n !== n.toLowerCase() && n.toLowerCase() !== n.toUpperCase(), base = si >= 0 ? BS[si] : n.toLowerCase(), e = keyEl(base);
    if (e) e.classList.add("nx");
    hint = "Next: " + (n === " " ? "space" : n) + "  |  " + FN[F[base]] + (F[base] === void 0 ? "" : "");
    if (si >= 0 || up) {
      var left = F[base] < 4, sh = keyEl(left ? "shiftR" : "shiftL");
      if (sh) sh.classList.add("nx");
      hint += " + " + (left ? "right" : "left") + " Shift";
    }
  }
  if (C && C.np) hint = npHint(n);
  if (C && C.caps) {
    var cl = keyEl("CapsLock");
    if (cl) cl.classList.add("nx");
    hint = "Tip: Caps Lock (left pinky) for long capital runs; Shift only for single letters.";
  }
  $("#np").style.display = C && C.np ? "flex" : "none";
  npMark(n);
  if (C && C.ghost) hint += "  |  ghost: " + C.ghost + " WPM";
  $("#hint").textContent = hint;
  stats();
}
function correct() {
  var n = 0;
  for (var i = 0; i < typed.length; i++) if (typed[i] === 1) n++;
  return n;
}
function stats() {
  var el = start ? (Date.now() - start) / 6e4 : 0, w = el > 0.02 ? Math.round(correct() / 5 / el) : 0, s = start ? (Date.now() - start) / 1e3 : 0;
  $("#sw").textContent = w;
  $("#sa").textContent = (tot ? Math.round(correct() / tot * 100) : 100) + "%";
  var v = C && C.dur ? Math.max(0, Math.ceil(C.dur - s)) : Math.floor(s);
  $("#st").textContent = Math.floor(v / 60) + ":" + ("0" + v % 60).slice(-2);
  $("#stl").textContent = C && C.dur ? "Left" : "Time";
  return w;
}
function tick() {
  if (C.dur && start && (Date.now() - start) / 1e3 >= C.dur) {
    finish();
    return;
  }
  if (C.ghost) paint();
  else stats();
}
function begin(cfg) {
  lastT = 0;
  ivs = [];
  conf = {};
  clearInterval(timer);
  C = cfg;
  text = cfg.text;
  pos = 0;
  typed = [];
  start = 0;
  tot = 0;
  miss = {};
  done = false;
  $("#res").className = "res";
  paint();
  $("#box").focus();
}
function restart() {
  if (tab === "course") begin({ text: lessonText(li), li, np: LESS[li].t === "np", caps: LESS[li].t === "caps", ghost: gh() });
  else if (tab === "practice") {
    var p = practiceText();
    begin({ text: p.t, msg: p.m, np: p.np, ghost: gh() });
    $("#hint").textContent = p.m || $("#hint").textContent;
  } else if (tab === "test") begin({ text: td ? testText() : pick(SEN, 4), dur: td, more: td ? testText : 0, test: 1, ghost: gh() });
  else if (tab === "ladder") begin({ text: ladderText(gi), ladder: gi, ghost: 20 + 4 * gi });
  else if (tab === "sym") symStart();
}
function finish() {
  clearInterval(timer);
  done = true;
  var w = stats(), acc = tot ? Math.round(correct() / tot * 100) : 100;
  var weak = Object.keys(miss).sort(function(a, b) {
    return miss[b] - miss[a];
  }).slice(0, 3).map(function(k) {
    return k === "\n" ? "Enter" : k === " " ? "space" : k;
  }).join("  ");
  var cfs = Object.keys(conf).sort(function(a, b) {
    return conf[b] - conf[a];
  }).slice(0, 3).map(function(k) {
    return k + " (" + conf[k] + "x)";
  }).join("   "), rh = consistency(), isL = C.li !== void 0, isG = C.ladder !== void 0, key = isL ? "l" + C.li : isG ? "g" + C.ladder : tab === "test" ? "t" + td : "p", old = store.best[key] || 0, nb = w > old, pass = false, msg;
  if (nb) store.best[key] = w;
  if (isL) {
    pass = acc >= 90;
    if (pass) store.done[C.li] = 1;
    msg = pass ? "Lesson passed. Checkmark added." : "Needs 90% accuracy to pass. Slow down and try again.";
  } else if (isG) {
    pass = w >= C.ghost && acc >= 95;
    if (pass) store.ld[C.ladder] = 1;
    if (acc >= 90) dayMark("l");
    msg = pass ? "Level " + (C.ladder + 1) + " cleared at " + w + " WPM. Checkmark added." : "Target: " + C.ghost + " WPM with 95%+ accuracy. Keep up with the dashed ghost caret and try again.";
  } else {
    var pkk = tab === "test" ? "t" + td : tab === "practice" ? pk : "";
    if (acc >= 90 && pkk) {
      store.pd[pkk] = 1;
      if (pkk === "words") dayMark("w");
      if (pkk === "weak") dayMark("k");
      if (pkk === "pairs") dayMark("p");
      msg = "Completed. Checkmark added.";
    } else msg = acc < 92 ? "Accuracy first. Slow down until mistakes stop; speed follows." : "Good run. Aim for 98% accuracy at this speed.";
  }
  store.hist.push({ w, a: acc, t: Date.now() });
  store.hist = store.hist.slice(-60);
  save();
  var cert = C.test && C.dur >= 30 && acc >= 90 ? '<div class="cert"><span>Certificate of typing speed</span><br><b>' + store.name + "</b><br>" + w + " WPM at " + acc + "% accuracy | Level: " + lvl(w) + "<br><small>" + (/* @__PURE__ */ new Date()).toDateString() + "</small></div>" : "";
  $("#res").innerHTML = "<h2>" + w + " WPM at " + acc + "% accuracy, level " + lvl(w) + (nb && old ? " (new best)" : "") + "</h2><p>" + msg + "</p>" + (weak ? "<p>Mistakes mostly on: <b>" + esc(weak) + "</b></p>" : "") + (cfs ? "<p>Common mix-ups (expected > typed): <b>" + esc(cfs) + "</b></p>" : "") + (rh !== null ? "<p>Rhythm: <b>" + rh + "%</b> (jitna steady rhythm, utni tez aur safe speed)</p>" : "") + cert + '<button class="go" id="again">Try again</button>' + (pass && isL && ORD.indexOf(C.li) < ORD.length - 1 ? ' <button class="go" id="nxt">Next lesson</button>' : "") + (pass && isG && C.ladder < 20 ? ' <button class="go" id="nxt">Next level</button>' : "");
  $("#res").className = "res show";
  $("#again").onclick = restart;
  if ($("#nxt")) $("#nxt").onclick = function() {
    if (isG) gi = C.ladder + 1;
    else li = ORD[ORD.indexOf(C.li) + 1];
    side();
    restart();
  };
  side();
}
function flash() {
  var c = $("#box .cur");
  if (c) {
    c.classList.add("bad");
    setTimeout(function() {
      c.classList.remove("bad");
    }, 120);
  }
}
function typeKey(e) {
  if (e.key === "Tab" || e.key === "Escape") {
    e.preventDefault();
    restart();
    return;
  }
  if (done) return;
  if (e.key === "Backspace") {
    e.preventDefault();
    if (pos > 0 && !store.o.k && !store.o.b) {
      pos--;
      typed.length = pos;
      paint();
    }
    return;
  }
  var key = e.key === "Enter" ? "\n" : e.key;
  if (key.length !== 1) return;
  e.preventDefault();
  if (!start) {
    start = Date.now();
    timer = setInterval(tick, 250);
  }
  var c = text[pos], ok = key === c, nt = performance.now();
  if (ok && lastT && pos > 0 && typed[pos - 1] === 1) {
    lat(text[pos - 1] + c, nt - lastT);
    if (nt - lastT < 1500) ivs.push(nt - lastT);
  }
  lastT = ok ? nt : 0;
  tot++;
  store.k[c] = store.k[c] || [0, 0];
  store.k[c][0]++;
  if (!ok) {
    miss[c] = (miss[c] || 0) + 1;
    store.k[c][1]++;
    var cl2 = (c === "\n" ? "Enter" : c === " " ? "space" : c) + " > " + (key === "\n" ? "Enter" : key === " " ? "space" : key);
    conf[cl2] = (conf[cl2] || 0) + 1;
  }
  beep(ok ? 660 : 180);
  if (!ok && store.o.k) {
    flash();
    return;
  }
  typed[pos] = ok ? 1 : 2;
  pos++;
  if (C.more && text.length - pos < 40) text += C.more();
  if (pos >= text.length && !C.dur) {
    paint();
    finish();
    return;
  }
  paint();
}
var lastT = 0, ivs = [], conf = {};
function consistency() {
  var n = ivs.length;
  if (n < 8) return null;
  var m = ivs.reduce(function(a, b) {
    return a + b;
  }, 0) / n, v = ivs.reduce(function(a, b) {
    return a + (b - m) * (b - m);
  }, 0) / n, cv = Math.sqrt(v) / m;
  return Math.max(0, Math.round(100 * (1 - Math.tanh(cv + Math.pow(cv, 3) / 3 + Math.pow(cv, 5) / 5))));
}
function lat(b, ms) {
  if (ms > 1500 || /\s/.test(b)) return;
  var r = store.bg[b] = store.bg[b] || [0, 0];
  r[0] = Math.min(r[0] + 1, 40);
  r[1] += (ms - r[1]) / r[0];
}
