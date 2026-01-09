// converts a date in the format MMDD to YYYYMMDD format, inserting the current year
export function mmddDateToYYYYMMDD(MMDD, year) {
  return `${year}${MMDD.replace("-", "")}`;
}

// generates a UID from a given plant ID
export function uidFromPlantId(plantId, year) {
  const uids = `${plantId}-${year}@uk-foraging-calendar`;
  return uids;
}

// attribute the correct year to a given MMDD plant season date
export function yearSetter(MMDD) {
  // get the current date
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();

  const plantMMDD = Number(MMDD.replace("-", ""));
  const todayMMDD = (currentMonth + 1) * 100 + currentDay;

  let correctYear = currentYear;

  if (plantMMDD < todayMMDD) {
    correctYear = currentYear + 1;
  }

  return correctYear;
}

// generates a current date / time stamp
export function dtStampNowUTC() {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mi = String(now.getUTCMinutes()).padStart(2, "0");
  const ss = String(now.getUTCSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}T${hh}${mi}${ss}Z`;
}

// generates vevent for some plant data
export function veventMaker(plant, density = "block") {
  const dtStamp = dtStampNowUTC();

  const startYear = yearSetter(plant.season.start);
  const uid = uidFromPlantId(plant.id, startYear);

  const dtStart = mmddDateToYYYYMMDD(plant.season.start, startYear);

  // set end date depending on density selection
  let dtEndLine = "";

  if (density === "block") {
    const startMMDD = Number(plant.season.start.replace("-", ""));
    const endMMDD = Number(plant.season.end.replace("-", ""));
    const endYear = endMMDD < startMMDD ? startYear + 1 : startYear;

    const dtEnd = mmddDateToYYYYMMDD(plant.season.end, endYear);
    dtEndLine = `DTEND;VALUE=DATE:${dtEnd}`;
  }

  // obtain and compose descriptive parts from plants.json
  const descriptionParts = [];
  if (plant.notes) descriptionParts.push(plant.notes);
  if (plant.latin) descriptionParts.push(`Latin: ${plant.latin}`);
  if (plant.tags?.length)
    descriptionParts.push(`Tags: ${plant.tags.join(", ")}`);
  descriptionParts.push(
    "Disclaimer: Foraging seasons vary by location and weather. Only eat wild foods if you are 100% confident of identification and that foraging is legal where you are."
  );

  const description = descriptionParts.join("\\n\\n");
  return `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtStamp}
DTSTART;VALUE=DATE:${dtStart}
${dtEndLine}
SUMMARY:${plant.name} (foraging window)
DESCRIPTION:${description}
END:VEVENT`;
}

// creates an array of all possible tags from plants.json
export function createTagArray(plants) {
  const tagSet = new Set();

  for (const plant of plants) {
    if (!plant.tags) continue;

    for (const tag of plant.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet).sort();
}
