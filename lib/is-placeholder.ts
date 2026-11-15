export function isPlaceholderValue(value: string | null | undefined): boolean {
  if (!value) return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (/\{\{.*\}\}/.test(trimmed)) return true;
  if (/^TODO\b/i.test(trimmed)) return true;
  return false;
}
