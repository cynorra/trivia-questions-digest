// Guide sections. `key` is the value of `tool` in guide frontmatter and in the
// Firestore articles collection.
export const TOPICS = [
  { key: "trivia-night", name: "Trivia nights", topic: "Hosting trivia", href: "/trivia/", label: "Trivia nights", hubName: "All trivia categories", ctaKicker: "Play a round", blurb: "690 questions with answers across 27 categories, ready to read out." },
  { key: "knowledge", name: "History and science", topic: "History and science", href: "/trivia/history-trivia/", label: "History and science", hubName: "History trivia", ctaKicker: "Play a round", blurb: "Thirty questions on US and world history, each explained." },
  { key: "holidays", name: "Holiday trivia", topic: "Holiday trivia", href: "/trivia/christmas-trivia/", label: "Holidays", hubName: "Christmas trivia", ctaKicker: "Play a round", blurb: "Twenty-five Christmas questions on songs, films and traditions." },
  { key: "us", name: "US geography", topic: "US geography", href: "/us-states-map-quiz/", label: "US geography", hubName: "US states map quiz", ctaKicker: "Play the quiz", blurb: "Find all 50 states on a blank map, with a study mode." },
  { key: "world", name: "World geography", topic: "World geography", href: "/world-map-quiz/", label: "World geography", hubName: "World map quiz", ctaKicker: "Play the quiz", blurb: "Every country on one map, or one continent at a time." },
  { key: "flags-capitals", name: "Flags and capitals", topic: "Flags and capitals", href: "/flag-quiz/", label: "Flags and capitals", hubName: "Flags of the world quiz", ctaKicker: "Play the quiz", blurb: "Name the country for each flag, by continent or all 195." },
];
export const TOPIC_KEYS = TOPICS.map((t) => t.key);
export const TOPIC_BY_KEY = Object.fromEntries(TOPICS.map((t) => [t.key, t]));
