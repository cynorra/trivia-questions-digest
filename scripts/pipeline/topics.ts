/**
 * Topic bank for the auto-blog. Keywords and volumes come from the owner's
 * Google Keyword Planner export of 2026-11-01 (US). Topics already covered by
 * the hand-written launch guides are not repeated. Each topic names the
 * question set(s) the article must use (lib/evidence.ts).
 */
import type { SiteTopic } from './lib/topic-intent';

export const TOPICS: SiteTopic[] = [
  { title: 'Halloween Trivia Night: Rounds for a Spooky Party', keyword: 'halloween trivia', volume: 50000, tool: 'holidays', data: ['halloween'], asset: 'a full Halloween party round built from the site question set, with the host line for each answer and a costume round' },
  { title: 'Sports Trivia Night: A Round Fans and Non-Fans Can Both Play', keyword: 'sports trivia', volume: 50000, tool: 'trivia-night', data: ['sports'], asset: 'a sports round from the site questions balanced between rules and history, with closest-number tiebreakers' },
  { title: 'Movie Trivia Night: Building a Round Around Famous Lines', keyword: 'movie trivia', volume: 50000, tool: 'trivia-night', data: ['screen'], asset: 'a film round built from the site questions, with misquoted lines, Oscar history and a picture-round variant' },
  { title: 'Bible Trivia for Small Groups: A Study-Night Format', keyword: 'bible trivia questions', volume: 50000, tool: 'knowledge', data: ['bible'], asset: 'a small-group Bible trivia session from the site questions, with the verse to look up for each answer' },
  { title: 'Space and Animal Trivia: The Stories Behind the Answers', keyword: 'science trivia', volume: 5000, tool: 'knowledge', data: ['science'], asset: 'the background story behind six science answers from the site set, told in enough depth to retell at a quiz' },
  { title: 'Food Trivia Night: Pairing Questions With What You Serve', keyword: 'food trivia questions', volume: 5000, tool: 'trivia-night', data: ['food'], asset: 'a dinner-party food round from the site questions matched to dishes, with the follow-up line for each answer' },
  { title: 'Music Trivia Night: Song Intros and Questions by Decade', keyword: 'music trivia', volume: 5000, tool: 'trivia-night', data: ['music'], asset: 'a music round from the site questions arranged by decade, with an intro-clip format and scoring rules' },
  { title: 'US History Trivia: A Round From the Revolution to the Moon', keyword: 'us history trivia', volume: 5000, tool: 'knowledge', data: ['history'], asset: 'a chronological US history round from the site questions, with the date to anchor each answer' },
  { title: 'Office Trivia: Running a 30-Minute Quiz at Work', keyword: 'trivia for work', volume: 500, tool: 'trivia-night', data: ['general', 'adults'], asset: 'a 30-minute office quiz run sheet using site questions, with team mixing and a work-safe tiebreaker' },
  { title: 'Christmas Trivia for Adults: A Harder Holiday Round', keyword: 'christmas trivia for adults', volume: 5000, tool: 'holidays', data: ['christmas'], asset: 'a harder Christmas round from the site set, with the history behind each answer and double-point rules' },
  { title: 'General Knowledge Quiz Night: Pitching Questions for Any Crowd', keyword: 'general knowledge trivia', volume: 50000, tool: 'trivia-night', data: ['general'], asset: 'how to choose and order general knowledge questions from the site set for different crowds, with worked examples' },
  { title: 'Thanksgiving Trivia at the Dinner Table: A Family Format', keyword: 'thanksgiving trivia', volume: 5000, tool: 'holidays', data: ['thanksgiving'], asset: 'a between-courses Thanksgiving game built from the site questions, with the 1621 sources behind the answers' },
  // Geography topics
  { title: 'European Capitals: How to Learn All of Them With Memory Hooks', keyword: 'european capital quiz', volume: 5000, tool: 'flags-capitals', data: ['europe'], asset: 'every European capital from the site data, grouped with a memory hook for each and a link to the capitals quiz' },
  { title: 'African Capitals, Region by Region, With Memory Tips', keyword: 'country capital quiz', volume: 5000, tool: 'flags-capitals', data: ['africa'], asset: 'all African capitals from the site data in regional groups, with the notes on capitals that moved' },
  { title: 'Asian Capitals People Mix Up and How to Keep Them Straight', keyword: 'capital of world quiz', volume: 5000, tool: 'flags-capitals', data: ['asia'], asset: 'the Asian capitals from the site data, organised as confusable pairs with a hook for each' },
  { title: 'Oceania Countries and Capitals: The Pacific Island Nations', keyword: 'world geography quiz', volume: 5000, tool: 'world', data: ['oceania'], asset: 'the fourteen Oceania countries and their capitals from the site data, placed on the map one by one' },
  { title: 'Western US States and Capitals: A Map Guide', keyword: 'state capitals us quiz', volume: 50000, tool: 'us', data: ['us-west'], asset: 'the thirteen Western states and capitals from the site data, placed relative to anchor states' },
  { title: 'Midwest States and Capitals: A Map Guide', keyword: 'states and capitals quiz', volume: 50000, tool: 'us', data: ['us-midwest'], asset: 'the twelve Midwest states and capitals from the site data, placed relative to the Great Lakes and the plains' },
  { title: 'Southern States and Capitals: A Map Guide', keyword: 'us state capital test', volume: 50000, tool: 'us', data: ['us-south'], asset: 'the sixteen Southern states and capitals from the site data, walked from Delaware to Texas' },
  { title: 'Northeast States and Capitals: A Map Guide', keyword: 'american capitals quiz', volume: 50000, tool: 'us', data: ['us-northeast'], asset: 'the nine Northeast states and capitals from the site data, with the small New England states placed one by one' },
  { title: 'North America and the Caribbean: Countries and Capitals', keyword: 'north american countries quiz', volume: 5000, tool: 'world', data: ['americas'], asset: 'the countries and capitals of North America, Central America and the Caribbean from the site data, island by island' },
  { title: 'How to Learn All 195 Countries of the World, One Continent at a Time', keyword: 'countries of the world quiz', volume: 50000, tool: 'world', data: ['world'], asset: 'a continent-by-continent plan built on the site country list, with the quiz for each continent' },
];
