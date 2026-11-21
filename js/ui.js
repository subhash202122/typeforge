/* TypeForge - ui.js
   Sidebar, tabs, buttons, keyboard shortcuts and app start-up.
   Loaded as a classic script (see index.html for the order). */

function ck(f) {
  return f ? '<small class="ck">\u2713</small>' : "<small></small>";
}
function pb(k, l) {
  return '<button data-p="' + k + '" class="' + (k === pk ? "on" : "") + '"><span>' + l + "</span>" + ck(store.pd[k]) + "</button>";
}
function side() {
  var h = "", s = $("#side");
  if (tab === "course") {
    var cn = 0, chn = 0;
    CH.forEach(function(c, ci) {
      var ids = ORD.filter(function(i) {
        return LESS[i].ch === ci;
      }), nd = ids.filter(function(i) {
        return store.done[i];
      }).length;
      if (!ids.length) return;
      chn++;
      h += "<p><b>Chapter " + chn + ": " + c + "</b> " + (nd === ids.length ? '<span class="ck">\u2713</span>' : "(" + nd + "/" + ids.length + ")") + "</p>";
      ids.forEach(function(i) {
        cn++;
        h += '<button data-l="' + i + '" class="' + (i === li ? "on" : "") + '"><span>' + cn + ". " + LESS[i].n + "</span>" + ck(store.done[i]) + "</button>";
      });
    });
  } else if (tab === "ladder") {
    h = "<p>Clear each level with 95%+ accuracy at its target speed. A dashed ghost caret runs at that speed; keep up with it. 21 levels, 20 to 100 WPM.</p>";
    for (var g = 0; g < 21; g++) h += '<button data-g="' + g + '" class="' + (g === gi ? "on" : "") + '"><span>L' + (g + 1) + " | " + (20 + 4 * g) + " WPM</span>" + ck(store.ld[g]) + "</button>";
  } else if (tab === "practice") {
    h += "<p><b>Drills</b></p>";
    [["weak", "Weak keys drill"], ["pairs", "Slow pairs drill"], ["words", "Common words"], ["sent", "Sentences"], ["num", "Numbers"], ["sym", "Symbols"], ["code", "Code (MERN)"], ["custom", "Your own text"]].forEach(function(x) {
      h += pb(x[0], x[1]);
    });
    h += "<p><b>Full keyboard paragraphs</b></p>";
    PARA.forEach(function(x, i) {
      h += pb("para" + i, "P" + (i + 1) + ": " + PT[i]);
    });
    h += "<p><b>Hinglish paragraphs</b></p>";
    PARAH.forEach(function(x, i) {
      h += pb("parah" + i, "H" + (i + 1) + ": " + PHT[i]);
    });
    h += "<p><b>More English paragraphs</b></p>";
    PARAE.forEach(function(x, i) {
      h += pb("parae" + i, "E" + (i + 1) + ": " + PET[i]);
    });
    h += "<p><b>Coder practice</b></p>";
    CB.forEach(function(x) {
      h += pb("b:" + x[0], x[1]);
    });
    h += "<p><b>Chapter review</b></p>";
    CH.forEach(function(c, ci) {
      if (ci === 6) return;
      h += pb("ch" + ci, (ci < 6 ? ci + 1 : ci) + ". " + c);
    });
  } else if (tab === "test") {
    h = '<div class="pill">' + [[30, "30s"], [60, "1 min"], [180, "3 min"], [300, "5 min"], [0, "Paragraph"]].map(function(d) {
      return '<button data-d="' + d[0] + '" class="' + (d[0] === td ? "on" : "") + '">' + d[1] + (store.pd["t" + d[0]] ? " \u2713" : "") + "</button>";
    }).join("") + '</div><div class="pill"><button data-x="1" class="' + (punct ? "on" : "") + '">Punctuation</button></div><p>Certificate appears after a timed test with 90% accuracy or better. A check mark appears on each test you finish at 90%+.</p>';
  } else if (tab === "sym") {
    var mc = Object.keys(store.sm).length;
    h = '<p>Special characters ko yaad karne ka drill. Ek symbol 3 baar lagataar bina galti ke sahi dabaya toh mastered \u2713.</p><div class="pill"><button data-m="name" class="' + (Sy.mode === "name" ? "on" : "") + '">Name to key</button><button data-m="sym" class="' + (Sy.mode === "sym" ? "on" : "") + '">Symbol to key</button></div><div class="pill"><button data-m="weak" class="' + (Sy.weakOnly ? "on" : "") + '">Weak ones only</button></div><p>' + (mc === SY.length ? '<span class="ck">\u2713 All mastered</span>' : mc + "/" + SY.length + " mastered") + "</p>";
  } else if (tab === "game") h = "<p>Clear falling words. Five lives. Speed rises every level.</p><p>" + (store.pd.g ? '<span class="ck">\u2713 Completed</span>' : "Score 50 to complete.") + " Best: " + (store.best.g || 0) + "</p>";
  s.innerHTML = h;
}
function show() {
  ["sT", "sG", "sP", "sS", "sD"].forEach(function(i) {
    $("#" + i).className = "sec";
  });
  var s = tab === "game" ? "sG" : tab === "prog" ? "sP" : tab === "sym" ? "sS" : tab === "today" ? "sD" : "sT";
  $("#" + s).className = "sec show";
  $("#grid").className = "grid" + (tab === "prog" || tab === "today" ? " one" : "");
  $("#cust").style.display = tab === "practice" && pk === "custom" ? "block" : "none";
  if (tab === "ladder" && !gset) {
    gset = 1;
    var q2 = 0;
    while (q2 < 20 && store.ld[q2]) q2++;
    gi = q2;
  }
  side();
  if (tab === "prog") progress();
  else if (tab === "today") todayRender();
  else if (tab !== "game") restart();
  if (tab !== "game") G.run = 0;
}
$("#tabs").onclick = function(e) {
  var b = e.target.closest("button");
  if (!b) return;
  tab = b.dataset.t;
  Array.prototype.forEach.call(this.children, function(x) {
    x.className = x === b ? "on" : "";
  });
  show();
};
$("#side").onclick = function(e) {
  var b = e.target.closest("button");
  if (!b) return;
  var d = b.dataset;
  if (d.l !== void 0) li = +d.l;
  if (d.g !== void 0) gi = +d.g;
  if (d.m) {
    if (d.m === "weak") Sy.weakOnly = !Sy.weakOnly;
    else Sy.mode = d.m;
  }
  if (d.p) pk = d.p;
  if (d.d !== void 0) td = +d.d;
  if (d.x) punct = !punct;
  $("#cust").style.display = tab === "practice" && pk === "custom" ? "block" : "none";
  side();
  restart();
};
$("#cg").onclick = restart;
$("#gst").onclick = gStart;
$("#box").onclick = function() {
  this.focus();
};
document.addEventListener("keydown", function(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  var t = e.target.tagName;
  if (t === "INPUT" || t === "TEXTAREA") return;
  var det = e.key === "@" && e.code === "Quote" || e.key === '"' && e.code === "Digit2" ? "uk" : e.key === "@" && e.code === "Digit2" || e.key === '"' && e.code === "Quote" ? "us" : null;
  if (det && det !== LAYOUT && !store.o.lm) {
    store.o.l = det;
    setLayout(det);
    opt();
    layNote(det);
  }
  if (tab === "game") {
    if (e.key.length === 1 || e.key === "Backspace" || e.key === "Escape") {
      e.preventDefault();
      gKey(e);
    }
    return;
  }
  if (tab === "prog" || tab === "today") return;
  if (tab === "sym") {
    symKey(e);
    return;
  }
  var pe = keyEl(e.key.length > 1 ? e.key : e.key === " " ? " " : e.key.toLowerCase());
  if (pe) {
    pe.classList.add("pr");
    setTimeout(function() {
      pe.classList.remove("pr");
    }, 90);
  }
  typeKey(e);
});
function opt() {
  $("#oS").className = "ic" + (store.o.s ? " on" : "");
  $("#oK").className = "ic" + (store.o.k ? " on" : "");
  $("#oP").className = "ic" + (store.o.p ? " on" : "");
  $("#oB").className = "ic" + (store.o.b ? " on" : "");
  $("#oH").className = "ic" + (store.o.h ? " on" : "");
  document.body.classList.toggle("blind", !!store.o.h);
  $("#oL").textContent = "Layout: " + LAYOUT.toUpperCase();
  save();
}
$("#oS").onclick = function() {
  store.o.s = !store.o.s;
  opt();
};
$("#oK").onclick = function() {
  store.o.k = !store.o.k;
  opt();
};
$("#oB").onclick = function() {
  store.o.b = !store.o.b;
  opt();
};
$("#oH").onclick = function() {
  store.o.h = !store.o.h;
  opt();
};
$("#oL").onclick = function() {
  store.o.lm = 1;
  store.o.l = LAYOUT === "us" ? "uk" : "us";
  setLayout(store.o.l);
  opt();
};
$("#oP").onclick = function() {
  store.o.p = !store.o.p;
  opt();
  restart();
};
$("#th").onclick = function() {
  var r = document.documentElement, d = r.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
  r.setAttribute("data-theme", d === "dark" ? "light" : "dark");
};
buildLayout(store.o.l || "us");
$("#kb").innerHTML = kbHtml();
$("#np").innerHTML = npHtml();
$("#kb2").innerHTML = kbHtml();
$("#shint").onclick = function() {
  Sy.wrong = 2;
  symRender();
};
$("#snew").onclick = symStart;
opt();
show();
