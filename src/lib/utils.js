// converts a date in the format MMDD to YYYYMMDD format, inserting the current year
export function mmddDateToYYYYMMDD(MMDD) {
  const currentYear = new Date().getFullYear();
  const formattedDate = `${currentYear}${MMDD.replace("-", "")}`;
  return formattedDate;
}

// generates a UID from a given plant ID
export function uidFromPlantId(plantId, year) {
  const uids = `${plantId}-${year}@uk-foraging-calendar`;
  return uids;
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
export function veventMaker(plant, year) {
  const uid = uidFromPlantId(plant.id, year);
  const dtStamp = dtStampNowUTC();
  const dtStart = mmddDateToYYYYMMDD(plant.season.start);
  const dtEnd = mmddDateToYYYYMMDD(plant.season.end);

  const descriptionParts = [];
  if (plant.notes) descriptionParts.push(plant.notes);
  if (plant.latin) descriptionParts.push(`Latin: ${plant.latin}`);
  if (plant.tags?.length)
    descriptionParts.push(`Tags: ${plant.tags.join(", ")}`);
  descriptionParts.push(
    "Disclaimer: Foraging seasons vary by location and weather. Only eat wild foods if you are 100% confident of identification and that foraging is legal where you are."
  );

  const description = descriptionParts.join("\\n\\n");
  const vevent = `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtStamp}
DTSTART;VALUE=DATE:${dtStart}
DTEND;VALUE=DATE:${dtEnd}
SUMMARY:${plant.name} (foraging window)
DESCRIPTION:${description}
END:VEVENT`;
  return vevent;
}

// creates a set of all possible tags from plants.json
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
