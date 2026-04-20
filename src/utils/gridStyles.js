import { getRFIRange, getVsRFIRange } from '../data/rangeGenerator';

export function getGridData(mode, stack, heroPos, villainPos, scenario) {
  let rfiSet = new Set(), pushSet = new Set(), callSet = new Set(), threebetSet = new Set(), mixedRfiMap = new Map();

  if (scenario === 'VSRFI') {
    const { CALL, THREEBET } = getVsRFIRange(mode, stack, heroPos, villainPos);
    callSet = new Set(CALL);
    threebetSet = new Set(THREEBET);
  } else if (scenario === 'PUSH3B') {
    const { RFI, PUSH } = getRFIRange(mode, stack, heroPos);
    rfiSet = new Set(RFI);
    pushSet = new Set(PUSH);
  } else {
    const { RFI, PUSH, MIXED } = getRFIRange(mode, stack, heroPos);
    rfiSet = new Set(RFI);
    pushSet = new Set(PUSH);
    if (MIXED && MIXED.length > 0) {
      MIXED.forEach(({ hand, freq }) => mixedRfiMap.set(hand, freq));
    }
  }

  return { rfiSet, pushSet, callSet, threebetSet, mixedRfiMap };
}

const BASE = {
  rfi:      { bg: 'bg-emerald-600/85', border: 'border-emerald-500/60', text: 'text-white', glow: 'shadow-[0_0_5px_rgba(16,185,129,0.5)]', hover: 'hover:bg-emerald-500' },
  push:     { bg: 'bg-red-600/85',     border: 'border-red-500/60',     text: 'text-white', glow: 'shadow-[0_0_5px_rgba(239,68,68,0.5)]',    hover: 'hover:bg-red-500'     },
  call:     { bg: 'bg-blue-600/85',    border: 'border-blue-500/60',    text: 'text-white', glow: 'shadow-[0_0_5px_rgba(59,130,246,0.5)]',   hover: 'hover:bg-blue-500'    },
  threebet: { bg: 'bg-orange-600/85',  border: 'border-orange-500/60',  text: 'text-white', glow: 'shadow-[0_0_5px_rgba(234,88,12,0.5)]',    hover: 'hover:bg-orange-500'  },
  none:     { bg: 'bg-zinc-800/70',    border: 'border-zinc-700/30',    text: 'text-zinc-500', glow: '', hover: 'hover:bg-zinc-600 hover:text-zinc-200' },
};

export function getComboType(combo, scenario, gridData) {
  const { rfiSet, pushSet, callSet, threebetSet, mixedRfiMap } = gridData;
  if (scenario === 'VSRFI') {
    if (threebetSet.has(combo) && callSet.has(combo)) return 'mixed';
    if (threebetSet.has(combo)) return 'threebet';
    if (callSet.has(combo)) return 'call';
  } else {
    if (pushSet.has(combo)) return 'push';
    if (rfiSet.has(combo)) {
      if (mixedRfiMap.has(combo)) return 'mixed_rfi';
      return 'rfi';
    }
  }
  return 'none';
}

export function getComboStyle(combo, state, gridData) {
  const type = getComboType(combo, state.scenario, gridData);
  const isMixed = type === 'mixed';
  const isMixedRfi = type === 'mixed_rfi';
  const style = (isMixed || isMixedRfi) ? BASE.rfi : (BASE[type] ?? BASE.none);

  const className = `relative flex items-center justify-center overflow-hidden aspect-square text-[7px] min-[400px]:text-[9px] sm:text-[10px] xl:text-xs font-bold cursor-pointer select-none border-[0.5px] border-black/10 transition-all duration-200 ease-in-out ${style.glow} ${(isMixed || isMixedRfi) ? 'text-white' : `${style.bg} ${style.text}`} hover:brightness-125 active:scale-95`;

  let inlineStyle = undefined;
  if (isMixed) {
    inlineStyle = { background: 'linear-gradient(135deg, #ea580c 50%, #2563eb 50%)' };
  } else if (isMixedRfi) {
    const w = Math.round((gridData.mixedRfiMap.get(combo) ?? 0) * 100);
    inlineStyle = { background: `linear-gradient(135deg, #059669 ${w}%, #27272a ${w}%)` };
  }

  return { className, inlineStyle, type };
}

export function getComboSubtext(combo, state, gridData) {
  const type = getComboType(combo, state.scenario, gridData);
  if (type === 'rfi') return '· RFI';
  if (type === 'mixed_rfi') return `· Микс ${Math.round((gridData.mixedRfiMap.get(combo) ?? 0) * 100)}% RFI`;
  if (type === 'push') return '· Пуш';
  if (type === 'call') return '· Колл';
  if (type === 'threebet') return '· 3-Бет';
  if (type === 'mixed') return '· Микс (3-Бет / Колл)';
  if (type === 'none') return '· Фолд';
  return '';
}

export function getLegend(scenario, gridData) {
  if (scenario === 'VSRFI') {
    return [
      { color: 'bg-orange-600', label: '3-Бет' },
      { color: 'bg-blue-600',   label: 'Колл' },
      { bg: 'linear-gradient(to right, #ea580c 50%, #2563eb 50%)', label: 'Миксовать', isGrad: true },
      { color: 'bg-zinc-700',   label: 'Фолд' },
    ];
  } else {
    return [
      { color: 'bg-emerald-600', label: 'RFI (Открытие)' },
      ...(gridData.mixedRfiMap.size > 0 ? [{ bg: 'linear-gradient(135deg, #059669 50%, #27272a 50%)', label: 'Микс (частичный рейз)', isGrad: true }] : []),
      { color: 'bg-red-600',     label: 'Push / Олл-ин'  },
      { color: 'bg-zinc-700',    label: 'Фолд'            },
    ];
  }
}
