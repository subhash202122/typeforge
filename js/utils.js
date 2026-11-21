/* TypeForge - utils.js
   Small helpers: $ selector, random pick, escaping, WPM level names, key sounds.
   Loaded as a classic script (see index.html for the order). */

var $ = function(s) {
  return document.querySelector(s);
}, rnd = function(a) {
  return a[Math.floor(Math.random() * a.length)];
};
function lvl(w) {
  return w >= 70 ? "Pro" : w >= 50 ? "Fast" : w >= 35 ? "Fluent" : w >= 20 ? "Average" : "Slow";
}
function cap(w) {
  return w.charAt(0).toUpperCase() + w.slice(1);
}
function pick(a, n) {
  var o = [];
  for (var i = 0; i < n; i++) o.push(rnd(a));
  return o.join(" ");
}
var AC;
function beep(f) {
  if (!store.o.s) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    var o = AC.createOscillator(), g = AC.createGain();
    o.frequency.value = f;
    g.gain.value = 0.03;
    o.connect(g);
    g.connect(AC.destination);
    o.start();
    o.stop(AC.currentTime + 0.04);
  } catch (e) {
  }
}
function esc(c) {
  return c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c;
}
