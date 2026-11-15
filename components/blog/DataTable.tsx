import type { ReactNode } from "react";
import styles from "./DataTable.module.css";

interface DataTableProps {
  caption?: string;
  headers?: string[];
  rows?: (string | ReactNode)[][];
}

export function DataTable({ caption, headers = [], rows = [] }: DataTableProps) {
  if (!Array.isArray(headers) || headers.length === 0) return null;
  if (!Array.isArray(rows) || rows.length === 0) return null;

  return (
    <div className={styles.scrollWrapper}>
      <table className={styles.table}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <thead>
          <tr>
            {headers.map((h, idx) => (
              <th key={idx} scope="col" className={styles.th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className={styles.tr}>
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className={styles.td}
                  data-label={headers[cIdx] || ""}
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
