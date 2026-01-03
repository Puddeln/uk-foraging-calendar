import React from "react";
import plantsData from "./data/plants.json";
import { veventMaker } from "./lib/utils.js";

export default function App() {
  // filer plants according to selection(s)

  const filteredPlants = plantsData.filter((plant) =>
    plant.tags.includes("leaves")
  );
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
      <div className="card">
        <p>Shows the filtered plants</p>
        <pre>{JSON.stringify(filteredPlants, null, 2)}</pre>
      </div>

      <div className="card">
        <p>Shows the new Vevent file</p>
        <pre>${testCalendar}</pre>
      </div>

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
        Download your custom calendar
      </button>
    </>
  );
}
