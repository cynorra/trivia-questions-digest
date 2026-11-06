// The category pages. Every page has its own lead, body, host notes and FAQ,
// written for that subject; tests/trivia.test.js fails if any FAQ question or
// section heading repeats across pages.
import { GENERAL, HISTORY, SCIENCE, FOOD } from "./bank-a.js";
import { SPORTS, SCREEN, MUSIC, ADULTS, SENIORS } from "./bank-b.js";
import { CHRISTMAS, THANKSGIVING, HALLOWEEN, BIBLE } from "./bank-c.js";
import { NBA, NFL, MOVIES_GUESS, EIGHTIES, NINETIES } from "./bank-d.js";
import { PRESIDENTS, SPACE, ANIMALS, EASTER, BLACK_HISTORY } from "./bank-e.js";
import { POP_CULTURE, FAMILY, DISNEY, TWO_THOUSANDS } from "./bank-f.js";

const BRIT = { label: "Encyclopaedia Britannica", href: "https://www.britannica.com/" };

export const CATS = [
  {
    key: "general", slug: "general-knowledge-trivia", topic: "trivia-night", daily: true, items: GENERAL,
    name: "General knowledge",
    title: "General Knowledge Trivia: 25 Questions With Answers",
    h1: "General knowledge trivia questions",
    description: "25 general knowledge trivia questions with answers and a short explanation for each. Play online or read them out at a party, pub quiz or classroom.",
    lead: "Twenty-five questions that cover a little of everything: geography, the human body, art, numbers and famous firsts. Play them here, or use them as a ready-made opening round.",
    body: `<h2>What makes a good general knowledge question</h2>
<p>General knowledge rounds work best when almost everyone in the room has a fair shot at most questions. That's why this set leans on things people met in school or see in daily life, such as the capital of Australia, the freezing point of water or the number of keys on a piano, rather than obscure specialist facts.</p>
<p>The wrong answers matter as much as the right one. Sydney is a better decoy for Australia's capital than Auckland, because many people really do believe it. Every explanation tells you why the right answer is right, and often why the tempting wrong one isn't.</p>
<h2>How to run it as an opening round</h2>
<ul>
<li>Read the question, then the four options, then the question again. People mishear numbers in noisy rooms.</li>
<li>Give 20 to 30 seconds per question. If you're dropping the options for a harder round, give 45.</li>
<li>Read the one-line explanation after each answer. It turns a list of answers into conversation.</li>
</ul>
<p>Once your group has warmed up, the <a href="/trivia-questions-for-adults/">harder trivia for adults</a> makes a good second round, and the <a href="/guides/how-to-host-a-trivia-night/">guide to hosting a trivia night</a> covers scoring and tiebreakers.</p>`,
    faq: [
      { q: "How many general knowledge questions should a trivia round have?", a: "Ten is the usual round length for a pub quiz. This page has 25, so you can pick the ten that suit your group or split them into two rounds." },
      { q: "Are these general knowledge questions easy or hard?", a: "Most are easy to medium. A score of 18 out of 25 is a good result; the questions about blood types, the Eiffel Tower and Denali catch the most people." },
      { q: "Can I print these general knowledge questions?", a: "Yes. Every question, its answer and its explanation are on the page as text, so your browser's print function works. Answers are hidden until you open them." },
    ],
    sources: [BRIT, { label: "CIA World Factbook (country facts)", href: "https://www.cia.gov/the-world-factbook/" }],
  },
  {
    key: "history", slug: "history-trivia", topic: "knowledge", daily: true, items: HISTORY,
    name: "History",
    title: "History Trivia: 30 American and World History Quiz Questions",
    h1: "History trivia questions",
    description: "30 history trivia questions with answers: US presidents, the Revolution and Civil War, World War II, ancient wonders and world history, each explained.",
    lead: "Thirty questions running from the Sumerians to the fall of the Soviet Union, with a strong core of American history and presidents. Every answer comes with the date or detail that makes it stick.",
    body: `<h2>US history and presidents</h2>
<p>About half of this set is American history: the Declaration of Independence, the Louisiana and Alaska purchases, the Civil War, the vote for women and the space race. Presidents come up often because they make good anchors. If you know Nixon was in office for the Moon landing and resigned in 1974, you can place a lot of the 1960s and 70s around him.</p>
<h2>World history</h2>
<p>The rest moves through the ancient world (cuneiform, the Great Pyramid, the first Roman emperor), the Middle Ages and Reformation (Magna Carta, Martin Luther), exploration (Columbus and Magellan) and the 20th century. Several questions are built around a common mix-up: Julius Caesar was never emperor, and Magellan didn't survive his own voyage around the world.</p>
<h2>How we handle dates</h2>
<p>Where a date could be read two ways, the explanation gives both. The Declaration was adopted on July 4, 1776, but most delegates signed it on August 2. For a trivia night, accept the answer the question asks for and use the explanation as the host's follow-up line.</p>
<p>Every president question has been checked against the White House's official list of presidents, and every date against the National Archives or a standard reference.</p>
<p>Want more? Our guides to <a href="/guides/us-presidents-in-order/">the US presidents in order</a> and the <a href="/guides/world-war-2-timeline/">World War II timeline</a> go deeper.</p>`,
    faq: [
      { q: "What are good history trivia questions for a mixed group?", a: "Questions with a famous anchor work best: the Moon landing, the Titanic, the Berlin Wall, the first president. This set starts with those and gets harder toward the end." },
      { q: "Do these history questions focus on the United States?", a: "About half are about US history and presidents, and the other half cover world history from ancient Mesopotamia to 1991." },
      { q: "What's the hardest question in this history quiz?", a: "The one people miss most is who led the first voyage around the world. Magellan led it, but he was killed in the Philippines, and Juan Sebastián Elcano brought the last ship home." },
    ],
    sources: [{ label: "National Archives: America's Founding Documents", href: "https://www.archives.gov/founding-docs" }, { label: "The White House: Presidents", href: "https://www.whitehouse.gov/about-the-white-house/presidents/" }, BRIT],
  },
  {
    key: "science", slug: "science-trivia", topic: "knowledge", daily: true, items: SCIENCE,
    name: "Science",
    title: "Science Trivia: 30 Questions on Space, Animals and Biology",
    h1: "Science trivia questions",
    description: "30 science trivia questions with answers on space, the planets, animals, chemistry and the human body. Checked against NASA and museum sources.",
    lead: "Thirty questions on the planets, the animal world, the human body and everyday chemistry. Answers that depend on new discoveries, like moon counts, are dated so they don't go stale silently.",
    body: `<h2>Space questions</h2>
<p>A third of this set is about the solar system, from the easy (the Red Planet) to the ones that catch people out, like the closest star (it's the Sun) or the hottest planet (Venus, not Mercury). Moon counts keep changing as telescopes find more, so that question says "as of 2025" and we update it when NASA's count changes.</p>
<h2>Animals and the body</h2>
<p>Animal questions favor surprising facts with a clear answer: the octopus's three hearts, the only mammal that truly flies, the largest bird. Human-body questions stick to textbook facts, such as 206 bones and four heart chambers, and say where children and adults differ.</p>
<h2>Why some explanations add a second fact</h2>
<p>A good science answer should leave you knowing slightly more than the question asked. So when the answer is "cheetah," the explanation adds that the pronghorn can keep up a fast pace for much longer. If you host, that second fact is your follow-up line, and it often starts the best arguments of the night.</p>
<p>For more space detail, see <a href="/guides/planets-in-order/">the planets in order</a>. For surprising facts about animals and space in shorter form, browse the <a href="/fun-facts/">fun facts</a>.</p>`,
    faq: [
      { q: "Are these science trivia questions suitable for a family game?", a: "Yes. They avoid anything graphic and stick to school-level science. Children may need the four options; adults can try them without." },
      { q: "Why does the moons question say 'as of 2025'?", a: "Astronomers keep confirming new moons, especially around Saturn and Jupiter. Dating the question keeps it honest; we update it when NASA's official count changes." },
      { q: "Where do the science answers come from?", a: "Each answer was checked against NASA, a natural history museum or a standard reference. The sources are listed at the bottom of this page." },
    ],
    sources: [{ label: "NASA Science: Solar System", href: "https://science.nasa.gov/solar-system/" }, { label: "Smithsonian National Museum of Natural History", href: "https://naturalhistory.si.edu/" }, BRIT],
  },
  {
    key: "food", slug: "food-trivia", topic: "trivia-night", daily: true, items: FOOD,
    name: "Food",
    title: "Food Trivia: 25 Food Quiz Questions and Answers",
    h1: "Food trivia questions",
    description: "25 food trivia questions with answers: where dishes come from, spices, cheese, chocolate and the surprising science of everyday ingredients.",
    lead: "Twenty-five questions about where dishes come from, what's really in them and why some foods behave the way they do. A good round for dinner parties and office lunches.",
    body: `<h2>Where foods come from</h2>
<p>Many food questions are really geography questions in disguise. Caesar salad comes from Mexico, not Italy. Paella is Valencian. Feta, by EU law, can only be made in parts of Greece. These make great trivia because the obvious guess is so often wrong.</p>
<h2>What's in them</h2>
<p>The other half of the set asks what things are made of: chickpeas in hummus, almonds in marzipan, soybeans in tofu and miso, and the cocoa butter (but no cocoa solids) in white chocolate. A few explain the science behind the answer, like why strawberry "seeds" are really tiny fruits, or which compound makes chili peppers hot.</p>
<h2>Running a food round</h2>
<ul>
<li>Pair the round with the food. Ask the hummus and guacamole questions while the dips are out.</li>
<li>For a harder round, read the question without the options and give a point for any answer that names the right country or ingredient.</li>
<li>Chocolate questions are popular. If you need a tiebreaker, ask how many seeds a strawberry has; the closest guess to 200 wins.</li>
</ul>
<p>Every answer about where a food comes from follows the usual reference account. Where food history is disputed, as it often is, we leave the question out rather than settle an argument with a guess.</p>
<p>More food facts are mixed into the <a href="/fun-facts/">fun facts</a> list, and <a href="/guides/trivia-round-ideas/">our round ideas</a> include several food formats.</p>`,
    faq: [
      { q: "What's a good food trivia question to start with?", a: "Where the Caesar salad was invented. Almost everyone guesses Italy; the answer is Tijuana, Mexico, where restaurateur Caesar Cardini is credited with creating it in the 1920s." },
      { q: "Are there chocolate trivia questions here?", a: "Yes: which tree chocolate comes from, and which kind contains no cocoa solids. The fun facts page has more food facts, including why honey can last for thousands of years." },
      { q: "Can these food questions work for a cooking class or team lunch?", a: "Yes. They need no special knowledge, take about ten minutes for the full set, and the explanations give the group something to talk about while they eat." },
    ],
    sources: [{ label: "USDA National Agricultural Statistics Service", href: "https://www.nass.usda.gov/" }, { label: "UNESCO Intangible Cultural Heritage", href: "https://ich.unesco.org/" }, BRIT],
  },
  {
    key: "sports", slug: "sports-trivia", topic: "trivia-night", daily: true, items: SPORTS,
    name: "Sports",
    title: "Sports Trivia: 25 Questions on the NFL, NBA, MLB and More",
    h1: "Sports trivia questions",
    description: "25 sports trivia questions with answers covering football, basketball, baseball, hockey, soccer, golf and the Olympics, with history behind each answer.",
    lead: "Twenty-five questions across the NFL, NBA, MLB, NHL, soccer, golf and the Olympics. We stick to rules and history, so the answers won't change after the next big game.",
    body: `<h2>Why there are no "current champion" questions</h2>
<p>Sports trivia goes out of date faster than any other kind. Who won last season, who holds a scoring record, who's the active leader: all of it can change in a week. So this set asks about rules (how many points a touchdown is worth), history (the first Super Bowl, Jackie Robinson's debut) and records that are settled. Where a record could still move, like the most Olympic medals, the question says "as of" a date.</p>
<h2>A mix of fans and non-fans</h2>
<p>A sports round can lose half the room if every question needs a fan's memory. Questions such as what a score of zero is called in tennis or how many holes a round of golf has give everyone a chance, while the Stanley Cup's history and the first World Cup reward the people who follow sports closely.</p>
<h2>Tiebreakers from this set</h2>
<p>The number-based questions make good tiebreakers if you read them without the options: the length of a marathon, the laps in the Indianapolis 500, or the year basketball was invented. Closest answer wins.</p>
<p>Football and basketball fans have their own sets: the <a href="/nfl-quiz/">NFL quiz</a> and the <a href="/nba-quiz/">NBA quiz</a>. The <a href="/guides/trivia-night-rules-and-scoring/">guide to trivia scoring and tiebreakers</a> has more on running a fair finish.</p>`,
    faq: [
      { q: "Do these sports trivia questions include NFL and NBA questions?", a: "Yes: the first Super Bowl, touchdown scoring, the three-point shot and the number of players on a basketball court, plus baseball, hockey, soccer, golf and Olympic questions." },
      { q: "Why don't you ask who won last season?", a: "Because the answer changes every year, and an out-of-date answer is worse than none. We ask about rules, history and settled records instead." },
      { q: "What sports question makes the best tiebreaker?", a: "How many laps make up the Indianapolis 500. Many people say 500; the answer is 200 laps of a 2.5-mile track. Ask it open-ended and take the closest guess." },
    ],
    sources: [{ label: "Pro Football Hall of Fame", href: "https://www.profootballhof.com/" }, { label: "Olympics.com: Olympic history", href: "https://www.olympics.com/" }, { label: "National Baseball Hall of Fame", href: "https://baseballhall.org/" }],
  },
  {
    key: "screen", slug: "movie-trivia", topic: "trivia-night", daily: true, items: SCREEN,
    name: "Movies and TV",
    title: "Movie Trivia: 25 Film and TV Show Questions With Answers",
    h1: "Movie and TV trivia questions",
    description: "25 movie and TV trivia questions with answers: famous lines, Oscar winners, classic sitcoms and blockbusters from the 1930s to the 2000s, each with a backstory.",
    lead: "Twenty-five questions on famous lines, Oscar history, classic sitcoms and the films everyone has seen at least once. Each answer comes with a piece of behind-the-scenes history.",
    body: `<h2>Classic films and famous lines</h2>
<p>Quotes make great trivia because people half-remember them. "Here's looking at you, kid" is from Casablanca, and Darth Vader never says "Luke, I am your father." Questions like these reward real memory over guessing, and the explanation gives the exact line.</p>
<h2>Oscars and records</h2>
<p>A handful of questions are about Academy Awards history: the first Best Picture, the three films tied at 11 Oscars, and the first winner of Best Animated Feature. These are settled facts, unlike box-office records, which change whenever a new blockbuster opens. The one money question here is the inflation-adjusted record from Guinness, which has held for decades.</p>
<h2>Sitcoms and TV</h2>
<p>TV questions span from I Love Lucy-era classics on the <a href="/trivia-for-seniors/">trivia for seniors</a> page to The Office, Friends, Seinfeld and Breaking Bad here. If your group skews older or younger, mix the two pages.</p>
<p>Prefer naming films from their stories? Try <a href="/guess-the-movie/">guess the movie</a>, twenty one-line plots to identify.</p>
<p>For a film night, read the explanation aloud after each answer before moving on. Most of them carry a piece of trivia of their own, like the silver slippers in the original Oz book, which gives a second chance to score a point for anyone who knew it.</p>
<p>Holiday films have their own sets: <a href="/christmas-trivia/">Christmas trivia</a> covers Home Alone, Elf and It's a Wonderful Life, and <a href="/halloween-trivia/">Halloween trivia</a> has the horror classics.</p>`,
    faq: [
      { q: "What's a good movie trivia question for a party?", a: "Which Star Wars film reveals that Darth Vader is Luke's father. It's The Empire Strikes Back, and it's a chance to point out that the famous line is usually misquoted." },
      { q: "Why aren't there box-office questions about recent films?", a: "Box-office records change every time a new blockbuster opens. We avoid them, apart from Guinness's inflation-adjusted record, which Gone with the Wind has held for decades." },
      { q: "Is there a TV trivia round on this page?", a: "Yes. Roughly a third of the questions are about TV, including The Office, Friends, Seinfeld, Breaking Bad, Game of Thrones and The Simpsons." },
    ],
    sources: [{ label: "Academy of Motion Picture Arts and Sciences: Oscars database", href: "https://awardsdatabase.oscars.org/" }, { label: "Guinness World Records", href: "https://www.guinnessworldrecords.com/" }, { label: "American Film Institute", href: "https://www.afi.com/" }],
  },
  {
    key: "music", slug: "music-trivia", topic: "trivia-night", daily: true, items: MUSIC,
    name: "Music",
    title: "Music Trivia: 25 Questions on Rock, Pop, Soul and Classical",
    h1: "Music trivia questions",
    description: "25 music trivia questions with answers spanning rock, pop, soul, jazz, reggae, rap and classical, plus a few on how music is written and played.",
    lead: "Twenty-five questions from Beethoven to Eminem: the great bands, famous albums, where genres were born and a few on how music itself works.",
    body: `<h2>Across genres and decades</h2>
<p>Music rounds go wrong when they only cover one person's taste. This set deliberately spreads out: the Beatles, Queen and Pink Floyd; Aretha Franklin and Motown; jazz from New Orleans and reggae from Jamaica; rap; and classical composers from Vivaldi to Beethoven. Most people will know a few cold and have a decent guess at the rest.</p>
<h2>Questions about music itself</h2>
<p>A few questions ask about the building blocks rather than the stars: how many lines a musical staff has, what crescendo and a cappella mean, and why the oboe tunes the orchestra. These are a good leveler, because band-loving fans and orchestra players each get their moment.</p>
<h2>Turning it into a listening round</h2>
<p>For a live event, play a few seconds of a song before reading related questions. A short clip of "Respect" before asking who first recorded it, or of "Bohemian Rhapsody" before the Queen question, turns a quiz into a party.</p>
<p>A note on "firsts" and "best-selling": sales figures for older records are estimates, so we only ask about records that are widely agreed, such as Thriller, and the explanation says the number is an estimate.</p>
<p>The <a href="/trivia-for-seniors/">trivia for seniors</a> page has more on 1950s and 60s music, and <a href="/guides/trivia-round-ideas/">our round ideas</a> include a picture round and a song intro round.</p>`,
    faq: [
      { q: "What music trivia questions work for all ages?", a: "Questions about the biggest names and the basics of music: the Beatles, the King of Rock and Roll, what crescendo means. This set mixes those with harder questions on classical composers." },
      { q: "Who first recorded 'Respect'?", a: "Otis Redding wrote and recorded it in 1965. Aretha Franklin's 1967 version, which added the spelled-out 'R-E-S-P-E-C-T', is the one most people know." },
      { q: "Can I turn this into a 'guess the song' round?", a: "Yes. Play a short clip before each related question, or play intros and ask for the artist. Keep clips to about five seconds to keep it challenging." },
    ],
    sources: [{ label: "Rock & Roll Hall of Fame", href: "https://www.rockhall.com/" }, { label: "The Nobel Prize: Bob Dylan, 2016", href: "https://www.nobelprize.org/prizes/literature/2016/summary/" }, BRIT],
  },
  {
    key: "christmas", slug: "christmas-trivia", topic: "holidays", daily: false, items: CHRISTMAS,
    name: "Christmas",
    title: "Christmas Trivia: 25 Fun Xmas Questions and Answers",
    h1: "Christmas trivia questions",
    description: "25 Christmas trivia questions with answers on carols, movies, traditions and history, from Rudolph and the Grinch to the Nutcracker and Boxing Day.",
    lead: "Twenty-five questions on Christmas songs, films, traditions and history, with a short story behind each answer. Ready for an office party, a family gathering or a holiday pub quiz.",
    body: `<h2>Songs, films and stories</h2>
<p>The festive classics come first: the Twelve Days of Christmas, Rudolph, A Christmas Carol, the Grinch, Home Alone, Elf and It's a Wonderful Life. These are the questions everyone at a holiday party can play, from grandparents to teenagers.</p>
<h2>Traditions and where they came from</h2>
<p>The rest of the set looks at where customs came from: the German Christmas tree, Mexico's poinsettia, Norway's yearly tree for Trafalgar Square, Boxing Day, and how much (and how little) Coca-Cola had to do with the modern image of Santa. Three questions come from the nativity accounts in Matthew and Luke. The <a href="/bible-trivia/">Bible trivia</a> page has more.</p>
<h2>Planning a Christmas quiz</h2>
<ul>
<li>Split the set into a "songs and films" round and a "traditions" round of about 12 each.</li>
<li>Ask the Scrooge ghost question without options. Most people say three, and four (counting Marley) makes a fun argument.</li>
<li>Use "How many gifts are given in the Twelve Days of Christmas?" as the tiebreaker. The answer is 364.</li>
</ul>
<p>A few of these answers surprise people every year: Christmas has only been a US federal holiday since 1870, Rudolph began as a department-store giveaway, and the "three" wise men are never counted in the Bible.</p>
<p>Our guides on <a href="/guides/christmas-trivia-night/">planning a Christmas trivia night</a> and <a href="/guides/christmas-traditions-around-the-world/">Christmas traditions around the world</a> have more ideas.</p>`,
    faq: [
      { q: "What are some easy Christmas trivia questions?", a: "What the first gift is in the Twelve Days of Christmas, Scrooge's first name and the name of the Grinch's dog. Almost everyone gets at least two of the three." },
      { q: "Are these Christmas trivia questions good for adults?", a: "Yes. They mix easy movie questions with harder history, like the year Christmas became a US federal holiday (1870) and which country sends London its tree." },
      { q: "Is there a Christmas tiebreaker question?", a: "Ask how many gifts are given in total in 'The Twelve Days of Christmas'. Counting every repeated verse, it's 364, one fewer than the days in a year." },
    ],
    sources: [{ label: "Library of Congress: Christmas traditions", href: "https://www.loc.gov/" }, { label: "Guinness World Records: best-selling single", href: "https://www.guinnessworldrecords.com/" }, { label: "Mayor of London: the Trafalgar Square Christmas tree", href: "https://www.london.gov.uk/" }],
  },
  {
    key: "thanksgiving", slug: "thanksgiving-trivia", topic: "holidays", daily: false, items: THANKSGIVING,
    name: "Thanksgiving",
    title: "Thanksgiving Trivia: 25 Questions on the History and Traditions",
    h1: "Thanksgiving trivia questions",
    description: "25 Thanksgiving trivia questions with answers: the 1621 harvest feast, the Wampanoag and Pilgrims, Lincoln and Sarah Hale, the parade, football and turkeys.",
    lead: "Twenty-five questions on what actually happened in 1621, how Thanksgiving became a national holiday, and the traditions that grew up around it, from the Macy's parade to the turkey pardon.",
    body: `<h2>What the sources say about 1621</h2>
<p>Most of what we know about the first harvest feast comes from one letter by colonist Edward Winslow. He described about 90 Wampanoag men arriving with their leader, Massasoit, five deer, fowl, and three days of eating and games. There's no record of pumpkin pie, which the colonists had no ovens or sugar to make. Several questions here are built on that letter so they rest on a primary source, not on later legend.</p>
<h2>How it became a national holiday</h2>
<p>Thanksgiving didn't become a yearly national holiday until 1863, after a 17-year letter-writing campaign by magazine editor Sarah Josepha Hale. Then came Roosevelt's 1939 date change, nicknamed "Franksgiving," and the 1941 law fixing the fourth Thursday.</p>
<h2>Modern traditions</h2>
<p>The parade, the football games in Detroit and Dallas, and the presidential turkey pardon all have their own histories. They're easy questions for a family table and a way to keep the kids involved between courses.</p>
<p>For a family table, read the questions between courses and let the youngest players answer the turkey and parade questions first.</p>
<p>For the full story, read <a href="/guides/history-of-thanksgiving/">the real history of Thanksgiving</a>. Where the Wampanoag leaders' own names are recorded, we give them alongside the names the colonists used.</p>`,
    faq: [
      { q: "What's a good Thanksgiving trivia question for the dinner table?", a: "Which food was almost certainly not at the 1621 feast: pumpkin pie. The colonists had no ovens for pies and almost no sugar. Most people guess turkey instead." },
      { q: "Who made Thanksgiving a national holiday?", a: "Abraham Lincoln proclaimed it as an annual national holiday in 1863, after years of campaigning by Sarah Josepha Hale. Congress fixed the fourth Thursday in 1941." },
      { q: "Are these Thanksgiving questions accurate to the history?", a: "We based the 1621 questions on Edward Winslow's letter, the main eyewitness account, and the later history on government and museum sources listed below." },
    ],
    sources: [{ label: "Plimoth Patuxet Museums", href: "https://www.plimoth.org/" }, { label: "Smithsonian National Museum of the American Indian", href: "https://americanindian.si.edu/" }, { label: "USDA National Agricultural Statistics Service: turkeys", href: "https://www.nass.usda.gov/" }],
  },
  {
    key: "halloween", slug: "halloween-trivia", topic: "holidays", daily: false, items: HALLOWEEN,
    name: "Halloween",
    title: "Halloween Trivia: 25 Spooky Questions and Answers",
    h1: "Halloween trivia questions",
    description: "25 Halloween trivia questions with answers on the holiday's Celtic roots, classic horror books and films, jack-o'-lanterns, candy corn and Día de los Muertos.",
    lead: "Twenty-five questions on where Halloween came from, the books and films that shaped it, and the customs that go with it, from turnip lanterns to candy corn.",
    body: `<h2>From Samhain to trick-or-treat</h2>
<p>Halloween's roots run back to the Celtic festival of Samhain and to All Hallows' Eve, the night before All Saints' Day. Irish and Scottish immigrants brought customs like carved lanterns to America, where the pumpkin replaced the turnip. A few questions here trace that path.</p>
<h2>Horror classics</h2>
<p>Dracula, Frankenstein, the Headless Horseman and "The Raven" are the stories behind half our costumes. The film questions run from Bela Lugosi in 1931 to John Carpenter's Halloween and Hocus Pocus. None of the questions are gory, so the set works for a mixed-age party.</p>
<h2>A note on Día de los Muertos</h2>
<p>The Day of the Dead, on November 1 and 2, is sometimes called "Mexican Halloween," but it's a separate tradition for remembering family members who have died. We include it because people often ask about the two together, and the explanation says how they differ.</p>
<h2>A spooky round in ten minutes</h2>
<p>Pick ten questions: two on origins, four on books and films, two on customs and two from the animal and candy questions. Read them by candlelight or with the lights low, and use the samhainophobia question as a bonus for anyone who gets the word right.</p>
<p>Planning a seasonal quiz? The <a href="/guides/trivia-round-ideas/">round ideas guide</a> has a costume round, and the <a href="/thanksgiving-trivia/">Thanksgiving</a> and <a href="/christmas-trivia/">Christmas</a> sets carry the season forward.</p>`,
    faq: [
      { q: "What are good Halloween trivia questions for kids and adults together?", a: "What jack-o'-lanterns were first carved from, what a group of crows is called, and who the Pumpkin King is. None of the questions in this set are gory." },
      { q: "Where did Halloween come from?", a: "Its roots are usually traced to the Celtic festival of Samhain, combined with All Hallows' Eve, the night before the Christian feast of All Saints on November 1." },
      { q: "Is the Day of the Dead the same as Halloween?", a: "No. Día de los Muertos, celebrated in Mexico on November 1 and 2, is a separate tradition for honoring family members who have died, though the two are close in the calendar." },
    ],
    sources: [{ label: "Library of Congress: Halloween traditions", href: "https://www.loc.gov/" }, { label: "UNESCO: Indigenous festivity dedicated to the dead", href: "https://ich.unesco.org/" }, BRIT],
  },
  {
    key: "bible", slug: "bible-trivia", topic: "knowledge", daily: false, items: BIBLE,
    name: "Bible",
    title: "Bible Trivia: 30 Bible Quiz Questions and Answers for Adults",
    h1: "Bible trivia questions",
    description: "30 Bible trivia questions with answers and chapter references, from Genesis to Revelation: Noah, Moses, David, Daniel, the Gospels and the apostles.",
    lead: "Thirty questions on the people and stories of the Old and New Testaments, from Genesis to Revelation. Every answer gives the book and chapter, so you can look it up.",
    body: `<h2>How these questions are written</h2>
<p>Every answer cites the book and chapter where the story is told, so a group can open a Bible and check it. Questions stick to what the text says, not to later tradition. The Magi question, for example, notes that the Bible never says there were three wise men; the number comes from the three gifts.</p>
<h2>Which Bible we use</h2>
<p>Chapter numbers follow standard English Bibles. Where wording matters, as in the famous shortest verse ("Jesus wept," John 11:35), we name the King James Version. Where Protestant and Catholic Bibles differ, as in the number of books, the explanation gives both.</p>
<h2>For church groups and Sunday school</h2>
<ul>
<li>The Old Testament questions come first, then the Gospels and the apostles. Split the set at question 15 for two rounds.</li>
<li>Ask a team to find the verse for each answer; the fastest team gets a bonus point.</li>
<li>For a December gathering, add the nativity questions from the <a href="/christmas-trivia/">Christmas trivia</a> set.</li>
</ul>
<p>The questions that trip people up most are the ones where popular memory and the text differ: Jonah's "great fish" rather than a whale, or the Ten Commandments given on Sinai, which Deuteronomy calls Horeb. Those make good discussion questions for a study group.</p>
<p>Our guide to <a href="/guides/books-of-the-bible-in-order/">the books of the Bible in order</a> has memory tips for all 66.</p>`,
    faq: [
      { q: "Are these Bible trivia questions suitable for adults?", a: "Yes. They range from questions most people know, like who built the ark, to harder ones such as the mother of John the Baptist or the only book that never mentions God by name." },
      { q: "Which Bible translation are these answers based on?", a: "Chapters follow standard English Bibles. Where wording matters, such as the shortest verse, we name the King James Version." },
      { q: "Why do some answers mention Catholic and Protestant Bibles?", a: "Because they differ. Protestant Bibles have 66 books and Catholic Bibles have 73, so the explanation gives both rather than treating one as the only answer." },
    ],
    sources: [{ label: "Bible Gateway (KJV, NIV and other translations)", href: "https://www.biblegateway.com/" }, { label: "United States Conference of Catholic Bishops: the Bible", href: "https://bible.usccb.org/" }],
  },
  {
    key: "adults", slug: "trivia-questions-for-adults", topic: "trivia-night", daily: true, items: ADULTS,
    name: "For adults",
    title: "Trivia Questions for Adults: 25 Harder Questions With Answers",
    h1: "Trivia questions for adults",
    description: "25 harder trivia questions for adults with answers: tricky science, history, words and geography that make a strong second round at a party or pub quiz.",
    lead: "Twenty-five harder general knowledge questions for a grown-up crowd. Nothing explicit, just trickier: the kind of questions that start arguments at the table.",
    body: `<h2>What "for adults" means here</h2>
<p>When people search for trivia for adults, most want questions that aren't for kids, not questions that are explicit. So this set is harder rather than racier: the only letter missing from US state names, the country with the most time zones, the planet that rolls on its side. It works at a work party as well as a bar.</p>
<h2>Why these are harder</h2>
<p>Each question has a tempting wrong answer. Russia seems like the obvious answer for the most time zones, but France wins because of its overseas territories. Indonesia seems right for the most islands, but Sweden is the one usually cited. These are designed to make a confident team second-guess itself.</p>
<h2>How to use them in a quiz night</h2>
<p>Use this as round two or three, after the <a href="/general-knowledge-trivia/">general knowledge</a> warm-up. For a real challenge, drop the four options and let teams write answers; give half a point for close answers like "the ear" for the smallest bone. The guide to <a href="/guides/how-to-write-trivia-questions/">writing good trivia questions</a> explains how to build more questions like these.</p>
<p>A few answers come with a caveat worth sharing. Sweden's island count depends on how small a rock can be and still count, and the time-zone record depends on counting overseas territories. Saying so out loud is part of the fun: the arguments are often the best part of a hard round.</p>`,
    faq: [
      { q: "Are these trivia questions for adults explicit?", a: "No. They're harder, not adult-content. They work at an office party, a pub quiz or a family gathering with older teens." },
      { q: "What's the hardest question in this set?", a: "Which country has the most time zones. Most people say Russia, which has 11. France has 12, thanks to territories from French Polynesia to Réunion." },
      { q: "How should I score a hard trivia round for adults?", a: "Without the options, give one point for the exact answer and half a point for a close one. It keeps teams in the game when the questions get hard." },
    ],
    sources: [BRIT, { label: "The Broadway League: Internet Broadway Database", href: "https://www.ibdb.com/" }, { label: "NOAA Office for Coastal Management: shoreline mileage", href: "https://coast.noaa.gov/" }],
  },
  {
    key: "seniors", slug: "trivia-for-seniors", topic: "trivia-night", daily: true, items: SENIORS,
    name: "For seniors",
    title: "Trivia for Seniors: 25 Questions on the 1950s, 60s and 70s",
    h1: "Trivia questions for seniors",
    description: "25 trivia questions for seniors about the 1950s, 60s and 70s: TV shows, music, movies, toys, prices and events, with answers and the story behind each.",
    lead: "Twenty-five questions about the TV shows, music, films and everyday life of the 1950s through the 70s. They're as good for sharing memories as for keeping score.",
    body: `<h2>Built for remembering together</h2>
<p>Many groups play trivia less to win than to talk. These questions are about things people lived through: I Love Lucy, the Beatles on Ed Sullivan, John Glenn's orbit, five-cent stamps, Hula Hoops and TV dinners. Each answer has a line of detail that often prompts someone to say, "I remember when..."</p>
<h2>Making it easy to play</h2>
<ul>
<li>Read slowly and repeat the options. The four choices also make the game easier for anyone who prefers recognizing an answer to recalling it.</li>
<li>Play in teams so no one is on the spot alone.</li>
<li>On a tablet or large screen, use your browser's zoom; the page scales cleanly to large text.</li>
</ul>
<h2>Questions that start conversations</h2>
<p>After each answer, ask a follow-up that has no wrong answer: Where were you when you first saw the Beatles on TV? What did a TV dinner taste like the first time? Who had the first color TV on your street? The quiz gives the structure; the stories are what people remember afterwards. Activity coordinators often find that one good question can fill ten minutes.</p>
<h2>Where to go next</h2>
<p>The <a href="/music-trivia/">music trivia</a> and <a href="/movie-trivia/">movie trivia</a> sets have more from these decades, and our guide to <a href="/guides/trivia-for-seniors-guide/">running trivia for seniors</a> covers formats, pacing and prizes for community groups.</p>`,
    faq: [
      { q: "What are good trivia questions for seniors?", a: "Questions about the decades they remember best, such as 1950s TV, 1960s music and everyday prices, with multiple-choice options and a story to share after each answer." },
      { q: "Can these questions be used in a senior center or care home activity?", a: "Yes. They're free to use for activities. Read each question twice, play in teams and leave time after each answer for people to share memories." },
      { q: "Are these trivia questions only about American life?", a: "Mostly. They cover American TV, music, products and events from the 1950s to the 70s, plus a few with worldwide fame, like the Beatles." },
    ],
    sources: [{ label: "Smithsonian National Museum of American History", href: "https://americanhistory.si.edu/" }, { label: "USPS Postal History: rates", href: "https://about.usps.com/who-we-are/postal-history/" }, { label: "NASA: John Glenn and Friendship 7", href: "https://www.nasa.gov/" }],
  },
  {
    key: "nba", slug: "nba-quiz", topic: "trivia-night", daily: true, items: NBA,
    name: "NBA",
    title: "NBA Quiz: 25 Basketball Trivia Questions With Answers",
    h1: "NBA quiz",
    description: "An NBA quiz with 25 basketball trivia questions and answers on legends, records, the draft, rules and franchises, each with the story behind it.",
    lead: "Twenty-five questions on NBA legends, records, the draft and the rules of the pro game. Records that can still change are dated, so the answers stay right.",
    body: `<h2>What this NBA quiz covers</h2>
<p>The set runs from the league's founding as the Basketball Association of America in 1946 to the modern era: Wilt Chamberlain's 100-point game, Bill Russell's 11 rings, Michael Jordan's two three-peats with the Bulls and LeBron James passing Kareem Abdul-Jabbar as the all-time leading scorer. A handful of rules questions, like the length of the shot clock and the number of fouls before you're out, give casual fans a fair chance.</p>
<h2>Why some questions say "as of"</h2>
<p>NBA records move. The scoring record, the number of titles each franchise has won and the size of the league can all change, so those questions carry a date. Draft picks, historic games and retired players' careers can't change, which is why most of the set is built on them.</p>
<h2>Hardest questions in the set</h2>
<p>Most players miss the team that drafted Kobe Bryant (the Charlotte Hornets, who traded him to the Lakers on draft night) and the original name of the league. The Jerry West logo question is a good one for arguments: the league has never confirmed it, but the designer has.</p>
<h2>Using it on game night</h2>
<p>Read a question at each timeout or during halftime, and give a bonus point for naming the year. For a full sports round mixing the NBA with baseball, hockey, golf and the Olympics, see our <a href="/sports-trivia/">sports trivia</a>; for football, try the <a href="/nfl-quiz/">NFL quiz</a>.</p>`,
    faq: [
      { q: "What are good NBA trivia questions for casual fans?", a: "Questions about the biggest names and the basic rules: Michael Jordan's team, the height of the rim, the length of the shot clock. This quiz starts with those and adds harder draft and history questions." },
      { q: "Who has the most NBA championships as a player?", a: "Bill Russell, with 11 titles for the Boston Celtics in 13 seasons between 1957 and 1969." },
      { q: "Is this NBA quiz up to date?", a: "Records that can change, such as the all-time scoring leader and franchise titles, are dated 'as of 2025' and updated when they change. The rest are historical facts." },
    ],
    sources: [{ label: "NBA.com: history and records", href: "https://www.nba.com/history" }, { label: "Basketball-Reference", href: "https://www.basketball-reference.com/" }, { label: "Naismith Basketball Hall of Fame", href: "https://www.hoophall.com/" }],
  },
  {
    key: "nfl", slug: "nfl-quiz", topic: "trivia-night", daily: true, items: NFL,
    name: "NFL",
    title: "NFL Quiz: 25 Football Trivia Questions With Answers",
    h1: "NFL quiz",
    description: "An NFL quiz with 25 football trivia questions and answers on Super Bowl history, all-time records, famous plays, stadiums and the rules of the game.",
    lead: "Twenty-five questions on Super Bowl history, the league's greatest players, famous plays and how the game is scored. Built on history, so the answers don't change every season.",
    body: `<h2>From Canton to the Super Bowl</h2>
<p>The NFL began in 1920 in Canton, Ohio, as the American Professional Football Association. This quiz follows its history through the questions fans love: the 1972 Dolphins' perfect season, the Immaculate Reception, "The Catch," the Buffalo Bills' four straight Super Bowl losses and Tom Brady's seven rings.</p>
<h2>Records that hold</h2>
<p>Career records like Emmitt Smith's rushing yards and Jerry Rice's receiving yards have stood for decades, so they make reliable trivia. We leave out the current season's leaders and last year's champion, because those answers go out of date within months.</p>
<h2>Rules questions for everyone</h2>
<p>Not everyone at a party follows football closely. Questions on how many points a field goal or a safety is worth, how long the field is and how long a quarter lasts give every player a chance, and they're useful to know when you're watching.</p>
<p>Where a question names a record holder, the explanation gives the number, so a host can turn it into a closest-guess tiebreaker: how many career receiving yards did Jerry Rice finish with? (22,895.)</p>
<h2>A Super Bowl party round</h2>
<p>Read five questions during each quarter break and the rest at halftime. The Lombardi Trophy and Mr. Irrelevant questions are crowd-pleasers. For basketball, try the <a href="/nba-quiz/">NBA quiz</a>; for every other sport, the <a href="/sports-trivia/">sports trivia</a> set.</p>`,
    faq: [
      { q: "What are good NFL trivia questions for a Super Bowl party?", a: "Questions about famous moments and players: the only perfect season, Tom Brady's seven titles, the Immaculate Reception and the name of the Super Bowl trophy. All are in this quiz." },
      { q: "Which NFL team had the only perfect season?", a: "The 1972 Miami Dolphins, who went 17–0 and won Super Bowl VII." },
      { q: "How many points is a safety worth in the NFL?", a: "Two points, and the scoring team also gets the ball back on a free kick." },
    ],
    sources: [{ label: "Pro Football Hall of Fame", href: "https://www.profootballhof.com/" }, { label: "NFL.com: history", href: "https://www.nfl.com/history/" }, { label: "Pro-Football-Reference", href: "https://www.pro-football-reference.com/" }],
  },
  {
    key: "guess-movie", slug: "guess-the-movie", topic: "trivia-night", daily: true, items: MOVIES_GUESS,
    name: "Guess the movie",
    title: "Guess the Movie: 25 Movie Plots to Name, With Answers",
    h1: "Guess the movie from the plot",
    description: "A guess the movie game: read a one-line plot and name the film from four choices. Twenty-five classics from the 1970s to the 2010s, each with a fact about it.",
    lead: "Each question is a one-line plot summary. Name the film from four choices, then read a fact about how it was made. Twenty-five movies, from the 1970s to the 2010s.",
    body: `<h2>How the game works</h2>
<p>Every question describes a film in one sentence, without naming any characters you'd recognize straight away. The four choices are films from the same genre or era, so you need to know the story, not just the decade. After each answer you get one fact about the film, such as an Oscar record or how it was received.</p>
<h2>Why plots, not quotes or pictures</h2>
<p>A plot line is fair to everyone: you don't need to have memorized a quote or recognize a still. It also keeps the game original. We write every summary ourselves rather than using posters, stills or scripts.</p>
<h2>Making it harder</h2>
<ul>
<li>Read the plot without the options and give two points for a correct answer.</li>
<li>Add a point for naming the year or the lead actor.</li>
<li>Let teams write their own one-line plots for the others to guess. It's often the funniest round of the night.</li>
</ul>
<h2>What makes a plot clue fair</h2>
<p>A good clue names the situation, not the title or a famous character: "a cynical TV weatherman relives the same day" points clearly to one film without giving it away. The wrong options share the genre or the decade, so guessing from the era alone won't work.</p>
<p>For questions about famous lines, Oscar history and TV shows, play our <a href="/movie-trivia/">movie and TV trivia</a>. Holiday films are in <a href="/christmas-trivia/">Christmas trivia</a>.</p>`,
    faq: [
      { q: "How do you play guess the movie?", a: "Read a short description of a film's plot and name the film. Here you choose from four options; for a harder game, answer without them." },
      { q: "What movies are in this guess the movie quiz?", a: "Twenty well-known films from the 1970s to the 2010s, including animated films, comedies, dramas and science fiction." },
      { q: "Can I use guess the movie at a party?", a: "Yes. Read the plots aloud and let teams shout or write answers. Asking teams to write their own one-line plots makes a good extra round." },
    ],
    sources: [{ label: "Academy of Motion Picture Arts and Sciences: Oscars database", href: "https://awardsdatabase.oscars.org/" }, { label: "American Film Institute Catalog", href: "https://catalog.afi.com/" }],
  },
  {
    key: "eighties", slug: "80s-trivia", topic: "knowledge", daily: true, items: EIGHTIES,
    name: "1980s",
    title: "80s Trivia: 25 Questions on Music, Movies and Events",
    h1: "80s trivia questions",
    description: "25 80s trivia questions with answers: MTV, Pac-Man, the Rubik's Cube, Live Aid, Challenger, Top Gun and the decade's biggest songs, films and events.",
    lead: "Twenty-five questions about the decade of MTV, arcade games, Live Aid and the space shuttle. Each answer comes with the date and a detail people tend to forget.",
    body: `<h2>Pop culture and big events</h2>
<p>The 1980s questions mix the fun (Pac-Man, Cabbage Patch Kids, "Who shot J.R.?") with the events that defined the decade: the Challenger disaster, Chernobyl and the royal wedding of 1981. Music gets its own share, from the first video on MTV to Madonna, Michael Jackson's moonwalk and the charity songs of 1985.</p>
<h2>Who it's for</h2>
<p>If you grew up in the 80s, most of these will feel familiar; if you didn't, you've probably met them through remakes, reboots and a certain sequel about fighter pilots. That makes 80s trivia one of the best mixed-age rounds there is.</p>
<h2>Theming the round</h2>
<p>Play a few seconds of a song from the decade before each music question, or ask everyone to come dressed in 80s style. Ask the year questions without options for a tiebreaker.</p>
<h2>Dates worth remembering</h2>
<p>A few dates anchor the whole decade: MTV in 1981, the Macintosh in 1984, Live Aid in 1985 and the Challenger accident in 1986. If you know those four, you can place most other 80s questions before or after them, which is often enough to choose between two options.</p>
<p>Continue with <a href="/90s-trivia/">90s trivia</a>, or go further back with <a href="/trivia-for-seniors/">trivia from the 1950s to the 70s</a>.</p>`,
    faq: [
      { q: "What are good 80s trivia questions?", a: "Questions about MTV, arcade games, famous films and the decade's big events, such as Live Aid and the Challenger launch. This set mixes all of them." },
      { q: "When did MTV start?", a: "August 1, 1981. The first video it played was 'Video Killed the Radio Star' by the Buggles." },
      { q: "Is this 80s quiz good for a theme party?", a: "Yes. Pair each music question with a short song clip, and use the year questions as open-ended tiebreakers." },
    ],
    sources: [{ label: "Smithsonian National Museum of American History", href: "https://americanhistory.si.edu/" }, { label: "NASA: the Challenger accident", href: "https://www.nasa.gov/" }, BRIT],
  },
  {
    key: "nineties", slug: "90s-trivia", topic: "knowledge", daily: true, items: NINETIES,
    name: "1990s",
    title: "90s Trivia: 25 Questions on Pop Culture, Tech and Events",
    h1: "90s trivia questions",
    description: "25 90s trivia questions with answers: Nirvana, the Spice Girls, Tamagotchi, the first Harry Potter book, Y2K, Google and the decade's biggest events.",
    lead: "Twenty-five questions about the decade of grunge, boy bands, the early web and Y2K. Each answer comes with a date and a detail to share.",
    body: `<h2>The decade the internet arrived</h2>
<p>The 1990s questions follow the arrival of the modern internet, from the Netscape browser to Google's founding in a garage in 1998, along with the Y2K scare that closed the decade. Science gets its moments too: the Hubble telescope and Dolly the sheep.</p>
<h2>Pop culture</h2>
<p>Music runs from Nirvana's Nevermind to the Spice Girls, the Backstreet Boys and Britney Spears. TV covers The Fresh Prince of Bel-Air and The X-Files; toys and games include the Tamagotchi, the PlayStation and Pokémon, which began on the Game Boy.</p>
<h2>World events</h2>
<p>Nelson Mandela's release, the Channel Tunnel, the euro and the Atlanta Olympics give the set a wider view. They make good questions for players who weren't paying attention to boy bands at the time.</p>
<h2>Dates that anchor the 90s</h2>
<p>Mandela's release in 1990, the Channel Tunnel in 1994, the first Harry Potter book in 1997 and Google in 1998 make good anchors. Most other questions in the set fall neatly before or after one of them, and the explanation after each answer gives the exact year so you can build your own timeline as you play.</p>
<p>Go back a decade with <a href="/80s-trivia/">80s trivia</a>, or test your film memory with <a href="/guess-the-movie/">guess the movie</a>.</p>`,
    faq: [
      { q: "What are good 90s trivia questions?", a: "Questions about the decade's music, TV, toys and technology, from Nirvana and the Spice Girls to Tamagotchi, Pokémon and Y2K, plus big events like Mandela's release." },
      { q: "What was Y2K?", a: "A computer problem expected at the start of 2000: many programs stored years as two digits, so 2000 might be read as 1900. Large fixes meant few problems occurred." },
      { q: "Who were the five Spice Girls?", a: "Scary, Sporty, Baby, Ginger and Posh Spice." },
    ],
    sources: [{ label: "Smithsonian National Museum of American History", href: "https://americanhistory.si.edu/" }, { label: "NASA: Hubble Space Telescope", href: "https://science.nasa.gov/mission/hubble/" }, BRIT],
  },
  {
    key: "presidents", slug: "presidents-quiz", topic: "knowledge", daily: true, items: PRESIDENTS,
    name: "US presidents",
    title: "Presidents Quiz: 25 US Presidents Trivia Questions and Answers",
    h1: "US presidents quiz",
    description: "A US presidents quiz with 25 trivia questions and answers: firsts, records, money, Mount Rushmore, impeachments and fun facts about American presidents.",
    lead: "Twenty-five questions about American presidents: who's on the money, who served the shortest time, who was never elected and which two died on the same day. Every answer has the story behind it.",
    body: `<h2>Beyond the list of names</h2>
<p>Most presidents trivia starts and ends with "who was the first president." This quiz goes further: the faces on the dollar bill, the nickel and Mount Rushmore; the shortest presidency (31 days); the only president who also led the Supreme Court; the two founders who died on the same Fourth of July. These are the facts about presidents that make good stories, not just answers.</p>
<h2>Records worth knowing</h2>
<p>The record questions are the ones people argue about. Theodore Roosevelt was the youngest president, but John F. Kennedy was the youngest elected. Grover Cleveland was the first to serve two non-consecutive terms; Donald Trump is the second. Gerald Ford is the only president never elected to either the presidency or the vice presidency. Where a record could still change, like the longest-lived president, the question is dated.</p>
<p>Money questions are reliable warm-ups: Washington is on the $1 bill, Jefferson on the nickel and Lincoln on the penny. They give everyone at the table an early point before the harder records.</p>
<h2>Practicing the order</h2>
<p>This quiz is about facts rather than sequence. To learn the order itself, use our guide to <a href="/guides/us-presidents-in-order/">the presidents in order</a>, which groups all 47 presidencies by era, then come back and test yourself here. More presidents questions are in the <a href="/history-trivia/">history trivia</a> set.</p>`,
    faq: [
      { q: "What are some fun facts about US presidents?", a: "John Adams and Thomas Jefferson died on the same day, July 4, 1826; William Howard Taft later became Chief Justice; and Gerald Ford was never elected president or vice president." },
      { q: "Who was the youngest US president?", a: "Theodore Roosevelt, who was 42 when he took office in 1901. John F. Kennedy, at 43, was the youngest person elected president." },
      { q: "Which presidents are on Mount Rushmore?", a: "George Washington, Thomas Jefferson, Theodore Roosevelt and Abraham Lincoln, carved between 1927 and 1941." },
    ],
    sources: [{ label: "The White House: Presidents", href: "https://www.whitehouse.gov/about-the-white-house/presidents/" }, { label: "White House Historical Association", href: "https://www.whitehousehistory.org/" }, { label: "National Park Service: Mount Rushmore", href: "https://www.nps.gov/moru/" }],
  },
  {
    key: "space", slug: "space-trivia", topic: "knowledge", daily: true, items: SPACE,
    name: "Space",
    title: "Space Trivia: 25 Space Quiz Questions With Answers",
    h1: "Space trivia questions",
    description: "25 space trivia questions with answers: astronauts and firsts, moons and planets, the Milky Way, telescopes and missions, each explained and checked against NASA.",
    lead: "Twenty-five questions about the people, planets and spacecraft of space exploration, from Yuri Gagarin and Laika to Voyager 1 and the James Webb Space Telescope.",
    body: `<h2>People and firsts</h2>
<p>Space history is full of firsts that make great trivia: the first person in space, the first woman, the first animal to orbit Earth, the lunar module that landed in 1969. The explanations add the detail that usually comes up as a follow-up, like how long Gagarin's flight lasted or which two dogs were the first to come home alive.</p>
<h2>Planets, moons and how the sky works</h2>
<p>The rest of the set covers the solar system beyond the basics in our <a href="/science-trivia/">science trivia</a>: the largest moon, the planet with the shortest day, the one found by calculation before anyone saw it, and what really causes the Moon's phases. That last one is the question people most often get wrong, because it's easy to confuse phases with eclipses.</p>
<p>Records about space keep changing as missions fly and telescopes find new moons, so we only ask about things that are settled: who went first, what a mission was called, how the planets move.</p>
<h2>Using it in class or at a quiz night</h2>
<p>For a space round, pair these questions with the space section of our <a href="/fun-facts/">fun facts</a>, which has tiebreakers like Saturn floating in water. The guide to <a href="/guides/planets-in-order/">the planets in order</a> has a table of sizes, distances and moon counts for anyone who wants to study first.</p>`,
    faq: [
      { q: "What are good space trivia questions?", a: "Questions about famous firsts, such as the first person and first woman in space, mixed with planet facts like the largest moon and the planet with the shortest day. This set has both." },
      { q: "Who was the first person in space?", a: "Yuri Gagarin of the Soviet Union, who orbited Earth once on April 12, 1961, in a flight of 108 minutes." },
      { q: "What is the farthest spacecraft from Earth?", a: "Voyager 1, launched in 1977. It entered interstellar space in 2012 and is still sending back data." },
    ],
    sources: [{ label: "NASA Science", href: "https://science.nasa.gov/" }, { label: "NASA History Office", href: "https://www.nasa.gov/history/" }, { label: "European Space Agency", href: "https://www.esa.int/" }],
  },
  {
    key: "animals", slug: "animal-trivia", topic: "knowledge", daily: true, items: ANIMALS,
    name: "Animals",
    title: "Animal Trivia: 25 Animal Quiz Questions and Answers",
    h1: "Animal trivia questions",
    description: "25 animal trivia questions and answers: record-breaking animals, baby and group names, strange abilities and diets, each with a fact about the animal behind it.",
    lead: "Twenty-five questions about the tallest, fastest and strangest animals, what their babies and groups are called, and what they really eat. Each answer adds one more fact worth sharing.",
    body: `<h2>Records, names and odd abilities</h2>
<p>Animal trivia works for every age because the answers are surprising but easy to remember: the bird that flies backward, the mammals that lay eggs, the animal with eyes the size of a soccer ball. We've mixed records (tallest, fastest in a dive, longest pregnancy) with name questions (a joey, a pack, a parliament) and questions about diets and bodies.</p>
<h2>Easy, medium and hard</h2>
<p>The first questions suit younger players and warm-up rounds; the later ones, like the colossal squid's eyes or the pangolin's scales, catch out adults who think they know animals well. For a family game, let children answer the easy ones aloud and adults take the rest.</p>
<h2>Where the facts come from</h2>
<p>Every answer was checked against a zoo, aquarium, museum or wildlife organization. Popular "facts" that turn out to be wrong, such as ostriches burying their heads, are left out of the quiz and explained in our guide to <a href="/guides/common-trivia-myths/">popular facts that are wrong</a>.</p>
<h2>More animals</h2>
<p>Curious which animal matches your personality? Try the <a href="/spirit-animal-quiz/">spirit animal quiz</a>.</p>
<p>Octopuses, cheetahs, blue whales and bats appear in our <a href="/science-trivia/">science trivia</a>, and the animals section of the <a href="/fun-facts/">fun facts</a> page has random animal facts with sources, from cube-shaped wombat droppings to sea otters holding paws. Use them as tiebreakers or as a true-or-false round.</p>`,
    faq: [
      { q: "What are some easy animal trivia questions?", a: "What a baby kangaroo is called (a joey), how many legs a spider has (eight) and which animal is the tallest (the giraffe) are good warm-ups." },
      { q: "Which mammals lay eggs?", a: "The platypus and the echidnas, a group called monotremes. They live in Australia and New Guinea." },
      { q: "What is the fastest animal on Earth?", a: "In a hunting dive, the peregrine falcon, at over 300 km/h. On land, the cheetah is fastest in short sprints." },
    ],
    sources: [{ label: "Smithsonian's National Zoo", href: "https://nationalzoo.si.edu/" }, { label: "San Diego Zoo Wildlife Alliance", href: "https://animals.sandiegozoo.org/" }, { label: "National Geographic: Animals", href: "https://www.nationalgeographic.com/animals/" }],
  },
  {
    key: "easter", slug: "easter-trivia", topic: "holidays", daily: false, items: EASTER,
    name: "Easter",
    title: "Easter Trivia: 25 Easter Questions and Answers",
    h1: "Easter trivia questions",
    description: "25 Easter trivia questions and answers: how the date is set, the Easter Bunny and egg roll, Lent and Holy Week, and Easter traditions from around the world.",
    lead: "Twenty-five questions on why Easter moves every year, where the Easter Bunny came from, the days of Holy Week and how the holiday is celebrated from Sweden to Australia.",
    body: `<h2>Why Easter moves</h2>
<p>Easter falls on a different date every year because it follows the Moon: in Western churches it's the first Sunday after the first full moon on or after March 21, which puts it anywhere from March 22 to April 25. Orthodox churches use the same rule on the Julian calendar, which is why their Easter is often later. Several questions in this set are built on that rule, and they make good questions for adults who think they already know the holiday.</p>
<h2>Customs old and new</h2>
<p>The rest of the set covers the traditions: the German Easter hare that became the Easter Bunny, the White House Easter Egg Roll, hot cross buns, Fabergé eggs, Easter witches in Sweden and the Easter Bilby in Australia. There are also questions on Holy Week itself, from Palm Sunday to Maundy Thursday and Good Friday.</p>
<p>Two dates to remember for a tiebreaker: Easter can be as early as March 22 and as late as April 25. Ask teams to guess the latest possible date; closest answer wins.</p>
<h2>For church groups and families</h2>
<p>Split the set into a "Holy Week" round and a "traditions" round of ten each. For more questions drawn from the Gospels, see <a href="/bible-trivia/">Bible trivia</a>; for the year's other holidays, try <a href="/thanksgiving-trivia/">Thanksgiving</a> and <a href="/christmas-trivia/">Christmas</a> trivia.</p>`,
    faq: [
      { q: "Why does the date of Easter change every year?", a: "Western churches celebrate Easter on the first Sunday after the first full moon on or after March 21, so the date moves between March 22 and April 25." },
      { q: "Where did the Easter Bunny come from?", a: "From German tradition. German settlers brought the Osterhase, an egg-laying hare, to Pennsylvania in the 1700s." },
      { q: "Are these Easter trivia questions good for church groups?", a: "Yes. About half the questions are about Holy Week and the meaning of Easter, and the rest cover traditions families and children enjoy." },
    ],
    sources: [{ label: "Encyclopaedia Britannica: Easter", href: "https://www.britannica.com/topic/Easter-holiday" }, { label: "White House Historical Association: Easter Egg Roll", href: "https://www.whitehousehistory.org/" }, { label: "Royal Observatory Greenwich: when is Easter?", href: "https://www.rmg.co.uk/" }],
  },
  {
    key: "black-history", slug: "black-history-trivia", topic: "knowledge", daily: false, items: BLACK_HISTORY,
    name: "Black history",
    title: "Black History Trivia: 25 Questions and Answers",
    h1: "Black history trivia questions",
    description: "25 Black history trivia questions with answers for Black History Month: civil rights milestones, firsts in science, sports, politics and the arts, each explained.",
    lead: "Twenty-five questions about the people and turning points of African American history, from Harriet Tubman and Frederick Douglass to Thurgood Marshall, Katherine Johnson and Juneteenth.",
    body: `<h2>What this set covers</h2>
<p>The questions follow American history from the Underground Railroad through Reconstruction, the Harlem Renaissance, the civil rights movement and the space program. Alongside the best-known names there are people every quiz should include more often: Claudette Colvin, Shirley Chisholm, Guion Bluford, Ralph Bunche and Madam C. J. Walker.</p>
<h2>How we wrote it</h2>
<p>Each answer was checked against the Smithsonian's National Museum of African American History and Culture, the Library of Congress or the National Archives. Where a "first" depends on how it's defined, the explanation says so, as with Claudette Colvin's protest nine months before Rosa Parks's.</p>
<h2>From well-known names to deeper cuts</h2>
<p>The set starts with names most people know, such as Rosa Parks, Harriet Tubman and Jesse Owens, and moves to questions that reward wider reading: the first African American astronaut, the first Black woman in Congress and the Nobel laureate who negotiated the 1949 armistice. Every explanation adds a date or detail that helps the answer stick.</p>
<h2>Using it for Black History Month</h2>
<p>Black History Month began as Negro History Week in 1926 and is observed every February. Read one question a day during the month in a classroom or at work, or use all twenty as a single round. For broader US history, try our <a href="/history-trivia/">history trivia</a> and <a href="/presidents-quiz/">presidents quiz</a>.</p>`,
    faq: [
      { q: "When is Black History Month?", a: "February in the United States and Canada. It grew out of Negro History Week, created by historian Carter G. Woodson in 1926, and was first officially recognized by President Gerald Ford in 1976." },
      { q: "What are good Black History Month trivia questions for work or school?", a: "Questions about civil rights milestones and notable firsts, such as Thurgood Marshall on the Supreme Court or Katherine Johnson at NASA. This set has twenty, each with a short explanation." },
      { q: "What is Juneteenth?", a: "June 19, which marks the day in 1865 when Union troops announced the end of slavery in Galveston, Texas. It became a federal holiday in 2021." },
    ],
    sources: [{ label: "Smithsonian National Museum of African American History and Culture", href: "https://nmaahc.si.edu/" }, { label: "Library of Congress: African American History Month", href: "https://www.africanamericanhistorymonth.gov/" }, { label: "National Archives: Black history", href: "https://www.archives.gov/research/african-americans" }],
  },
  {
    key: "pop-culture", slug: "pop-culture-trivia", topic: "trivia-night", daily: true, items: POP_CULTURE,
    name: "Pop culture",
    title: "Pop Culture Trivia: 25 Fun Modern Questions With Answers",
    h1: "Pop culture trivia questions",
    description: "25 fun pop culture trivia questions and answers: hit TV series, chart-topping music, blockbuster films, streaming moments and viral internet culture, all explained.",
    lead: "Twenty-five questions covering viral internet moments, binge-worthy streaming hits, iconic movie quotes, and Grammy-winning pop anthems. Play online or read them out at your next trivia night.",
    body: `<h2>Television, streaming and viral hits</h2>
<p>Modern pop culture moves at lightspeed, but some moments anchor our shared memory. This round highlights the binge-worthy sensations that defined modern television: Stranger Things in Hawkins, Indiana; Michael Scott's antics at Dunder Mifflin in The Office; Walter White's alter ego in Breaking Bad; and the high-stakes world of Westeros in Game of Thrones. Internet milestones like the very first video uploaded to YouTube in 2005 and viral phenomenons like Wordle test your recall of the digital landscape.</p>
<h2>Music charts and blockbuster cinema</h2>
<p>From Beyoncé's historic tally of Grammy Awards to the worldwide stadium roar of Taylor Swift's Eras Tour, music trivia brings energy to any gathering. We balance streaming chart-toppers with cinematic powerhouses: James Cameron's Avatar, the cultural sensation of 2023's Barbie, the Marvel Cinematic Universe's defining climax in Avengers: Endgame, and Bong Joon-ho's groundbreaking Academy Award sweep with Parasite.</p>
<h2>Tips for running a pop culture round</h2>
<p>Pop culture is the ultimate equalizer at a quiz night because it connects generations. Younger players will instantly recognize viral TikTok and YouTube trivia, while older participants bring deep knowledge of classic 90s sitcoms and iconic movie releases. Read the question clearly, give teams 30 seconds to deliberate, and follow up each reveal with the fascinating context provided in the explanation.</p>
<p>Looking to explore specific eras? Dive into our dedicated <a href="/80s-trivia/">80s trivia</a>, <a href="/90s-trivia/">90s trivia</a>, or test your film knowledge with <a href="/guess-the-movie/">guess the movie</a>.</p>`,
    faq: [
      { q: "What eras does this pop culture trivia quiz cover?", a: "This set focuses predominantly on modern pop culture from the 1990s through the 2020s, featuring milestone moments across streaming television, blockbuster films, viral internet sensations, and Billboard chart-toppers." },
      { q: "How should I score a pop culture trivia round?", a: "Award one standard point per correct answer. For questions with multiple elements, such as identifying both a show and a fictional setting, consider offering a bonus point or using it as a tiebreaker." },
      { q: "Are these pop culture questions suitable for family game nights?", a: "Yes. Every question has been curated to be clean, fun, and accessible for mixed-age gatherings, from teenagers who know viral social media trends to adults who followed 2000s television." },
    ],
    sources: [BRIT, { label: "Billboard Charts & Archives", href: "https://www.billboard.com/charts/" }, { label: "Oscars Official Database", href: "https://awardsdatabase.oscars.org/" }],
  },
  {
    key: "family", slug: "family-trivia", topic: "trivia-night", daily: true, items: FAMILY,
    name: "Family trivia",
    title: "Family Trivia: 25 Fun Questions for Game Night",
    h1: "Family trivia questions",
    description: "25 fun family trivia questions and answers for game night: board games, nature, space, everyday science, folklore and food, each with a full explanation.",
    lead: "Twenty-five questions designed for family game night, living room quiz battles and road trips. Accessible for all ages without feeling dumbed down.",
    body: `<h2>Multi-generational questions for living room play</h2>
<p>Family trivia works best when no single player dominates because of an age advantage. Instead of leaning heavily on obscure historical dates or contemporary social media slang, this set builds on common ground: beloved board games, curious nature facts, classic animated films and everyday phenomena that spark lively discussion around the kitchen table or on long road trips.</p>
<p>Every question offers four plausible choices and a memorable explanation. When a player learns why green Haribo gummy bears taste like strawberry, or discovers that apples float because a quarter of their volume is air, the round transforms from a dry test into an entertaining family discovery.</p>
<h2>Board games, curious science and shared memories</h2>
<p>This collection pulls from experiences almost every household shares: rolling dice in Monopoly, managing card trades in Uno, or placing letter tiles in Scrabble. We complement tabletop nostalgia with intriguing science and world wonders, including the mysterious sideways spin of Uranus, the astonishing reverse flight of hummingbirds, and the extraordinary depths of the Mariana Trench.</p>
<h2>Hosting a balanced family game night</h2>
<p>To run a fun and competitive session, consider dividing your group into mixed-generation pairs—pairing grandparents with grandchildren or siblings on opposite teams. Read each question aloud twice before revealing the four multiple-choice options. Allow 30 seconds for whispered deliberation, and award one point for each correct answer. Read the one-line explanation after scoring each round; it frequently leads into fun personal stories from family members.</p>
<p>Ready to try other themed rounds? Check out our <a href="/general-knowledge-trivia/">general knowledge trivia</a> for classic quiz night standards, test your knowledge with <a href="/animal-trivia/">animals trivia</a>, or explore <a href="/pop-culture-trivia/">pop culture trivia</a>.</p>`,
    faq: [
      { q: "How do you keep family trivia fair for players of different ages?", a: "Mix age groups by forming two-player teams pairing older players with younger participants. This ensures everyone contributes their strengths, from classic cinema knowledge to modern nature facts." },
      { q: "Can we play these family trivia questions in teams?", a: "Yes. Grouping into small teams makes the game much more collaborative. Have teams write answers down on scratch paper before revealing explanations to prevent shouting out answers early." },
      { q: "Are these family trivia questions suitable for holiday gatherings?", a: "Absolutely. The questions avoid overly specialized academic trivia in favor of engaging, universally interesting topics that spark conversation across generations at Thanksgiving, Christmas, or summer reunions." },
    ],
    sources: [BRIT, { label: "Smithsonian Institution", href: "https://www.si.edu/" }, { label: "National Geographic", href: "https://www.nationalgeographic.com/" }],
  },
  {
    key: "disney", slug: "disney-trivia", topic: "trivia-night", daily: true, items: DISNEY,
    name: "Disney trivia",
    title: "Disney Trivia: 25 Animated Film and Theme Park Questions",
    h1: "Disney trivia questions",
    description: "25 Disney trivia questions with answers: classic animated films, Disney Renaissance hits, Pixar favorites, theme parks and memorable songs, all fully explained.",
    lead: "Twenty-five questions covering a century of Disney storytelling, from Golden Age animation and 90s Renaissance anthems to modern adventures and legendary theme parks.",
    body: `<h2>A century of classic hand-drawn and computer animation</h2>
<p>Disney's animated catalog spans over eight decades, from early innovations like Pinocchio and Cinderella to 1990s Renaissance masterpieces such as The Little Mermaid, Aladdin, and The Lion King. Modern computer-animated landmarks from Walt Disney Animation Studios and Pixar continue to expand that universe with films like Tangled, Moana, Finding Nemo, and Monsters, Inc.</p>
<p>Every question on this page focuses on genuine plot points, unforgettable character dynamics, and behind-the-scenes milestones rather than trivial background frame details. Knowing that Rapunzel relies on a trusty frying pan, or that Phil Collins wrote and recorded Tarzan's soundtrack in multiple world languages, makes each reveal entertaining for casual fans and dedicated Disney enthusiasts alike.</p>
<h2>From silver screen legends to iconic theme parks</h2>
<p>Disney trivia extends beyond the cinema screen into real-world landmarks. Walt Disney opened his original dream park in Anaheim, California, in 1955, followed by Florida's sprawling Walt Disney World in 1971 with the magnificent Cinderella Castle as its focal point. Our questions explore both the beloved animated stories and the real-world spaces where generations have made family memories.</p>
<h2>How to run a Disney round at your trivia night</h2>
<p>Disney rounds are exceptionally popular at pub quizzes, family game nights, and birthday parties because participants of all ages recognize the songs and characters. For a lively party round, read each question aloud twice before presenting the four multiple-choice options. Give teams 30 seconds to lock in their guesses, and always read the host explanation after revealing the right answer. The background context sparks immediate nostalgic conversations across the room.</p>
<p>Looking for more themed quiz material? Explore our <a href="/pop-culture-trivia/">pop culture trivia</a>, play through <a href="/movie-trivia/">movie trivia</a>, or test your musical knowledge with <a href="/music-trivia/">music trivia</a>.</p>`,
    faq: [
      { q: "What eras of Disney are included in these trivia questions?", a: "The set spans the Golden Age of animation in the 1930s and 1940s, the Silver Age classics, the blockbuster 1990s Renaissance, modern 3D features, and classic theme park history." },
      { q: "Can children and adults play this Disney quiz together?", a: "Yes. The questions are designed for mixed-age play, balancing nostalgic classics that parents grew up with alongside modern favorites that younger players know by heart." },
      { q: "How many questions should I use for a Disney themed round?", a: "A standard trivia round typically uses 10 to 12 questions. With 25 questions available here, you can pick your favorites or run two full Disney rounds." },
    ],
    sources: [BRIT, { label: "The Walt Disney Archives", href: "https://d23.com/walt-disney-archives/" }, { label: "Oscars Official Database", href: "https://awardsdatabase.oscars.org/" }],
  },
  {
    key: "two-thousands", slug: "2000s-trivia", topic: "trivia-night", daily: true, items: TWO_THOUSANDS,
    name: "2000s trivia",
    title: "2000s Trivia: 25 Pop Culture, Tech and Music Questions",
    h1: "2000s trivia questions",
    description: "25 trivia questions from the 2000s with answers: iPods, MySpace, Oscar-winning movies, Billboard chart-toppers, TV hits and memorable sports moments, explained.",
    lead: "Twenty-five questions revisiting the first decade of the 21st century: the rise of MP3 players and social media, peak reality TV, blockbuster movie franchises and chart-topping hits.",
    body: `<h2>The digital revolution that reshaped everyday life</h2>
<p>The 2000s marked a pivotal bridge between the analog past and our connected mobile future. In 2001, Apple launched the original mechanical-scroll-wheel iPod, promising a thousand songs in your pocket, while Wikipedia debuted as a free collaborative experiment that changed how the world accesses knowledge. Floppy disks vanished as USB flash thumb drives arrived, and social networking took off globally through MySpace's HTML profile pages and coveted Top 8 friend lists.</p>
<p>Capturing this technological transformation makes 2000s trivia uniquely relatable. Everyone remembers the hum of a PlayStation 2 booting up on a Friday night, burning MP3 playlists onto CD-R discs, or watching Pluto get controversial demoted from planet status by the International Astronomical Union in 2006.</p>
<h2>Peak television, blockbuster cinema and Billboard anthems</h2>
<p>Entertainment in the 2000s delivered cultural touchstones that defined a generation. Viewers gathered weekly for the real-time suspense of 24, the island enigmas of Lost, and the summer frenzy of Survivor. At movie theaters, Peter Jackson's The Lord of the Rings: The Return of the King swept eleven Oscars, while Captain Jack Sparrow transformed Pirates of the Caribbean into a cinematic juggernaut. On radio stations and MTV, Britney Spears, Eminem, Outkast, and Beyoncé dominated the charts.</p>
<h2>Hosting an authentic 2000s quiz night</h2>
<p>To run a memorable 2000s theme night, encourage players to dress in era-appropriate fashion—from velour tracksuits to layered graphic tees. Play 2000s pop and hip-hop hits as background music between rounds. Read each question clearly, provide the four multiple-choice options, and allow 30 seconds for teams to deliberate. After collecting score sheets, read out the one-line host explanations to spark instant debates and fond memories of flip phones and dial-up internet.</p>
<p>Pair this set with our <a href="/90s-trivia/">90s trivia questions</a> and <a href="/80s-trivia/">80s trivia questions</a> for a complete multi-decade trivia showdown, or explore our <a href="/pop-culture-trivia/">pop culture trivia</a> for modern trends.</p>`,
    faq: [
      { q: "What makes 2000s trivia so popular for theme parties?", a: "The 2000s represents a sweet spot of nostalgia for millennials and Gen Z, featuring iconic early tech innovations, viral television shows, and chart-topping radio anthems everyone recognizes." },
      { q: "Which topics dominate 2000s trivia rounds?", a: "The strongest categories include early digital technology like iPods and MySpace, blockbuster cinematic trilogies like Lord of the Rings, peak reality television, and mainstream pop and hip-hop hits." },
      { q: "Can younger players who didn't grow up in the 2000s answer these questions?", a: "Yes. Because 2000s movies, music, and gaming franchises remain massive streaming and cultural staples today, most players know key milestones regardless of age." },
    ],
    sources: [BRIT, { label: "Billboard Charts & Archives", href: "https://www.billboard.com/charts/" }, { label: "Internet Movie Database (IMDb)", href: "https://www.imdb.com/" }],
  },
];

export const CAT_BY_KEY = Object.fromEntries(CATS.map((c) => [c.key, c]));

// Stable question ids: the category key plus the question's position.
// Never reorder existing questions; add new ones at the end.
export function questionsOf(cat) {
  return cat.items.map(([q, choices, why], i) => ({ id: `${cat.key}-${i + 1}`, cat: cat.key, q, choices, why }));
}

const hash = (s) => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0, 2166136261);
/** Choices shuffled deterministically from the id, so the answer isn't always first. */
export function shuffled(item) {
  let x = hash(item.id) || 1;
  const next = () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; };
  const order = [0, 1, 2, 3];
  for (let i = 3; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  return { ...item, choices: order.map((i) => item.choices[i]), answer: order.indexOf(0) };
}

export const ALL_QUESTIONS = CATS.flatMap((c) => questionsOf(c));
export const DAILY_POOL = CATS.filter((c) => c.daily).flatMap((c) => questionsOf(c)).map(shuffled);
