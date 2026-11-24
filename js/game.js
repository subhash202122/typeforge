/* TypeForge - game.js
   Falling words game.
   Loaded as a classic script (see index.html for the order). */

var G = { run: 0 };
function gStart() {
  Array.prototype.forEach.call($("#stage").querySelectorAll("span"), function(x) {
    x.remove();
  });
  $("#gst").style.display = "none";
  $("#gres").className = "res";
  G = { run: 1, w: [], lives: 5, score: 0, buf: "", last: performance.now(), sp: 0, lv: 1 };
  gHud();
  requestAnimationFrame(gLoop);
}
function gHud() {
  $("#gs").textContent = G.score;
  $("#gv").textContent = G.lv;
  $("#gl").textContent = G.lives;
  $("#gb").textContent = G.buf || "\xA0";
}
function gLoop(t) {
  if (!G.run) return;
  var dt = Math.min(0.1, (t - G.last) / 1e3);
  G.last = t;
  G.sp -= dt;
  var S = $("#stage"), H = S.clientHeight;
  if (G.sp <= 0) {
    var p = D.filter(function(x) {
      return x.length >= 3;
    }), w = rnd(p), el = document.createElement("span");
    el.textContent = w;
    // Use the same fraction of the stage and the word so it still fits after a resize.
    var x = 4 + Math.random() * 92;
    el.style.left = x + "%";
    el.style.translate = -x + "%";
    S.appendChild(el);
    G.w.push({ w, y: 0, el });
    G.sp = Math.max(0.7, 2.1 - G.lv * 0.12);
  }
  for (var i = G.w.length - 1; i >= 0; i--) {
    var o = G.w[i];
    o.y += (34 + G.lv * 9) * dt;
    o.el.style.transform = "translateY(" + o.y + "px)";
    if (o.y > H - 30) {
      o.el.remove();
      G.w.splice(i, 1);
      G.lives--;
      beep(180);
      gHud();
      if (G.lives <= 0) {
        gEnd();
        return;
      }
    }
  }
  requestAnimationFrame(gLoop);
}
function gEnd() {
  G.run = 0;
  var b = store.best.g || 0, nb = G.score > b;
  if (nb) store.best.g = G.score;
  if (G.score >= 50) store.pd.g = 1;
  save();
  side();
  $("#gres").innerHTML = "<h2>Game over: " + G.score + " points" + (nb && b ? " (new best)" : "") + "</h2><p>Best score: " + store.best.g + ". Reached level " + G.lv + '.</p><button class="go" id="gagain">Play again</button>';
  $("#gres").className = "res show";
  $("#gagain").onclick = gStart;
}
function gKey(e) {
  if (e.key === "Escape") {
    G.run = 0;
    gStart();
    return;
  }
  if (!G.run) return;
  if (e.key === "Backspace") {
    G.buf = G.buf.slice(0, -1);
  } else if (/^[a-z]$/i.test(e.key)) {
    G.buf += e.key.toLowerCase();
    var m = G.w.filter(function(o) {
      return o.w.indexOf(G.buf) === 0;
    });
    if (!m.length) {
      var s = G.w.filter(function(o) {
        return o.w[0] === e.key.toLowerCase();
      });
      G.buf = s.length ? e.key.toLowerCase() : "";
      m = s;
      beep(180);
    } else beep(660);
    var hit = G.w.filter(function(o) {
      return o.w === G.buf;
    })[0];
    if (hit) {
      hit.el.remove();
      G.w.splice(G.w.indexOf(hit), 1);
      G.score += hit.w.length;
      G.buf = "";
      G.lv = 1 + Math.floor(G.score / 50);
    }
  }
  G.w.forEach(function(o) {
    o.el.innerHTML = G.buf && o.w.indexOf(G.buf) === 0 ? "<b>" + G.buf + "</b>" + o.w.slice(G.buf.length) : o.w;
  });
  gHud();
}
