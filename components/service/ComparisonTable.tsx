import type { ServiceContent } from "@/lib/service-schema";
import styles from "./ComparisonTable.module.css";

export function ComparisonTable({
  comparison,
}: {
  comparison: NonNullable<ServiceContent["comparison"]>;
}) {
  return (
    <div className={styles.wrap}>
      <h3 className={styles.title}>{comparison.title}</h3>
      <table className={styles.table}>
        <caption className={styles.caption}>{comparison.caption}</caption>
        <thead className={styles.thead}>
          <tr>
            <th scope="col" className={styles.th}>
              Factor
            </th>
            {comparison.columns.map((col) => (
              <th key={col} scope="col" className={styles.th}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {comparison.rows.map((row) => (
            <tr key={row.label} className={styles.row}>
              <th scope="row" className={styles.rowHeader}>
                {row.label}
              </th>
              {row.cells.map((cell, idx) => (
                <td
                  key={`${row.label}-${idx}`}
                  data-label={comparison.columns[idx] ?? ""}
                  className={styles.cell}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

