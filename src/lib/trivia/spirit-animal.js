// Spirit animal quiz: a light personality match, not a psychological test.
// Each answer gives a point to two animals; the result is the animal with the
// most points (ties go to the animal in your most recent answer). Every animal's
// "real facts" were checked against the named source.

export const ANIMALS = {
  wolf: {
    name: "Wolf",
    tagline: "Loyal, protective and happiest with your people",
    traits: "You're at your best as part of a close group. You notice when someone is left out, you stand by friends when things go wrong, and you'd rather build something together than win alone.",
    strengths: ["Loyalty that people can count on", "Keeping a group together under pressure", "Reading the mood of a room"],
    watch: "You can take on everyone's problems. Make room for your own.",
    facts: [["Wolf packs are usually families.", "A typical pack is a breeding pair and their offspring from the last few years.", "National Park Service"], ["A wolf's howl can carry for kilometers.", "Howling helps pack members find each other and warns other packs away.", "International Wolf Center"]],
  },
  owl: {
    name: "Owl",
    tagline: "Thoughtful, observant and quietly wise",
    traits: "You think before you speak and notice details others miss. People bring you their hardest questions because you listen, weigh things up and give an honest answer.",
    strengths: ["Careful judgment", "Spotting what doesn't add up", "Calm, honest advice"],
    watch: "You can overthink. Sometimes a good-enough decision now beats a perfect one later.",
    facts: [["Most owls fly almost silently.", "Soft, comb-like edges on their feathers break up the air and muffle the sound of each wingbeat.", "Cornell Lab of Ornithology"], ["Owls turn their heads instead of their eyes.", "Their tube-shaped eyes are fixed in place, but extra neck vertebrae let them rotate their heads about 270 degrees.", "Johns Hopkins Medicine"]],
  },
  dolphin: {
    name: "Dolphin",
    tagline: "Social, curious and great at connecting people",
    traits: "You're quick, warm and genuinely interested in others. You bring people together, keep conversations going and learn fastest by talking things through.",
    strengths: ["Making people feel welcome", "Curiosity about everything", "Clear, friendly communication"],
    watch: "You may say yes to everything. Protect some quiet time.",
    facts: [["Bottlenose dolphins have names, of a sort.", "Each develops a signature whistle that others use to call it, much like a name.", "NOAA Fisheries"], ["Dolphins sleep with half their brain at a time.", "Resting one hemisphere while the other stays alert lets them keep surfacing to breathe.", "Smithsonian Ocean"]],
  },
  fox: {
    name: "Fox",
    tagline: "Clever, independent and quick on your feet",
    traits: "You trust your instincts and like solving problems your own way. You adapt fast to new places and people, and you're often the one who finds the clever shortcut.",
    strengths: ["Resourcefulness", "Adapting to change", "Seeing angles others miss"],
    watch: "Going it alone is easy for you. Let people in on the plan.",
    facts: [["The red fox is the most widespread wild carnivore on Earth.", "It lives across North America, Europe, Asia and North Africa, and was introduced to Australia.", "IUCN Red List"], ["Foxes are related to dogs but hunt alone.", "Unlike wolves, red foxes usually hunt small prey by themselves, often by pouncing from above.", "Smithsonian's National Zoo"]],
  },
  bear: {
    name: "Bear",
    tagline: "Steady, calm and strong when it counts",
    traits: "You're grounded and dependable. You don't need the spotlight, you recharge on your own and you're fiercely protective of the people and places you care about.",
    strengths: ["Calm under pressure", "Reliability", "Protecting what matters"],
    watch: "You may retreat when you need support. Asking for help is a strength too.",
    facts: [["Grizzly bears can run about 55 km/h.", "That's roughly 35 mph in short bursts, faster than any human sprinter.", "National Park Service"], ["Bears have an extraordinary sense of smell.", "A bear's nose is many times more sensitive than a dog's and can pick up food from far away.", "National Park Service"]],
  },
  eagle: {
    name: "Eagle",
    tagline: "Focused, ambitious and sees the big picture",
    traits: "You set goals and go after them. You like independence, think long term and can see where things are heading before others do.",
    strengths: ["Vision and long-term thinking", "Focus", "Making clear decisions"],
    watch: "Your standards are high. Don't forget to enjoy the view on the way.",
    facts: [["Eagles see far better than people.", "Their eyes can spot prey from several kilometers away; their vision is estimated at four to eight times sharper than ours.", "National Audubon Society"], ["Bald eagles build some of the biggest nests of any bird.", "Pairs add to the same nest year after year; one record nest in Florida was about 2.9 meters wide.", "Guinness World Records"]],
  },
  otter: {
    name: "Otter",
    tagline: "Playful, upbeat and easy to be around",
    traits: "You bring the fun. You find joy in small things, lighten tense moments and make friends easily. You also know when to just relax.",
    strengths: ["Humor and optimism", "Turning work into play", "Bouncing back quickly"],
    watch: "You may avoid hard conversations. A little seriousness at the right time goes a long way.",
    facts: [["Sea otters have the densest fur of any animal.", "Up to about a million hairs per square inch keep them warm without blubber.", "Monterey Bay Aquarium"], ["Sea otters use tools.", "They float on their backs and crack open shellfish against rocks resting on their chests.", "Monterey Bay Aquarium"]],
  },
  elephant: {
    name: "Elephant",
    tagline: "Caring, wise and never forgets a friend",
    traits: "You're patient, kind and deeply loyal to your family and friends. You remember what matters to people, and you're the one others lean on for the long haul.",
    strengths: ["Empathy", "A long memory for what matters", "Patience"],
    watch: "You may carry other people's worries for too long. Let some of them go.",
    facts: [["Elephants can recognize themselves in a mirror.", "A 2006 study found Asian elephants passed the mirror test, a sign of self-awareness shared by few animals.", "Proceedings of the National Academy of Sciences"], ["Elephants talk in rumbles we can't hear.", "Low-frequency calls can travel several kilometers through air and ground.", "Smithsonian's National Zoo"]],
  },
};

export const ANIMAL_ORDER = ["wolf", "owl", "dolphin", "fox", "bear", "eagle", "otter", "elephant"];

// [question, [[answer, [animal, animal]], ...]]
export const QUESTIONS = [
  ["It's Saturday and you have no plans. What do you do?", [["Get friends together for something", ["wolf", "dolphin"]], ["Settle into a book or a long project", ["owl", "bear"]], ["Go somewhere new on a whim", ["fox", "eagle"]], ["Do something playful outdoors", ["otter", "elephant"]]]],
  ["In a group project, you're usually the one who…", [["Keeps everyone together", ["wolf", "elephant"]], ["Spots the flaw no one else saw", ["owl", "eagle"]], ["Finds a clever shortcut", ["fox", "otter"]], ["Gets things done quietly and reliably", ["bear", "dolphin"]]]],
  ["Friends usually come to you for…", [["Loyalty when things go wrong", ["wolf", "bear"]], ["Honest advice", ["owl", "eagle"]], ["A laugh", ["otter", "dolphin"]], ["A patient ear", ["elephant", "fox"]]]],
  ["Pick the place you'd most like to be right now.", [["A mountain ridge with a long view", ["eagle", "wolf"]], ["A cabin deep in the forest", ["bear", "fox"]], ["A beach or a lake", ["dolphin", "otter"]], ["An old library", ["owl", "elephant"]]]],
  ["When you're stressed, you tend to…", [["Make a plan and work through it", ["eagle", "owl"]], ["Need time alone to recharge", ["bear", "fox"]], ["Talk it out with someone", ["dolphin", "elephant"]], ["Find something funny to break the tension", ["otter", "wolf"]]]],
  ["Which ability would you most like to have?", [["Reading people instantly", ["fox", "dolphin"]], ["Never forgetting anything", ["elephant", "owl"]], ["Seeing the big picture", ["eagle", "wolf"]], ["Staying calm in any storm", ["bear", "otter"]]]],
  ["How do you usually make big decisions?", [["Gut instinct", ["fox", "eagle"]], ["Research and careful thought", ["owl", "elephant"]], ["What's best for the people around me", ["wolf", "dolphin"]], ["Whatever feels right on the day", ["otter", "bear"]]]],
  ["Which time of day feels most like you?", [["Early morning", ["eagle", "bear"]], ["Bright afternoon", ["dolphin", "otter"]], ["Dusk", ["fox", "wolf"]], ["Late at night", ["owl", "elephant"]]]],
  ["Your friends would describe you as…", [["Protective", ["wolf", "bear"]], ["Wise", ["owl", "elephant"]], ["Adventurous", ["eagle", "fox"]], ["Fun", ["otter", "dolphin"]]]],
  ["What matters most to you?", [["Family and close friends", ["elephant", "wolf"]], ["Freedom", ["eagle", "fox"]], ["Learning and understanding", ["owl", "dolphin"]], ["Peace and comfort", ["bear", "otter"]]]],
];

/** Points per animal for a list of chosen answer indexes (one per question). */
export function score(choices) {
  const pts = Object.fromEntries(ANIMAL_ORDER.map((a) => [a, 0]));
  choices.forEach((c, i) => { if (c != null) for (const a of QUESTIONS[i][1][c][1]) pts[a] += 1; });
  return pts;
}
/**
 * The best match and the runner-up. Ties are broken by your later answers:
 * the tied animal that appears in the most recent answer wins, so the result
 * doesn't lean toward any animal by default.
 */
export function result(choices) {
  const pts = score(choices);
  const lastSeen = Object.fromEntries(ANIMAL_ORDER.map((a) => [a, -1]));
  choices.forEach((c, i) => { if (c != null) QUESTIONS[i][1][c][1].forEach((a, k) => { lastSeen[a] = i * 2 + (1 - k); }); });
  const ranked = [...ANIMAL_ORDER].sort((a, b) => pts[b] - pts[a] || lastSeen[b] - lastSeen[a]);
  return { top: ranked[0], second: ranked[1], pts };
}
