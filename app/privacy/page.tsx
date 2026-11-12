import type { Metadata } from "next";
import { getSiteConfigResult } from "@/lib/config";
import { PrivacyPolicyContent } from "@/components/sections/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Phoenix Valley Plumber",
  description:
    "Privacy Policy for Phoenix Valley Plumber (phoenixvalleyplumber.com), effective November 12, 2026.",
  alternates: { canonical: "/privacy-policy/" },
  robots: { index: false, follow: false },
};

export default function PrivacyAliasPage() {
  const { config: site } = getSiteConfigResult();
  return <PrivacyPolicyContent site={site} />;
}

