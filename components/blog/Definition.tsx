import styles from "./Definition.module.css";

interface DefinitionProps {
  term: string;
  meaning: string;
}

export function Definition({ term, meaning }: DefinitionProps) {
  return (
    <div className={styles.container}>
      <span className={styles.term}>{term}:</span>
      <span className={styles.meaning}>{meaning}</span>
    </div>
  );
}
