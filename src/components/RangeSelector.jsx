// src/components/RangeSelector.jsx
import React, { useState, useEffect } from 'react';
import expandRangeString from '../utils/rangeParser';
import data from '../data/data.json';
import usePokerStore from '../store/usePokerStore';

// ─── Defense options per hero position (MTT) ─────────────────────────────────
const DEFENSE_MAP_MTT = {
  MP:  ['MP vs EP'],
  HJ:  ['HJ vs EP', 'HJ vs MP'],
  CO:  ['CO vs EP', 'CO vs MP', 'CO vs HJ'],
  BTN: ['BTN vs EP', 'BTN vs MP', 'BTN vs HJ', 'BTN vs CO'],
  SB:  ['SB vs EP', 'SB vs MP', 'SB vs HJ', 'SB vs CO', 'SB vs BTN'],
  BB:  ['BB vs EP', 'BB vs MP', 'BB vs HJ', 'BB vs CO', 'BB vs BTN', 'BB vs SB'],
};

// ─── Defense options per hero position (Cash) ─────────────────────────────────
const DEFENSE_MAP_CASH = {
  MP:  ['MP vs EP'],
  HJ:  ['HJ vs EP', 'HJ vs MP'],
  CO:  ['CO vs EP', 'CO vs MP', 'CO vs HJ'],
  BTN: ['BTN vs EP', 'BTN vs MP', 'BTN vs HJ', 'BTN vs CO'],
  SB:  ['SB vs EP', 'SB vs MP', 'SB vs HJ', 'SB vs CO', 'SB vs BTN'],
  BB:  ['BB vs EP', 'BB vs MP', 'BB vs HJ', 'BB vs CO', 'BB vs BTN', 'BB vs SB'],
};

// ─── MTT Push/Fold threshold ──────────────────────────────────────────────────
const MTT_PUSH_FOLD_THRESHOLD = 12;

// ─── Stack lists per mode ─────────────────────────────────────────────────────
const STACKS_MTT = [
  '100bb', '80bb', '60bb', '50bb', '40bb', '35bb', '30bb', '25bb',
  '20bb', '17bb', '14bb', '12bb', '10bb', '9bb', '8bb', '7bb', '6bb', '5bb', '4bb', '3bb', '2bb',
];
const STACKS_CASH = [
  '250bb', '200bb', '100bb', '80bb', '60bb', '50bb', '40bb', '30bb', '20bb', '15bb', '10bb',
];

const RangeSelector = ({ onSelect }) => {
  const { mode, position, stack, setStack } = usePokerStore();
  const [currentAction, setCurrentAction] = useState('Attack');
  const [selectedVillainPos, setSelectedVillainPos] = useState('');
  const [pushFoldAction, setPushFoldAction] = useState(null); // 'push' | null

  const stacks = mode === 'MTT' ? STACKS_MTT : STACKS_CASH;
  const numericStack = parseInt(stack.replace('bb', ''), 10);
  const isPushFoldMode = mode === 'MTT' && numericStack <= MTT_PUSH_FOLD_THRESHOLD;
  const defenseOptionsRaw = (mode === 'MTT' ? DEFENSE_MAP_MTT : DEFENSE_MAP_CASH)[position] ?? [];
  const villainOptions = defenseOptionsRaw.map(opt => opt.split('vs')[1].trim());

  useEffect(() => {
    if (!stacks.includes(stack)) setStack('100bb');
  }, [mode, stacks, stack, setStack]);

  useEffect(() => {
    console.log("ACTION_CHANGED_TO:", currentAction);
    if (currentAction === 'Attack') {
      setSelectedVillainPos('None'); 
    } else {
      setSelectedVillainPos('');
    }
  }, [currentAction]);

  useEffect(() => {
    // Re-fetch on key changes
    handleDataFetch();
  }, [position, stack, currentAction, selectedVillainPos, mode]);

  useEffect(() => {
    if (!isPushFoldMode) setPushFoldAction(null);
  }, [isPushFoldMode]);

  // ── Range lookup ─────────────────────────────────────────────────────────────
  const handleDataFetch = () => {
    if (currentAction === 'Defense' && (!selectedVillainPos || selectedVillainPos === 'None')) {
      onSelect({ hands: [] });
      return;
    }

    if (mode === 'Cash') {
      const activeRange = data.find(item => {
        return (
          item.mode === "Cash" &&
          item.stack === stack &&
          item.heroPos === position &&
          item.action === currentAction &&
          (currentAction === "Defense" ? item.villainPos === selectedVillainPos : true)
        );
      });
      
      console.log("DEBUG_FILTER:", { selectedHeroPos: position, currentAction, selectedVillainPos, found: !!activeRange });

      if (!activeRange) {
        onSelect({ hands: [] });
        return;
      }

      const multiColorHands = [];
      if (currentAction === 'Attack') {
        const parsed = expandRangeString(activeRange.data || '');
        parsed.forEach(hand => multiColorHands.push({ hand, color: '#10b981', action: 'RFI' })); 
      } else {
        if (activeRange.call) expandRangeString(activeRange.call).forEach(hand => multiColorHands.push({ hand, color: '#2ecc71', action: 'Call' }));
        if (activeRange.value) expandRangeString(activeRange.value).forEach(hand => multiColorHands.push({ hand, color: '#e74c3c', action: 'Value' }));
        if (activeRange.bluff) expandRangeString(activeRange.bluff).forEach(hand => multiColorHands.push({ hand, color: '#3498db', action: 'Bluff' }));
        if (activeRange.coldCall) expandRangeString(activeRange.coldCall).forEach(hand => multiColorHands.push({ hand, color: '#f1c40f', action: 'Cold Call' }));
      }

      onSelect({ category: `Cash-${stack}`, type: currentAction, hands: multiColorHands });
      return;
    }

    // Standard MTT Logic Fallback
    const mttType = currentAction === 'Attack' ? `RFI ${position}` : `${position} vs ${selectedVillainPos}`;
    const exactCategory = `${mode}-${stack}`;
    let entry = data.find(i => i.category === exactCategory && i.type === mttType);
    if (!entry) entry = data.find(i => i.category === stack && i.type === mttType);
    
    if (!entry) { onSelect({ hands: [] }); return; }
    onSelect({ category: entry.category, type: mttType, hands: expandRangeString(entry.data) });
  };

  const handlePush = () => {
    if (pushFoldAction === 'push') { 
      setPushFoldAction(null); 
      onSelect({ hands: [] }); 
    } else { 
      setPushFoldAction('push'); 
      const mttType = `Push ${position}`;
      let entry = data.find(i => i.category === `${mode}-${stack}` && i.type === mttType);
      if (!entry) entry = data.find(i => i.category === stack && i.type === mttType);
      onSelect({ category: stack, type: mttType, hands: expandRangeString(entry ? entry.data : '') });
    }
  };
  const handleFold = () => { setPushFoldAction(null); onSelect({ hands: [] }); };

  return (
    <div className="bg-zinc-800/40 p-3 sm:p-4 rounded-2xl border border-zinc-700/50 mb-4 w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">

        {/* ── Stack selector ── */}
        <select
          className={`col-span-2 md:col-span-1 relative z-10 bg-zinc-900 border font-medium rounded-lg px-3 py-2 min-h-[44px] outline-none transition-colors cursor-pointer ${
            isPushFoldMode
              ? 'border-amber-500/60 text-amber-300 focus:border-amber-400'
              : 'border-zinc-700 text-zinc-100 focus:border-indigo-500'
          }`}
          value={stack}
          onChange={e => {
            setStack(e.target.value);
            setPushFoldAction(null);
            onSelect({ hands: [] });
          }}
        >
          <option value="" disabled>Стек</option>

          {mode === 'MTT' ? (
            <>
              <optgroup label="─── Стандартный режим ──────">
                {STACKS_MTT.filter(s => parseInt(s) > MTT_PUSH_FOLD_THRESHOLD)
                  .map(s => <option key={s} value={s}>{s}</option>)}
              </optgroup>
              <optgroup label="─── Push / Fold (≤ 12bb) ───">
                {STACKS_MTT.filter(s => parseInt(s) <= MTT_PUSH_FOLD_THRESHOLD)
                  .map(s => <option key={s} value={s}>⚡ {s}</option>)}
              </optgroup>
            </>
          ) : (
            STACKS_CASH.map(s => <option key={s} value={s}>{s}</option>)
          )}
        </select>

        {/* ── Push/Fold panel (MTT ≤ 12bb) ── */}
        {isPushFoldMode ? (
          <div className="col-span-2 md:col-span-2 flex gap-3">
            <div className="flex items-center px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold tracking-widest whitespace-nowrap">
              ⚡ PUSH/FOLD
            </div>
            <button
              onClick={handlePush}
              className={`flex-1 rounded-xl font-bold text-sm transition-all duration-200 border ${
                pushFoldAction === 'push'
                  ? 'bg-amber-500 border-amber-400 text-zinc-900 shadow-[0_0_14px_rgba(245,158,11,0.5)]'
                  : 'bg-zinc-900 border-zinc-700 text-amber-300 hover:border-amber-500/60 hover:bg-amber-500/10'
              }`}
            >
              📤 Push {position}
            </button>
            <button
              onClick={handleFold}
              className={`flex-1 rounded-xl font-bold text-sm transition-all duration-200 border ${
                pushFoldAction === null
                  ? 'bg-zinc-700 border-zinc-600 text-zinc-300 shadow-inner'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:bg-zinc-800'
              }`}
            >
              🚫 Fold
            </button>
          </div>
        ) : (
          <div className="col-span-2 md:col-span-2 flex flex-col md:flex-row gap-3">
            {/* ── Action Toggle Buttons ── */}
            <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-700 md:flex-shrink-0">
              <button 
                onClick={() => setCurrentAction('Attack')}
                className={`flex-1 md:flex-none md:px-5 flex items-center justify-center rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer py-1.5 ${
                  currentAction === 'Attack' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                Attack
              </button>
              <button 
                onClick={() => setCurrentAction('Defense')}
                className={`flex-1 md:flex-none md:px-5 flex items-center justify-center rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer py-1.5 ${
                  currentAction === 'Defense' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                Defense
              </button>
            </div>

            {/* ── Villain Dropdown (Defense Only) ── */}
            <div className="relative z-10 flex-1 min-w-0">
              {currentAction === 'Defense' ? (
                <select
                  className={`w-full bg-zinc-900 border text-zinc-100 font-medium rounded-lg px-2 sm:px-3 py-2 outline-none transition-colors text-sm sm:text-base ${
                    villainOptions.length === 0
                      ? 'border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                      : 'border-zinc-700 cursor-pointer focus:border-indigo-500'
                  }`}
                  value={selectedVillainPos}
                  onChange={(e) => setSelectedVillainPos(e.target.value)}
                  disabled={villainOptions.length === 0}
                >
                  <option value="">{villainOptions.length === 0 ? `Не защищает ${position}` : 'Оппонент...'}</option>
                  {villainOptions.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              ) : (
                <div className="flex items-center h-full text-zinc-500 text-sm px-2">
                  RFI {position} (Нападение)
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RangeSelector;
