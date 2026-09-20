# Ancient World in Modern Threads

A responsive exhibition companion built with React, Vite, JavaScript, CSS, and Three.js. No backend.

## Run the website

Open a terminal in this folder, then run:

```sh
npm install
npm run dev
```

Open the local address printed in the terminal (normally http://localhost:5173).

```sh
npm run check  # verify collection membership, asset files, and model textures
npm run build  # create the publishable dist folder
npm run preview # preview the built version locally
```

The home page leads to a schematic map, six cases, and 31 object pages. The Mary McFadden demo is retained as a separate Fluting alternate. Each case offers comparison between photographed objects; material information is inside each object's Look closer section. Models load only when 360° View is selected.

## Change text, order, and images

- `src/data/editorial.json`: revised interpretive object labels and curator-confirmed corrections. These override the imported fields and survive a workbook reimport.
- `src/data/case-labels.json`: interpretive group labels (maximum 400 words each).
- `src/data/collection.json`: object titles, makers, dates, credits, label text, material, image/model URLs, and pending-content notes. This is the website's factual content file. Preserve question marks and uncertainty. The original workbook remains the source of truth.
- `src/data/cases.json`: case membership and exact display order. The linked Contrapposto top and skirt are one entry. Loan IDs are internal page identifiers, not accession numbers.
- `src/data/site.js`: home introduction, case introductions, and map location descriptions. These are draft editorial copy.
- `src/data/object.js`: the three McFadden hotspots and image detail views. Hotspot positions are percentages of the full source photograph.
- `src/data/exhibition.js`: supplied runway notes, including uncertain model credit.

Put website photographs in `public/images` and models in `public/models`; reference them as `/images/filename.webp` and `/models/filename.glb`. Keep the original high-resolution photos and exported GLBs in the Exhibition source folders. A model needs embedded color textures. Update both `image` and `thumbnail` when replacing a photograph. Set an unavailable asset to `null` rather than linking a missing file. Replacing a model does not require a new page.

The supplied photos have 2400px-high website copies and smaller case thumbnails. Source photography has not been retouched. Textured GLBs are simplified and compressed web copies; original exports are intact. Unused earlier web assets are retained outside `public` in `archive/unused-web-assets`, so they are not included in a build.

## Optional batch import (not needed for ordinary text edits)

`scripts/import-collection.py` reads the Labels worksheet with openpyxl and makes `collection.json`, `cases.json`, and the asset source list. It includes the approved September 20 selection. Re-running it overwrites manual edits to those generated files; review its mappings before importing a new workbook.

`scripts/assets/process.mjs` creates optimized copies. Install its separate tools with `npm install --prefix scripts/assets`, then run `node scripts/assets/process.mjs`. These tools are not website dependencies. `--id=2002.08.016` processes one object. The specific detached metal fragment in that original GLB is removed with a geometry check; a changed export deliberately fails the check and needs inspection.

## Before publishing

See `docs/REVIEW-NOTES.md` for missing assets and label questions. The map is schematic, not a measured navigation plan. A hosting destination has not been selected or deployed; the static `dist` folder is ready for a compatible static host after review. Hash-based routes support direct links without server routing rules.
