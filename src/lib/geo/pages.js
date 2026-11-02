// Every quiz page: its game, its words and its questions. Each page's text is
// written for that page alone (no shared templates beyond the layout), and
// tests/geo.test.js fails if two pages share a title, a description or an FAQ question.

const us = (key, extra) => ({ section: "us", ...extra, key });
const world = (key, extra) => ({ section: "world", ...extra, key });

export const PAGES = [
  // ------------------------------------------------------------------ US
  us("us-states", {
    slug: "us-states-map-quiz",
    game: { kind: "us-map" },
    title: "US States Map Quiz: Learn the 50 States (Free Map Game)",
    description: "Free 50 states quiz and US map game: click each of the fifty states on a blank map, with a timer, score and the states you missed. Study mode shows every name.",
    h1: "US states map quiz",
    lead: "Click each state as its name comes up. Three wrong clicks and the map shows you where it is, so every round teaches you something.",
    body: `<p>Most people can place California, Texas and Florida without thinking. The states that cost points are the ones that sit in clusters: the six small New England states, the square-ish block of the Mountain West, and the stack of states between the Mississippi River and the Rockies. Those are the parts of the map worth practicing.</p>
<p>Alaska and Hawaii appear as insets in the lower left, as they do on most US maps. Their size and position there are not to scale: Alaska is the largest state by area, and Hawaii lies about 2,400 miles southwest of California.</p>`,
    tips: [
      "Learn the four corners first: Utah, Colorado, Arizona and New Mexico meet at a single point, the only place in the US where four states touch.",
      "Use the long straight borders. The Dakotas, Nebraska and Kansas stack almost perfectly above Oklahoma and Texas.",
      "Pairs help: North Dakota sits above South Dakota, North Carolina above South Carolina, and West Virginia is northwest of Virginia.",
      "For New England, go north to south along the coast: Maine, New Hampshire, Massachusetts, Rhode Island, Connecticut, with Vermont inland beside New Hampshire.",
      "Play the four region quizzes first if 50 at once feels like too many, then come back to the full map.",
    ],
    faq: [
      { q: "How many states border Canada?", a: "Thirteen: Alaska, Washington, Idaho, Montana, North Dakota, Minnesota, Michigan, Ohio, Pennsylvania, New York, Vermont, New Hampshire and Maine. Ohio's and Pennsylvania's borders with Canada run through Lake Erie." },
      { q: "Which states border the most other states?", a: "Tennessee and Missouri, with eight neighbors each." },
      { q: "Is Washington, DC on the quiz?", a: "No. Washington, DC is a federal district, not a state, so the quiz covers the 50 states only." },
      { q: "What is a good score?", a: "Getting all 50 on the first try is the goal. A first round in the 30s is normal; most players reach the 40s within a few rounds by learning the regions they miss." },
    ],
  }),
  us("state-capitals", {
    slug: "state-capitals-quiz",
    game: { kind: "state-capitals" },
    title: "State Capitals Quiz: Test Yourself on All 50 States and Capitals",
    description: "A US state capitals test for all 50 states and capitals. Multiple choice by region, a new round every time, and notes on the capitals people mix up most.",
    h1: "State capitals quiz",
    lead: "Pick the capital of each state. Wrong answers come from the same region, so you have to know the capital, not just the part of the country.",
    body: `<p>State capitals are hard for one simple reason: many of them are not the city you'd guess. The capital of California is Sacramento, not Los Angeles; Illinois is Springfield, not Chicago; New York is Albany, not New York City; Pennsylvania is Harrisburg, not Philadelphia. Many capitals were chosen in the 1800s for being central or neutral ground rather than for their size.</p>
<p>The quiz below asks ten states at a time. Choose a region to focus on, or pick "All 50" for the full list. The complete table of states and capitals is further down the page if you want to study first.</p>`,
    tips: [
      "Learn the capitals that are also the biggest city first, such as Boston, Denver, Atlanta and Phoenix. They're the easy points.",
      "Four capitals are named after presidents: Jefferson City (Missouri), Lincoln (Nebraska), Madison (Wisconsin) and Jackson (Mississippi).",
      "Two capitals carry their state's name: Oklahoma City and Indianapolis. Don't be fooled by Carson City, Nevada, which is named after the frontiersman Kit Carson.",
      "Group the confusing pairs: Columbia is South Carolina's capital, Columbus is Ohio's; Charleston is West Virginia's capital, while South Carolina's Charleston is not a capital.",
      "Say the pair out loud as a phrase, such as \"Montpelier, Vermont\". Hearing state and capital together helps them stick.",
    ],
    faq: [
      { q: "Which state capital is the farthest north?", a: "Juneau, Alaska. The southernmost is Honolulu, Hawaii." },
      { q: "Which state capital has the smallest population?", a: "Montpelier, Vermont, with fewer than 10,000 residents." },
      { q: "Can you drive to every state capital?", a: "Not to Juneau. Alaska's capital has no road connection to the rest of North America; people reach it by plane or ferry. Honolulu is on the island of Oahu, so it isn't reachable by car from the mainland either." },
    ],
  }),
  us("northeast", {
    slug: "northeast-states-quiz",
    game: { kind: "us-region", region: "northeast" },
    title: "Northeast States Map Quiz: New England and the Mid-Atlantic",
    description: "Find the 9 Northeast states on the map: the six New England states plus New York, New Jersey and Pennsylvania. Free, timed, with a study mode.",
    h1: "Northeast states map quiz",
    lead: "Nine states, some of them very small. This is the quiz that separates guessing from knowing the map.",
    body: `<p>The US Census Bureau's Northeast region has nine states in two divisions. New England is Maine, New Hampshire, Vermont, Massachusetts, Rhode Island and Connecticut. The Middle Atlantic division is New York, New Jersey and Pennsylvania.</p>
<p>Rhode Island is the smallest state in the country, and Connecticut and New Jersey aren't much bigger, so the quiz zooms in on the region. Turn on "Zoom" on a phone for an even closer view.</p>
<p>The Northeast is also where the country began: seven of these nine states were among the thirteen original colonies; only Vermont and Maine were not. That history explains the small, irregular borders, drawn long before the straight survey lines of the West.</p>`,
    tips: [
      "Vermont and New Hampshire look like mirror images: Vermont is wider at the top, New Hampshire is wider at the bottom.",
      "Rhode Island is the small state tucked between Connecticut and the southeastern corner of Massachusetts.",
      "New Jersey sits between New York City and Philadelphia; the Hudson and Delaware rivers form much of its border.",
    ],
    faq: [
      { q: "Is Maryland a Northeast state?", a: "Not in the Census Bureau's definition, which places Maryland and Delaware in the South. Many people still call them Mid-Atlantic or Northeastern states, so you'll see both." },
      { q: "Which Northeast state is the largest?", a: "By area, New York is the largest Northeast state, followed by Pennsylvania and Maine. By population, New York is first and Pennsylvania second." },
    ],
  }),
  us("midwest", {
    slug: "midwest-states-quiz",
    game: { kind: "us-region", region: "midwest" },
    title: "Midwest States Map Quiz: All 12 Midwestern States",
    description: "Click the 12 Midwest states on a map, from Ohio to the Dakotas. A quick, free quiz with a study mode and tips for the states people swap most.",
    h1: "Midwest states map quiz",
    lead: "Twelve states from the Great Lakes to the Great Plains. The plains states are the ones most people mix up.",
    body: `<p>The Census Bureau splits the Midwest into two divisions. The East North Central states are Ohio, Indiana, Illinois, Michigan and Wisconsin, all touching the Great Lakes. The West North Central states are Minnesota, Iowa, Missouri, North Dakota, South Dakota, Nebraska and Kansas.</p>
<p>The western half is where points get lost: the Dakotas, Nebraska and Kansas are all large, flat shapes stacked on top of each other. Learn them as a column from north to south.</p>
<p>The eastern half is easier to anchor because of the Great Lakes. Michigan is the only state made of two peninsulas, Wisconsin sits between Lake Michigan and Lake Superior, and Ohio, Indiana and Illinois line up from east to west beneath them.</p>`,
    tips: [
      "Michigan is two peninsulas: the mitten-shaped Lower Peninsula and the Upper Peninsula, which borders Wisconsin.",
      "From north to south on the plains: North Dakota, South Dakota, Nebraska, Kansas, then Oklahoma, which is in the South region.",
      "Iowa sits between two rivers: the Mississippi on its east side and the Missouri on its west.",
    ],
    faq: [
      { q: "Is Ohio in the Midwest?", a: "Yes. The Census Bureau places Ohio in the Midwest's East North Central division." },
      { q: "Which Midwest state has the most neighbors?", a: "Missouri, with eight bordering states, the joint highest in the country along with Tennessee." },
    ],
  }),
  us("south", {
    slug: "southern-states-quiz",
    game: { kind: "us-region", region: "south" },
    title: "Southern States Map Quiz: The 16 States of the US South",
    description: "A free map quiz on the 16 Southern states, from Delaware to Texas, as the US Census Bureau defines the South. Timed, scored, with study mode.",
    h1: "Southern states map quiz",
    lead: "The Census Bureau's South is bigger than most people expect: 16 states, from Delaware to Texas.",
    body: `<p>The South region has three divisions. The South Atlantic states are Delaware, Maryland, Virginia, West Virginia, North Carolina, South Carolina, Georgia and Florida. The East South Central states are Kentucky, Tennessee, Alabama and Mississippi. The West South Central states are Arkansas, Louisiana, Oklahoma and Texas.</p>
<p>Washington, DC is also in the South region, but it is a federal district, not a state, so it isn't asked.</p>
<p>Texas is the anchor here: the largest of the lower 48 states, it borders New Mexico, Oklahoma, Arkansas and Louisiana. Work east from it along the Gulf Coast to Florida, then north up the Atlantic coast to Delaware, and the inland states fill in the gaps.</p>`,
    tips: [
      "Tennessee is long and thin, stretching from North Carolina to the Mississippi River and touching eight states.",
      "Alabama and Mississippi look alike; Alabama is the eastern one, with a small strip of coast at Mobile.",
      "Louisiana looks like a boot; Arkansas sits directly above it.",
    ],
    faq: [
      { q: "Why are Delaware and Maryland in the South?", a: "The Census Bureau places both in its South Atlantic division, and both lie south of the Mason-Dixon line. In everyday speech many people call them Mid-Atlantic states instead." },
      { q: "Is Oklahoma a Southern state?", a: "In the Census Bureau's definition, yes; it's in the West South Central division with Texas, Louisiana and Arkansas." },
    ],
  }),
  us("west", {
    slug: "western-states-quiz",
    game: { kind: "us-region", region: "west" },
    title: "Western States Map Quiz: The 13 States of the US West",
    description: "Find the 13 Western states on the map, from the Rocky Mountains to the Pacific, plus Alaska and Hawaii. Free, timed and scored, with a study mode.",
    h1: "Western states map quiz",
    lead: "Thirteen states, including the largest one. The Mountain states are big and boxy, which makes them easy to confuse.",
    body: `<p>The West has two Census divisions. The Mountain states are Montana, Idaho, Wyoming, Nevada, Utah, Colorado, Arizona and New Mexico. The Pacific states are Washington, Oregon, California, Alaska and Hawaii.</p>
<p>Wyoming and Colorado are both nearly perfect rectangles, so position is the only clue: Wyoming is the northern one, above Colorado.</p>
<p>The Pacific states are simpler: Washington, Oregon and California run down the coast from north to south, with Alaska and Hawaii shown as insets. Nevada sits inland from California, and Idaho lies east of Oregon and Washington, reaching all the way north to Canada. Arizona and New Mexico share the southern border with Mexico.</p>`,
    tips: [
      "Idaho has a narrow panhandle reaching up to the Canadian border between Washington and Montana.",
      "Nevada's southern tip points down toward the spot where California, Arizona and Nevada meet near the Colorado River.",
      "Utah has a notch cut from its northeast corner, where Wyoming fits in.",
    ],
    faq: [
      { q: "Which is the largest Western state?", a: "Alaska, the largest state in the country by area. Among the lower 48, Texas is largest, but it's in the South region; in the West, California is next, then Montana." },
      { q: "Where are Alaska and Hawaii on the map?", a: "They appear as insets in the lower left, which is the usual way to fit them on a US map. They are not shown at their true position or scale." },
    ],
  }),
  us("colonies", {
    slug: "13-colonies-map-quiz",
    game: { kind: "us-colonies" },
    title: "13 Colonies Map Quiz: Find the Thirteen Colonies",
    description: "A free 13 colonies map quiz: click each of the thirteen original colonies on a map of the East Coast, with notes on New England, Middle and Southern colonies.",
    h1: "13 colonies map quiz",
    lead: "Find each of the thirteen original colonies. The map uses today's state borders, which is how most classes and tests show them.",
    body: `<p>The thirteen British colonies that declared independence in 1776 are usually taught in three groups. The New England colonies were New Hampshire, Massachusetts, Rhode Island and Connecticut. The Middle colonies were New York, New Jersey, Pennsylvania and Delaware. The Southern colonies were Maryland, Virginia, North Carolina, South Carolina and Georgia.</p>
<p>Colonial borders were not the same as today's. Maine was part of Massachusetts until it became a state in 1820, Vermont was never one of the thirteen, and Virginia's land once included what is now West Virginia and Kentucky. This quiz uses modern borders so the shapes match the map you'll see in a textbook.</p>`,
    tips: [
      "Georgia was the last colony founded, in 1732, and is the southernmost of the thirteen.",
      "Delaware and Rhode Island are the two smallest, and easy to miss on a small screen; turn on Zoom.",
      "Learn the three groups from north to south: New England, Middle, Southern.",
    ],
    faq: [
      { q: "Was Maine one of the 13 colonies?", a: "Not separately. Maine was part of Massachusetts during the colonial period and became its own state in 1820." },
      { q: "Was Vermont one of the 13 colonies?", a: "No. The area was claimed by New York and New Hampshire; Vermont joined the Union in 1791 as the 14th state." },
    ],
  }),

  // ------------------------------------------------------------------ World
  world("world", {
    slug: "world-map-quiz",
    game: { kind: "world-map", view: "world" },
    title: "World Map Quiz: Countries of the World on a Blank Map",
    description: "Free countries of the world quiz: find all 195 countries on a blank world map, filter by continent, and practice the countries you miss in study mode.",
    h1: "World map quiz",
    lead: "195 countries on one map. Pick a continent to start small, or try all of them at once.",
    body: `<p>The quiz covers the 193 member states of the United Nations plus its two observer states, Vatican City and Palestine. Places that are territories of other countries, such as Greenland or Puerto Rico, are drawn in gray but never asked.</p>
<p>Small countries are marked with a dot so you can still click them; on a phone, turn on Zoom and scroll the map. If you're new to world geography, start with a continent filter: Africa, Asia and Europe each have around 45 to 55 countries, which is a manageable round.</p>`,
    tips: [
      "Start with the biggest country on each continent and work outward through its neighbors.",
      "Learn the landlocked countries as a group; they can't hide behind a coastline.",
      "Do one continent until you can finish it without mistakes, then move to the next.",
      "The Caribbean and the Pacific islands are where most points are lost; practice them with the regional quizzes.",
    ],
    faq: [
      { q: "How many countries are there in the world?", a: "This quiz uses 195: the 193 UN member states plus the two UN observer states. Other counts include partially recognized states such as Kosovo or Taiwan; we draw those on the map but don't ask them." },
      { q: "Which continent has the most countries?", a: "Africa, with 54 UN member states." },
      { q: "Why is Russia grouped with Europe?", a: "Russia spans Europe and Asia. Most of its people live in the European part, and map quizzes of Europe usually include it, so we group it with Europe." },
    ],
  }),
  world("europe", {
    slug: "europe-map-quiz",
    game: { kind: "world-map", view: "europe", continents: ["EU"] },
    title: "Europe Map Quiz: Test Yourself on All 45 European Countries",
    description: "Click each European country on the map, including the microstates, with a timer and score. Free Europe map quiz with study mode and tips for the Balkans.",
    h1: "Europe map quiz",
    lead: "45 countries, six of them microstates you'll need to zoom in to find. The Balkans are where most rounds go wrong.",
    body: `<p>This quiz includes Russia and the six European microstates: Andorra, Liechtenstein, Malta, Monaco, San Marino and Vatican City. Turkey, Georgia, Armenia and Azerbaijan are grouped with Asia here, since most of their territory lies there.</p>
<p>The Balkan Peninsula is the hardest part of the map. Slovenia, Croatia, Bosnia and Herzegovina, Serbia, Montenegro, North Macedonia, Albania and Kosovo all fit in an area smaller than France. Kosovo is drawn on the map but not asked, because not every UN member recognizes it.</p>`,
    tips: [
      "Learn the Baltic states north to south: Estonia, Latvia, Lithuania.",
      "Slovakia and Slovenia: Slovakia is north, next to Czechia; Slovenia is south, next to Italy and Croatia.",
      "Croatia's coast wraps around Bosnia and Herzegovina like a crescent.",
      "Moldova sits between Romania and Ukraine, and is landlocked.",
    ],
    faq: [
      { q: "How many countries are in Europe?", a: "This quiz uses 45, including Russia and Vatican City. Counts differ depending on whether Turkey, the Caucasus countries and Kazakhstan are included." },
      { q: "What is the smallest country in Europe?", a: "Vatican City, which is also the smallest country in the world by both area and population." },
      { q: "Which European countries are landlocked?", a: "Fourteen of the countries in this quiz: Andorra, Austria, Belarus, Czechia, Hungary, Liechtenstein, Luxembourg, Moldova, North Macedonia, San Marino, Serbia, Slovakia, Switzerland and Vatican City. Kosovo, drawn but not asked, is landlocked too." },
    ],
  }),
  world("africa", {
    slug: "africa-map-quiz",
    game: { kind: "world-map", view: "africa", continents: ["AF"] },
    title: "Africa Map Quiz: Test Yourself on All 54 African Countries",
    description: "Free Africa map quiz: find all 54 African countries, including the island nations, with a timer and study mode. Tips for West Africa's smaller states.",
    h1: "Africa map quiz",
    lead: "54 countries, the most of any continent. West Africa's coast is where careful players separate from fast ones.",
    body: `<p>Africa has more countries than any other continent: 54 UN member states. The quiz includes the island nations of Cabo Verde, São Tomé and Príncipe, Comoros, Mauritius, Seychelles and Madagascar; the smaller ones are shown as dots.</p>
<p>Two pairs cause most mistakes. There are two Congos: the Democratic Republic of the Congo, the large country in the center, and the Republic of the Congo, the smaller one to its west. And there are two Guineas in West Africa, Guinea and Guinea-Bissau, plus Equatorial Guinea farther south.</p>`,
    tips: [
      "Algeria is Africa's largest country; start there and work outward.",
      "The Gambia is a thin strip along the Gambia River, almost surrounded by Senegal.",
      "Lesotho is entirely surrounded by South Africa; Eswatini is nearly surrounded, bordering Mozambique as well.",
      "Along the Gulf of Guinea, west to east: Côte d'Ivoire, Ghana, Togo, Benin, Nigeria.",
    ],
    faq: [
      { q: "What is the largest country in Africa?", a: "Algeria, by area. Nigeria has the largest population." },
      { q: "Which is the newest country in Africa?", a: "South Sudan, which became independent from Sudan in 2011." },
    ],
  }),
  world("asia", {
    slug: "asia-map-quiz",
    game: { kind: "world-map", view: "asia", continents: ["AS"] },
    title: "Asia Map Quiz: All 47 Asian Countries on the Map",
    description: "Find the 47 Asian countries on a map, from Turkey to Japan, with the Middle East and Central Asia included. Free, timed, with a study mode.",
    h1: "Asia map quiz",
    lead: "47 countries, from Turkey to Japan. Central Asia's five \"-stans\" and the Gulf states are the parts to practice.",
    body: `<p>This Asia quiz includes the Middle East, the Caucasus (Georgia, Armenia, Azerbaijan), Central Asia, South Asia, East Asia and Southeast Asia, including Timor-Leste. Russia is drawn for context but asked in the Europe quiz.</p>
<p>The five Central Asian countries are Kazakhstan, Uzbekistan, Turkmenistan, Kyrgyzstan and Tajikistan. Kazakhstan is by far the largest; Kyrgyzstan and Tajikistan are the small mountainous pair in the southeast of the group.</p>
<p>Southeast Asia is the other part of the map that rewards practice. On the mainland, Myanmar, Thailand, Laos, Cambodia and Vietnam fit together around the Mekong River; offshore, Malaysia is split between the Malay Peninsula and northern Borneo, which it shares with Brunei and Indonesia.</p>`,
    tips: [
      "Around the Arabian Peninsula: Saudi Arabia in the middle, Yemen and Oman to the south and east, and the small Gulf states along the east coast.",
      "Qatar is a peninsula off Saudi Arabia; Bahrain is an island just west of it.",
      "In Southeast Asia, Laos is the only landlocked country.",
      "Bhutan and Nepal both sit between India and China; Nepal is the larger one, to the west.",
    ],
    faq: [
      { q: "How many countries are in Asia?", a: "This quiz uses 47. Counts vary depending on where Russia, Turkey, the Caucasus countries and Cyprus are placed." },
      { q: "What is the largest country entirely in Asia?", a: "China, by area. Russia is larger but spans Europe and Asia." },
    ],
  }),
  world("americas", {
    slug: "americas-map-quiz",
    game: { kind: "world-map", view: "americas", continents: ["NA", "SA"] },
    title: "North and South America Map Quiz: All 35 Countries",
    description: "Free map quiz of the Americas: find 35 countries in North, Central and South America and the Caribbean, with filters, a timer and study mode.",
    h1: "North and South America map quiz",
    lead: "35 countries from Canada to Chile. Central America and the Caribbean islands are where the points are.",
    body: `<p>This quiz combines North America, Central America, the Caribbean and South America. Use the filters to play North America (23 countries, including Central America and the Caribbean) or South America (12 countries) on its own.</p>
<p>Many of the Caribbean countries are islands too small to see at this scale, so they are marked with dots. Territories such as Puerto Rico, Greenland and French Guiana are drawn but not asked, because they belong to other countries.</p>
<p>The two continents are joined at the Isthmus of Panama, and Panama is usually counted as the last country of North America. South America itself is dominated by Brazil, which borders every South American country except Chile and Ecuador, so it makes a good starting point for the southern half of the map.</p>`,
    tips: [
      "Central America from north to south: Guatemala, Belize, Honduras, El Salvador, Nicaragua, Costa Rica, Panama.",
      "El Salvador is the only Central American country without a Caribbean coast.",
      "In South America, Bolivia and Paraguay are the two landlocked countries.",
      "Hispaniola is one island shared by two countries: Haiti in the west and the Dominican Republic in the east.",
    ],
    faq: [
      { q: "Is Central America part of North America?", a: "Yes. Geographers usually treat Central America and the Caribbean as part of the North American continent, which is how the filters here group them." },
      { q: "How many countries are in South America?", a: "Twelve. French Guiana is part of France, so it is not counted." },
    ],
  }),
  world("oceania", {
    slug: "oceania-map-quiz",
    game: { kind: "world-map", view: "oceania", continents: ["OC"] },
    title: "Oceania Map Quiz: Australia, New Zealand and the Pacific Islands",
    description: "Find the 14 countries of Oceania on the map: Australia, New Zealand, Papua New Guinea and the Pacific island nations. Free quiz with study mode.",
    h1: "Oceania map quiz",
    lead: "Fourteen countries spread across a huge ocean. Australia is easy; the island nations are the real test.",
    body: `<p>Oceania's countries are Australia, New Zealand, Papua New Guinea and eleven island nations: Fiji, Solomon Islands, Vanuatu, Samoa, Tonga, Kiribati, Tuvalu, Nauru, Palau, Micronesia and the Marshall Islands.</p>
<p>The island groups are often taught as Melanesia (Papua New Guinea, Solomon Islands, Vanuatu, Fiji), Micronesia (Palau, Federated States of Micronesia, Marshall Islands, Nauru, Kiribati) and Polynesia (Samoa, Tonga, Tuvalu, New Zealand).</p>
<p>On this map the Pacific is centered rather than split at the edges, so the island nations sit together instead of being cut in half. Many of them are made of dozens or hundreds of islands spread over thousands of kilometers, so their dots mark the main island group, not every island.</p>`,
    tips: [
      "Papua New Guinea shares the island of New Guinea with Indonesia; it's the eastern half.",
      "Nauru and Tuvalu are among the smallest countries on Earth; look for their dots.",
      "Kiribati's islands spread across the equator and over a vast area of ocean.",
    ],
    faq: [
      { q: "Is Australia a continent or a country?", a: "Both. Australia is a country, and the Australian continent includes it along with nearby land on the same continental shelf, such as New Guinea." },
      { q: "What is the smallest country in Oceania?", a: "Nauru, by area." },
    ],
  }),
  world("capitals", {
    slug: "world-capitals-quiz",
    game: { kind: "capitals" },
    title: "World Capitals Quiz: Capital Cities of Every Country",
    description: "Free world capitals quiz: pick the capital of each country, by continent or all at once, with notes on countries that have more than one capital.",
    h1: "World capitals quiz",
    lead: "Choose the capital of each country. The wrong answers are other capitals from the same continent, so guessing by region won't help.",
    body: `<p>The quiz asks about 188 countries. Seven are left out on purpose, because a single answer would be misleading: Bolivia, South Africa, Sri Lanka and Eswatini each have more than one capital; Nauru has no official capital; and the status of Jerusalem is disputed for Israel and Palestine. Their notes appear in the table below.</p>
<p>Some answers come with a note too. Several countries moved their capitals in living memory: Nigeria from Lagos to Abuja, Myanmar from Yangon to Naypyidaw, Burundi from Bujumbura to Gitega.</p>`,
    tips: [
      "The classic traps are big cities that aren't capitals: Sydney (Canberra), Toronto (Ottawa), Istanbul (Ankara), Rio de Janeiro (Brasília).",
      "Learn capitals that share the country's name as freebies: Mexico City, Guatemala City, Kuwait City, Singapore, Vatican City.",
      "Practice one continent at a time; Africa and Oceania are where most players lose points.",
    ],
    faq: [
      { q: "Which countries have more than one capital?", a: "South Africa has three: Pretoria, Cape Town and Bloemfontein. Bolivia splits its capital between Sucre and La Paz, and several others, including the Netherlands, Malaysia and Eswatini, divide official and government functions between cities." },
      { q: "What is the highest capital city?", a: "La Paz, Bolivia's seat of government, at about 3,600 meters above sea level. Quito, Ecuador, at about 2,850 meters, is the highest official capital." },
    ],
  }),
  world("flags", {
    slug: "flag-quiz",
    game: { kind: "flags" },
    title: "Flags of the World Quiz: Guess the Flag of Every Country",
    description: "Free flags of the world quiz and flag guessing game: name the country for each flag, by continent or all 195 at once, with tips for look-alike flags.",
    h1: "Flags of the world quiz",
    lead: "Name the country for each flag. Wrong choices come from the same continent, which is exactly where the look-alike flags are.",
    body: `<p>Flags are designed to be recognized at a glance, but dozens of them share the same colors. Red, white and blue stripes, the pan-African green, yellow and red, and the pan-Arab red, white, black and green each appear on many flags. The quickest way to learn them is in the groups where they get confused.</p>
<p>Flag images come from the open-source flag-icons collection. A few flags have fine details, such as coats of arms, that are simplified at small sizes.</p>`,
    tips: [
      "Chad and Romania have nearly identical blue, yellow and red stripes; Chad's blue is slightly darker.",
      "Indonesia and Monaco are both red over white; Poland is the reverse, white over red.",
      "Ireland is green, white and orange from the flagpole out; Côte d'Ivoire is the same colors in reverse order.",
      "Australia and New Zealand both show the Union Jack and the Southern Cross; Australia adds a large seven-pointed star.",
    ],
    faq: [
      { q: "Which flags are hardest to tell apart?", a: "Chad and Romania, Indonesia and Monaco, and Ireland and Côte d'Ivoire are the classic pairs, along with the many Nordic crosses and tricolors." },
      { q: "Which country's flag is not a rectangle?", a: "Nepal's, made of two stacked triangles. It is the only non-rectangular national flag." },
    ],
  }),
  world("shapes", {
    slug: "guess-the-country",
    game: { kind: "outlines" },
    title: "Guess the Country by Its Shape: Country Outline Quiz",
    description: "Guess the country from its outline alone, with no map around it. A free shape quiz with four choices from the same continent and a new round each time.",
    h1: "Guess the country by its shape",
    lead: "Each question shows one country's outline, without neighbors or coastline context. Some are unmistakable; most are not.",
    body: `<p>Without the surrounding map, a country's shape is a surprisingly hard clue. Italy and Chile are instantly recognizable; Paraguay or Burkina Faso are much harder. This quiz trains you to remember what a country looks like on its own, which makes the map quizzes much faster.</p>
<p>Outlines are drawn from Natural Earth data at a scale that keeps island groups. Tuvalu is too small for the dataset and is left out. Each outline is drawn at its own scale, so a small country can look as large as a big one.</p>`,
    tips: [
      "Look for one distinctive feature: a long coastline, a panhandle, a chain of islands.",
      "Island nations made of many pieces, such as Indonesia, the Philippines and Japan, are easier than they look.",
      "Think about where north is: every outline is shown with north at the top.",
    ],
    faq: [
      { q: "Are the outlines to scale?", a: "No. Each country is enlarged or shrunk to fill the same box, so size is not a clue." },
      { q: "Why are some countries hard to recognize?", a: "Many borders follow straight survey lines or rivers that are only memorable next to their neighbors. Learning them in context with the map quizzes helps." },
    ],
  }),
];

export const PAGE_BY_KEY = Object.fromEntries(PAGES.map((p) => [p.key, p]));
