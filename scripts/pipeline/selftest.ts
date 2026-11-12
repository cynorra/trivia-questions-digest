/**
 * Offline self-test for the pipeline gates (no network, no keys):
 *   npx tsx --test scripts/pipeline/selftest.ts
 * Pins what must be caught and what must not.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findFactIssues } from './lib/facts';
import { findTopicIssues } from './lib/topic-intent';
import { findEvidenceUsageIssues, evidenceBlock } from './lib/evidence';
import { TOPICS } from './topics';
import { findHypeIssues, findBrokenInternalLinks, findInternalLinkIssues } from './lib/hype-check';
import { findLowValueSignals, measureValue } from './lib/value';
import { findUnsupportedClaims } from './lib/claims-check';
import { whyTopicRefused } from './lib/policy';
import { pickEditorialForm, EDITORIAL_FORMS } from './lib/forms';

test('facts gate: president numbers must match the official order', () => {
  assert.deepEqual(findFactIssues('Abraham Lincoln was the 16th president. Grover Cleveland was the 24th president.'), []);
  assert.equal(findFactIssues('Thomas Jefferson was the 2nd president.').length, 1);
  assert.equal(findFactIssues('Nixon became the 36th president of the United States.').length, 1);
});

test('facts gate: capitals must match the site data', () => {
  assert.deepEqual(findFactIssues('The capital of France is Paris. Canberra is the capital of Australia.'), []);
  assert.equal(findFactIssues('The capital of Australia is Sydney.').length, 1);
  assert.deepEqual(findFactIssues('The capital of Bolivia is La Paz.'), [], 'multi-capital countries are not judged');
});

test('evidence: place data sets are built and checked', () => {
  assert.ok(evidenceBlock(['us-northeast']).includes('Vermont — capital Montpelier'));
  assert.ok(findEvidenceUsageIssues('<p>Some states are in the Northeast.</p>', ['us-northeast']).length > 0);
  const used = '<p>Maine, New Hampshire, Vermont, Massachusetts, Rhode Island, Connecticut, New York, New Jersey and Pennsylvania. <a href="/northeast-states-quiz/">Quiz</a></p>';
  assert.deepEqual(findEvidenceUsageIssues(used, ['us-northeast']), []);
});

test('policy refuses promises and official framing', () => {
  assert.ok(whyTopicRefused('The Official Answers to Every Pub Quiz'));
  assert.equal(whyTopicRefused('Music Trivia Night: Song Intros by Decade'), null);
});

test('every seed topic passes the topic gate', () => {
  for (const t of TOPICS) assert.deepEqual(findTopicIssues(t), [], t.title);
});

test('evidence: the data block is built and usage is checked', () => {
  assert.ok(evidenceBlock(['history']).includes('A: George Washington.'));
  const thin = '<p>History trivia is fun.</p>';
  assert.ok(findEvidenceUsageIssues(thin, ['history']).length > 0);
  const used = '<p>George Washington, Abraham Lincoln, Franklin D. Roosevelt and Richard Nixon all appear. <a href="/trivia/history-trivia/">History trivia</a></p>';
  assert.deepEqual(findEvidenceUsageIssues(used, ['history']), []);
});

test('hype and claims gates', () => {
  assert.ok(findHypeIssues('This format is the gold standard for trivia nights.').length > 0);
  assert.ok(findUnsupportedClaims('Players who use this cut their mistakes by up to 60%.').length > 0);
});

test('internal links to unknown guides are caught', () => {
  const html = '<p>See <a href="/guides/real-one/">this</a> and <a href="/guides/made-up/">that</a>.</p>';
  assert.deepEqual(findBrokenInternalLinks(html, new Set(['real-one'])).length, 1);
});

test('value gate: specific content passes, generic filler fails', () => {
  const good = '<p>Run 6 rounds of 10 questions with teams of 4 players. Allow 30 seconds per question and 45 seconds without options. Washington took office in 1789; Lincoln was the 16th president; the Indianapolis 500 is 200 laps. Give 2 points in the final round. '.repeat(8) + '</p>';
  assert.deepEqual(findLowValueSignals(good, 'trivia-night'), [], JSON.stringify(measureValue(good)));
  const bad = '<p>' + 'Trivia plays a crucial role in having fun. When it comes to quizzes, it is worth noting that practice matters. '.repeat(30) + '</p>';
  assert.ok(findLowValueSignals(bad, 'trivia-night').length > 0);
});

test('editorial forms rotate', () => {
  const a = pickEditorialForm('trivia-night', 'x', []);
  const b = pickEditorialForm('trivia-night', 'x', [a.id]);
  assert.notEqual(a.id, b.id);
  assert.ok(EDITORIAL_FORMS.every((f) => f.clusters.length > 0));
});

test('internal-link floor: needs 2 question/quiz pages and 2 guides', () => {
  const live = new Set(['a', 'b', 'c', 'd']);
  const bare = '<p>No links at all here.</p>';
  assert.equal(findInternalLinkIssues(bare, live).length, 2);
  const good = '<p><a href="/trivia/halloween-trivia/">Halloween questions</a> <a href="/us-states-map-quiz/">states quiz</a> <a href="/guides/a/">one</a> <a href="/guides/b/">two</a></p>';
  assert.deepEqual(findInternalLinkIssues(good, live), []);
  // the home page and the guides index are not contextual links
  assert.equal(findInternalLinkIssues('<a href="/">home</a><a href="/guides/">all</a>', new Set()).length, 1);
});
