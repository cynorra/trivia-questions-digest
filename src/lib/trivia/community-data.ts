export interface CommunityQuestion {
  q: string;
  choices: [string, string, string, string];
  answer: number; // 0, 1, 2, or 3
  why: string;
}

export interface CommunityQuiz {
  id: string;
  title: string;
  creator: string;
  tag: string;
  description: string;
  createdAt: string;
  questions: CommunityQuestion[];
  isFeatured?: boolean;
}

export const FEATURED_COMMUNITY_QUIZZES: CommunityQuiz[] = [
  {
    id: "cartoons-90s",
    title: "90s Saturday Morning Cartoons",
    creator: "RetroFan90",
    tag: "Nostalgia & TV",
    description: "Classic animated favorites from Nickelodeon, Cartoon Network, and the Disney Afternoon.",
    createdAt: "2026-11-05",
    isFeatured: true,
    questions: [
      {
        q: "In Rugrats, what is Tommy Pickles' signature tool secretly stored in his diaper?",
        choices: ["A plastic screwdriver", "A baby bottle", "A yellow pacifier", "A wooden spoon"],
        answer: 0,
        why: "Tommy famously used his toy screwdriver to unlock playpens and doors, leading the babies on countless backyard adventures.",
      },
      {
        q: "What are the names of the three zany Warner siblings in Animaniacs?",
        choices: ["Yakko, Wakko, and Dot", "Buster, Babs, and Plucky", "Huey, Dewey, and Louie", "Ed, Edd, and Eddy"],
        answer: 0,
        why: "Yakko, Wakko, and their sister Dot lived in the Warner Bros. water tower on the studio lot in Burbank.",
      },
      {
        q: "In the animated series Doug, what is the name of Doug Funnie's loyal, human-like dog?",
        choices: ["Porkchop", "Snoopy", "Spike", "Odie"],
        answer: 0,
        why: "Porkchop lived in an igloo-shaped doghouse, walked on two legs, and even listened to headphone music alongside Doug.",
      },
      {
        q: "In The Magic School Bus, what is the name of eccentric teacher Ms. Frizzle's class pet lizard?",
        choices: ["Liz", "Sammy", "Rex", "Yoshi"],
        answer: 0,
        why: "Liz is a Jackson's chameleon who often helped Ms. Frizzle drive the bus and operate scientific instruments.",
      },
      {
        q: "Which superhero duck protects the city of Saint Canard with the catchphrase \"Let's get dangerous\"?",
        choices: ["Darkwing Duck", "Mighty Mouse", "Danger Mouse", "Captain Underpants"],
        answer: 0,
        why: "Voiced by Jim Cummings, Darkwing Duck (Drake Mallard) fought crimes with his sidekick Launchpad McQuack and daughter Gosalyn.",
      },
    ],
  },
  {
    id: "coffee-culture",
    title: "Coffee & Cafe Culture Quiz",
    creator: "BaristaAlex",
    tag: "Food & Drink",
    description: "Test your knowledge on espresso brewing, coffee origin myths, and cafe traditions worldwide.",
    createdAt: "2026-11-04",
    isFeatured: true,
    questions: [
      {
        q: "What Italian word translates to \"stained\" or \"marked\", referring to espresso with a small dash of milk?",
        choices: ["Macchiato", "Cortado", "Cappuccino", "Affogato"],
        answer: 0,
        why: "Caffè macchiato means 'stained coffee' in Italian, because the dark espresso crema is lightly marked with a dollop of steamed milk foam.",
      },
      {
        q: "Which country is historically celebrated as the original birthplace of wild Arabica coffee plants?",
        choices: ["Ethiopia", "Brazil", "Colombia", "Vietnam"],
        answer: 0,
        why: "According to historical lore, an Ethiopian goat herder named Kaldi first noticed his goats dancing after chewing bright red coffee cherries in the Kaffa region.",
      },
      {
        q: "What is the primary difference between a classic Australian flat white and a traditional cafe latte?",
        choices: ["A flat white has a higher espresso ratio with silky microfoam", "A flat white uses cold skim milk instead of whole milk", "A flat white is sweetened with natural caramel syrup", "A flat white is brewed exclusively using a French press"],
        answer: 0,
        why: "A flat white blends a double shot of espresso with thin, velvety microfoam without the thick stiff foam head found on a latte or cappuccino.",
      },
      {
        q: "Which natural decaffeination technique uses only water, temperature, and carbon filters without chemical solvents?",
        choices: ["The Swiss Water Process", "The Direct Solvent Method", "The Ethyl Acetate Wash", "The Supercritical Nitrogen Bath"],
        answer: 0,
        why: "Developed in Schaffhausen, Switzerland, the 100% chemical-free Swiss Water Process removes 99.9% of caffeine while preserving delicate bean flavors.",
      },
      {
        q: "Which European country officially consumes the most coffee per capita in the world, averaging nearly four cups a day?",
        choices: ["Finland", "Italy", "United States", "France"],
        answer: 0,
        why: "According to International Coffee Organization data, Finns consume roughly 12 kilograms (26 pounds) of coffee per person every single year.",
      },
    ],
  },
  {
    id: "classic-gaming",
    title: "Video Game Classics: 8-Bit to 64-Bit",
    creator: "PixelMaster",
    tag: "Gaming",
    description: "From the golden age of arcades to legendary consoles like NES, SNES, Genesis, and Nintendo 64.",
    createdAt: "2026-11-03",
    isFeatured: true,
    questions: [
      {
        q: "What was Mario's original profession and name in the 1981 arcade blockbuster Donkey Kong?",
        choices: ["A carpenter named Jumpman", "A plumber named Mario", "A delivery boy named Luigi", "An acrobat named Pauline"],
        answer: 0,
        why: "Shigeru Miyamoto originally named the protagonist Jumpman, depicting him as a carpenter working on high-rise building girders before renaming him Mario.",
      },
      {
        q: "Which legendary cheat sequence began with: Up, Up, Down, Down, Left, Right, Left, Right, B, A?",
        choices: ["The Konami Code", "The Capcom Combo", "The Sega Secret", "The Nintendo Master Key"],
        answer: 0,
        why: "Created by Kazuhisa Hashimoto for Gradius on the NES in 1986, the Konami Code famously granted thirty extra lives in the action game Contra.",
      },
      {
        q: "Which 1996 title set the industry standard for 3D camera controls and analog 360-degree character movement?",
        choices: ["Super Mario 64", "Crash Bandicoot", "Tomb Raider", "Spyro the Dragon"],
        answer: 0,
        why: "Super Mario 64 revolutionized gaming by freeing players to roam in full 3D space with an intuitive dynamic Lakitu camera and analog thumbstick controls.",
      },
      {
        q: "What is the name of the spiky-haired former SOLDIER protagonist in the 1997 RPG Final Fantasy VII?",
        choices: ["Cloud Strife", "Squall Leonhart", "Tidus", "Zidane Tribal"],
        answer: 0,
        why: "Cloud Strife wields the iconic massive Buster Sword as a mercenary hired by the eco-terrorist resistance group AVALANCHE in Midgar.",
      },
      {
        q: "What color is the Master Chief's iconic MJOLNIR Spartan armor throughout the Halo franchise?",
        choices: ["Olive green", "Midnight navy blue", "Desert sand tan", "Matte gunmetal black"],
        answer: 0,
        why: "Master Chief Petty Officer John-117 wears distinctive olive-green powered assault armor paired with an iridescent golden reflective face visor.",
      },
    ],
  },
  {
    id: "quirky-geography",
    title: "World Geography: Quirky Borders & Islands",
    creator: "GeoWanderer",
    tag: "Geography",
    description: "Enclaves, unusual borders, non-rectangular flags, and geographic trivia that surprises most players.",
    createdAt: "2026-11-02",
    isFeatured: true,
    questions: [
      {
        q: "Which independent mountain kingdom is completely surrounded as an enclave within South Africa?",
        choices: ["Lesotho", "Eswatini", "Botswana", "Namibia"],
        answer: 0,
        why: "Known as the 'Kingdom in the Sky', Lesotho is an independent nation entirely encircled by the territory of South Africa, with its lowest point over 1,400 meters high.",
      },
      {
        q: "What is the only official national flag in the modern world that is not quadrilateral (four-sided)?",
        choices: ["Nepal", "Switzerland", "Vatican City", "Sri Lanka"],
        answer: 0,
        why: "Nepal's flag is formed by two stacked pennant triangles symbolizing the Himalayan mountains and the nation's two primary religions, Hinduism and Buddhism.",
      },
      {
        q: "Which two sovereign nations share the longest international land border on Earth, spanning 5,525 miles?",
        choices: ["Canada and the United States", "Russia and China", "Chile and Argentina", "India and Bangladesh"],
        answer: 0,
        why: "The border between Canada and the United States stretches 8,891 kilometers (5,525 miles), including the boundary between Alaska and the Yukon.",
      },
      {
        q: "What autonomous Danish territory is recognized as the largest non-continental island in the world?",
        choices: ["Greenland", "Madagascar", "Borneo", "Baffin Island"],
        answer: 0,
        why: "Spanning over 2.16 million square kilometers, Greenland is the world's largest island, mostly covered by a massive continental ice sheet.",
      },
      {
        q: "Which historic metropolis spans across two distinct continents—Europe and Asia—divided by a maritime strait?",
        choices: ["Istanbul", "Cairo", "Tbilisi", "Baku"],
        answer: 0,
        why: "Istanbul straddles the Bosphorus Strait in Turkey, connecting the Black Sea to the Sea of Marmara and serving as a historical bridge between East and West.",
      },
    ],
  },
];

/** Encodes a custom quiz object into a safe, portable base64 string for URL hash sharing */
export function encodeQuizToHash(quiz: CommunityQuiz): string {
  try {
    const json = JSON.stringify(quiz);
    const bytes = new TextEncoder().encode(json);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (err) {
    console.error("Failed to encode quiz to hash", err);
    return "";
  }
}

/** Decodes a custom quiz from a URL hash string */
export function decodeQuizFromHash(hash: string): CommunityQuiz | null {
  try {
    let clean = hash.replace(/^[#?]/, "").replace(/^quiz=/, "").trim();
    if (!clean) return null;
    clean = clean.replace(/-/g, "+").replace(/_/g, "/");
    while (clean.length % 4 !== 0) clean += "=";
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json);
    if (data && typeof data === "object" && data.title && Array.isArray(data.questions) && data.questions.length > 0) {
      return data as CommunityQuiz;
    }
    return null;
  } catch (err) {
    console.error("Failed to decode quiz from hash", err);
    return null;
  }
}

const STORAGE_KEY = "tqd_custom_quizzes";

/** Loads user-saved custom quizzes from browser localStorage */
export function loadUserQuizzes(): CommunityQuiz[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Saves a custom quiz to browser localStorage */
export function saveUserQuiz(quiz: CommunityQuiz): void {
  if (typeof window === "undefined") return;
  try {
    const current = loadUserQuizzes().filter((q) => q.id !== quiz.id);
    current.unshift(quiz);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error("Failed to save quiz to localStorage", err);
  }
}

/** Deletes a custom quiz from browser localStorage */
export function deleteUserQuiz(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const filtered = loadUserQuizzes().filter((q) => q.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to delete quiz from localStorage", err);
  }
}
