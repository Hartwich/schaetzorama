import assert from "node:assert/strict";
import { test } from "node:test";
import { serverGame } from "../dist/server/index.js";
import { revealPosition, scoreStartMs, standingMovements } from "../dist/host/schaetzoramaReveal.js";

const players = ["a", "b"].map((id) => ({ id, name: id, color: "#336699", score: 0, isReady: false, connected: true }));
const context = { roomCode: "TEST", roundNumber: 1, players, now: 1000, deltaMs: 0, language: "de", theme: "light", selectedGame: serverGame.manifest, previousRound: null, roomSettings: {} };

test("ten-round sessions shuffle once, preserve solutions, and never repeat questions", () => {
  for (let session = 0; session < 30; session++) {
    let previousRound = null;
    const seen = new Set();
    for (let roundNumber = 1; roundNumber <= 10; roundNumber++) {
      const state = serverGame.createInitialState({ ...context, roundNumber, previousRound });
      const questions = state.roundContent.questions;
      for (const question of Object.values(questions)) {
        assert(!seen.has(question.id));
        seen.add(question.id);
      }
      assert.notDeepEqual(questions.rank.items.map((item) => item.id), questions.rank.answerOrder);
      assert.deepEqual(questions.rank.items.map((item) => item.id).sort(), [...questions.rank.answerOrder].sort());
      const zones = questions.assign.terms.map((term) => ({ left: 0, both: 1, right: 2 })[questions.assign.answers[term.id]]);
      if (new Set(zones).size > 1) assert(zones.some((zone, index) => index > 0 && zone < zones[index - 1]));
      assert.deepEqual(serverGame.toPublicState(state, context).roundContent, serverGame.toPublicState(state, context).roundContent);
      const revealDuration = Object.values(questions).reduce((total, question) => total + scoreStartMs(question) + 2600, 0);
      assert(revealDuration + 4000 + 5000 <= serverGame.manifest.phaseDurations.lockedMs);
      previousRound = { gameId: "schaetzorama", roundNumber, phase: "finished", state, updatedAt: context.now };
    }
    assert.equal(seen.size, 40);
  }
});

test("the second paid preview is readable at zero inventory and remains copyable", () => {
  let previousRound = null;
  for (let roundNumber = 1; roundNumber <= 2; roundNumber++) {
    const ctx = { ...context, roundNumber, previousRound };
    let state = serverGame.startRound(serverGame.createInitialState(ctx), ctx);
    const numberValue = state.roundContent.questions.number.min;
    for (const player of players) state = serverGame.handleInput(state, { type: "submit_answers", playerId: player.id, answers: { number: { kind: "number", value: numberValue } } }, ctx);
    assert.equal(state.stage, "joker");
    const joker = { kind: "copy", categoryId: "number", targetPlayerId: "b" };
    state = serverGame.handleInput(state, { type: "preview_joker", playerId: "a", joker }, ctx);
    const phone = serverGame.toControllerStateForPlayer(state, ctx, "a");
    assert.equal(phone.ownInventory.copy, 2 - roundNumber);
    assert.deepEqual(phone.copyTargets.find((player) => player.playerId === "b").answers.number, { kind: "number", value: numberValue });
    assert.deepEqual(phone.ownJokerPreview, joker);
    assert.equal(serverGame.handleInput(state, { type: "preview_joker", playerId: "a", joker }, ctx), state);
    state = serverGame.handleInput(state, { type: "choose_joker", playerId: "a", joker }, ctx);
    state = serverGame.handleInput(state, { type: "choose_joker", playerId: "b", joker: null }, ctx);
    assert.deepEqual(state.jokerByPlayerId.a, joker);
    assert.equal(state.stage, "revealed");
    const revealedPhone = serverGame.toControllerStateForPlayer(state, ctx, "a");
    assert.deepEqual(revealedPhone.results, []);
    assert.deepEqual(revealedPhone.solutions, {});
    assert.deepEqual(revealedPhone.standings, []);
    assert.equal(serverGame.toPublicState(state, ctx).results.length, 2);
    previousRound = { gameId: "schaetzorama", roundNumber, phase: "finished", state, updatedAt: ctx.now };
  }
});

test("standings calculate movement from pre-round scores with shared tie ranks", () => {
  const standings = [
    { playerId: "a", name: "A", color: "#336699", score: 100, projectedScore: 110, roundScore: 10 },
    { playerId: "b", name: "B", color: "#336699", score: 50, projectedScore: 150, roundScore: 100 },
    { playerId: "c", name: "C", color: "#336699", score: 50, projectedScore: 110, roundScore: 60 }
  ];
  const movements = standingMovements(standings);
  assert.deepEqual(movements.map(({ playerId, previousRank, rank, shift }) => [playerId, previousRank, rank, shift]), [["b", 2, 1, 1], ["a", 1, 2, -1], ["c", 2, 2, 0]]);
  assert.deepEqual(movements.map(({ playerId, previousScore, previousRank, rank, shift }) => [playerId, previousScore, previousRank, rank, shift]), [["b", 50, 2, 1, 1], ["a", 100, 1, 2, -1], ["c", 50, 2, 2, 0]]);
  const state = serverGame.toPublicState(serverGame.createInitialState(context), context);
  state.revealedAt = 1000;
  const categoriesEnd = Object.values(state.roundContent.questions).reduce((total, question) => total + scoreStartMs(question) + 2600, 1000);
  assert.equal(revealPosition(state, categoriesEnd).step, 4);
  assert.equal(revealPosition(state, categoriesEnd + 4000).step, 5);
});
