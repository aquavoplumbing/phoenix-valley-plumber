import servicesData from "@/data/services.json";
import citiesData from "@/data/cities.json";
import faqsData from "@/data/faqs.json";
import reviewsData from "@/data/reviews.json";
import navData from "@/data/nav.json";
import type { SiteConfig } from "./config";

export type ServiceIconName =
  | "siren"
  | "flame"
  | "heater"
  | "bolt"
  | "drain"
  | "jet"
  | "pipe"
  | "camera"
  | "droplet"
  | "wrench"
  | "toilet"
  | "filter"
  | "shield";

export interface ServiceItem {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: ServiceIconName;
  category: "service" | "hub" | "cost-guide" | "guide" | "info" | "legal";
  featured: boolean;
  order: number;
  priceRange: string | null;
}

export interface CityItem {
  name: string;
  slug: string;
  region: string;
  mapX: number;
  mapY: number;
  labelPos: "top" | "bottom" | "left" | "right";
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ReviewItem {
  id?: string;
  author: string;
  city?: string;
  date: string;
  rating: number;
  text: string;
  sourceUrl?: string;
  source?: string;
}

export interface NavLinkItem {
  label: string;
  href: string;
  badge?: string;
}

export interface ServiceHubMenu {
  id: string;
  label: string;
  hubHref: string;
  hubLabel: string;
  description: string;
  items: NavLinkItem[];
}

export interface NavData {
  coreServiceLinks: NavLinkItem[];
  serviceHubs: ServiceHubMenu[];
  topCityServiceSlugs: Array<{ slug: string; label: string }>;
  costGuides: NavLinkItem[];
  companyLinks: NavLinkItem[];
  legalLinks: NavLinkItem[];
}

export function getServices(): ServiceItem[] {
  return [...(servicesData as ServiceItem[])].sort((a, b) => a.order - b.order);
}

export function getFeaturedServices(): ServiceItem[] {
  return getServices().filter((s) => s.featured && s.category === "service");
}

export function getCostGuides(): ServiceItem[] {
  return getServices().filter((s) => s.category === "cost-guide");
}

export function getFeaturedCostGuides(): ServiceItem[] {
  return getCostGuides().filter((s) => s.featured);
}

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return getServices().find((s) => s.slug === slug);
}

export function getCities(): CityItem[] {
  return citiesData as CityItem[];
}

export function getCityBySlug(slug: string): CityItem | undefined {
  return getCities().find((c) => c.slug === slug);
}

export function getFaqs(): FaqItem[] {
  return faqsData as FaqItem[];
}

export function getReviews(): ReviewItem[] {
  return reviewsData as ReviewItem[];
}

export function getNav(): NavData {
  return navData as NavData;
}

export function getSiteUrl(site?: SiteConfig): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }
  if (site?.domain) {
    return `https://${site.domain.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
  }
  return "https://phoenixvalleyplumber.com";
}
