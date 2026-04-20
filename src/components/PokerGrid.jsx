import React, { useState } from 'react';
import usePokerStore from '../store/usePokerStore';
import { getGridData, getComboStyle, getComboSubtext, getLegend } from '../utils/gridStyles';

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

const getHandLabel = (r1, r2, suited, pair) => {
  if (pair) return `${r1}${r1}`;
  if (suited) return `${r1}${r2}s`;
  return `${r1}${r2}o`;
};

const PokerGrid = ({ highlightHands = [] }) => {
  const state = usePokerStore();
  const { mode, position, stack, scenario, villainPos } = state;
  const [tooltip, setTooltip] = useState(null);

  const gridData = getGridData(mode, stack, position, villainPos, scenario);
  const legendItems = getLegend(scenario, gridData);

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Grid */}
      <div
        className="w-full max-w-md mx-auto aspect-square grid grid-cols-13 gap-0.5 sm:gap-1 bg-zinc-800 p-1 sm:p-3 sm:rounded-[0.5rem] rounded border border-zinc-700 shadow-2xl overflow-hidden"
      >
        {RANKS.map((rowRank, rowIndex) =>
          RANKS.map((colRank, colIndex) => {
            const isPair   = rowIndex === colIndex;
            const isSuited = colIndex > rowIndex;
            const label = getHandLabel(
              isSuited ? rowRank : colRank,
              isSuited ? colRank : rowRank,
              isSuited, isPair
            );
            
            const { className, inlineStyle, type } = getComboStyle(label, state, gridData);
            let cellInlineStyle = inlineStyle;
            let finalClassName = className;
            let actionName = null;

            // Handle Multicolor Array of Objects vs Traditional Array of Strings
            if (highlightHands.length > 0) {
              if (typeof highlightHands[0] === 'object') {
                const match = highlightHands.find(h => h.hand === label);
                if (match) {
                  // Direct override
                  cellInlineStyle = { ...inlineStyle, backgroundColor: match.color };
                  finalClassName = `${className} text-white shadow-inner`;
                  actionName = match.action;
                } else {
                  // Mute non-matching cells
                  cellInlineStyle = { ...inlineStyle, opacity: 0.3 };
                }
              } else {
                // Classic string matching (MTT & RFI)
                const isHighlighted = highlightHands.includes(label);
                if (isHighlighted) {
                  finalClassName = `${className} bg-yellow-500/60`;
                }
              }
            }

            const subtext = getComboSubtext(label, state, gridData);

            return (
              <div
                key={label}
                onMouseEnter={() => setTooltip(label)}
                onMouseLeave={() => setTooltip(null)}
                title={label}
                className={finalClassName}
                style={inlineStyle}
              >
                <span className="hidden min-[360px]:inline">{label}</span>

                {/* Tooltip */}
                {tooltip === label && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none">
                    <div className="bg-zinc-900 border border-zinc-600 text-zinc-100 text-[10px] font-bold px-2 py-1 rounded-lg shadow-xl whitespace-nowrap">
                      {label}
                      {subtext && <span className={`ml-1 ${
                        type === 'rfi' ? 'text-emerald-400' :
                        type === 'mixed_rfi' || type === 'mixed' ? 'text-yellow-300' :
                        type === 'push' ? 'text-red-400' :
                        type === 'call' ? 'text-blue-400' :
                        type === 'threebet' ? 'text-orange-400' : 'text-zinc-500'
                      }`}>{actionName || subtext}</span>}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {highlightHands.length > 0 && typeof highlightHands[0] === 'object' ? (
          // Cash Multicolor Legend
          <>
            <div className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: '#2ecc71' }}></span><span className="text-[11px] text-zinc-400">Call</span></div>
            <div className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: '#f1c40f' }}></span><span className="text-[11px] text-zinc-400">Cold Call</span></div>
            <div className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: '#e74c3c' }}></span><span className="text-[11px] text-zinc-400">3Bet Value</span></div>
            <div className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: '#3498db' }}></span><span className="text-[11px] text-zinc-400">3Bet Bluff</span></div>
          </>
        ) : (
          // Classic Legend
          legendItems.map(({ color, bg, label, isGrad }) => (
            <div key={label} className="flex items-center gap-1.5">
              {isGrad
                ? <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0" style={{ background: bg }} />
                : <span className={`inline-block w-3 h-3 rounded-sm ${color} flex-shrink-0`} />
              }
              <span className="text-[11px] text-zinc-400">{label}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PokerGrid;
