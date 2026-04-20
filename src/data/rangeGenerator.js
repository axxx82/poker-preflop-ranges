// GTO Preflop Range Generator — revised with accurate ICM/GTO hand orderings
// MTT threshold: 15bb (below = push/fold). Cash threshold: 12bb.
// Ordered lists: strongest → weakest for each position & mode.

// ── RFI hand orderings ──────────────────────────────────────────────────────
// Short-stack-correct ordering: pairs before weak aces, then suiteds, then offsuit
const RFI_ORDER = {
  MTT: {
    UTG: ['AA','KK','QQ','JJ','TT','99','88','77','66','55','AKs','AQs','AJs','ATs','AKo','AQo','AJo','KJs','KQs','QJs','JTs','A5s','A4s','A9s','KTs','A8s','A7s','A6s','ATo','K9s','A3s','A2s','QTs','J9s','44','T9s','KQo','33','98s','KJo'],
    MP:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','AKs','AQs','AJs','ATs','AKo','AQo','AJo','KJs','KQs','QJs','JTs','A9s','A8s','KTs','T9s','A7s','A5s','K9s','QTs','ATo','J9s','33','A6s','A4s','KQo','98s','KJo','22','87s','A3s','A2s'],
    HJ:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','AKs','AQs','AJs','ATs','A9s','AKo','AQo','AJo','KJs','KQs','QJs','JTs','A8s','A7s','KTs','T9s','K9s','QTs','ATo','J9s','22','A6s','A5s','98s','KQo','KJo','87s','A4s','A3s','KTo','76s','A2s'],
    CO:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22','AKs','AQs','AJs','ATs','A9s','A8s','AKo','AQo','AJo','KJs','KQs','QJs','JTs','A7s','A6s','KTs','T9s','K9s','QTs','ATo','J9s','A5s','98s','KQo','KJo','87s','A4s','A3s','KTo','76s','A2s','QJo','65s'],
    BTN: ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22','AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','QJs','QTs','Q9s','Q8s','JTs','J9s','J8s','T9s','T8s','98s','97s','87s','76s','65s','54s','AKo','AQo','AJo','ATo','A9o','A8o','KQo','KJo','KTo','K9o','QJo','QTo','JTo'],
    SB:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','QJs','QTs','JTs','AKo','AQo','AJo','22','J9s','T9s','KQo','ATo','KJo','98s','K8s','87s','A9o','KTo','76s','QJo','65s'],
    BB: [],
  },
  CASH: {
    // Short-stack-correct: pairs first, then premium broadways, then speculative hands
    UTG: ['AA','KK','QQ','JJ','TT','99','88','77','AKs','AQs','AJs','ATs','AKo','AQo','AJo','ATo','KQs','A9s','66','KJs','A8s','A7s','A5s','A4s','KTs','QJs','A6s','A3s','55','A2s','JTs','K9s','QTs','KQo','44','J9s','T9s','KJo','98s','33','Q9s','87s','22','76s','65s','54s'],
    MP:  ['AA','KK','QQ','JJ','TT','99','88','77','66','AKs','AQs','AJs','ATs','AKo','AQo','AJo','ATo','KQs','A9s','55','KJs','A8s','A7s','A5s','A4s','KTs','QJs','JTs','A6s','A3s','A2s','K9s','44','QTs','J9s','KQo','T9s','KJo','98s','33','Q9s','87s','22','76s','65s','54s'],
    HJ:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','AKs','AQs','AJs','ATs','AKo','AQo','AJo','ATo','KQs','44','A9s','A8s','A7s','A5s','A4s','KJs','KTs','QJs','JTs','A6s','A3s','A2s','K9s','KQo','33','QTs','J9s','T9s','KJo','98s','22','Q9s','87s','76s','KTo','65s','54s'],
    CO:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','AKs','AQs','AJs','ATs','A9s','AKo','AQo','AJo','ATo','KQs','33','A8s','A7s','A6s','A5s','A4s','KJs','KTs','QJs','JTs','A3s','A2s','K9s','QTs','J9s','KQo','22','T9s','KJo','98s','K8s','Q9s','87s','KTo','76s','QJo','65s','54s'],
    BTN: ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22','AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s','QJs','QTs','Q9s','Q8s','JTs','J9s','J8s','T9s','T8s','98s','97s','87s','86s','76s','75s','65s','64s','54s','53s','43s','AKo','AQo','AJo','ATo','A9o','A8o','A7o','KQo','KJo','KTo','K9o','QJo','QTo','JTo'],
    SB:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','AKs','AQs','AJs','ATs','AKo','AQo','AJo','ATo','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','QJs','QTs','JTs','33','J9s','T9s','KQo','KJo','98s','K8s','87s','22','76s','KTo','65s','QJo','54s','A9o','QTo'],
    BB:  [],
  },
};


// ── Push ordering (short stacks, push/fold territory) ────────────────────
const PUSH_ORDER = {
  MTT: {
    UTG: ['AA','KK','QQ','JJ','TT','99','88','77','66','55','AKs','AQs','AJs','ATs','AKo','AQo','AJo','44','A9s','A8s','A7s','A5s','KQs','ATo','33','A4s','A3s','A2s','KJs','KTs','KQo','22','K9s','QJs','JTs','KJo','QTs','Q9s','J9s','T9s','98s','87s'],
    MP:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','AKs','AQs','AJs','ATs','AKo','AQo','AJo','33','A9s','A8s','A7s','A6s','A5s','KQs','ATo','22','A4s','A3s','A2s','KJs','KTs','KQo','K9s','QJs','JTs','KJo','QTs','Q9s','J9s','T9s','98s','87s'],
    HJ:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','AKs','AQs','AJs','ATs','A9s','AKo','AQo','AJo','22','A8s','A7s','A6s','A5s','A4s','KQs','ATo','A3s','A2s','KJs','KTs','KQo','K9s','QJs','JTs','KJo','QTs','Q9s','J9s','T9s','98s','87s','76s'],
    CO:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22','AKs','AQs','AJs','ATs','A9s','A8s','AKo','AQo','AJo','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','ATo','K9s','K8s','QJs','JTs','KQo','KJo','QTs','J9s','T9s','98s','87s','76s','QJo','KTo'],
    BTN: ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22','AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s','K3s','K2s','QJs','QTs','Q9s','Q8s','Q7s','Q6s','JTs','J9s','J8s','J7s','T9s','T8s','T7s','T6s','98s','97s','96s','87s','86s','76s','75s','65s','64s','54s','53s','43s','32s','AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o','KQo','KJo','KTo','K9o','K8o','K7o','QJo','QTo','Q9o','JTo','J9o','T9o'],
    SB:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22','AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','QJs','QTs','JTs','J9s','T9s','AKo','AQo','AJo','ATo','A9o','A8o','KQo','KJo','KTo','K9o','QJo','98s','87s','76s'],
    BB: [],
  },
  CASH: {
    UTG: ['AA','KK','QQ','JJ','TT','99','88','77','AKs','AQs','AJs','ATs','AKo','AQo','AJo','66','A9s','A8s','A7s','A5s','KQs','ATo','55','A4s','A3s','A2s','KJs','KTs','KQo','44','K9s','QJs','JTs','33','KJo','22','QTs','Q9s','J9s','T9s'],
    MP:  ['AA','KK','QQ','JJ','TT','99','88','77','66','AKs','AQs','AJs','ATs','AKo','AQo','AJo','55','A9s','A8s','A7s','A6s','A5s','KQs','ATo','44','A4s','A3s','A2s','KJs','KTs','K9s','KQo','33','QJs','JTs','KJo','22','QTs','Q9s','J9s','T9s','98s'],
    HJ:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','AKs','AQs','AJs','ATs','A9s','AKo','AQo','AJo','44','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','ATo','33','QJs','JTs','KQo','22','KJo','QTs','J9s','T9s','98s','87s','KTo'],
    CO:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','AKs','AQs','AJs','ATs','A9s','A8s','AKo','AQo','AJo','33','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','ATo','22','QJs','JTs','KQo','J9s','T9s','KJo','98s','87s','76s','65s','QJo','KTo'],
    BTN: ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22','AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s','K3s','K2s','QJs','QTs','Q9s','Q8s','Q7s','JTs','J9s','J8s','T9s','T8s','98s','97s','87s','76s','65s','54s','43s','AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o','KQo','KJo','KTo','K9o','K8o','QJo','QTo','JTo'],
    SB:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22','AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','QJs','QTs','JTs','J9s','T9s','AKo','AQo','AJo','ATo','A9o','A8o','KQo','KJo','KTo','K9o','QJo','98s','87s'],
    BB: [],
  },
};

// ── RFI hand counts per stack ── (MTT: 16-200bb range, CASH: 13-200bb)
const RFI_COUNTS = {
  MTT: {
    //                200  150  100  80  60  50  40  35  30  25  24  23  22  21  20  19  18  17  16
    UTG: {200:36,150:30,100:24,80:21,60:18,50:16,40:14,35:11,30:10,25:9, 24:9, 23:9, 22:9, 21:9, 20:21,19:21,18:21,17:20,16:20},
    MP:  {200:44,150:38,100:31,80:27,60:23,50:20,40:17,35:14,30:12,25:11,24:10,23:10,22:10,21:10,20:27,19:27,18:27,17:26,16:26},
    HJ:  {200:52,150:45,100:37,80:32,60:27,50:23,40:20,35:17,30:15,25:13,24:12,23:12,22:12,21:12,20:33,19:33,18:33,17:32,16:32},
    CO:  {200:65,150:57,100:48,80:41,60:35,50:30,40:26,35:22,30:19,25:17,24:16,23:15,22:15,21:14,20:40,19:40,18:39,17:38,16:37},
    BTN: {200:70,150:62,100:54,80:47,60:40,50:35,40:30,35:26,30:23,25:20,24:19,23:18,22:17,21:17,20:52,19:52,18:51,17:50,16:49},
    SB:  {200:55,150:48,100:40,80:35,60:30,50:26,40:22,35:19,30:17,25:15,24:14,23:14,22:13,21:13,20:41,19:41,18:40,17:39,16:38},
    BB:  {200:0,150:0,100:0,80:0,60:0,50:0,40:0,35:0,30:0,25:0,24:0,23:0,22:0,21:0,20:0,19:0,18:0,17:0,16:0},
  },
  CASH: {
    // Counts raised at short stacks — 8bb UTG should show ~14 hands incl AJo/ATo
    //              200  150  100   80   60   50   40   35   30   25   24   23   22   21   20   19   18   17   16   15   14   13   12   11   10    9    8
    UTG: {200:46,150:40,100:33,80:28,60:24,50:20,40:17,35:14,30:12,25:11,24:11,23:11,22:11,21:11,20:13,19:13,18:13,17:13,16:13,15:14,14:14,13:14,12:14,11:14,10:14,9:15,8:16},
    MP:  {200:53,150:47,100:39,80:34,60:28,50:24,40:20,35:17,30:15,25:13,24:13,23:13,22:12,21:12,20:15,19:15,18:15,17:15,16:15,15:17,14:17,13:17,12:17,11:18,10:18,9:19,8:20},
    HJ:  {200:62,150:55,100:46,80:40,60:34,50:29,40:25,35:21,30:18,25:16,24:15,23:15,22:15,21:14,20:18,19:18,18:18,17:17,16:17,15:20,14:20,13:21,12:22,11:23,10:24,9:25,8:26},
    CO:  {200:74,150:66,100:56,80:49,60:42,50:36,40:30,35:25,30:21,25:18,24:17,23:16,22:16,21:15,20:22,19:22,18:22,17:21,16:21,15:24,14:25,13:26,12:27,11:28,10:30,9:32,8:34},
    BTN: {200:86,150:77,100:67,80:59,60:51,50:44,40:37,35:32,30:28,25:24,24:23,23:22,22:21,21:20,20:22,19:22,18:22,17:21,16:21,15:26,14:28,13:30,12:33,11:36,10:40,9:44,8:48},
    SB:  {200:65,150:58,100:49,80:43,60:37,50:32,40:27,35:23,30:20,25:17,24:16,23:16,22:15,21:14,20:17,19:17,18:17,17:16,16:16,15:21,14:22,13:24,12:26,11:28,10:31,9:34,8:38},
    BB:  {200:0,150:0,100:0,80:0,60:0,50:0,40:0,35:0,30:0,25:0,24:0,23:0,22:0,21:0,20:0,19:0,18:0,17:0,16:0,15:0,14:0,13:0,12:0,11:0,10:0,9:0,8:0},
  },
};

// ── Push/fold counts ── (MTT: 8-15bb, CASH: 8-12bb)
const PUSH_COUNTS = {
  MTT: {
    UTG: {15:21,14:23,13:25,12:27,11:29,10:31,9:34,8:37},
    MP:  {15:24,14:26,13:28,12:30,11:32,10:34,9:37,8:40},
    HJ:  {15:30,14:32,13:34,12:36,11:38,10:40,9:43,8:46},
    CO:  {15:38,14:40,13:43,12:46,11:49,10:52,9:56,8:60},
    BTN: {15:55,14:58,13:62,12:66,11:70,10:74,9:79,8:83},
    SB:  {15:46,14:49,13:52,12:56,11:60,10:64,9:68,8:72},
    BB:  {15:0,14:0,13:0,12:0,11:0,10:0,9:0,8:0},
  },
  CASH: {
    UTG: {12:22,11:25,10:28,9:31,8:35},
    MP:  {12:26,11:29,10:32,9:36,8:40},
    HJ:  {12:33,11:37,10:41,9:45,8:50},
    CO:  {12:42,11:47,10:52,9:57,8:62},
    BTN: {12:62,11:67,10:72,9:76,8:80},
    SB:  {12:54,11:59,10:64,9:69,8:73},
    BB:  {12:0,11:0,10:0,9:0,8:0},
  },
};

// Push/fold thresholds (at this stack and below → push only)
// Cash games always open-raise even at 8bb (never push-fold preflop in cash)
// MTT transitions to push/fold at 15bb and below
const PUSH_THRESHOLD = { MTT: 15, CASH: 5 };

// ── Exact range overrides ────────────────────────────────────────────────────
// When a specific mode+stack+position is defined here, the count-based approach
// is bypassed entirely and this exact list is used as-is.
// Use this for externally verified GTO charts (e.g. from solver configs).
const RFI_EXACT = {
  CASH: {
    20: {
      UTG: ['AA','KK','QQ','JJ','TT','99','88','77','66','55','AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','K7s','K6s','QJs','QTs','Q9s','JTs','J9s','T9s','98s','87s','AKo','AQo','AJo','ATo','A9o','KQo','KJo','KTo','QJo','QTo','JTo'],
    },
  },
};

// ── Mixed-strategy weights ───────────────────────────────────────────────────
// Structure: [mode][stack][position][hand] = frequency (0..1)
// Only hands with frequency < 1 need to be listed here.
// These hands will appear in the RFI range (colored) AND in MIXED array (striped).
const MIXED_WEIGHTS = {
  CASH: {
    20: {
      UTG: { '55': 0.5 },
    },
  },
};

// ── VS RFI Ranges ────────────────────────────────────────────────────────────
// Structure: [mode][heroPos][villainPos][depth] = { CALL: [], THREEBET: [] }
// Depths: 'deep' (80bb+), 'mid' (35-70bb), 'short' (20-30bb), 'xshort' (8-18bb)
const VS_RFI_OLD = {
  BB: {
    UTG: {
      deep:   { CALL: ['JJ','TT','99','88','77','66','55','44','33','22','AQo','AJo','ATo','A9o','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','QJs','QTs','JTs','J9s','T9s','98s','87s','76s'],
                THREEBET: ['KK','QQ','AKs','AKo','AQs'] },
      mid:    { CALL: ['JJ','TT','99','88','77','66','55','44','AQo','AJo','AJs','ATs','A9s','A8s','A7s','A5s','A4s','KQs','KJs','QJs','JTs','T9s','98s'],
                THREEBET: ['KK','QQ','AA','AKs','AKo','AQs','A5s'] },
      short:  { CALL: ['JJ','TT','99','88','77','66','55','AQo','AJo','ATs','KQs','KJs','QJs','JTs'],
                THREEBET: ['AA','KK','QQ','AKs','AKo','AQs'] },
    },
    MP: {
      deep:   { CALL: ['JJ','TT','99','88','77','66','55','44','33','22','AQo','AJo','ATo','A9o','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','QJs','QTs','JTs','J9s','T9s','98s','87s','76s','65s'],
                THREEBET: ['KK','QQ','AKs','AQs','AKo','A5s'] },
      mid:    { CALL: ['JJ','TT','99','88','77','66','55','44','AQo','AJo','AJs','ATs','A9s','A8s','A7s','A5s','A4s','KQs','KJs','QJs','JTs','T9s','98s','87s'],
                THREEBET: ['AA','KK','QQ','AKs','AKo','AQs','A5s'] },
      short:  { CALL: ['JJ','TT','99','88','77','66','AQo','AJo','ATs','A9s','KQs','QJs','JTs'],
                THREEBET: ['AA','KK','QQ','AKs','AKo','AQs'] },
    },
    HJ: {
      deep:   { CALL: ['JJ','TT','99','88','77','66','55','44','33','22','AQo','AJo','ATo','A9o','A8o','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','QJs','QTs','JTs','J9s','T9s','98s','87s','76s','65s'],
                THREEBET: ['KK','QQ','AA','AKs','AQs','A5s','A4s','KQo'] },
      mid:    { CALL: ['JJ','TT','99','88','77','66','55','44','33','AQo','AJo','ATo','AJs','ATs','A9s','A8s','A7s','A6s','A5s','KQs','KJs','KTs','QJs','QTs','JTs','T9s','98s','87s'],
                THREEBET: ['AA','KK','QQ','AKs','AQs','AKo','A5s','A4s'] },
      short:  { CALL: ['TT','99','88','77','66','55','44','AQo','AJo','ATo','ATs','A9s','A8s','KQs','KJs','QJs','JTs'],
                THREEBET: ['AA','KK','QQ','JJ','AKs','AQs','AKo','A5s'] },
    },
    CO: {
      deep:   { CALL: ['JJ','TT','99','88','77','66','55','44','33','22','AQo','AJo','ATo','A9o','A8o','A7o','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','QJs','QTs','Q9s','JTs','J9s','T9s','98s','87s','76s','65s'],
                THREEBET: ['AA','KK','QQ','AKs','AQs','AKo','A5s','A4s','A3s'] },
      mid:    { CALL: ['JJ','TT','99','88','77','66','55','44','33','AQo','AJo','ATo','A9o','AJs','ATs','A9s','A8s','A7s','A6s','A5s','KQs','KJs','KTs','QJs','QTs','JTs','J9s','T9s','98s','87s'],
                THREEBET: ['AA','KK','QQ','AKs','AQs','AKo','A5s','A4s','KQo'] },
      short:  { CALL: ['TT','99','88','77','66','55','44','33','AQo','AJo','ATo','ATs','A9s','A8s','A7s','A5s','KQs','KJs','QJs','JTs','T9s'],
                THREEBET: ['AA','KK','QQ','JJ','AKs','AQs','AKo','A5s','A4s'] },
    },
    BTN: {
      deep:   { CALL: ['JJ','TT','99','88','77','66','55','44','33','22','AQo','AJo','ATo','A9o','A8o','A7o','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s','K8s','QJs','QTs','Q9s','Q8s','JTs','J9s','J8s','T9s','T8s','98s','87s','76s','65s','54s'],
                THREEBET: ['AA','KK','QQ','AKs','AQs','AKo','A5s','A4s','A3s','KQo'] },
      mid:    { CALL: ['JJ','TT','99','88','77','66','55','44','33','22','AQo','AJo','ATo','A9o','AJs','ATs','A9s','A8s','A7s','A6s','A5s','KQs','KJs','KTs','K9s','QJs','QTs','JTs','J9s','T9s','98s','87s','76s'],
                THREEBET: ['AA','KK','QQ','AKs','AQs','AKo','A5s','A4s','A3s','KQo'] },
      short:  { CALL: ['TT','99','88','77','66','55','44','33','22','AQo','AJo','ATo','ATs','A9s','A8s','A7s','A6s','A5s','KQs','KJs','QJs','JTs','T9s','98s'],
                THREEBET: ['AA','KK','QQ','JJ','AKs','AQs','AKo','A5s','A4s','A3s','KQo'] },
    },
    SB: {
      deep:   { CALL: ['JJ','TT','99','88','77','66','55','44','33','22','AQo','AJo','ATo','A9o','AJs','ATs','A9s','A8s','A7s','KQs','KJs','KTs','QJs','JTs','T9s','98s'],
                THREEBET: ['AA','KK','QQ','AKs','AQs','AKo','A5s','KQo'] },
      mid:    { CALL: ['JJ','TT','99','88','77','66','55','44','AJo','ATs','A9s','A8s','KQs','KJs','QJs','JTs'],
                THREEBET: ['AA','KK','QQ','AKs','AQs','AKo','AJo','A5s'] },
      short:  { CALL: ['TT','99','88','77','66','55','AJo','ATs','KQs','QJs'],
                THREEBET: ['AA','KK','QQ','JJ','AKs','AQs','AKo','A5s'] },
    },
  },
  BTN: {
    CO: {
      deep:   { CALL: ['JJ','TT','99','88','77','66','55','44','AJo','ATs','A9s','A8s','A7s','KQs','KJs','KTs','QJs','JTs','T9s','98s'],
                THREEBET: ['AA','KK','QQ','AKs','AQs','AKo','A5s','A4s','KQo'] },
      mid:    { CALL: ['JJ','TT','99','88','77','AJo','ATs','A9s','KQs','KJs','QJs','JTs','T9s'],
                THREEBET: ['AA','KK','QQ','AKs','AQs','AKo','A5s','KQo'] },
      short:  { CALL: ['TT','99','88','77','66','ATs','A9s','KQs','KJs','QJs','JTs'],
                THREEBET: ['AA','KK','QQ','JJ','AKs','AQs','AKo'] },
    },
  },
  SB: {
    BTN: {
      deep:   { CALL: ['JJ','TT','99','88','77','66','55','44','AQo','AJo','ATs','A9s','A8s','A7s','A5s','KQs','KJs','QJs','JTs','T9s','98s'],
                THREEBET: ['AA','KK','QQ','AKs','AQs','AKo','A4s','KQo'] },
      mid:    { CALL: ['TT','99','88','77','66','55','AJo','ATs','A9s','KQs','KJs','QJs','JTs'],
                THREEBET: ['AA','KK','QQ','JJ','AKs','AQs','AKo','A5s'] },
      short:  { CALL: ['TT','99','88','77','AJo','ATs','KQs','QJs'],
                THREEBET: ['AA','KK','QQ','JJ','AKs','AQs','AKo'] },
    },
  },
};

const VS_RFI = {
  MTT: VS_RFI_OLD,
  CASH: {
    MP: {
      UTG: {
        mid: { CALL: [], THREEBET: ['AA','KK','QQ','AKs','AKo'] }
      }
    },
    BTN: {
      CO: {
        mid: { CALL: [], THREEBET: ['AA','KK','QQ','JJ','TT','AKs','AQs','AJs','KQs','AKo','AQo','AJo','KQo','A5s','A4s','A3s','A2s','T7s','96s'] }
      }
    },
    SB: {
      BTN: {
        mid: { CALL: [], THREEBET: ['AA','KK','QQ','JJ','TT','99','AKs','AQs','AJs','KQs','AKo','AQo','K5s','Q8s','J8s','T8s','A5s','A4s','A3s','A2s'] }
      }
    },
    BB: {
      BTN: {
        mid: { CALL: [], THREEBET: ['AA','KK','QQ','JJ','TT','AKs','AQs','AJs','KQs','AKo','AQo','A5s','A4s','A3s','A2s','K5s','K4s','K3s','K2s','T7s','96s','85s'] }
      }
    }
  }
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function interpolate(table, stackNum) {
  if (table[stackNum] !== undefined) return table[stackNum];
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);
  if (stackNum <= keys[0]) return table[keys[0]];
  if (stackNum >= keys[keys.length - 1]) return table[keys[keys.length - 1]];
  for (let i = 0; i < keys.length - 1; i++) {
    if (stackNum >= keys[i] && stackNum <= keys[i + 1]) {
      const frac = (stackNum - keys[i]) / (keys[i + 1] - keys[i]);
      return Math.round(table[keys[i]] + (table[keys[i + 1]] - table[keys[i]]) * frac);
    }
  }
  return 0;
}

function getDepthBucket(stackNum) {
  if (stackNum >= 80) return 'deep';
  if (stackNum >= 30) return 'mid';
  return 'short';
}

// ─── Guaranteed minimum hands for RFI (apply above push threshold) ──────────
// These hands MUST always appear in RFI range at any stack above the push threshold.
// Provides a safety net against too-small counts.
const GUARANTEED_RFI = {
  MTT: {
    UTG: ['AA','KK','QQ','JJ','TT','99','88','77','AKs','AQs','AJs','ATs','AKo','AQo','AJo'],
    MP:  ['AA','KK','QQ','JJ','TT','99','88','77','66','AKs','AQs','AJs','ATs','AKo','AQo','AJo'],
    HJ:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','AKs','AQs','AJs','ATs','AKo','AQo','AJo','KQs'],
    CO:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','AKs','AQs','AJs','ATs','AKo','AQo','AJo','KQs','KJs'],
    BTN: ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22','AKs','AQs','AJs','ATs','AKo','AQo','AJo','ATo','KQs'],
    SB:  ['AA','KK','QQ','JJ','TT','99','88','77','AKs','AQs','AJs','ATs','AKo','AQo','AJo'],
    BB:  [],
  },
  CASH: {
    UTG: ['AA','KK','QQ','JJ','TT','99','88','77','AKs','AQs','AJs','ATs','AKo','AQo','AJo','ATo'],
    MP:  ['AA','KK','QQ','JJ','TT','99','88','77','66','AKs','AQs','AJs','ATs','AKo','AQo','AJo','ATo'],
    HJ:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','AKs','AQs','AJs','ATs','AKo','AQo','AJo','ATo'],
    CO:  ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','AKs','AQs','AJs','ATs','AKo','AQo','AJo','ATo','KQs'],
    BTN: ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22','AKs','AQs','AJs','ATs','AKo','AQo','AJo','ATo','KQs'],
    SB:  ['AA','KK','QQ','JJ','TT','99','88','77','AKs','AQs','AJs','ATs','AKo','AQo','AJo','ATo'],
    BB:  [],
  },
};

// ── Main exports ─────────────────────────────────────────────────────────────
export function getRFIRange(mode, stack, position) {
  const stackNum = parseInt(stack, 10);
  const modeKey = mode === 'Cash' ? 'CASH' : 'MTT';
  const threshold = PUSH_THRESHOLD[modeKey];

  if (stackNum <= threshold) {
    const order = PUSH_ORDER[modeKey][position] ?? [];
    const count = interpolate(PUSH_COUNTS[modeKey][position] ?? {}, stackNum);
    return { RFI: [], PUSH: order.slice(0, count), MIXED: [] };
  }

  // ── Check for exact range override (externally verified GTO charts) ──────
  const exactRange = RFI_EXACT[modeKey]?.[stackNum]?.[position];
  if (exactRange) {
    const mixedWeightsMap = MIXED_WEIGHTS[modeKey]?.[stackNum]?.[position] ?? {};
    const exactSet = new Set(exactRange);
    const mixed = Object.entries(mixedWeightsMap)
      .filter(([hand, freq]) => freq > 0 && freq < 1 && exactSet.has(hand))
      .map(([hand, freq]) => ({ hand, freq }));
    return { RFI: exactRange, PUSH: [], MIXED: mixed };
  }

  // ── Count-based approach for all other stacks ────────────────────────────
  const order = RFI_ORDER[modeKey][position] ?? [];
  const count = interpolate(RFI_COUNTS[modeKey][position] ?? {}, stackNum);
  let rfi = order.slice(0, count);

  // ── Enforce guaranteed minimums ───────────────────────────────────────────
  const minimums = GUARANTEED_RFI[modeKey]?.[position] ?? [];
  if (minimums.length > 0) {
    const rfiMinSet = new Set(rfi);
    const orderSet = new Set(order);
    const extras = minimums.filter(h => !rfiMinSet.has(h) && orderSet.has(h));
    if (extras.length > 0) {
      const posMap = new Map(order.map((h, i) => [h, i]));
      rfi = [...rfi, ...extras].sort((a, b) => (posMap.get(a) ?? 999) - (posMap.get(b) ?? 999));
    }
  }

  // ── Build MIXED list (partial-frequency hands) ──────────────────────────
  const mixedWeightsMap = MIXED_WEIGHTS[modeKey]?.[stackNum]?.[position] ?? {};
  const rfiSet = new Set(rfi);
  const mixed = Object.entries(mixedWeightsMap)
    .filter(([hand, freq]) => freq > 0 && freq < 1 && rfiSet.has(hand))
    .map(([hand, freq]) => ({ hand, freq }));

  return { RFI: rfi, PUSH: [], MIXED: mixed };
}

export function getVsRFIRange(mode, stack, heroPos, villainPos) {
  const stackNum = parseInt(stack, 10);
  const depth = getDepthBucket(stackNum);
  const modeKey = mode === 'Cash' ? 'CASH' : 'MTT';
  
  let range = VS_RFI[modeKey]?.[heroPos]?.[villainPos]?.[depth];
  if (!range && modeKey === 'CASH') {
    // Fallback to MTT ranges if Cash specific is not populated yet
    range = VS_RFI['MTT']?.[heroPos]?.[villainPos]?.[depth];
  }
  
  if (!range) return { CALL: [], THREEBET: [] };
  return range;
}

// Legacy default export for backward compatibility
export function getRange(mode, stack, position) {
  return getRFIRange(mode, stack, position);
}
