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
      accentColor: 'rgb(var(--success))',
      accentBg: 'rgb(var(--success-soft))',
      accentBorder: 'rgb(var(--success))',
      badgeBg: 'rgb(var(--success-soft))',
      badgeText: 'text-success',
      badgeBorder: 'border-success/30',
      gradient: 'from-success-soft via-background to-background',
      glowColor: 'rgba(var(--success), 0.25)',
      ringColor: 'ring-success/50',
      heroOverlay: 'linear-gradient(to top, rgb(var(--background)) 0%, rgba(var(--success-soft), 0.4) 60%, transparent 100%)',
      buttonClass: 'bg-success-solid text-white hover:bg-success text-on-brand shadow-md',
      tabActiveClass: 'border-success text-success',
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
      accentColor: 'rgb(var(--info))',
      accentBg: 'rgb(var(--info-soft))',
      accentBorder: 'rgb(var(--info))',
      badgeBg: 'rgb(var(--info-soft))',
      badgeText: 'text-info',
      badgeBorder: 'border-info/30',
      gradient: 'from-info-soft via-background to-background',
      glowColor: 'rgba(var(--info), 0.25)',
      ringColor: 'ring-info/50',
      heroOverlay: 'linear-gradient(to top, rgb(var(--background)) 0%, rgba(var(--info-soft), 0.4) 60%, transparent 100%)',
      buttonClass: 'bg-info-solid text-white hover:bg-info text-on-brand shadow-md',
      tabActiveClass: 'border-info text-info',
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
      accentColor: 'rgb(var(--info))',
      accentBg: 'rgb(var(--surface-sunken))',
      accentBorder: 'rgb(var(--border-strong))',
      badgeBg: 'rgb(var(--surface-sunken))',
      badgeText: 'text-info',
      badgeBorder: 'border-border-strong',
      gradient: 'from-surface-sunken via-background to-background',
      glowColor: 'rgba(var(--info), 0.25)',
      ringColor: 'ring-focus-ring/50',
      heroOverlay: 'linear-gradient(to top, rgb(var(--background)) 0%, rgba(var(--surface-sunken), 0.4) 60%, transparent 100%)',
      buttonClass: 'bg-brand text-on-brand hover:bg-brand-hover shadow-md font-bold',
      tabActiveClass: 'border-brand text-brand',
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
      accentColor: 'rgb(var(--brand))',
      accentBg: 'rgb(var(--brand-soft))',
      accentBorder: 'rgb(var(--brand))',
      badgeBg: 'rgb(var(--brand-soft))',
      badgeText: 'text-brand',
      badgeBorder: 'border-border-brand',
      gradient: 'from-brand/15 via-background to-background',
      glowColor: 'rgba(var(--brand), 0.35)',
      ringColor: 'ring-focus-ring/50',
      heroOverlay: 'linear-gradient(to top, rgb(var(--background)) 0%, rgba(var(--brand-soft), 0.6) 60%, transparent 100%)',
      buttonClass: 'bg-gradient-to-r from-brand to-brand-active hover:from-brand-hover hover:to-brand text-on-brand font-bold shadow-md',
      tabActiveClass: 'border-border-brand text-brand',
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
