/* TypeForge - progress.js
   Progress tab: stats, WPM chart, mistake map, backup and slow key pairs.
   Loaded as a classic script (see index.html for the order). */

function progress() {
  var h = store.hist, n = h.length, best = Math.max.apply(null, [0].concat(h.map(function(x) {
    return x.w;
  }))), last = h.slice(-10), avg = last.length ? Math.round(last.reduce(function(a, x) {
    return a + x.w;
  }, 0) / last.length) : 0, aa = last.length ? Math.round(last.reduce(function(a, x) {
    return a + x.a;
  }, 0) / last.length) : 0, dn = ORD.filter(function(i) {
    return store.done[i];
  }).length;
  var pts = "", mx = Math.max(20, best);
  h.slice(-30).forEach(function(x, i, a) {
    pts += (a.length > 1 ? i * 580 / (a.length - 1) : 290) + 10 + "," + (150 - x.w / mx * 135) + " ";
  });
  var html = '<div class="pg"><div><b>' + lvl(avg) + "</b><span>Level (last 10 avg)</span></div><div><b>" + best + "</b><span>Best WPM</span></div><div><b>" + avg + "</b><span>Average WPM</span></div><div><b>" + aa + "%</b><span>Average accuracy</span></div><div><b>" + dn + "/" + ORD.length + "</b><span>Lessons passed</span></div><div><b>" + n + "</b><span>Sessions</span></div><div><b>" + Object.keys(store.ld).length + "/21</b><span>Ladder levels</span></div><div><b>" + Object.keys(store.sm).length + "/32</b><span>Symbols mastered</span></div><div><b>" + streak() + "</b><span>Day streak</span></div><div><b>" + (store.best.g || 0) + "</b><span>Game best</span></div></div><h3>Speed over your last 30 sessions</h3>" + (n ? '<svg viewBox="0 0 600 160" width="100%" role="img" aria-label="WPM chart"><line x1="10" y1="150" x2="590" y2="150" stroke="var(--ln)"/><polyline fill="none" stroke="var(--ac)" stroke-width="2.5" points="' + pts + '"/><text x="12" y="14" fill="var(--mu)" font-size="11">' + mx + " WPM</text></svg>" : '<p class="hint">Finish a lesson or test to see your chart.</p>') + pairsHtml() + '<h3>Mistake map (redder means more errors)</h3><div class="kb" id="hm">' + kbHtml() + '</div><h3>Certificate name</h3><input class="in" id="nm" maxlength="30" value="' + store.name.replace(/"/g, "") + '"><p><button class="ic" id="rs">Reset all progress</button></p><h3>Backup (progress sirf is browser mein save hota hai)</h3><textarea class="in" id="bk" rows="3" placeholder="Export dabao, text copy karke kahin save karo. Restore ke liye yahan paste karke Import dabao."></textarea><p><button class="ic" id="bkx">Export</button> <button class="ic" id="bki">Import</button></p>';
  $("#sP").innerHTML = html;
  Array.prototype.forEach.call($("#hm").querySelectorAll(".k"), function(e) {
    var c = e.getAttribute("data-k"), r = store.k[c];
    e.classList.remove("f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8");
    if (r && r[0] >= 3) {
      var p = Math.round(Math.min(1, r[1] / r[0] * 4) * 100);
      e.style.background = "color-mix(in srgb, var(--bad) " + p + "%, var(--sf))";
    }
  });
  $("#nm").oninput = function() {
    store.name = this.value || "Typist";
    save();
  };
  $("#bkx").onclick = function() {
    $("#bk").value = JSON.stringify(store);
  };
  $("#bki").onclick = function() {
    try {
      var o = JSON.parse($("#bk").value);
      if (o && typeof o === "object" && o.hist) {
        store = o;
        ["done", "best", "k", "pd", "ld", "sy", "sm", "ss", "bg", "dy"].forEach(function(k) {
          store[k] = store[k] || {};
        });
        store.o = store.o || {};
        store.name = store.name || "Typist";
        save();
        progress();
      } else $("#bk").value = "Invalid backup text";
    } catch (e) {
      $("#bk").value = "Invalid backup text";
    }
  };
  $("#rs").onclick = function() {
    if (this.dataset.s) {
      store = { name: store.name, done: {}, best: {}, hist: [], k: {}, o: store.o, pd: {}, ld: {}, sy: {}, sm: {}, ss: {}, bg: {}, dy: {} };
      save();
      progress();
    } else {
      this.dataset.s = 1;
      this.textContent = "Click again to confirm reset";
    }
  };
}
function pairsHtml() {
  var bs = Object.keys(store.bg).filter(function(b) {
    return store.bg[b][0] >= 3;
  }).sort(function(a, b) {
    return store.bg[b][1] - store.bg[a][1];
  }).slice(0, 10);
  if (!bs.length) return '<h3>Slowest key pairs</h3><p class="hint">Thodi aur typing karo, phir yahan tumhari slow pairs dikhengi.</p>';
  return '<h3>Slowest key pairs (ms between keys)</h3><div class="sg">' + bs.map(function(b) {
    return '<div class="sc"><b>' + esc(b) + "</b><span>" + Math.round(store.bg[b][1]) + " ms</span></div>";
  }).join("") + '</div><p class="hint">Practice mein Slow pairs drill inhi pe kaam karta hai.</p>';
}
