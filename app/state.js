// Progress store for the Leonida Platinum Atlas: earned flags, counters, spoiler
// reveals and the shield setting, persisted in localStorage and exportable as JSON.
const STORAGE_KEY = 'leonida-platinum-atlas-v4';

export function defaultState() {
  return { earned: {}, counters: {}, revealed: {}, shield: true };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return {
      earned: parsed.earned ?? {},
      counters: parsed.counters ?? {},
      revealed: parsed.revealed ?? {},
      shield: parsed.shield !== false,
    };
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function isConcealed(trophy, state) {
  return Boolean(trophy.hidden && state.shield && !state.revealed[trophy.id] && !state.earned[trophy.id]);
}

export function exportState(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'leonida-tracker-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

export function parseImportedState(text) {
  const parsed = JSON.parse(text);
  if (typeof parsed !== 'object' || parsed === null) throw new Error('not a progress file');
  return {
    earned: parsed.earned ?? {},
    counters: parsed.counters ?? {},
    revealed: parsed.revealed ?? {},
    shield: parsed.shield !== false,
  };
}
