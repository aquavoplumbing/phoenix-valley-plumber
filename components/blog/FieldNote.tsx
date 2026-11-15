import styles from "./FieldNote.module.css";

interface FieldNoteProps {
  quote: string;
  attributedTo: string;
  context?: string;
}

export function FieldNote({ quote, attributedTo, context }: FieldNoteProps) {
  return (
    <blockquote className={styles.container}>
      <p className={styles.quote}>“{quote}”</p>
      <footer className={styles.footer}>
        <cite className={styles.cite}>— {attributedTo}</cite>
        {context && <span className={styles.context}>{context}</span>}
      </footer>
    </blockquote>
  );
}
