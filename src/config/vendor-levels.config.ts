export type VendorTierType = 'SPROUT' | 'RISING' | 'PRO' | 'ELITE';

export interface VendorLevelTheme {
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  gradient: string;
  glowColor: string;
  ringColor: string;
  heroOverlay: string;
  buttonClass: string;
  tabActiveClass: string;
}

export interface VendorLevelConfig {
  tier: VendorTierType;
  levelNumber: number;
  title: string;
  badgeLabel: string;
  tagline: string;
  minCompletedOrders: number;
  minEarnings: number;
  minDeliveryRate: number;
  maxCancellationRatio: number;
  minRating: number;
  theme: VendorLevelTheme;
  perks: string[];
}

export const VENDOR_LEVELS_CONFIG: Record<VendorTierType, VendorLevelConfig> = {
  SPROUT: {
    tier: 'SPROUT',
    levelNumber: 1,
    title: 'Sprout Artisan',
    badgeLabel: 'Level 1 Artisan',
    tagline: 'Fresh talent bringing creative energy to the marketplace',
    minCompletedOrders: 0,
    minEarnings: 0,
    minDeliveryRate: 0,
    maxCancellationRatio: 100,
    minRating: 0,
    theme: {
      accentColor: '#10B981', // Emerald
      accentBg: '#064E3B',
      accentBorder: '#059669',
      badgeBg: 'rgba(6, 78, 59, 0.7)',
      badgeText: 'text-emerald-400',
      badgeBorder: 'border-emerald-500/40',
      gradient: 'from-emerald-950/40 via-[#0B0C0E]/70 to-[#0B0C0E]',
      glowColor: 'rgba(16, 185, 129, 0.25)',
      ringColor: 'ring-emerald-500/50',
      heroOverlay: 'linear-gradient(to top, #0B0C0E 0%, rgba(6, 78, 59, 0.2) 60%, transparent 100%)',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30',
      tabActiveClass: 'border-emerald-400 text-emerald-400',
    },
    perks: [
      'Standard marketplace discovery',
      '100% Escrow milestone protection',
      'Cold-start exposure boost in search rankings',
    ],
  },

  RISING: {
    tier: 'RISING',
    levelNumber: 2,
    title: 'Rising Talent',
    badgeLabel: 'Level 2 Rising',
    tagline: 'Proven reliability with satisfied clients and quality delivery',
    minCompletedOrders: 5,
    minEarnings: 1500,
    minDeliveryRate: 85,
    maxCancellationRatio: 12,
    minRating: 4.5,
    theme: {
      accentColor: '#06B6D4', // Cyan / Sky Blue
      accentBg: '#083344',
      accentBorder: '#0891B2',
      badgeBg: 'rgba(8, 51, 68, 0.75)',
      badgeText: 'text-cyan-400',
      badgeBorder: 'border-cyan-500/45',
      gradient: 'from-cyan-950/40 via-[#0B0C0E]/70 to-[#0B0C0E]',
      glowColor: 'rgba(6, 182, 212, 0.25)',
      ringColor: 'ring-cyan-500/50',
      heroOverlay: 'linear-gradient(to top, #0B0C0E 0%, rgba(8, 51, 68, 0.25) 60%, transparent 100%)',
      buttonClass: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/30',
      tabActiveClass: 'border-cyan-400 text-cyan-400',
    },
    perks: [
      '1.3x Search ranking boost factor',
      'Priority client inquiry routing',
      'Up to 10 active gigs / service listings',
    ],
  },

  PRO: {
    tier: 'PRO',
    levelNumber: 3,
    title: 'Pro Verified',
    badgeLabel: 'Level 3 Pro Verified',
    tagline: 'High-performing specialist with verified track record of excellence',
    minCompletedOrders: 20,
    minEarnings: 6000,
    minDeliveryRate: 90,
    maxCancellationRatio: 6,
    minRating: 4.7,
    theme: {
      accentColor: '#818CF8', // Royal Indigo
      accentBg: '#312E81',
      accentBorder: '#6366F1',
      badgeBg: 'rgba(49, 46, 129, 0.75)',
      badgeText: 'text-indigo-400',
      badgeBorder: 'border-indigo-500/45',
      gradient: 'from-indigo-950/40 via-[#0B0C0E]/70 to-[#0B0C0E]',
      glowColor: 'rgba(99, 102, 241, 0.3)',
      ringColor: 'ring-indigo-500/50',
      heroOverlay: 'linear-gradient(to top, #0B0C0E 0%, rgba(49, 46, 129, 0.3) 60%, transparent 100%)',
      buttonClass: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30',
      tabActiveClass: 'border-indigo-400 text-indigo-400',
    },
    perks: [
      '1.6x Search ranking multiplier',
      'Verified Pro badge on all search cards',
      'Unlimited gig listings & milestone templates',
    ],
  },

  ELITE: {
    tier: 'ELITE',
    levelNumber: 4,
    title: 'Elite Guild Master',
    badgeLabel: 'Level 4 Elite Guild',
    tagline: 'Top 1% elite artisan with legendary client satisfaction and master craft',
    minCompletedOrders: 50,
    minEarnings: 20000,
    minDeliveryRate: 95,
    maxCancellationRatio: 3,
    minRating: 4.85,
    theme: {
      accentColor: '#DFB76C', // Luxury Platinum Gold
      accentBg: '#78350F',
      accentBorder: '#DFB76C',
      badgeBg: 'rgba(26, 29, 36, 0.85)',
      badgeText: 'text-[#DFB76C]',
      badgeBorder: 'border-[#DFB76C]/50',
      gradient: 'from-[#DFB76C]/15 via-[#0B0C0E]/70 to-[#0B0C0E]',
      glowColor: 'rgba(223, 183, 108, 0.35)',
      ringColor: 'ring-[#DFB76C]/50',
      heroOverlay: 'linear-gradient(to top, #0B0C0E 0%, rgba(120, 53, 15, 0.25) 60%, transparent 100%)',
      buttonClass: 'bg-gradient-to-r from-[#DFB76C] to-amber-500 hover:from-amber-400 hover:to-[#DFB76C] text-[#0B0C0E] font-bold shadow-amber-950/40',
      tabActiveClass: 'border-[#DFB76C] text-[#DFB76C]',
    },
    perks: [
      '2.0x Peak marketplace prominence',
      'Exclusive Elite Guild Crown badge & luxury gold profile theme',
      'Direct inclusion in VIP concierge recommendations',
    ],
  },
};

export function getVendorLevelConfig(tier?: string): VendorLevelConfig {
  const normalizedTier = String(tier || 'PRO').toUpperCase() as VendorTierType;
  return VENDOR_LEVELS_CONFIG[normalizedTier] || VENDOR_LEVELS_CONFIG.PRO;
}
