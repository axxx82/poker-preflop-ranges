// src/utils/rangeParser.js
// Expands poker hand shorthand strings into explicit hand labels for the 13x13 matrix.
// Supported patterns:
//   - Pair ranges: "22+" (all pairs), "JJ-77" (JJ, TT, 99, 88, 77)
//   - Suited/offsuit ranges with '+': "ATs+", "KJo+"
//   - Individual combos: "AKs", "QJo", etc.

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const RANK_INDEX = RANKS.reduce((obj, r, i) => (obj[r] = i, obj), {});

/**
 * Generate all pocket pairs from AA down to 22.
 */
function allPairs() {
  return RANKS.map(r => `${r}${r}`);
}

/**
 * Generate a descending range of pairs, e.g. "JJ-77" => ["JJ","TT","99","88","77"].
 */
function pairRange(start, end) {
  const startIdx = RANK_INDEX[start[0]];
  const endIdx = RANK_INDEX[end[0]];
  const result = [];
  for (let i = startIdx; i <= endIdx; i++) {
    const r = RANKS[i];
    result.push(`${r}${r}`);
  }
  return result;
}

/**
 * Expand a suited/offsuit range with '+'.
 * Example: "ATs+" => ["ATs","AJs","AQs","AKs"]
 * Example: "KJo+" => ["KJo","KQo"]
 */
function plusRange(token) {
  const suited = token.endsWith('s');
  const offsuit = token.endsWith('o');
  const base = token.slice(0, -1); // remove trailing s/o
  const first = base[0];
  const second = base[1];
  const firstIdx = RANK_INDEX[first];
  const secondIdx = RANK_INDEX[second];
  const result = [];
  // iterate over second rank from its position up to Ace (index 0) for suited/offsuit
  for (let i = secondIdx; i >= 0; i--) {
    if (i === firstIdx) continue; // skip pair, not suited/offsuit
    const r2 = RANKS[i];
    const label = suited ? `${first}${r2}s` : `${first}${r2}o`;
    result.push(label);
  }
  return result;
}

/**
 * Expand a single token (no commas) into an array of hand strings.
 */
function expandToken(token) {
  token = token.trim();
  if (!token) return [];
  // Pair range with '+'
  if (/^[2-9TJQKA]{2}\+$/.test(token)) {
    // "22+" means all pairs
    return allPairs();
  }
  // Pair range with '-'
  if (/^[2-9TJQKA]{2}-[2-9TJQKA]{2}$/.test(token)) {
    const [start, end] = token.split('-');
    return pairRange(start, end);
  }
  // Plus range (suited or offsuit)
  if (/^[2-9TJQKA]{2}[so]\+$/.test(token)) {
    return plusRange(token);
  }
  // Simple combo (e.g., AKs, QJo)
  if (/^[2-9TJQKA]{2}[so]$/.test(token)) {
    return [token];
  }
  // Suited/offsuit dash range with same first rank: "AKs-A2s", "KQs-KTs"
  if (/^[2-9TJQKA]{2}[so]-[2-9TJQKA]{2}[so]$/.test(token)) {
    const [left, right] = token.split('-');
    const suited = left.endsWith('s');
    const first = left[0];          // e.g. 'A'
    const startSecond = left[1];    // e.g. 'K'
    const endSecond = right[1];     // e.g. '2'
    const startIdx = RANK_INDEX[startSecond];
    const endIdx   = RANK_INDEX[endSecond];
    const lo = Math.min(startIdx, endIdx);
    const hi = Math.max(startIdx, endIdx);
    const result = [];
    for (let i = lo; i <= hi; i++) {
      if (RANKS[i] === first) continue; // skip pair
      result.push(`${first}${RANKS[i]}${suited ? 's' : 'o'}`);
    }
    return result;
  }
  // Fallback: return token as‑is (may be something like "A2s+" which matches plusRange)
  return [token];
}

/**
 * Expand a comma‑separated range string into a flat array of hand labels.
 * @param {string} str e.g. "22+, ATs+, KJo+"
 * @returns {string[]} array of hand strings like ["AA","KK",..., "ATs","AJs",...] 
 */
export function expandRangeString(str) {
  if (!str) return [];
  const tokens = str.split(',');
  const hands = [];
  tokens.forEach(t => {
    hands.push(...expandToken(t));
  });
  // Remove duplicates while preserving order
  const seen = new Set();
  return hands.filter(h => {
    if (seen.has(h)) return false;
    seen.add(h);
    return true;
  });
}

export default expandRangeString;
