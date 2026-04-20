import React from 'react';
import usePokerStore, { isPushFoldAvailable } from '../store/usePokerStore';

const SCENARIOS = [
  { key: 'RFI',      label: 'RFI',          sublabel: 'Я открываюсь', color: 'emerald' },
  { key: 'VSRFI',   label: 'Vs Рейз',       sublabel: 'Защита/3-бет',  color: 'blue'    },
  { key: 'PUSH3B',  label: '3-Бет Пуш',    sublabel: 'Короткий стек', color: 'red'     },
];

const COLOR_MAP = {
  emerald: { active: 'bg-emerald-600 border-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.45)]', inactive: 'text-emerald-400 border-emerald-900/40' },
  blue:    { active: 'bg-blue-600 border-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.45)]',       inactive: 'text-blue-400 border-blue-900/40'        },
  red:     { active: 'bg-red-600 border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.45)]',          inactive: 'text-red-400 border-red-900/40'           },
};

const ScenarioSelector = () => {
  const { mode, stack, scenario, setScenario, villainPos, setVillainPos, position: heroPos } = usePokerStore();
  const POSITIONS = ['UTG', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
  const validVillains = POSITIONS.filter(p => p !== heroPos);
  
  const canPushFold = isPushFoldAvailable(mode, stack);

  return (
    <div className="bg-zinc-800/40 p-4 sm:p-5 rounded-2xl border border-zinc-700/50 shadow-xl backdrop-blur-md flex flex-col gap-4">
      {/* Scenario tabs */}
      <div>
        <h2 className="text-base font-semibold mb-3 text-zinc-200 flex items-center gap-2">
          <svg className="w-4 h-4 text-violet-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Сценарий
        </h2>
        <div className="flex flex-col gap-1.5">
          {SCENARIOS.map(({ key, label, sublabel, color }) => {
            const isActive = scenario === key;
            const cls = COLOR_MAP[color];
            const isDisabled = key === 'PUSH3B' && !canPushFold;

            return (
              <button
                key={key}
                disabled={isDisabled}
                title={isDisabled ? `Пуш-Фолд недоступен для стека ${stack}bb в режиме ${mode}` : ''}
                onClick={() => setScenario(key)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                  isDisabled ? 'opacity-30 cursor-not-allowed grayscale' :
                  isActive ? `${cls.active} text-white` : `bg-zinc-900/60 ${cls.inactive} hover:brightness-125`
                }`}
              >
                <span>{label}</span>
                <span className={`text-[11px] font-medium ${isActive ? 'text-white/70' : 'opacity-60'}`}>{sublabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Villain position (only for Vs Raise) */}
      {scenario === 'VSRFI' && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">Позиция рейзера</p>
          <div className="flex flex-wrap gap-1.5">
            {validVillains.map(pos => (
              <button
                key={pos}
                onClick={() => setVillainPos(pos)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
                  villainPos === pos
                    ? 'bg-orange-600 border-orange-500 text-white shadow-[0_0_10px_rgba(234,88,12,0.4)]'
                    : 'bg-zinc-900/70 text-orange-400 border-orange-900/40 hover:brightness-125'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioSelector;
