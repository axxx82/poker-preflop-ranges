import { create } from 'zustand';

export const isPushFoldAvailable = (mode, stack) => {
  const stackNum = parseInt(stack, 10);
  if (mode === 'MTT') return stackNum <= 12;
  if (mode === 'Cash') return stackNum <= 5;
  return false;
};

export const getStackGroups = (mode) => {
  const pushThreshold = mode === 'MTT' ? 15 : 5;
  const allLowStacks = [24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8];
  
  const shortStacks = allLowStacks.filter(s => s > pushThreshold);
  const pushStacks = allLowStacks.filter(s => s <= pushThreshold);

  const groups = [
    {
      label: 'Крупные (>40bb)',
      stacks: [200, 150, 100, 80, 60, 50, 40],
      activeAccent: 'bg-slate-500 border-slate-400 text-white shadow-[0_0_12px_rgba(100,116,139,0.5)]',
      inactiveAccent: 'bg-zinc-900/70 text-slate-400 border-slate-700/40',
    },
    {
      label: 'Средние (25–35bb)',
      stacks: [35, 30, 25],
      activeAccent: 'bg-blue-700 border-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]',
      inactiveAccent: 'bg-zinc-900/70 text-blue-400 border-blue-800/40',
    }
  ];

  if (shortStacks.length > 0) {
    groups.push({
      label: `Шорт-стек (${shortStacks[shortStacks.length - 1]}–${shortStacks[0]}bb)`,
      stacks: shortStacks,
      activeAccent: 'bg-violet-700 border-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]',
      inactiveAccent: 'bg-zinc-900/70 text-violet-400 border-violet-900/40',
    });
  }

  if (pushStacks.length > 0) {
    groups.push({
      label: `Пуш/Фолд (≤${pushStacks[0]}bb)`,
      stacks: pushStacks,
      activeAccent: 'bg-amber-600 border-amber-400 text-white shadow-[0_0_12px_rgba(217,119,6,0.5)]',
      inactiveAccent: 'bg-zinc-900/70 text-amber-400/80 border-amber-900/40',
    });
  }

  return groups;
};

const usePokerStore = create((set) => ({
  mode: 'MTT',
  position: 'BTN',
  stack: '100',
  scenario: 'RFI',
  villainPos: 'BTN',

  setMode: (mode) => set((state) => {
    let nextScenario = state.scenario;
    if (nextScenario === 'PUSH3B' && !isPushFoldAvailable(mode, state.stack)) {
      nextScenario = 'RFI';
    }
    return { mode, scenario: nextScenario };
  }),
  
  setPosition: (position) => set({ position }),
  
  setStack: (stack) => set((state) => {
    let nextScenario = state.scenario;
    if (nextScenario === 'PUSH3B' && !isPushFoldAvailable(state.mode, stack)) {
      nextScenario = 'RFI';
    }
    return { stack, scenario: nextScenario };
  }),
  
  setScenario: (scenario) => set({ scenario }),
  setVillainPos: (villainPos) => set({ villainPos }),
}));

export default usePokerStore;
