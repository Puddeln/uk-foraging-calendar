import React, { useState } from "react";
import plantsData from "./data/plants.json";
import { createTagSet, veventMaker } from "./lib/utils.js";

export default function App() {
  // create set of all tags

  const tagSet = createTagSet(plantsData);

  // create state to track which tags and options are selected

  const [selectedTags, setSelectedTags] = useState(new Set(["leaves"]));
  const [beginnerOnly, setBeginnerOnly] = useState(false);

  const toggleTag = (tag) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  // filer plants according to selection(s)

  const filteredPlants = plantsData.filter((plant) => {
    if (beginnerOnly && !plant.beginner) return false;

    if (selectedTags.size === 0) return true;
    const tags = plant.tags || [];
    return [...selectedTags].some((t) => tags.includes(t));
  });

  // compose ics file according to filters

  const year = 2025;

  let testCalendar = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//UK Foraging Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

  for (const plant of filteredPlants) {
    testCalendar += "\n" + veventMaker(plant, year) + "\n";
  }

  testCalendar += "\nEND:VCALENDAR";
  const icsForFile = testCalendar.replaceAll("\n", "\r\n");
  // rendering the page

  return (
    <>
      <div className="container">
        <div className="header">
          <div>
            <h1 className="h1">UK Foraging Calendar</h1>
            <p className="subtitle">
              Pick what you’re interested in and download a calendar (.ics)
              covering the <b>next 12 months</b>.
            </p>
            <p className="small">
              Tip: add multiple calendars with different filters (e.g. “Fruit”,
              “Beginner greens”, “Coastal”).
            </p>
          </div>
          <div className="card" style={{ minWidth: 320 }}>
            <p className="section-title">Download</p>
            <div className="row"></div>
            <button
              onClick={() => {
                const blob = new Blob([icsForFile], {
                  type: "text/calendar;charset=utf-8",
                });
                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = "UK-Foraging-Calendar.ics";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url);
              }}
            >
              Download .ics
            </button>
            <p className="small" style={{ marginTop: 10 }}>
              Imports into Google Calendar / Apple Calendar / Outlook. If you
              don’t see events, ensure you’re importing (not subscribing) to a
              file.
            </p>
          </div>
        </div>

        <div className="grid">
          <div className="card">
            <p className="section-title">Filters</p>
            <div className="pills">
              {Array.from(tagSet)
                .sort()
                .map((tag) => (
                  <label className="pill" key={tag}>
                    <input
                      type="checkbox"
                      checked={selectedTags.has(tag)}
                      onChange={() => toggleTag(tag)}
                    />
                    <span>{tag}</span>
                  </label>
                ))}
            </div>

            <div className="row" style={{ marginTop: 12 }}>
              <label className="pill">
                <input
                  type="checkbox"
                  checked={beginnerOnly}
                  onChange={() => setBeginnerOnly((v) => !v)}
                />

                <span>Beginner-friendly only</span>
              </label>

              <label className="pill">
                <input type="checkbox" />
                <span>Include notes & warnings</span>
              </label>
            </div>

            <div className="card" style={{ marginTop: 12 }}>
              <p className="section-title">Event density</p>
              <div className="row">
                <label className="pill">
                  <input type="radio" name="density" value="block" />
                  <span>Season block of dates</span>
                </label>
                <label className="pill">
                  <input type="radio" name="density" />
                  <span>Single date at season start</span>
                </label>
              </div>
            </div>

            <p className="small" style={{ marginTop: 12 }}>
              Safety: this is a seasonal guide, not an ID tool. Only eat wild
              foods if you’re <b>100% sure</b> of identification and legality.
            </p>
          </div>

          <div className="card">
            <p className="section-title">
              Preview ({filteredPlants.length} items)
            </p>
            <table className="table">
              <thead>
                <tr>
                  <th>Plant Name</th>
                  <th>Latin</th>
                  <th>Season Start MM-DD</th>
                </tr>
              </thead>

              <tbody>
                {filteredPlants.slice(0, 11).map((plant) => (
                  <tr key={plant.id}>
                    <td>{plant.name}</td>
                    <td>
                      <em>{plant.latin}</em>
                    </td>
                    <td>{plant.season?.start}</td>
                  </tr>
                ))}

                {filteredPlants.length === 0 && (
                  <tr>
                    <td colSpan={3} className="small">
                      No plants match your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
