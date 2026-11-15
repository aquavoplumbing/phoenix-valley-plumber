import type { ReactNode } from "react";
import type { SiteConfig } from "@/lib/config";
import type { ClaimFlag } from "@/lib/service-schema";

export function isClaimEnabled(site: SiteConfig, flag: ClaimFlag): boolean {
  switch (flag) {
    case "sameDayService":
      return site.claims.sameDayService;
    case "freeEstimates":
      return site.claims.freeEstimates;
    case "upfrontPricing":
      return site.claims.upfrontPricing;
    case "warranty":
      return Boolean(site.claims.warranty && site.claims.warranty.trim());
    case "yearsInBusiness":
      return typeof site.claims.yearsInBusiness === "number" && site.claims.yearsInBusiness > 0;
    case "seniorMilitaryDiscount":
      return site.claims.seniorMilitaryDiscount;
    case "financing":
      return site.claims.financing;
    case "bondedInsured":
      return site.licensee.bonded || site.licensee.insured;
    case "is24x7":
      return site.hours.is24x7;
  }
}

export function ClaimGate({
  site,
  flag,
  children,
}: {
  site: SiteConfig;
  flag: ClaimFlag;
  children: ReactNode;
}) {
  if (!isClaimEnabled(site, flag)) {
    return null;
  }
  return <>{children}</>;
}

