/**
 * Deterministic pseudo-random number generator (Mulberry32)
 * Initialized from any string or numeric seed via 32-bit FNV-1a hash.
 */
export function createSeededRandom(seedInput: string | number): () => number {
  let h = 2166136261;
  const str = String(seedInput || 'default_seed');
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  let a = h >>> 0;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface RankingMetrics {
  id: string;
  deliveryRate?: number;
  cancelRatio?: number;
  tier?: string;
  rating?: number;
  ordersCompleted?: number;
  orderCount?: number;
}

export function calculateBaseScore(metrics: RankingMetrics): number {
  const deliveryRate = Math.min(100, Math.max(0, Number(metrics.deliveryRate ?? 98)));
  const cancelRatio = Math.min(100, Math.max(0, Number(metrics.cancelRatio ?? 2)));
  const rating = Math.min(5, Math.max(0, Number(metrics.rating ?? 4.9)));
  const orders = Number(metrics.ordersCompleted ?? metrics.orderCount ?? 0);

  // 1. Delivery rate: 35 pts
  const deliveryPts = (deliveryRate / 100) * 35;
  // 2. Cancellation ratio: 25 pts
  const cancelPts = ((100 - cancelRatio) / 100) * 25;
  // 3. Level / Tier: 20 pts
  const tierScores: Record<string, number> = {
    SPROUT: 6,
    RISING: 11,
    PRO: 16,
    ELITE: 20,
  };
  const tierPts = tierScores[String(metrics.tier || 'PRO').toUpperCase()] || 12;
  // 4. Rating: 15 pts
  const ratingPts = (rating / 5.0) * 15;
  // 5. Response: 5 pts
  const responsePts = 4;

  let score = deliveryPts + cancelPts + tierPts + ratingPts + responsePts;

  // Cold-start boost for new vendors/gigs
  if (orders < 3) {
    score = Math.max(score, 68);
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Apply deterministic session-based weighted shuffle
 */
export function applySessionSeededRanking<T extends { id: string }>(
  items: T[],
  getMetrics: (item: T) => RankingMetrics,
  seed: string = 'session_default',
  jitterWeight: number = 24,
): (T & { rankScore: number })[] {
  return items
    .map((item) => {
      const base = calculateBaseScore(getMetrics(item));
      const prng = createSeededRandom(`${seed}:${item.id}`);
      const jitter = (prng() - 0.5) * jitterWeight;
      const rankScore = Number((base + jitter).toFixed(3));
      return { ...item, rankScore };
    })
    .sort((a, b) => b.rankScore - a.rankScore);
}
