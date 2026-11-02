// The 50 US states: postal code, capital and US Census Bureau region.
// Written by hand and checked by tests/geo.test.js against the map's own
// state names (us-atlas, from the Census Bureau's cartographic boundaries).
// Regions follow the Census Bureau's four statistical regions.

export const REGIONS = {
  northeast: { name: "Northeast", slug: "northeast" },
  midwest: { name: "Midwest", slug: "midwest" },
  south: { name: "South", slug: "south" },
  west: { name: "West", slug: "west" },
};

// [name, postal code, capital, region]
const ROWS = [
  ["Alabama", "AL", "Montgomery", "south"],
  ["Alaska", "AK", "Juneau", "west"],
  ["Arizona", "AZ", "Phoenix", "west"],
  ["Arkansas", "AR", "Little Rock", "south"],
  ["California", "CA", "Sacramento", "west"],
  ["Colorado", "CO", "Denver", "west"],
  ["Connecticut", "CT", "Hartford", "northeast"],
  ["Delaware", "DE", "Dover", "south"],
  ["Florida", "FL", "Tallahassee", "south"],
  ["Georgia", "GA", "Atlanta", "south"],
  ["Hawaii", "HI", "Honolulu", "west"],
  ["Idaho", "ID", "Boise", "west"],
  ["Illinois", "IL", "Springfield", "midwest"],
  ["Indiana", "IN", "Indianapolis", "midwest"],
  ["Iowa", "IA", "Des Moines", "midwest"],
  ["Kansas", "KS", "Topeka", "midwest"],
  ["Kentucky", "KY", "Frankfort", "south"],
  ["Louisiana", "LA", "Baton Rouge", "south"],
  ["Maine", "ME", "Augusta", "northeast"],
  ["Maryland", "MD", "Annapolis", "south"],
  ["Massachusetts", "MA", "Boston", "northeast"],
  ["Michigan", "MI", "Lansing", "midwest"],
  ["Minnesota", "MN", "Saint Paul", "midwest"],
  ["Mississippi", "MS", "Jackson", "south"],
  ["Missouri", "MO", "Jefferson City", "midwest"],
  ["Montana", "MT", "Helena", "west"],
  ["Nebraska", "NE", "Lincoln", "midwest"],
  ["Nevada", "NV", "Carson City", "west"],
  ["New Hampshire", "NH", "Concord", "northeast"],
  ["New Jersey", "NJ", "Trenton", "northeast"],
  ["New Mexico", "NM", "Santa Fe", "west"],
  ["New York", "NY", "Albany", "northeast"],
  ["North Carolina", "NC", "Raleigh", "south"],
  ["North Dakota", "ND", "Bismarck", "midwest"],
  ["Ohio", "OH", "Columbus", "midwest"],
  ["Oklahoma", "OK", "Oklahoma City", "south"],
  ["Oregon", "OR", "Salem", "west"],
  ["Pennsylvania", "PA", "Harrisburg", "northeast"],
  ["Rhode Island", "RI", "Providence", "northeast"],
  ["South Carolina", "SC", "Columbia", "south"],
  ["South Dakota", "SD", "Pierre", "midwest"],
  ["Tennessee", "TN", "Nashville", "south"],
  ["Texas", "TX", "Austin", "south"],
  ["Utah", "UT", "Salt Lake City", "west"],
  ["Vermont", "VT", "Montpelier", "northeast"],
  ["Virginia", "VA", "Richmond", "south"],
  ["Washington", "WA", "Olympia", "west"],
  ["West Virginia", "WV", "Charleston", "south"],
  ["Wisconsin", "WI", "Madison", "midwest"],
  ["Wyoming", "WY", "Cheyenne", "west"],
];

export const STATES = ROWS.map(([name, abbr, capital, region]) => ({ name, abbr, capital, region }));
export const STATE_BY_NAME = Object.fromEntries(STATES.map((s) => [s.name, s]));

// The original thirteen colonies, named by the modern states that grew from them.
export const THIRTEEN_COLONIES = [
  "New Hampshire", "Massachusetts", "Rhode Island", "Connecticut", "New York", "New Jersey",
  "Pennsylvania", "Delaware", "Maryland", "Virginia", "North Carolina", "South Carolina", "Georgia",
];
