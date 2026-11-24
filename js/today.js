/* TypeForge - today.js
   Daily plan, streak and the Today tab.
   Loaded as a classic script (see index.html for the order). */

var TASKS = [["w", "Warm-up: common words", "Practice > Common words, 90%+ accuracy"], ["k", "Weak keys drill", "Practice > Weak keys drill, 90%+"], ["p", "Slow pairs drill", "Practice > Slow pairs drill, 90%+"], ["s", "Special keys round", "Special keys tab, 20 prompts poore karo"], ["l", "Speed ladder run", "Speed ladder, ek run 90%+ accuracy ke saath"]];
function dayKey(o) {
  var d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - (o || 0));
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}
function dayMark(t) {
  var k = dayKey();
  store.dy[k] = store.dy[k] || {};
  store.dy[k][t] = 1;
  save();
}
function dayFull(o) {
  var r = store.dy[dayKey(o)];
  return !!(r && TASKS.every(function(x) {
    return r[x[0]];
  }));
}
function streak() {
  var n = 0, o = dayFull(0) ? 0 : 1;
  while (n < 400 && dayFull(o)) {
    n++;
    o++;
  }
  return n;
}
function todayRender() {
  var r = store.dy[dayKey()] || {}, n = TASKS.filter(function(x) {
    return r[x[0]];
  }).length;
  var heading = n === TASKS.length ? "Aaj ka target poora!" : "Aaj ki practice";
  var h = '<div class="hero"><div class="ringwrap"><svg viewBox="0 0 120 120" class="ring" aria-hidden="true"><circle class="rb" cx="60" cy="60" r="52"></circle><circle class="rf" cx="60" cy="60" r="52" stroke-dasharray="326.7" stroke-dashoffset="' + (326.7 * (1 - n / TASKS.length)).toFixed(1) + '"></circle></svg><div class="rt"><b>' + n + "/" + TASKS.length + '</b><span>done today</span></div></div><div class="hl"><h2>' + heading + '</h2><p>Roz ye 5 kaam (lagbhag 15 min). Sab complete hone pe aaj ka streak badhta hai. Pace caret on rakho toh speed dheere dheere upar jaati hai.</p><div class="chips"><span class="chip warm"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z"></path></svg>' + streak() + ' day streak</span><span class="chip">Best: ' + Math.max.apply(null, [0].concat(store.hist.map(function(x) {
    return x.w;
  }))) + ' WPM</span></div></div></div><div class="tasks">';
  TASKS.forEach(function(x) {
    h += '<div class="tk"><span>' + (r[x[0]] ? '<i class="ck">\u2713</i>' : '<i class="ck todo"></i>') + " <b>" + x[1] + "</b><br><small>" + x[2] + '</small></span><button class="go" data-go="' + x[0] + '">' + (r[x[0]] ? "Again" : "Start") + "</button></div>";
  });
  $("#sD").innerHTML = h + "</div>";
  $("#sD").onclick = function(e) {
    var b = e.target.closest("button");
    if (b && b.dataset.go) goTask(b.dataset.go);
  };
}
function goTask(t) {
  var m = { w: ["practice", "words"], k: ["practice", "weak"], p: ["practice", "pairs"], s: ["sym"], l: ["ladder"] }[t];
  tab = m[0];
  if (m[1]) pk = m[1];
  Array.prototype.forEach.call($("#tabs").children, function(x) {
    x.className = x.dataset.t === tab ? "on" : "";
  });
  $("#tabs .on").scrollIntoView({ block: "nearest", inline: "nearest" });
  show();
}
