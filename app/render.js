// Rendering for the atlas: tracker cards, the detail panel, the five-stage
// roadmap and the missables board. Pure DOM building — no HTML strings for
// trophy data, so names and guides are always inserted as text.
import { isConcealed } from './state.js';

export const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];
export const KIND_LABEL = {
  platinum: 'Platinum', story: 'Story', missable: 'Missable',
  collectibles: 'Collectibles', activities: 'Activities', online: 'Online',
};
export const STAGES = [
  { n: 1, title: 'Run the Story', blurb: 'Play the campaign straight through: the prologue, four chapters, the named story missions and the finale. Story trophies cannot be missed — but hold the final mission until Stage 2 is done, because the credits close several stranger strands.' },
  { n: 2, title: 'Side Stories & Strangers', blurb: 'Finish every stranger strand, above all the five missable finals (Andy, Kenton, Billy, Randy, Tyrone) and Bret’s hunt. This is the only stage with a hard deadline: all of it must land before the final story mission.' },
  { n: 3, title: 'Collect the State', blurb: 'Sweep Leonida region by region: meditation spots (start these early — PowerPyx flags them missable), card sets, WAiNK photo spots, vehicle discoveries and full map exploration. Routes overlap, so one road trip can feed four counters at once.' },
  { n: 4, title: 'Activities & Mayhem', blurb: 'The long tail: stunts, the shooting range, races, robberies, partner jobs and the cryptic hidden one-offs. None of these can be missed, so chip away with the counters in this tracker until each target falls.' },
  { n: 5, title: 'Cleanup & the Platinum', blurb: 'No online trophies exist in this list, so cleanup is solo: chase the last percentage points to 100% Completion, confirm all seven missables are banked, and the platinum — Vice Got a Price! — unlocks on top.' },
];

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function formatCount(value, trophy) {
  const prefix = trophy.countPrefix ?? '';
  return prefix + Number(value).toLocaleString('en-US');
}

export function renderCards(container, trophies, state, selectedId, onSelect) {
  container.replaceChildren();
  if (!trophies.length) {
    container.append(el('p', 'empty-note', 'No trophies match. This list has no online trophies — everything here is earned solo or with your in-game partner.'));
    return;
  }
  for (const t of trophies) {
    const concealed = isConcealed(t, state);
    const card = el('article', 'card' + (state.earned[t.id] ? ' earned' : '') + (t.id === selectedId ? ' selected' : '') + (concealed ? ' concealed' : ''));
    const top = el('div', 'card-top');
    top.append(el('div', 'gem ' + t.grade));
    top.append(el('h3', concealed ? 'blur' : '', concealed ? 'Hidden trophy' : t.name));
    card.append(top);
    if (concealed) {
      card.append(el('p', 'hidden-note', 'Spoiler shielded — open to reveal.'));
    } else {
      card.append(el('p', 'desc', t.description));
    }
    const meta = el('div', 'meta');
    meta.append(el('span', 'pill grade-' + t.grade, t.grade));
    meta.append(el('span', 'pill', KIND_LABEL[t.kind] ?? t.kind));
    if (t.missable) meta.append(el('span', 'pill missable', '⚠ Missable'));
    if (t.count) {
      const cur = state.counters[t.id] ?? 0;
      meta.append(el('span', 'pill counter', formatCount(cur, t) + ' / ' + formatCount(t.count, t)));
    }
    if (state.earned[t.id]) meta.append(el('span', 'pill', '✓ Earned'));
    card.append(meta);
    card.addEventListener('click', () => onSelect(t.id));
    container.append(card);
  }
}

export function renderDetail(panel, trophy, state, handlers) {
  panel.replaceChildren();
  if (!trophy) {
    panel.append(el('p', 'guide-text', 'Pick a trophy from the list to read its guide.'));
    return;
  }
  const concealed = isConcealed(trophy, state);
  const head = el('div', 'detail-head');
  head.append(el('div', 'gem ' + trophy.grade));
  const titleWrap = el('div');
  titleWrap.append(el('h2', concealed ? 'blur' : '', concealed ? 'Hidden trophy' : trophy.name));
  const tags = el('div', 'detail-tags');
  tags.append(el('span', 'pill grade-' + trophy.grade, trophy.grade));
  tags.append(el('span', 'pill', KIND_LABEL[trophy.kind] ?? trophy.kind));
  tags.append(el('span', 'pill', 'Roadmap stage ' + trophy.stage));
  if (trophy.hidden) tags.append(el('span', 'pill', 'Hidden on PSN'));
  if (trophy.missable) tags.append(el('span', 'pill missable', '⚠ Missable'));
  titleWrap.append(tags);
  head.append(titleWrap);
  panel.append(head);

  if (concealed) {
    panel.append(el('p', 'block-label', 'Spoiler shield'));
    panel.append(el('p', 'guide-text', 'This trophy is hidden on PlayStation until earned, and your spoiler shield is on. Reveal it here, mark it earned, or switch the shield off in the header to see everything.'));
    const reveal = el('button', 'reveal-btn', 'Reveal this trophy');
    reveal.type = 'button';
    reveal.addEventListener('click', () => handlers.onReveal(trophy.id));
    panel.append(reveal);
    return;
  }

  panel.append(el('p', 'block-label', 'Official description'));
  panel.append(el('p', 'official-desc', trophy.description));
  panel.append(el('p', 'block-label', 'Guide'));
  panel.append(el('p', 'guide-text', trophy.guide));
  panel.append(el('p', 'block-label', 'Sources'));
  const sources = el('p', 'sources-line');
  const strong = el('strong', '', 'Sources: ');
  sources.append(strong, document.createTextNode(trophy.sources.join(' · ')));
  panel.append(sources);

  if (trophy.missable && trophy.ponr) {
    const warn = el('div', 'warn-box');
    warn.append(el('p', 'block-label', '⚠ Missable — point of no return'));
    warn.append(el('p', '', trophy.ponr));
    panel.append(warn);
  }

  if (trophy.count) {
    panel.append(el('p', 'block-label', 'Progress counter'));
    const row = el('div', 'counter-row');
    const step = trophy.countStep ?? 1;
    const current = state.counters[trophy.id] ?? 0;
    const minus = el('button', '', '−');
    minus.type = 'button';
    minus.addEventListener('click', () => handlers.onCounter(trophy.id, Math.max(0, current - step)));
    const value = el('span', 'counter-value');
    value.append(document.createTextNode(formatCount(current, trophy) + ' '));
    value.append(el('span', '', '/ ' + formatCount(trophy.count, trophy)));
    const plus = el('button', '', '+');
    plus.type = 'button';
    plus.addEventListener('click', () => handlers.onCounter(trophy.id, Math.min(trophy.count, current + step)));
    row.append(minus, value, plus);
    panel.append(row);
  }

  const earn = el('button', 'earn-btn' + (state.earned[trophy.id] ? ' is-earned' : ''), state.earned[trophy.id] ? '✓ Earned — click to undo' : 'Mark as earned');
  earn.type = 'button';
  earn.addEventListener('click', () => handlers.onToggleEarned(trophy.id));
  panel.append(earn);
}

export function renderRoadmap(container, trophies, state, onSelect) {
  container.replaceChildren();
  for (const stage of STAGES) {
    const inStage = trophies.filter((t) => t.stage === stage.n);
    const done = inStage.filter((t) => state.earned[t.id]).length;
    const box = el('div', 'stage');
    const head = el('div', 'stage-head');
    head.append(el('span', 'stage-num', 'STAGE ' + stage.n));
    head.append(el('h3', '', stage.title));
    const prog = el('span', 'stage-progress');
    prog.append(el('strong', '', done + '/' + inStage.length), document.createTextNode(' earned'));
    head.append(prog);
    box.append(head);
    box.append(el('p', '', stage.blurb));
    const chips = el('div', 'stage-chips');
    for (const t of inStage) {
      const chip = el('button', 'tchip' + (state.earned[t.id] ? ' done' : ''), '');
      chip.type = 'button';
      const dot = el('span', 'dot');
      dot.style.background = 'var(--' + t.grade + ')';
      chip.append(dot, document.createTextNode(isConcealed(t, state) ? 'Hidden trophy' : t.name));
      chip.addEventListener('click', () => onSelect(t.id));
      chips.append(chip);
    }
    box.append(chips);
    container.append(box);
  }
}

export function renderMissables(container, trophies, state, onSelect) {
  container.replaceChildren();
  for (const t of trophies.filter((x) => x.missable)) {
    const concealed = isConcealed(t, state);
    const card = el('article', 'miss-card');
    card.append(el('h3', concealed ? 'blur' : '', (state.earned[t.id] ? '✓ ' : '⚠ ') + (concealed ? 'Hidden trophy' : t.name)));
    card.append(el('p', 'desc', concealed ? 'Shielded by the spoiler setting.' : t.description));
    if (!concealed) {
      card.append(el('p', 'guide-text', t.guide));
      if (t.ponr) {
        const ponr = el('div', 'ponr');
        ponr.append(el('strong', '', 'Point of no return'));
        ponr.append(document.createTextNode(t.ponr));
        card.append(ponr);
      }
      const sources = el('p', 'sources-line');
      sources.append(el('strong', '', 'Sources: '), document.createTextNode(t.sources.join(' · ')));
      card.append(sources);
    }
    card.addEventListener('click', () => onSelect(t.id));
    container.append(card);
  }
}
