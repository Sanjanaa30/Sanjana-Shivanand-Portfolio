# Portfolio — Sanjana Shivanand

A personal portfolio built with React and Vite. Black background, greyscale type,
one blue accent, and a WebGL layer of wireframe data objects drifting behind the
page.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints. `npm run build` writes a production bundle to
`dist/`, and `npm run preview` serves that build locally.

## How the files fit together

| File | What it does |
| --- | --- |
| `src/App.jsx` | All page content — experience, projects, skills, links — plus the markup |
| `src/DataFlow.jsx` | The five-stage pipeline diagram in the Systems section |
| `src/Backdrop.jsx` | Decides whether the 3D layer should run, then lazy-loads it |
| `src/DataFieldCanvas.jsx` | The three.js canvas, camera, fog and bloom |
| `src/DataObjects.jsx` | Builds the wireframe data objects and animates them toward the camera |
| `src/useInteractive3D.js` | Smooth scrolling, cursor glow on cards, magnetic buttons |
| `src/useScrollMotion.js` | Fade-up reveals as sections enter view |
| `src/usePortfolioInteractions.js` | Tracks the active section and the reading progress bar |
| `src/styles.css` | Original layout: grids, spacing, breakpoints |
| `src/theme.css` | Colour, type and the current look. Loads second, so it wins |

## Editing content

Everything readable lives in `src/App.jsx` as plain arrays near the top —
`experiences`, `projects`, `skillGroups`, `stats` and so on. Change those and
the page follows.

The resume PDF and profile photo sit in the project root and are imported
directly, so Vite fingerprints them into the build.

## A note on the two stylesheets

`styles.css` came first and carries the layout. `theme.css` came later and
restyles everything for the current dark look. Because it loads second, its
rules win wherever the two agree on specificity — which is why a lot of its
selectors are written one level deeper than you might expect. Change colour and
type in `theme.css`; change layout and spacing in `styles.css`.

## The 3D layer

It only runs on wider screens with a mouse, and never when the visitor has asked
for reduced motion. It lazy-loads as a separate chunk, so the page itself stays
small. Objects fade out both in the distance (fog) and as they approach the
camera, which keeps them from cutting across the headings.
