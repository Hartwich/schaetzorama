import type { SchaetzoramaAnswer, SchaetzoramaPublicQuestion, SchaetzoramaPublicState } from "../protocol.js";

export const revealCategories = ["number", "percent", "rank", "assign"] as const;
export const itemStartMs = 650;
export const itemStaggerMs = 600;
export const itemMoveMs = 700;

export function solutionItemCount(question: SchaetzoramaPublicQuestion): number {
  return question.kind === "rank" ? question.items.length : question.kind === "assign" ? question.terms.length : 1;
}

export function scoreStartMs(question: SchaetzoramaPublicQuestion): number {
  return itemStartMs + (solutionItemCount(question) - 1) * itemStaggerMs + itemMoveMs + 250;
}

export function revealPosition(state: SchaetzoramaPublicState, now = Date.now()) {
  let elapsed = Math.max(0, now - (state.revealedAt ?? now));
  for (let step = 0; step < revealCategories.length; step++) {
    const duration = scoreStartMs(state.roundContent.questions[revealCategories[step]]) + 2600;
    if (elapsed < duration) return { step, elapsed, remaining: duration - elapsed };
    elapsed -= duration;
  }
  return { step: revealCategories.length, elapsed, remaining: 0 };
}

export function renderVisualSolution(question: SchaetzoramaPublicQuestion, answer: SchaetzoramaAnswer | undefined, language: "de" | "en", escape: (value: unknown) => string): string | null {
  if (question.kind === "rank" && answer?.kind === "rank") {
    return `<div class="sz-order-solution"><p>${escape(question.directionLabel)}</p><div class="sz-order-list">${answer.order.map((id, index) => {
      const original = question.items.findIndex((item) => item.id === id);
      return `<div class="sz-order-item" style="--from-row:${original - index};--item-delay:${itemStartMs + index * itemStaggerMs}ms"><b>${index + 1}</b><strong>${escape(question.items[original]?.label ?? id)}</strong><span aria-hidden="true">✓</span></div>`;
    }).join("")}</div></div>`;
  }
  if (question.kind === "assign" && answer?.kind === "assign") {
    const zones = ["left", "both", "right"];
    return `<div class="sz-zone-solution"><div class="sz-zone-labels"><strong>← ${escape(question.leftLabel)}</strong><strong>∩ ${language === "en" ? "Both" : "Beide"}</strong><strong>${escape(question.rightLabel)} →</strong></div>${question.terms.map((term, index) => {
      const zone = answer.assignments[term.id];
      return `<div class="sz-zone-rail"><div class="sz-zone-item" data-solution-zone="${escape(zone)}" style="--zone:${zones.indexOf(zone)};--item-delay:${itemStartMs + index * itemStaggerMs}ms"><strong>${escape(term.label)}</strong><span aria-hidden="true">✓</span></div></div>`;
    }).join("")}</div>`;
  }
  return null;
}
