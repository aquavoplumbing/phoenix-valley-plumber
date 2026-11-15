import fs from "node:fs";
import path from "node:path";

interface HeroData {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  bg1: string;
  bg2: string;
}

const heroes: HeroData[] = [
  {
    slug: "water-heater-replacement-cost-hero",
    title: "Water Heater Replacement Cost in Phoenix",
    subtitle: "Tank vs. Tankless Pricing, Valley Labor Rates & Sizing Guide",
    icon: "heater",
    bg1: "#0B2A4A",
    bg2: "#123F6B",
  },
  {
    slug: "water-softener-installation-cost-hero",
    title: "Water Softener Installation Cost in Phoenix",
    subtitle: "System Pricing, Softener Loops & Valley Hardness by Zone",
    icon: "filter",
    bg1: "#0F6A9A",
    bg2: "#1E9BD7",
  },
  {
    slug: "sewer-line-replacement-cost-hero",
    title: "Sewer Line Replacement Cost in Phoenix",
    subtitle: "Trenchless CIPP vs. Open Excavation & Root Damage Pricing",
    icon: "pipe",
    bg1: "#0B2A4A",
    bg2: "#1E9BD7",
  },
  {
    slug: "slab-leak-repair-cost-hero",
    title: "Slab Leak Repair Cost in Phoenix Homes",
    subtitle: "Direct Concrete Dig vs. PEX Reroute & Diagnostic Costs",
    icon: "leak",
    bg1: "#78350F",
    bg2: "#B45309",
  },
  {
    slug: "toilet-installation-cost-hero",
    title: "Toilet Installation & Replacement Cost",
    subtitle: "Standard, Comfort-Height & Dual-Flush Replacement Pricing",
    icon: "toilet",
    bg1: "#0B2A4A",
    bg2: "#0F6A9A",
  },
  {
    slug: "what-is-hard-water-phoenix-hero",
    title: "What Is Hard Water in Phoenix?",
    subtitle: "Municipal Water Quality Data, Scale Science & Valley Homes",
    icon: "droplet",
    bg1: "#0F6A9A",
    bg2: "#1479AE",
  },
  {
    slug: "why-does-my-toilet-keep-running-hero",
    title: "Why Does My Toilet Keep Running?",
    subtitle: "Flapper Leaks, Fill Valve Sticking & Water Waste Fixes",
    icon: "toilet",
    bg1: "#123F6B",
    bg2: "#1E9BD7",
  },
  {
    slug: "how-to-flush-a-water-heater-hero",
    title: "How to Flush & Drain a Water Heater in Phoenix",
    subtitle: "Removing Hard Calcium Sediment & Restoring Tank Efficiency",
    icon: "flame",
    bg1: "#0B2A4A",
    bg2: "#FF7A1A",
  },
  {
    slug: "signs-of-a-slab-leak-hero",
    title: "Signs of a Slab Leak in Arizona Homes",
    subtitle: "Warm Floor Spots, Foundation Cracks & Hidden Water Loss",
    icon: "leak",
    bg1: "#92400E",
    bg2: "#0B2A4A",
  },
  {
    slug: "how-to-shut-off-main-water-valve-hero",
    title: "How to Shut Off Your Main Water Valve",
    subtitle: "Locating Emergency Valves & Curb Meters in Phoenix Homes",
    icon: "siren",
    bg1: "#881337",
    bg2: "#BE123C",
  },
  {
    slug: "trenchless-vs-traditional-sewer-hero",
    title: "Trenchless vs. Traditional Sewer Repair",
    subtitle: "CIPP Epoxy Lining vs. Yard Trenching in Desert Caliche",
    icon: "pipe",
    bg1: "#0B2A4A",
    bg2: "#1FA971",
  },
];

function generateSvg(w: number, h: number, hData: HeroData): string {
  const titleSize = Math.round(w * 0.04);
  const subSize = Math.max(14, Math.round(w * 0.021));
  const cx1 = Math.round(w * 0.85);
  const cy1 = Math.round(h * 0.25);
  const r1 = Math.round(w * 0.22);
  const cx2 = Math.round(w * 0.15);
  const cy2 = Math.round(h * 0.85);
  const r2 = Math.round(w * 0.28);
  const yMid = Math.round(h * 0.48);
  const ySub = Math.round(h * 0.58);
  const yBtn = Math.round(h * 0.7);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${w}" y2="${h}" gradientUnits="userSpaceOnUse">
      <stop stop-color="${hData.bg1}"/>
      <stop offset="1" stop-color="${hData.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <circle cx="${cx1}" cy="${cy1}" r="${r1}" fill="#FFFFFF" fill-opacity="0.05"/>
  <circle cx="${cx2}" cy="${cy2}" r="${r2}" fill="#1E9BD7" fill-opacity="0.12"/>
  <rect x="48" y="48" width="180" height="32" rx="16" fill="#FFFFFF" fill-opacity="0.15"/>
  <text x="138" y="69" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#FAF6EF" text-anchor="middle" letter-spacing="1">PHOENIX VALLEY PLUMBER</text>
  <text x="${w / 2}" y="${yMid}" font-family="system-ui, -apple-system, sans-serif" font-size="${titleSize}" font-weight="800" fill="#FFFFFF" text-anchor="middle">${hData.title}</text>
  <text x="${w / 2}" y="${ySub}" font-family="system-ui, -apple-system, sans-serif" font-size="${subSize}" font-weight="500" fill="#E6F4FB" text-anchor="middle">${hData.subtitle}</text>
  <rect x="${w / 2 - 80}" y="${yBtn}" width="160" height="36" rx="18" fill="#FF7A1A"/>
  <text x="${w / 2}" y="${yBtn + 23}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#0B2A4A" text-anchor="middle">Expert Guide</text>
</svg>`;
}

const outDir = path.join(process.cwd(), "public", "img", "blog");
for (const h of heroes) {
  const svg16x9 = generateSvg(1280, 720, h);
  fs.writeFileSync(path.join(outDir, `${h.slug}.svg`), svg16x9);
  fs.writeFileSync(path.join(outDir, `${h.slug}-16x9.svg`), svg16x9);
  fs.writeFileSync(path.join(outDir, `${h.slug}-4x3.svg`), generateSvg(960, 720, h));
  fs.writeFileSync(path.join(outDir, `${h.slug}-1x1.svg`), generateSvg(720, 720, h));
}
console.log(`Generated hero image sets (16:9, 4:3, 1:1) for ${heroes.length} posts.`);
