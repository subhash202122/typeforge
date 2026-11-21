# TypeForge

Free typing tutor that runs fully in the browser (no server, no build step).

- **Today**: daily 5-task plan with streak
- **Course**: 41 lessons in 7 chapters, auto check marks
- **Speed ladder**: 21 levels, 20 to 100 WPM, with a ghost caret
- **Special keys**: trainer for all 32 symbols (US and UK layouts)
- **Practice**: weak keys, slow pairs, coder banks (JS, React, Node, SQL, HTML, CSS, Git...), 15 full-keyboard paragraphs (English and Hinglish), your own code
- **Speed test, Game, Progress** (chart, mistake map, backup)

## Run locally

Just open `index.html` in a browser. (Or: `python3 -m http.server` and open http://localhost:8000)

## Deploy on GitHub Pages

1. Create a new **public** repository on GitHub (for example `typeforge`).
2. Upload everything from this folder so that `index.html` is in the repository root
   (GitHub > Add file > Upload files, drag all files and folders, Commit).
3. Repository **Settings > Pages > Build and deployment**: Source = *Deploy from a branch*,
   Branch = `main`, folder = `/ (root)`, Save.
4. After a minute your site is live at `https://<your-username>.github.io/typeforge/`.

Other free options: drag the folder into Netlify Drop, or import the repo in Vercel / Cloudflare Pages.

## Project structure

```
index.html          page markup
css/style.css       all styles (light and dark theme)
js/utils.js         helpers, key sounds
js/data.js          lessons, word list, coder snippet banks, symbols
js/paragraphs.js    full-keyboard paragraphs
js/state.js         saved progress (localStorage) and app state
js/layout.js        US/UK layouts, finger map, on-screen keyboard
js/lessons.js       text generators (lessons, drills, tests, ladder)
js/engine.js        typing engine, stats, results
js/symbols.js       special keys trainer
js/game.js          falling words game
js/progress.js      Progress tab
js/today.js         daily plan and streak
js/ui.js            sidebar, tabs, buttons, start-up
```

The scripts are plain classic scripts, loaded in the order shown in `index.html`
(each file only uses things defined in the files above it).

## Notes

- Progress is saved in the browser (`localStorage`) per website address. If you move the site to a new
  address, use **Progress > Backup > Export** first and **Import** on the new one.
- Fonts (Manrope, JetBrains Mono) load from Google Fonts; without internet the app falls back to system fonts.
