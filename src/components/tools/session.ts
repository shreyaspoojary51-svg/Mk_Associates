/** Browser-session values are untrusted and bounded before JSON parsing. */
const MAX_BYTES = 16 * 1024;
export function boundedText(raw: string | null | undefined): raw is string {
  return (
    typeof raw === "string" &&
    raw.length <= MAX_BYTES &&
    new TextEncoder().encode(raw).byteLength <= MAX_BYTES
  );
}
export function readSessionJSON(key: string): unknown {
  try {
    const raw = sessionStorage.getItem(key);
    return boundedText(raw) ? (JSON.parse(raw) as unknown) : undefined;
  } catch {
    return undefined;
  }
}
