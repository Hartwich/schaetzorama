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
    resultMs: 30_000,
    scoreboardMs: 5_000
  },

  ownsScreens: ["round_intro", "result"],
  hostChrome: { joinOverlay: false, hud: false, roomCode: false, joinOverlayWhenFinished: false },
  controllerChrome: { hideSubtitle: true },
  visual: { accent: "#c8873a", icon: "question", eyebrow: "Quiz" },
  audio: {
    track: { profile: "calmFocus", bpm: 76, rootMidi: 48, masterGain: 0.19, crossfadeSeconds: 3.2 },
    trackByStage: {
      revealed: { profile: "calmReveal", bpm: 80, rootMidi: 48, masterGain: 0.18, crossfadeSeconds: 3.2 }
    }
  },
} as const satisfies GameManifest;

export const manifest = schaetzoramaManifest;
