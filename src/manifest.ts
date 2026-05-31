import type { GameManifest } from "@open-party-lab/game-core";

export const schaetzoramaManifest = {
  id: "schaetzorama",
  displayName: "Schaetzorama",
  description: "Schaetzen, sortieren und abschreiben auf einer quietschbunten Quiz-Konsole.",
  minPlayers: 1,
  maxPlayers: 8,
  hostView: "SchaetzoramaHostScene",
  controllerView: "schaetzorama",
  controllerLayout: "schaetzorama",
  supportsTeams: false,
  estimatedRoundDurationMs: 145_000,
  roundCompletionMode: "wait_for_ready",
  phaseDurations: {
    roundIntroMs: 1_500,
    countdownMs: 2_000,
    lockedMs: 26_000,
    resultMs: 5_000,
    scoreboardMs: 5_000
  }
} as const satisfies GameManifest;

export const manifest = schaetzoramaManifest;

