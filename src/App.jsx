import React, { useState } from 'react';
import PokerGrid from './components/PokerGrid';

import usePokerStore from './store/usePokerStore';
import RangeSelector from './components/RangeSelector';

function App() {
  const { mode, position, stack, setMode, setPosition } = usePokerStore();
  const [highlightHands, setHighlightHands] = useState([]);

  const positions = ['UTG', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col items-center p-1 sm:p-5 lg:p-7">
      <header className="mb-5 text-center mt-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-1 tracking-tight">
          Календарь дней рождений
        </h1>
        <p className="text-zinc-400 text-sm font-medium">Планировщик мероприятий</p>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4 lg:gap-5">
        {/* Left Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">

          {/* Mode Toggle */}
          <div className="bg-zinc-800/40 p-4 rounded-2xl border border-zinc-700/50 shadow-xl backdrop-blur-md">
            <h2 className="text-base font-semibold mb-3 text-zinc-200 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Режим игры
            </h2>
            <div className="flex p-1 bg-zinc-900/80 rounded-xl border border-zinc-800/50">
              {['MTT', 'Cash'].map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    mode === m
                      ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80'
                  }`}
                >{m}</button>
              ))}
            </div>
          </div>

          {/* Position Selection */}
          <div className="bg-zinc-800/40 p-4 rounded-2xl border border-zinc-700/50 shadow-xl backdrop-blur-md">
            <h2 className="text-base font-semibold mb-3 text-zinc-200 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Позиция
            </h2>
            <div className="grid grid-cols-4 gap-1.5">
              {positions.map((pos) => (
                <button key={pos} onClick={() => setPosition(pos)}
                  className={`py-2.5 px-1 rounded-xl text-xs font-bold transition-all duration-300 border ${
                    position === pos
                      ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                      : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >{pos}</button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Range Selector + Grid */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <RangeSelector onSelect={obj => setHighlightHands(obj.hands)} />
          <div className="bg-zinc-800/40 p-2 sm:p-5 rounded-2xl border border-zinc-700/50 shadow-xl backdrop-blur-md flex flex-col">

          <div className="w-full flex flex-wrap justify-between items-center mb-4 gap-2">
            <h2 className="text-base font-semibold text-zinc-200 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Календарь
            </h2>
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="px-2.5 py-1 bg-zinc-900/80 rounded-lg border border-zinc-700/80 font-mono text-indigo-400 font-semibold">{mode}</span>
              <span className="text-zinc-600">·</span>
              <span className="px-2.5 py-1 bg-zinc-900/80 rounded-lg border border-zinc-700/80 font-mono text-blue-400 font-semibold">{position}</span>
              <span className="text-zinc-600">·</span>
              <span className="px-2.5 py-1 bg-zinc-900/80 rounded-lg border border-zinc-700/80 font-mono text-amber-400 font-semibold">{stack}bb</span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <PokerGrid highlightHands={highlightHands} />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
