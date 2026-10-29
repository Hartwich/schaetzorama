import type { LocalizedGameTextMap } from "@open-party-lab/game-core";

export const schaetzoramaText = {
  "de": {
    "displayName": "Schaetzorama",
    "description": "Schaetzen, sortieren und abschreiben auf einer quietschbunten Quiz-Konsole.",
    "visual": {
      "eyebrow": "Quiz"
    }
  },
  "en": {
    "displayName": "Guess-o-Rama",
    "description": "Estimate, sort and copy facts on a bright quiz console.",
    "visual": {
      "eyebrow": "Quiz"
    }
  }
} as const satisfies LocalizedGameTextMap;
