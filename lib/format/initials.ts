export function initialsFromName(name: string): string {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0];
  const last = parts[1];
  if (!first) {
    return "";
  }
  const firstMark = Array.from(first)[0];
  if (!last) {
    return Array.from(first).slice(0, 2).join("").toUpperCase();
  }
  const lastMark = Array.from(last)[0];
  if (!firstMark || !lastMark) {
    return "";
  }
  return `${firstMark}${lastMark}`.toUpperCase();
}
