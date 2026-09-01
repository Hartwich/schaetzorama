const STYLE_ID = "schaetzorama-dom-host-styles";

const css = `
.sz-host-mount { z-index: 1; }
.sz-host, .sz-host * { box-sizing: border-box; }
.sz-host {
  --sz-number: #3f806a; --sz-percent: #39749b; --sz-rank: #9a527b; --sz-assign: #b86c32;
  position: absolute; inset: 0; overflow: hidden; background: var(--paper); color: var(--ink); font-family: var(--font-body);
}
.sz-host h1, .sz-host h2, .sz-host p { margin: 0; }
.sz-host-header {
  position: absolute; inset: 0 0 auto; height: 94px; display: grid; grid-template-columns: 1fr auto 1fr;
  align-items: center; gap: 24px; padding: 18px 32px; border-bottom: 1px solid var(--line);
  background: color-mix(in srgb, var(--surface) 94%, transparent); z-index: 3;
}
.sz-brand, .sz-round, .sz-live-meta { display: grid; gap: 3px; }
.sz-brand strong { font: 700 25px/1 var(--font-display); }
.sz-brand span, .sz-round span, .sz-live-meta b { color: var(--muted); font-size: 13px; font-weight: 650; }
.sz-round { text-align: center; }.sz-round strong { font-size: 17px; }.sz-live-meta { justify-items: end; }
.sz-live-meta span { padding: 7px 12px; border: 1px solid var(--line-strong); border-radius: 999px; font-weight: 800; }

.sz-intro { display: grid; place-items: center; isolation: isolate; }
.sz-intro::before { content: ""; position: absolute; inset: 0; opacity: .34; background-image: linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px); background-size: 44px 44px; mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent); }
.sz-intro__bands { position: absolute; inset: 8% 0; display: grid; align-content: center; gap: 12px; transform: rotate(-4deg) scale(1.08); }
.sz-intro__bands span { display: block; height: 42px; transform-origin: left; animation: sz-band-in 700ms cubic-bezier(.2,.8,.2,1) both; animation-delay: var(--delay); opacity: .18; }
.sz-intro__bands .is-number { background: var(--sz-number); width: 82%; }.sz-intro__bands .is-percent { background: var(--sz-percent); width: 64%; margin-left: auto; }
.sz-intro__bands .is-rank { background: var(--sz-rank); width: 74%; }.sz-intro__bands .is-assign { background: var(--sz-assign); width: 88%; margin-left: auto; }
.sz-intro__content { position: relative; z-index: 1; width: min(820px, 78%); text-align: center; }
.sz-kicker { color: var(--accent-strong); font-size: 15px; font-weight: 900; text-transform: uppercase; }
.sz-intro h1 { margin-top: 12px; font: 700 78px/.95 var(--font-display); }
.sz-intro__content > p:not(.sz-kicker) { margin-top: 20px; color: var(--ink-soft); font-size: 23px; }
.sz-intro__legend { display: flex; justify-content: center; gap: 10px; margin-top: 34px; }
.sz-intro__legend span { display: inline-flex; align-items: center; gap: 8px; padding: 9px 13px; background: var(--surface); border: 1px solid var(--line); border-radius: 8px; font-weight: 800; box-shadow: var(--shadow-card); }
.sz-intro__legend .is-number { color: var(--sz-number); }.sz-intro__legend .is-percent { color: var(--sz-percent); }.sz-intro__legend .is-rank { color: var(--sz-rank); }.sz-intro__legend .is-assign { color: var(--sz-assign); }
.sz-room-code { position: absolute; right: 30px; bottom: 24px; color: var(--muted); }.sz-room-code strong { color: var(--ink); letter-spacing: .12em; }

.sz-play { display: grid; grid-template-columns: minmax(0, 1fr) 300px; grid-template-rows: 94px minmax(0, 1fr); }
.sz-play .sz-host-header { grid-column: 1 / -1; }
.sz-question-grid { grid-column: 1; grid-row: 2; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 14px; padding: 18px; }
.sz-question { --cat: var(--sz-number); position: relative; min-width: 0; display: grid; align-content: space-between; gap: 12px; padding: 20px; overflow: hidden; border: 1px solid var(--line); border-top: 5px solid var(--cat); border-radius: 8px; background: var(--surface); box-shadow: var(--shadow-card); animation: sz-card-in 480ms ease-out both; animation-delay: var(--enter-delay); }
.sz-question.is-percent { --cat: var(--sz-percent); }.sz-question.is-rank { --cat: var(--sz-rank); }.sz-question.is-assign { --cat: var(--sz-assign); }
.sz-question__top { display: grid; grid-template-columns: 44px minmax(0,1fr) 70px; align-items: center; gap: 12px; }
.sz-category-mark { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 50%; background: color-mix(in srgb, var(--cat) 16%, var(--surface)); color: var(--cat); font-size: 19px; font-weight: 950; }
.sz-question__top div:nth-child(2) { display: grid; gap: 2px; }.sz-question__top small { color: var(--cat); font-size: 12px; font-weight: 900; text-transform: uppercase; }.sz-question__top strong { color: var(--muted); font-size: 13px; }
.sz-question h2 { max-width: 93%; font: 650 23px/1.24 var(--font-display); letter-spacing: 0; }.sz-question > p { color: var(--muted); font-size: 14px; font-weight: 750; text-transform: uppercase; }
.sz-mini-scale { position: relative; display: flex; justify-content: space-between; align-items: end; height: 34px; border-bottom: 2px solid var(--cat); }.sz-mini-scale i { width: 2px; height: 8px; background: var(--cat); }.sz-mini-scale b { position: absolute; left: 54%; bottom: -6px; width: 12px; height: 12px; border-radius: 50%; background: var(--cat); }
.sz-mini-donut { width: 42px; aspect-ratio: 1; margin-left: auto; border-radius: 50%; background: conic-gradient(var(--cat) 0 68%, color-mix(in srgb, var(--cat) 15%, transparent) 68%); mask: radial-gradient(circle, transparent 43%, black 45%); }
.sz-mini-rank { display: grid; gap: 5px; justify-items: end; }.sz-mini-rank i { height: 5px; background: var(--cat); border-radius: 2px; }.sz-mini-rank i:nth-child(1){width:65px}.sz-mini-rank i:nth-child(2){width:49px}.sz-mini-rank i:nth-child(3){width:34px}
.sz-mini-venn { position: relative; width: 60px; height: 38px; }.sz-mini-venn i { position:absolute; width:36px; height:36px; border:3px solid var(--cat); border-radius:50%; }.sz-mini-venn i:last-child{left:22px;opacity:.62}
.sz-score-rail { grid-column: 2; grid-row: 2; min-height: 0; display: grid; grid-template-rows: auto auto minmax(0,1fr); gap: 14px; padding: 18px 18px 18px 4px; border-left: 1px solid var(--line); }
.sz-score-rail__head { display:flex; justify-content:space-between; align-items:center; }.sz-score-rail__head span{color:var(--muted);font-size:13px;font-weight:800;text-transform:uppercase}.sz-score-rail__head strong{font-size:20px}
.sz-progress-list { display:grid; grid-template-columns:1fr 1fr; gap:7px; }.sz-player-progress { min-width:0; display:grid; grid-template-columns:8px minmax(0,1fr) auto; align-items:center; gap:7px; padding:8px; border:1px solid var(--line); border-radius:6px; background:var(--surface-muted); opacity:.56; }.sz-player-progress.is-done{opacity:1;background:var(--surface)}.sz-player-progress i{width:8px;height:8px;border-radius:50%;background:var(--player)}.sz-player-progress span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:750}.sz-player-progress b{color:var(--sage-strong)}
.sz-standings { min-height:0; overflow:hidden; padding-top:12px; border-top:1px solid var(--line); }.sz-standings>p{margin-bottom:8px;color:var(--muted);font-size:12px;font-weight:900;text-transform:uppercase}.sz-standings>div{display:flex;justify-content:space-between;gap:10px;padding:8px 3px;border-bottom:1px solid var(--line)}.sz-standings span{display:flex;gap:8px;min-width:0;font-size:13px}.sz-standings span b{color:var(--muted);font-weight:650}.sz-standings>div>strong{font-variant-numeric:tabular-nums}

.sz-reveal { --cat: var(--sz-number); padding-top:94px; }.sz-reveal.is-percent{--cat:var(--sz-percent)}.sz-reveal.is-rank{--cat:var(--sz-rank)}.sz-reveal.is-assign{--cat:var(--sz-assign)}
.sz-reveal__main { height:calc(100% - 38px); display:grid; grid-template-columns:minmax(0, .92fr) minmax(480px, 1.08fr); gap:24px; padding:24px 32px 18px; }
.sz-reveal__question { align-self:center; padding-right:26px; }.sz-reveal__eyebrow{display:flex;align-items:flex-start;gap:13px;color:var(--ink-soft);font-size:19px;line-height:1.35}.sz-reveal__eyebrow span{flex:0 0 44px;width:44px;height:44px;display:grid;place-items:center;border-radius:50%;background:var(--cat);color:white;font-weight:950}.sz-reveal__question>p{margin-top:46px;color:var(--cat);font-size:13px;font-weight:950;text-transform:uppercase}.sz-reveal__question h1{margin-top:8px;font:700 50px/1.06 var(--font-display);letter-spacing:0;animation:sz-solution-in 520ms cubic-bezier(.16,.8,.28,1) both}.sz-reveal__question small{display:block;margin-top:22px;color:var(--muted)}
.sz-answer-board { align-self:center; display:grid; gap:8px; }.sz-answer-board>p{margin-bottom:3px;color:var(--muted);font-size:12px;font-weight:900;text-transform:uppercase}.sz-answer-row{display:grid;grid-template-columns:28px minmax(100px,.7fr) minmax(170px,1.3fr) auto 56px;align-items:center;gap:10px;padding:12px 14px;border:1px solid var(--line);border-left:6px solid var(--player);border-radius:7px;background:var(--surface);box-shadow:var(--shadow-card);animation:sz-row-in 420ms ease-out both;animation-delay:var(--row-delay)}.sz-answer-row__rank{color:var(--muted);font-weight:850}.sz-answer-row>strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sz-answer-row>span:nth-child(3){color:var(--ink-soft);font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sz-answer-row em{padding:3px 6px;border-radius:4px;background:var(--amber-soft);color:var(--ink);font-size:10px;font-style:normal;font-weight:900;text-transform:uppercase}.sz-answer-row>b{text-align:right;color:var(--cat);font-size:23px}
.sz-reveal-steps{position:absolute;inset:auto 32px 16px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.sz-reveal-steps i{height:6px;border-radius:3px;background:var(--line-strong);opacity:.45}.sz-reveal-steps i.is-active{opacity:1}.sz-reveal-steps .is-number{background:var(--sz-number)}.sz-reveal-steps .is-percent{background:var(--sz-percent)}.sz-reveal-steps .is-rank{background:var(--sz-rank)}.sz-reveal-steps .is-assign{background:var(--sz-assign)}

.sz-final { padding-top:94px; }.sz-final__title{padding:22px 32px 10px}.sz-final__title p{color:var(--muted);font-size:16px}.sz-final-board{display:grid;gap:9px;padding:10px 32px 26px}.sz-final-row{display:grid;grid-template-columns:42px 10px minmax(120px,.7fr) minmax(340px,1.5fr) 120px;align-items:center;gap:15px;min-height:58px;padding:10px 17px;border:1px solid var(--line);border-radius:7px;background:var(--surface);animation:sz-row-in 420ms ease-out both;animation-delay:var(--row-delay)}.sz-final-row.is-winner{min-height:72px;border-color:color-mix(in srgb,var(--player) 55%,var(--line));box-shadow:var(--shadow-panel)}.sz-final-row__place{font:700 24px var(--font-display);color:var(--muted)}.sz-final-row>i{width:10px;height:34px;border-radius:3px;background:var(--player)}.sz-final-row>strong{font-size:18px}.sz-final-row__breakdown{display:flex;gap:6px;flex-wrap:wrap}.sz-final-row__breakdown span{padding:5px 7px;border-radius:5px;background:var(--surface-muted);font-size:12px;font-weight:800}.sz-final-row__breakdown .is-number{color:var(--sz-number)}.sz-final-row__breakdown .is-percent{color:var(--sz-percent)}.sz-final-row__breakdown .is-rank{color:var(--sz-rank)}.sz-final-row__breakdown .is-assign{color:var(--sz-assign)}.sz-final-row>b{text-align:right;font-size:26px}.sz-final-row>b small{display:block;color:var(--muted);font-size:10px;text-transform:uppercase}

@keyframes sz-band-in{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes sz-card-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes sz-solution-in{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}
@keyframes sz-row-in{from{opacity:0;transform:translateX(26px)}to{opacity:1;transform:none}}
@media (max-width:1040px){.sz-host-header{grid-template-columns:1fr auto}.sz-round{display:none}.sz-play{grid-template-columns:minmax(0,1fr) 260px}.sz-question h2{font-size:20px}.sz-reveal__main{grid-template-columns:.8fr 1.2fr;padding-inline:22px}.sz-reveal__question h1{font-size:40px}.sz-final-row{grid-template-columns:38px 8px minmax(100px,.6fr) 1.4fr 100px}}
@media (max-height:680px){.sz-host-header{height:78px;padding-block:12px}.sz-play{grid-template-rows:78px minmax(0,1fr)}.sz-reveal,.sz-final{padding-top:78px}.sz-question-grid{padding-block:12px}.sz-question{padding:15px}.sz-question h2{font-size:19px}.sz-final__title{padding-block:12px 6px}.sz-final-board{gap:6px;padding-top:5px}.sz-final-row{min-height:48px;padding-block:7px}.sz-final-row.is-winner{min-height:58px}}
@media (prefers-reduced-motion:reduce){.sz-host *{animation-duration:.01ms!important;animation-delay:0ms!important}}
`;

export function installSchaetzoramaHostStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = css;
  document.head.appendChild(style);
}
