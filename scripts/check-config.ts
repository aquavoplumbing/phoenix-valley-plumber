import { validateSiteConfig } from "../lib/config";

try {
  validateSiteConfig({ strict: true });
  console.log("✓ data/site.json passed strict production validation.");
  process.exit(0);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
