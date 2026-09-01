import type { HostGameStateSource } from "@open-party-lab/game-core";
import type {
  SchaetzoramaAnswer,
  SchaetzoramaCategoryId,
  SchaetzoramaPublicQuestion,
  SchaetzoramaPublicState
} from "../protocol.js";
import { installSchaetzoramaHostStyles } from "./schaetzoramaHostStyles.js";

interface HostAppStateLike {
  game?: { phase?: string; state?: unknown } | null;
  room?: { code?: string; language?: "de" | "en"; lifecycle?: string } | null;
}

const categories: SchaetzoramaCategoryId[] = ["number", "percent", "rank", "assign"];
const revealStepMs = 4_600;

const labels = {
  de: {
    brandLine: "Wissen trifft Bauchgefuehl", room: "Raum", noLimit: "Ohne Zeitlimit",
    answering: "Geheime Schaetzungen", joker: "Abschreiben", locked: "Antworten stehen",
    intro: "Vier Aufgaben. Ein gutes Gefuehl.", source: "Quelle", correct: "Richtige Loesung",
    closest: "Beste Wertung", copied: "kopiert", points: "Punkte", roundPoints: "Rundenpunkte",
    finalTitle: "Runde ausgewertet", finalSubtitle: "So verteilen sich die Punkte aus allen vier Aufgaben.",
    sessionTitle: "Schaetzorama beendet", sessionSubtitle: "Die Gesamtwertung nach zehn Runden.", totalPoints: "Gesamtpunkte",
    categories: { number: "Zahl", percent: "Prozent", rank: "Reihenfolge", assign: "Zuordnung" }
  },
  en: {
    brandLine: "Knowledge meets instinct", room: "Room", noLimit: "No time limit",
    answering: "Secret estimates", joker: "Copy phase", locked: "Answers locked",
    intro: "Four tasks. Trust your instincts.", source: "Source", correct: "Correct answer",
    closest: "Best score", copied: "copied", points: "points", roundPoints: "round points",
    finalTitle: "Round complete", finalSubtitle: "Points from all four tasks are now on the board.",
    sessionTitle: "Schaetzorama complete", sessionSubtitle: "Final standings after ten rounds.", totalPoints: "total points",
    categories: { number: "Number", percent: "Percent", rank: "Order", assign: "Assign" }
  }
} as const;

export function mountSchaetzoramaHost(rootInput: unknown, source: HostGameStateSource): () => void {
  const root = rootInput as HTMLElement;
  installSchaetzoramaHostStyles();
  root.className = "sz-host-mount";
  let revealTimer: number | undefined;
  let ticker: number | undefined;
  let lastMarkup = "";

  const clearTimers = () => {
    if (revealTimer !== undefined) window.clearTimeout(revealTimer);
    if (ticker !== undefined) window.clearTimeout(ticker);
    revealTimer = undefined;
    ticker = undefined;
  };

  const render = (stateInput: unknown) => {
    clearTimers();
    const state = stateInput as HostAppStateLike;
    const language = state.room?.language === "en" ? "en" : "de";
    const gameState = state.game?.state as SchaetzoramaPublicState | undefined;
    const phase = state.game?.phase ?? state.room?.lifecycle ?? "";
    const markup = renderHost(state, gameState, phase, language);
    if (markup !== lastMarkup) {
      root.innerHTML = markup;
      lastMarkup = markup;
    }

    if (gameState?.stage === "revealed" && gameState.revealedAt) {
      const elapsed = Math.max(0, Date.now() - gameState.revealedAt);
      const nextStep = Math.floor(elapsed / revealStepMs) + 1;
      if (nextStep <= categories.length) {
        revealTimer = window.setTimeout(() => render(source.getState()), Math.max(80, nextStep * revealStepMs - elapsed));
      }
    } else if (gameState?.stage === "joker" && gameState.jokerEndsAt) {
      ticker = window.setTimeout(() => render(source.getState()), 1_000);
    }
  };

  const unsubscribe = source.subscribe(render);
  const initial = source.getState();
  if (initial) render(initial);

  return () => {
    clearTimers();
    unsubscribe();
    root.className = "";
    root.replaceChildren();
  };
}

function renderHost(state: HostAppStateLike, gameState: SchaetzoramaPublicState | undefined, phase: string, language: "de" | "en"): string {
  if (!gameState || phase === "round_intro" || phase === "countdown") return renderIntro(state, gameState, language);
  if (gameState.stage === "revealed") return renderReveal(state, gameState, language);
  return renderPlay(state, gameState, language);
}

function renderIntro(state: HostAppStateLike, gameState: SchaetzoramaPublicState | undefined, language: "de" | "en"): string {
  const text = labels[language];
  return `<main class="sz-host sz-intro">
    <div class="sz-intro__bands" aria-hidden="true">${categories.map((category, index) => `<span class="is-${category}" style="--delay:${index * 90}ms"></span>`).join("")}</div>
    <section class="sz-intro__content">
      <p class="sz-kicker">${escapeHtml(gameState?.roundContent.roundLabel ?? "Schaetzorama")}</p>
      <h1>Schaetzorama</h1><p>${text.intro}</p>
      <div class="sz-intro__legend">${categories.map((category) => `<span class="is-${category}">${categoryGlyph(category)} ${text.categories[category]}</span>`).join("")}</div>
    </section>
    <p class="sz-room-code">${text.room} <strong>${escapeHtml(state.room?.code ?? "----")}</strong></p>
  </main>`;
}

function renderPlay(state: HostAppStateLike, gameState: SchaetzoramaPublicState, language: "de" | "en"): string {
  const text = labels[language];
  const progress = gameState.progress;
  const doneCount = progress.filter((player) => gameState.stage === "joker" ? player.jokerReady : player.answered).length;
  const stageLabel = gameState.stage === "joker" ? text.joker : text.answering;
  const timeLabel = gameState.stage === "joker" && gameState.jokerEndsAt
    ? `${Math.max(0, Math.ceil((gameState.jokerEndsAt - Date.now()) / 1_000))} s`
    : text.noLimit;
  return `<main class="sz-host sz-play">
    ${renderHeader(state, gameState, stageLabel, timeLabel, language)}
    <section class="sz-question-grid">${categories.map((category, index) => renderQuestionCard(gameState.roundContent.questions[category], language, index)).join("")}</section>
    <aside class="sz-score-rail">
      <div class="sz-score-rail__head"><span>${text.locked}</span><strong>${doneCount}/${progress.length}</strong></div>
      <div class="sz-progress-list">${progress.map((player) => {
        const done = gameState.stage === "joker" ? player.jokerReady : player.answered;
        return `<div class="sz-player-progress ${done ? "is-done" : ""}"><i style="--player:${safeColor(player.color)}"></i><span>${escapeHtml(player.name)}</span><b>${done ? "✓" : "…"}</b></div>`;
      }).join("")}</div>
      ${renderStandings(gameState, language)}
    </aside>
  </main>`;
}

function renderHeader(state: HostAppStateLike, gameState: SchaetzoramaPublicState, stage: string, meta: string, language: "de" | "en"): string {
  const text = labels[language];
  return `<header class="sz-host-header">
    <div class="sz-brand"><strong>Schaetzorama</strong><span>${text.brandLine}</span></div>
    <div class="sz-round"><span>${escapeHtml(gameState.roundContent.roundLabel)}</span><strong>${escapeHtml(stage)}</strong></div>
    <div class="sz-live-meta"><span>${escapeHtml(meta)}</span><b>${text.room} ${escapeHtml(state.room?.code ?? "----")}</b></div>
  </header>`;
}

function renderQuestionCard(question: SchaetzoramaPublicQuestion, language: "de" | "en", index: number): string {
  const text = labels[language];
  return `<article class="sz-question is-${question.categoryId}" style="--enter-delay:${index * 75}ms">
    <div class="sz-question__top"><span class="sz-category-mark">${categoryGlyph(question.categoryId)}</span><div><small>${text.categories[question.categoryId]}</small><strong>${escapeHtml(question.title)}</strong></div>${questionGraphic(question)}</div>
    <h2>${escapeHtml(question.prompt)}</h2><p>${escapeHtml(questionHint(question, language))}</p>
  </article>`;
}

function renderStandings(gameState: SchaetzoramaPublicState, language: "de" | "en"): string {
  const text = labels[language];
  return `<div class="sz-standings"><p>${text.roundPoints}</p>${gameState.standings.slice(0, 6).map((standing, index) => `<div><span><b>${index + 1}</b>${escapeHtml(standing.name)}</span><strong>${standing.projectedScore}</strong></div>`).join("")}</div>`;
}

function renderReveal(state: HostAppStateLike, gameState: SchaetzoramaPublicState, language: "de" | "en"): string {
  const elapsed = Math.max(0, Date.now() - (gameState.revealedAt ?? Date.now()));
  const step = Math.min(categories.length, Math.floor(elapsed / revealStepMs));
  if (step >= categories.length) return renderFinal(state, gameState, language);
  const category = categories[step];
  const text = labels[language];
  const question = gameState.roundContent.questions[category];
  const solution = gameState.solutions[category];
  const entries = categoryEntries(gameState, category);
  return `<main class="sz-host sz-reveal is-${category}">
    ${renderHeader(state, gameState, `${text.categories[category]} · ${step + 1}/4`, text.correct, language)}
    <section class="sz-reveal__main">
      <div class="sz-reveal__question"><div class="sz-reveal__eyebrow"><span>${categoryGlyph(category)}</span>${escapeHtml(question.prompt)}</div><p>${text.correct}</p><h1>${escapeHtml(formatAnswer(question, solution, language, true))}</h1><small>${text.source}: ${escapeHtml(question.source.label)}</small></div>
      <div class="sz-answer-board"><p>${text.closest}</p>${entries.map((entry, index) => `<div class="sz-answer-row" style="--player:${safeColor(entry.result.color)};--row-delay:${120 + index * 110}ms"><span class="sz-answer-row__rank">${index + 1}</span><strong>${escapeHtml(entry.result.name)}</strong><span>${escapeHtml(formatAnswer(question, entry.answer, language, false))}</span>${entry.result.joker?.categoryId === category ? `<em>${text.copied}</em>` : ""}<b>+${entry.score}</b></div>`).join("")}</div>
    </section>
    <nav class="sz-reveal-steps">${categories.map((entry, index) => `<i class="is-${entry} ${index <= step ? "is-active" : ""}"></i>`).join("")}</nav>
  </main>`;
}

function renderFinal(state: HostAppStateLike, gameState: SchaetzoramaPublicState, language: "de" | "en"): string {
  const text = labels[language];
  if (gameState.roundContent.roundIndex === 10) {
    const standings = [...gameState.standings].sort((left, right) => right.projectedScore - left.projectedScore);
    return `<main class="sz-host sz-final">
      ${renderHeader(state, gameState, text.sessionTitle, text.totalPoints, language)}
      <section class="sz-final__title"><p>${text.sessionSubtitle}</p></section>
      <section class="sz-final-board">${standings.map((standing, index) => `<article class="sz-final-row ${index === 0 ? "is-winner" : ""}" style="--player:${safeColor(standing.color)};--row-delay:${index * 90}ms"><span class="sz-final-row__place">${index + 1}</span><i></i><strong>${escapeHtml(standing.name)}</strong><div class="sz-final-row__breakdown"><span>+${standing.roundScore} ${text.roundPoints}</span></div><b>${standing.projectedScore}<small>${text.points}</small></b></article>`).join("")}</section>
    </main>`;
  }
  const sorted = [...gameState.results].sort((left, right) => right.total - left.total);
  return `<main class="sz-host sz-final">
    ${renderHeader(state, gameState, text.finalTitle, text.roundPoints, language)}
    <section class="sz-final__title"><p>${text.finalSubtitle}</p></section>
    <section class="sz-final-board">${sorted.map((result, index) => `<article class="sz-final-row ${index === 0 ? "is-winner" : ""}" style="--player:${safeColor(result.color)};--row-delay:${index * 90}ms"><span class="sz-final-row__place">${index + 1}</span><i></i><strong>${escapeHtml(result.name)}</strong><div class="sz-final-row__breakdown">${categories.map((category) => `<span class="is-${category}">${categoryGlyph(category)} +${result.categoryScores[category]}</span>`).join("")}</div><b>${result.total}<small>${text.points}</small></b></article>`).join("")}</section>
  </main>`;
}

function categoryEntries(gameState: SchaetzoramaPublicState, category: SchaetzoramaCategoryId) {
  const solution = gameState.solutions[category];
  return gameState.results.map((result) => {
    const answer = result.answers[category];
    const score = result.categoryScores[category];
    const distance = solution?.kind === "number" && answer?.kind === "number" ? Math.abs(solution.value - answer.value) : -score;
    return { result, answer, score, distance };
  }).sort((left, right) => left.distance - right.distance || right.score - left.score || left.result.name.localeCompare(right.result.name));
}

function formatAnswer(question: SchaetzoramaPublicQuestion, answer: SchaetzoramaAnswer | undefined, language: "de" | "en", detailed: boolean): string {
  if (!answer) return "–";
  if (answer.kind === "number") {
    const unit = "unitLabel" in question ? question.unitLabel ?? (question.kind === "percent" ? "%" : "") : "";
    return `${answer.value}${unit ? ` ${unit}` : ""}`;
  }
  if (answer.kind === "rank" && question.kind === "rank") return answer.order.map((id) => question.items.find((item) => item.id === id)?.label ?? id).join(" › ");
  if (answer.kind === "assign" && question.kind === "assign") {
    if (!detailed) return language === "en" ? `${Object.keys(answer.assignments).length} assigned` : `${Object.keys(answer.assignments).length} zugeordnet`;
    return question.terms.map((term) => {
      const zone = answer.assignments[term.id];
      const label = zone === "left" ? question.leftLabel : zone === "right" ? question.rightLabel : language === "en" ? "Both" : "Beides";
      return `${term.label}: ${label}`;
    }).join(" · ");
  }
  return "–";
}

function questionHint(question: SchaetzoramaPublicQuestion, language: "de" | "en"): string {
  if (question.kind === "number" || question.kind === "percent") {
    const unit = question.unitLabel ?? (question.kind === "percent" ? "%" : "");
    return `${question.min} — ${question.max}${unit ? ` ${unit}` : ""}`;
  }
  if (question.kind === "rank") return question.directionLabel;
  if (question.kind === "assign") {
    return language === "en" ? `${question.leftLabel} · both · ${question.rightLabel}` : `${question.leftLabel} · beides · ${question.rightLabel}`;
  }
  return "";
}

function questionGraphic(question: SchaetzoramaPublicQuestion): string {
  if (question.kind === "number") return `<div class="sz-mini-scale"><i></i><i></i><i></i><b></b></div>`;
  if (question.kind === "percent") return `<div class="sz-mini-donut"></div>`;
  if (question.kind === "rank") return `<div class="sz-mini-rank"><i></i><i></i><i></i></div>`;
  return `<div class="sz-mini-venn"><i></i><i></i></div>`;
}

function categoryGlyph(category: SchaetzoramaCategoryId): string {
  return category === "number" ? "#" : category === "percent" ? "%" : category === "rank" ? "↕" : "◉";
}

function safeColor(value: string): string { return /^#[0-9a-f]{6}$/i.test(value) ? value : "#697178"; }
function escapeHtml(value: unknown): string {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
