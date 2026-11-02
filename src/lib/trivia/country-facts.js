// Country fact pages. Each fact is [fact, explanation, source], written by
// hand and checked against the named source. Pages have their own lead,
// body and FAQ; tests fail if a FAQ question repeats anywhere on the site.

export const COUNTRY_PAGES = [
  {
    key: "japan", slug: "facts-about-japan", country: "Japan",
    title: "Japanese Facts: 16 Interesting Facts About Japan",
    h1: "Interesting facts about Japan",
    description: "16 interesting facts about Japan with sources: its 14,000 islands, Mount Fuji, the bullet train, three writing systems, instant noodles, emoji and more.",
    lead: "Sixteen facts about Japan's land, language, inventions and history, each with a line of explanation and the source we checked it against.",
    body: `<h2>A country of islands and mountains</h2>
<p>Japan is far more islands than most people picture. A 2023 government recount found 14,125, though almost everyone lives on the four largest: Honshu, Hokkaido, Kyushu and Shikoku. About three-quarters of the land is mountainous, which is why so many people live packed into coastal plains, and why Tokyo's metropolitan area is the most populous in the world.</p>
<h2>Old traditions, modern firsts</h2>
<p>Many facts about Japan sit side by side with something very old: a temple-building company founded in 578, an imperial line said to be the world's oldest continuous hereditary monarchy, and three writing systems used in the same sentence. The same country gave the world the bullet train, instant noodles and the emoji. The list below mixes both.</p>
<h2>Using these facts</h2>
<p>For a trivia round, turn a fact into a number question: how many islands does Japan have, or in what year did the first bullet train run? For more facts about places, animals and science, see the full <a href="/fun-facts/">fun facts</a> list, and test your map knowledge on the <a href="/asia-map-quiz/">Asia map quiz</a>.</p>`,
    faq: [
      { q: "How many islands does Japan have?", a: "14,125, according to a 2023 recount by Japan's Geospatial Information Authority, which used more detailed digital maps than the old count of 6,852." },
      { q: "What are the four main islands of Japan?", a: "Honshu, Hokkaido, Kyushu and Shikoku. Honshu is the largest and home to Tokyo, Kyoto and Osaka." },
      { q: "What are three interesting facts about Japan?", a: "Japan has more than 14,000 islands, its first bullet train ran in 1964, and a temple-building company there, Kongō Gumi, was founded in the year 578." },
    ],
    sources: [{ label: "Geospatial Information Authority of Japan", href: "https://www.gsi.go.jp/ENGLISH/" }, { label: "Japan National Tourism Organization", href: "https://www.japan.travel/en/" }, { label: "Encyclopaedia Britannica: Japan", href: "https://www.britannica.com/place/Japan" }],
    facts: [
      ["Japan has 14,125 islands.", "A 2023 recount using digital maps roughly doubled the earlier official figure of 6,852.", "Geospatial Information Authority of Japan"],
      ["Four main islands hold almost all of Japan's people.", "They are Honshu, Hokkaido, Kyushu and Shikoku. Honshu alone has about four-fifths of the population.", "Encyclopaedia Britannica"],
      ["Greater Tokyo is the most populous metropolitan area in the world.", "The UN puts it at about 37 million people, more than live in most countries.", "United Nations, World Urbanization Prospects"],
      ["About three-quarters of Japan is mountainous.", "That leaves limited flat land, so farms, cities and roads crowd onto the coastal plains.", "Encyclopaedia Britannica"],
      ["Mount Fuji last erupted in 1707.", "At 3,776 meters, Fuji is Japan's highest mountain and is still classed as an active volcano.", "Japan Meteorological Agency"],
      ["Japan sits where four tectonic plates meet.", "The Pacific, Philippine Sea, Eurasian and North American plates make it one of the most earthquake-prone countries.", "US Geological Survey"],
      ["The first bullet train ran in 1964.", "The Tokaido Shinkansen between Tokyo and Osaka opened nine days before the 1964 Tokyo Olympics.", "Central Japan Railway Company"],
      ["Instant noodles were invented in Japan in 1958.", "Momofuku Ando created Chicken Ramen, the first instant noodle, and later Cup Noodles in 1971.", "Nissin Foods"],
      ["The word emoji is Japanese.", "It joins e (picture) and moji (character). Shigetaka Kurita designed an early, influential set in 1999; the likeness to \"emotion\" is a coincidence.", "Museum of Modern Art, New York"],
      ["Japanese uses three writing systems at once.", "Kanji are characters from Chinese; hiragana and katakana are syllable alphabets. A single sentence often uses all three.", "Japan Foundation"],
      ["Kongō Gumi, a temple builder, was founded in 578.", "It is often cited as one of the oldest companies in the world. It is now part of a larger construction group.", "Encyclopaedia Britannica"],
      ["Japan's imperial family is traditionally called the oldest continuous hereditary monarchy.", "Emperor Naruhito, who acceded in 2019, is counted as the 126th emperor.", "Imperial Household Agency"],
      ["Tokyo has hosted the Summer Olympics twice.", "In 1964, and in 2021 for the Games still officially called Tokyo 2020 after a one-year delay.", "International Olympic Committee"],
      ["Cars in Japan drive on the left.", "Japan is one of about 75 countries and territories where traffic keeps left, like the UK and Australia.", "Encyclopaedia Britannica"],
      ["Japanese people have one of the world's longest life expectancies.", "Life expectancy at birth is around 84 years, among the highest of any country.", "World Health Organization"],
      ["Cherry blossom season is forecast like the weather.", "Forecasters track the \"cherry blossom front\" as it moves north from Okinawa in January to Hokkaido in May.", "Japan National Tourism Organization"],
    ],
  },
  {
    key: "mexico", slug: "facts-about-mexico", country: "Mexico",
    title: "Mexican Facts: 16 Interesting Facts About Mexico",
    h1: "Interesting facts about Mexico",
    description: "16 interesting facts about Mexico with sources: a capital built on a lake, the largest pyramid by volume, corn, vanilla, 68 Indigenous languages and more.",
    lead: "Sixteen facts about Mexico's history, food, languages and landscape, from the lake beneath Mexico City to the monarch butterflies of Michoacán, each with a source.",
    body: `<h2>Ancient cities, modern country</h2>
<p>Mexico's capital stands on the site of Tenochtitlan, the Aztec capital built on an island in Lake Texcoco. The lakebed beneath it is one reason parts of Mexico City are slowly sinking. Older still are the pyramids: the Great Pyramid of Cholula is the largest in the world by volume, and Chichén Itzá was named one of the New Seven Wonders of the World in 2007.</p>
<h2>Food the world eats every day</h2>
<p>Corn was domesticated in Mexico about 9,000 years ago, and vanilla, chocolate and chili peppers all come from Mexico and Mesoamerica. A few common beliefs need correcting, too: Cinco de Mayo is not Mexico's independence day, which is September 16.</p>
<h2>Using these facts</h2>
<p>These facts suit a geography or food round, or a classroom unit on Mexico. Pair them with the <a href="/americas-map-quiz/">North and South America map quiz</a>, and see our <a href="/food-trivia/">food trivia</a> for the Caesar salad's surprising birthplace in Tijuana.</p>`,
    faq: [
      { q: "What are some interesting facts about Mexico?", a: "Mexico City is built on a former lake, the Great Pyramid of Cholula is the world's largest pyramid by volume, and corn was first domesticated in Mexico about 9,000 years ago." },
      { q: "Is Cinco de Mayo Mexico's independence day?", a: "No. Cinco de Mayo marks the Mexican army's victory over French forces at the Battle of Puebla in 1862. Independence Day is September 16." },
      { q: "How many states does Mexico have?", a: "Mexico has 32 federal entities: 31 states and Mexico City, which became a federal entity of its own in 2016." },
    ],
    sources: [{ label: "INEGI (Mexico's national statistics institute)", href: "https://www.inegi.org.mx/" }, { label: "UNESCO World Heritage Centre", href: "https://whc.unesco.org/" }, { label: "Smithsonian Magazine", href: "https://www.smithsonianmag.com/" }],
    facts: [
      ["Mexico City is built on a lake.", "The Aztecs founded Tenochtitlan on an island in Lake Texcoco in 1325. The soft lakebed is why parts of the city are sinking, in places by tens of centimeters a year.", "Encyclopaedia Britannica"],
      ["Mexico's flag shows the legend of the city's founding.", "The eagle perched on a cactus eating a snake is the sign the Mexica were told to look for when choosing where to build.", "Government of Mexico"],
      ["The largest pyramid in the world by volume is in Mexico.", "The Great Pyramid of Cholula, in Puebla, has a base about four times that of Egypt's Great Pyramid. A church now sits on top.", "Guinness World Records"],
      ["Chichén Itzá is one of the New Seven Wonders of the World.", "The Maya city in Yucatán was chosen in a worldwide vote in 2007 and is a UNESCO World Heritage Site.", "UNESCO World Heritage Centre"],
      ["Corn was first domesticated in Mexico.", "Farmers in southern Mexico bred maize from a wild grass called teosinte about 9,000 years ago.", "Smithsonian National Museum of Natural History"],
      ["Vanilla comes from a Mexican orchid.", "The Totonac people of Veracruz cultivated it long before it spread to the rest of the world.", "Smithsonian Magazine"],
      ["Mexico has the largest Spanish-speaking population of any country.", "Around 130 million people live there, more than twice the population of Spain.", "Instituto Cervantes"],
      ["Mexico recognizes 68 Indigenous languages as national languages.", "They have the same legal standing as Spanish. Nahuatl, the language of the Aztecs, is the most widely spoken.", "INALI (National Institute of Indigenous Languages)"],
      ["Mexico has 32 federal entities.", "There are 31 states plus Mexico City, which became a federal entity in its own right in 2016.", "INEGI"],
      ["Cinco de Mayo is not Mexican Independence Day.", "It marks the Battle of Puebla in 1862. Independence Day is September 16, recalling the 1810 call to revolt.", "Encyclopaedia Britannica"],
      ["Millions of monarch butterflies spend the winter in Mexico.", "They fly up to about 4,000 km from Canada and the US to fir forests in Michoacán and the State of Mexico.", "UNESCO World Heritage Centre"],
      ["The Chihuahua is named after a Mexican state.", "The breed takes its name from Chihuahua, Mexico's largest state, where it was first documented.", "American Kennel Club"],
      ["The axolotl lives wild only near Mexico City.", "This salamander, which can regrow lost limbs, survives in the canals of Xochimilco and is critically endangered.", "IUCN Red List"],
      ["UNAM's main campus is a World Heritage Site.", "The Central University City Campus of Mexico's National Autonomous University was added to UNESCO's list in 2007.", "UNESCO World Heritage Centre"],
      ["A Mexican engineer patented an early color TV system.", "Guillermo González Camarena patented a color television system in Mexico in 1940.", "Encyclopaedia Britannica"],
      ["Mexico City's main square is one of the largest in the world.", "The Zócalo, formally the Plaza de la Constitución, sits on the center of the old Aztec capital.", "Encyclopaedia Britannica"],
    ],
  },
  {
    key: "canada", slug: "facts-about-canada", country: "Canada",
    title: "Canadian Facts: 16 Interesting Facts About Canada",
    h1: "Interesting facts about Canada",
    description: "16 interesting facts about Canada with sources: provinces and territories, two official languages, the maple leaf flag, maple syrup, insulin, the CN Tower and more.",
    lead: "Sixteen facts about Canada's land, people, inventions and symbols, from the maple leaf flag to the discovery of insulin, each checked against a source.",
    body: `<h2>A huge country that lives near its border</h2>
<p>Canada is the second-largest country in the world by area, after Russia, yet most Canadians live within a few hours' drive of the United States. Its ten provinces and three territories range from Nunavut, created in 1999 as a mainly Inuit territory, to tiny Prince Edward Island.</p>
<h2>Symbols with recent dates</h2>
<p>Some of Canada's best-known symbols are newer than people expect. The maple leaf flag was adopted in 1965, and "O Canada" became the official national anthem only in 1980. Others are old: the Hudson's Bay Company was founded in 1670 and is among the oldest companies in North America.</p>
<h2>Using these facts</h2>
<p>For a quiz, the dates make good closest-number questions: in what year was the maple leaf flag adopted? For geography practice, find every province's neighbor on the <a href="/americas-map-quiz/">North and South America map quiz</a>, and see the guide to <a href="/guides/states-that-border-canada-and-mexico/">states that border Canada and Mexico</a>.</p>`,
    faq: [
      { q: "What are some interesting facts about Canada?", a: "Canada is the world's second-largest country by area, has two official languages, produces most of the world's maple syrup, and is where insulin was discovered, in 1921." },
      { q: "How many provinces and territories does Canada have?", a: "Ten provinces and three territories: Yukon, the Northwest Territories and Nunavut, which was created in 1999." },
      { q: "When did Canada adopt the maple leaf flag?", a: "On February 15, 1965. It replaced the Canadian Red Ensign, which carried the British Union Jack." },
    ],
    sources: [{ label: "Government of Canada", href: "https://www.canada.ca/" }, { label: "Statistics Canada", href: "https://www.statcan.gc.ca/" }, { label: "The Canadian Encyclopedia", href: "https://www.thecanadianencyclopedia.ca/" }],
    facts: [
      ["Canada is the second-largest country in the world by area.", "It covers about 10 million square kilometers. Only Russia is larger.", "Statistics Canada"],
      ["Canada has two official languages.", "English and French have equal status in the federal government under the Official Languages Act of 1969.", "Government of Canada"],
      ["Canada has ten provinces and three territories.", "The territories are Yukon, the Northwest Territories and Nunavut.", "Government of Canada"],
      ["Nunavut became a territory in 1999.", "It was carved out of the Northwest Territories. Most of its people are Inuit, and Inuktitut is one of its official languages.", "Government of Nunavut"],
      ["Most Canadians live near the US border.", "The large majority live within about 160 km (100 miles) of it, where the climate is mildest.", "Statistics Canada"],
      ["The maple leaf flag was adopted in 1965.", "It was first raised on February 15, 1965, now marked as National Flag of Canada Day.", "Government of Canada"],
      ["\"O Canada\" became the official anthem only in 1980.", "The song was written in French in 1880. The National Anthem Act was passed a century later.", "Government of Canada"],
      ["Canada produces most of the world's maple syrup.", "Quebec alone accounts for the large majority of Canada's output.", "Agriculture and Agri-Food Canada"],
      ["Insulin was discovered in Toronto.", "Frederick Banting and Charles Best isolated it at the University of Toronto in 1921; Banting shared the 1923 Nobel Prize.", "The Nobel Prize"],
      ["The Hudson's Bay Company was founded in 1670.", "It began as a fur-trading company under an English royal charter and is one of the oldest companies in North America.", "The Canadian Encyclopedia"],
      ["The CN Tower was the world's tallest free-standing structure for more than 30 years.", "Completed in Toronto in 1976 at 553 meters, it held the record until the Burj Khalifa passed it in 2007.", "The Canadian Encyclopedia"],
      ["Canada's highest mountain is Mount Logan.", "At 5,959 meters in Yukon, it is the second-highest peak in North America after Denali.", "Natural Resources Canada"],
      ["Wood Buffalo is Canada's largest national park.", "At about 44,800 square kilometers it is larger than Switzerland, and it protects the last wild nesting area of the whooping crane.", "Parks Canada"],
      ["Poutine comes from rural Quebec.", "Fries with cheese curds and gravy appeared in Quebec diners in the 1950s; several towns claim to be its birthplace.", "The Canadian Encyclopedia"],
      ["Canada is a constitutional monarchy.", "The monarch, currently King Charles III, is Canada's head of state; the prime minister leads the government.", "Government of Canada"],
      ["The Trans-Canada Highway is about 7,800 km long.", "It links all ten provinces, from Victoria on the Pacific to St. John's on the Atlantic.", "The Canadian Encyclopedia"],
    ],
  },
];
