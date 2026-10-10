import assert from "node:assert/strict";
import { test } from "node:test";
import { schaetzoramaAssignments, schaetzoramaAssignmentEnglishText } from "../dist/server/schaetzoramaAssignments.js";

test("every active assignment has real overlap, complete solutions and English text", () => {
  assert.equal(schaetzoramaAssignments.length, 60);
  assert.equal(new Set(schaetzoramaAssignments.map(({ id }) => id)).size, schaetzoramaAssignments.length);
  const prompts = new Set();
  const categoryPairs = new Set();
  const overlapCounts = new Set();
  for (const question of schaetzoramaAssignments) {
    assert(!prompts.has(question.prompt), `Duplicate prompt: ${question.id}`);
    prompts.add(question.prompt);
    const pair = [question.leftLabel, question.rightLabel].sort().join("|");
    assert(!categoryPairs.has(pair), `Duplicate category pair: ${question.id}`);
    categoryPairs.add(pair);
    const ids = question.terms.map(({ id }) => id);
    assert(ids.length >= 5 && ids.length <= 6, question.id);
    assert.equal(new Set(ids).size, ids.length, question.id);
    assert.deepEqual(Object.keys(question.answers).sort(), [...ids].sort(), question.id);
    assert.deepEqual([...new Set(Object.values(question.answers))].sort(), ["both", "left", "right"], question.id);
    overlapCounts.add(Object.values(question.answers).filter((zone) => zone === "both").length);
    const english = schaetzoramaAssignmentEnglishText[question.id];
    for (const key of ["title", "shortLabel", "prompt", "leftLabel", "rightLabel"]) assert(english[key]?.trim(), `${question.id}: ${key}`);
    assert.deepEqual(Object.keys(english.termLabels).sort(), [...ids].sort(), question.id);
    for (const term of question.terms) assert(term.label.trim() && english.termLabels[term.id]?.trim(), question.id);
    assert.equal(new URL(question.source.url).protocol, "https:");
  }
  assert.deepEqual([...overlapCounts].sort(), [1, 2, 3]);
});
