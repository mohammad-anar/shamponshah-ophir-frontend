"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  Filter, 
  Users2, 
  BookOpen,
  Crown,
  Lock,
  ChevronRight
} from "lucide-react";

interface TraditionItem {
  id: string;
  category: "west-african" | "south-asian" | "byzantine-heritage" | "east-asian";
  categoryLabel: string;
  title: string;
  subcategories: string[];
  description: string;
  ceremonialHighlights: string[];
  image: string;
  artisanCount: number;
  startingPrice: number;
  etiquetteNote: string;
}

const TRADITIONS: TraditionItem[] = [
  {
    id: "igbo-intro",
    category: "west-african",
    categoryLabel: "West African Traditions",
    title: "Igbo Traditional Introduction (Igba Nkwu)",
    subcategories: ["Palm Wine Ritual", "Akwete & George Attire", "Live Highlife Ensemble"],
    description: "The sacred traditional wine-carrying ceremony where the bride formally identifies her groom before the elders and community, accompanied by authentic percussion and bespoke heritage regalia.",
    ceremonialHighlights: [
      "Custom calabash & palm wine ceremonial staging",
      "Traditional bridal entrance choreography & maiden escort",
      "Elders' blessing protocol and custom dowry exchange documentation"
    ],
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
    artisanCount: 28,
    startingPrice: 3800,
    etiquetteNote: "Artisans observe authentic regional dialect blessings and customary palm wine pouring protocols."
  },
  {
    id: "yoruba-engagement",
    category: "west-african",
    categoryLabel: "West African Traditions",
    title: "Yoruba Engagement & Alaga Ceremonies",
    subcategories: ["Alaga Ijoko / Iduro", "Aso-Oke Master Weaving", "Bata Drum Ensemble"],
    description: "A vibrant, protocol-rich matrimonial negotiation led by traditional Alagas, featuring ceremonial prostrations, letter exchanges, and bespoke hand-woven Aso-Oke attire.",
    ceremonialHighlights: [
      "Vetted traditional Alaga Ijoko & Alaga Iduro pairing",
      "Authentic Yoruba talking drum praise chants",
      "Handcrafted Eru Iyawo presentation boxes with luxury calligraphed proposal letters"
    ],
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200",
    artisanCount: 34,
    startingPrice: 4200,
    etiquetteNote: "Includes complete rehearsal protocol for both families to ensure seamless ceremonial pacing."
  },
  {
    id: "hindu-nuptials",
    category: "south-asian",
    categoryLabel: "South Asian Legacies",
    title: "Hindu Nuptials & Sacred Mandap Architecture",
    subcategories: ["Mandap Floral Sculpting", "Agni Kund Safety", "Vedic Chanting Collective"],
    description: "Multi-day Vedic celebrations centered around the sacred fire (Agni), featuring structural architectural mandaps, marigold & lotus floral cascades, and classical shehnai accompaniment.",
    ceremonialHighlights: [
      "Structural engineering certified mandap frames with fire-resistant drapery",
      "Pre-ceremony Haldi and Mehendi sensory lounge design",
      "Curated 4-hour Saptapadi and Kanyadaan ceremonial timeline management"
    ],
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200",
    artisanCount: 62,
    startingPrice: 5500,
    etiquetteNote: "All mandap setups are certified for indoor smoke clearance and venue insurance adherence."
  },
  {
    id: "sikh-anand-karaj",
    category: "south-asian",
    categoryLabel: "South Asian Legacies",
    title: "Sikh Anand Karaj & Gurdwara Ceremonial Staging",
    subcategories: ["Gurdwara Floral Architecture", "Classical Kirtani Jatha", "Royal Palla Crafting"],
    description: "The sacred 'Blissful Union' centered around Sri Guru Granth Sahib Ji, accompanied by classical acoustic Raag kirtan, respectful head-covering styling, and community Langar dining logistics.",
    ceremonialHighlights: [
      "Traditional Rumalla Sahib presentation sets crafted with antique gold zari",
      "Classical Tanti Saaj (string instruments) Kirtani collectives",
      "Seamless seating arrangements respecting customary Gurdwara decorum"
    ],
    image: "https://images.unsplash.com/photo-1609154767011-34152945781a?auto=format&fit=crop&q=80&w=1200",
    artisanCount: 24,
    startingPrice: 4900,
    etiquetteNote: "Strict adherence to Maryada protocols with full shoes-off transition lounge hospitality."
  },
  {
    id: "byzantine-heritage",
    category: "byzantine-heritage",
    categoryLabel: "Byzantine & Classical Crafts",
    title: "Byzantine Liturgical Restoration & Choral Staging",
    subcategories: ["Gold-Leaf Iconography", "A Cappella Byzantine Choir", "Orthodox Crown Ceremony"],
    description: "Sacred crowning (Stefana) rituals and classical Mediterranean feasts rendered with authentic Byzantine mosaic motifs, candle-lit choral antiphons, and heritage floral crowns.",
    ceremonialHighlights: [
      "Hand-hammered sterling silver or gold-gilt Stefana crowns with ribbon ties",
      "Octoechos modal chant ensembles in classical Greek and Old Church Slavonic",
      "Heirloom olive wood icon pedestals and hand-dipped beeswax taper candles"
    ],
    image: "https://images.unsplash.com/photo-1548625361-195fe57871b0?auto=format&fit=crop&q=80&w=1200",
    artisanCount: 19,
    startingPrice: 4500,
    etiquetteNote: "Artisans collaborate directly with parish clergy to observe all sacramental guidelines."
  },
  {
    id: "haute-couture-embroidery",
    category: "byzantine-heritage",
    categoryLabel: "Byzantine & Classical Crafts",
    title: "Haute Couture Heritage Embroidery & Regalia",
    subcategories: ["Zardozi Gold Threadwork", "Antique Aari Stitches", "Heirloom Veil Tailoring"],
    description: "Bespoke ceremonial garments hand-stitched by multi-generational guild masters utilizing authentic gold bullion, metallic purl wires, and semiprecious stones.",
    ceremonialHighlights: [
      "Up to 600 hours of artisanal hand-embroidery per bridal garment",
      "Custom monogramming and ancestral crest integration into bridal trains",
      "Escrow milestone releases tied to 3 in-person or virtual fitting inspections"
    ],
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200",
    artisanCount: 31,
    startingPrice: 6200,
    etiquetteNote: "Fabrication progress documented via weekly high-resolution video proof logs in your vault."
  }
];

export default function CulturalTraditionsClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTraditions = selectedCategory === "all" 
    ? TRADITIONS 
    : TRADITIONS.filter((t) => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Hero Section */}
          <div className="border border-border bg-surface p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 blur-3xl pointer-events-none" />
            
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-sunken border border-border text-brand text-xs font-bold uppercase tracking-widest">
                <Crown className="w-3.5 h-3.5" />
                <span>Ophir Heritage Repository</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
                Cultural Traditions &amp; Sacred Ceremonies
              </h1>

              <p className="text-sm sm:text-base text-foreground-muted leading-relaxed">
                Celebrate your ancestry with master artisans vetted for cultural authenticity, ceremonial dignity, and immaculate craftsmanship. All milestone contracts are secured with 100% FDIC-backed escrow.
              </p>

              {/* Guarantees bar */}
              <div className="pt-4 flex flex-wrap gap-4 text-xs text-foreground-secondary">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand" />
                  <span>Verified Cultural Lineage & Guild Tiers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand" />
                  <span>Milestone Escrow Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users2 className="w-4 h-4 text-brand" />
                  <span>Team Collaboration Suite Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory === "all"
                  ? "bg-brand text-black border-brand shadow-gold-glow-sm"
                  : "bg-surface hover:bg-surface-elevated text-foreground-muted hover:text-foreground border-border"
              }`}
            >
              All Traditions ({TRADITIONS.length})
            </button>

            <button
              onClick={() => setSelectedCategory("west-african")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory === "west-african"
                  ? "bg-brand text-black border-brand shadow-gold-glow-sm"
                  : "bg-surface hover:bg-surface-elevated text-foreground-muted hover:text-foreground border-border"
              }`}
            >
              West African Traditions
            </button>

            <button
              onClick={() => setSelectedCategory("south-asian")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory === "south-asian"
                  ? "bg-brand text-black border-brand shadow-gold-glow-sm"
                  : "bg-surface hover:bg-surface-elevated text-foreground-muted hover:text-foreground border-border"
              }`}
            >
              South Asian Legacies
            </button>

            <button
              onClick={() => setSelectedCategory("byzantine-heritage")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory === "byzantine-heritage"
                  ? "bg-brand text-black border-brand shadow-gold-glow-sm"
                  : "bg-surface hover:bg-surface-elevated text-foreground-muted hover:text-foreground border-border"
              }`}
            >
              Byzantine & Classical Crafts
            </button>
          </div>

          {/* Traditions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTraditions.map((tradition) => (
              <div
                key={tradition.id}
                className="bg-surface border border-border flex flex-col justify-between group hover:border-brand/50 transition-all shadow-luxury overflow-hidden"
              >
                <div>
                  {/* Image with overlay badge */}
                  <div className="relative h-60 w-full bg-surface-sunken overflow-hidden">
                    <Image
                      src={tradition.image}
                      alt={tradition.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-black/80 backdrop-blur-xs text-[10px] font-bold text-brand uppercase tracking-wider border border-border-brand/40">
                        {tradition.categoryLabel}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] text-zinc-300 font-mono">
                          {tradition.artisanCount} Verified Guild Artisans
                        </span>
                        <span className="font-mono font-bold text-brand text-sm">
                          From ${tradition.startingPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-brand transition-colors">
                      {tradition.title}
                    </h3>

                    {/* Subcategory Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {tradition.subcategories.map((sub, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[10px] font-semibold bg-surface-sunken border border-border text-foreground-secondary"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-foreground-muted leading-relaxed line-clamp-3">
                      {tradition.description}
                    </p>

                    {/* Ceremonial Highlights */}
                    <div className="pt-2 border-t border-border/60 space-y-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-foreground-muted block">
                        Ceremonial Inclusions:
                      </span>
                      {tradition.ceremonialHighlights.map((hl, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-foreground-secondary">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{hl}</span>
                        </div>
                      ))}
                    </div>

                    {/* Etiquette callout */}
                    <div className="p-3 bg-surface-elevated border border-border text-[10px] text-foreground-muted italic">
                      &ldquo;{tradition.etiquetteNote}&rdquo;
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-6 pt-0 border-t border-border/60 bg-surface flex items-center justify-between gap-3 mt-4">
                  <Link
                    href={`/services?category=${encodeURIComponent(tradition.title)}`}
                    className="flex-1 h-10 px-4 bg-brand hover:bg-brand-hover text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-gold-glow-sm"
                  >
                    <span>Explore Artisans</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/user/collaboration"
                    className="h-10 px-3 bg-surface-elevated hover:bg-surface-sunken border border-border text-foreground-muted hover:text-brand text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-all"
                    title="Shortlist in Collaboration Suite"
                  >
                    <Users2 className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Artisan Collective Callout Banner */}
          <div className="border border-border bg-surface-elevated p-8 sm:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold text-brand uppercase tracking-widest">
                Artisan Guild Application
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Are you a custodian of cultural craftsmanship?
              </h2>
              <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                Ophir Reserve welcomes multi-generational artisans, master embroiderers, classical vocalists, and ceremonial coordinators. Receive direct client proposals, milestone escrow payouts, and 0% commission.
              </p>
            </div>

            <Link
              href="/signup?role=vendor"
              className="h-12 px-6 bg-brand hover:bg-brand-hover text-black text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 flex-shrink-0 transition-all shadow-gold-glow-sm"
            >
              <span>Join Artisan Guild</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
  );
}
