/* TypeForge - state.js
   Saved progress (localStorage) and the app state variables.
   Loaded as a classic script (see index.html for the order). */

var store = { name: "Typist", done: {}, best: {}, hist: [], k: {}, o: { s: 0, k: 0 } };
try {
  var sv = JSON.parse(localStorage.getItem("typeforge2"));
  if (sv) for (var q in sv) store[q] = sv[q];
} catch (e) {
}
function save() {
  try {
    localStorage.setItem("typeforge2", JSON.stringify(store));
  } catch (e) {
  }
}
store.pd = store.pd || {};
store.ld = store.ld || {};
store.bg = store.bg || {};
store.dy = store.dy || {};
var gi = 0, gset = 0, tab = "today", li = 0, pk = "weak", td = 30, punct = false, C = null, text = "", pos = 0, typed = [], start = 0, tot = 0, miss = {}, timer = null, done = false;
store.sy = store.sy || {};
store.sm = store.sm || {};
store.ss = store.ss || {};
