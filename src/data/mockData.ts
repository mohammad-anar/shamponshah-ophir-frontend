export interface Vendor {
  id: string;
  name: string;
  category: "cinematography" | "floral" | "music" | "catering" | "lighting" | "planning" | "dessert";
  categoryLabel: string;
  title: string;
  location: string;
  city: string;
  state: string;
  distance: string;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  guildTier: "Sprout" | "Rising" | "Pro" | "Elite";
  guildTierLabel: string;
  badgePercent?: string;
  avatar: string;
  heroImage: string;
  galleryImages: string[];
  tags: string[];
  bio: string;
  responseSpeed: string;
  onTimeDelivery: string;
  repeatClients: string;
  ordersCompleted: number;
  packages: {
    id: string;
    title: string;
    description: string;
    price: number;
    hours: string;
    photosCount?: string;
    turnaround: string;
    escrowSplit: string;
    isPopular?: boolean;
    features: string[];
  }[];
  reviewsList: {
    author: string;
    event: string;
    date?: string;
    rating: number;
    text: string;
    reply?: {
      author: string;
      text: string;
    };
  }[];
}

export interface Occasion {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  image: string;
  eventCount: string;
}

export const OCCASIONS: Occasion[] = [
  {
    id: "weddings",
    title: "Weddings & Receptions",
    slug: "weddings",
    subtitle: "Mandaps, bridal makeup, Cinematic drone 4K",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    eventCount: "12,400+ events",
  },
  {
    id: "birthdays",
    title: "Birthdays & Anniversaries",
    slug: "birthdays",
    subtitle: "Sweet16, 30th & 50th banquets, live DJs",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop",
    eventCount: "8,900+ events",
  },
  {
    id: "babyshowers",
    title: "Baby Showers & Reveals",
    slug: "babyshowers",
    subtitle: "Boutique pastry towers, mocktail mixologists",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
    eventCount: "4,300+ events",
  },
  {
    id: "graduations",
    title: "Graduations & Honors",
    slug: "graduations",
    subtitle: "Live DJ rigs, custom photo booths, barbecue",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=800&auto=format&fit=crop",
    eventCount: "3,100+ events",
  },
  {
    id: "quinceaneras",
    title: "Quinceañeras & Cotillions",
    slug: "quinceaneras",
    subtitle: "Choreographers, court staging, grand cakes",
    image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop",
    eventCount: "5,600+ events",
  },
  {
    id: "corporate",
    title: "Corporate Events & Galas",
    slug: "corporate",
    subtitle: "AV staging, VIP hospitality, award statuettes",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop",
    eventCount: "6,800+ events",
  },
  {
    id: "theater",
    title: "Theater & Stage Shows",
    slug: "theater",
    subtitle: "Sound engineers, folk troupes, stage managers",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop",
    eventCount: "2,400+ events",
  },
  {
    id: "holiday",
    title: "Holiday Parties & Galas",
    slug: "holiday",
    subtitle: "Interactive mixology, live jazz trios, décor",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
    eventCount: "7,100+ events",
  },
];

export const VENDORS: Vendor[] = [
  {
    id: "golden-hour-photo",
    name: "Golden Hour Photography",
    category: "cinematography",
    categoryLabel: "Cinematography & Photo",
    title: "Candid wedding and event photography with a documentary feel and heartfelt natural framing.",
    location: "Austin, TX • 12 mi radius",
    city: "Austin",
    state: "TX",
    distance: "12 mi radius",
    rating: 4.9,
    reviewCount: 212,
    startingPrice: 950,
    guildTier: "Pro",
    guildTierLabel: "Pro Vendor",
    badgePercent: "Top 5%",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600&auto=format&fit=crop",
    ],
    tags: ["Candid", "Drone 4K", "Same-Day Teaser", "35mm Film"],
    bio: "I believe milestone celebrations are living, breathing heirlooms—not static photoshoots. Over the past 8+ years across Texas Hill Country, Santa Fe, and Oaxaca, my documentary approach focuses on the unscripted pauses: the tearful quiet exchange with an elder before the grand entrance, the unrestrained laughter during champagne toasts, and the wild, euphoric kinetic motion of the dance floor. Our studio operates under uncompromising technical standards. We deploy dual-camera redundant setups with dual memory-card writing in real-time, an encrypted off-site cloud sync within 4 hours post-event, and dedicated second shooters who specialize in low-light ambient reception documentation.",
    responseSpeed: "~1 Hour",
    onTimeDelivery: "98%",
    repeatClients: "42%",
    ordersCompleted: 184,
    packages: [
      {
        id: "pkg-1",
        title: "Golden Hour Wedding Storytelling",
        description: "Full documentary coverage of ceremony, bride & groom golden hour creative session, toasts, and early reception...",
        price: 1450,
        hours: "6 Hours Coverage",
        photosCount: "450+ Hand-Edited Photos",
        turnaround: "48-hr Sneak Peek",
        escrowSplit: "3 Escrow Milestones (30/50/20)",
        isPopular: true,
        features: ["Dual Camera Redundancy", "Online Cloud Gallery for 10 Years", "Full Print Release Rights", "Direct Escrow Protection"],
      },
      {
        id: "pkg-2",
        title: "Intimate Elopement & Micro-Wedding",
        description: "Crafted specifically for elopements and micro-gatherings under 35 guests. Focuses heavily on candid family moments.",
        price: 750,
        hours: "3 Hours Coverage",
        photosCount: "200+ Hand-Edited Photos",
        turnaround: "48-hr Sneak Peek",
        escrowSplit: "2 Escrow Milestones (50/50)",
        features: ["Single Master Photographer", "Private Online Portal", "Full Resolution Downloads"],
      },
      {
        id: "pkg-3",
        title: "Editorial Engagement & Couples Session",
        description: "A relaxed, 2-hour multi-location session capturing authentic chemistry and style. Ideal for wedding invitations and save-the-dates.",
        price: 450,
        hours: "2 Hours Coverage",
        photosCount: "75+ High-Res Images",
        turnaround: "Full release on final delivery",
        escrowSplit: "Full release on final delivery",
        features: ["2 Outfit Changes", "Styled Direction", "Same-Week Delivery"],
      },
    ],
    reviewsList: [
      {
        author: "Elena & Rafael Vega",
        event: "Wedding in Dripping Springs, TX • October 2024",
        rating: 5,
        text: "Maya is simply extraordinary. Neither my husband nor I feel comfortable posing in front of a lens, but she faded seamlessly into the background and caught the most genuine tears and smiles. The 48-hour sneak peek had 30 gorgeous images that we immediately shared with family abroad. Releasing the final milestone funds in Ophir Reserve was smooth and totally stress-free.",
        reply: {
          author: "Maya Torres",
          text: "Thank you so much Elena! Rafael dancing with his abuela was one of my favorite photos of the year. Wishing you both a lifetime of bliss!",
        },
      },
      {
        author: "Diana & Mateo Lin",
        event: "Quinceañera Celebration in Austin, TX • September 2024",
        rating: 5,
        text: "She arrived 30 minutes early, scouted the church courtyard lighting, and handled a boisterous court of 14 teenagers with calm warmth and authority. The colors of Sofia's emerald dress popped without looking artificial. Highly recommend booking Maya!",
      },
      {
        author: "Samir & Priya Kapoor",
        event: "Engagement & Haldi in Round Rock, TX • August 2024",
        rating: 5,
        text: "Capturing turmeric throwing and water splashes requires fast instincts and equipment protection, and Maya navigated our Haldi ceremony like a seasoned professional. The analog 35mm prints she mailed us afterwards were a lovely surprise.",
      },
    ],
  },
  {
    id: "velvet-bloom",
    name: "Velvet & Bloom Floral Design",
    category: "floral",
    categoryLabel: "Floral & Stage Scenography",
    title: "Architectural mandaps, hanging florals, and sculptural botanicals for lavish high-capacity celebrations.",
    location: "Chicago, IL • Midwest Travel",
    city: "Chicago",
    state: "IL",
    distance: "Midwest Travel",
    rating: 4.95,
    reviewCount: 184,
    startingPrice: 1800,
    guildTier: "Elite",
    guildTierLabel: "Elite Vendor",
    badgePercent: "Top 2%",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?q=80&w=600&auto=format&fit=crop",
    ],
    tags: ["Mandap Sculpting", "Hanging Canopies", "Exotic Florals", "Sustainable"],
    bio: "Specializing in grand architectural florals for cultural weddings, bespoke galas, and ballroom transformations.",
    responseSpeed: "~30 Mins",
    onTimeDelivery: "100%",
    repeatClients: "56%",
    ordersCompleted: 240,
    packages: [
      {
        id: "vb-1",
        title: "Grand Mandap & Aisle Scenography",
        description: "Full floral mandap arch, 12 luxury aisle pedestals, and entrance cascading installations.",
        price: 2800,
        hours: "Full Day Installation",
        turnaround: "Day-of Completion",
        escrowSplit: "3 Milestones (40/40/20)",
        isPopular: true,
        features: ["Live flower preservation", "Teardown service included", "On-site floral artisan team"],
      },
    ],
    reviewsList: [],
  },
  {
    id: "groove-collective",
    name: "The Groove Collective",
    category: "music",
    categoryLabel: "Live Music & Symphony",
    title: "Live 6–Piece Motown, Pop Brass & Jazz Collective to elevate luxury cocktail hours and energetic receptions.",
    location: "New York, NY • Tri-State Area",
    city: "New York",
    state: "NY",
    distance: "Tri-State Area",
    rating: 5.0,
    reviewCount: 210,
    startingPrice: 3200,
    guildTier: "Elite",
    guildTierLabel: "Elite Vendor",
    badgePercent: "Top 1%",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=600&auto=format&fit=crop",
    ],
    tags: ["Live Brass Section", "Custom Setlists", "MC Included", "Wireless Audio"],
    bio: "Juilliard-trained musicians and electrifying brass arrangements tailored for high-energy celebrations.",
    responseSpeed: "~15 Mins",
    onTimeDelivery: "100%",
    repeatClients: "68%",
    ordersCompleted: 310,
    packages: [],
    reviewsList: [],
  },
  {
    id: "heritage-culinary",
    name: "Heritage Culinary Artisans",
    category: "catering",
    categoryLabel: "Artisanal & Heritage Catering",
    title: "Farm-to-table multi-course plated banquets, royal grazing tables, and sommelier beverage pairings.",
    location: "Los Angeles, CA • Statewide",
    city: "Los Angeles",
    state: "CA",
    distance: "Statewide",
    rating: 4.92,
    reviewCount: 64,
    startingPrice: 1650,
    guildTier: "Pro",
    guildTierLabel: "Pro Vendor",
    badgePercent: "Top 2%",
    avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=300&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600&auto=format&fit=crop",
    ],
    tags: ["Bespoke Menus", "Farm-to-Table", "Cocktail Pairing", "Halal & Kosher"],
    bio: "Michelin-experienced chefs curating multi-generational culinary journeys for banquets and celebrations.",
    responseSpeed: "~2 Hours",
    onTimeDelivery: "99%",
    repeatClients: "48%",
    ordersCompleted: 110,
    packages: [],
    reviewsList: [],
  },
  {
    id: "lumina-cinema",
    name: "Lumina Cinema Studios",
    category: "cinematography",
    categoryLabel: "Fine-Art Cinematography",
    title: "Cinematic 4K drone cinematography and romantic storytelling with bespoke color-graded feature films.",
    location: "Austin, TX • Destination Travel",
    city: "Austin",
    state: "TX",
    distance: "Destination Travel",
    rating: 4.98,
    reviewCount: 167,
    startingPrice: 2450,
    guildTier: "Elite",
    guildTierLabel: "Elite Vendor",
    badgePercent: "Top 2%",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
    ],
    tags: ["4K Anamorphic", "Licensed Drone", "Same-Day Edit", "Full Raw Audio"],
    bio: "Crafting timeless visual heirlooms with cinema-grade lighting and sound recording.",
    responseSpeed: "~45 Mins",
    onTimeDelivery: "100%",
    repeatClients: "51%",
    ordersCompleted: 180,
    packages: [],
    reviewsList: [],
  },
  {
    id: "saffron-silk-henna",
    name: "Saffron & Silk Henna Studio",
    category: "floral",
    categoryLabel: "Bridal Henna & Body Art",
    title: "Intricate organic bridal mehndi and celebratory guest stations crafted with 100% natural essential oils.",
    location: "Dallas, TX • DFW Metro",
    city: "Dallas",
    state: "TX",
    distance: "DFW Metro",
    rating: 5.0,
    reviewCount: 243,
    startingPrice: 920,
    guildTier: "Elite",
    guildTierLabel: "Elite Vendor",
    badgePercent: "Top 2%",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop",
    ],
    tags: ["Bridal Mehndi", "Organic Henna", "Guest Lounge Station", "Custom Motifs"],
    bio: "Master henna artist with 12+ years expertise in Mughal, Arabic, and contemporary Indo-fusion bridal art.",
    responseSpeed: "~20 Mins",
    onTimeDelivery: "100%",
    repeatClients: "60%",
    ordersCompleted: 290,
    packages: [],
    reviewsList: [],
  },
  {
    id: "dj-kabir-soundmesh",
    name: "DJ Kabir Soundmesh",
    category: "music",
    categoryLabel: "Live DJ & Dhol Symphony",
    title: "High-energy Bollywood, Afrobeats, and Top-40 party mixing with seamless transitions and live dhol players.",
    location: "Houston, TX • 45 mi radius",
    city: "Houston",
    state: "TX",
    distance: "45 mi radius",
    rating: 4.89,
    reviewCount: 98,
    startingPrice: 1200,
    guildTier: "Rising",
    guildTierLabel: "Rising Vendor",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop",
    ],
    tags: ["Bollywood / Top 40", "Dhol Collaborations", "Wireless Mics", "Custom Mixes"],
    bio: "Electrifying dance floors across North America with seamless bilingual MCing and infectious rhythm.",
    responseSpeed: "~1 Hour",
    onTimeDelivery: "97%",
    repeatClients: "38%",
    ordersCompleted: 140,
    packages: [],
    reviewsList: [],
  },
  {
    id: "sugar-petal-cake",
    name: "Sugar & Petal Cake Architecture",
    category: "dessert",
    categoryLabel: "Bespoke Patisserie & Cakes",
    title: "Custom 4-tier sugar flower cakes and luxury dessert bars crafted with organic gourmet ingredients.",
    location: "Miami, FL • South Florida",
    city: "Miami",
    state: "FL",
    distance: "South Florida",
    rating: 4.97,
    reviewCount: 112,
    startingPrice: 850,
    guildTier: "Rising",
    guildTierLabel: "Rising Vendor",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1200&auto=format&fit=crop",
    galleryImages: [
      "https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=600&auto=format&fit=crop",
    ],
    tags: ["Sugar Florals", "Gold Leaf Foil", "Tasting Box", "Vegan Options"],
    bio: "Fine-art confectionery sculpted to match your floral palettes and event aesthetic.",
    responseSpeed: "~2 Hours",
    onTimeDelivery: "100%",
    repeatClients: "44%",
    ordersCompleted: 165,
    packages: [],
    reviewsList: [],
  },
];

export const FAQS = [
  {
    q: "How does the Ophir Reserve Escrow Vault protect my money?",
    a: "When you book a vendor on Ophir Reserve, 100% of your deposit and service fee is placed into a segregated, FDIC-insured depository escrow vault. The funds are strictly locked and never released to the vendor upfront. You release payments in structured milestones (e.g., retainer, day-of arrival, and final media delivery) only after you inspect and sign off on completed deliverables.",
  },
  {
    q: "What is the 5% platform fee, and who pays it?",
    a: "Ophir Reserve charges a simple, transparent flat 5% platform fee to clients at checkout to power our FDIC-insured escrow infrastructure, 24/7 concierge support, and dispute mediation protection. Artisans and vendors keep 100% of their invoiced rates with zero hidden lead charges or commissions.",
  },
  {
    q: "How does the Family Account collaborative planning work?",
    a: "Our Collaborative Family Hub lets you invite spouses, parents, and party planners into a shared workspace. Everyone can review shortlisted vendors, watch video portfolios, leave comments, vote with thumbs-up/down, and pledge individual contributions directly into the escrow pool with separate receipts.",
  },
  {
    q: "How are vendors vetted before being listed on Ophir Reserve?",
    a: "Every artisan undergoes a rigorous 4-step council verification: government ID verification, business entity & insurance check, multi-camera raw portfolio audit, and authentic reference checks with past milestone clients. Only the top verified practitioners receive guild badges.",
  },
  {
    q: "What happens if a vendor cancels or fails to deliver?",
    a: "Because your funds remain locked in the Utsob Escrow Vault, your money is completely safe. In the rare event of a cancellation, our 24/7 concierge instantly activates emergency contingency backup artisans from our Pro/Elite network, or issues an immediate 100% refund backed by our Independent Mediation Council guarantee.",
  },
];
