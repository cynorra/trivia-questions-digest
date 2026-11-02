// The countries the quizzes ask about: the 193 UN member states plus the two
// UN observer states (Vatican City and Palestine). Other territories and
// partially recognized states are drawn on the maps in gray but never asked.
//
// Names, capitals and continents come from the countries-list package (MIT);
// tests/geo.test.js cross-checks every capital against a second dataset
// (world-countries). Overrides below are deliberate and explained.
import { countries as CL } from "countries-list";
import iso from "i18n-iso-countries";

const UN = "AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA CF TD CL CN CO KM CG CD CR CI HR CU CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GR GD GT GN GW GY HT HN HU IS IN ID IR IQ IE IL IT JM JP JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NE NG KP MK NO OM PK PW PA PG PY PE PH PL PT QA KR RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA SS ES LK SD SR SE CH SY TJ TZ TH TL TG TO TT TN TR TM TV UG UA AE GB US UY UZ VU VE VN YE ZM ZW".split(" ");
const OBSERVERS = ["VA", "PS"];
export const UN_MEMBER_COUNT = UN.length;

// Common English names where the dataset uses another form; the other name is kept as `aka`.
const NAMES = {
  CI: ["Côte d'Ivoire", "Ivory Coast"],
  TL: ["Timor-Leste", "East Timor"],
  TR: ["Turkey", "Türkiye"],
  CD: ["DR Congo", "Democratic Republic of the Congo"],
  CG: ["Republic of the Congo", "Congo-Brazzaville"],
  CZ: ["Czechia", "Czech Republic"],
  CV: ["Cabo Verde", "Cape Verde"],
  SZ: ["Eswatini", "Swaziland"],
  MM: ["Myanmar", "Burma"],
  MK: ["North Macedonia", "Macedonia"],
  VA: ["Vatican City", "Holy See"],
  ST: ["São Tomé and Príncipe", "Sao Tome and Principe"],
};

// Continent used for grouping on this site. The dataset places Russia in Asia;
// map quizzes of Europe conventionally include it, so it is grouped with Europe.
// Timor-Leste is grouped with Southeast Asia rather than Oceania.
const CONTINENT = { RU: "EU", TL: "AS" };

// The official capital where the dataset gives a different city.
const CAPITAL = { LK: "Sri Jayawardenepura Kotte", SZ: "Mbabane" };

// Notes shown with the answer. Countries in NO_CAPITAL_QUESTION are left out of
// capital quizzes because a single answer would be misleading.
export const CAPITAL_NOTES = {
  BO: "Sucre is the constitutional capital; the government sits in La Paz.",
  ZA: "South Africa has three capitals: Pretoria (executive), Cape Town (legislative) and Bloemfontein (judicial).",
  LK: "Sri Jayawardenepura Kotte is the official capital; Colombo is the largest city and commercial capital.",
  SZ: "Mbabane is the administrative capital; Lobamba is the royal and legislative capital.",
  IL: "The status of Jerusalem is disputed internationally, so Israel is not included in the capital quiz.",
  PS: "The status of Jerusalem is disputed internationally, so Palestine is not included in the capital quiz.",
  NR: "Nauru has no official capital; government offices are in Yaren District.",
  NL: "Amsterdam is the constitutional capital; the government and parliament sit in The Hague.",
  CI: "Yamoussoukro is the official capital; Abidjan is the largest city and economic center.",
  MY: "Kuala Lumpur is the capital; many federal government offices moved to Putrajaya.",
  BJ: "Porto-Novo is the official capital; Cotonou is the seat of government and largest city.",
  TZ: "Dodoma is the official capital; Dar es Salaam is the largest city.",
  NG: "Abuja replaced Lagos as Nigeria's capital in 1991.",
  MM: "Naypyidaw replaced Yangon as Myanmar's capital in the mid-2000s.",
  KZ: "Astana was named Nur-Sultan from 2019 to 2022.",
  BI: "Gitega became the political capital in 2019; Bujumbura is the largest city.",
  CH: "Bern is the federal city; Swiss law does not name a capital.",
  AU: "Canberra, not Sydney, is the capital.",
  CA: "Ottawa, not Toronto, is the capital.",
  BR: "Brasília replaced Rio de Janeiro as capital in 1960.",
  TR: "Ankara, not Istanbul, is the capital.",
};
const NO_CAPITAL_QUESTION = new Set(["BO", "ZA", "LK", "SZ", "IL", "PS", "NR"]);

export const CONTINENTS = {
  AF: { name: "Africa", slug: "africa" },
  AS: { name: "Asia", slug: "asia" },
  EU: { name: "Europe", slug: "europe" },
  NA: { name: "North America", slug: "north-america" },
  SA: { name: "South America", slug: "south-america" },
  OC: { name: "Oceania", slug: "oceania" },
};

export const COUNTRIES = [...UN, ...OBSERVERS]
  .map((a2) => {
    const c = CL[a2];
    const [name, aka] = NAMES[a2] ?? [c.name, undefined];
    return {
      id: a2.toLowerCase(),
      a2,
      num: iso.alpha2ToNumeric(a2),
      name,
      aka,
      capital: CAPITAL[a2] ?? c.capital,
      continent: CONTINENT[a2] ?? c.continent,
      askCapital: !NO_CAPITAL_QUESTION.has(a2),
      capitalNote: CAPITAL_NOTES[a2],
      observer: OBSERVERS.includes(a2),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export const COUNTRY_BY_NUM = Object.fromEntries(COUNTRIES.map((c) => [c.num, c]));
export const byContinent = (code) => COUNTRIES.filter((c) => c.continent === code);
