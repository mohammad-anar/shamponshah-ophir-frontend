export interface VendorPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  hours: string;
  photosCount?: string;
  turnaround: string;
  escrowSplit?: string;
  isPopular?: boolean;
  features: string[];
}

export interface VendorReview {
  author: string;
  event?: string;
  date?: string;
  rating: number;
  text: string;
  reply?: {
    author: string;
    date: string;
    text: string;
  };
}

export interface Vendor {
  id: string;
  slug?: string;
  name: string;
  category: string;
  categoryLabel?: string;
  title: string;
  location: string;
  city?: string;
  state?: string;
  distance?: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  guildTier?: string;
  tier?: string;
  guildTierLabel?: string;
  badgePercent?: string;
  avatar: string;
  heroImage: string;
  galleryImages: string[];
  tags: string[];
  bio: string;
  responseSpeed?: string;
  onTimeDelivery?: string;
  repeatClients?: string;
  ordersCompleted?: number;
  packages: VendorPackage[];
  reviewsList: VendorReview[];
}

export interface Occasion {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  image: string;
  eventCount: string;
  count?: number;
}

