// Leonida Platinum Atlas — boot and wiring: loads the trophy data, owns the
// filter/selection state, and connects the store and renderers to the page.
import { loadState, saveState, exportState, parseImportedState } from './state.js';
import { renderCards, renderDetail, renderRoadmap, renderMissables } from './render.js';

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));

let state = loadState();
let selectedId = 22; // Road to Rehabilitation — a missable with a full guide, shown first.
let view = 'tracker';
const filters = { query: '', state: 'all', kind: 'all', grade: 'all' };

const grid = document.getElementById('card-grid');
const detail = document.getElementById('detail-panel');

function matches(t) {
  if (filters.state === 'earned' && !state.earned[t.id]) return false;
  if (filters.state === 'missing' && state.earned[t.id]) return false;
  if (filters.kind !== 'all' && t.kind !== filters.kind) return false;
  if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
  if (filters.query) {
    const q = filters.query.toLowerCase();
    const hay = (t.name + ' ' + t.description + ' ' + t.guide).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function renderProgress() {
  const earned = trophies.filter((t) => state.earned[t.id]).length;
  document.getElementById('progress-count').textContent = earned + '/' + trophies.length;
  const pct = Math.round((earned / trophies.length) * 100);
  document.getElementById('progress-pct').textContent = pct + '%';
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('shield-toggle').textContent = 'Spoiler shield: ' + (state.shield ? 'ON' : 'OFF');
}

function render() {
  renderProgress();
  const visible = trophies.filter(matches);
  document.getElementById('result-count').textContent = 'Showing ' + visible.length + ' of ' + trophies.length + ' trophies';
  renderCards(grid, visible, state, selectedId, selectTrophy);
  renderDetail(detail, byId.get(selectedId), state, handlers);
  renderRoadmap(document.getElementById('roadmap-list'), trophies, state, selectTrophy);
  renderMissables(document.getElementById('missable-list'), trophies, state, selectTrophy);
}

function selectTrophy(id) {
  selectedId = id;
  if (view !== 'tracker') switchView('tracker');
  render();
  detail.scrollIntoView({ block: 'nearest' });
}

const handlers = {
  onToggleEarned(id) {
    if (state.earned[id]) delete state.earned[id];
    else state.earned[id] = true;
    saveState(state);
    render();
  },
  onCounter(id, value) {
    state.counters[id] = value;
    saveState(state);
    render();
  },
  onReveal(id) {
    state.revealed[id] = true;
    saveState(state);
    render();
  },
};

function switchView(next) {
  view = next;
  for (const tab of document.querySelectorAll('#view-tabs .tab')) {
    tab.classList.toggle('active', tab.dataset.view === next);
  }
  document.getElementById('view-tracker').hidden = next !== 'tracker';
  document.getElementById('view-roadmap').hidden = next !== 'roadmap';
  document.getElementById('view-missables').hidden = next !== 'missables';
}

for (const tab of document.querySelectorAll('#view-tabs .tab')) {
  tab.addEventListener('click', () => switchView(tab.dataset.view));
}
document.getElementById('search').addEventListener('input', (e) => {
  filters.query = e.target.value.trim();
  render();
});
for (const chip of document.querySelectorAll('#state-chips .chip')) {
  chip.addEventListener('click', () => {
    filters.state = chip.dataset.state;
    for (const c of document.querySelectorAll('#state-chips .chip')) c.classList.toggle('active', c === chip);
    render();
  });
}
for (const chip of document.querySelectorAll('#kind-chips .chip')) {
  chip.addEventListener('click', () => {
    filters.kind = chip.dataset.kind;
    for (const c of document.querySelectorAll('#kind-chips .chip')) c.classList.toggle('active', c === chip);
    render();
  });
}
document.getElementById('grade-filter').addEventListener('change', (e) => {
  filters.grade = e.target.value;
  render();
});
document.getElementById('shield-toggle').addEventListener('click', () => {
  state.shield = !state.shield;
  saveState(state);
  render();
});
document.getElementById('export-btn').addEventListener('click', () => exportState(state));
document.getElementById('import-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    state = parseImportedState(await file.text());
    saveState(state);
    render();
  } catch {
    alert('That file is not a Leonida Platinum Atlas progress export.');
  }
  e.target.value = '';
});

render();
