import React from 'react';
import usePokerStore, { getStackGroups } from '../store/usePokerStore';

const StackSelector = () => {
  const { mode, stack, setStack } = usePokerStore();
  const groups = getStackGroups(mode);

  return (
    <div className="bg-zinc-800/40 p-4 sm:p-5 rounded-2xl border border-zinc-700/50 shadow-xl backdrop-blur-md">
      <h2 className="text-base font-semibold mb-3 text-zinc-200 flex items-center gap-2">
        <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Глубина стека
        <span className="ml-auto text-xs font-mono bg-zinc-900/80 border border-zinc-700 rounded-md px-2 py-0.5 text-amber-400">
          {stack}bb
        </span>
      </h2>

      <div className="flex flex-col gap-3">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 mb-1.5 pl-0.5">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {group.stacks.map((s) => {
                const isActive = stack === String(s);
                return (
                  <button
                    key={s}
                    onClick={() => setStack(String(s))}
                    className={`
                      min-w-[2.4rem] px-2 py-1.5 rounded-lg text-xs font-bold
                      border transition-all duration-200 cursor-pointer
                      ${isActive
                        ? group.activeAccent
                        : `${group.inactiveAccent} hover:brightness-125`
                      }
                    `}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StackSelector;
