import type { Metadata } from "next";
import { getSiteConfigResult } from "@/lib/config";
import { PrivacyPolicyContent } from "@/components/sections/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Phoenix Valley Plumber",
  description:
    "Privacy Policy for Phoenix Valley Plumber (phoenixvalleyplumber.com), outlining data collection, call routing, and homeowner privacy protections.",
  alternates: { canonical: "/privacy-policy/" },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  const { config: site } = getSiteConfigResult();
  return <PrivacyPolicyContent site={site} />;
}

