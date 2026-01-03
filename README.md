# UK Foraging Calendar (MVP)

A simple static site that generates downloadable iCalendar (`.ics`) files for UK foraging seasons.

- **Stack:** Vite + React (JavaScript)
- **Hosting:** GitHub Pages (static)
- **No backend / no API**
- **Calendar window:** next 12 months from the day you download

## Quick start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Create a GitHub repo named `uk-foraging-calendar` (or change names accordingly).
2. **Update `vite.config.js`**:
   - `base: '/YOUR_REPO_NAME/'`
3. Push to GitHub.
4. GitHub Actions will build and deploy to Pages.

## Data

Edit the dataset in:

`src/data/plants.json`

Each entry uses an evergreen season range:

```json
"season": { "start": "06-01", "end": "07-15" }
```

At download time, the app converts these into real dates that overlap the next 12 months.

## Disclaimer

Foraging seasons vary by region and weather. This project is not an identification guide. Only forage where legal, harvest sustainably, and only eat wild foods if you are 100% confident of identification.

## Event density

To be expanded to allow the user to select a single day reminder for the start of a season or a block of dates
