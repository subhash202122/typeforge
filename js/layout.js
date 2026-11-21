/* TypeForge - layout.js
   Keyboard layouts (US / UK), finger map and on-screen keyboard drawing.
   Loaded as a classic script (see index.html for the order). */

var ROWS = ["`1234567890-=", "qwertyuiop[]\\", "asdfghjkl;'", "zxcvbnm,./"], SH = '~!@#$%^&*()_+{}|:"<>?', BS = "`1234567890-=[]\\;',./";
var FN = ["left pinky", "left ring", "left middle", "left index", "right index", "right middle", "right ring", "right pinky", "thumb"], F = { " ": 8 };
var LAYOUT = "us";
function buildLayout(l) {
  LAYOUT = l;
  var fm = [[0, 0, 1, 2, 3, 3, 4, 4, 5, 6, 7, 7, 7], [0, 1, 2, 3, 3, 4, 4, 5, 6, 7, 7, 7, 7], [0, 1, 2, 3, 3, 4, 4, 5, 6, 7, 7], [0, 1, 2, 3, 3, 4, 4, 5, 6, 7]];
  if (l === "uk") {
    ROWS = ["`1234567890-=", "qwertyuiop[]", "asdfghjkl;'#", "\\zxcvbnm,./"];
    var pr = [["!", "1"], ['"', "2"], ["$", "4"], ["%", "5"], ["^", "6"], ["&", "7"], ["*", "8"], ["(", "9"], [")", "0"], ["_", "-"], ["+", "="], ["{", "["], ["}", "]"], [":", ";"], ["@", "'"], ["~", "#"], ["<", ","], [">", "."], ["?", "/"], ["|", "\\"]];
    SH = pr.map(function(x) {
      return x[0];
    }).join("");
    BS = pr.map(function(x) {
      return x[1];
    }).join("");
    fm = [fm[0], [0, 1, 2, 3, 3, 4, 4, 5, 6, 7, 7, 7], [0, 1, 2, 3, 3, 4, 4, 5, 6, 7, 7, 7], [0, 0, 1, 2, 3, 3, 4, 4, 5, 6, 7]];
  } else {
    ROWS = ["`1234567890-=", "qwertyuiop[]\\", "asdfghjkl;'", "zxcvbnm,./"];
    SH = '~!@#$%^&*()_+{}|:"<>?';
    BS = "`1234567890-=[]\\;',./";
  }
  F = { " ": 8 };
  fm.forEach(function(m, r) {
    ROWS[r].split("").forEach(function(c, i) {
      F[c] = m[i];
    });
  });
}
buildLayout("us");
function setLayout(l, q) {
  buildLayout(l);
  $("#kb").innerHTML = kbHtml();
  $("#kb2").innerHTML = kbHtml();
  symChart();
  if (q) return;
  if (tab === "sym") symRender();
  else if (tab === "prog") progress();
  else if (C && ["course", "practice", "test", "ladder"].indexOf(tab) >= 0) paint();
}
function layNote(l) {
  var e = $("#lay");
  e.textContent = "Keyboard layout " + l.toUpperCase() + " detect hua, hints aur key positions usi hisaab se set kar di. Galat ho toh upar Layout button se badal lo.";
  e.style.display = "block";
}
function kbHtml() {
  var h = "";
  ROWS.forEach(function(r, i) {
    h += '<div class="row">';
    if (i === 1) h += '<div class="k sh f0" data-k="Tab">Tab</div>';
    if (i === 2) h += '<div class="k sh f0" data-k="CapsLock">Caps</div>';
    if (i === 3) h += '<div class="k sh f0" data-k="shiftL">Shift</div>';
    r.split("").forEach(function(c) {
      h += '<div class="k f' + F[c] + '" data-k="' + (c === '"' ? "&quot;" : c) + '">' + c + "</div>";
    });
    if (i === 0) h += '<div class="k sh f7" data-k="Backspace">Back</div>';
    if (i === 2) h += '<div class="k sh f7" data-k="Enter">Enter</div>';
    if (i === 3) h += '<div class="k sh f7" data-k="shiftR">Shift</div>';
    h += "</div>";
  });
  return h + '<div class="row"><div class="k sp f8" data-k=" ">space</div></div>';
}
function keyEl(c, root) {
  var a = (root || $("#kb")).querySelectorAll(".k");
  for (var i = 0; i < a.length; i++) if (a[i].getAttribute("data-k") === c) return a[i];
}
var NF = { "7": "right index", "4": "right index", "1": "right index", "8": "right middle", "5": "right middle", "2": "right middle", "9": "right ring", "6": "right ring", "3": "right ring", ".": "right ring", "0": "right thumb", "\n": "right pinky", " ": "thumb" };
function npHtml() {
  var r = [["7", "8", "9"], ["4", "5", "6"], ["1", "2", "3"], ["0", ".", "Enter"]], f = { "7": 4, "4": 4, "1": 4, "8": 5, "5": 5, "2": 5, "9": 6, "6": 6, "3": 6, ".": 6, "0": 8, "Enter": 7 }, h = "";
  r.forEach(function(x) {
    h += '<div class="row">';
    x.forEach(function(c) {
      h += '<div class="k ' + (c === "Enter" ? "sh " : "") + "f" + f[c] + '" data-n="' + c + '">' + c + "</div>";
    });
    h += "</div>";
  });
  return h;
}
function npMark(n) {
  Array.prototype.forEach.call(document.querySelectorAll("#np .nx"), function(e2) {
    e2.classList.remove("nx");
  });
  if (C && C.np) {
    Array.prototype.forEach.call(document.querySelectorAll("#kb .nx"), function(e2) {
      e2.classList.remove("nx");
    });
    if (n !== void 0) {
      var e = $('#np [data-n="' + (n === "\n" ? "Enter" : n) + '"]');
      if (e) e.classList.add("nx");
    }
  }
}
function npHint(n) {
  return n === void 0 ? "" : "Numpad. Next: " + (n === "\n" ? "Enter" : n === " " ? "space" : n) + "  |  " + (NF[n] || "");
}
