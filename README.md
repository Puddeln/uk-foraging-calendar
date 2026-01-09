# UK Foraging Calendar (MVP)

A simple static site that generates downloadable iCalendar (`.ics`) files for UK foraging seasons.

- **Stack:** Vite + React (JavaScript)
- **Hosting:** GitHub Pages (static)
- **No backend / no API**
- **Calendar window:** upcoming seasonal windows generated relative to the day you download

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

At download time, the app converts these into real calendar dates based on the current date, ensuring each plant’s next seasonal window appears in the generated calendar.

## Event density

Users can choose how seasonal windows are represented:

- **Season block** a multi-day all-day event covering the full foraging window

- **Single date** a single all-day event at the start of the season

This keeps calendars either tidy or highly visible, depending on preference.

## Planned improvements

- **Rolling 12-month window filtering**

Future versions will optionally restrict events to those overlapping a strict today → today + 12 months range, and may trim long seasonal blocks accordingly.

## Disclaimer

Foraging seasons vary by region and weather. This project is not an identification guide. Only forage where legal, harvest sustainably, and only eat wild foods if you are 100% confident of identification.
