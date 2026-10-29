import assert from 'node:assert/strict';
import { test } from 'node:test';
import { schaetzoramaRounds, schaetzoramaEnglishTextByQuestionId } from '../dist/server/schaetzoramaContent.js';
import { schaetzoramaAssignments } from '../dist/server/schaetzoramaAssignments.js';
import { serverGame } from '../dist/server/index.js';
import { manifest } from '../dist/manifest.js';

test('every quiz question, including archived ones, has complete English prompts and option labels', () => {
  const questions = [...schaetzoramaRounds.flatMap(round => Object.values(round.questions)), ...schaetzoramaAssignments];
  for (const question of questions) {
    const english = schaetzoramaEnglishTextByQuestionId[question.id];
    for (const key of ['title', 'shortLabel', 'prompt']) assert(english?.[key]?.trim(), `${question.id}: ${key}`);
    if (question.kind === 'rank') {
      assert(english.directionLabel?.trim(), `${question.id}: directionLabel`);
      for (const item of question.items) assert(english.itemLabels?.[item.id]?.trim(), `${question.id}: ${item.id}`);
    }
    if (question.kind === 'assign') {
      assert(english.leftLabel?.trim() && english.rightLabel?.trim(), question.id);
      for (const term of question.terms) assert(english.termLabels?.[term.id]?.trim(), `${question.id}: ${term.id}`);
    }
  }
});

test('English public quiz state applies prompts and item labels while keeping question IDs and numeric bounds', () => {
  const ctx = {
    roomCode: 'LANG', roundNumber: 1, now: 1000, deltaMs: 0, language: 'en', theme: 'light',
    selectedGame: manifest, previousRound: null, roomSettings: {},
    players: [{ id: 'a', name: 'Alice', score: 0, color: '#000000', isReady: false, connected: true }]
  };
  for (let index = 0; index < 20; index++) {
    const state = serverGame.createInitialState({ ...ctx, now: ctx.now + index });
    const publicState = serverGame.toPublicState(state, ctx);
    const germanPublicState = serverGame.toPublicState(state, { ...ctx, language: "de" });
    assert.match(publicState.roundContent.roundLabel, /^Guess-o-Rama Round /);
    for (const [category, question] of Object.entries(publicState.roundContent.questions)) {
      const original = germanPublicState.roundContent.questions[category];
      const english = schaetzoramaEnglishTextByQuestionId[question.id];
      assert.equal(question.id, original.id);
      assert.equal(question.prompt, english.prompt);
      if (question.kind === 'rank') for (const item of question.items) assert.equal(item.label, english.itemLabels[item.id]);
      if (question.kind === 'assign') for (const term of question.terms) assert.equal(term.label, english.termLabels[term.id]);
      if (question.kind === 'number' || question.kind === 'percent') {
        assert.equal(question.min, original.min);
        assert.equal(question.max, original.max);
        assert.equal(question.unitLabel, original.unitLabel);
      }
      assert(!('answer' in question) && !('answers' in question) && !('answerOrder' in question));
    }
  }
});
