// Check a calendar feed before there is any UI to look at:
//
//   node --experimental-strip-types scripts/check-ics.mjs <url-or-file> [days]
//
// Accepts a Google "Secret address in iCal format" URL, a Proton "Share with
// anyone" full-view link, or a local .ics file. Exercises the parser, not the
// extension's fetch path -- there are no host permissions out here, so a URL
// that works in Node can still be blocked in the browser if the manifest is
// missing the host.
import { readFile } from "node:fs/promises";
import { parseIcs } from "../src/services/icsParser.ts";

const [target, rawDays] = process.argv.slice(2);
if (!target) {
    console.error("usage: node --experimental-strip-types scripts/check-ics.mjs <url-or-file> [days]");
    process.exit(2);
}
const days = Number(rawDays || 14);

const isUrl = /^https?:\/\//.test(target);
const ics = isUrl
    ? await fetch(target, { cache: "no-store" }).then((resp) => {
          if (!resp.ok) {
              console.error(`fetch failed: ${resp.status} ${resp.statusText}`);
              process.exit(1);
          }
          return resp.text();
      })
    : await readFile(target, "utf8");

console.log(`${ics.length} bytes, ${ics.split("BEGIN:VEVENT").length - 1} VEVENT blocks`);

const now = new Date();
const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const to = new Date(from);
to.setDate(to.getDate() + days);

const started = Date.now();
const events = parseIcs(ics, { from, to }, { feedId: "check", source: isUrl && target.includes("proton") ? "proton" : "google" });
console.log(`${events.length} events in the next ${days} days (parsed in ${Date.now() - started}ms)\n`);

// All-day events are local midnight, so any UTC-based formatting (toISOString,
// getUTCDate) reports the wrong day west of Greenwich. Use local parts only.
const localDay = (date) => date.toLocaleDateString("sv-SE");

for (const event of events) {
    const when = event.allDay
        ? `${localDay(event.start)} (all day)`
        : `${event.start.toLocaleString()} -> ${event.end.toLocaleTimeString()}`;
    console.log(`  ${when.padEnd(34)} ${event.title}${event.location ? `  @ ${event.location}` : ""}`);
}
