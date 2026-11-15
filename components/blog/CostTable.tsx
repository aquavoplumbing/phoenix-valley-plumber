import type { CostData } from "@/lib/post-schema";
import styles from "./CostTable.module.css";

interface CostTableProps {
  costData: CostData;
}

export function CostTable({ costData }: CostTableProps) {
  if (!costData || !costData.rows || costData.rows.length === 0) return null;

  // Refuse to render without a source unless scope is "partner"
  if (costData.scope !== "partner" && (!costData.sourceName || !costData.sourceUrl)) {
    return (
      <div className={styles.errorBox} role="alert">
        <strong>Cost Table Unavailable:</strong> External cost data requires a verified source name and URL.
      </div>
    );
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollWrapper}>
        <table className={styles.table}>
          <caption className={styles.caption}>
            Estimated Cost Ranges ({costData.scope === "partner" ? "Partner Rates" : "Typical Regional / National Estimates"})
          </caption>
          <thead>
            <tr>
              <th scope="col" className={styles.th}>Service / Item</th>
              <th scope="col" className={styles.th}>Typical Range</th>
              <th scope="col" className={styles.th}>Unit / Scope</th>
              <th scope="col" className={styles.th}>Details & Exclusions</th>
            </tr>
          </thead>
          <tbody>
            {costData.rows.map((row, idx) => (
              <tr key={idx} className={styles.tr}>
                <td className={`${styles.td} ${styles.itemName}`}>
                  <strong>{row.item}</strong>
                </td>
                <td className={`${styles.td} ${styles.priceCell}`}>
                  {formatPrice(row.low)} – {formatPrice(row.high)}
                </td>
                <td className={styles.td}>{row.unit}</td>
                <td className={styles.td}>
                  {row.includes && (
                    <div className={styles.includes}>
                      <span className={styles.incTag}>Includes:</span> {row.includes}
                    </div>
                  )}
                  {row.excludes && (
                    <div className={styles.excludes}>
                      <span className={styles.excTag}>Excludes:</span> {row.excludes}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.footerNote}>
        <p className={styles.disclaimer}>{costData.disclaimer}</p>
        {costData.sourceName && costData.sourceUrl && (
          <p className={styles.source}>
            Data Source:{" "}
            <a
              href={costData.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceLink}
            >
              {costData.sourceName} ↗
            </a>{" "}
            (Verified as of {costData.asOf})
          </p>
        )}
      </div>
    </div>
  );
}
