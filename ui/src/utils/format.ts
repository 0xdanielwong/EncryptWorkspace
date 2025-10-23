export function formatTimestamp(timestamp: number): string {
  if (!timestamp) {
    return '';
  }

  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}
